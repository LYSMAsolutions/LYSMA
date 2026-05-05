// Utilitaire — à importer dans la fiche magasin pour afficher le badge type
export function storeTypeBadge(storeType: string) {
  if (storeType === "sav") {
    return { label: "SAV / Matériel", bg: "#f0fdf4", color: "#15803d", border: "#bbf7d0" };
  }
  return { label: "Standard", bg: "#f1f5f9", color: "#475569", border: "#e2e8f0" };
}