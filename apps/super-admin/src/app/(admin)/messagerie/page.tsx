import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { PageHeader, Badge } from '@/components/ui'
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

  const nonLus = messages.filter(m => m.statut === 'NOUVEAU').length

  return (
    <div className={styles.page}>
      <PageHeader title="Messagerie">
        {nonLus > 0 && <Badge variant="error">{nonLus} non lus</Badge>}
      </PageHeader>
      <MessagerieClient messages={messages.map(m => ({
        ...m,
        createdAt: m.createdAt.toISOString(),
        updatedAt: m.updatedAt.toISOString(),
        client: m.client ? { nom: m.client.nom } : null,
      }))} />
    </div>
  )
}
