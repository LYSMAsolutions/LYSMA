import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/auth-session";

// GET /api/atc/garanties — liste + KPIs
export async function GET(req: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session || session.user.roleCode !== "atc")
      return NextResponse.json({ success: false, message: "Accès refusé." }, { status: 403 });

    const [garanties, kpis] = await Promise.all([
      prisma.garanties.findMany({
        where: { distributor_id: session.user.distributorId, assigned_user_id: session.user.id },
        include: {
          clients: { select: { name: true, code: true } },
          stores:  { select: { name: true, code: true } },
        },
        orderBy: { created_at: "desc" },
      }),
      prisma.garanties.groupBy({
        by: ["status"],
        where: { distributor_id: session.user.distributorId, assigned_user_id: session.user.id },
        _count: { id: true },
      }),
    ]);

    const kpiMap = Object.fromEntries(kpis.map((k) => [k.status, k._count.id]));

    return NextResponse.json({
      success: true,
      garanties,
      kpis: {
        total:                 garanties.length,
        en_cours:              kpiMap["en_cours"]                  ?? 0,
        en_attente_fournisseur:kpiMap["en_attente_fournisseur"]    ?? 0,
        refusee:               kpiMap["refusee"]                   ?? 0,
        brouillon:             kpiMap["brouillon"]                 ?? 0,
      },
    });
  } catch {
    return NextResponse.json({ success: false, message: "Erreur serveur." }, { status: 500 });
  }
}

// POST /api/atc/garanties — créer ou sauvegarder brouillon
export async function POST(req: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session || session.user.roleCode !== "atc")
      return NextResponse.json({ success: false, message: "Accès refusé." }, { status: 403 });

    const body = await req.json();
    const action: "draft" | "send" = body.action ?? "draft";

    // Validation avant envoi
    if (action === "send") {
      const required = [
        { field: "client_id",        label: "Client" },
        { field: "magasin_id",       label: "Magasin" },
        { field: "marque_piece",     label: "Marque de la pièce" },
        { field: "reference_piece",  label: "Référence de la pièce" },
        { field: "defaut_constate",  label: "Défaut constaté" },
        { field: "date_montage_1",   label: "Date 1er montage" },
        { field: "km_montage_1",     label: "Km 1er montage" },
        { field: "date_montage_2",   label: "Date 2ème montage" },
        { field: "km_montage_2",     label: "Km 2ème montage" },
        { field: "marque_vehicule",  label: "Marque du véhicule" },
        { field: "annee_vehicule",   label: "Année du véhicule" },
        { field: "doc_carte_grise",  label: "Carte grise" },
        { field: "doc_facture_1",    label: "Facture 1er montage" },
        { field: "doc_facture_2",    label: "Facture 2ème montage / cession" },
        { field: "doc_bl_1",         label: "BL magasin n°1" },
      ];
      for (const { field, label } of required) {
        if (!body[field]) return NextResponse.json({ success: false, message: `Champ manquant : ${label}` }, { status: 400 });
      }
    }

    // Générer numéro si envoi
    let numero_garantie: string | undefined;
    if (action === "send") {
      const year  = new Date().getFullYear();
      const count = await prisma.garanties.count({ where: { distributor_id: session.user.distributorId } });
      numero_garantie = `GAR-${year}-${String(count + 1).padStart(5, "0")}`;
    }

    const garantie = await prisma.garanties.create({
      data: {
        distributor_id:        session.user.distributorId,
        assigned_user_id:      session.user.id,
        client_id:             body.client_id             || null,
        magasin_id:            body.magasin_id            || null,
        status:                action === "send" ? "en_cours" : "brouillon",
        numero_garantie:       numero_garantie            ?? null,
        marque_piece:          body.marque_piece          ? String(body.marque_piece).toUpperCase()     : null,
        fournisseur:           body.fournisseur           ? String(body.fournisseur).toUpperCase()      : null,
        reference_piece:       body.reference_piece       ? String(body.reference_piece).toUpperCase() : null,
        quantite:              body.quantite              ? Number(body.quantite)                       : 1,
        n_bon_livraison:       body.n_bon_livraison       || null,
        date_bon_livraison:    body.date_bon_livraison    ? new Date(body.date_bon_livraison)           : null,
        defaut_constate:       body.defaut_constate       ? String(body.defaut_constate).toUpperCase() : null,
        date_montage_1:        body.date_montage_1        ? new Date(body.date_montage_1)               : null,
        km_montage_1:          body.km_montage_1          ? Number(body.km_montage_1)                   : null,
        date_montage_2:        body.date_montage_2        ? new Date(body.date_montage_2)               : null,
        km_montage_2:          body.km_montage_2          ? Number(body.km_montage_2)                   : null,
        marque_vehicule:       body.marque_vehicule       ? String(body.marque_vehicule).toUpperCase() : null,
        type_vehicule:         body.type_vehicule         ? String(body.type_vehicule).toUpperCase()   : null,
        cylindree:             body.cylindree             || null,
        annee_vehicule:        body.annee_vehicule        || null,
        immat_vehicule:        body.immat_vehicule        ? String(body.immat_vehicule).toUpperCase()  : null,
        doc_carte_grise:       body.doc_carte_grise       || null,
        doc_facture_1:         body.doc_facture_1         || null,
        doc_facture_2:         body.doc_facture_2         || null,
        doc_bl_1:              body.doc_bl_1              || null,
        doc_bl_2:              body.doc_bl_2              || null,
        commentaire:           body.commentaire           || null,
      },
      include: { clients: { select: { name: true, code: true } } },
    });

    // Notification magasin si la garantie est envoyée
    if (action === "send" && body.magasin_id) {
      try {
        const store = await prisma.stores.findFirst({
          where: { id: body.magasin_id },
          select: { email: true, name: true },
        });
        if (store?.email) {
          const { sendMail, buildEmailTemplate } = await import("@/lib/mailer");
          const html = buildEmailTemplate({
            title: "Nouvelle demande de garantie",
            distributorName: store.name ?? "Votre distributeur",  // ← ajouter cette ligne
            content: `
              <p>Une nouvelle demande de garantie a été soumise.</p>
              <table style="width:100%;border-collapse:collapse;">
                <tr><td style="padding:4px 8px;font-weight:600;">N° garantie</td><td style="padding:4px 8px;">${garantie.numero_garantie ?? "—"}</td></tr>
                <tr><td style="padding:4px 8px;font-weight:600;">Client</td><td style="padding:4px 8px;">${garantie.clients?.name ?? "—"}</td></tr>
                <tr><td style="padding:4px 8px;font-weight:600;">Pièce</td><td style="padding:4px 8px;">${body.reference_piece ?? "—"}</td></tr>
                <tr><td style="padding:4px 8px;font-weight:600;">Défaut</td><td style="padding:4px 8px;">${body.defaut_constate ?? "—"}</td></tr>
              </table>
            `,
          });
          await sendMail({
            to:      store.email,
            subject: `Garantie ${garantie.numero_garantie ?? ""} — ${garantie.clients?.name ?? "Client"} à traiter`,
            html,
          });
        }
      } catch (notifErr) {
        // Non bloquant — la garantie est enregistrée même si la notif échoue
        console.error("GARANTIE_NOTIF_ERROR", notifErr);
      }
    }

    return NextResponse.json({ success: true, garantie_id: garantie.id, numero: garantie.numero_garantie });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ success: false, message: "Erreur serveur." }, { status: 500 });
  }
}