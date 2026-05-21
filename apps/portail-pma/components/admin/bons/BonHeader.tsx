import Link from "next/link";
import BonStatusBadge from "./BonStatusBadge";

type Props = {
  distributor: string;
  showAdminNav?: boolean;
  bon: {
    id: string;
    bon_number: string;
    bon_type: string;
    status: string;
    priority?: string | null;
    sent_at?: Date | null;
    due_at?: Date | null;
    clients?: {
      id: string;
      name: string;
      code?: string | null;
    } | null;
    stores?: {
      id: string;
      code: string;
      name: string;
    } | null;
    users?: {
      id: string;
      first_name: string;
      last_name: string;
    } | null;
    store_staff?: {
      id: string;
      first_name: string;
      last_name: string;
    } | null;
  };
};

function formatDate(value?: Date | null) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(value);
}

export default function BonHeader({ distributor, bon, showAdminNav = true }: Props) {
  const creatorName = bon.users
    ? `${bon.users.first_name} ${bon.users.last_name}`.trim()
    : "—";

  const takenByName = bon.store_staff
    ? `${bon.store_staff.first_name} ${bon.store_staff.last_name}`.trim()
    : "—";

  return (
    <section className="card-lysma" style={{ padding: "2rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "start" }}>
        <div>
          <h1 className="section-title" style={{ fontSize: "1.6rem" }}>
            Bon {bon.bon_number}
          </h1>
          <p className="section-copy" style={{ marginTop: ".5rem" }}>
            Type : {bon.bon_type}
          </p>
        </div>

        <BonStatusBadge status={bon.status} />
      </div>

      <div
        style={{
          display: "grid",
          gap: ".6rem",
          gridTemplateColumns: "repeat(2,minmax(0,1fr))",
          marginTop: "1.25rem",
        }}
      >
        <div className="section-copy">
          Client :{" "}
          {bon.clients ? (
            <Link href={`/${distributor}/admin/clients/${bon.clients.id}`} className="btn-ghost">
              {bon.clients.code ? `${bon.clients.code} · ` : ""}{bon.clients.name}
            </Link>
          ) : (
            "—"
          )}
        </div>

        <div className="section-copy">
          Magasin assigné :{" "}
          {bon.stores ? `${bon.stores.code} · ${bon.stores.name}` : "—"}
        </div>

        <div className="section-copy">Créé par : {creatorName}</div>
        <div className="section-copy">Pris en charge par : {takenByName}</div>

        <div className="section-copy">Priorité : {bon.priority || "—"}</div>
        <div className="section-copy">Envoyé le : {formatDate(bon.sent_at)}</div>

        <div className="section-copy">Échéance : {formatDate(bon.due_at)}</div>
      </div>

      {showAdminNav ? <div style={{ display: "flex", gap: ".75rem", flexWrap: "wrap", marginTop: "1.5rem" }}>
        <Link href={`/${distributor}/admin/bons/${bon.id}/detail`} className="btn-secondary">
          Détail
        </Link>
        <Link href={`/${distributor}/admin/bons/${bon.id}/historique`} className="btn-secondary">
          Historique
        </Link>
        <Link href={`/${distributor}/admin/bons/${bon.id}/lignes`} className="btn-secondary">
          Lignes
        </Link>
        <Link href={`/${distributor}/admin/bons/${bon.id}/documents`} className="btn-secondary">
          Documents
        </Link>
        <Link href={`/${distributor}/admin/bons/${bon.id}/photos`} className="btn-secondary">
          Photos
        </Link>
        <Link href={`/${distributor}/admin/bons/${bon.id}/commentaires`} className="btn-secondary">
          Commentaires
        </Link>
        <Link href={`/${distributor}/admin/bons/${bon.id}/anomalies`} className="btn-secondary">
          Anomalies
        </Link>
      </div> : null}
    </section>
  );
}
