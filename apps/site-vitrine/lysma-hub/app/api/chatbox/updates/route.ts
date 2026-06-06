import { NextRequest, NextResponse } from "next/server";

const getEndpoint = () =>
  process.env.SUPER_ADMIN_CHATBOX_UPDATES_URL ||
  process.env.SUPER_ADMIN_CHATBOX_LOG_URL?.replace(/\/logs\/?$/, "/updates") ||
  "";

const cleanId = (value: string | null, maxLength = 160) =>
  (value || "").replace(/[^a-z0-9:_-]/gi, "").slice(0, maxLength);

export async function GET(request: NextRequest) {
  const endpoint = getEndpoint();
  const visitorId = cleanId(request.nextUrl.searchParams.get("visitorId"));
  if (!endpoint || !visitorId) {
    return NextResponse.json({ updates: [] });
  }

  const url = new URL(endpoint);
  url.searchParams.set("source", "site-vitrine:lysma-hub");
  url.searchParams.set("visitorId", visitorId);

  const response = await fetch(url, {
    headers: authHeaders(),
    cache: "no-store",
  }).catch(() => null);

  if (!response?.ok) {
    return NextResponse.json({ updates: [] });
  }

  return NextResponse.json(await response.json());
}

export async function POST(request: NextRequest) {
  const endpoint = getEndpoint();
  if (!endpoint) {
    return NextResponse.json({ success: true });
  }

  const body = await request.json().catch(() => null) as { visitorId?: unknown; updateId?: unknown } | null;
  const visitorId = cleanId(typeof body?.visitorId === "string" ? body.visitorId : null);
  const updateId = cleanId(typeof body?.updateId === "string" ? body.updateId : null);
  if (!visitorId || !updateId) {
    return NextResponse.json({ success: true });
  }

  await fetch(endpoint, {
    method: "POST",
    headers: {
      ...authHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      source: "site-vitrine:lysma-hub",
      visitorId,
      updateId,
    }),
    cache: "no-store",
  }).catch(() => null);

  return NextResponse.json({ success: true });
}

function authHeaders() {
  const headers: Record<string, string> = {};
  if (process.env.SUPER_ADMIN_INBOUND_SECRET) {
    headers["x-lysma-inbound-secret"] = process.env.SUPER_ADMIN_INBOUND_SECRET;
  }
  return headers;
}
