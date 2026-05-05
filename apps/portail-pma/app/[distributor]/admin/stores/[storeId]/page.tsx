import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireAccess } from "@/lib/require-access";
import AdminModulePage from "@/components/admin/layout/AdminModulePage";
import AddStaffButton from "@/components/admin/stores/AddStaffButton";

function formatDate(value: Date | null) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("fr-FR", { dateStyle: "short", timeStyle: "short" }).format(value);
}

const th: React.CSSProperties = { padding: "0.75rem 1.25rem", textAlign: "left", fontSize: "0.72rem", fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", background: "rgba(248,251,255,0.95)", borderBottom: "1px solid rgba(217,227,240,0.8)", whiteSpace: "nowrap" };
const td: React.CSSProperties = { padding: "0.9rem 1.25rem", fontSize: "0.875rem", color: "#0f172a", borderBottom: "1px solid rgba(226,232,240,0.6)", verticalAlign: "middle" };
const tdM: React.CSSProperties = { ...td, color: "#6b7280", fontSize: "0.82rem" };
const sectionWrap: React.CSSProperties = { borderRadius: "1.5rem", background: "rgba(255,255,255,0.75)", border: "1px solid rgba(217,227,240,0.9)", overflow: "hidden", boxShadow: "0 8px 24px rgba(15,23,42,0.05)" };
const sectionHead: React.CSSProperties = { margin: 0, fontSize: "0.82rem", fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em", padding: "1rem 1.25rem", borderBottom: "1px solid rgba(217,227,240,0.8)", background: "rgba(248,251,255,0.95)", display: "flex", justifyContent: "space-between", alignItems: "center" };
const rowStyle: React.CSSProperties = { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.7rem 0", borderBottom: "1px solid rgba(226,232,240,0.5)" };
const rowLbl: React.CSSProperties = { fontSize: "0.8rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em" };
const rowVal: React.CSSProperties = { fontSize: "0.875rem", color: "#0f172a", fontWeight: 500 };
const btnLink: React.CSSProperties = { display: "inline-flex", padding: "0.3rem 0.65rem", borderRadius: "999px", fontSize: "0.75rem", fontWeight: 600, color: "#0a4d9b", border: "1px solid #bfdbfe", background: "rgba(255,255,255,0.8)", textDecoration: "none" };

const statusMap: Record<string, { label: string; bg: string; color: string; border: string }> = {
  en_cours:       { label: "En cours",       bg: "#eef2ff", color: "#4338ca", border: "#c7d2fe" },
  pris_en_charge: { label: "Pris en charge", bg: "#eff6ff", color: "#1d4ed8", border: "#bfdbfe" },
  traite:         { label: "Traité",         bg: "#f0fdf4", color: "#15803d", border: "#bbf7d0" },
  a_corriger:     { label: "À corriger",     bg: "#fffbeb", color: "#b45309", border: "#fde68a" },
  refuse:         { label: "Refusé",         bg: "#fef2f2", color: "#dc2626", border: "#fecaca" },
  envoye:         { label: "Envoyé",         bg: "#fffbeb", color: "#b45309", border: "#fde68a" },
};

export default async function AdminStoreDetailPage({
  params,
}: { params: Promise<{ distributor: string; storeId: string }> }) {
  const { distributor, storeId } = await params;
  const currentUser = await requireAccess({ allowedRoles: ["admin"], distributorSlug: distributor });
  const adminBase = `/${currentUser.distributorSlug}/admin`;

  const store = await prisma.stores.findFirst({
    where: { id: storeId, distributor_id: currentUser.distributorId },
    include: {
      store_staff: { orderBy: { last_name: "asc" } },
      store_accounts: true,
      user_store_links: {
        include: {
          users: { select: { id: true, first_name: true, last_name: true, email: true, roles: { select: { code: true, label: true } } } },
        },
      },
      _count: { select: { bons: true, clients: true } },
    },
  });

  if (!store) notFound();

  const rdm  = store.user_store_links.find((l) => l.users?.roles?.code === "rdm")?.users;
  const atcs = store.user_store_links.filter((l) => l.users?.roles?.code === "atc").map((l) => l.users!);

  const recentBons = await prisma.bons.findMany({
    where: { assigned_store_id: storeId },
    include: { clients: { select: { name: true } } },
    orderBy: { updated_at: "desc" },
    take: 10,
  });

  const clients = await prisma.clients.findMany({
    where: { store_id: storeId },
    select: { id: true, name: true, code: true, city: true },
    orderBy: { name: "asc" },
    take: 50,
  });

  return (
    <AdminModulePage
      badge="Magasin · Fiche"
      title={`${store.code} · ${store.name}`}
      description={[store.address_line_1, store.postal_code, store.city].filter(Boolean).join(" · ") || "Fiche complète du magasin"}
      backHref={`${adminBase}/stores`}
      backLabel="Retour magasins"
    >
      {/* Infos */}
      <section style={{ borderRadius: "1.5rem", background: "rgba(255,255,255,0.75)", border: "1px solid rgba(217,227,240,0.9)", padding: "1.75rem", boxShadow: "0 8px 24px rgba(15,23,42,0.05)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem", marginBottom: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "14px", background: "linear-gradient(135deg,#eff6ff,#dbeafe)", border: "1px solid #bfdbfe", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem", flexShrink: 0 }}>🏪</div>
            <div>
              <h2 style={{ margin: 0, fontSize: "1.15rem", fontWeight: 800, color: "#0f172a" }}>{store.name}</h2>
              <p style={{ margin: "0.2rem 0 0", fontSize: "0.875rem", color: "#6b7280", fontFamily: "monospace" }}>{store.code}</p>
            </div>
          </div>
          <span style={{ display: "inline-flex", padding: "0.3rem 0.75rem", borderRadius: "999px", fontSize: "0.75rem", fontWeight: 700, background: store.is_active ? "#f0fdf4" : "#fef2f2", color: store.is_active ? "#15803d" : "#dc2626", border: store.is_active ? "1px solid #bbf7d0" : "1px solid #fecaca" }}>
            {store.is_active ? "Actif" : "Inactif"}
          </span>
        </div>

        <div>
          <div style={rowStyle}><span style={rowLbl}>Adresse</span><span style={rowVal}>{[store.address_line_1, store.address_line_2].filter(Boolean).join(", ") || "—"}</span></div>
          <div style={rowStyle}><span style={rowLbl}>CP · Ville</span><span style={rowVal}>{[store.postal_code, store.city].filter(Boolean).join(" ") || "—"}</span></div>
          <div style={rowStyle}><span style={rowLbl}>Email magasin</span><span style={rowVal}>{store.email || "—"}</span></div>
          <div style={rowStyle}><span style={rowLbl}>Code interne</span>{store.internal_code? <span style={{ display: "inline-flex", padding: "0.25rem 0.65rem", borderRadius: "999px", fontSize: "0.78rem", fontWeight: 700, background: "#eff6ff", color: "#0a4d9b", border: "1px solid #bfdbfe", fontFamily: "monospace" }}>{store.internal_code}</span>: <span style={{ color: "#94a3b8", fontSize: "0.82rem" }}>Non défini — à renseigner dans Modifier</span>}</div>
          <div style={rowStyle}><span style={rowLbl}>Téléphone</span><span style={rowVal}>{store.phone || "—"}</span></div>
          <div style={rowStyle}><span style={rowLbl}>Compte magasin</span>
            <span style={{ display: "inline-flex", padding: "0.25rem 0.65rem", borderRadius: "999px", fontSize: "0.72rem", fontWeight: 700, background: store.store_accounts?.is_active ? "#f0fdf4" : "#f1f5f9", color: store.store_accounts?.is_active ? "#15803d" : "#64748b", border: store.store_accounts?.is_active ? "1px solid #bbf7d0" : "1px solid #e2e8f0" }}>
              {store.store_accounts ? (store.store_accounts.is_active ? "Actif" : "Inactif") : "Non configuré"}
            </span>
          </div>
          <div style={rowStyle}><span style={rowLbl}>RDM</span>
            {rdm
              ? <Link href={`${adminBase}/users/${rdm.id}`} style={{ color: "#0a4d9b", textDecoration: "none", fontWeight: 600 }}>{`${rdm.first_name} ${rdm.last_name}`.trim()}</Link>
              : <span style={{ color: "#94a3b8" }}>Non assigné</span>}
          </div>
          <div style={{ ...rowStyle, borderBottom: "none" }}><span style={rowLbl}>Clients · Bons</span><span style={{ ...rowVal, fontWeight: 700, color: "#0a4d9b" }}>{store._count.clients} clients · {store._count.bons} bons</span></div>
        </div>

        <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.5rem", paddingTop: "1.25rem", borderTop: "1px solid rgba(226,232,240,0.5)", flexWrap: "wrap" }}>
          <Link href={`${adminBase}/stores/${store.id}/edit`} style={{ display: "inline-flex", padding: "0.65rem 1.25rem", borderRadius: "0.875rem", background: "linear-gradient(135deg,#0a4d9b,#1e73d8)", color: "#fff", fontWeight: 700, fontSize: "0.875rem", textDecoration: "none", boxShadow: "0 6px 16px rgba(30,115,216,0.2)" }}>
            Modifier
          </Link>
          {/* Modal magasinier — client component */}
          <AddStaffButton storeId={store.id} />
          <Link href={`${adminBase}/stores/${store.id}/account`} style={{ display: "inline-flex", padding: "0.65rem 1.25rem", borderRadius: "0.875rem", background: "rgba(248,251,255,0.9)", color: "#475569", border: "1px solid #e2e8f0", fontWeight: 600, fontSize: "0.875rem", textDecoration: "none" }}>
            Compte magasin
          </Link>
        </div>
      </section>

      {/* Magasiniers */}
      <div style={sectionWrap}>
        <div style={sectionHead}>
          <span>Magasiniers ({store.store_staff.length})</span>
          <Link href={`${adminBase}/stores/${store.id}/staff`} style={btnLink}>Gérer</Link>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead><tr><th style={th}>Nom</th><th style={th}>Initiales</th><th style={th}>Statut</th><th style={th}>PIN bloqué</th><th style={{ ...th, textAlign: "right" }}>Fiche</th></tr></thead>
          <tbody>
            {store.store_staff.length > 0
              ? store.store_staff.map((s) => {
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
                      <td style={td}>{isBlocked ? <span style={{ fontSize: "0.75rem", color: "#dc2626", fontWeight: 600 }}>Bloqué · {formatDate(s.locked_until)}</span> : <span style={{ color: "#94a3b8" }}>—</span>}</td>
                      <td style={{ ...td, textAlign: "right" }}>
                        <Link href={`${adminBase}/users/magasiniers/${s.id}`} style={btnLink}>Voir</Link>
                      </td>
                    </tr>
                  );
                })
              : <tr><td colSpan={5} style={{ ...td, textAlign: "center", color: "#94a3b8", padding: "2rem" }}>Aucun magasinier enregistré.</td></tr>
            }
          </tbody>
        </table>
      </div>

      {/* ATCs */}
      {atcs.length > 0 && (
        <div style={sectionWrap}>
          <p style={{ ...sectionHead, display: "block" }}>ATCs liés ({atcs.length})</p>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr><th style={th}>Nom</th><th style={th}>Email</th><th style={{ ...th, textAlign: "right" }}>Fiche</th></tr></thead>
            <tbody>
              {atcs.map((a) => (
                <tr key={a.id}>
                  <td style={{ ...td, fontWeight: 600 }}>{`${a.first_name} ${a.last_name}`.trim()}</td>
                  <td style={tdM}>{a.email}</td>
                  <td style={{ ...td, textAlign: "right" }}><Link href={`${adminBase}/users/${a.id}`} style={btnLink}>Voir</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Clients */}
      <div style={sectionWrap}>
        <p style={{ ...sectionHead, display: "block" }}>Clients rattachés ({clients.length})</p>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "480px" }}>
            <thead><tr><th style={th}>Code</th><th style={th}>Nom</th><th style={th}>Ville</th><th style={{ ...th, textAlign: "right" }}>Fiche</th></tr></thead>
            <tbody>
              {clients.length > 0
                ? clients.map((c) => (
                    <tr key={c.id}>
                      <td style={{ ...tdM, fontFamily: "monospace" }}>{c.code || "—"}</td>
                      <td style={{ ...td, fontWeight: 600 }}>{c.name}</td>
                      <td style={tdM}>{c.city || "—"}</td>
                      <td style={{ ...td, textAlign: "right" }}><Link href={`${adminBase}/clients/${c.id}`} style={btnLink}>Voir</Link></td>
                    </tr>
                  ))
                : <tr><td colSpan={4} style={{ ...td, textAlign: "center", color: "#94a3b8", padding: "2rem" }}>Aucun client rattaché.</td></tr>
              }
            </tbody>
          </table>
        </div>
      </div>

      {/* Bons récents */}
      <div style={sectionWrap}>
        <p style={{ ...sectionHead, display: "block" }}>Bons récents ({recentBons.length})</p>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "560px" }}>
            <thead><tr><th style={th}>Numéro</th><th style={th}>Client</th><th style={th}>Statut</th><th style={th}>Mis à jour</th><th style={{ ...th, textAlign: "right" }}>Fiche</th></tr></thead>
            <tbody>
              {recentBons.length > 0
                ? recentBons.map((b) => {
                    const s = statusMap[b.status] ?? { label: b.status, bg: "#f1f5f9", color: "#64748b", border: "#e2e8f0" };
                    return (
                      <tr key={b.id}>
                        <td style={{ ...td, fontWeight: 700 }}>{b.bon_number}</td>
                        <td style={tdM}>{b.clients?.name ?? "—"}</td>
                        <td style={td}><span style={{ display: "inline-flex", padding: "0.3rem 0.65rem", borderRadius: "999px", fontSize: "0.75rem", fontWeight: 700, background: s.bg, color: s.color, border: `1px solid ${s.border}` }}>{s.label}</span></td>
                        <td style={tdM}>{formatDate(b.updated_at)}</td>
                        <td style={{ ...td, textAlign: "right" }}><Link href={`${adminBase}/bons/${b.id}`} style={btnLink}>Voir</Link></td>
                      </tr>
                    );
                  })
                : <tr><td colSpan={5} style={{ ...td, textAlign: "center", color: "#94a3b8", padding: "2rem" }}>Aucun bon récent.</td></tr>
              }
            </tbody>
          </table>
        </div>
      </div>

    </AdminModulePage>
  );
}