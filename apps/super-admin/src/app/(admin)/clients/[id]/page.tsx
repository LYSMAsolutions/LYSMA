import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect, notFound } from 'next/navigation'
import { ClientDetailClient } from './ClientDetailClient'
import styles from './page.module.css'

export default async function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) redirect('/connexion')

  const { id } = await params
  const client = await prisma.client.findUnique({
    where: { id },
    include: { acces: true, messages: { orderBy: { createdAt: 'desc' }, take: 10 } },
  })

  if (!client) notFound()

  return (
    <div className={styles.page}>
      <div className={styles.breadcrumb}>
        <a href="/clients" className={styles.breadLink}>clients</a>
        <span className={styles.breadSep}> / </span>
        <span className={styles.breadCurrent}>{client.nom}</span>
      </div>
      <ClientDetailClient client={{
        ...client,
        trialDebutAt: client.trialDebutAt?.toISOString() ?? null,
        trialFinAt: client.trialFinAt?.toISOString() ?? null,
        createdAt: client.createdAt.toISOString(),
        acces: client.acces.map(a => ({ ...a, createdAt: a.createdAt.toISOString() })),
        messages: client.messages.map(m => ({ ...m, createdAt: m.createdAt.toISOString(), updatedAt: m.updatedAt.toISOString() })),
      }} />
    </div>
  )
}
