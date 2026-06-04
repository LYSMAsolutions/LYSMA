"use server";

import { redirect } from "next/navigation";
import { startAuthenticatedSession, endAuthenticatedSession } from "../../lib/auth";
import { normalizeEmail, sanitizePassword } from "../../lib/auth-validation";

export async function loginAction(formData: FormData) {
  const email = normalizeEmail(formData.get("email"));
  const password = sanitizePassword(formData.get("password"));
  const result = await startAuthenticatedSession(email, password);

  if (!result.ok) {
    redirect(`/login?error=${encodeURIComponent(result.message)}`);
  }

  redirect("/dashboard");
}

export async function endDemoSession() {
  await endAuthenticatedSession();
  redirect("/login");
}

export const logoutAction = endDemoSession;
