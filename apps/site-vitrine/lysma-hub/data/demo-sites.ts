import type { SiteConfig } from "../lib/site-types";

export const demoSites: SiteConfig[] = [
  {
    version: "2",
    slug: "carrosserie-mounier",
    name: "Carrosserie Mounier",
    baseline: "Atelier carrosserie premium en Dordogne",
    businessType: "Carrosserie automobile",
    mode: "singlePage",
    theme: {
      primaryColor: "#383e42",
      secondaryColor: "#ff6a00",
      backgroundColor: "#f4f5f6",
      textColor: "#18212a",
      shadowColor: "#111827",
      headingFont: "Inter, system-ui, sans-serif",
      bodyFont: "Inter, system-ui, sans-serif",
      radius: "medium",
      style: "artisan",
    },
    navigation: {
      mode: "custom",
      items: [
        { id: "nav-home", label: "Accueil", pageSlug: "accueil", anchorId: "hero" },
        { id: "nav-services", label: "Prestations", pageSlug: "accueil", anchorId: "prestations" },
        { id: "nav-realisations", label: "Realisations", pageSlug: "accueil", anchorId: "realisations" },
        { id: "nav-avis", label: "Avis", pageSlug: "accueil", anchorId: "avis" },
        { id: "nav-contact", label: "Contact", pageSlug: "accueil", anchorId: "contact" },
      ],
    },
    pages: [
      {
        id: "home",
        slug: "accueil",
        title: "Carrosserie Mounier - Trelissac",
        description:
          "Reparation carrosserie, vitrage, renovation optique, covering, flocage et accompagnement assurance en Dordogne.",
        seo: {
          title: "Carrosserie Mounier - Atelier carrosserie a Trelissac",
          description:
            "Atelier carrosserie premium a Trelissac : reparation, peinture, vitrage, optiques, covering, flocage et accompagnement assurance.",
        },
        order: 1,
        enabled: true,
        showInNavigation: true,
        navigationLabel: "Accueil",
        sections: [
          {
            id: "hero",
            type: "hero",
            enabled: true,
            order: 1,
            anchorId: "hero",
            data: {
              eyebrow: "Atelier carrosserie premium en Dordogne",
              title: "Carrosserie Mounier - Trelissac",
              subtitle:
                "Reparation carrosserie, entretien, renovation optique, covering et flocage dans un atelier moderne, precis et oriente accompagnement client.",
              primaryCta: "Demander un devis",
              secondaryCta: "Voir les prestations",
              primaryCtaHref: "#contact",
              secondaryCtaHref: "#prestations",
              highlights: ["Carrosserie", "Vitrage", "Covering", "Assurance"],
            },
          },
          {
            id: "stats",
            type: "stats",
            enabled: true,
            order: 2,
            anchorId: "reperes",
            data: {
              items: [
                { value: "32", label: "Route du Pouyault, Trelissac" },
                { value: "4.8", label: "Avis clients" },
                { value: "360", label: "Accompagnement complet" },
              ],
            },
          },
          {
            id: "services",
            type: "services",
            enabled: true,
            order: 3,
            anchorId: "prestations",
            data: {
              eyebrow: "Prestations carrosserie",
              title: "L'activite carrosserie, d'abord.",
              description:
                "Reparation, vitrage, optiques, covering et flocage : l'atelier met en avant le soin de l'image et de la finition du vehicule.",
              items: [
                {
                  title: "Reparation carrosserie",
                  description:
                    "Diagnostic clair, reparation des impacts, rayures, pare-chocs et elements abimes avec une finition soignee.",
                  badge: "Finition",
                },
                {
                  title: "Peinture automobile",
                  description:
                    "Preparation, teinte et application pour retrouver une carrosserie coherente, propre et durable.",
                  badge: "Precision",
                },
                {
                  title: "Pare-brise et vitrage",
                  description:
                    "Accompagnement sur les impacts, fissures et demarches liees au vitrage ou au bris de glace.",
                  badge: "Conseil",
                },
                {
                  title: "Renovation optique",
                  description:
                    "Restauration des phares ternis pour ameliorer l'esthetique du vehicule et la visibilite.",
                  badge: "Securite",
                },
                {
                  title: "Covering automobile",
                  description:
                    "Protection, changement d'aspect ou personnalisation avec une approche propre et professionnelle.",
                  badge: "Image",
                },
                {
                  title: "Flocage vehicule",
                  description:
                    "Marquage pour entreprises, artisans et vehicules professionnels avec une identite lisible.",
                  badge: "Pro",
                },
              ],
            },
          },
          {
            id: "before-after",
            type: "beforeAfter",
            enabled: true,
            order: 4,
            anchorId: "avant-apres",
            data: {
              eyebrow: "Avant / apres",
              title: "Des reparations visibles, une finition maitrisee.",
              description:
                "Une section reservee aux realisations LYSMA quand le resultat visuel apporte une vraie preuve de qualite.",
              beforeLabel: "Avant reparation",
              afterLabel: "Apres finition",
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
              title: "Un atelier pense pour la confiance.",
              description:
                "Des exemples courts pour montrer le soin porte aux vehicules et aux demandes professionnelles.",
              items: [
                {
                  title: "Pare-chocs repris",
                  description: "Alignement, reparation et peinture localisee.",
                },
                {
                  title: "Optiques renovees",
                  description: "Phares eclaircis et aspect vehicule ameliore.",
                },
                {
                  title: "Vehicule professionnel",
                  description: "Marquage lisible et finition propre.",
                },
              ],
            },
          },
          {
            id: "reviews",
            type: "reviews",
            enabled: true,
            order: 6,
            anchorId: "avis",
            data: {
              eyebrow: "Avis clients",
              title: "Un accompagnement clair du premier echange a la restitution.",
              items: [
                {
                  author: "Client particulier",
                  rating: 5,
                  comment:
                    "Accueil serieux, explications claires et resultat propre apres reparation.",
                  context: "Reparation carrosserie",
                },
                {
                  author: "Artisan local",
                  rating: 5,
                  comment:
                    "Tres bon suivi pour le vehicule professionnel et une finition conforme aux attentes.",
                  context: "Flocage vehicule",
                },
                {
                  author: "Conductrice assuree",
                  rating: 5,
                  comment:
                    "L'equipe a facilite les demarches et m'a tenue informee a chaque etape.",
                  context: "Sinistre assurance",
                },
              ],
            },
          },
          {
            id: "contact",
            type: "contact",
            enabled: true,
            order: 7,
            anchorId: "contact",
            data: {
              eyebrow: "Contact",
              title: "Decrire le besoin et etre rappele.",
              description:
                "Le formulaire permet de transmettre une demande claire a l'atelier avec les informations utiles pour etre recontacte.",
              phone: "06 08 37 82 17",
              email: "contact@carrosserie-mounier.fr",
              address: "32 Route du Pouyault, 24750 Trelissac",
              hours: ["Lundi - Vendredi : 8h - 18h", "Samedi : sur rendez-vous"],
            },
          },
        ],
      },
    ],
  },
];

export const getDemoSiteBySlug = (slug: string) => demoSites.find((site) => site.slug === slug);
