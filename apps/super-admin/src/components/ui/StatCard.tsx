import styles from './StatCard.module.css'

type StatCardColor = 'default' | 'blue' | 'cyan' | 'green' | 'yellow' | 'red' | 'purple' | 'muted'

type Props = {
  label: string
  value: string | number
  sub?: string
  color?: StatCardColor
  icon?: React.ReactNode
}

export function StatCard({ label, value, sub, color = 'default', icon }: Props) {
  return (
    <div className={styles.card}>
      <div className={styles.top}>
        <span className={styles.label}>{label}</span>
        {icon && <span className={styles.icon}>{icon}</span>}
      </div>
      <span className={`${styles.value} ${styles[color]}`}>{value}</span>
      {sub && <span className={styles.sub}>{sub}</span>}
    </div>
  )
}
