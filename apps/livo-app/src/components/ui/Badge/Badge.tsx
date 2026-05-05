import { cn } from '@/lib/utils'
import styles from './Badge.module.css'

type BadgeVariant =
  | 'default'
  | 'blue'
  | 'cyan'
  | 'success'
  | 'warning'
  | 'error'
  | 'gold'
  | 'muted'

type BadgeProps = {
  variant?: BadgeVariant
  dot?: boolean
  children: React.ReactNode
  className?: string
}

export function Badge({
  variant = 'default',
  dot = false,
  children,
  className,
}: BadgeProps) {
  return (
    <span className={cn(styles.badge, styles[variant], className)}>
      {dot && <span className={styles.dot} aria-hidden="true" />}
      {children}
    </span>
  )
}
