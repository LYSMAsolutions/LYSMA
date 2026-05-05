import Link from "next/link";

type ClientRow = {
  id: string;
  code: string;
  name: string;
  city?: string | null;
  email?: string | null;
  phone?: string | null;
  storeName?: string | null;
  atcName?: string | null;
  bonsCount?: number;
};

const th: React.CSSProperties = { padding: "0.75rem 1.25rem", textAlign: "left", fontSize: "0.72rem", fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", background: "rgba(248,251,255,0.95)", borderBottom: "1px solid rgba(217,227,240,0.8)", whiteSpace: "nowrap" };
const td: React.CSSProperties = { padding: "0.9rem 1.25rem", fontSize: "0.875rem", color: "#0f172a", borderBottom: "1px solid rgba(226,232,240,0.6)", verticalAlign: "middle" };
const tdM: React.CSSProperties = { ...td, color: "#6b7280", fontSize: "0.82rem" };
const btnLink: React.CSSProperties = { display: "inline-flex", padding: "0.3rem 0.65rem", borderRadius: "999px", fontSize: "0.75rem", fontWeight: 600, color: "#0a4d9b", border: "1px solid #bfdbfe", background: "rgba(255,255,255,0.8)", textDecoration: "none" };

export default function ClientTable({ distributor, rows }: { distributor: string; rows: ClientRow[] }) {
  return (
    <div style={{ borderRadius: "1rem", border: "1px solid rgba(217,227,240,0.8)", overflow: "hidden", background: "rgba(255,255,255,0.6)", overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "900px" }}>
        <thead>
          <tr>
            <th style={th}>Code</th>
            <th style={th}>Nom</th>
            <th style={th}>Ville</th>
            <th style={th}>Email</th>
            <th style={th}>Téléphone</th>
            <th style={th}>Magasin</th>
            <th style={th}>ATC</th>
            <th style={{ ...th, textAlign: "center" }}>Bons</th>
            <th style={{ ...th, textAlign: "right" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td style={{ ...tdM, fontFamily: "monospace", fontWeight: 700 }}>{row.code || "—"}</td>
              <td style={{ ...td, fontWeight: 700 }}>{row.name}</td>
              <td style={tdM}>{row.city || "—"}</td>
              <td style={tdM}>{row.email || "—"}</td>
              <td style={tdM}>{row.phone || "—"}</td>
              <td style={tdM}>{row.storeName || "—"}</td>
              <td style={tdM}>{row.atcName || "—"}</td>
              <td style={{ ...td, textAlign: "center", fontWeight: 700, color: "#0a4d9b" }}>{row.bonsCount ?? 0}</td>
              <td style={{ ...td, textAlign: "right" }}>
                <div style={{ display: "flex", gap: "0.4rem", justifyContent: "flex-end" }}>
                  <Link href={`/${distributor}/admin/clients/${row.id}`} style={btnLink}>Voir</Link>
                  <Link href={`/${distributor}/admin/clients/${row.id}/edit`} style={{ ...btnLink, color: "#475569", borderColor: "#e2e8f0" }}>Modifier</Link>
                </div>
              </td>
            </tr>
          ))}
          {!rows.length && (
            <tr><td colSpan={9} style={{ ...td, textAlign: "center", color: "#94a3b8", padding: "2.5rem" }}>Aucun client trouvé.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}