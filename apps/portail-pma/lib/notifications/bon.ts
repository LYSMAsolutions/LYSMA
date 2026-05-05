import { sendMail, buildEmailTemplate } from "@/lib/mailer";
import { prisma } from "@/lib/prisma";

type BonNotifPayload = {
  bonId:         string;
  distributorId: string;
  event:         "bon_created" | "bon_pris_en_charge" | "bon_traite" | "bon_a_corriger" | "bon_refuse";
  senderName?:   string;
};

const EVENT_LABELS: Record<string, { subject: string; title: string }> = {
  bon_created:        { subject: "Nouveau bon reçu",          title: "Un nouveau bon vous a été envoyé"     },
  bon_pris_en_charge: { subject: "Bon pris en charge",        title: "Votre bon a été pris en charge"       },
  bon_traite:         { subject: "Bon traité",                title: "Votre bon a été traité"               },
  bon_a_corriger:     { subject: "Bon à corriger",            title: "Votre bon nécessite une correction"   },
  bon_refuse:         { subject: "Bon refusé",                title: "Votre bon a été refusé"               },
};

export async function sendBonNotification(payload: BonNotifPayload) {
  try {
    const [bon, settings, distributor] = await Promise.all([
      prisma.bons.findFirst({
        where: { id: payload.bonId },
        include: {
          clients:   { select: { name: true, email: true } },
          stores:    { select: { name: true, email: true } },
          users:     { select: { first_name: true, last_name: true, email: true } },
          bon_lines: { select: { designation: true, quantity: true, unit_price: true, reference: true }, take: 10 },
        },
      }),
      prisma.distributor_settings.findFirst({
        where: { distributor_id: payload.distributorId },
        select: { logo_url: true, company_display_name: true, notifications_config: true },
      }),
      prisma.distributors.findFirst({
        where: { id: payload.distributorId },
        select: { name: true },
      }),
    ]);

    if (!bon) return;

    const cfg            = settings?.notifications_config as Record<string, unknown> | null;
    const events         = (cfg?.events as Record<string, boolean>) ?? {};
    if (events[payload.event] === false) return; // notification désactivée

    const distributorName = settings?.company_display_name || distributor?.name || "Votre distributeur";
    const logoUrl         = settings?.logo_url;
    const senderName      = payload.senderName;
    const evLabel         = EVENT_LABELS[payload.event] ?? { subject: "Notification PMA", title: "Notification" };

    // Destinataires selon l'événement
    const recipients: string[] = [];
    if (payload.event === "bon_created" && bon.stores?.email)    recipients.push(bon.stores.email);
    if (payload.event === "bon_pris_en_charge" && bon.users?.email) recipients.push(bon.users.email);
    if (payload.event === "bon_traite") {
      if (bon.users?.email)   recipients.push(bon.users.email);
      if (bon.clients?.email) recipients.push(bon.clients.email);
    }
    if (payload.event === "bon_a_corriger" && bon.users?.email)  recipients.push(bon.users.email);
    if (payload.event === "bon_refuse"      && bon.users?.email)  recipients.push(bon.users.email);

    if (!recipients.length) return;

    // Lignes du bon
    const lignesHtml = bon.bon_lines.length > 0
      ? `<table width="100%" cellpadding="0" cellspacing="0" style="margin:16px 0;border-collapse:collapse;">
          <tr style="background:#f8fafc;">
            <th style="padding:8px 12px;text-align:left;font-size:0.75rem;color:#94a3b8;border-bottom:1px solid #e2e8f0;">Référence</th>
            <th style="padding:8px 12px;text-align:left;font-size:0.75rem;color:#94a3b8;border-bottom:1px solid #e2e8f0;">Désignation</th>
            <th style="padding:8px 12px;text-align:right;font-size:0.75rem;color:#94a3b8;border-bottom:1px solid #e2e8f0;">Qté</th>
            <th style="padding:8px 12px;text-align:right;font-size:0.75rem;color:#94a3b8;border-bottom:1px solid #e2e8f0;">Prix HT</th>
          </tr>
          ${bon.bon_lines.map((l) => `
          <tr>
            <td style="padding:8px 12px;font-size:0.82rem;color:#6b7280;border-bottom:1px solid #f1f5f9;font-family:monospace;">${l.reference || "—"}</td>
            <td style="padding:8px 12px;font-size:0.82rem;color:#0f172a;border-bottom:1px solid #f1f5f9;">${l.designation || "—"}</td>
            <td style="padding:8px 12px;font-size:0.82rem;color:#0f172a;border-bottom:1px solid #f1f5f9;text-align:right;">${l.quantity || 1}</td>
            <td style="padding:8px 12px;font-size:0.82rem;color:#0f172a;border-bottom:1px solid #f1f5f9;text-align:right;">${l.unit_price ? `${Number(l.unit_price).toFixed(2)} €` : "—"}</td>
          </tr>`).join("")}
        </table>`
      : "";

    const content = `
      <div style="background:#f8fafc;border-radius:12px;padding:16px 20px;margin-bottom:20px;">
        <p style="margin:0 0 4px;font-size:0.75rem;color:#94a3b8;text-transform:uppercase;letter-spacing:0.08em;">Bon n°</p>
        <p style="margin:0;font-size:1.1rem;font-weight:700;color:#0a4d9b;">${bon.bon_number}</p>
      </div>
      <p style="margin:0 0 8px;font-size:0.875rem;color:#334155;"><strong>Client :</strong> ${bon.clients?.name || "—"}</p>
      <p style="margin:0 0 8px;font-size:0.875rem;color:#334155;"><strong>Magasin :</strong> ${bon.stores?.name || "—"}</p>
      <p style="margin:0 0 16px;font-size:0.875rem;color:#334155;"><strong>Type :</strong> ${bon.bon_type}</p>
      ${lignesHtml}
      ${bon.comment ? `<p style="margin:16px 0 0;font-size:0.875rem;color:#475569;font-style:italic;">"${bon.comment}"</p>` : ""}
    `;

    const html = buildEmailTemplate({ logoUrl, distributorName, title: evLabel.title, content, senderName });

    await sendMail({ to: recipients, subject: `${evLabel.subject} · ${bon.bon_number}`, html });
  } catch (err) {
    console.error("[sendBonNotification] Erreur:", err);
  }
}