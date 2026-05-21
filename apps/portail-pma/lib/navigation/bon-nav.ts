export function getBonNavItems(distributor: string, id: string, section = "admin") {
  const base = `/${distributor}/${section}/bons/${id}`;

  return [
    {
      label: "Gestion",
      href: base,
      icon: "layout-dashboard",
    },
    {
      label: "Détail",
      href: `${base}/detail`,
      icon: "file-text",
    },
    {
      label: "Historique",
      href: `${base}/historique`,
      icon: "history",
    },
    {
      label: "Lignes",
      href: `${base}/lignes`,
      icon: "list-ordered",
    },
    {
      label: "Documents",
      href: `${base}/documents`,
      icon: "file-stack",
    },
    {
      label: "Photos",
      href: `${base}/photos`,
      icon: "image",
    },
    {
      label: "Commentaires",
      href: `${base}/commentaires`,
      icon: "message-square",
    },
    {
      label: "Anomalies",
      href: `${base}/anomalies`,
      icon: "alert-triangle",
    },
  ] as const;
}
