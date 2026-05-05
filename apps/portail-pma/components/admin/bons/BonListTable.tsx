import Link from "next/link";
import BonStatusBadge from "./BonStatusBadge";

const typeLabels: Record<string, string> = {
  commande_devis: "Commande / Devis",
  retour: "Retour",
  sav: "SAV",
  intervention: "Intervention",
  devis_materiel: "Devis matériel",
  transformation_devis: "Transformation devis",
  garantie: "Garantie",
  contrat_maintenance: "Contrat maintenance",
};

type Row = {
  id: string;
  bon_number: string;
  bon_type: string;
  status: string;
  priority?: string | null;
  clientName?: string | null;
  storeName?: string | null;
  creatorName?: string | null;
  createdAt: string;
};

const th: React.CSSProperties = {
  padding: "0.75rem 1.25rem",
  textAlign: "left",
  fontSize: "0.72rem",
  fontWeight: 800,
  color: "#94a3b8",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  background: "rgba(248,251,255,0.95)",
  borderBottom: "1px solid rgba(217,227,240,0.8)",
  whiteSpace: "nowrap",
};

const td: React.CSSProperties = {
  padding: "0.9rem 1.25rem",
  fontSize: "0.875rem",
  color: "#0f172a",
  borderBottom: "1px solid rgba(226,232,240,0.6)",
  verticalAlign: "middle",
};

const tdMuted: React.CSSProperties = { ...td, color: "#6b7280", fontSize: "0.82rem" };

export default function BonListTable({ distributor, rows }: { distributor: string; rows: Row[] }) {
  return (
    <div style={{ borderRadius: "1rem", border: "1px solid rgba(217,227,240,0.8)", overflow: "hidden", background: "rgba(255,255,255,0.6)" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "720px" }}>
        <thead>
          <tr>
            <th style={th}>Numéro</th>
            <th style={th}>Type</th>
            <th style={th}>Client</th>
            <th style={th}>Magasin</th>
            <th style={th}>Créé par</th>
            <th style={th}>Statut</th>
            <th style={th}>Date</th>
            <th style={{ ...th, textAlign: "right" }}></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td style={{ ...td, fontWeight: 700 }}>{row.bon_number}</td>
              <td style={tdMuted}>{typeLabels[row.bon_type] ?? row.bon_type}</td>
              <td style={td}>{row.clientName || "—"}</td>
              <td style={tdMuted}>{row.storeName || "—"}</td>
              <td style={tdMuted}>{row.creatorName || "—"}</td>
              <td style={td}><BonStatusBadge status={row.status} /></td>
              <td style={tdMuted}>{row.createdAt}</td>
              <td style={{ ...td, textAlign: "right" }}>
                <Link href={`/${distributor}/admin/bons/${row.id}`} style={{
                  display: "inline-flex", alignItems: "center",
                  padding: "0.35rem 0.85rem", borderRadius: "999px",
                  fontSize: "0.78rem", fontWeight: 600,
                  color: "#0a4d9b", border: "1px solid #bfdbfe",
                  background: "rgba(255,255,255,0.8)", textDecoration: "none",
                }}>
                  Voir →
                </Link>
              </td>
            </tr>
          ))}
          {!rows.length && (
            <tr>
              <td colSpan={8} style={{ ...td, textAlign: "center", color: "#94a3b8", padding: "2.5rem" }}>
                Aucun bon trouvé.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}