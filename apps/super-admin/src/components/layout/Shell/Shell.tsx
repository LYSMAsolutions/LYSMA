import styles from './Shell.module.css'

type Props = { children: React.ReactNode; sidebar: React.ReactNode; header: React.ReactNode; statusBar: React.ReactNode }

export function Shell({ children, sidebar, header, statusBar }: Props) {
  return (
    <div className={styles.shell}>
      <div className={styles.sidebar}>{sidebar}</div>
      <div className={styles.main}>
        <div className={styles.header}>{header}</div>
        <div className={styles.content}>{children}</div>
        <div className={styles.statusBar}>{statusBar}</div>
      </div>
    </div>
  )
}
