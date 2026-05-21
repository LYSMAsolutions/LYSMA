import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireAccess } from "@/lib/require-access";
import { formatDateTime } from "@/lib/admin/bons";

export default async function CdvComptePage({
  params,
}: {
  params: Promise<{ distributor: string }>;
}) {
  const { distributor } = await params;
  const user = await requireAccess({ allowedRoles: ["cdv"], distributorSlug: distributor });

  const account = await prisma.users.findUnique({
    where: { id: user.id },
    include: { roles: true, distributors: true },
  });

  return (
    <section className="card-lysma" style={{ padding: "2rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
        <div>
          <p className="badge-lysma">CDV</p>
          <h1 className="section-title" style={{ marginTop: ".75rem" }}>Compte</h1>
          <p className="section-copy" style={{ marginTop: ".75rem" }}>
            Informations de session et de securite du compte CDV.
          </p>
        </div>
        <Link href={`/${user.distributorSlug}/change-password`} className="btn-primary">Changer le mot de passe</Link>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2" style={{ marginTop: "1.5rem" }}>
        <Info label="Nom" value={account ? `${account.first_name} ${account.last_name}` : "-"} />
        <Info label="Role" value={account?.roles.label || user.roleLabel} />
        <Info label="Email" value={account?.email || user.email} />
        <Info label="Distributeur" value={account?.distributors.name || user.distributorSlug} />
        <Info label="Derniere connexion" value={formatDateTime(account?.last_login_at)} />
        <Info label="Mot de passe a changer" value={account?.must_change_password ? "Oui" : "Non"} />
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
