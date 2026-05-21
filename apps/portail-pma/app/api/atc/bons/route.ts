import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/auth-session";
import { revalidatePath } from "next/cache";
import { buildCdvClientWhere, getCdvScope } from "@/lib/admin/access-scope";

// Génère un numéro de bon unique : BON-2025-00042
async function generateBonNumber(distributorId: string): Promise<string> {
  const year  = new Date().getFullYear();
  const count = await prisma.bons.count({ where: { distributor_id: distributorId } });
  const seq   = String(count + 1).padStart(5, "0");
  return `BON-${year}-${seq}`;
}

export async function POST(req: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session || !["atc", "cdv"].includes(session.user.roleCode))
      return NextResponse.json({ success: false, message: "Accès refusé." }, { status: 403 });

    const body = await req.json();

    const {
      client_id,
      assigned_store_id,
      bon_type,
      comment,
      lines,
      action, // "draft" | "send"
    } = body;

    if (!client_id || !assigned_store_id || !bon_type)
      return NextResponse.json({ success: false, message: "Client, magasin et type de bon obligatoires." }, { status: 400 });

    // Vérifier que le client appartient bien à ce distributeur ET à cet ATC
    const clientWhere =
      session.user.roleCode === "cdv"
        ? buildCdvClientWhere({
            distributorId: session.user.distributorId,
            ...(await getCdvScope({
              distributorId: session.user.distributorId,
              userId: session.user.id,
            })),
          })
        : {
            distributor_id: session.user.distributorId,
            assigned_user_id: session.user.id,
          };

    const client = await prisma.clients.findFirst({
      where: { id: client_id, ...clientWhere },
    });
    if (!client)
      return NextResponse.json({ success: false, message: "Client introuvable ou non assigné." }, { status: 404 });

    // Vérifier que le magasin appartient bien à ce distributeur
    const store = await prisma.stores.findFirst({
      where: { id: assigned_store_id, distributor_id: session.user.distributorId },
    });
    if (!store)
      return NextResponse.json({ success: false, message: "Magasin introuvable." }, { status: 404 });

    // Vérifier les types SAV — bloc doit être actif
    const savTypes = ["sav", "devis_materiel", "commande_materiel"];
    if (savTypes.includes(bon_type)) {
      const savTool = await prisma.distributor_tools.findFirst({
        where: { distributor_id: session.user.distributorId, is_enabled: true, tools: { code: "sav" } },
      });
      if (!savTool)
        return NextResponse.json({ success: false, message: "Le bloc SAV n'est pas activé." }, { status: 403 });
    }

    // Vérifier relevé de parc
    if (bon_type === "releve_parc") {
      const parcTool = await prisma.distributor_tools.findFirst({
        where: { distributor_id: session.user.distributorId, is_enabled: true, tools: { code: "releve_parc" } },
      });
      if (!parcTool)
        return NextResponse.json({ success: false, message: "Le bloc Relevé de parc n'est pas activé." }, { status: 403 });
    }

    const bon_number = await generateBonNumber(session.user.distributorId);
    const status     = action === "send" ? "envoye" : "brouillon";

    const bon = await prisma.bons.create({
      data: {
        distributor_id:      session.user.distributorId,
        created_by_user_id:  session.user.id,
        client_id,
        assigned_store_id,
        bon_number,
        bon_type,
        status,
        comment:  comment?.trim() || null,
        priority: "normal",
        bon_lines: {
          create: (lines || []).map((line: { reference?: string; designation?: string; quantity?: number; unit_price?: number; comment?: string }, idx: number) => ({
            line_number:  idx + 1,
            reference:    line.reference?.trim()   || null,
            designation:  line.designation?.trim() || null,
            quantity:     line.quantity            ?? 1,
            unit_price:   line.unit_price          ?? null,
            comment:      line.comment?.trim()     || null,
          })),
        },
      },
    });

    // Historique statut initial
    await prisma.bon_status_history.create({
      data: {
        bon_id:     bon.id,
        changed_by_user_id: session.user.id,
        action_key: status === "envoye" ? "envoye" : "brouillon",
        old_status: null,
        new_status: status,
      },
    }).catch(() => {});

    revalidatePath(`/${session.user.distributorSlug}/atc/bons`);
    revalidatePath(`/${session.user.distributorSlug}/cdv/bons`);

    // Alimenter le registre matériel si relevé de parc
    if (body.save_to_registry && body.lines && client_id) {
      const parcLines = (body.lines as Array<{ meta?: { type_materiel?: string; marque?: string; modele?: string; num_serie?: string; annee?: number } }>)
        .filter((l) => l.meta?.type_materiel);
      for (const l of parcLines) {
        await prisma.client_equipment.create({
          data: {
            distributor_id: session.user.distributorId,
            client_id,
            type_materiel:  l.meta!.type_materiel!,
            marque:         l.meta!.marque  || null,
            modele:         l.meta!.modele  || null,
            num_serie:      l.meta!.num_serie || null,
            annee:          l.meta!.annee   || null,
            source:         "releve_parc",
            bon_id:         bon.id,
          },
        }).catch(() => {}); // silencieux — ne pas bloquer
      }
    }

    return NextResponse.json({ success: true, bon_id: bon.id, bon_number: bon.bon_number, status });
  } catch (error) {
    console.error("CREATE_BON_ERROR", error);
    return NextResponse.json({ success: false, message: "Erreur serveur." }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getCurrentSession();
    if (!session || !["atc", "cdv"].includes(session.user.roleCode))
      return NextResponse.json({ success: false, message: "Accès refusé." }, { status: 403 });

    const bons = await prisma.bons.findMany({
      where: { distributor_id: session.user.distributorId, created_by_user_id: session.user.id },
      include: { clients: { select: { name: true, code: true } }, stores: { select: { name: true, code: true } } },
      orderBy: { created_at: "desc" },
    });

    return NextResponse.json({ success: true, bons });
  } catch {
    return NextResponse.json({ success: false, message: "Erreur serveur." }, { status: 500 });
  }
}
