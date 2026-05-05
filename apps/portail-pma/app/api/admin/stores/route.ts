import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/auth-session";

export async function POST(req: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session || session.user.roleCode !== "admin")
      return NextResponse.json({ success: false, message: "Accès refusé." }, { status: 403 });

    const body = await req.json();
    const code   = String(body.code || "").trim().toUpperCase();
    const name   = String(body.name || "").trim();
    const email  = String(body.email || "").trim().toLowerCase() || null;
    const phone  = String(body.phone || "").trim() || null;
    const addr1  = String(body.addr1 || "").trim() || null;
    const addr2  = String(body.addr2 || "").trim() || null;
    const postal = String(body.postal || "").trim() || null;
    const city   = String(body.city || "").trim() || null;
    const rdmId  = String(body.rdmId || "").trim() || null;
    const internalCode = String(body.internalCode || "").trim() || null;
    const storeType    = ["standard", "sav"].includes(body.storeType) ? body.storeType : "standard";

    if (!code || !name)
      return NextResponse.json({ success: false, message: "Code et nom obligatoires." }, { status: 400 });

    const existing = await prisma.stores.findFirst({
      where: { distributor_id: session.user.distributorId, code },
    });
    if (existing)
      return NextResponse.json({ success: false, message: "Un magasin avec ce code existe déjà." }, { status: 409 });

    const store = await prisma.$transaction(async (tx) => {
      const created = await tx.stores.create({
        data: {
                distributor_id: session.user.distributorId,
                code, name, email, phone,
                address_line_1: addr1, address_line_2: addr2,
                postal_code: postal, city,
                internal_code: internalCode,
                store_type:    storeType,
              },
      });

      if (rdmId) {
        await tx.user_store_links.create({
          data: { user_id: rdmId, store_id: created.id },
        });
      }

      return created;
    });

    return NextResponse.json({ success: true, storeId: store.id });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Erreur serveur.", error: error instanceof Error ? error.message : "unknown" }, { status: 500 });
  }
}