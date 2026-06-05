import type { AssistantRule } from "../lib/site-types";

export const assistantKnowledge: AssistantRule[] = [
  {
    id: "mounier-devis",
    siteSlug: "carrosserie-mounier",
    keywords: ["devis", "prix", "tarif", "combien", "cout"],
    answer:
      "Pour chiffrer correctement, l'atelier a besoin du véhicule, des dégâts visibles et de vos coordonnées. Si vous pouvez ajouter des photos, c'est encore mieux : l'équipe pourra vous orienter plus vite.",
    action: { label: "Demander un devis", type: "contact" },
  },
  {
    id: "mounier-photo",
    siteSlug: "carrosserie-mounier",
    keywords: ["photo", "image", "degat", "envoyer", "piece jointe"],
    answer:
      "Oui, vous pouvez préparer des photos nettes : une vue globale du véhicule, une photo proche de la zone touchée, et le modèle si utile. Ça aide l'atelier à comprendre la demande avant de vous rappeler.",
    action: { label: "Envoyer une photo", type: "photo" },
  },
  {
    id: "mounier-carrosserie",
    siteSlug: "carrosserie-mounier",
    keywords: ["rayure", "raye", "griffe", "pare-chocs", "peinture", "carrosserie"],
    answer:
      "Oui, l'atelier traite les rayures, chocs, pare-chocs et reprises peinture. Décrivez simplement la zone touchée et ajoutez des photos si vous en avez : ce sera plus facile pour vous répondre précisément.",
    action: { label: "Décrire les dégâts", type: "contact" },
  },
  {
    id: "mounier-assurance",
    siteSlug: "carrosserie-mounier",
    keywords: ["assurance", "sinistre", "expert", "constat", "remboursement"],
    answer:
      "Après un sinistre, vous gardez le choix de votre réparateur. L'atelier peut vous accompagner dans les échanges avec l'assurance ou l'expert. Indiquez où en est le dossier, votre assureur et ce qui a été constaté.",
    action: { label: "Contacter l'atelier", type: "contact" },
  },
  {
    id: "mounier-horaires",
    siteSlug: "carrosserie-mounier",
    keywords: ["horaire", "ouvert", "ferme", "samedi", "contact", "telephone"],
    answer:
      "Pour les horaires du moment ou une disponibilité, le plus fiable est d'appeler l'atelier. Vous pouvez aussi laisser une demande si vous préférez être recontacté.",
    action: { label: "Appeler l'atelier", type: "phone" },
  },
  {
    id: "mounier-vitrage",
    siteSlug: "carrosserie-mounier",
    keywords: ["pare-brise", "vitrage", "impact", "fissure", "vitre"],
    answer:
      "Pour un impact, une fissure ou une vitre abîmée, précisez la zone concernée, le modèle du véhicule et si vous avez une garantie bris de glace. L'atelier pourra vous dire quoi faire ensuite.",
    action: { label: "Demander un avis", type: "contact" },
  },
  {
    id: "mounier-optiques",
    siteSlug: "carrosserie-mounier",
    keywords: ["renovation", "optique", "phare", "phares", "terni"],
    answer:
      "Si vos phares sont ternis, une rénovation d'optiques peut améliorer l'aspect et la visibilité. Une photo de face et une de côté suffisent souvent pour un premier avis.",
    action: { label: "Envoyer une demande", type: "photo" },
  },
];
