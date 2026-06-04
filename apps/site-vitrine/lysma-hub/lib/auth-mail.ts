const getBaseUrl = () =>
  process.env.NEXT_PUBLIC_LYSMA_HUB_URL ??
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3022");

const sendResendEmail = async ({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) => {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    return { sent: false, provider: "none" as const };
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.RESEND_FROM_EMAIL ?? "LYSMA Hub <onboarding@resend.dev>",
      to,
      subject,
      html,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Resend email failed: ${error}`);
  }

  return { sent: true, provider: "resend" as const };
};

export const buildVerifyEmailLink = (token: string) =>
  `${getBaseUrl()}/verify-email?token=${encodeURIComponent(token)}`;

export const buildResetPasswordLink = (token: string) =>
  `${getBaseUrl()}/reset-password?token=${encodeURIComponent(token)}`;

export const sendVerificationEmail = async (email: string, token: string) => {
  const link = buildVerifyEmailLink(token);
  const result = await sendResendEmail({
    to: email,
    subject: "Valider votre compte LYSMA Hub",
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#0f172a">
        <h1>Valider votre compte LYSMA Hub</h1>
        <p>Pour activer votre espace client, cliquez sur le lien ci-dessous.</p>
        <p><a href="${link}" style="display:inline-block;padding:12px 18px;border-radius:12px;background:#1e73d8;color:#fff;text-decoration:none;font-weight:700">Valider mon email</a></p>
        <p>Si vous n'etes pas a l'origine de cette demande, vous pouvez ignorer cet email.</p>
      </div>
    `,
  });

  return { ...result, link };
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const link = buildResetPasswordLink(token);
  const result = await sendResendEmail({
    to: email,
    subject: "Reinitialiser votre mot de passe LYSMA Hub",
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#0f172a">
        <h1>Reinitialiser votre mot de passe</h1>
        <p>Ce lien est valable pendant une duree limitee.</p>
        <p><a href="${link}" style="display:inline-block;padding:12px 18px;border-radius:12px;background:#1e73d8;color:#fff;text-decoration:none;font-weight:700">Choisir un nouveau mot de passe</a></p>
        <p>Si vous n'avez rien demande, vous pouvez ignorer cet email.</p>
      </div>
    `,
  });

  return { ...result, link };
};
