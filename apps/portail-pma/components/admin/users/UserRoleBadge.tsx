type Props = { roleCode?: string | null; roleLabel?: string | null };

const roleStyles: Record<string, { label: string; bg: string; color: string; border: string }> = {
  admin: { label: "ADMIN", bg: "#fef2f2", color: "#dc2626", border: "#fecaca" },
  cdv:   { label: "CDV",   bg: "#fffbeb", color: "#b45309", border: "#fde68a" },
  rdm:   { label: "RDM",   bg: "#f1f5f9", color: "#475569", border: "#e2e8f0" },
  atc:   { label: "ATC",   bg: "#f0fdf4", color: "#15803d", border: "#bbf7d0" },
};

export default function UserRoleBadge({ roleCode, roleLabel }: Props) {
  const s = roleStyles[roleCode ?? ""] ?? { label: roleLabel ?? roleCode ?? "—", bg: "#f1f5f9", color: "#64748b", border: "#e2e8f0" };
  return (
    <span style={{ display: "inline-flex", alignItems: "center", padding: "0.3rem 0.75rem", borderRadius: "999px", fontSize: "0.72rem", fontWeight: 800, letterSpacing: "0.08em", background: s.bg, color: s.color, border: `1px solid ${s.border}`, whiteSpace: "nowrap" }}>
      {s.label}
    </span>
  );
}