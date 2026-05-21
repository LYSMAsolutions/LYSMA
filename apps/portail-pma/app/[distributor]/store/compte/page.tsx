import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireAccess } from "@/lib/require-access";
import { formatDateTime, getStoreScopeForUser } from "@/lib/admin/bons";

export default async function StoreComptePage({
  params,
}: {
  params: Promise<{ distributor: string }>;
}) {
  const { distributor } = await params;
  const user = await requireAccess({ allowedRoles: ["store", "store_staff"], distributorSlug: distributor });

  const [account, stores] = await Promise.all([
    prisma.users.findUnique({ where: { id: user.id }, include: { roles: true, distributors: true } }),
    getStoreScopeForUser({ distributorId: user.distributorId, userId: user.id }),
  ]);

  return (
    <section className="card-lysma" style={{ padding: "2rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
        <div>
          <p className="badge-lysma">Store</p>
          <h1 className="section-title" style={{ marginTop: ".75rem" }}>Compte magasin</h1>
          <p className="section-copy" style={{ marginTop: ".75rem" }}>
            Informations du compte connecte et magasins rattaches.
          </p>
        </div>
        <Link href={`/${user.distributorSlug}/change-password`} className="btn-primary">Changer le mot de passe</Link>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2" style={{ marginTop: "1.5rem" }}>
        <Info label="Nom" value={account ? `${account.first_name} ${account.last_name}` : "-"} />
        <Info label="Role" value={account?.roles.label || user.roleLabel} />
        <Info label="Email" value={account?.email || user.email} />
        <Info label="Derniere connexion" value={formatDateTime(account?.last_login_at)} />
      </div>

      <h2 className="section-title" style={{ marginTop: "2rem", fontSize: "1.25rem" }}>Magasins rattaches</h2>
      <div className="table-shell" style={{ marginTop: "1rem" }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Code</th>
              <th>Nom</th>
              <th>Ville</th>
              <th>Statut</th>
            </tr>
          </thead>
          <tbody>
            {stores.map((store) => (
              <tr key={store.id}>
                <td>{store.code}</td>
                <td>{store.name}</td>
                <td>{store.city || "-"}</td>
                <td>{store.is_active ? "Actif" : "Inactif"}</td>
              </tr>
            ))}
            {!stores.length ? (
              <tr><td colSpan={4} style={{ textAlign: "center", color: "var(--muted)" }}>Aucun magasin rattache.</td></tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[22px] border border-[#D9E3F0] bg-white px-5 py-4">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#94A3B8]">{label}</p>
      <p className="mt-2 text-sm font-medium text-[#0F172A]">{value}</p>
    </div>
  );
}
