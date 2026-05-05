import { NextRequest, NextResponse } from "next/server";
import { getCurrentSession, revokeAllUserSessions, createUserSession } from "@/lib/auth-session";
import { verifyPassword, hashPassword } from "@/lib/password";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session) return NextResponse.json({ success: false, message: "Non authentifié." }, { status: 401 });

    const body           = await req.json();
    const currentPassword = String(body.currentPassword || "").trim();
    const newPassword     = String(body.newPassword     || "").trim();

    if (!currentPassword || !newPassword)
      return NextResponse.json({ success: false, message: "Tous les champs sont obligatoires." }, { status: 400 });

    if (newPassword.length < 8)
      return NextResponse.json({ success: false, message: "Le nouveau mot de passe doit faire au moins 8 caractères." }, { status: 400 });

    const user = await prisma.users.findFirst({
      where: { id: session.user.id },
      select: { id: true, password_hash: true },
    });

    if (!user) return NextResponse.json({ success: false, message: "Utilisateur introuvable." }, { status: 404 });

    const isValid = await verifyPassword(currentPassword, user.password_hash);
    if (!isValid) return NextResponse.json({ success: false, message: "Mot de passe actuel incorrect." }, { status: 401 });

    const newHash = await hashPassword(newPassword);

    await prisma.users.update({
      where: { id: user.id },
      data:  { password_hash: newHash, must_change_password: false, password_updated_at: new Date() },
    });

    // Révoquer toutes les sessions et recréer une nouvelle propre
    await revokeAllUserSessions(user.id);

    const hdrs      = await headers();
    const userAgent = hdrs.get("user-agent") ?? null;
    const ipAddress = hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;

    await createUserSession({
      userId:          session.user.id,
      distributorId:   session.user.distributorId,
      distributorSlug: session.user.distributorSlug,
      roleCode:        session.user.roleCode,
      userAgent,
      ipAddress,
    });

    await prisma.auth_logs.create({
      data: {
        distributor_id: session.user.distributorId,
        user_id:        session.user.id,
        actor_type:     "user",
        event_type:     "password_changed",
        success:        true,
        ip_address:     ipAddress,
        user_agent:     userAgent,
      },
    }).catch(() => {});

    return NextResponse.json({ success: true, redirect: `/${session.user.distributorSlug}/${session.user.roleCode === "admin" ? "admin" : session.user.roleCode}` });
  } catch {
    return NextResponse.json({ success: false, message: "Erreur serveur." }, { status: 500 });
  }
}