import Link from "next/link";
import { AppShell } from "../../components/layout/app-shell";
import { completePasswordResetAction, requestPasswordResetAction } from "./actions";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams?: Promise<{ token?: string; error?: string; sent?: string; devToken?: string }>;
}) {
  const params = (await searchParams) ?? {};
  const hasToken = Boolean(params.token);

  return (
    <AppShell withFooter={false}>
      <section className="lysma-final-cta">
        <p className="lysma-eyebrow">Sécurité</p>
        <h2>{hasToken ? "Choisir un nouveau mot de passe" : "Réinitialiser le mot de passe"}</h2>
        <p>
          Les liens de réinitialisation sont temporaires. Quand le mot de passe change, les sessions
          existantes sont révoquées.
        </p>
        {params.error ? <p className="lysma-auth-error">{params.error}</p> : null}
        {params.sent ? <p className="lysma-auth-success">Si le compte existe, un lien vient d’être envoyé.</p> : null}
        {params.devToken && process.env.NODE_ENV !== "production" ? (
          <Link className="lysma-ui-button lysma-ui-button-secondary" href={`/reset-password?token=${params.devToken}`}>
            Utiliser le lien local
          </Link>
        ) : null}
        {hasToken ? (
          <form action={completePasswordResetAction} className="lysma-login-form">
            <input type="hidden" name="token" value={params.token} />
            <label htmlFor="password">Nouveau mot de passe</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              minLength={10}
              maxLength={200}
              required
            />
            <button type="submit" className="lysma-ui-button lysma-ui-button-primary">
              Mettre à jour
            </button>
          </form>
        ) : (
          <form action={requestPasswordResetAction} className="lysma-login-form">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" autoComplete="email" maxLength={160} required />
            <button type="submit" className="lysma-ui-button lysma-ui-button-primary">
              Recevoir le lien
            </button>
          </form>
        )}
        <div className="lysma-auth-links">
          <Link href="/login">Retour à la connexion</Link>
        </div>
      </section>
    </AppShell>
  );
}
