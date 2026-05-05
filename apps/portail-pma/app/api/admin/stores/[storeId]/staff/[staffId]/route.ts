import { NextResponse } from "next/server";

export async function PATCH() {
  return NextResponse.json({ success: false, message: "Edition magasinier a finaliser." }, { status: 501 });
}

export async function DELETE() {
  return NextResponse.json({ success: false, message: "Suppression magasinier a finaliser." }, { status: 501 });
}
