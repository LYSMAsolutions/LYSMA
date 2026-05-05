import Link from "next/link";

type Props = {
  distributor: string;
  store: {
    id: string;
    code: string;
    name: string;
    city?: string | null;
    is_active: boolean;
    store_accounts?: {
      login_email: string;
      must_change_password: boolean;
    } | null;
    rdm?: {
      id: string;
      first_name: string;
      last_name: string;
    } | null;
    _count?: {
      clients: number;
      bons_assigned: number;
      store_staff: number;
    };
  };
};

export default function StoreCard({ distributor, store }: Props) {
  const rdmName = store.rdm
    ? `${store.rdm.first_name} ${store.rdm.last_name}`.trim()
    : "Aucun RDM";

  return (
    <article className="card-lysma" style={{ padding: "1.5rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem" }}>
        <div>
          <h3 className="section-title" style={{ fontSize: "1.1rem" }}>
            {store.name}
          </h3>
          <p className="section-copy" style={{ marginTop: ".35rem" }}>
            {store.code} · {store.city || "Ville non renseignée"}
          </p>
        </div>

        <span className={store.is_active ? "status-success" : "status-danger"}>
          {store.is_active ? "Actif" : "Inactif"}
        </span>
      </div>

      <div style={{ display: "grid", gap: ".45rem", marginTop: "1rem" }}>
        <div className="section-copy">RDM : {rdmName}</div>
        <div className="section-copy">
          Compte magasin : {store.store_accounts?.login_email || "Non créé"}
        </div>
        <div className="section-copy">
          Magasiniers : {store._count?.store_staff ?? 0}
        </div>
        <div className="section-copy">
          Clients : {store._count?.clients ?? 0}
        </div>
        <div className="section-copy">
          Bons assignés : {store._count?.bons_assigned ?? 0}
        </div>
      </div>

      <div style={{ display: "flex", gap: ".75rem", marginTop: "1.25rem", flexWrap: "wrap" }}>
        <Link href={`/${distributor}/admin/stores/${store.id}`} className="btn-secondary">
          Voir
        </Link>
        <Link href={`/${distributor}/admin/stores/${store.id}/edit`} className="btn-secondary">
          Modifier
        </Link>
        <Link href={`/${distributor}/admin/stores/${store.id}/account`} className="btn-secondary">
          Compte
        </Link>
        <Link href={`/${distributor}/admin/stores/${store.id}/rdm`} className="btn-secondary">
          RDM
        </Link>
        <Link href={`/${distributor}/admin/stores/${store.id}/staff`} className="btn-secondary">
          Équipe
        </Link>
      </div>
    </article>
  );
}