import { AppShell } from "../../components/layout/app-shell";
import { SiteHeader } from "../../components/layout/site-header";

export default function PrivacyCookiesPage() {
  return (
    <AppShell>
      <SiteHeader
        eyebrow="Confidentialité"
        title="Confidentialité et cookies"
        description="Cette page explique les principes appliqués par LYSMA Solutions concernant les données personnelles et les cookies."
      />

      <section className="lysma-section lysma-legal-page">
        <article className="lysma-ui-card">
          <h2>Données personnelles</h2>
          <p>
            Les données transmises via les formulaires sont utilisées uniquement pour répondre aux
            demandes envoyées à LYSMA Solutions. Elles ne sont pas vendues ni partagées à des fins
            commerciales externes.
          </p>
        </article>

        <article className="lysma-ui-card">
          <h2>Cookies nécessaires</h2>
          <p>
            Le site peut utiliser des données locales nécessaires au bon fonctionnement de
            l’interface, par exemple pour mémoriser le choix lié aux cookies ou préserver un
            formulaire lors d’une mise à jour.
          </p>
        </article>

        <article className="lysma-ui-card">
          <h2>Chatbox V3</h2>
          <p>
            Les échanges avec la chatbox peuvent être enregistrés afin d’améliorer la qualité des réponses. Un identifiant anonyme peut être utilisé pour vous signaler, lors d’une prochaine visite, qu’une réponse à votre question a été améliorée. Cet identifiant ne permet pas de vous identifier personnellement et n’est pas utilisé à des fins publicitaires.
          </p>
          <p>
            Depuis la chatbox, vous pouvez choisir de ne pas conserver votre conversation. Cela supprime l’identifiant anonyme local et désactive les notifications de réponse améliorée pour ce navigateur.
          </p>
        </article>

        <article className="lysma-ui-card">
          <h2>Cookies optionnels</h2>
          <p>
            Les outils d’audience, pixels publicitaires ou services externes de suivi ne doivent
            être activés qu’après accord explicite de l’utilisateur.
          </p>
        </article>

        <article className="lysma-ui-card">
          <h2>Contact</h2>
          <p>
            Pour toute demande liée aux données personnelles ou aux cookies, vous pouvez écrire à
            LYSMA Solutions : lysmasolutions@gmail.com.
          </p>
        </article>
      </section>
    </AppShell>
  );
}
