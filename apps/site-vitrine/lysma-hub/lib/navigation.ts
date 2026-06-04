export type LysmaNavItem = {
  label: string;
  href: string;
  description?: string;
};

export const lysmaMainNavigation: LysmaNavItem[] = [
  { label: "Accueil", href: "/", description: "LYSMA Solutions" },
  { label: "Sites web", href: "/sites-web", description: "Vitrines premium et domaines" },
  { label: "Outils web", href: "/outils-web", description: "Apps métier sur mesure" },
  { label: "Méthode", href: "/methode", description: "Notre façon de faire" },
  { label: "Réalisations", href: "/realisations", description: "LIVO et Carrosserie Mounier" },
  { label: "Nouveautés", href: "/nouveautes", description: "Évolutions LYSMA" },
  { label: "Contact", href: "/contact", description: "Parler d’un projet" },
  { label: "Présentation", href: "/presentation", description: "Vision et mission" },
];

export const dashboardNavigation: LysmaNavItem[] = [
  { label: "Vue d’ensemble", href: "/dashboard" },
  { label: "Mon site", href: "/dashboard/site" },
  { label: "Contenus", href: "/dashboard/contenus" },
  { label: "Support", href: "/dashboard/support" },
  { label: "Nouveautés", href: "/dashboard/nouveautes" },
  { label: "Abonnement", href: "/dashboard/abonnement" },
  { label: "Sécurité", href: "/dashboard/security" },
];
