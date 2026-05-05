import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/auth-session";

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getCurrentSession();
    if (!session || session.user.roleCode !== "admin")
      return NextResponse.json({ success: false, message: "Accès refusé." }, { status: 403 });

    const { id } = await context.params;
    const body = await req.json();

    const existing = await prisma.catalogue_items.findFirst({
      where: { id, distributor_id: session.user.distributorId },
    });
    if (!existing)
      return NextResponse.json({ success: false, message: "Produit introuvable." }, { status: 404 });

    const updated = await prisma.catalogue_items.update({
      where: { id },
      data: {
        designation:        body.designation        !== undefined ? String(body.designation).trim()        : undefined,
        description:        body.description        !== undefined ? (String(body.description).trim() || null) : undefined,
        internal_code:      body.internal_code      !== undefined ? (String(body.internal_code).trim() || null) : undefined,
        supplier_reference: body.supplier_reference !== undefined ? (String(body.supplier_reference).trim() || null) : undefined,
        billing_code:       body.billing_code       !== undefined ? (String(body.billing_code).trim() || null) : undefined,
        brand:              body.brand              !== undefined ? (String(body.brand).trim() || null) : undefined,
        unit_price_ht:      body.unit_price_ht      !== undefined ? (body.unit_price_ht ?? null) : undefined,
        unit_price_ttc:     body.unit_price_ttc     !== undefined ? (body.unit_price_ttc ?? null) : undefined,
        vat_rate:           body.vat_rate           !== undefined ? (body.vat_rate ?? null) : undefined,
        stock_quantity:     body.stock_quantity     !== undefined ? (body.stock_quantity ?? null) : undefined,
        image_url:          body.image_url          !== undefined ? (String(body.image_url).trim() || null) : undefined,
        is_active:          body.is_active          !== undefined ? Boolean(body.is_active) : undefined,
        is_featured:        body.is_featured        !== undefined ? Boolean(body.is_featured) : undefined,
        supplier_id:        body.supplier_id        !== undefined ? (body.supplier_id || null) : undefined,
        catalogue_id:       body.catalogue_id       !== undefined ? (body.catalogue_id || null) : undefined,
      },
    });

    return NextResponse.json({ success: true, itemId: updated.id });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Erreur serveur." }, { status: 500 });
  }
}