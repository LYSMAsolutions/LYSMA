import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/auth-session";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getCurrentSession();
    if (!session || session.user.roleCode !== "atc")
      return NextResponse.json({ success: false, message: "Accès refusé." }, { status: 403 });

    const { id } = await params;

    const g = await prisma.garanties.findFirst({
      where: { id, distributor_id: session.user.distributorId },
      include: {
        clients: { select: { name: true, code: true } },
        stores:  { select: { name: true, code: true } },
        users:   { select: { first_name: true, last_name: true } },
      },
    });

    if (!g) return NextResponse.json({ success: false, message: "Garantie introuvable." }, { status: 404 });

    return NextResponse.json({
      success: true,
      data: {
        numero_garantie:     g.numero_garantie,
        created_at:          g.created_at.toISOString(),
        status:              g.status,
        marque_piece:        g.marque_piece,
        fournisseur:         g.fournisseur,
        reference_piece:     g.reference_piece,
        quantite:            g.quantite,
        n_bon_livraison:     g.n_bon_livraison,
        date_bon_livraison:  g.date_bon_livraison?.toISOString() ?? null,
        defaut_constate:     g.defaut_constate,
        date_montage_1:      g.date_montage_1?.toISOString() ?? null,
        km_montage_1:        g.km_montage_1,
        date_montage_2:      g.date_montage_2?.toISOString() ?? null,
        km_montage_2:        g.km_montage_2,
        marque_vehicule:     g.marque_vehicule,
        type_vehicule:       g.type_vehicule,
        cylindree:           g.cylindree,
        annee_vehicule:      g.annee_vehicule,
        immat_vehicule:      g.immat_vehicule,
        retour_fournisseur:  g.retour_fournisseur,
        date_envoi_expert:   g.date_envoi_expert?.toISOString() ?? null,
        date_decision:       g.date_decision?.toISOString() ?? null,
        decision:            g.decision,
        decision_bl:         g.decision_bl,
        decision_commentaire:g.decision_commentaire,
        doc_carte_grise:     g.doc_carte_grise,
        doc_facture_1:       g.doc_facture_1,
        doc_facture_2:       g.doc_facture_2,
        doc_bl_1:            g.doc_bl_1,
        doc_bl_2:            g.doc_bl_2,
        commentaire:         g.commentaire,
        atcName:   g.users   ? `${g.users.first_name ?? ""} ${g.users.last_name ?? ""}`.trim().toUpperCase() : "",
        clientName:g.clients?.name  ?? "",
        clientCode:g.clients?.code  ?? "",
        storeName: g.stores?.name   ?? "",
        storeCode: g.stores?.code   ?? "",
      },
    });
  } catch (err) {
    console.error("PRINT_DATA_ERROR", err);
    return NextResponse.json({ success: false, message: "Erreur serveur." }, { status: 500 });
  }
}