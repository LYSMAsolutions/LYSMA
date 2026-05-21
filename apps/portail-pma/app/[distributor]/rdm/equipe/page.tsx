import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireAccess } from "@/lib/require-access";
import { getStoreScopeForUser } from "@/lib/admin/bons";
import StoreStaffCreateForm from "@/components/admin/forms/StoreStaffCreateForm";

export default async function RdmEquipePage({
  params,
}: {
  params: Promise<{ distributor: string }>;
}) {
  const { distributor } = await params;
  const user = await requireAccess({ allowedRoles: ["rdm"], distributorSlug: distributor });
  const rdmBase = `/${user.distributorSlug}/rdm`;

  const stores = await getStoreScopeForUser({
    distributorId: user.distributorId,
    userId: user.id,
  });

  const staff = stores.length
    ? await prisma.store_staff.findMany({
        where: { store_id: { in: stores.map((store) => store.id) } },
        include: { stores: { select: { code: true, name: true } } },
        orderBy: [{ store_id: "asc" }, { last_name: "asc" }, { first_name: "asc" }],
      })
    : [];

  return (
    <div className="space-y-8">
      <section className="card-lysma" style={{ padding: "2rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p className="badge-lysma">RDM</p>
            <h1 className="section-title" style={{ marginTop: ".75rem" }}>Equipe magasin</h1>
            <p className="section-copy" style={{ marginTop: ".75rem" }}>
              Magasiniers rattaches a tes magasins, avec creation par PIN.
            </p>
          </div>
          <Link href={rdmBase} className="btn-secondary">Retour RDM</Link>
        </div>
      </section>

      <section className="card-lysma" style={{ padding: "2rem" }}>
        <h2 className="section-title">Magasiniers</h2>
        <div className="table-shell" style={{ marginTop: "1.25rem" }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Initiales</th>
                <th>Magasin</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              {staff.map((item) => (
                <tr key={item.id}>
                  <td>{`${item.first_name} ${item.last_name}`.trim()}</td>
                  <td>{item.initials}</td>
                  <td>{item.stores.code} - {item.stores.name}</td>
                  <td>{item.is_active ? "Actif" : "Inactif"}</td>
                </tr>
              ))}
              {!staff.length ? (
                <tr><td colSpan={4} style={{ textAlign: "center", color: "var(--muted)" }}>Aucun magasinier.</td></tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>

      {stores.map((store) => (
        <section key={store.id} className="card-lysma" style={{ padding: "2rem" }}>
          <p className="badge-lysma">{store.code}</p>
          <h2 className="section-title" style={{ marginTop: ".75rem" }}>Creer un magasinier - {store.name}</h2>
          <div style={{ marginTop: "1.25rem" }}>
            <StoreStaffCreateForm storeId={store.id} />
          </div>
        </section>
      ))}
    </div>
  );
}
