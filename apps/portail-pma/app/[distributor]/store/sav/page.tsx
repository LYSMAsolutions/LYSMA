import {
  Activity,
  AlertTriangle,
  ClipboardList,
  FileText,
  Settings2,
  Store,
  Wrench,
  XCircle,
} from "lucide-react";
import { requireAccess } from "@/lib/require-access";
import { getBonListForStore, getStoreScopeForUser } from "@/lib/admin/bons";
import BonStatusBadge from "@/components/admin/bons/BonStatusBadge";
import {
  PriorityPanel,
  QuickActions,
  RecentCard,
  RoleHero,
  RoleKpiGrid,
} from "@/components/role-dashboard/RoleDashboardKit";

const SAV_TYPES = ["sav", "intervention", "devis_materiel", "contrat_maintenance"];

export default async function StoreSavPage({
  params,
}: {
  params: Promise<{ distributor: string }>;
}) {
  const { distributor } = await params;

  const currentUser = await requireAccess({
    allowedRoles: ["store", "store_staff"],
    distributorSlug: distributor,
  });

  const storeBase = `/${currentUser.distributorSlug}/store`;

  const stores = await getStoreScopeForUser({
    distributorId: currentUser.distributorId,
    userId: currentUser.id,
  });

  const savStores = stores.filter((store) => store.store_type === "sav");
  const savStoreIds = savStores.map((store) => store.id);
  const bons = (await getBonListForStore({
    distributorId: currentUser.distributorId,
    storeIds: savStoreIds,
  })).filter((bon) => SAV_TYPES.includes(bon.bon_type));

  const nonPrisEnCharge = bons.filter((bon) =>
    ["envoye", "non_pris_en_charge"].includes(bon.status)
  ).length;
  const enCours = bons.filter((bon) =>
    ["pris_en_charge", "en_cours", "attente_client", "attente_fournisseur", "a_corriger"].includes(bon.status)
  ).length;
  const contrats = bons.filter((bon) => bon.bon_type === "contrat_maintenance").length;
  const refuses = bons.filter((bon) => bon.status === "refuse").length;

  return (
    <div className="space-y-8">
      <RoleHero
        eyebrow="Espace magasin SAV"
        title="File SAV et maintenance"
        description="Traitement des dossiers SAV, interventions, devis materiel et contrats de maintenance sans supprimer les refus de l'historique."
        primary={{ href: `${storeBase}/bons`, label: "Tous les bons" }}
        secondary={{ href: storeBase, label: "Retour magasin" }}
      />

      {!savStores.length ? (
        <section className="card-lysma p-8">
          <div className="rounded-2xl border border-dashed border-[#D9E3F0] bg-[#F8FBFF] px-5 py-6 text-sm text-[#6B7280]">
            Aucun magasin SAV n'est rattache a ce compte. L'admin doit lier un magasin de type SAV a cet utilisateur.
          </div>
        </section>
      ) : (
        <>
          <RoleKpiGrid
            items={[
              {
                title: "Total SAV",
                value: bons.length,
                subtitle: "dossiers visibles",
                href: `${storeBase}/sav`,
                icon: Wrench,
                tone: "info",
              },
              {
                title: "A prendre",
                value: nonPrisEnCharge,
                subtitle: "nouveaux dossiers",
                href: `${storeBase}/sav`,
                icon: AlertTriangle,
                tone: "warning",
              },
              {
                title: "En traitement",
                value: enCours,
                subtitle: "SAV actifs",
                href: `${storeBase}/sav`,
                icon: Activity,
                tone: "default",
              },
              {
                title: "Contrats",
                value: contrats,
                subtitle: "maintenance",
                href: `${storeBase}/sav`,
                icon: FileText,
                tone: "success",
              },
              {
                title: "Refuses",
                value: refuses,
                subtitle: "conserves",
                href: `${storeBase}/sav`,
                icon: XCircle,
                tone: "danger",
              },
            ]}
          />

          <section className="grid grid-cols-1 gap-8 xl:grid-cols-[1.2fr_0.8fr]">
            <RecentCard title="Bons SAV" href={`${storeBase}/sav`} empty={!bons.length}>
              {bons.map((bon) => (
                <a
                  key={bon.id}
                  href={`${storeBase}/bons/${bon.id}`}
                  className="flex flex-col gap-4 rounded-2xl border border-[#E2E8F0] bg-[#F8FBFF] px-5 py-4 transition hover:border-[#C9D8EB] hover:bg-white md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <p className="font-semibold text-[#0F172A]">{bon.bon_number}</p>
                    <p className="mt-1 text-sm text-[#6B7280]">{bon.clientName}</p>
                  </div>
                  <div className="grid gap-2 text-sm text-[#6B7280] md:min-w-[260px] md:grid-cols-2 md:text-right">
                    <span>{bon.bon_type}</span>
                    <span>{bon.createdAt}</span>
                  </div>
                  <BonStatusBadge status={bon.status} />
                </a>
              ))}
            </RecentCard>

            <div className="space-y-8">
              <PriorityPanel
                title="Priorites SAV"
                subtitle="Dossiers a ne pas laisser dormir"
                icon={AlertTriangle}
                items={[
                  {
                    title: "A prendre",
                    value: nonPrisEnCharge,
                    hint: "Ouvrir les nouveaux dossiers SAV.",
                    href: `${storeBase}/sav`,
                    icon: ClipboardList,
                  },
                  {
                    title: "Contrats",
                    value: contrats,
                    hint: "Suivre les contrats de maintenance.",
                    href: `${storeBase}/sav`,
                    icon: FileText,
                  },
                ]}
              />

              <QuickActions
                items={[
                  {
                    title: "File magasin",
                    description: "Revenir aux bons magasin standards.",
                    href: `${storeBase}/bons`,
                    icon: Store,
                  },
                  {
                    title: "Parametres du compte",
                    description: "Verifier les magasins rattaches.",
                    href: `${storeBase}/compte`,
                    icon: Settings2,
                  },
                ]}
              />
            </div>
          </section>

          <section className="card-lysma p-8">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#E8F1FB]">
                <Store className="h-5 w-5 text-[#0A4D9B]" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-[#0F172A]">Magasins SAV rattaches</h3>
                <p className="text-sm text-[#6B7280]">Perimetre exact utilise pour filtrer cette file.</p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {savStores.map((store) => (
                <div key={store.id} className="rounded-2xl border border-[#E2E8F0] bg-[#F8FBFF] p-5">
                  <p className="font-semibold text-[#0F172A]">{store.code} - {store.name}</p>
                  <p className="mt-2 text-sm text-[#6B7280]">Magasin SAV</p>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
