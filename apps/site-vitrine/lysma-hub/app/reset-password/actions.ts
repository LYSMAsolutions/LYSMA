"use server";

import { redirect } from "next/navigation";
import { sendPasswordResetEmail } from "../../lib/auth-mail";
import {
  appendSecurityEvent,
  createAuthToken,
  findAuthUserByEmail,
  updatePasswordWithToken,
} from "../../lib/auth-store";
import { isValidEmail, normalizeEmail, sanitizePassword, validatePassword } from "../../lib/auth-validation";

export async function requestPasswordResetAction(formData: FormData) {
  const email = normalizeEmail(formData.get("email"));

  if (!isValidEmail(email)) {
    redirect("/reset-password?sent=1");
  }

  const user = await findAuthUserByEmail(email);

  if (user) {
    const { rawToken } = await createAuthToken(user.id, "password_reset");
    const emailResult = await sendPasswordResetEmail(user.email, rawToken);
    await appendSecurityEvent("password_reset_requested", user.id, user.email);

    if (!emailResult.sent && process.env.NODE_ENV !== "production") {
      redirect(`/reset-password?sent=1&devToken=${encodeURIComponent(rawToken)}`);
    }
  }

  redirect("/reset-password?sent=1");
}

export async function completePasswordResetAction(formData: FormData) {
  const token = sanitizePassword(formData.get("token"));
  const password = sanitizePassword(formData.get("password"));
  const passwordError = validatePassword(password);

  if (passwordError) {
    redirect(`/reset-password?token=${encodeURIComponent(token)}&error=${encodeURIComponent(passwordError)}`);
  }

  const user = await updatePasswordWithToken(token, password);

  if (!user) {
    redirect("/reset-password?error=Lien%20invalide%20ou%20expir%C3%A9");
  }

  redirect("/login?reset=1");
}
