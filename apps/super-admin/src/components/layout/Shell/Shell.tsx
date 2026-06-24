import { MobileMenuProvider } from '../MobileMenuContext'
import { MobileBar } from '../MobileBar/MobileBar'
import styles from './Shell.module.css'

type Props = {
  children: React.ReactNode
  sidebar: React.ReactNode
  header: React.ReactNode
  statusBar?: React.ReactNode
}

export function Shell({ children, sidebar, header }: Props) {
  return (
    <MobileMenuProvider>
      <div className={styles.shell}>
        <MobileBar />
        {sidebar}
        <div className={styles.main}>
          <div className={styles.header}>{header}</div>
          <div className={styles.content}>{children}</div>
        </div>
      </div>
    </MobileMenuProvider>
  )
}
