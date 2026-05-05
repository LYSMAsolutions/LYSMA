import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const [usersLocked, storeAccountsLocked, staffLocked] = await Promise.all([
    prisma.users.findMany({
      where: {
        locked_until: { not: null },
      },
    }),
    prisma.store_accounts.findMany({
      where: {
        locked_until: { not: null },
      },
    }),
    prisma.store_staff.findMany({
      where: {
        locked_until: { not: null },
      },
    }),
  ]);

  return NextResponse.json({
    success: true,
    usersLocked,
    storeAccountsLocked,
    staffLocked,
  });
}