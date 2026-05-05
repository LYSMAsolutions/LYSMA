import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function requireAdmin(garage: any) {
  if (garage.role !== "ADMIN") return false;
  return true;
}

// GET — liste tous les utilisateurs du garage (admin)
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const garage = session.user as any;
  if (!requireAdmin(garage)) return NextResponse.json({ error: "Admin requis" }, { status: 403 });

  const users = await prisma.user.findMany({
    where: { garageId: garage.garageId },
    select: {
      id: true, nom: true, prenom: true, matricule: true,
      role: true, isActive: true, email: true,
      createdAt: true,
    },
    orderBy: [{ role: "asc" }, { prenom: "asc" }],
  });

  return NextResponse.json({ users });
}

// POST — créer un utilisateur
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const garage = session.user as any;
  if (!requireAdmin(garage)) return NextResponse.json({ error: "Admin requis" }, { status: 403 });

  const { nom, prenom, matricule, role, pinCode, email } = await req.json();

  if (!prenom) return NextResponse.json({ error: "Prénom obligatoire" }, { status: 400 });
  if (!matricule) return NextResponse.json({ error: "Matricule obligatoire" }, { status: 400 });
  if (pinCode && !/^\d{4,6}$/.test(pinCode)) return NextResponse.json({ error: "PIN invalide (4-6 chiffres)" }, { status: 400 });

  // Anti-doublon matricule dans le garage
  const existingMat = await prisma.user.findFirst({
    where: { garageId: garage.garageId, matricule: matricule.toUpperCase() },
  });
  if (existingMat) return NextResponse.json({ error: "Ce matricule existe déjà" }, { status: 400 });

  const user = await prisma.user.create({
    data: {
      garageId: garage.garageId,
      nom: nom?.toUpperCase() || null,
      prenom: prenom.trim(),
      matricule: matricule.toUpperCase(),
      role: role === "ADMIN" ? "ADMIN" : "ATELIER",
      pinCode: pinCode || null,
      email: email?.toLowerCase() || null,
      isActive: true,
    },
  });

  return NextResponse.json({ success: true, user });
}

// PUT — modifier un utilisateur
export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const garage = session.user as any;
  if (!requireAdmin(garage)) return NextResponse.json({ error: "Admin requis" }, { status: 403 });

  const { id, nom, prenom, matricule, role, pinCode, isActive } = await req.json();

  if (!id) return NextResponse.json({ error: "ID requis" }, { status: 400 });
  if (pinCode && !/^\d{4,6}$/.test(pinCode)) return NextResponse.json({ error: "PIN invalide" }, { status: 400 });

  // Vérifie que l'user appartient au garage
  const existing = await prisma.user.findFirst({ where: { id, garageId: garage.garageId } });
  if (!existing) return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });

  // Anti-doublon matricule
  if (matricule) {
    const dupMat = await prisma.user.findFirst({
      where: { garageId: garage.garageId, matricule: matricule.toUpperCase(), NOT: { id } },
    });
    if (dupMat) return NextResponse.json({ error: "Ce matricule existe déjà" }, { status: 400 });
  }

  const updated = await prisma.user.update({
    where: { id },
    data: {
      ...(nom !== undefined && { nom: nom?.toUpperCase() || null }),
      ...(prenom !== undefined && { prenom: prenom.trim() }),
      ...(matricule !== undefined && { matricule: matricule.toUpperCase() }),
      ...(role !== undefined && { role: role === "ADMIN" ? "ADMIN" : "ATELIER" }),
      ...(pinCode !== undefined && pinCode !== "" && { pinCode }),
      ...(isActive !== undefined && { isActive }),
    },
  });

  return NextResponse.json({ success: true, user: updated });
}

// DELETE — désactiver (toggle)
export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const garage = session.user as any;
  if (!requireAdmin(garage)) return NextResponse.json({ error: "Admin requis" }, { status: 403 });

  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "ID requis" }, { status: 400 });

  const existing = await prisma.user.findFirst({ where: { id, garageId: garage.garageId } });
  if (!existing) return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });

  const updated = await prisma.user.update({
    where: { id },
    data: { isActive: !existing.isActive },
  });

  return NextResponse.json({ success: true, isActive: updated.isActive });
}
