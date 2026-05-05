import { NextRequest, NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth-session";
import { getGarantieById } from "@/lib/admin/garanties";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getCurrentSession();
    if (!session || session.user.roleCode !== "admin")
      return NextResponse.json({ success: false, message: "Accès refusé." }, { status: 403 });

    const { id } = await params;
    const garantie = await getGarantieById({ distributorId: session.user.distributorId, garantieId: id });

    if (!garantie)
      return NextResponse.json({ success: false, message: "Garantie introuvable." }, { status: 404 });

    return NextResponse.json({ success: true, garantie });
  } catch {
    return NextResponse.json({ success: false, message: "Erreur serveur." }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getCurrentSession();
    if (!session || session.user.roleCode !== "admin")
      return NextResponse.json({ success: false, message: "Accès refusé." }, { status: 403 });

    const { id }  = await params;
    const body    = await req.json();
    const action: string = body.action;

    const garantie = await getGarantieById({ distributorId: session.user.distributorId, garantieId: id });
    if (!garantie)
      return NextResponse.json({ success: false, message: "Garantie introuvable." }, { status: 404 });

    // Calculer le nouveau statut et les champs de décision selon l'action
    let newStatus:           string;
    let decision:            string | null = garantie.decision;
    let decision_bl:         string | null = garantie.decision_bl;
    let decision_commentaire:string | null = garantie.decision_commentaire;
    let date_decision:       Date   | null = garantie.date_decision;
    let date_envoi_expert:   Date   | null = garantie.date_envoi_expert;
    let retour_fournisseur:  boolean       = garantie.retour_fournisseur ?? false;

    switch (action) {
      case "envoyer-expert":
        newStatus           = "en_attente_fournisseur";
        retour_fournisseur  = true;
        date_envoi_expert   = new Date();
        break;

      case "valider-echange":
        newStatus       = "validee";
        decision        = "echange_garantie";
        date_decision   = new Date();
        decision_bl     = body.decision_bl?.trim() || null;
        break;

      case "valider-avoir":
        newStatus       = "validee";
        decision        = "avoir";
        date_decision   = new Date();
        decision_bl     = body.decision_bl?.trim() || null;
        break;

      case "refuser":
        if (!body.reason?.trim())
          return NextResponse.json({ success: false, message: "Le motif du refus est obligatoire." }, { status: 400 });
        newStatus            = "refusee";
        decision             = "refuse";
        date_decision        = new Date();
        decision_commentaire = body.reason.trim();
        break;

      default:
        return NextResponse.json({ success: false, message: "Action inconnue." }, { status: 400 });
    }

    const updated = await prisma.garanties.update({
      where: { id },
      data: {
        status:              newStatus,
        decision,
        decision_bl,
        decision_commentaire,
        date_decision,
        date_envoi_expert,
        retour_fournisseur,
        updated_at:          new Date(),
      },
    });

    // Notifier l'ATC par email
    try {
      if (garantie.users) {
        const atcEmail = await prisma.users.findFirst({
          where: { id: garantie.assigned_user_id ?? "" },
          select: { email: true, first_name: true },
        });

        if (atcEmail?.email) {
          const { sendMail, buildEmailTemplate } = await import("@/lib/mailer");
          const labels: Record<string, string> = {
            "envoyer-expert":  "envoyée chez le fournisseur pour expertise",
            "valider-echange": "validée — échange sous garantie",
            "valider-avoir":   "validée — avoir accordé",
            "refuser":         "refusée",
          };
          const html = buildEmailTemplate({
            title:           `Garantie ${garantie.numero_garantie ?? ""} — mise à jour`,
            distributorName: session.user.distributorId,
            content: `
              <p>Bonjour ${atcEmail.first_name ?? ""},</p>
              <p>Votre demande de garantie a été <strong>${labels[action] ?? action}</strong>.</p>
              <table style="width:100%;border-collapse:collapse;">
                <tr><td style="padding:4px 8px;font-weight:600;">N° garantie</td><td style="padding:4px 8px;">${garantie.numero_garantie ?? "—"}</td></tr>
                <tr><td style="padding:4px 8px;font-weight:600;">Pièce</td><td style="padding:4px 8px;">${garantie.reference_piece ?? "—"}</td></tr>
                ${decision_commentaire ? `<tr><td style="padding:4px 8px;font-weight:600;">Commentaire</td><td style="padding:4px 8px;">${decision_commentaire}</td></tr>` : ""}
                ${decision_bl ? `<tr><td style="padding:4px 8px;font-weight:600;">BL décision</td><td style="padding:4px 8px;">${decision_bl}</td></tr>` : ""}
              </table>
            `,
          });
          await sendMail({
            to:      atcEmail.email,
            subject: `Garantie ${garantie.numero_garantie ?? ""} — ${labels[action] ?? "mise à jour"}`,
            html,
          });
        }
      }
    } catch (notifErr) {
      console.error("GARANTIE_ADMIN_NOTIF_ERROR", notifErr);
    }

    revalidatePath(`/${session.user.distributorSlug}/admin/garanties`);
    revalidatePath(`/${session.user.distributorSlug}/admin/garanties/${id}`);

    return NextResponse.json({ success: true, garantie: updated });
  } catch {
    return NextResponse.json({ success: false, message: "Erreur serveur." }, { status: 500 });
  }
}