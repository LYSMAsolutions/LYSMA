import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/auth-session";
import { validateCreateUserPayload } from "@/lib/validations/users";

export async function GET() {
  const session = await getCurrentSession();

  if (!session) {
    return NextResponse.json({ success: false, message: "Non authentifié." }, { status: 401 });
  }

  const users = await prisma.users.findMany({
    where: {
      distributor_id: session.user.distributorId,
    },
    orderBy: {
      created_at: "desc",
    },
    include: {
      roles: true,
    },
  });

  return NextResponse.json({
    success: true,
    users,
  });
}

export async function POST(req: NextRequest) {
  try {
    const session = await getCurrentSession();

    if (!session) {
      return NextResponse.json({ success: false, message: "Non authentifié." }, { status: 401 });
    }

    if (!["admin", "cdv"].includes(session.user.roleCode)) {
      return NextResponse.json({ success: false, message: "Accès refusé." }, { status: 403 });
    }

    const body = await req.json();
    const parsed = validateCreateUserPayload(body);

    if (!parsed.ok) {
      return NextResponse.json({ success: false, message: parsed.message }, { status: 400 });
    }

    const { firstName, lastName, email, phone, code, password, roleId, supervisorId, storeIds } = parsed.data;

    const existing = await prisma.users.findFirst({
      where: {
        distributor_id: session.user.distributorId,
        email,
      },
    });

    if (existing) {
      return NextResponse.json({ success: false, message: "Un utilisateur avec cet email existe déjà." }, { status: 409 });
    }

    const role = await prisma.roles.findUnique({
      where: {
        id: roleId,
      },
    });

    if (!role) {
      return NextResponse.json({ success: false, message: "Rôle introuvable." }, { status: 400 });
    }

    if (session.user.roleCode === "cdv" && role.code !== "atc") {
      return NextResponse.json({ success: false, message: "Un CDV peut uniquement creer un ATC." }, { status: 403 });
    }

    if (role.code === "atc" && !code) {
      return NextResponse.json({ success: false, message: "Le code ATC est obligatoire." }, { status: 400 });
    }

    if (role.code === "rdm" && !storeIds.length) {
      return NextResponse.json({ success: false, message: "Un RDM doit etre rattache a au moins un magasin." }, { status: 400 });
    }

    const finalSupervisorId = role.code === "atc"
      ? session.user.roleCode === "cdv"
        ? session.user.id
        : supervisorId
      : null;

    if (finalSupervisorId) {
      const supervisor = await prisma.users.findFirst({
        where: {
          id: finalSupervisorId,
          distributor_id: session.user.distributorId,
          roles: { code: "cdv" },
          is_active: true,
        },
        select: { id: true },
      });

      if (!supervisor) {
        return NextResponse.json({ success: false, message: "CDV superviseur introuvable." }, { status: 400 });
      }
    }

    let validStoreIds: string[] = [];
    if (storeIds.length && session.user.roleCode === "admin") {
      const stores = await prisma.stores.findMany({
        where: {
          distributor_id: session.user.distributorId,
          id: { in: storeIds },
        },
        select: { id: true },
      });
      validStoreIds = stores.map((store) => store.id);

      if (validStoreIds.length !== storeIds.length) {
        return NextResponse.json({ success: false, message: "Un magasin selectionne est introuvable." }, { status: 400 });
      }
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const created = await prisma.$transaction(async (tx) => {
      const user = await tx.users.create({
        data: {
          distributor_id: session.user.distributorId,
          role_id: role.id,
          first_name: firstName,
          last_name: lastName,
          email,
          password_hash: passwordHash,
          phone: phone || null,
          code: code || null,
          supervisor_id: finalSupervisorId,
          is_active: true,
          must_change_password: true,
        },
      });

      if (validStoreIds.length) {
        await tx.user_store_links.createMany({
          data: validStoreIds.map((storeId) => ({
            user_id: user.id,
            store_id: storeId,
          })),
          skipDuplicates: true,
        });
      }

      return user;
    });

    return NextResponse.json({
      success: true,
      userId: created.id,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Erreur serveur lors de la création de l'utilisateur.",
        error: error instanceof Error ? error.message : "unknown_error",
      },
      { status: 500 },
    );
  }
}
