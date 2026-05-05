import { cn } from '@/lib/utils'
import styles from './Button.module.css'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
type ButtonSize = 'sm' | 'md' | 'lg' | 'xl'

type ButtonProps = {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
  fullWidth?: boolean
  children?: React.ReactNode
} & React.ButtonHTMLAttributes<HTMLButtonElement>

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading

  return (
    <button
      className={cn(
        styles.btn,
        styles[variant],
        styles[size],
        loading && styles.loading,
        fullWidth && styles.fullWidth,
        className
      )}
      disabled={isDisabled}
      aria-busy={loading}
      {...props}
    >
      {loading ? (
        <span className={styles.spinner} aria-hidden="true" />
      ) : (
        <>
          {icon && iconPosition === 'left' && (
            <span className={styles.icon}>{icon}</span>
          )}
          {children && <span className={styles.label}>{children}</span>}
          {icon && iconPosition === 'right' && (
            <span className={styles.icon}>{icon}</span>
          )}
        </>
      )}
    </button>
  )
}
