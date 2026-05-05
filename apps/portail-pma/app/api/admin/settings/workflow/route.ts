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
      select: { bon_types_enabled: true, workflow_config: true },
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
        distributor_id:    session.user.distributorId,
        bon_types_enabled: body.bon_types_enabled ?? [],
        workflow_config:   body.workflow_config   ?? {},
      },
      update: {
        bon_types_enabled: body.bon_types_enabled !== undefined ? body.bon_types_enabled : undefined,
        workflow_config:   body.workflow_config   !== undefined ? body.workflow_config   : undefined,
      },
    });

    revalidatePath(`/${session.user.distributorSlug}/admin/settings/workflow`);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Erreur serveur." }, { status: 500 });
  }
}