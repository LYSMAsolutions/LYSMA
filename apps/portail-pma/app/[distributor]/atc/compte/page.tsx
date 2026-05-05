import { requireAccess } from "@/lib/require-access";
import { prisma } from "@/lib/prisma";
import AdminModulePage from "@/components/admin/layout/AdminModulePage";
import { Lock } from "lucide-react";

export default async function AtcComptePage({ params }: { params: Promise<{ distributor: string }> }) {
  const { distributor } = await params;
  const user    = await requireAccess({ allowedRoles: ["atc"], distributorSlug: distributor });
  const atcBase = `/${user.distributorSlug}/atc`;

  const fullUser = await prisma.users.findFirst({
    where:   { id: user.id },
    include: { roles: { select: { label: true } }, distributors: { select: { name: true } } },
  });

  return (
    <AdminModulePage
      badge="ATC · Mon compte"
      title="Mon compte"
      description="Vos informations de profil."
      backHref={atcBase}
    >
      <div className="atc-grid-2" style={{ alignItems: "start" }}>

        {/* Informations personnelles */}
        <div className="card-section" style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <p className="label-secondary" style={{ textTransform: "uppercase", letterSpacing: "0.1em" }}>
            Informations personnelles
          </p>
          {[
            { label: "Prénom",     val: fullUser?.first_name },
            { label: "Nom",        val: fullUser?.last_name  },
            { label: "Email",      val: fullUser?.email      },
            { label: "Téléphone",  val: fullUser?.phone      },
          ].map(({ label, val }) => (
            <div key={label} style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
              <span className="label-secondary">{label}</span>
              <span style={{ fontSize: "var(--font-lg)", color: "var(--c-text)", fontWeight: 500 }}>
                {val || "—"}
              </span>
            </div>
          ))}
        </div>

        {/* Accès et rôle */}
        <div className="card-section" style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <p className="label-secondary" style={{ textTransform: "uppercase", letterSpacing: "0.1em" }}>
            Accès et rôle
          </p>
          {[
            { label: "Rôle",               val: fullUser?.roles?.label || "ATC" },
            { label: "Distributeur",        val: fullUser?.distributors?.name    },
            { label: "Dernière connexion",  val: fullUser?.last_login_at
                ? new Intl.DateTimeFormat("fr-FR", { dateStyle: "short", timeStyle: "short" }).format(fullUser.last_login_at)
                : null
            },
          ].map(({ label, val }) => (
            <div key={label} style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
              <span className="label-secondary">{label}</span>
              <span style={{ fontSize: "var(--font-lg)", color: "var(--c-text)", fontWeight: 500 }}>
                {val || "—"}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Info bloc */}
      <div className="alert-info" style={{ marginTop: "1.25rem" }}>
        <Lock size={15} strokeWidth={2.5} style={{ flexShrink: 0, marginTop: "1px" }} />
        <span>
          Pour modifier vos informations ou changer votre mot de passe, contactez votre administrateur.
        </span>
      </div>
    </AdminModulePage>
  );
}