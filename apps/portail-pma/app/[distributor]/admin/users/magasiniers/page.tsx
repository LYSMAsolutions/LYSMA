import { prisma } from "@/lib/prisma";
import { requireAccess } from "@/lib/require-access";
import AdminModulePage from "@/components/admin/layout/AdminModulePage";
import Link from "next/link";

function formatDate(value: Date | null) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("fr-FR", { dateStyle: "short", timeStyle: "short" }).format(value);
}

const th: React.CSSProperties = { padding: "0.75rem 1.25rem", textAlign: "left", fontSize: "0.72rem", fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", background: "rgba(248,251,255,0.95)", borderBottom: "1px solid rgba(217,227,240,0.8)", whiteSpace: "nowrap" };
const td: React.CSSProperties = { padding: "0.9rem 1.25rem", fontSize: "0.875rem", color: "#0f172a", borderBottom: "1px solid rgba(226,232,240,0.6)", verticalAlign: "middle" };
const tdM: React.CSSProperties = { ...td, color: "#6b7280", fontSize: "0.82rem" };
const btnLink: React.CSSProperties = { display: "inline-flex", padding: "0.3rem 0.65rem", borderRadius: "999px", fontSize: "0.75rem", fontWeight: 600, color: "#0a4d9b", border: "1px solid #bfdbfe", background: "rgba(255,255,255,0.8)", textDecoration: "none" };

export default async function AdminMagasiniersPage({
  params,
}: { params: Promise<{ distributor: string }> }) {
  const { distributor } = await params;
  const currentUser = await requireAccess({ allowedRoles: ["admin"], distributorSlug: distributor });
  const adminBase = `/${currentUser.distributorSlug}/admin`;

  const staff = await prisma.store_staff.findMany({
    where: { stores: { distributor_id: currentUser.distributorId } },
    include: {
      stores: { select: { id: true, code: true, name: true } },
      _count: { select: { bons: true, bon_comments: true } },
    },
    orderBy: [{ stores: { code: "asc" } }, { last_name: "asc" }],
  });

  const total    = staff.length;
  const actifs   = staff.filter((s) => s.is_active).length;
  const inactifs = staff.filter((s) => !s.is_active).length;
  const bloques  = staff.filter((s) => s.locked_until && s.locked_until > new Date()).length;

  return (
    <AdminModulePage
      badge="Utilisateurs · Magasiniers"
      title="Magasiniers"
      description="Tous les magasiniers du distributeur, par magasin."
      backHref={`${adminBase}/users`}
      backLabel="Retour utilisateurs"
      kpis={[
        { title: "Total",    value: total,    note: "magasiniers",  tone: "blue"    },
        { title: "Actifs",   value: actifs,   note: "actifs",       tone: "green"   },
        { title: "Inactifs", value: inactifs, note: "désactivés",   tone: "neutral" },
        { title: "Bloqués",  value: bloques,  note: "PIN bloqué",   tone: "red"     },
      ]}
    >
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "0.5rem" }}>
        <Link href={`${adminBase}/users/magasiniers/create`} style={{
          display: "inline-flex", alignItems: "center", padding: "0.7rem 1.25rem",
          borderRadius: "0.875rem", background: "linear-gradient(135deg,#0a4d9b,#1e73d8)",
          color: "#fff", fontWeight: 700, fontSize: "0.875rem", textDecoration: "none",
          boxShadow: "0 8px 20px rgba(30,115,216,0.25)",
        }}>
          + Créer un magasinier
        </Link>
      </div>

      <section style={{ borderRadius: "1.5rem", background: "rgba(255,255,255,0.75)", border: "1px solid rgba(217,227,240,0.9)", overflow: "hidden", boxShadow: "0 8px 24px rgba(15,23,42,0.05)" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "720px" }}>
            <thead>
              <tr>
                <th style={th}>Nom</th>
                <th style={th}>Initiales</th>
                <th style={th}>Magasin</th>
                <th style={{ ...th, textAlign: "center" }}>Bons</th>
                <th style={{ ...th, textAlign: "center" }}>Commentaires</th>
                <th style={th}>Statut</th>
                <th style={th}>PIN bloqué</th>
                <th style={{ ...th, textAlign: "right" }}>Fiche</th>
              </tr>
            </thead>
            <tbody>
              {staff.map((s) => {
                const isBlocked = s.locked_until && s.locked_until > new Date();
                return (
                  <tr key={s.id}>
                    <td style={{ ...td, fontWeight: 700 }}>{`${s.first_name} ${s.last_name}`.trim()}</td>
                    <td style={{ ...tdM, fontFamily: "monospace", fontWeight: 700 }}>{s.initials}</td>
                    <td style={tdM}>{s.stores.code} · {s.stores.name}</td>
                    <td style={{ ...td, textAlign: "center" }}>{s._count.bons}</td>
                    <td style={{ ...td, textAlign: "center" }}>{s._count.bon_comments}</td>
                    <td style={td}>
                      <span style={{ display: "inline-flex", padding: "0.3rem 0.75rem", borderRadius: "999px", fontSize: "0.75rem", fontWeight: 700, background: s.is_active ? "#f0fdf4" : "#fef2f2", color: s.is_active ? "#15803d" : "#dc2626", border: s.is_active ? "1px solid #bbf7d0" : "1px solid #fecaca" }}>
                        {s.is_active ? "Actif" : "Inactif"}
                      </span>
                    </td>
                    <td style={td}>
                      {isBlocked ? (
                        <span style={{ display: "inline-flex", padding: "0.3rem 0.75rem", borderRadius: "999px", fontSize: "0.75rem", fontWeight: 700, background: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca" }}>
                          Bloqué · {formatDate(s.locked_until)}
                        </span>
                      ) : (
                        <span style={{ color: "#94a3b8", fontSize: "0.82rem" }}>—</span>
                      )}
                    </td>
                    <td style={{ ...td, textAlign: "right" }}>
                      <Link href={`${adminBase}/users/magasiniers/${s.id}`} style={btnLink}>Voir</Link>
                    </td>
                  </tr>
                );
              })}
              {!staff.length && (
                <tr><td colSpan={8} style={{ ...td, textAlign: "center", color: "#94a3b8", padding: "2.5rem" }}>Aucun magasinier trouvé.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </AdminModulePage>
  );
}