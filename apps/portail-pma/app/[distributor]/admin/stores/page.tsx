import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireAccess } from "@/lib/require-access";
import AdminModulePage from "@/components/admin/layout/AdminModulePage";

const th: React.CSSProperties = { padding: "0.75rem 1.25rem", textAlign: "left", fontSize: "0.72rem", fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", background: "rgba(248,251,255,0.95)", borderBottom: "1px solid rgba(217,227,240,0.8)", whiteSpace: "nowrap" };
const td: React.CSSProperties = { padding: "0.9rem 1.25rem", fontSize: "0.875rem", color: "#0f172a", borderBottom: "1px solid rgba(226,232,240,0.6)", verticalAlign: "middle" };
const tdM: React.CSSProperties = { ...td, color: "#6b7280", fontSize: "0.82rem" };
const btnLink: React.CSSProperties = { display: "inline-flex", padding: "0.3rem 0.65rem", borderRadius: "999px", fontSize: "0.75rem", fontWeight: 600, color: "#0a4d9b", border: "1px solid #bfdbfe", background: "rgba(255,255,255,0.8)", textDecoration: "none" };

export default async function AdminStoresPage({
  params,
}: { params: Promise<{ distributor: string }> }) {
  const { distributor } = await params;
  const currentUser = await requireAccess({ allowedRoles: ["admin"], distributorSlug: distributor });
  const adminBase = `/${currentUser.distributorSlug}/admin`;

  const stores = await prisma.stores.findMany({
    where: { distributor_id: currentUser.distributorId },
    include: {
      store_staff: { where: { is_active: true }, select: { id: true } },
      clients: { select: { id: true } },
      user_store_links: {
        include: {
          users: { select: { id: true, first_name: true, last_name: true, roles: { select: { code: true } } } },
        },
      },
      _count: { select: { bons: true } },
    },
    orderBy: { code: "asc" },
  });

  const total    = stores.length;
  const actifs   = stores.filter((s) => s.is_active).length;
  const inactifs = stores.filter((s) => !s.is_active).length;

  return (
    <AdminModulePage
      badge="Magasins · Admin"
      title="Gestion des magasins"
      description="Magasins du distributeur, leurs équipes et leur activité."
      backHref={adminBase}
      kpis={[
        { title: "Total",    value: total,    note: "magasins",    tone: "blue"    },
        { title: "Actifs",   value: actifs,   note: "en activité", tone: "green"   },
        { title: "Inactifs", value: inactifs, note: "désactivés",  tone: "neutral" },
      ]}
    >
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "0.5rem" }}>
        <Link href={`${adminBase}/stores/create`} style={{ display: "inline-flex", padding: "0.7rem 1.25rem", borderRadius: "0.875rem", background: "linear-gradient(135deg,#0a4d9b,#1e73d8)", color: "#fff", fontWeight: 700, fontSize: "0.875rem", textDecoration: "none", boxShadow: "0 8px 20px rgba(30,115,216,0.25)" }}>
          + Créer un magasin
        </Link>
      </div>

      <section style={{ borderRadius: "1.5rem", background: "rgba(255,255,255,0.75)", border: "1px solid rgba(217,227,240,0.9)", overflow: "hidden", boxShadow: "0 8px 24px rgba(15,23,42,0.05)" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "860px" }}>
            <thead>
              <tr>
                <th style={th}>Code</th>
                <th style={th}>Code interne</th>
                <th style={th}>Nom</th>
                <th style={th}>Ville</th>
                <th style={th}>RDM</th>
                <th style={{ ...th, textAlign: "center" }}>Magasiniers</th>
                <th style={{ ...th, textAlign: "center" }}>Clients</th>
                <th style={{ ...th, textAlign: "center" }}>Bons</th>
                <th style={th}>Statut</th>
                <th style={{ ...th, textAlign: "right" }}>Fiche</th>
              </tr>
            </thead>
            <tbody>
              {stores.map((store) => {
                const rdm = store.user_store_links.find((l) => l.users?.roles?.code === "rdm")?.users;
                return (
                  <tr key={store.id}>
                    <td style={{ ...tdM, fontFamily: "monospace", fontWeight: 700 }}>{store.code}</td>
                    <td style={{ ...tdM, fontFamily: "monospace" }}>
                      {store.internal_code
                        ? <span style={{ display: "inline-flex", padding: "0.2rem 0.55rem", borderRadius: "999px", fontSize: "0.72rem", fontWeight: 700, background: "#eff6ff", color: "#0a4d9b", border: "1px solid #bfdbfe" }}>{store.internal_code}</span>
                        : <span style={{ color: "#e2e8f0" }}>—</span>}
                    </td>
                    <td style={{ ...td, fontWeight: 700 }}>{store.name}</td>
                    <td style={tdM}>{store.city || "—"}</td>
                    <td style={td}>
                      {rdm ? (
                        <Link href={`${adminBase}/users/${rdm.id}`} style={{ color: "#0a4d9b", textDecoration: "none", fontWeight: 600, fontSize: "0.875rem" }}>
                          {`${rdm.first_name} ${rdm.last_name}`.trim()}
                        </Link>
                      ) : <span style={{ color: "#94a3b8", fontSize: "0.82rem" }}>Non assigné</span>}
                    </td>
                    <td style={{ ...td, textAlign: "center" }}>{store.store_staff.length}</td>
                    <td style={{ ...td, textAlign: "center" }}>{store.clients.length}</td>
                    <td style={{ ...td, textAlign: "center" }}>{store._count.bons}</td>
                    <td style={td}>
                      <span style={{ display: "inline-flex", padding: "0.3rem 0.75rem", borderRadius: "999px", fontSize: "0.75rem", fontWeight: 700, background: store.is_active ? "#f0fdf4" : "#fef2f2", color: store.is_active ? "#15803d" : "#dc2626", border: store.is_active ? "1px solid #bbf7d0" : "1px solid #fecaca" }}>
                        {store.is_active ? "Actif" : "Inactif"}
                      </span>
                    </td>
                    <td style={{ ...td, textAlign: "right" }}>
                      <Link href={`${adminBase}/stores/${store.id}`} style={btnLink}>Voir</Link>
                    </td>
                  </tr>
                );
              })}
              {!stores.length && (
                <tr><td colSpan={10} style={{ ...td, textAlign: "center", color: "#94a3b8", padding: "2.5rem" }}>Aucun magasin trouvé.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </AdminModulePage>
  );
}