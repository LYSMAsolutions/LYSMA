import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const garage = session.user as any;
  if (garage.role !== "ADMIN") return NextResponse.json({ error: "Admin requis" }, { status: 403 });

  const g = await prisma.garage.findUnique({
    where: { id: garage.garageId },
    select: { id: true, name: true, code: true, email: true, isActive: true, logoUrl: true },
  });

  return NextResponse.json({ garage: g });
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const garage = session.user as any;
  if (garage.role !== "ADMIN") return NextResponse.json({ error: "Admin requis" }, { status: 403 });

  const { name, email, adminPassword, atelierPassword } = await req.json();
  if (!name) return NextResponse.json({ error: "Nom du garage obligatoire" }, { status: 400 });

  const updates: any = { name };
  if (email) updates.email = email.toLowerCase();

  await prisma.garage.update({
    where: { id: garage.garageId },
    data: updates,
  });

if (adminPassword) {
  await prisma.$executeRaw`
    UPDATE "Garage"
    SET "adminPassword" = crypt(${adminPassword}, gen_salt('bf'))
    WHERE email = ${garage.email}
  `;
}

if (atelierPassword) {
  await prisma.$executeRaw`
    UPDATE "Garage"
    SET "atelierPassword" = crypt(${atelierPassword}, gen_salt('bf'))
    WHERE email = ${garage.email}
  `;
}

  return NextResponse.json({ success: true });
}
