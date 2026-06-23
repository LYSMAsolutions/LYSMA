import styles from './PageHeader.module.css'

type Props = {
  title: string
  description?: string
  children?: React.ReactNode
}

export function PageHeader({ title, description, children }: Props) {
  return (
    <div className={styles.header}>
      <div className={styles.text}>
        <h1 className={styles.title}>{title}</h1>
        {description && <p className={styles.description}>{description}</p>}
      </div>
      {children && <div className={styles.actions}>{children}</div>}
    </div>
  )
}
