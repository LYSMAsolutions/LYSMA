import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const authLogs = await prisma.auth_logs.findMany({
    orderBy: {
      event_at: "desc",
    },
    take: 100,
  });

  const errorLogs = await prisma.error_logs.findMany({
    orderBy: {
      created_at: "desc",
    },
    take: 100,
  });

  return NextResponse.json({
    success: true,
    authLogs,
    errorLogs,
  });
}