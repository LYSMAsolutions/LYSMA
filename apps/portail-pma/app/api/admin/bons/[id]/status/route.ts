import { NextResponse } from "next/server";

export async function PATCH() {
  return NextResponse.json({ success: false, message: "Changement de statut admin a finaliser." }, { status: 501 });
}
