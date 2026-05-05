import styles from './StatusBar.module.css'

type Props = { nbClients: number; nbMessagesNonLus: number; env?: string }

export function StatusBar({ nbClients, nbMessagesNonLus, env = 'production' }: Props) {
  return (
    <div className={styles.bar}>
      <div className={styles.left}>
        <span className={styles.item} style={{color:'var(--green)', borderRight:'1px solid var(--border-subtle)', paddingRight:8}}>
          ◉ LYSMA Admin
        </span>
        <span className={styles.item}>⬡ {env}</span>
        <span className={styles.item}>◈ {nbClients} clients actifs</span>
        {nbMessagesNonLus > 0 && (
          <span className={styles.item} style={{color:'var(--yellow)'}}>
            ◉ {nbMessagesNonLus} message{nbMessagesNonLus > 1 ? 's' : ''} non lu{nbMessagesNonLus > 1 ? 's' : ''}
          </span>
        )}
      </div>
      <div className={styles.right}>
        <span className={styles.item}>UTF-8</span>
        <span className={styles.item}>TypeScript</span>
        <span className={styles.item}>Node 20</span>
      </div>
    </div>
  )
}
