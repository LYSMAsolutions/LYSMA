import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host:   process.env.SMTP_HOST   || "smtp.gmail.com",
  port:   Number(process.env.SMTP_PORT) || 587,
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export type MailPayload = {
  to:      string | string[];
  subject: string;
  html:    string;
  text?:   string;
};

export async function sendMail(payload: MailPayload) {
  return transporter.sendMail({
    from:    process.env.SMTP_FROM || process.env.SMTP_USER,
    to:      Array.isArray(payload.to) ? payload.to.join(", ") : payload.to,
    subject: payload.subject,
    html:    payload.html,
    text:    payload.text,
  });
}

// Template de base avec logo distributeur
export function buildEmailTemplate({
  logoUrl,
  distributorName,
  title,
  content,
  senderName,
}: {
  logoUrl?:        string | null;
  distributorName: string;
  title:           string;
  content:         string;
  senderName?:     string;
}) {
  return `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>${title}</title></head>
<body style="margin:0;padding:0;background:#f4f7fb;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f7fb;padding:32px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(15,23,42,0.08);">
        
        <!-- Header -->
        <tr><td style="background:linear-gradient(135deg,#0a4d9b,#1e73d8);padding:32px 40px;text-align:center;">
          ${logoUrl
            ? `<img src="${logoUrl}" alt="${distributorName}" style="max-height:60px;max-width:200px;object-fit:contain;margin-bottom:12px;display:block;margin-left:auto;margin-right:auto;">`
            : `<p style="margin:0;font-size:1.5rem;font-weight:800;color:#fff;">${distributorName}</p>`
          }
        </td></tr>

        <!-- Content -->
        <tr><td style="padding:40px;">
          <h1 style="margin:0 0 24px;font-size:1.25rem;font-weight:700;color:#0f172a;">${title}</h1>
          ${content}
          ${senderName ? `<p style="margin:24px 0 0;font-size:0.875rem;color:#6b7280;">Cordialement,<br><strong>${senderName}</strong></p>` : ""}
        </td></tr>

        <!-- Footer -->
        <tr><td style="padding:24px 40px;background:#f8fafc;border-top:1px solid #e2e8f0;text-align:center;">
          <p style="margin:0;font-size:0.75rem;color:#94a3b8;">${distributorName} · Portail PMA by LYSMA Solutions</p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}