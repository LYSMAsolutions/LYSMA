import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const sessions = await prisma.auth_sessions.findMany({
    orderBy: {
      updated_at: "desc",
    },
    take: 100,
  });

  return NextResponse.json({
    success: true,
    sessions,
  });
}