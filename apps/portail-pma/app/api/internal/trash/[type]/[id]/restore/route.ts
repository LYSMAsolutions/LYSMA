import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function isAuthorized(req: NextRequest) {
  const apiKey = req.headers.get("x-internal-api-key");
  return Boolean(process.env.INTERNAL_API_KEY) && apiKey === process.env.INTERNAL_API_KEY;
}

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ type: string; id: string }> }
) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ success: false, message: "Non autorise." }, { status: 401 });
  }

  const { type, id } = await context.params;
  const restoredBy = req.headers.get("x-super-admin-user-id") || null;
  const data = {
    is_active: true,
    deleted_at: null,
    restored_at: new Date(),
    restored_by: restoredBy,
  };

  if (type === "user") {
    const current = await prisma.users.findUnique({ where: { id } });
    if (!current?.deleted_at) return NextResponse.json({ success: false, message: "Element introuvable." }, { status: 404 });
    const item = await prisma.users.update({ where: { id }, data });
    return NextResponse.json({ success: true, item });
  }

  if (type === "store") {
    const current = await prisma.stores.findUnique({ where: { id } });
    if (!current?.deleted_at) return NextResponse.json({ success: false, message: "Element introuvable." }, { status: 404 });
    const item = await prisma.stores.update({ where: { id }, data });
    return NextResponse.json({ success: true, item });
  }

  if (type === "store_staff") {
    const current = await prisma.store_staff.findUnique({ where: { id } });
    if (!current?.deleted_at) return NextResponse.json({ success: false, message: "Element introuvable." }, { status: 404 });
    const item = await prisma.store_staff.update({ where: { id }, data });
    return NextResponse.json({ success: true, item });
  }

  return NextResponse.json({ success: false, message: "Type non supporte." }, { status: 400 });
}
