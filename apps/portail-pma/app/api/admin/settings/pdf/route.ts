import { NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth-session";

async function checkAdmin() {
  const session = await getCurrentSession();
  if (!session || session.user.roleCode !== "admin")
    return NextResponse.json({ success: false, message: "Accès refusé." }, { status: 403 });
  return null;
}

export async function GET() {
  const deny = await checkAdmin();
  if (deny) return deny;
  return NextResponse.json({ success: true, message: "Module en cours de développement." });
}

export async function POST() {
  const deny = await checkAdmin();
  if (deny) return deny;
  return NextResponse.json({ success: true, message: "Module en cours de développement." });
}