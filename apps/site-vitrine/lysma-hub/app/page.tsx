import { AppShell } from "../components/layout/app-shell";
import { SiteHeader } from "../components/layout/site-header";
import { FinalCtaSection } from "../components/sections/final-cta-section";
import { HeroSection } from "../components/sections/hero-section";
import { PageLinksSection } from "../components/sections/page-links-section";
import { lysmaHome } from "../data/lysma-home";
import { Badge } from "../components/ui/badge";
import { UiButtonLink } from "../components/ui/Button";
import { UiCard } from "../components/ui/Card";
import { SectionTitle } from "../components/ui/section-title";

export default function HubHomePage() {
  return (
    <AppShell>
      <SiteHeader
        eyebrow="Accueil"
        title="LYSMA Solutions"
        description="Une entrée claire vers nos sites premium, nos outils web métier et notre manière de travailler."
      />
      <HeroSection />
      <section className="lysma-section lysma-signature-band">
        <div>
          <p className="lysma-eyebrow">ADN LYSMA</p>
          <h2>{lysmaHome.promise.title}</h2>
          <p>{lysmaHome.promise.description}</p>
        </div>
        <div className="lysma-signature-list">
          {lysmaHome.promise.points.map((point) => (
            <span key={point}>{point}</span>
          ))}
        </div>
      </section>
      <section className="lysma-section">
        <SectionTitle
          eyebrow="Choisir son besoin"
          title="Chaque sujet a sa page."
          description="Nous avançons simplement : site web, outil web, méthode, réalisations et contact."
        />
        <div className="lysma-card-grid">
          {[
            { title: "Sites web", href: "/sites-web", tag: "Vitrine", text: lysmaHome.offers[0].description },
            { title: "Outils web", href: "/outils-web", tag: "Métier", text: lysmaHome.offers[1].description },
            { title: "Méthode", href: "/methode", tag: "Étapes", text: "Notre manière de transformer un besoin en projet clair." },
            { title: "Réalisations", href: "/realisations", tag: "Exemples", text: "Carrosserie Mounier et LIVO App, avec des aperçus réels." },
          ].map((item) => (
            <UiCard key={item.href}>
              <Badge>{item.tag}</Badge>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
              <UiButtonLink href={item.href} variant="ghost">
                Ouvrir la page
              </UiButtonLink>
            </UiCard>
          ))}
        </div>
      </section>
      <PageLinksSection
        title="Avancer dans le bon ordre"
        links={[
          {
            title: "Voir nos sites web",
            description: "Comprendre ce qui est inclus dans une vitrine premium.",
            href: "/sites-web",
            label: "Sites web",
          },
          {
            title: "Voir des exemples",
            description: "Découvrir Carrosserie Mounier et LIVO App.",
            href: "/realisations",
            label: "Réalisations",
          },
        ]}
      />
      <FinalCtaSection />
    </AppShell>
  );
}
