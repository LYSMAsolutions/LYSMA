import Link from "next/link";
import { AppShell } from "../../components/layout/app-shell";
import { loginAction } from "./actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams?: Promise<{ error?: string; verified?: string; reset?: string }>;
}) {
  const params = (await searchParams) ?? {};

  return (
    <AppShell withFooter={false}>
      <section className="lysma-final-cta">
        <p className="lysma-eyebrow">LYSMA Hub</p>
        <h2>Espace client sécurisé</h2>
        <p>
          Connectez-vous avec un compte valide. L’accès au dashboard est protégé côté serveur et
          réservé aux emails vérifiés.
        </p>
        {params.error ? <p className="lysma-auth-error">{params.error}</p> : null}
        {params.verified ? <p className="lysma-auth-success">Email validé. Vous pouvez vous connecter.</p> : null}
        {params.reset ? <p className="lysma-auth-success">Mot de passe mis à jour. Vous pouvez vous connecter.</p> : null}
        <form action={loginAction} className="lysma-login-form">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" autoComplete="email" maxLength={160} required />
          <label htmlFor="password">Mot de passe</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            minLength={10}
            maxLength={200}
            required
          />
          <button type="submit" className="lysma-ui-button lysma-ui-button-primary">
            Se connecter
          </button>
        </form>
        <div className="lysma-auth-links">
          <Link href="/register">Créer un compte</Link>
          <Link href="/reset-password">Mot de passe oublié</Link>
        </div>
        <p className="lysma-auth-hint">Compte démo : client@carrosserie-mounier.fr / LysmaDemo2026!</p>
      </section>
    </AppShell>
  );
}
