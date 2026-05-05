import Link from "next/link";
import UserRoleBadge from "./UserRoleBadge";

type Props = {
  distributor: string;
  user: {
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
};

const row: React.CSSProperties = { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.7rem 0", borderBottom: "1px solid rgba(226,232,240,0.5)" };
const rowLabel: React.CSSProperties = { fontSize: "0.8rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em" };
const rowValue: React.CSSProperties = { fontSize: "0.875rem", color: "#0f172a", fontWeight: 500 };

export default function UserCard({ distributor, user }: Props) {
  const fullName = `${user.first_name} ${user.last_name}`.trim();

  return (
    <section style={{ borderRadius: "1.5rem", background: "rgba(255,255,255,0.75)", border: "1px solid rgba(217,227,240,0.9)", padding: "1.75rem", boxShadow: "0 8px 24px rgba(15,23,42,0.05)" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem", marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div style={{ width: "48px", height: "48px", borderRadius: "14px", background: "linear-gradient(135deg,#eff6ff,#dbeafe)", border: "1px solid #bfdbfe", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem", fontWeight: 800, color: "#0a4d9b", flexShrink: 0 }}>
            {user.first_name.charAt(0).toUpperCase()}{user.last_name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: "1.15rem", fontWeight: 800, color: "#0f172a", letterSpacing: "-0.02em" }}>{fullName}</h2>
            <p style={{ margin: "0.2rem 0 0", fontSize: "0.875rem", color: "#6b7280" }}>{user.email}</p>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexShrink: 0 }}>
          <UserRoleBadge roleCode={user.roles?.code} roleLabel={user.roles?.label} />
          <span style={{ display: "inline-flex", padding: "0.3rem 0.75rem", borderRadius: "999px", fontSize: "0.75rem", fontWeight: 700, background: user.is_active ? "#f0fdf4" : "#fef2f2", color: user.is_active ? "#15803d" : "#dc2626", border: user.is_active ? "1px solid #bbf7d0" : "1px solid #fecaca" }}>
            {user.is_active ? "Actif" : "Inactif"}
          </span>
        </div>
      </div>

      {/* Infos */}
      <div>
        <div style={row}><span style={rowLabel}>Téléphone</span><span style={rowValue}>{user.phone || "—"}</span></div>
        <div style={row}><span style={rowLabel}>Code interne</span><span style={{ ...rowValue, fontFamily: "monospace" }}>{user.code || "—"}</span></div>
        <div style={row}><span style={rowLabel}>Clients assignés</span><span style={{ ...rowValue, fontWeight: 700, color: "#0a4d9b" }}>{user._count?.clients ?? 0}</span></div>
        <div style={row}><span style={rowLabel}>Bons créés</span><span style={{ ...rowValue, fontWeight: 700, color: "#0a4d9b" }}>{user._count?.bons ?? 0}</span></div>
        <div style={{ ...row, borderBottom: "none" }}><span style={rowLabel}>Changement MDP requis</span>
          <span style={{ display: "inline-flex", padding: "0.25rem 0.65rem", borderRadius: "999px", fontSize: "0.72rem", fontWeight: 700, background: user.must_change_password ? "#fffbeb" : "#f0fdf4", color: user.must_change_password ? "#b45309" : "#15803d", border: user.must_change_password ? "1px solid #fde68a" : "1px solid #bbf7d0" }}>
            {user.must_change_password ? "Oui" : "Non"}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.5rem", paddingTop: "1.25rem", borderTop: "1px solid rgba(226,232,240,0.5)" }}>
        <Link href={`/${distributor}/admin/users/${user.id}/edit`} style={{ display: "inline-flex", alignItems: "center", padding: "0.65rem 1.25rem", borderRadius: "0.875rem", fontSize: "0.875rem", fontWeight: 700, background: "linear-gradient(135deg,#0a4d9b,#1e73d8)", color: "#fff", textDecoration: "none", boxShadow: "0 6px 16px rgba(30,115,216,0.2)" }}>
          Modifier le profil
        </Link>
        <Link href={`/${distributor}/admin/users`} style={{ display: "inline-flex", alignItems: "center", padding: "0.65rem 1.25rem", borderRadius: "0.875rem", fontSize: "0.875rem", fontWeight: 600, background: "rgba(255,255,255,0.8)", color: "#475569", border: "1px solid #e2e8f0", textDecoration: "none" }}>
          Retour liste
        </Link>
      </div>
    </section>
  );
}