type SecurityLogRow = {
  id: string;
  actor: string;
  actorType: string;
  eventType: string;
  successLabel: string;
  emailAttempt: string;
  ipAddress: string;
  eventAt: string;
};

export default function SecurityLogTable({
  rows,
}: {
  rows: SecurityLogRow[];
}) {
  return (
    <div className="table-shell">
      <table className="data-table">
        <thead>
          <tr>
            <th>Acteur</th>
            <th>Type</th>
            <th>Événement</th>
            <th>Résultat</th>
            <th>Email / login</th>
            <th>IP</th>
            <th>Date</th>
          </tr>
        </thead>

        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td>{row.actor}</td>
              <td>{row.actorType}</td>
              <td>{row.eventType}</td>
              <td>
                <span
                  className={
                    row.successLabel === "Succès"
                      ? "status-success"
                      : "status-danger"
                  }
                >
                  {row.successLabel}
                </span>
              </td>
              <td>{row.emailAttempt}</td>
              <td>{row.ipAddress}</td>
              <td>{row.eventAt}</td>
            </tr>
          ))}

          {!rows.length ? (
            <tr>
              <td colSpan={7} style={{ textAlign: "center", color: "var(--muted)" }}>
                Aucun journal trouvé.
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}