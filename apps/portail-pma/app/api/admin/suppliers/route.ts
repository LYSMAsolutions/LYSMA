import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ success: false, message: "Suppliers legacy redirige vers catalogue fournisseurs." }, { status: 501 });
}
