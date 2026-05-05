import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ success: false, message: "Anomalies bon a finaliser." }, { status: 501 });
}
