import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ success: false, message: "Supplier legacy a finaliser." }, { status: 501 });
}
