import { prisma } from "@/lib/prisma";
import { requireAccess } from "@/lib/require-access";
import AdminModulePage from "@/components/admin/layout/AdminModulePage";

const roleStyles: Record<string, { bg: string; color: string; border: string }> = {
  admin: { bg: "#fef2f2", color: "#dc2626", border: "#fecaca" },
  cdv:   { bg: "#fffbeb", color: "#b45309", border: "#fde68a" },
  rdm:   { bg: "#f1f5f9", color: "#475569", border: "#e2e8f0" },
  atc:   { bg: "#f0fdf4", color: "#15803d", border: "#bbf7d0" },
  store: { bg: "#eff6ff", color: "#1d4ed8", border: "#bfdbfe" },
  store_staff: { bg: "#eef2ff", color: "#4338ca", border: "#c7d2fe" },
};

const th: React.CSSProperties = { padding: "0.75rem 1.25rem", textAlign: "left", fontSize: "0.72rem", fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", background: "rgba(248,251,255,0.95)", borderBottom: "1px solid rgba(217,227,240,0.8)" };
const td: React.CSSProperties = { padding: "0.9rem 1.25rem", fontSize: "0.875rem", color: "#0f172a", borderBottom: "1px solid rgba(226,232,240,0.6)", verticalAlign: "middle" };

export default async function AdminUsersRolesPage({ params }: { params: Promise<{ distributor: string }> }) {
  const { distributor } = await params;
  const currentUser = await requireAccess({ allowedRoles: ["admin"], distributorSlug: distributor });
  const adminBase = `/${currentUser.distributorSlug}/admin`;

  const roles = await prisma.roles.findMany({
    orderBy: { label: "asc" },
    include: { _count: { select: { users: true } } },
  });

  return (
    <AdminModulePage
      badge="Utilisateurs · Rôles"
      title="Rôles"
      description="Liste des rôles disponibles et volume d'utilisateurs par rôle."
      backHref={`${adminBase}/users`}
      backLabel="Retour utilisateurs"
    >
      <section style={{ borderRadius: "1.5rem", background: "rgba(255,255,255,0.75)", border: "1px solid rgba(217,227,240,0.9)", overflow: "hidden", boxShadow: "0 8px 24px rgba(15,23,42,0.05)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={th}>Code</th>
              <th style={th}>Libellé</th>
              <th style={{ ...th, textAlign: "center" }}>Utilisateurs</th>
            </tr>
          </thead>
          <tbody>
            {roles.map((role) => {
              const s = roleStyles[role.code] ?? { bg: "#f1f5f9", color: "#64748b", border: "#e2e8f0" };
              return (
                <tr key={role.id}>
                  <td style={td}>
                    <span style={{ display: "inline-flex", padding: "0.3rem 0.75rem", borderRadius: "999px", fontSize: "0.72rem", fontWeight: 800, letterSpacing: "0.08em", background: s.bg, color: s.color, border: `1px solid ${s.border}` }}>
                      {role.code.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ ...td, fontWeight: 600 }}>{role.label}</td>
                  <td style={{ ...td, textAlign: "center", fontWeight: 700, color: role._count.users > 0 ? "#0a4d9b" : "#94a3b8" }}>
                    {role._count.users}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
    </AdminModulePage>
  );
}