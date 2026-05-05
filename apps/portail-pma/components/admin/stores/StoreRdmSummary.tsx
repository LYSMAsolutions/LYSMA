import Link from "next/link";

type Props = {
  distributor: string;
  storeId: string;
  rdm: {
    id: string;
    first_name: string;
    last_name: string;
    email?: string | null;
    phone?: string | null;
  } | null;
};

export default function StoreRdmSummary({ distributor, storeId, rdm }: Props) {
  return (
    <section className="card-lysma p-6 space-y-4">
      <div>
        <h2 className="section-title text-[1.25rem]">Responsable de magasin</h2>
        <p className="section-copy mt-2">
          Gestion du RDM lié à ce magasin via les liaisons utilisateur ↔ magasin.
        </p>
      </div>

      {rdm ? (
        <div className="space-y-2">
          <div className="section-copy">Nom : {`${rdm.first_name} ${rdm.last_name}`.trim()}</div>
          <div className="section-copy">Email : {rdm.email || "—"}</div>
          <div className="section-copy">Téléphone : {rdm.phone || "—"}</div>

          <div className="flex flex-wrap gap-2 pt-2">
            <Link href={`/${distributor}/admin/users/${rdm.id}`} className="btn-secondary">
              Voir la fiche
            </Link>
            <Link href={`/${distributor}/admin/users/${rdm.id}/edit`} className="btn-secondary">
              Modifier l’utilisateur
            </Link>
          </div>
        </div>
      ) : (
        <div className="section-copy">Aucun RDM n’est actuellement affecté à ce magasin.</div>
      )}

      <div>
        <Link href={`/${distributor}/admin/stores/${storeId}/rdm`} className="btn-primary">
          Gérer l’affectation RDM
        </Link>
      </div>
    </section>
  );
}
