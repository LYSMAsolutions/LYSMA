import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/auth-session";
import { revalidatePath } from "next/cache";

export async function GET() {
  try {
    const session = await getCurrentSession();
    if (!session || session.user.roleCode !== "admin")
      return NextResponse.json({ success: false, message: "Accès refusé." }, { status: 403 });

    const [distributor, settings] = await Promise.all([
      prisma.distributors.findFirst({ where: { id: session.user.distributorId } }),
      prisma.distributor_settings.findFirst({ where: { distributor_id: session.user.distributorId } }),
    ]);

    return NextResponse.json({ success: true, distributor, settings });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Erreur serveur." }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session || session.user.roleCode !== "admin")
      return NextResponse.json({ success: false, message: "Accès refusé." }, { status: 403 });

    const body = await req.json();

    // Mettre à jour le distributeur
    await prisma.distributors.update({
      where: { id: session.user.distributorId },
      data: {
        name:        body.name        ? String(body.name).trim()        : undefined,
        legal_name:  body.legal_name  !== undefined ? (String(body.legal_name).trim()  || null) : undefined,
        siret:       body.siret       !== undefined ? (String(body.siret).trim()        || null) : undefined,
        vat_number:  body.vat_number  !== undefined ? (String(body.vat_number).trim()   || null) : undefined,
        email:       body.email       !== undefined ? (String(body.email).trim().toLowerCase() || null) : undefined,
        phone:       body.phone       !== undefined ? (String(body.phone).trim()        || null) : undefined,
      },
    });

    // Upsert les settings
    await prisma.distributor_settings.upsert({
      where:  { distributor_id: session.user.distributorId },
      create: {
        distributor_id:      session.user.distributorId,
        company_display_name: body.company_display_name ? String(body.company_display_name).trim() : null,
        support_email:        body.support_email        ? String(body.support_email).trim().toLowerCase() : null,
        support_phone:        body.support_phone        ? String(body.support_phone).trim() : null,
        support_address:      body.support_address      ? String(body.support_address).trim() : null,
      },
      update: {
        company_display_name: body.company_display_name !== undefined ? (String(body.company_display_name).trim() || null) : undefined,
        support_email:        body.support_email        !== undefined ? (String(body.support_email).trim().toLowerCase() || null) : undefined,
        support_phone:        body.support_phone        !== undefined ? (String(body.support_phone).trim() || null) : undefined,
        support_address:      body.support_address      !== undefined ? (String(body.support_address).trim() || null) : undefined,
      },
    });

    revalidatePath(`/${session.user.distributorSlug}/admin/settings`);
    revalidatePath(`/${session.user.distributorSlug}/admin/settings/general`);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Erreur serveur." }, { status: 500 });
  }
}