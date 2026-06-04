import { createSiteDraftAction } from "./actions";

export default async function SiteCreatePage({
  searchParams,
}: {
  searchParams?: Promise<{ error?: string }>;
}) {
  const params = (await searchParams) ?? {};

  return (
    <section className="dashboard-grid">
      <article className="dashboard-card dashboard-card-wide">
        <span>Création de site</span>
        <h2>Générer un brouillon SiteConfig V2</h2>
        <p>
          Cette première étape crée une configuration brouillon à partir du modèle premium LYSMA. Le
          paiement, l’upload avancé, le drag and drop et l’avant/après autonome ne sont pas inclus.
        </p>
        {params.error ? <p className="lysma-auth-error">{params.error}</p> : null}
      </article>
      <form action={createSiteDraftAction} className="dashboard-card dashboard-card-wide dashboard-onboarding-form">
        <fieldset>
          <legend>Structure du site</legend>
          <label>
            <input type="radio" name="mode" value="singlePage" defaultChecked />
            Monopage
          </label>
          <label>
            <input type="radio" name="mode" value="multiPage" />
            Multipage
          </label>
        </fieldset>

        <div className="dashboard-form-grid">
          <label>
            Nom de l'entreprise
            <input name="name" type="text" maxLength={120} defaultValue="Nouveau Client" required />
          </label>
          <label>
            Slug URL
            <input name="slug" type="text" maxLength={80} defaultValue="nouveau-client" required />
          </label>
          <label>
            Activité
            <input name="businessType" type="text" maxLength={120} defaultValue="Entreprise locale" required />
          </label>
          <label>
            Logo URL
            <input name="logoUrl" type="text" maxLength={500} placeholder="/logo-client.png ou https://..." />
          </label>
        </div>

        <label>
          Phrase de présentation
          <textarea
            name="baseline"
            maxLength={220}
            rows={3}
            defaultValue="Une entreprise locale accompagnée par LYSMA avec un site premium clair, utile et évolutif."
            required
          />
        </label>

        <fieldset>
          <legend>Pages de base pour le mode multipage</legend>
          <label>
            <input type="checkbox" name="pages" value="accueil" defaultChecked />
            Accueil
          </label>
          <label>
            <input type="checkbox" name="pages" value="services" defaultChecked />
            Services
          </label>
          <label>
            <input type="checkbox" name="pages" value="realisations" defaultChecked />
            Réalisations
          </label>
          <label>
            <input type="checkbox" name="pages" value="contact" defaultChecked />
            Contact
          </label>
        </fieldset>

        <fieldset>
          <legend>Couleurs</legend>
          <div className="dashboard-color-grid">
            <label>
              Primaire
              <input name="primaryColor" type="color" defaultValue="#06182d" />
            </label>
            <label>
              Accent
              <input name="secondaryColor" type="color" defaultValue="#1e73d8" />
            </label>
            <label>
              Fond
              <input name="backgroundColor" type="color" defaultValue="#f6f8fb" />
            </label>
            <label>
              Texte
              <input name="textColor" type="color" defaultValue="#111827" />
            </label>
          </div>
        </fieldset>

        <button type="submit" className="lysma-ui-button lysma-ui-button-primary">
          Générer et prévisualiser
        </button>
      </form>
    </section>
  );
}
