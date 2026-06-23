import styles from './Header.module.css'

type Props = {
  title?: string
  actions?: React.ReactNode
}

export function Header({ title, actions }: Props) {
  return (
    <header className={styles.header}>
      <div className={styles.left}>
        {title && <h1 className={styles.title}>{title}</h1>}
      </div>
      <div className={styles.right}>
        {actions}
      </div>
    </header>
  )
}
