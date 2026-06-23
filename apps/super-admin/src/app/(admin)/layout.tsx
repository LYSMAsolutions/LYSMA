import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { Shell } from '@/components/layout/Shell/Shell'
import { Sidebar } from '@/components/layout/Sidebar/Sidebar'
import { Header } from '@/components/layout/Header/Header'
import { AdminAutoRefresh } from '@/components/layout/AdminAutoRefresh'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session) redirect('/connexion')

  const [nbMessages, nbErrors] = await Promise.all([
    prisma.message.count({ where: { statut: 'NOUVEAU' } }),
    prisma.errorReport.count({ where: { statut: 'NOUVEAU' } }),
  ])

  return (
    <Shell
      sidebar={
        <Sidebar
          messagesNonLus={nbMessages}
          erreursOuvertes={nbErrors}
          userName={session.user?.name ?? 'Admin'}
          userEmail={session.user?.email ?? ''}
        />
      }
      header={<Header />}
    >
      <AdminAutoRefresh />
      {children}
    </Shell>
  )
}
