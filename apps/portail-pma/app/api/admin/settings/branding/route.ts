import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/auth-session";
import { revalidatePath } from "next/cache";

export async function GET() {
  try {
    const session = await getCurrentSession();
    if (!session || session.user.roleCode !== "admin")
      return NextResponse.json({ success: false, message: "Accès refusé." }, { status: 403 });

    const settings = await prisma.distributor_settings.findFirst({
      where: { distributor_id: session.user.distributorId },
      select: { logo_url: true, primary_color: true, secondary_color: true, company_display_name: true },
    });

    return NextResponse.json({ success: true, settings });
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

    await prisma.distributor_settings.upsert({
      where:  { distributor_id: session.user.distributorId },
      create: {
        distributor_id:      session.user.distributorId,
        logo_url:            body.logo_url       || null,
        primary_color:       body.primary_color  || "#0a4d9b",
        secondary_color:     body.secondary_color|| "#1e73d8",
        company_display_name:body.company_display_name || null,
      },
      update: {
        logo_url:            body.logo_url            !== undefined ? (body.logo_url || null)            : undefined,
        primary_color:       body.primary_color        !== undefined ? (body.primary_color || "#0a4d9b")  : undefined,
        secondary_color:     body.secondary_color      !== undefined ? (body.secondary_color || "#1e73d8"): undefined,
        company_display_name:body.company_display_name !== undefined ? (body.company_display_name || null): undefined,
      },
    });

    revalidatePath(`/${session.user.distributorSlug}/admin/settings/branding`);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Erreur serveur." }, { status: 500 });
  }
}