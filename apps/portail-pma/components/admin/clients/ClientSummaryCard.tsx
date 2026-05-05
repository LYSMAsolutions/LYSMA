import Link from "next/link";

type Props = {
  distributor: string;
  client: {
    id: string;
    code: string | null;
    name: string;
    address_line_1?: string | null;
    postal_code?: string | null;
    city?: string | null;
    email?: string | null;
    phone?: string | null;
    storeName?: string | null;
    atcName?: string | null;
    bonsCount?: number;
  };
};

export default function ClientSummaryCard({ distributor, client }: Props) {
  return (
    <article className="card-lysma" style={{ padding: "1.5rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem" }}>
        <div>
          <h3 className="section-title" style={{ fontSize: "1.1rem" }}>
            {client.name}
          </h3>
          <p className="section-copy" style={{ marginTop: ".35rem" }}>
            {client.code || "Sans code"}
          </p>
        </div>
      </div>

      <div style={{ display: "grid", gap: ".45rem", marginTop: "1rem" }}>
        <div className="section-copy">
          Adresse :{" "}
          {client.address_line_1
            ? `${client.address_line_1}${client.postal_code || client.city ? `, ${client.postal_code || ""} ${client.city || ""}` : ""}`
            : "—"}
        </div>
        <div className="section-copy">Email : {client.email || "—"}</div>
        <div className="section-copy">Téléphone : {client.phone || "—"}</div>
        <div className="section-copy">Magasin : {client.storeName || "—"}</div>
        <div className="section-copy">ATC : {client.atcName || "—"}</div>
        <div className="section-copy">Bons : {client.bonsCount ?? 0}</div>
      </div>

      <div style={{ display: "flex", gap: ".75rem", marginTop: "1.25rem", flexWrap: "wrap" }}>
        <Link href={`/${distributor}/admin/clients/${client.id}`} className="btn-secondary">
          Voir
        </Link>
        <Link href={`/${distributor}/admin/clients/${client.id}/edit`} className="btn-secondary">
          Modifier
        </Link>
        <Link href={`/${distributor}/admin/clients/${client.id}/bons`} className="btn-secondary">
          Bons
        </Link>
        <Link href={`/${distributor}/admin/clients/${client.id}/historique`} className="btn-secondary">
          Historique
        </Link>
      </div>
    </article>
  );
}