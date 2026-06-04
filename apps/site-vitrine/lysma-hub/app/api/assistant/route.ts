import { NextResponse } from "next/server";
import { matchAssistantAnswer } from "../../../lib/keyword-matcher";

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

  const payload = body as { siteSlug?: unknown; message?: unknown };
  const siteSlug = cleanText(payload.siteSlug, 80);
  const message = cleanText(payload.message, 320);

  if (!siteSlug || !message) {
    return NextResponse.json({ error: "siteSlug et message sont obligatoires." }, { status: 400 });
  }

  return NextResponse.json(matchAssistantAnswer(siteSlug, message));
}
