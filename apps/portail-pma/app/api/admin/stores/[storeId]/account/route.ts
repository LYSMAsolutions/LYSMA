import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { jsonError, requireAdminApi } from "@/lib/api-admin";

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ storeId: string }> },
) {
  try {
    const { user, response } = await requireAdminApi();
    if (response) return response;

    const { storeId } = await context.params;
    const store = await prisma.stores.findFirst({
      where: { id: storeId, distributor_id: user.distributorId },
      include: { store_accounts: true },
    });

    if (!store) return jsonError("Magasin introuvable.", 404);
    return NextResponse.json({ success: true, account: store.store_accounts });
  } catch (error) {
    return jsonError("Erreur serveur.", 500, error);
  }
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ storeId: string }> },
) {
  try {
    const { user, response } = await requireAdminApi();
    if (response) return response;

    const { storeId } = await context.params;
    const body = await req.json();
    const loginEmail = String(body.loginEmail || body.login_email || "").trim().toLowerCase();
    const password = String(body.password || "");
    const isActive = body.isActive ?? body.is_active ?? true;
    const mustChangePassword = body.mustChangePassword ?? body.must_change_password ?? true;

    if (!loginEmail) return jsonError("Email de connexion obligatoire.", 400);

    const store = await prisma.stores.findFirst({
      where: { id: storeId, distributor_id: user.distributorId },
      include: { store_accounts: true },
    });
    if (!store) return jsonError("Magasin introuvable.", 404);

    const account = await prisma.store_accounts.upsert({
      where: { store_id: storeId },
      create: {
        store_id: storeId,
        login_email: loginEmail,
        password_hash: password ? await bcrypt.hash(password, 10) : "",
        is_active: Boolean(isActive),
        must_change_password: Boolean(mustChangePassword),
      },
      update: {
        login_email: loginEmail,
        is_active: Boolean(isActive),
        must_change_password: Boolean(mustChangePassword),
        ...(password ? { password_hash: await bcrypt.hash(password, 10), password_updated_at: new Date() } : {}),
      },
    });

    return NextResponse.json({ success: true, account });
  } catch (error) {
    return jsonError("Erreur serveur.", 500, error);
  }
}

export const PATCH = PUT;
