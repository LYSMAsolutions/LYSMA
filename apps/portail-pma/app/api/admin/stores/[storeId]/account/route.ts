import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ success: false, message: "Compte magasin a finaliser." }, { status: 501 });
}
