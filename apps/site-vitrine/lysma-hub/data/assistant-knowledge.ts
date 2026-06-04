import type { AssistantRule } from "../lib/site-types";

export const assistantKnowledge: AssistantRule[] = [
  {
    id: "mounier-devis",
    siteSlug: "carrosserie-mounier",
    keywords: ["devis", "prix", "tarif", "combien", "cout"],
    answer:
      "Pour un devis fiable, l'atelier a besoin de quelques informations sur le véhicule et les dégâts visibles. Vous pouvez envoyer votre demande avec vos coordonnées, idéalement avec des photos.",
    action: { label: "Demander un devis", type: "contact" },
  },
  {
    id: "mounier-photo",
    siteSlug: "carrosserie-mounier",
    keywords: ["photo", "image", "degat", "envoyer", "piece jointe"],
    answer:
      "Vous pouvez préparer des photos nettes de loin et de près : vue globale du véhicule, détail de la zone touchée, plaque ou modèle si utile. L'atelier pourra vous orienter plus rapidement.",
    action: { label: "Envoyer une photo", type: "photo" },
  },
  {
    id: "mounier-carrosserie",
    siteSlug: "carrosserie-mounier",
    keywords: ["rayure", "raye", "griffe", "pare-chocs", "peinture", "carrosserie"],
    answer:
      "La Carrosserie Mounier traite les rayures, chocs, pare-chocs et reprises peinture avec une approche de finition soignée. Le mieux est de décrire la zone touchée et d'ajouter des photos.",
    action: { label: "Décrire les dégâts", type: "contact" },
  },
  {
    id: "mounier-assurance",
    siteSlug: "carrosserie-mounier",
    keywords: ["assurance", "sinistre", "expert", "constat", "remboursement"],
    answer:
      "En cas de sinistre, l'atelier peut vous accompagner dans les échanges avec l'assurance et l'expert. Indiquez votre situation, votre assureur et l'état du dossier dans votre message.",
    action: { label: "Contacter l'atelier", type: "contact" },
  },
  {
    id: "mounier-horaires",
    siteSlug: "carrosserie-mounier",
    keywords: ["horaire", "ouvert", "ferme", "samedi", "contact", "telephone"],
    answer:
      "Pour les horaires et disponibilités, le plus fiable reste de joindre directement l'atelier. Vous pouvez appeler ou laisser une demande, l'équipe vous recontactera rapidement.",
    action: { label: "Appeler l'atelier", type: "phone" },
  },
  {
    id: "mounier-vitrage",
    siteSlug: "carrosserie-mounier",
    keywords: ["pare-brise", "vitrage", "impact", "fissure", "vitre"],
    answer:
      "L'atelier peut vous orienter pour le vitrage, les impacts et les fissures. Précisez la zone concernée, le modèle du véhicule et si votre assurance bris de glace est activée.",
    action: { label: "Demander un avis", type: "contact" },
  },
  {
    id: "mounier-optiques",
    siteSlug: "carrosserie-mounier",
    keywords: ["renovation", "optique", "phare", "phares", "terni"],
    answer:
      "La rénovation d'optiques permet d'améliorer l'aspect et la visibilité lorsque les phares sont ternis. Envoyez une photo de face et de côté pour un premier avis.",
    action: { label: "Envoyer une demande", type: "photo" },
  },
];
