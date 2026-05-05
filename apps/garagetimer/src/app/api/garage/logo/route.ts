import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const garage = session.user as any;
  if (garage.role !== "ADMIN") return NextResponse.json({ error: "Admin requis" }, { status: 403 });

  try {
    const formData = await req.formData();
    const file = formData.get("logo") as File;

    if (!file) return NextResponse.json({ error: "Fichier manquant" }, { status: 400 });

    const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp", "image/svg+xml"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "Format invalide (PNG, JPG, WEBP, SVG)" }, { status: 400 });
    }

    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json({ error: "Fichier trop lourd (max 2MB)" }, { status: 400 });
    }

    const ext = file.name.split(".").pop() || "png";
    const filename = `logo-${garage.garageId}.${ext}`;
    const logosDir = join(process.cwd(), "public", "logos");
    await mkdir(logosDir, { recursive: true });

    const bytes = await file.arrayBuffer();
    await writeFile(join(logosDir, filename), Buffer.from(bytes));

    const logoUrl = `/logos/${filename}`;

    await prisma.garage.update({
      where: { id: garage.garageId },
      data: { logoUrl },
    });

    return NextResponse.json({ success: true, logoUrl });
  } catch (e) {
    console.error("Upload logo error:", e);
    return NextResponse.json({ error: "Erreur lors de l'upload" }, { status: 500 });
  }
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const garage = session.user as any;

  const g = await prisma.garage.findUnique({
    where: { id: garage.garageId },
    select: { logoUrl: true },
  });

  return NextResponse.json({ logoUrl: g?.logoUrl || null });
}
