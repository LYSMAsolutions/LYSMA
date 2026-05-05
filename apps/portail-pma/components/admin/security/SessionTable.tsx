import Link from "next/link";

type SessionRow = {
  id: string;
  actorType: string;
  displayName: string;
  emailOrLogin: string;
  ipAddress: string;
  expiresAt: string;
  lastSeenAt: string;
  href?: string;
};

export default function SessionTable({
  rows,
}: {
  rows: SessionRow[];
}) {
  return (
    <div className="table-shell">
      <table className="data-table">
        <thead>
          <tr>
            <th>Profil</th>
            <th>Type</th>
            <th>IP</th>
            <th>Dernière activité</th>
            <th>Expiration</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td>
                <div style={{ display: "grid", gap: ".15rem" }}>
                  <strong>{row.displayName}</strong>
                  <span className="section-copy">{row.emailOrLogin}</span>
                </div>
              </td>
              <td>{row.actorType}</td>
              <td>{row.ipAddress}</td>
              <td>{row.lastSeenAt}</td>
              <td>{row.expiresAt}</td>
              <td>
                {row.href ? (
                  <Link href={row.href} className="btn-secondary">
                    Voir
                  </Link>
                ) : (
                  "—"
                )}
              </td>
            </tr>
          ))}

          {!rows.length ? (
            <tr>
              <td colSpan={6} style={{ textAlign: "center", color: "var(--muted)" }}>
                Aucune session active.
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}