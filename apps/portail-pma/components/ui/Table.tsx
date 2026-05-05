import type { HTMLAttributes, ReactNode, TableHTMLAttributes } from "react";

export function TableShell({
  children,
  className = "",
  ...props
}: HTMLAttributes<HTMLDivElement> & { children: ReactNode }) {
  return (
    <div className={`table-shell ${className}`.trim()} {...props}>
      {children}
    </div>
  );
}

export function Table({
  children,
  className = "",
  ...props
}: TableHTMLAttributes<HTMLTableElement> & { children: ReactNode }) {
  return (
    <table className={`data-table ${className}`.trim()} {...props}>
      {children}
    </table>
  );
}