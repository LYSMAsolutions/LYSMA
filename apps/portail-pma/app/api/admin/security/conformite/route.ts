import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const [documents, acceptances] = await Promise.all([
    prisma.legal_documents.findMany({
      orderBy: {
        published_at: "desc",
      },
    }),
    prisma.legal_acceptances.findMany({
      orderBy: {
        accepted_at: "desc",
      },
    }),
  ]);

  return NextResponse.json({
    success: true,
    documents,
    acceptances,
  });
}