type LockRow = {
  id: string;
  actorType: string;
  displayName: string;
  login: string;
  attempts: number;
  lockedUntil: string;
  mustChangePassword: string;
};

export default function LockTable({
  rows,
}: {
  rows: LockRow[];
}) {
  return (
    <div className="table-shell">
      <table className="data-table">
        <thead>
          <tr>
            <th>Profil</th>
            <th>Type</th>
            <th>Identifiant</th>
            <th>Tentatives</th>
            <th>Verrouillé jusqu’au</th>
            <th>Changement requis</th>
          </tr>
        </thead>

        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td>{row.displayName}</td>
              <td>{row.actorType}</td>
              <td>{row.login}</td>
              <td>{row.attempts}</td>
              <td>{row.lockedUntil}</td>
              <td>
                <span
                  className={
                    row.mustChangePassword === "Oui"
                      ? "status-warning"
                      : "status-neutral"
                  }
                >
                  {row.mustChangePassword}
                </span>
              </td>
            </tr>
          ))}

          {!rows.length ? (
            <tr>
              <td colSpan={6} style={{ textAlign: "center", color: "var(--muted)" }}>
                Aucun compte verrouillé.
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}