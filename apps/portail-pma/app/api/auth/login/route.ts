import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { createUserSession } from "@/lib/auth-session";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/password";
import { checkLoginRateLimit } from "@/lib/rate-limit";

const MAX_FAILED_ATTEMPTS = 5;
const LOCK_MINUTES        = 15;

function getRedirectByRole(roleCode: string, distributorSlug: string) {
  switch (roleCode) {
    case "admin":       return `/${distributorSlug}/admin`;
    case "cdv":         return `/${distributorSlug}/cdv`;
    case "atc":         return `/${distributorSlug}/atc`;
    case "rdm":         return `/${distributorSlug}/rdm`;
    case "store":
    case "store_staff": return `/${distributorSlug}/store`;
    default:            return `/${distributorSlug}`;
  }
}

async function writeAuthLog(params: {
  distributorId?:  string | null;
  userId?:         string | null;
  eventType:       string;
  success:         boolean;
  emailAttempt?:   string | null;
  ipAddress?:      string | null;
  userAgent?:      string | null;
}) {
  try {
    await prisma.auth_logs.create({
      data: {
        distributor_id: params.distributorId ?? null,
        user_id:        params.userId        ?? null,
        actor_type:     "user",
        event_type:     params.eventType,
        success:        params.success,
        email_attempt:  params.emailAttempt  ?? null,
        ip_address:     params.ipAddress     ?? null,
        user_agent:     params.userAgent     ?? null,
      },
    });
  } catch { /* log silencieux — ne pas bloquer le flow */ }
}

export async function POST(req: Request) {
  const hdrs        = await headers();
  const userAgent   = hdrs.get("user-agent") ?? null;
  const forwardedFor= hdrs.get("x-forwarded-for");
  const ipAddress   = forwardedFor?.split(",")[0]?.trim() ?? hdrs.get("x-real-ip") ?? null;

  try {
    const body     = await req.json();
    const email    = typeof body?.email    === "string" ? body.email.trim().toLowerCase()    : "";
    const password = typeof body?.password === "string" ? body.password : "";

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email et mot de passe requis." },
        { status: 400 }
      );
    }

    // ── Rate limiting par IP + email
    const { allowed } = checkLoginRateLimit(ipAddress ?? "unknown", email);
    if (!allowed) {
      await writeAuthLog({ eventType: "login_rate_limited", success: false, emailAttempt: email, ipAddress, userAgent });
      return NextResponse.json(
        { success: false, message: "Trop de tentatives. Réessayez dans 15 minutes." },
        { status: 429 }
      );
    }

    // ── Recherche utilisateur
    const user = await prisma.users.findFirst({
      where: { email, is_active: true },
      include: {
        roles:        { select: { code: true, label: true } },
        distributors: { select: { id: true, slug: true, name: true } },
      },
    });

    // Message neutre — ne pas révéler si l'email existe ou non
    if (!user || !user.roles || !user.distributors) {
      await writeAuthLog({ eventType: "login_failed", success: false, emailAttempt: email, ipAddress, userAgent });
      return NextResponse.json(
        { success: false, message: "Identifiants invalides." },
        { status: 401 }
      );
    }

    // ── Compte verrouillé
    if (user.locked_until && user.locked_until > new Date()) {
      await writeAuthLog({ distributorId: user.distributor_id, userId: user.id, eventType: "login_locked", success: false, emailAttempt: email, ipAddress, userAgent });
      return NextResponse.json(
        { success: false, message: "Compte temporairement verrouillé. Réessayez plus tard." },
        { status: 423 }
      );
    }

    // ── Vérification mot de passe
    const isValid = await verifyPassword(password, user.password_hash);

    if (!isValid) {
      const nextFailed  = (user.failed_login_attempts ?? 0) + 1;
      const shouldLock  = nextFailed >= MAX_FAILED_ATTEMPTS;

      await prisma.users.update({
        where: { id: user.id },
        data:  {
          failed_login_attempts: nextFailed,
          locked_until: shouldLock ? new Date(Date.now() + LOCK_MINUTES * 60 * 1000) : null,
        },
      });

      await writeAuthLog({ distributorId: user.distributor_id, userId: user.id, eventType: "login_failed", success: false, emailAttempt: email, ipAddress, userAgent });

      return NextResponse.json(
        { success: false, message: "Identifiants invalides." },
        { status: 401 }
      );
    }

    // ── Login réussi — reset tentatives
    await prisma.users.update({
      where: { id: user.id },
      data:  { last_login_at: new Date(), failed_login_attempts: 0, locked_until: null },
    });

    // ── Créer session
    await createUserSession({
      userId:          user.id,
      distributorId:   user.distributor_id,
      distributorSlug: user.distributors.slug,
      roleCode:        user.roles.code,
      userAgent,
      ipAddress,
    });

    await writeAuthLog({ distributorId: user.distributor_id, userId: user.id, eventType: "login_success", success: true, emailAttempt: email, ipAddress, userAgent });

    // ── must_change_password → rediriger vers page changement
    if (user.must_change_password) {
      return NextResponse.json({
        success:  true,
        redirect: `/${user.distributors.slug}/change-password`,
      });
    }

    return NextResponse.json({
      success:  true,
      redirect: getRedirectByRole(user.roles.code, user.distributors.slug),
    });

  } catch (error) {
    console.error("LOGIN_ERROR", error);
    await writeAuthLog({ eventType: "login_error", success: false, ipAddress, userAgent }).catch(() => {});
    return NextResponse.json(
      { success: false, message: "Erreur serveur." },
      { status: 500 }
    );
  }
}