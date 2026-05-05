import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ success: false, message: "Detail bon admin a finaliser." }, { status: 501 });
}
