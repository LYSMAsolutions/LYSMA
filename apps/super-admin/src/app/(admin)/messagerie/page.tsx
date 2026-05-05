import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { MessagerieClient } from './MessagerieClient'
import styles from './page.module.css'

export const revalidate = 0

export default async function MessageriePage() {
  const session = await auth()
  if (!session) redirect('/connexion')

  const messages = await prisma.message.findMany({
    include: { client: true },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <span className={styles.prompt}>$</span>
        <span className={styles.cmd}>messagerie --inbox</span>
        <span className={styles.count}>{messages.filter(m => m.statut === 'NOUVEAU').length} non lus</span>
      </div>
      <MessagerieClient messages={messages.map(m => ({
        ...m,
        createdAt: m.createdAt.toISOString(),
        updatedAt: m.updatedAt.toISOString(),
        client: m.client ? { nom: m.client.nom } : null,
      }))} />
    </div>
  )
}
