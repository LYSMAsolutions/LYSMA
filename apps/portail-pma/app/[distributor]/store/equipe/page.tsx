import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireAccess } from "@/lib/require-access";
import { getStoreScopeForUser } from "@/lib/admin/bons";

export default async function StoreEquipePage({
  params,
}: {
  params: Promise<{ distributor: string }>;
}) {
  const { distributor } = await params;
  const user = await requireAccess({ allowedRoles: ["store", "store_staff"], distributorSlug: distributor });
  const stores = await getStoreScopeForUser({ distributorId: user.distributorId, userId: user.id });
  const storeIds = stores.map((store) => store.id);

  const staff = storeIds.length
    ? await prisma.store_staff.findMany({
        where: { store_id: { in: storeIds } },
        include: { stores: { select: { code: true, name: true } } },
        orderBy: [{ store_id: "asc" }, { last_name: "asc" }],
      })
    : [];

  return (
    <section className="card-lysma" style={{ padding: "2rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
        <div>
          <p className="badge-lysma">Store</p>
          <h1 className="section-title" style={{ marginTop: ".75rem" }}>Equipe magasin</h1>
          <p className="section-copy" style={{ marginTop: ".75rem" }}>
            Compagnons et profils PIN rattaches aux magasins du compte.
          </p>
        </div>
        <Link href={`/${user.distributorSlug}/store`} className="btn-secondary">Retour store</Link>
      </div>

      <div className="table-shell" style={{ marginTop: "1.5rem" }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Initiales</th>
              <th>Nom</th>
              <th>Magasin</th>
              <th>PIN a changer</th>
              <th>Statut</th>
            </tr>
          </thead>
          <tbody>
            {staff.map((member) => (
              <tr key={member.id}>
                <td>{member.initials}</td>
                <td>{`${member.first_name} ${member.last_name}`}</td>
                <td>{`${member.stores.code} - ${member.stores.name}`}</td>
                <td>{member.must_change_pin ? "Oui" : "Non"}</td>
                <td>{member.is_active ? "Actif" : "Inactif"}</td>
              </tr>
            ))}
            {!staff.length ? (
              <tr><td colSpan={5} style={{ textAlign: "center", color: "var(--muted)" }}>Aucun membre magasin.</td></tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </section>
  );
}
