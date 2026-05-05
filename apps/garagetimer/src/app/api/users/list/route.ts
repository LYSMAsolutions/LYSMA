import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const garage = session.user as any;

  const users = await prisma.user.findMany({
    where: {
      garageId: garage.garageId,
      role: "ATELIER",
      isActive: true,
    },
    select: {
      id: true,
      nom: true,
      prenom: true,
      matricule: true,
      role: true,
      isActive: true,
    },
    orderBy: [{ prenom: "asc" }, { nom: "asc" }],
  });

  return NextResponse.json({ users });
}
