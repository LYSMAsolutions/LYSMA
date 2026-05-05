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

    if (session.user.roleCode !== "admin") {
      return NextResponse.json({ success: false, message: "Accès refusé." }, { status: 403 });
    }

    const body = await req.json();
    const parsed = validateCreateUserPayload(body);

    if (!parsed.ok) {
      return NextResponse.json({ success: false, message: parsed.message }, { status: 400 });
    }

    const { firstName, lastName, email, phone, code, password, roleId } = parsed.data;

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

    const passwordHash = await bcrypt.hash(password, 10);

    const created = await prisma.users.create({
      data: {
        distributor_id: session.user.distributorId,
        role_id: role.id,
        first_name: firstName,
        last_name: lastName,
        email,
        password_hash: passwordHash,
        phone: phone || null,
        code: code || null,
        is_active: true,
        must_change_password: true,
      },
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
