import Link from 'next/link'
import { verifyEmailToken } from '@/lib/security/email-verification'
import styles from './page.module.css'

type Props = {
  searchParams: Promise<{ token?: string }>
}

export default async function VerificationEmailPage({ searchParams }: Props) {
  const { token } = await searchParams
  const result = token ? await verifyEmailToken(token) : { ok: false as const }

  return (
    <main className={styles.page}>
      <section className={styles.card}>
        {result.ok ? (
          <>
            <p className={styles.badge}>Email validé</p>
            <h1>Votre compte est sécurisé.</h1>
            <p>Votre adresse email est maintenant vérifiée. Vous pouvez vous connecter à LIVO depuis n’importe quel appareil.</p>
            <Link href="/connexion" className={styles.cta}>Se connecter</Link>
          </>
        ) : (
          <>
            <p className={styles.badge}>Lien invalide ou expiré</p>
            <h1>Validation impossible.</h1>
            <p>Le lien de vérification n’est plus valide. Demandez un nouvel email de validation pour finaliser l’accès à votre compte.</p>
            <Link href="/verification-email/envoye" className={styles.cta}>Renvoyer l’email</Link>
          </>
        )}
      </section>
    </main>
  )
}
