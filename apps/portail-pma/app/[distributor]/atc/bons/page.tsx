import { requireAccess } from "@/lib/require-access";
import { getBonListForAtc } from "@/lib/admin/bons";
import AdminModulePage from "@/components/admin/layout/AdminModulePage";
import BonStatusBadge from "@/components/admin/bons/BonStatusBadge";
import Link from "next/link";
import { Plus, Eye, ClipboardList } from "lucide-react";

const TYPE_MAP: Record<string, string> = {
  commande_devis:    "Commande / Devis",
  retour:            "Retour pièces",
  sav:               "SAV matériel",
  intervention:      "Intervention",
  devis_materiel:    "Devis matériel",
  commande_materiel: "Commande matériel",
  garantie:          "Garantie",
  releve_parc:       "Relevé de parc",
};

export default async function AtcBonsPage({ params }: { params: Promise<{ distributor: string }> }) {
  const { distributor } = await params;
  const user    = await requireAccess({ allowedRoles: ["atc"], distributorSlug: distributor });
  const atcBase = `/${user.distributorSlug}/atc`;

  const bons = await getBonListForAtc({ distributorId: user.distributorId, userId: user.id });

  const total    = bons.length;
  const aSuivre  = bons.filter((b) => ["envoye","non_pris_en_charge","pris_en_charge","en_cours","attente_client","attente_fournisseur","a_corriger"].includes(b.status)).length;
  const traites  = bons.filter((b) => b.status === "traite").length;
  const aCorrect = bons.filter((b) => b.status === "a_corriger").length;
  const refuses  = bons.filter((b) => b.status === "refuse").length;

  return (
    <AdminModulePage
      badge="ATC · Mes bons"
      title="Mes bons"
      description="Tous les bons que tu as créés et leur état de traitement."
      backHref={atcBase}
      actions={
        <Link href={`${atcBase}/bons/new`} className="btn-primary" style={{ textDecoration: "none" }}>
          <Plus size={15} strokeWidth={2.5} /> Nouveau bon
        </Link>
      }
      kpis={[
        { title: "Total",      value: total,    note: "bons créés",          tone: "blue"    },
        { title: "À suivre",   value: aSuivre,  note: "encore actifs",       tone: "yellow"  },
        { title: "À corriger", value: aCorrect, note: "correction demandée", tone: "red"     },
        { title: "Traités",    value: traites,  note: "finalisés",           tone: "green"   },
        { title: "Refusés",    value: refuses,  note: "bons refusés",        tone: "neutral" },
      ]}
    >
      <div className="table-shell">
        <div style={{ overflowX: "auto" }}>
          <table className="data-table" style={{ minWidth: "700px" }}>
            <thead>
              <tr>
                <th>Numéro</th>
                <th>Type</th>
                <th>Client</th>
                <th>Magasin</th>
                <th>Statut</th>
                <th>Créé le</th>
                <th style={{ textAlign: "right" }}></th>
              </tr>
            </thead>
            <tbody>
              {bons.map((bon) => (
                <tr key={bon.id}>
                  <td style={{ fontWeight: 700 }}>{bon.bon_number}</td>
                  <td style={{ color: "var(--c-text-secondary)", fontSize: "var(--font-sm)" }}>
                    {TYPE_MAP[bon.bon_type] || bon.bon_type}
                  </td>
                  <td>{bon.clientName}</td>
                  <td style={{ color: "var(--c-text-secondary)", fontSize: "var(--font-sm)" }}>{bon.storeName}</td>
                  <td><BonStatusBadge status={bon.status} /></td>
                  <td style={{ color: "var(--c-text-secondary)", fontSize: "var(--font-sm)" }}>{bon.createdAt}</td>
                  <td style={{ textAlign: "right" }}>
                    <Link href={`${atcBase}/bons/${bon.id}`}
                      className="badge-lysma badge-blue"
                      style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.25rem" }}>
                      <Eye size={11} strokeWidth={2.5} /> Voir
                    </Link>
                  </td>
                </tr>
              ))}
              {!bons.length && (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center", padding: "3rem" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem" }}>
                      <ClipboardList size={36} color="var(--c-text-muted)" strokeWidth={1.5} />
                      <p style={{ margin: 0, fontWeight: 600, color: "var(--c-text)" }}>Aucun bon pour l'instant</p>
                      <p style={{ margin: 0, fontSize: "var(--font-sm)", color: "var(--c-text-secondary)" }}>
                        Crée ton premier bon en cliquant sur "Nouveau bon"
                      </p>
                      <Link href={`${atcBase}/bons/new`} className="btn-primary" style={{ textDecoration: "none", marginTop: "0.25rem" }}>
                        <Plus size={14} strokeWidth={2.5} /> Créer mon premier bon
                      </Link>
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