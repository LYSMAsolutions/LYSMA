import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireAccess } from "@/lib/require-access";
import AdminModulePage from "@/components/admin/layout/AdminModulePage";
import UserCard from "@/components/admin/users/UserCard";

const th: React.CSSProperties = { padding: "0.75rem 1.25rem", textAlign: "left", fontSize: "0.72rem", fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", background: "rgba(248,251,255,0.95)", borderBottom: "1px solid rgba(217,227,240,0.8)", whiteSpace: "nowrap" };
const td: React.CSSProperties = { padding: "0.9rem 1.25rem", fontSize: "0.875rem", color: "#0f172a", borderBottom: "1px solid rgba(226,232,240,0.6)", verticalAlign: "middle" };
const tdM: React.CSSProperties = { ...td, color: "#6b7280", fontSize: "0.82rem" };
const sectionStyle: React.CSSProperties = { borderRadius: "1.5rem", background: "rgba(255,255,255,0.75)", border: "1px solid rgba(217,227,240,0.9)", overflow: "hidden", boxShadow: "0 8px 24px rgba(15,23,42,0.05)" };
const sectionTitle: React.CSSProperties = { margin: 0, fontSize: "0.82rem", fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em", padding: "1rem 1.25rem", borderBottom: "1px solid rgba(217,227,240,0.8)", background: "rgba(248,251,255,0.95)" };
const emptyRow = (cols: number, msg: string) => (
  <tr><td colSpan={cols} style={{ ...td, textAlign: "center", color: "#94a3b8", padding: "2rem" }}>{msg}</td></tr>
);
const btnLink: React.CSSProperties = { display: "inline-flex", padding: "0.3rem 0.65rem", borderRadius: "999px", fontSize: "0.75rem", fontWeight: 600, color: "#0a4d9b", border: "1px solid #bfdbfe", background: "rgba(255,255,255,0.8)", textDecoration: "none" };

export default async function AdminUserDetailPage({
  params,
}: { params: Promise<{ distributor: string; id: string }> }) {
  const { distributor, id } = await params;
  const currentUser = await requireAccess({ allowedRoles: ["admin"], distributorSlug: distributor });
  const adminBase = `/${currentUser.distributorSlug}/admin`;

  const user = await prisma.users.findFirst({
    where: { id, distributor_id: currentUser.distributorId },
    include: {
      roles: true,
      _count: { select: { clients: true, bons: true } },
      user_store_links: { include: { stores: true } },
      // Supervisor (CDV de cet ATC)
      supervisor: { select: { id: true, first_name: true, last_name: true, email: true, roles: true } },
      // ATCs supervisés (si CDV)
      supervised_users: {
        where: { is_active: true },
        select: {
          id: true, first_name: true, last_name: true, email: true, code: true,
          _count: { select: { clients: true, bons: true } },
        },
        orderBy: { last_name: "asc" },
      },
    },
  });

  if (!user) notFound();

  const roleCode = user.roles?.code;

  // Données supplémentaires selon rôle
  const [clients, stores, storeStaff] = await Promise.all([
    // ATC ou Admin → ses clients
    (roleCode === "atc" || roleCode === "admin")
      ? prisma.clients.findMany({
          where: { assigned_user_id: id },
          select: { id: true, name: true, code: true, city: true },
          orderBy: { name: "asc" },
          take: 50,
        })
      : Promise.resolve([]),

    // RDM → magasins liés (déjà dans user_store_links mais on enrichit)
    roleCode === "rdm"
      ? prisma.stores.findMany({
          where: { user_store_links: { some: { user_id: id } } },
          include: { _count: { select: { store_staff: true, clients: true } } },
          orderBy: { code: "asc" },
        })
      : Promise.resolve([]),

    // RDM → magasiniers de ses magasins
    roleCode === "rdm"
      ? prisma.store_staff.findMany({
          where: {
            stores: { user_store_links: { some: { user_id: id } } },
            is_active: true,
          },
          include: { stores: { select: { code: true, name: true } } },
          orderBy: { last_name: "asc" },
        })
      : Promise.resolve([]),
  ]);

  // CDV → clients de tous ses ATCs
  const cdvAtcClients = roleCode === "cdv" && user.supervised_users.length > 0
    ? await prisma.clients.findMany({
        where: { assigned_user_id: { in: user.supervised_users.map((a) => a.id) } },
        select: { id: true, name: true, code: true, city: true, users: { select: { first_name: true, last_name: true } } },
        orderBy: { name: "asc" },
        take: 100,
      })
    : [];

  return (
    <AdminModulePage
      badge="Utilisateur · Détail"
      title={`${user.first_name} ${user.last_name}`.trim()}
      description={`${user.roles?.label ?? "—"} · Fiche complète`}
      backHref={`${adminBase}/users`}
      backLabel="Retour utilisateurs"
    >
      <UserCard distributor={currentUser.distributorSlug} user={user} />

      {/* ── ATC → Superviseur CDV ── */}
      {roleCode === "atc" && (
        <div style={sectionStyle}>
          <p style={sectionTitle}>CDV superviseur</p>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr><th style={th}>Nom</th><th style={th}>Email</th><th style={th}>Fiche</th></tr></thead>
            <tbody>
              {user.supervisor ? (
                <tr>
                  <td style={{ ...td, fontWeight: 600 }}>{`${user.supervisor.first_name} ${user.supervisor.last_name}`.trim()}</td>
                  <td style={tdM}>{user.supervisor.email}</td>
                  <td style={td}><Link href={`${adminBase}/users/${user.supervisor.id}`} style={btnLink}>Voir</Link></td>
                </tr>
              ) : emptyRow(3, "Aucun CDV superviseur rattaché.")}
            </tbody>
          </table>
        </div>
      )}

      {/* ── ATC → Clients assignés ── */}
      {roleCode === "atc" && (
        <div style={sectionStyle}>
          <p style={sectionTitle}>Clients assignés ({clients.length})</p>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "480px" }}>
              <thead><tr><th style={th}>Code</th><th style={th}>Nom</th><th style={th}>Ville</th><th style={th}>Fiche</th></tr></thead>
              <tbody>
                {clients.length > 0
                  ? clients.map((c) => (
                      <tr key={c.id}>
                        <td style={{ ...tdM, fontFamily: "monospace" }}>{c.code || "—"}</td>
                        <td style={{ ...td, fontWeight: 600 }}>{c.name}</td>
                        <td style={tdM}>{c.city || "—"}</td>
                        <td style={td}><Link href={`${adminBase}/clients/${c.id}`} style={btnLink}>Voir</Link></td>
                      </tr>
                    ))
                  : emptyRow(4, "Aucun client assigné.")}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── CDV → ATCs supervisés ── */}
      {roleCode === "cdv" && (
        <div style={sectionStyle}>
          <p style={sectionTitle}>ATCs supervisés ({user.supervised_users.length})</p>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "560px" }}>
              <thead><tr><th style={th}>Nom</th><th style={th}>Code</th><th style={{ ...th, textAlign: "center" }}>Clients</th><th style={{ ...th, textAlign: "center" }}>Bons</th><th style={th}>Fiche</th></tr></thead>
              <tbody>
                {user.supervised_users.length > 0
                  ? user.supervised_users.map((a) => (
                      <tr key={a.id}>
                        <td style={{ ...td, fontWeight: 600 }}>{`${a.first_name} ${a.last_name}`.trim()}</td>
                        <td style={{ ...tdM, fontFamily: "monospace" }}>{a.code || "—"}</td>
                        <td style={{ ...td, textAlign: "center" }}>{a._count.clients}</td>
                        <td style={{ ...td, textAlign: "center" }}>{a._count.bons}</td>
                        <td style={td}><Link href={`${adminBase}/users/${a.id}`} style={btnLink}>Voir</Link></td>
                      </tr>
                    ))
                  : emptyRow(5, "Aucun ATC rattaché à ce CDV.")}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── CDV → Clients de ses ATCs ── */}
      {roleCode === "cdv" && cdvAtcClients.length > 0 && (
        <div style={sectionStyle}>
          <p style={sectionTitle}>Clients du portefeuille ({cdvAtcClients.length})</p>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "560px" }}>
              <thead><tr><th style={th}>Code</th><th style={th}>Nom</th><th style={th}>Ville</th><th style={th}>ATC</th><th style={th}>Fiche</th></tr></thead>
              <tbody>
                {cdvAtcClients.map((c) => (
                  <tr key={c.id}>
                    <td style={{ ...tdM, fontFamily: "monospace" }}>{c.code || "—"}</td>
                    <td style={{ ...td, fontWeight: 600 }}>{c.name}</td>
                    <td style={tdM}>{c.city || "—"}</td>
                    <td style={tdM}>{c.users ? `${c.users.first_name} ${c.users.last_name}`.trim() : "—"}</td>
                    <td style={td}><Link href={`${adminBase}/clients/${c.id}`} style={btnLink}>Voir</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── RDM → Magasins ── */}
      {roleCode === "rdm" && (
        <div style={sectionStyle}>
          <p style={sectionTitle}>Magasins gérés ({stores.length})</p>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr><th style={th}>Code</th><th style={th}>Nom</th><th style={th}>Ville</th><th style={{ ...th, textAlign: "center" }}>Magasiniers</th><th style={{ ...th, textAlign: "center" }}>Clients</th><th style={th}>Fiche</th></tr></thead>
            <tbody>
              {stores.length > 0
                ? stores.map((s) => (
                    <tr key={s.id}>
                      <td style={{ ...tdM, fontFamily: "monospace" }}>{s.code}</td>
                      <td style={{ ...td, fontWeight: 600 }}>{s.name}</td>
                      <td style={tdM}>{s.city || "—"}</td>
                      <td style={{ ...td, textAlign: "center" }}>{s._count.store_staff}</td>
                      <td style={{ ...td, textAlign: "center" }}>{s._count.clients}</td>
                      <td style={td}><Link href={`${adminBase}/stores/${s.id}`} style={btnLink}>Voir</Link></td>
                    </tr>
                  ))
                : emptyRow(6, "Aucun magasin lié.")}
            </tbody>
          </table>
        </div>
      )}

      {/* ── RDM → Magasiniers ── */}
      {roleCode === "rdm" && storeStaff.length > 0 && (
        <div style={sectionStyle}>
          <p style={sectionTitle}>Magasiniers ({storeStaff.length})</p>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr><th style={th}>Nom</th><th style={th}>Magasin</th><th style={th}>Statut</th></tr></thead>
            <tbody>
              {storeStaff.map((s) => (
                <tr key={s.id}>
                  <td style={{ ...td, fontWeight: 600 }}>{`${s.first_name} ${s.last_name}`.trim()}</td>
                  <td style={tdM}>{s.stores.code} · {s.stores.name}</td>
                  <td style={td}>
                    <span style={{ display: "inline-flex", padding: "0.25rem 0.65rem", borderRadius: "999px", fontSize: "0.72rem", fontWeight: 700, background: s.is_active ? "#f0fdf4" : "#fef2f2", color: s.is_active ? "#15803d" : "#dc2626", border: s.is_active ? "1px solid #bbf7d0" : "1px solid #fecaca" }}>
                      {s.is_active ? "Actif" : "Inactif"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Magasins liés (CDV, Admin — pas ATC ni RDM) ── */}
      {roleCode !== "rdm" && roleCode !== "atc" && user.user_store_links.length > 0 && (
        <div style={sectionStyle}>
          <p style={sectionTitle}>Magasins liés</p>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "480px" }}>
              <thead><tr><th style={th}>Code</th><th style={th}>Nom</th><th style={th}>Ville</th><th style={th}>Fiche</th></tr></thead>
              <tbody>
                {user.user_store_links.map((link) => (
                  <tr key={link.id}>
                    <td style={{ ...tdM, fontFamily: "monospace" }}>{link.stores.code}</td>
                    <td style={{ ...td, fontWeight: 600 }}>{link.stores.name}</td>
                    <td style={tdM}>{link.stores.city || "—"}</td>
                    <td style={td}><Link href={`${adminBase}/stores/${link.stores.id}`} style={btnLink}>Voir</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </AdminModulePage>
  );
}