import { NextResponse } from "next/server";
import { sendMail, buildEmailTemplate } from "@/lib/mailer";
import { getCurrentSession } from "@/lib/auth-session";

export async function GET() {
  try {
    const session = await getCurrentSession();
    if (!session || session.user.roleCode !== "admin")
      return NextResponse.json({ success: false, message: "Accès refusé." }, { status: 403 });

    const content = `
      <p style="margin:0 0 16px;font-size:0.875rem;color:#334155;">
        Cet email confirme que la configuration SMTP du portail PMA fonctionne correctement.
      </p>
      <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:16px 20px;">
        <p style="margin:0;font-size:0.875rem;font-weight:700;color:#15803d;">✓ Configuration email opérationnelle</p>
        <p style="margin:4px 0 0;font-size:0.78rem;color:#6b7280;">
          Serveur SMTP : ${process.env.SMTP_HOST || "non configuré"}<br/>
          Expéditeur : ${process.env.SMTP_USER || "non configuré"}
        </p>
      </div>
    `;

    const html = buildEmailTemplate({
      logoUrl:         null,
      distributorName: "PMA by LYSMA",
      title:           "Test de configuration email",
      content,
      senderName:      `${session.user.firstName} ${session.user.lastName}`,
    });

    await sendMail({
      to:      session.user.email,
      subject: "✓ Test email PMA — configuration OK",
      html,
    });

    return NextResponse.json({
      success: true,
      message: `Email de test envoyé à ${session.user.email}`,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Échec de l'envoi.",
      error: error instanceof Error ? error.message : "Erreur inconnue",
    }, { status: 500 });
  }
}