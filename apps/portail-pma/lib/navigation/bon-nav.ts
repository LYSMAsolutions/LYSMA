export function getBonNavItems(distributor: string, id: string) {
  const base = `/${distributor}/admin/bons/${id}`;

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
  ] as const;
}