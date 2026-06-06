import { NextResponse } from "next/server";
import { buildChatboxLogMetadata } from "../../../../lib/chatbox-log-metadata";
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
    visitorId?: unknown;
    sessionId?: unknown;
    questionSignature?: unknown;
    userPrompt?: unknown;
    assistantResponse?: unknown;
    quality?: unknown;
    qualityNotes?: unknown;
    problemType?: unknown;
    source?: unknown;
    metadata?: unknown;
  };
  const conversationId = cleanText(payload.conversationId, 160);
  const visitorId = cleanText(payload.visitorId, 160);
  const sessionId = cleanText(payload.sessionId, 160);
  const questionSignature = cleanText(payload.questionSignature, 220);
  const userPrompt = cleanText(payload.userPrompt, 320);
  const assistantResponse = cleanText(payload.assistantResponse, 2000);
  const quality = cleanText(payload.quality, 20);
  const qualityNotes = cleanText(payload.qualityNotes, 2000);
  const problemType = cleanText(payload.problemType, 40);
  const source = cleanText(payload.source, 80) || "site-vitrine:lysma-hub";

  if (!userPrompt) {
    return NextResponse.json({ error: "userPrompt est obligatoire." }, { status: 400 });
  }

  await forwardChatLog({
    source,
    conversationId: conversationId || null,
    visitorId: visitorId || null,
    sessionId: sessionId || null,
    questionSignature: questionSignature || null,
    userPrompt,
    assistantResponse,
    quality: isQuality(quality) ? quality : undefined,
    qualityNotes: qualityNotes || null,
    problemType: isProblemType(problemType) ? problemType : undefined,
    metadata: buildChatboxLogMetadata(payload.metadata, {
      app: "lysma-hub",
      route: "/api/chatbox/log",
    }),
  });

  return NextResponse.json({ success: true });
}

function isQuality(value: string): value is "UNKNOWN" | "GOOD" | "BAD" {
  return value === "UNKNOWN" || value === "GOOD" || value === "BAD";
}

function isProblemType(
  value: string,
): value is "DUPLICATE" | "USER_REPORTED" | "MISUNDERSTANDING" | "LOST_CONTEXT" | "USER_NEGATIVE_FEEDBACK" | "FALLBACK" | "OTHER" {
  return [
    "DUPLICATE",
    "USER_REPORTED",
    "MISUNDERSTANDING",
    "LOST_CONTEXT",
    "USER_NEGATIVE_FEEDBACK",
    "FALLBACK",
    "OTHER",
  ].includes(value);
}
