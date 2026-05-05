type Props = { status: string };

const statusMap: Record<string, { label: string; bg: string; color: string; border: string }> = {
  frigo:               { label: "Brouillon",          bg: "#f1f5f9", color: "#64748b", border: "#e2e8f0" },
  envoye:              { label: "Envoyé",              bg: "#fffbeb", color: "#b45309", border: "#fde68a" },
  non_pris_en_charge:  { label: "Non pris en charge",  bg: "#fef2f2", color: "#dc2626", border: "#fecaca" },
  pris_en_charge:      { label: "Pris en charge",      bg: "#eff6ff", color: "#1d4ed8", border: "#bfdbfe" },
  en_cours:            { label: "En cours",            bg: "#eef2ff", color: "#4338ca", border: "#c7d2fe" },
  attente_fournisseur: { label: "Attente fournisseur", bg: "#fff7ed", color: "#c2410c", border: "#fed7aa" },
  attente_client:      { label: "Attente client",      bg: "#fefce8", color: "#a16207", border: "#fef08a" },
  traite:              { label: "Traité",              bg: "#f0fdf4", color: "#15803d", border: "#bbf7d0" },
  refuse:              { label: "Refusé",              bg: "#fef2f2", color: "#dc2626", border: "#fecaca" },
  a_corriger:          { label: "À corriger",          bg: "#fffbeb", color: "#b45309", border: "#fde68a" },
};

export default function BonStatusBadge({ status }: Props) {
  const s = statusMap[status] ?? { label: status, bg: "#f1f5f9", color: "#64748b", border: "#e2e8f0" };
  return (
    <span style={{
      display: "inline-flex", alignItems: "center",
      padding: "0.3rem 0.75rem",
      borderRadius: "999px",
      fontSize: "0.75rem", fontWeight: 700,
      background: s.bg, color: s.color,
      border: `1px solid ${s.border}`,
      whiteSpace: "nowrap",
    }}>
      {s.label}
    </span>
  );
}