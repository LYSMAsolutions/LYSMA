import Link from "next/link";

type StaffRow = {
  id: string;
  first_name: string;
  last_name: string;
  initials: string;
  is_active: boolean;
  locked_until?: Date | null;
  must_change_pin: boolean;
};

function formatDate(value: Date | null | undefined) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("fr-FR", { dateStyle: "short", timeStyle: "short" }).format(value);
}

const th: React.CSSProperties = { padding: "0.75rem 1.25rem", textAlign: "left", fontSize: "0.72rem", fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", background: "rgba(248,251,255,0.95)", borderBottom: "1px solid rgba(217,227,240,0.8)", whiteSpace: "nowrap" };
const td: React.CSSProperties = { padding: "0.9rem 1.25rem", fontSize: "0.875rem", color: "#0f172a", borderBottom: "1px solid rgba(226,232,240,0.6)", verticalAlign: "middle" };
const tdM: React.CSSProperties = { ...td, color: "#6b7280", fontSize: "0.82rem" };
const btnLink: React.CSSProperties = { display: "inline-flex", padding: "0.3rem 0.65rem", borderRadius: "999px", fontSize: "0.75rem", fontWeight: 600, color: "#0a4d9b", border: "1px solid #bfdbfe", background: "rgba(255,255,255,0.8)", textDecoration: "none" };

export default function StoreStaffTable({
  distributor,
  storeId,
  rows,
}: {
  distributor: string;
  storeId: string;
  rows: StaffRow[];
}) {
  const adminBase = `/${distributor}/admin`;

  return (
    <div style={{ borderRadius: "1rem", border: "1px solid rgba(217,227,240,0.8)", overflow: "hidden", background: "rgba(255,255,255,0.6)" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={th}>Nom</th>
            <th style={th}>Initiales</th>
            <th style={th}>Statut</th>
            <th style={th}>PIN bloqué</th>
            <th style={th}>MDP requis</th>
            <th style={{ ...th, textAlign: "right" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((s) => {
            const isBlocked = s.locked_until && s.locked_until > new Date();
            return (
              <tr key={s.id}>
                <td style={{ ...td, fontWeight: 700 }}>{`${s.first_name} ${s.last_name}`.trim()}</td>
                <td style={{ ...tdM, fontFamily: "monospace", fontWeight: 700 }}>{s.initials}</td>
                <td style={td}>
                  <span style={{ display: "inline-flex", padding: "0.3rem 0.65rem", borderRadius: "999px", fontSize: "0.75rem", fontWeight: 700, background: s.is_active ? "#f0fdf4" : "#fef2f2", color: s.is_active ? "#15803d" : "#dc2626", border: s.is_active ? "1px solid #bbf7d0" : "1px solid #fecaca" }}>
                    {s.is_active ? "Actif" : "Inactif"}
                  </span>
                </td>
                <td style={td}>
                  {isBlocked
                    ? <span style={{ fontSize: "0.75rem", color: "#dc2626", fontWeight: 600 }}>Bloqué · {formatDate(s.locked_until)}</span>
                    : <span style={{ color: "#94a3b8" }}>—</span>}
                </td>
                <td style={td}>
                  <span style={{ display: "inline-flex", padding: "0.25rem 0.65rem", borderRadius: "999px", fontSize: "0.72rem", fontWeight: 700, background: s.must_change_pin ? "#fffbeb" : "#f0fdf4", color: s.must_change_pin ? "#b45309" : "#15803d", border: s.must_change_pin ? "1px solid #fde68a" : "1px solid #bbf7d0" }}>
                    {s.must_change_pin ? "Oui" : "Non"}
                  </span>
                </td>
                <td style={{ ...td, textAlign: "right" }}>
                  <div style={{ display: "flex", gap: "0.4rem", justifyContent: "flex-end" }}>
                    <Link href={`${adminBase}/users/magasiniers/${s.id}`} style={btnLink}>Fiche</Link>
                    <Link href={`${adminBase}/stores/${storeId}/staff/${s.id}/edit`} style={{ ...btnLink, color: "#475569", borderColor: "#e2e8f0" }}>Modifier</Link>
                  </div>
                </td>
              </tr>
            );
          })}
          {!rows.length && (
            <tr>
              <td colSpan={6} style={{ ...td, textAlign: "center", color: "#94a3b8", padding: "2.5rem" }}>
                Aucun magasinier.{" "}
                <Link href={`${adminBase}/stores/${storeId}/staff/new`} style={{ color: "#0a4d9b" }}>Ajouter →</Link>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}