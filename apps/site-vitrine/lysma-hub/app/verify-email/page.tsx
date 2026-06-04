import Link from "next/link";
import { redirect } from "next/navigation";
import { AppShell } from "../../components/layout/app-shell";
import { consumeAuthToken } from "../../lib/auth-store";

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams?: Promise<{ token?: string; email?: string; devToken?: string }>;
}) {
  const params = (await searchParams) ?? {};

  if (params.token) {
    const token = await consumeAuthToken(params.token, "email_verification");

    if (token) {
      redirect("/login?verified=1");
    }
  }

  return (
    <AppShell withFooter={false}>
      <section className="lysma-final-cta">
        <p className="lysma-eyebrow">Vérification email</p>
        <h2>Validez votre adresse email</h2>
        <p>
          Un lien de validation vient d’être envoyé
          {params.email ? ` à ${params.email}` : ""}. Le dashboard restera bloqué tant que l’email
          n’est pas validé.
        </p>
        {params.token ? <p className="lysma-auth-error">Lien invalide ou expiré.</p> : null}
        {params.devToken && process.env.NODE_ENV !== "production" ? (
          <Link className="lysma-ui-button lysma-ui-button-primary" href={`/verify-email?token=${params.devToken}`}>
            Valider le compte en local
          </Link>
        ) : null}
        <div className="lysma-auth-links">
          <Link href="/login">Retour à la connexion</Link>
        </div>
      </section>
    </AppShell>
  );
}
