import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { Shell } from '@/components/layout/Shell/Shell'
import { Sidebar } from '@/components/layout/Sidebar/Sidebar'
import { Header } from '@/components/layout/Header/Header'
import { StatusBar } from '@/components/layout/StatusBar/StatusBar'
import { AdminAutoRefresh } from '@/components/layout/AdminAutoRefresh'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session) redirect('/connexion')

  const [nbClients, nbMessages, nbErrors] = await Promise.all([
    prisma.client.count({ where: { statut: 'ACTIF' } }),
    prisma.message.count({ where: { statut: 'NOUVEAU' } }),
    prisma.errorReport.count({ where: { statut: 'NOUVEAU' } }),
  ])

  return (
    <Shell
      sidebar={<Sidebar messagesNonLus={nbMessages} erreursOuvertes={nbErrors} />}
      header={<Header path="~/admin" />}
      statusBar={<StatusBar nbClients={nbClients} nbMessagesNonLus={nbMessages} />}
    >
      <AdminAutoRefresh />
      {children}
    </Shell>
  )
}
