import { NextResponse } from "next/server";
import { sendContactMail } from "../../../lib/mail";

const cleanText = (value: unknown, maxLength: number) =>
  typeof value === "string"
    ? value.replace(/[<>]/g, "").replace(/\s+/g, " ").trim().slice(0, maxLength)
    : "";

const isValidEmail = (email: string) => !email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: "JSON invalide." }, { status: 400 });
  }

  const payload = body as {
    siteSlug?: unknown;
    name?: unknown;
    email?: unknown;
    phone?: unknown;
    message?: unknown;
  };

  const contact = {
    siteSlug: cleanText(payload.siteSlug, 80),
    name: cleanText(payload.name, 90),
    email: cleanText(payload.email, 120),
    phone: cleanText(payload.phone, 40),
    message: cleanText(payload.message, 1400),
  };

  if (!contact.siteSlug || !contact.name || !contact.message) {
    return NextResponse.json(
      { success: false, error: "Le nom, le site et le message sont obligatoires." },
      { status: 400 },
    );
  }

  if (!isValidEmail(contact.email)) {
    return NextResponse.json({ success: false, error: "L'adresse email est invalide." }, { status: 400 });
  }

  await sendContactMail(contact);

  return NextResponse.json({ success: true });
}
