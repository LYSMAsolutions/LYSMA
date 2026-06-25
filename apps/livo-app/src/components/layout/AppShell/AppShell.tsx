import { Sidebar } from '@/components/layout/Sidebar'
import { MobileMenuProvider } from '@/components/layout/MobileMenuContext'
import { MobileBar } from '@/components/layout/MobileBar/MobileBar'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getPrimaryGarageForUser } from '@/lib/garage'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ConnectedDataNotice } from './ConnectedDataNotice'
import { TrialBanner } from '@/components/layout/TrialBanner/TrialBanner'
import styles from './AppShell.module.css'

type AppShellProps = {
  children: React.ReactNode
}

export async function AppShell({ children }: AppShellProps) {
  const session = await auth()

  if (!session?.user?.id) {
    redirect('/connexion')
  }

  const [user, garage] = await Promise.all([
    prisma.user.findUnique({
      where: {
        id: session.user.id,
        actif: true,
      },
      select: {
        id: true,
        email: true,
        nom: true,
        prenom: true,
        emailVerified: true,
        emailVerifiedAt: true,
        twoFactorEnabled: true,
      },
    }),
    getPrimaryGarageForUser(session.user.id),
  ])

  if (!user) {
    redirect('/connexion')
  }

  if (!user.emailVerified && !user.emailVerifiedAt) {
    redirect(`/verification-email/envoye?email=${encodeURIComponent(user.email)}`)
  }

  if (!user.twoFactorEnabled) {
    redirect('/double-authentification')
  }

  if (!garage) {
    redirect('/connexion')
  }

  if (!garage.abonnementActif && garage.trialEndsAt && new Date() > garage.trialEndsAt) {
    redirect('/abonnement-expire')
  }

  const garageNom = garage.nom ?? 'Mon Garage'
  const userNom = `${user.prenom ?? ''} ${user.nom ?? ''}`.trim() || 'Utilisateur'
  const joursTrialRestants = !garage.abonnementActif && garage.trialEndsAt
    ? Math.max(0, Math.ceil((garage.trialEndsAt.getTime() - Date.now()) / 86_400_000))
    : null
  const userEmail = user.email ?? ''
  const userInitiale = `${user.prenom?.[0] ?? ''}${user.nom?.[0] ?? ''}`.toUpperCase() || 'U'

  return (
    <MobileMenuProvider>
    <div className={styles.shell}>
      <MobileBar />
      <Sidebar
        garageNom={garageNom}
        userNom={userNom}
        userEmail={userEmail}
        userInitiale={userInitiale}
      />

      <div className={styles.main}>
        {joursTrialRestants !== null && joursTrialRestants <= 14 && (
          <TrialBanner joursRestants={joursTrialRestants} />
        )}
        {children}
        <footer className={styles.footer}>
          <span>© {new Date().getFullYear()} LIVO by LYSMA Solutions</span>
          <nav aria-label="Liens privés et légaux">
            <Link href="/donnees-support">Données support</Link>
            <Link href="/cookies">Cookies</Link>
            <Link href="/politique-confidentialite">Confidentialité</Link>
          </nav>
        </footer>
      </div>

      <ConnectedDataNotice />
    </div>
    </MobileMenuProvider>
  )
}
