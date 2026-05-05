import { requireAccess } from "@/lib/require-access";
import { prisma } from "@/lib/prisma";
import AdminModulePage from "@/components/admin/layout/AdminModulePage";
import Link from "next/link";
import { Users } from "lucide-react";

export default async function AtcClientsPage({ params }: { params: Promise<{ distributor: string }> }) {
  const { distributor } = await params;
  const user    = await requireAccess({ allowedRoles: ["atc"], distributorSlug: distributor });
  const atcBase = `/${user.distributorSlug}/atc`;

  const clients = await prisma.clients.findMany({
    where:   { distributor_id: user.distributorId, assigned_user_id: user.id },
    include: { stores: { select: { name: true, code: true } } },
    orderBy: { name: "asc" },
  });

  const total  = clients.length;
  const actifs = clients.filter((c) => c.is_active).length;

  return (
    <AdminModulePage
      badge="ATC · Clients"
      title="Mon portefeuille clients"
      description="Les clients qui te sont assignés."
      backHref={atcBase}
      kpis={[
        { title: "Total",  value: total,  note: "clients assignés", tone: "blue"  },
        { title: "Actifs", value: actifs, note: "clients actifs",   tone: "green" },
      ]}
    >
      <div className="table-shell">
        <div style={{ overflowX: "auto" }}>
          <table className="data-table" style={{ minWidth: "600px" }}>
            <thead>
              <tr>
                <th>Code</th>
                <th>Nom</th>
                <th>Email</th>
                <th>Téléphone</th>
                <th>Ville</th>
                <th>Magasin</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((c) => (
                <tr key={c.id}>
                  <td style={{ fontFamily: "monospace", color: "var(--c-text-secondary)", fontSize: "var(--font-sm)" }}>
                    {c.code || "—"}
                  </td>
                  <td style={{ fontWeight: 600 }}>{c.name}</td>
                  <td style={{ color: "var(--c-text-secondary)", fontSize: "var(--font-sm)" }}>{c.email || "—"}</td>
                  <td style={{ color: "var(--c-text-secondary)", fontSize: "var(--font-sm)" }}>{c.phone || "—"}</td>
                  <td style={{ color: "var(--c-text-secondary)", fontSize: "var(--font-sm)" }}>{c.city || "—"}</td>
                  <td style={{ color: "var(--c-text-secondary)", fontSize: "var(--font-sm)" }}>
                    {c.stores ? `${c.stores.code} · ${c.stores.name}` : "—"}
                  </td>
                  <td>
                    <span className={`badge-lysma ${c.is_active ? "badge-green" : "badge-gray"}`}>
                      {c.is_active ? "Actif" : "Inactif"}
                    </span>
                  </td>
                </tr>
              ))}
              {!clients.length && (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center", padding: "3rem", color: "var(--c-text-muted)" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem" }}>
                      <Users size={36} color="var(--c-text-muted)" strokeWidth={1.5} />
                      <p style={{ margin: 0, fontWeight: 600, color: "var(--c-text)" }}>Aucun client assigné</p>
                      <p style={{ margin: 0, fontSize: "var(--font-sm)", color: "var(--c-text-secondary)" }}>
                        Contactez votre administrateur pour l'assignation de clients.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminModulePage>
  );
}