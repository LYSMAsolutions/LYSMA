import { requireAccess } from "@/lib/require-access";

export default async function CdvComptePage({
  params,
}: {
  params: Promise<{ distributor: string }>;
}) {
  const { distributor } = await params;
  await requireAccess({ allowedRoles: ["cdv"], distributorSlug: distributor });

  return (
    <section className="card-lysma" style={{ padding: "2rem" }}>
      <p className="badge-lysma">CDV</p>
      <h1 className="section-title" style={{ marginTop: ".75rem" }}>Compte</h1>
      <p className="section-copy" style={{ marginTop: ".75rem" }}>
        Parametres du compte CDV a finaliser.
      </p>
    </section>
  );
}
