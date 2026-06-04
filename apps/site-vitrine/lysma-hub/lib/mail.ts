type ContactPayload = {
  siteSlug: string;
  name: string;
  email?: string;
  phone?: string;
  message: string;
};

export const sendContactMail = async (payload: ContactPayload) => {
  const resendApiKey = process.env.RESEND_API_KEY;

  if (!resendApiKey) {
    return {
      sent: false,
      provider: "none",
      reason: "RESEND_API_KEY is not configured",
      payload,
    };
  }

  return {
    sent: false,
    provider: "resend",
    reason: "Resend integration is prepared but intentionally disabled in V1",
    payload,
  };
};
