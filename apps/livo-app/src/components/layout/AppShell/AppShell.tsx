import { Sidebar } from '@/components/layout/Sidebar'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import styles from './AppShell.module.css'

type AppShellProps = {
  children: React.ReactNode
}

export async function AppShell({ children }: AppShellProps) {
  const session = await auth()

  if (!session?.user?.id) {
    redirect('/connexion')
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
      actif: true,
    },
    include: {
      garages: {
        where: {
          actif: true,
        },
        take: 1,
      },
    },
  })

  if (!user) {
    redirect('/connexion')
  }

  const garage = user.garages[0]

  if (!garage) {
    redirect('/connexion')
  }

  const garageNom = garage.nom ?? 'Mon Garage'
  const userNom = `${user.prenom ?? ''} ${user.nom ?? ''}`.trim() || 'Utilisateur'
  const userEmail = user.email ?? ''
  const userInitiale = `${user.prenom?.[0] ?? ''}${user.nom?.[0] ?? ''}`.toUpperCase() || 'U'

  return (
    <div className={styles.shell}>
      <Sidebar
        garageNom={garageNom}
        userNom={userNom}
        userEmail={userEmail}
        userInitiale={userInitiale}
      />

      <div className={styles.main}>
        {children}
      </div>
    </div>
  )
}