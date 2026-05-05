import Link from "next/link";

type StoreRow = {
  id: string;
  code: string;
  name: string;
  city?: string | null;
  is_active: boolean;
  rdm?: {
    first_name: string;
    last_name: string;
  } | null;
  _count?: {
    clients: number;
    bons_assigned: number;
    store_staff: number;
  };
};

export default function StoreTable({
  distributor,
  rows,
}: {
  distributor: string;
  rows: StoreRow[];
}) {
  return (
    <div className="table-shell">
      <table className="data-table">
        <thead>
          <tr>
            <th>Code</th>
            <th>Magasin</th>
            <th>Ville</th>
            <th>RDM</th>
            <th>Clients</th>
            <th>Bons</th>
            <th>Staff</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const rdmName = row.rdm
              ? `${row.rdm.first_name} ${row.rdm.last_name}`.trim()
              : "Non assigné";

            return (
              <tr key={row.id}>
                <td>{row.code}</td>
                <td>{row.name}</td>
                <td>{row.city || "—"}</td>
                <td>{rdmName}</td>
                <td>{row._count?.clients ?? 0}</td>
                <td>{row._count?.bons_assigned ?? 0}</td>
                <td>{row._count?.store_staff ?? 0}</td>
                <td>
                  <span className={row.is_active ? "badge-success" : "badge-danger"}>
                    {row.is_active ? "Actif" : "Inactif"}
                  </span>
                </td>
                <td>
                  <div className="flex flex-wrap gap-2">
                    <Link href={`/${distributor}/admin/stores/${row.id}`} className="btn-secondary">
                      Ouvrir
                    </Link>
                    <Link href={`/${distributor}/admin/stores/${row.id}/edit`} className="btn-secondary">
                      Modifier
                    </Link>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
