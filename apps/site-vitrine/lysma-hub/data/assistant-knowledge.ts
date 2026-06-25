import type { AssistantRule } from "../lib/site-types";

export const assistantKnowledge: AssistantRule[] = [
  {
    id: "mounier-devis",
    siteSlug: "carrosserie-mounier",
    keywords: ["devis", "prix", "tarif", "combien", "cout", "chiffrer", "estimation", "budget"],
    answer:
      "Pour établir un devis précis, l'atelier a besoin de connaître le véhicule (marque, modèle, année), la zone touchée et l'étendue des dégâts visibles. Des photos claires accélèrent beaucoup la réponse — une vue globale et une vue rapprochée de la zone abîmée suffisent pour un premier chiffrage.",
    action: { label: "Demander un devis", type: "contact" },
  },
  {
    id: "mounier-delai",
    siteSlug: "carrosserie-mounier",
    keywords: ["delai", "duree", "combien de temps", "quand", "attente", "rapide"],
    answer:
      "Les délais dépendent de la nature des travaux et du planning atelier. Pour une rayure légère ou une petite réparation, c'est souvent plus rapide qu'on ne le pense. Envoyez votre demande avec des photos pour que l'atelier vous donne une estimation précise.",
    action: { label: "Contacter l'atelier", type: "contact" },
  },
  {
    id: "mounier-photo",
    siteSlug: "carrosserie-mounier",
    keywords: ["photo", "image", "envoyer", "piece jointe", "photographier"],
    answer:
      "Des photos bien cadrées aident l'atelier à évaluer les dégâts avant même que vous vous déplaciez. Idéalement : une vue globale du véhicule, une photo rapprochée de la zone touchée, et si possible une vue de l'angle opposé. Vous pouvez les joindre directement à votre demande.",
    action: { label: "Envoyer des photos", type: "photo" },
  },
  {
    id: "mounier-carrosserie",
    siteSlug: "carrosserie-mounier",
    keywords: ["rayure", "raye", "griffe", "bosse", "choc", "pare-chocs", "peinture", "carrosserie", "dommage", "abime", "accident", "accrochage"],
    answer:
      "L'atelier prend en charge rayures, griffes, bosses, chocs sur pare-chocs, et toutes les reprises de peinture. Que ce soit un accrochage léger ou des dégâts plus importants, envoyez des photos pour que l'équipe évalue et vous réponde rapidement.",
    action: { label: "Décrire les dégâts", type: "contact" },
  },
  {
    id: "mounier-assurance",
    siteSlug: "carrosserie-mounier",
    keywords: ["assurance", "sinistre", "expert", "constat", "remboursement", "garantie", "prise en charge"],
    answer:
      "Après un sinistre, vous avez le droit de choisir librement votre réparateur — même si votre assureur propose un autre atelier. Carrosserie Mounier peut gérer les échanges avec l'expert et votre assurance directement. Précisez votre assureur, l'état du dossier et les dégâts constatés.",
    action: { label: "Contacter l'atelier", type: "contact" },
  },
  {
    id: "mounier-horaires",
    siteSlug: "carrosserie-mounier",
    keywords: ["horaire", "ouvert", "ferme", "samedi", "dimanche", "contact", "telephone", "appeler", "joindre"],
    answer:
      "Pour connaître les disponibilités ou joindre l'atelier rapidement, le plus fiable est d'appeler directement. Vous pouvez aussi laisser vos coordonnées via le formulaire et l'équipe vous rappelle.",
    action: { label: "Appeler l'atelier", type: "phone" },
  },
  {
    id: "mounier-rendez-vous",
    siteSlug: "carrosserie-mounier",
    keywords: ["rendez-vous", "rdv", "disponibilite", "creneau", "passer", "deposer", "amener"],
    answer:
      "Pour convenir d'un rendez-vous, le plus simple est d'appeler l'atelier. Vous pouvez aussi envoyer une demande avec vos disponibilités et vos coordonnées — l'équipe vous rappellera pour fixer un créneau.",
    action: { label: "Appeler l'atelier", type: "phone" },
  },
  {
    id: "mounier-vitrage",
    siteSlug: "carrosserie-mounier",
    keywords: ["pare-brise", "vitrage", "impact", "fissure", "vitre", "bris de glace", "eclat", "fenetre"],
    answer:
      "Pour un impact, une fissure ou une vitre endommagée, signalez rapidement : un impact non traité peut évoluer. Précisez le modèle du véhicule, la zone concernée et si vous avez une garantie bris de glace — certains contrats couvrent le remplacement sans franchise.",
    action: { label: "Demander un avis", type: "contact" },
  },
  {
    id: "mounier-optiques",
    siteSlug: "carrosserie-mounier",
    keywords: ["renovation", "optique", "phare", "phares", "terni", "jauni", "voile", "eclairage"],
    answer:
      "Des phares ternis ou jaunis réduisent la visibilité et donnent un mauvais aspect au véhicule. La rénovation d'optiques redonne un résultat proche du neuf. Une photo de face suffit souvent pour un premier avis — l'atelier vous dira si la rénovation est faisable ou si un remplacement est plus adapté.",
    action: { label: "Envoyer une demande", type: "photo" },
  },
  {
    id: "mounier-voiture-pret",
    siteSlug: "carrosserie-mounier",
    keywords: ["voiture de pret", "vehicule de remplacement", "pret", "remplacement", "mobilite"],
    answer:
      "La question d'un véhicule de remplacement dépend souvent de votre contrat d'assurance. Signalez-le dans votre demande — l'atelier pourra vous indiquer ce qui est possible selon votre situation.",
    action: { label: "Contacter l'atelier", type: "contact" },
  },
];
