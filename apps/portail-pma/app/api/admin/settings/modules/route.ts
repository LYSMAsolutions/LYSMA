import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/auth-session";
import { revalidatePath } from "next/cache";

export async function GET() {
  try {
    const session = await getCurrentSession();
    if (!session || session.user.roleCode !== "admin")
      return NextResponse.json({ success: false, message: "Accès refusé." }, { status: 403 });

    const [allTools, activeTools] = await Promise.all([
      prisma.tools.findMany({ where: { is_active: true }, orderBy: { name: "asc" } }),
      prisma.distributor_tools.findMany({
        where: { distributor_id: session.user.distributorId },
        select: { tool_id: true, is_enabled: true },
      }),
    ]);

    const activeMap = new Map(activeTools.map((t) => [t.tool_id, t.is_enabled]));

    const tools = allTools.map((t) => ({
      id:         t.id,
      code:       t.code,
      name:       t.name,
      is_enabled: activeMap.get(t.id) ?? false,
    }));

    // Récupérer les options depuis workflow_config
    const settings = await prisma.distributor_settings.findFirst({
      where: { distributor_id: session.user.distributorId },
      select: { workflow_config: true },
    });

    const wf      = settings?.workflow_config as Record<string, unknown> | null;
    const options = (wf?.module_options as Record<string, boolean>) ?? {};

    return NextResponse.json({ success: true, tools, options });
  } catch {
    return NextResponse.json({ success: false, message: "Erreur serveur." }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session || session.user.roleCode !== "admin")
      return NextResponse.json({ success: false, message: "Accès refusé." }, { status: 403 });

    const body = await req.json();

    // Si on reçoit des options (côté distributeur) — on sauvegarde dans workflow_config
    if (body.options !== undefined) {
      const existing = await prisma.distributor_settings.findFirst({
        where: { distributor_id: session.user.distributorId },
        select: { workflow_config: true },
      });

      const currentWf = (existing?.workflow_config as Record<string, unknown>) ?? {};

      await prisma.distributor_settings.upsert({
        where:  { distributor_id: session.user.distributorId },
        create: { distributor_id: session.user.distributorId, workflow_config: { ...currentWf, module_options: body.options } },
        update: { workflow_config: { ...currentWf, module_options: body.options } },
      });

      revalidatePath(`/${session.user.distributorSlug}/admin/settings/modules`);
      return NextResponse.json({ success: true });
    }

    // Si on reçoit des toolStates (super admin uniquement) — on met à jour distributor_tools
    if (body.tools !== undefined) {
      const toolStates: Record<string, boolean> = body.tools;
      await prisma.$transaction(
        Object.entries(toolStates).map(([toolId, isEnabled]) =>
          prisma.distributor_tools.upsert({
            where:  { distributor_id_tool_id: { distributor_id: session.user.distributorId, tool_id: toolId } },
            create: { distributor_id: session.user.distributorId, tool_id: toolId, is_enabled: isEnabled, activated_at: isEnabled ? new Date() : null },
            update: { is_enabled: isEnabled, activated_at: isEnabled ? new Date() : null },
          })
        )
      );

      revalidatePath(`/${session.user.distributorSlug}/admin/settings/modules`);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, message: "Aucune donnée reçue." }, { status: 400 });
  } catch {
    return NextResponse.json({ success: false, message: "Erreur serveur." }, { status: 500 });
  }
}