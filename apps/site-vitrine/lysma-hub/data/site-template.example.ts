import { createDefaultSiteConfig } from "../lib/create-default-site-config";
import type { SiteConfig } from "../lib/site-types";

/**
 * Template de creation d'un site client.
 *
 * Utilisation recommandee :
 * 1. Dupliquer ce fichier dans `data/`, par exemple `garage-dupont.ts`.
 * 2. Remplacer le `slug`, le `name`, la `baseline`, le `businessType` et les textes.
 * 3. Ajouter le SiteConfig final dans `demo-sites.ts` quand le client doit etre rendu.
 *
 * Champs a modifier sans risque :
 * - textes, CTA, highlights, services, realisations, avis, contact, horaires
 * - pages, sous-pages, navigation, sections et blocs
 * - couleurs du theme, polices, radius et style
 * - `enabled` pour masquer une section
 * - `order` pour changer l'ordre d'affichage
 *
 * Champs a modifier avec prudence :
 * - `slug`, car il determine l'URL `/site/[slug]` et doit rester unique
 * - `type`, car il doit rester dans les sections supportees par SiteRenderer
 * - la forme de `data`, car elle depend du `type` de section
 * - les composants premium reserves LYSMA, comme l'avant/apres ou les animations avancees
 */
export const siteTemplateExample: SiteConfig = createDefaultSiteConfig({
  slug: "nouveau-client",
  name: "Nouveau Client",
  baseline: "Entreprise locale accompagnee par LYSMA",
  businessType: "Metier du client",
  mode: "singlePage",
  navigation: {
    mode: "custom",
    items: [
      { id: "nav-home", label: "Accueil", pageSlug: "accueil", anchorId: "hero" },
      { id: "nav-services", label: "Services", pageSlug: "accueil", anchorId: "services" },
      { id: "nav-realisations", label: "Realisations", pageSlug: "accueil", anchorId: "realisations" },
      { id: "nav-contact", label: "Contact", pageSlug: "accueil", anchorId: "contact" },
    ],
  },
  theme: {
    primaryColor: "#06182d",
    secondaryColor: "#1e73d8",
    backgroundColor: "#f6f8fb",
    textColor: "#111827",
    shadowColor: "#0f172a",
    headingFont: "Inter, system-ui, sans-serif",
    bodyFont: "Inter, system-ui, sans-serif",
    radius: "medium",
    style: "premium",
  },
  sections: [
    {
      id: "hero",
      type: "hero",
      enabled: true,
      order: 1,
      anchorId: "hero",
      data: {
        eyebrow: "Entreprise locale",
        title: "Nouveau Client",
        subtitle:
          "Une phrase claire qui explique l'activite, la valeur ajoutee et la zone d'intervention.",
        primaryCta: "Demander un devis",
        secondaryCta: "Voir les services",
        primaryCtaHref: "#contact",
        secondaryCtaHref: "#services",
        highlights: ["Service cle", "Accompagnement", "Devis rapide"],
      },
    },
    {
      id: "services",
      type: "services",
      enabled: true,
      order: 2,
      anchorId: "services",
      data: {
        eyebrow: "Services",
        title: "Les prestations principales.",
        description:
          "Presenter ici les offres les plus importantes pour le client final.",
        items: [
          {
            title: "Prestation 1",
            description: "Description courte de la prestation et du benefice client.",
            badge: "Essentiel",
          },
          {
            title: "Prestation 2",
            description: "Description courte de la prestation et du benefice client.",
            badge: "Sur mesure",
          },
          {
            title: "Prestation 3",
            description: "Description courte de la prestation et du benefice client.",
            badge: "Conseil",
          },
        ],
      },
    },
    {
      id: "content",
      type: "contentBlocks",
      enabled: true,
      order: 3,
      anchorId: "presentation",
      data: {
        eyebrow: "Presentation",
        title: "Une page composee avec des blocs.",
        description:
          "Les blocs permettent d'ajouter du contenu sans creer un composant specifique a chaque client.",
        blocks: [
          {
            id: "content-intro",
            type: "text",
            enabled: true,
            order: 1,
            data: {
              eyebrow: "Contexte",
              title: "Ce que le client doit comprendre rapidement.",
              body: "Expliquez ici le positionnement, la facon de travailler ou l'avantage principal de l'entreprise.",
            },
          },
          {
            id: "content-benefits",
            type: "featureGrid",
            enabled: true,
            order: 2,
            data: {
              title: "Points forts",
              items: [
                {
                  title: "Clarte",
                  description: "Une information bien rangee pour aider le visiteur a se projeter.",
                  badge: "UX",
                },
                {
                  title: "Confiance",
                  description: "Des preuves simples, des textes utiles et une navigation evidente.",
                  badge: "Premium",
                },
              ],
            },
          },
        ],
      },
    },
    {
      id: "stats",
      type: "stats",
      enabled: true,
      order: 4,
      anchorId: "reperes",
      data: {
        items: [
          { value: "10+", label: "Annees d'experience" },
          { value: "24h", label: "Reponse rapide" },
          { value: "100%", label: "Suivi client" },
        ],
      },
    },
    {
      id: "gallery",
      type: "gallery",
      enabled: true,
      order: 5,
      anchorId: "realisations",
      data: {
        eyebrow: "Realisations",
        title: "Exemples de projets.",
        description: "Quelques cas simples pour rendre l'activite concrete.",
        items: [
          { title: "Projet 1", description: "Resultat ou contexte client." },
          { title: "Projet 2", description: "Resultat ou contexte client." },
          { title: "Projet 3", description: "Resultat ou contexte client." },
        ],
      },
    },
    {
      id: "before-after",
      type: "beforeAfter",
      enabled: false,
      order: 6,
      anchorId: "avant-apres",
      data: {
        eyebrow: "Avant / apres",
        title: "Une transformation visible.",
        description:
          "Activez cette section pour les metiers avec resultats visuels forts.",
        beforeLabel: "Avant",
        afterLabel: "Apres",
      },
    },
    {
      id: "reviews",
      type: "reviews",
      enabled: true,
      order: 7,
      anchorId: "avis",
      data: {
        eyebrow: "Avis clients",
        title: "Des retours clients rassurants.",
        items: [
          {
            author: "Client exemple",
            rating: 5,
            comment: "Experience claire, professionnelle et efficace.",
            context: "Avis exemple",
          },
        ],
      },
    },
    {
      id: "contact",
      type: "contact",
      enabled: true,
      order: 8,
      anchorId: "contact",
      data: {
        eyebrow: "Contact",
        title: "Demander un renseignement.",
        description:
          "Le formulaire permet de qualifier simplement la demande client.",
        phone: "00 00 00 00 00",
        email: "contact@example.com",
        address: "Adresse du client",
        hours: ["Lundi - Vendredi : 9h - 18h"],
      },
    },
  ],
});
