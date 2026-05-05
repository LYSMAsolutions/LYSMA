import { requireAccess } from "@/lib/require-access";

export default async function CdvClientsPage({
  params,
}: {
  params: Promise<{ distributor: string }>;
}) {
  const { distributor } = await params;
  await requireAccess({ allowedRoles: ["cdv"], distributorSlug: distributor });

  return (
    <section className="card-lysma" style={{ padding: "2rem" }}>
      <p className="badge-lysma">CDV</p>
      <h1 className="section-title" style={{ marginTop: ".75rem" }}>Clients</h1>
      <p className="section-copy" style={{ marginTop: ".75rem" }}>
        Module portefeuille clients CDV a finaliser.
      </p>
    </section>
  );
}
