import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/auth-session";
import { revalidatePath } from "next/cache";

export async function GET(req: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session || session.user.roleCode !== "admin")
      return NextResponse.json({ success: false, message: "Accès refusé." }, { status: 403 });

    const suppliers = await prisma.suppliers.findMany({
      where: { distributor_id: session.user.distributorId },
      include: { _count: { select: { catalogue_items: true, catalogues: true } } },
      orderBy: { name: "asc" },
    });

    return NextResponse.json({ success: true, suppliers });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Erreur serveur." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session || session.user.roleCode !== "admin")
      return NextResponse.json({ success: false, message: "Accès refusé." }, { status: 403 });

    const body    = await req.json();
    const code    = String(body.code    || "").trim().toUpperCase();
    const name    = String(body.name    || "").trim();
    const email   = String(body.email   || "").trim().toLowerCase() || null;
    const phone   = String(body.phone   || "").trim() || null;
    const website = String(body.website || "").trim() || null;
    const notes   = String(body.notes   || "").trim() || null;

    if (!code || !name)
      return NextResponse.json({ success: false, message: "Code et nom obligatoires." }, { status: 400 });

    const existing = await prisma.suppliers.findFirst({
      where: { distributor_id: session.user.distributorId, code },
    });
    if (existing)
      return NextResponse.json({ success: false, message: "Un fournisseur avec ce code existe déjà." }, { status: 409 });

    // Récupérer le slug du distributeur pour revalidatePath
    const distrib = await prisma.distributors.findFirst({
      where: { id: session.user.distributorId },
      select: { slug: true },
    });

    const supplier = await prisma.suppliers.create({
      data: {
        distributor_id: session.user.distributorId,
        code, name, email, phone, website, notes,
        is_active: true,
      },
    });

    // Invalider toutes les pages catalogue du distributeur
    if (distrib?.slug) {
      revalidatePath(`/${distrib.slug}/admin/catalogues/fournisseurs`);
      revalidatePath(`/${distrib.slug}/admin/catalogues`);
    }
    // Fallback — invalider toutes les pages
    revalidatePath("/", "layout");

    return NextResponse.json({ success: true, supplierId: supplier.id });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Erreur serveur.", error: error instanceof Error ? error.message : "unknown" }, { status: 500 });
  }
}