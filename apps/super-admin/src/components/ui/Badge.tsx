import styles from './Badge.module.css'

type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'muted' | 'blue'

type Props = {
  variant?: BadgeVariant
  children: React.ReactNode
  className?: string
}

export function Badge({ variant = 'muted', children, className }: Props) {
  return (
    <span className={`${styles.badge} ${styles[variant]} ${className ?? ''}`}>
      {children}
    </span>
  )
}
