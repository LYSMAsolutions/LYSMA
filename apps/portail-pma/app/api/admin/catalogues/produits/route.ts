import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/auth-session";

export async function GET(req: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session || session.user.roleCode !== "admin")
      return NextResponse.json({ success: false, message: "Accès refusé." }, { status: 403 });

    const { searchParams } = new URL(req.url);
    const search      = searchParams.get("search")     || "";
    const supplierId  = searchParams.get("supplier_id") || "";
    const itemFamily  = searchParams.get("item_family") || "";
    const isActiveStr = searchParams.get("is_active")   || "";
    const page        = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const pageSize    = 50;

    const where: Record<string, unknown> = {
      distributor_id: session.user.distributorId,
    };
    if (supplierId)  where.supplier_id  = supplierId;
    if (itemFamily)  where.item_family  = itemFamily;
    if (isActiveStr) where.is_active    = isActiveStr === "true";
    if (search) {
      where.OR = [
        { designation:        { contains: search, mode: "insensitive" } },
        { internal_code:      { contains: search, mode: "insensitive" } },
        { supplier_reference: { contains: search, mode: "insensitive" } },
        { billing_code:       { contains: search, mode: "insensitive" } },
        { brand:              { contains: search, mode: "insensitive" } },
      ];
    }

    const [items, total] = await prisma.$transaction([
      prisma.catalogue_items.findMany({
        where,
        include: {
          suppliers:  { select: { id: true, code: true, name: true } },
          catalogues: { select: { id: true, code: true, name: true, catalogue_type: true, valid_to: true } },
        },
        orderBy: { designation: "asc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.catalogue_items.count({ where }),
    ]);

    return NextResponse.json({ success: true, items, total, page, pageSize });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Erreur serveur." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session || session.user.roleCode !== "admin")
      return NextResponse.json({ success: false, message: "Accès refusé." }, { status: 403 });

    const body = await req.json();

    const designation = String(body.designation || "").trim();
    const itemFamily  = String(body.item_family  || "").trim();

    if (!designation || !itemFamily)
      return NextResponse.json({ success: false, message: "Désignation et famille obligatoires." }, { status: 400 });

    const VALID_FAMILIES = ["fournisseur", "promo", "operation_commerciale", "interne", "outillage", "materiel"];
    if (!VALID_FAMILIES.includes(itemFamily))
      return NextResponse.json({ success: false, message: "Famille invalide." }, { status: 400 });

    const item = await prisma.catalogue_items.create({
      data: {
        distributor_id:     session.user.distributorId,
        catalogue_id:       body.catalogue_id       || null,
        supplier_id:        body.supplier_id         || null,
        internal_code:      body.internal_code       ? String(body.internal_code).trim()  : null,
        supplier_reference: body.supplier_reference  ? String(body.supplier_reference).trim() : null,
        billing_code:       body.billing_code        ? String(body.billing_code).trim()   : null,
        designation,
        description:        body.description         ? String(body.description).trim()    : null,
        item_family:        itemFamily,
        brand:              body.brand               ? String(body.brand).trim()          : null,
        unit_price_ht:      body.unit_price_ht       ?? null,
        unit_price_ttc:     body.unit_price_ttc      ?? null,
        vat_rate:           body.vat_rate            ?? null,
        stock_quantity:     body.stock_quantity      ?? null,
        image_url:          body.image_url           ? String(body.image_url).trim()      : null,
        is_active:          body.is_active           ?? true,
        is_featured:        body.is_featured         ?? false,
      },
    });

    return NextResponse.json({ success: true, itemId: item.id });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Erreur serveur.", error: error instanceof Error ? error.message : "unknown" }, { status: 500 });
  }
}