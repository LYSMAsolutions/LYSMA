import type { ReactNode } from "react";

type Column<T> = {
  key: string;
  header: ReactNode;
  className?: string;
  render: (row: T) => ReactNode;
};

type DataTableProps<T> = {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T, index: number) => string;
  emptyMessage?: string;
  className?: string;
};

export default function DataTable<T>({
  columns,
  rows,
  rowKey,
  emptyMessage = "Aucune donnée trouvée.",
  className = "",
}: DataTableProps<T>) {
  return (
    <div className={`table-shell ${className}`.trim()}>
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key} className={column.className}>
                {column.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.map((row, index) => (
            <tr key={rowKey(row, index)}>
              {columns.map((column) => (
                <td key={column.key} className={column.className}>
                  {column.render(row)}
                </td>
              ))}
            </tr>
          ))}

          {!rows.length ? (
            <tr>
              <td
                colSpan={columns.length}
                style={{ textAlign: "center", color: "var(--muted)" }}
              >
                {emptyMessage}
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}