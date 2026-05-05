import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";
import { checkResetRateLimit } from "@/lib/rate-limit";
import { sendMail, buildEmailTemplate } from "@/lib/mailer";
import { createHash, randomBytes } from "crypto";
import { headers } from "next/headers";

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

// POST /api/auth/reset-password — demande de reset ou validation du token
export async function POST(req: NextRequest) {
  const hdrs       = await headers();
  const ipAddress  = hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;

  try {
    const body  = await req.json();
    const action = String(body.action || "request").trim();

    // ── ACTION 1 : demande de reset (envoi email)
    if (action === "request") {
      const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
      if (!email) return NextResponse.json({ success: false, message: "Email obligatoire." }, { status: 400 });

      // Rate limiting
      const { allowed } = checkResetRateLimit(email);
      if (!allowed) return NextResponse.json({ success: false, message: "Trop de demandes. Réessayez dans 15 minutes." }, { status: 429 });

      // Toujours répondre success pour ne pas révéler si l'email existe
      const user = await prisma.users.findFirst({
        where: { email, is_active: true },
        include: { distributors: { select: { slug: true, name: true } }, roles: { select: { code: true } } },
      });

      if (user) {
        // Invalider les anciens tokens
        await prisma.auth_reset_tokens.updateMany({
          where: { user_id: user.id, is_used: false },
          data:  { is_used: true, used_at: new Date() },
        });

        // Créer un nouveau token
        const token     = randomBytes(32).toString("hex");
        const tokenHash = hashToken(token);
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 heure

        await prisma.auth_reset_tokens.create({
          data: {
            distributor_id: user.distributor_id,
            user_id:        user.id,
            token_hash:     tokenHash,
            reset_type:     "password",
            expires_at:     expiresAt,
            is_used:        false,
          },
        });

        // Construire l'URL de reset
        const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/reset-password?token=${token}`;

        const content = `
          <p style="margin:0 0 16px;font-size:0.875rem;color:#334155;">
            Vous avez demandé la réinitialisation de votre mot de passe pour le portail PMA.
          </p>
          <div style="text-align:center;margin:24px 0;">
            <a href="${resetUrl}" style="display:inline-block;padding:0.875rem 2rem;border-radius:0.875rem;background:linear-gradient(135deg,#0a4d9b,#1e73d8);color:#fff;font-weight:700;font-size:0.9rem;text-decoration:none;box-shadow:0 8px 20px rgba(30,115,216,0.25);">
              Réinitialiser mon mot de passe
            </a>
          </div>
          <p style="margin:16px 0 0;font-size:0.78rem;color:#94a3b8;">
            Ce lien expire dans 1 heure. Si vous n'avez pas fait cette demande, ignorez cet email.
          </p>
        `;

        const html = buildEmailTemplate({
          logoUrl:         null,
          distributorName: user.distributors.name,
          title:           "Réinitialisation de mot de passe",
          content,
        });

        await sendMail({
          to:      user.email,
          subject: "Réinitialisation de votre mot de passe — PMA",
          html,
        }).catch(console.error);

        await prisma.auth_logs.create({
          data: { distributor_id: user.distributor_id, user_id: user.id, actor_type: "user", event_type: "password_reset_requested", success: true, ip_address: ipAddress },
        }).catch(() => {});
      }

      // Toujours répondre pareil — ne pas révéler si l'email existe
      return NextResponse.json({ success: true, message: "Si cet email existe, un lien de réinitialisation vous a été envoyé." });
    }

    // ── ACTION 2 : validation du token + nouveau mot de passe
    if (action === "reset") {
      const token       = typeof body.token       === "string" ? body.token.trim()       : "";
      const newPassword = typeof body.newPassword === "string" ? body.newPassword.trim() : "";

      if (!token || !newPassword) return NextResponse.json({ success: false, message: "Token et mot de passe obligatoires." }, { status: 400 });
      if (newPassword.length < 8) return NextResponse.json({ success: false, message: "Le mot de passe doit faire au moins 8 caractères." }, { status: 400 });

      const tokenHash = hashToken(token);

      const resetToken = await prisma.auth_reset_tokens.findFirst({
        where: { token_hash: tokenHash, is_used: false, expires_at: { gt: new Date() }, reset_type: "password" },
        include: { users: { select: { id: true, distributor_id: true, distributors: { select: { slug: true } }, roles: { select: { code: true } } } } },
      });

      if (!resetToken || !resetToken.users) {
        return NextResponse.json({ success: false, message: "Lien invalide ou expiré." }, { status: 400 });
      }

      const user     = resetToken.users;
      const newHash  = await hashPassword(newPassword);

      await prisma.$transaction([
        prisma.users.update({
          where: { id: user.id },
          data:  { password_hash: newHash, must_change_password: false, password_updated_at: new Date(), failed_login_attempts: 0, locked_until: null },
        }),
        prisma.auth_reset_tokens.update({
          where: { id: resetToken.id },
          data:  { is_used: true, used_at: new Date() },
        }),
        // Révoquer toutes les sessions actives
        prisma.auth_sessions.updateMany({
          where: { user_id: user.id, is_active: true },
          data:  { is_active: false, revoked_at: new Date() },
        }),
      ]);

      await prisma.auth_logs.create({
        data: { distributor_id: user.distributor_id, user_id: user.id, actor_type: "user", event_type: "password_reset_completed", success: true, ip_address: ipAddress },
      }).catch(() => {});

      return NextResponse.json({ success: true, message: "Mot de passe réinitialisé. Vous pouvez vous connecter." });
    }

    return NextResponse.json({ success: false, message: "Action invalide." }, { status: 400 });
  } catch (error) {
    console.error("RESET_PASSWORD_ERROR", error);
    return NextResponse.json({ success: false, message: "Erreur serveur." }, { status: 500 });
  }
}