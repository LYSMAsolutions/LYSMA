import Link from "next/link";
import UserRoleBadge from "./UserRoleBadge";
import UserActionsCell from "./UserActionsCell";

type UserRow = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string | null;
  code?: string | null;
  is_active: boolean;
  must_change_password: boolean;
  roles?: { code: string; label: string } | null;
  _count?: { clients: number; bons: number };
};

const th: React.CSSProperties = { padding: "0.75rem 1.25rem", textAlign: "left", fontSize: "0.72rem", fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", background: "rgba(248,251,255,0.95)", borderBottom: "1px solid rgba(217,227,240,0.8)", whiteSpace: "nowrap" };
const td: React.CSSProperties = { padding: "0.9rem 1.25rem", fontSize: "0.875rem", color: "#0f172a", borderBottom: "1px solid rgba(226,232,240,0.6)", verticalAlign: "middle" };
const tdM: React.CSSProperties = { ...td, color: "#6b7280", fontSize: "0.82rem" };
const btnLink: React.CSSProperties = { display: "inline-flex", alignItems: "center", padding: "0.3rem 0.65rem", borderRadius: "999px", fontSize: "0.75rem", fontWeight: 600, color: "#0a4d9b", border: "1px solid #bfdbfe", background: "rgba(255,255,255,0.8)", textDecoration: "none" };

export default function UserTable({
  distributor,
  rows,
  currentUserId,
  atcs,
}: {
  distributor: string;
  rows: UserRow[];
  currentUserId: string;
  atcs: { id: string; first_name: string; last_name: string; email: string }[];
}) {
  return (
    <div style={{ borderRadius: "1rem", border: "1px solid rgba(217,227,240,0.8)", overflow: "hidden", background: "rgba(255,255,255,0.6)", overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "860px" }}>
        <thead>
          <tr>
            <th style={th}>Nom</th>
            <th style={th}>Email</th>
            <th style={th}>Rôle</th>
            <th style={th}>Code</th>
            <th style={{ ...th, textAlign: "center" }}>Clients</th>
            <th style={{ ...th, textAlign: "center" }}>Bons</th>
            <th style={th}>Statut</th>
            <th style={th}>Fiche</th>
            <th style={{ ...th, textAlign: "right" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td style={{ ...td, fontWeight: 700 }}>{`${row.first_name} ${row.last_name}`.trim()}</td>
              <td style={tdM}>{row.email}</td>
              <td style={td}><UserRoleBadge roleCode={row.roles?.code} roleLabel={row.roles?.label} /></td>
              <td style={{ ...tdM, fontFamily: "monospace" }}>{row.code || "—"}</td>
              <td style={{ ...td, textAlign: "center" }}>{row._count?.clients ?? 0}</td>
              <td style={{ ...td, textAlign: "center" }}>{row._count?.bons ?? 0}</td>
              <td style={td}>
                <span style={{ display: "inline-flex", padding: "0.3rem 0.75rem", borderRadius: "999px", fontSize: "0.75rem", fontWeight: 700, background: row.is_active ? "#f0fdf4" : "#fef2f2", color: row.is_active ? "#15803d" : "#dc2626", border: row.is_active ? "1px solid #bbf7d0" : "1px solid #fecaca" }}>
                  {row.is_active ? "Actif" : "Inactif"}
                </span>
              </td>
              <td style={td}>
                <div style={{ display: "flex", gap: "0.4rem" }}>
                  <Link href={`/${distributor}/admin/users/${row.id}`} style={btnLink}>Voir</Link>
                  <Link href={`/${distributor}/admin/users/${row.id}/edit`} style={{ ...btnLink, color: "#475569", borderColor: "#e2e8f0" }}>Modifier</Link>
                </div>
              </td>
              <td style={{ ...td, textAlign: "right" }}>
                <UserActionsCell
                  userId={row.id}
                  userName={`${row.first_name} ${row.last_name}`.trim()}
                  roleCode={row.roles?.code ?? ""}
                  isActive={row.is_active}
                  isSelf={row.id === currentUserId}
                  atcs={atcs}
                />
              </td>
            </tr>
          ))}
          {!rows.length && (
            <tr><td colSpan={9} style={{ ...td, textAlign: "center", color: "#94a3b8", padding: "2.5rem" }}>Aucun utilisateur trouvé.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}