import { NextResponse } from "next/server";
import { forwardChatLog } from "../../../../lib/super-admin-chat-log";

const cleanText = (value: unknown, maxLength: number) =>
  typeof value === "string"
    ? value.replace(/[<>]/g, "").replace(/\s+/g, " ").trim().slice(0, maxLength)
    : "";

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON invalide." }, { status: 400 });
  }

  const payload = body as {
    conversationId?: unknown;
    userPrompt?: unknown;
    assistantResponse?: unknown;
    source?: unknown;
  };
  const conversationId = cleanText(payload.conversationId, 160);
  const userPrompt = cleanText(payload.userPrompt, 320);
  const assistantResponse = cleanText(payload.assistantResponse, 2000);
  const source = cleanText(payload.source, 80) || "site-vitrine:lysma-hub";

  if (!userPrompt) {
    return NextResponse.json({ error: "userPrompt est obligatoire." }, { status: 400 });
  }

  await forwardChatLog({
    source,
    conversationId: conversationId || null,
    userPrompt,
    assistantResponse,
    metadata: {
      app: "lysma-hub",
      route: "/api/chatbox/log",
    },
  });

  return NextResponse.json({ success: true });
}
