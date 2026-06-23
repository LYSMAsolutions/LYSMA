import styles from './Card.module.css'

type Props = {
  children: React.ReactNode
  className?: string
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

export function Card({ children, className, padding = 'md' }: Props) {
  return (
    <div className={`${styles.card} ${styles[`padding_${padding}`]} ${className ?? ''}`}>
      {children}
    </div>
  )
}
