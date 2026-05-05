import { requireAccess } from "@/lib/require-access";

export default async function StoreEquipePage({
  params,
}: {
  params: Promise<{ distributor: string }>;
}) {
  const { distributor } = await params;
  await requireAccess({ allowedRoles: ["store", "store_staff"], distributorSlug: distributor });

  return (
    <section className="card-lysma" style={{ padding: "2rem" }}>
      <p className="badge-lysma">Store</p>
      <h1 className="section-title" style={{ marginTop: ".75rem" }}>Equipe</h1>
      <p className="section-copy" style={{ marginTop: ".75rem" }}>
        Module equipe magasin a finaliser.
      </p>
    </section>
  );
}
