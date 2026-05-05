import { cn } from '@/lib/utils'
import styles from './Card.module.css'

type CardProps = {
  variant?: 'default' | 'elevated' | 'outlined' | 'ghost'
  padding?: 'none' | 'sm' | 'md' | 'lg'
  hoverable?: boolean
  className?: string
  children: React.ReactNode
} & React.HTMLAttributes<HTMLDivElement>

export function Card({
  variant = 'default',
  padding = 'md',
  hoverable = false,
  className,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        styles.card,
        styles[variant],
        styles[`padding-${padding}`],
        hoverable && styles.hoverable,
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

/* ── Sub-composants ─────────────────────────────────────────── */
type CardHeaderProps = {
  title: string
  description?: string
  action?: React.ReactNode
  icon?: React.ReactNode
  className?: string
}

export function CardHeader({ title, description, action, icon, className }: CardHeaderProps) {
  return (
    <div className={cn(styles.header, className)}>
      <div className={styles.headerLeft}>
        {icon && <span className={styles.headerIcon}>{icon}</span>}
        <div className={styles.headerText}>
          <h3 className={styles.headerTitle}>{title}</h3>
          {description && (
            <p className={styles.headerDescription}>{description}</p>
          )}
        </div>
      </div>
      {action && <div className={styles.headerAction}>{action}</div>}
    </div>
  )
}

type CardBodyProps = {
  className?: string
  children: React.ReactNode
}

export function CardBody({ className, children }: CardBodyProps) {
  return <div className={cn(styles.body, className)}>{children}</div>
}

type CardFooterProps = {
  className?: string
  children: React.ReactNode
}

export function CardFooter({ className, children }: CardFooterProps) {
  return <div className={cn(styles.footer, className)}>{children}</div>
}
