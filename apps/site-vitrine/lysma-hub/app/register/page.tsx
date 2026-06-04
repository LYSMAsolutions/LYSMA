import Link from "next/link";
import { AppShell } from "../../components/layout/app-shell";
import { registerAction } from "./actions";

export default async function RegisterPage({
  searchParams,
}: {
  searchParams?: Promise<{ error?: string }>;
}) {
  const params = (await searchParams) ?? {};

  return (
    <AppShell withFooter={false}>
      <section className="lysma-final-cta">
        <p className="lysma-eyebrow">Création de compte</p>
        <h2>Ouvrir un accès LYSMA Hub</h2>
        <p>
          Le compte doit être validé par email avant toute connexion. Chaque utilisateur reste rattaché
          à son propre site client.
        </p>
        {params.error ? <p className="lysma-auth-error">{params.error}</p> : null}
        <form action={registerAction} className="lysma-login-form">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" autoComplete="email" maxLength={160} required />
          <label htmlFor="siteSlug">Site client</label>
          <input
            id="siteSlug"
            name="siteSlug"
            type="text"
            defaultValue="carrosserie-mounier"
            maxLength={80}
            required
          />
          <label htmlFor="password">Mot de passe</label>
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
            Créer le compte
          </button>
        </form>
        <div className="lysma-auth-links">
          <Link href="/login">Nous avons déjà un compte</Link>
        </div>
      </section>
    </AppShell>
  );
}
