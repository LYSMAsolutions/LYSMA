import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ session: null });
  }

  const user = session.user as any;

  const openSession = await prisma.session.findFirst({
    where: { userId: user.id, status: "OPEN" },
  });

  return NextResponse.json({ session: openSession });
}
