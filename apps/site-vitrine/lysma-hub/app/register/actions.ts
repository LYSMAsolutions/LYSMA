"use server";

import { redirect } from "next/navigation";
import { sendVerificationEmail } from "../../lib/auth-mail";
import { createAuthToken, createAuthUser, appendSecurityEvent } from "../../lib/auth-store";
import { isValidEmail, normalizeEmail, sanitizePassword, validatePassword } from "../../lib/auth-validation";
import { sanitizeText } from "../../lib/security";
import { demoClientSites } from "../../data/client-platform-demo";

export async function registerAction(formData: FormData) {
  const email = normalizeEmail(formData.get("email"));
  const password = sanitizePassword(formData.get("password"));
  const siteSlug = sanitizeText(formData.get("siteSlug"), 80).toLowerCase() || null;

  if (!isValidEmail(email)) {
    redirect("/register?error=Email%20invalide");
  }

  const passwordError = validatePassword(password);

  if (passwordError) {
    redirect(`/register?error=${encodeURIComponent(passwordError)}`);
  }

  if (!siteSlug || !demoClientSites.some((site) => site.siteSlug === siteSlug)) {
    redirect("/register?error=Site%20client%20inconnu");
  }

  const user = await createAuthUser({ email, password, siteSlug });

  if (!user) {
    redirect("/register?error=Un%20compte%20existe%20deja%20avec%20cet%20email");
  }

  const { rawToken } = await createAuthToken(user.id, "email_verification");
  const emailResult = await sendVerificationEmail(user.email, rawToken);
  await appendSecurityEvent("email_verification_sent", user.id, user.email);

  if (!emailResult.sent && process.env.NODE_ENV !== "production") {
    redirect(`/verify-email?email=${encodeURIComponent(user.email)}&devToken=${encodeURIComponent(rawToken)}`);
  }

  redirect(`/verify-email?email=${encodeURIComponent(user.email)}`);
}
