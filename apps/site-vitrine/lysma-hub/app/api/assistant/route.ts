import { NextResponse } from "next/server";
import { matchAssistantAnswer } from "../../../lib/keyword-matcher";
import { forwardChatLog } from "../../../lib/super-admin-chat-log";

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

  const payload = body as { siteSlug?: unknown; message?: unknown; conversationId?: unknown };
  const siteSlug = cleanText(payload.siteSlug, 80);
  const message = cleanText(payload.message, 320);
  const conversationId = cleanText(payload.conversationId, 160);

  if (!siteSlug || !message) {
    return NextResponse.json({ error: "siteSlug et message sont obligatoires." }, { status: 400 });
  }

  const result = matchAssistantAnswer(siteSlug, message);

  await forwardChatLog({
    source: `site-vitrine:${siteSlug}`,
    conversationId: conversationId || null,
    userPrompt: message,
    assistantResponse: result.answer,
    metadata: {
      app: "lysma-hub",
      route: "/api/assistant",
      siteSlug,
    },
  });

  return NextResponse.json(result);
}
