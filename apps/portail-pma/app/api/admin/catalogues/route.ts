import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/auth-session";

const VALID_TYPES = ["supplier", "promo", "operation", "internal", "outillage", "materiel"];

export async function GET(req: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session || session.user.roleCode !== "admin")
      return NextResponse.json({ success: false, message: "Accès refusé." }, { status: 403 });

    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type") || "";
    const now  = new Date();

    const where: Record<string, unknown> = {
      distributor_id: session.user.distributorId,
    };
    if (type) where.catalogue_type = type;

    // Exclure les catalogues expirés
    where.OR = [
      { valid_to: null },
      { valid_to: { gte: now } },
    ];

    const catalogues = await prisma.catalogues.findMany({
      where,
      include: {
        suppliers: { select: { id: true, code: true, name: true } },
        _count: { select: { catalogue_items: true } },
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json({ success: true, catalogues });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Erreur serveur." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session || session.user.roleCode !== "admin")
      return NextResponse.json({ success: false, message: "Accès refusé." }, { status: 403 });

    const body          = await req.json();
    const code          = String(body.code           || "").trim().toUpperCase();
    const name          = String(body.name           || "").trim();
    const catalogueType = String(body.catalogue_type || "").trim();
    const supplierId    = body.supplier_id || null;
    const description   = body.description ? String(body.description).trim() : null;
    const validFrom     = body.valid_from  ? new Date(body.valid_from) : null;
    const validTo       = body.valid_to    ? new Date(body.valid_to)   : null;

    if (!code || !name || !catalogueType)
      return NextResponse.json({ success: false, message: "Code, nom et type obligatoires." }, { status: 400 });

    if (!VALID_TYPES.includes(catalogueType))
      return NextResponse.json({ success: false, message: "Type de catalogue invalide." }, { status: 400 });

    const existing = await prisma.catalogues.findFirst({
      where: { distributor_id: session.user.distributorId, code },
    });
    if (existing)
      return NextResponse.json({ success: false, message: "Un catalogue avec ce code existe déjà." }, { status: 409 });

    const catalogue = await prisma.catalogues.create({
      data: {
        distributor_id: session.user.distributorId,
        code, name,
        catalogue_type: catalogueType,
        supplier_id:    supplierId,
        description,
        valid_from:     validFrom,
        valid_to:       validTo,
        is_active:      true,
      },
    });

    return NextResponse.json({ success: true, catalogueId: catalogue.id });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Erreur serveur.", error: error instanceof Error ? error.message : "unknown" }, { status: 500 });
  }
}