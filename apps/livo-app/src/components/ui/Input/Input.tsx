import { cn } from '@/lib/utils'
import styles from './Input.module.css'

type InputSize = 'md' | 'lg'

type InputProps = {
  label?: string
  hint?: string
  error?: string
  inputSize?: InputSize
  iconLeft?: React.ReactNode
  iconRight?: React.ReactNode
  fullWidth?: boolean
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>

export function Input({
  label,
  hint,
  error,
  inputSize = 'md',
  iconLeft,
  iconRight,
  fullWidth = true,
  className,
  id,
  ...props
}: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className={cn(styles.wrapper, fullWidth && styles.fullWidth)}>
      {label && (
        <label htmlFor={inputId} className={styles.label}>
          {label}
          {props.required && <span className={styles.required}>*</span>}
        </label>
      )}
      <div className={cn(styles.inputWrapper, error && styles.hasError)}>
        {iconLeft && (
          <span className={cn(styles.icon, styles.iconLeft)}>{iconLeft}</span>
        )}
        <input
          id={inputId}
          className={cn(
            styles.input,
            styles[inputSize],
            iconLeft ? styles.withIconLeft : undefined,
            iconRight ? styles.withIconRight : undefined,
            className
          )}
          aria-invalid={!!error}
          aria-describedby={
            error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
          }
          {...props}
        />
        {iconRight && (
          <span className={cn(styles.icon, styles.iconRight)}>{iconRight}</span>
        )}
      </div>
      {error && (
        <span id={`${inputId}-error`} className={styles.error} role="alert">
          {error}
        </span>
      )}
      {hint && !error && (
        <span id={`${inputId}-hint`} className={styles.hint}>
          {hint}
        </span>
      )}
    </div>
  )
}
