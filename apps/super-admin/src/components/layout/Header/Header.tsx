import styles from './Header.module.css'

type Props = { path: string; actions?: React.ReactNode }

export function Header({ path, actions }: Props) {
  const now = new Date().toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' })
  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <span className={styles.path}>{path}</span>
      </div>
      <div className={styles.right}>
        {actions}
        <span className={styles.time}>{now}</span>
      </div>
    </header>
  )
}
