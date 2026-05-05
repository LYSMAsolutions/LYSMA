import { NextRequest, NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth-session";
import { getGarantieListForAdmin, getGarantieKpisForAdmin } from "@/lib/admin/garanties";

export async function GET(req: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session || session.user.roleCode !== "admin")
      return NextResponse.json({ success: false, message: "Accès refusé." }, { status: 403 });

    const { searchParams } = req.nextUrl;
    const status = searchParams.get("status") ?? "all";
    const search = searchParams.get("search") ?? "";

    const [garanties, kpis] = await Promise.all([
      getGarantieListForAdmin({ distributorId: session.user.distributorId, status, search }),
      getGarantieKpisForAdmin(session.user.distributorId),
    ]);

    return NextResponse.json({ success: true, garanties, kpis });
  } catch {
    return NextResponse.json({ success: false, message: "Erreur serveur." }, { status: 500 });
  }
}