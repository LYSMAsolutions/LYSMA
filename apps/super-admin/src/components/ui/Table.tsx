import styles from './Table.module.css'

type Props = {
  children: React.ReactNode
  empty?: React.ReactNode
  className?: string
}

export function Table({ children, className }: Props) {
  return (
    <div className={`${styles.wrapper} ${className ?? ''}`}>
      <table className={styles.table}>{children}</table>
    </div>
  )
}

export function Thead({ children }: { children: React.ReactNode }) {
  return <thead className={styles.thead}>{children}</thead>
}

export function Tbody({ children }: { children: React.ReactNode }) {
  return <tbody className={styles.tbody}>{children}</tbody>
}

export function Th({ children, className }: { children?: React.ReactNode; className?: string }) {
  return <th className={`${styles.th} ${className ?? ''}`}>{children}</th>
}

export function Td({ children, className }: { children?: React.ReactNode; className?: string }) {
  return <td className={`${styles.td} ${className ?? ''}`}>{children}</td>
}

export function EmptyRow({ colSpan, message = 'Aucun résultat' }: { colSpan: number; message?: string }) {
  return (
    <tr>
      <td colSpan={colSpan} className={styles.emptyCell}>
        <span className={styles.emptyText}>{message}</span>
      </td>
    </tr>
  )
}
