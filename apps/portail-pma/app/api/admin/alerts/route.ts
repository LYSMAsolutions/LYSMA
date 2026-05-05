import { requireUser } from "@/lib/auth-session";
import { NextResponse } from "next/server";

export async function GET() {
  const user = await requireUser();

  if (user.roleCode !== "admin") {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({ success: true, items: [] });
}
