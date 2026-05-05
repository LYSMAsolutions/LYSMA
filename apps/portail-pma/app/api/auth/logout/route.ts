import { NextResponse } from "next/server";
import { revokeCurrentSession } from "@/lib/auth-session";
import { getCurrentSession } from "@/lib/auth-session";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

export async function POST() {
  try {
    const session  = await getCurrentSession();
    const hdrs     = await headers();
    const ipAddress = hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
    const userAgent = hdrs.get("user-agent") ?? null;

    if (session) {
      await prisma.auth_logs.create({
        data: {
          distributor_id: session.user.distributorId,
          user_id:        session.user.id,
          actor_type:     "user",
          event_type:     "logout",
          success:        true,
          ip_address:     ipAddress,
          user_agent:     userAgent,
        },
      }).catch(() => {});
    }

    await revokeCurrentSession();
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}