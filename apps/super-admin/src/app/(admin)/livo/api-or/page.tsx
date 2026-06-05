import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { getLivoGarages } from '@/lib/livo-api'
import Link from 'next/link'
import { ApiOrMailClient } from './ApiOrMailClient'
import styles from './page.module.css'

export const dynamic = 'force-dynamic'

const LIVO_API_URL = process.env.LIVO_API_URL ?? 'https://www.livo-app.com'

export default async function LivoApiOrPage() {
  const session = await auth()
  if (!session) redirect('/connexion')

  const garages = await getLivoGarages()
  const endpointUrl = `${LIVO_API_URL.replace(/\/$/, '')}/api/integrations/work-orders`

  return (
    <div className={styles.page}>
      <div className={styles.toolbar}>
        <div className={styles.title}>
          <span className={styles.prompt}>$</span>
          <span className={styles.cmd}>livo-app --integration-api-or</span>
          <span className={styles.count}>document prive</span>
        </div>
        <Link href="/livo" className={styles.backLink}>retour LIVO</Link>
      </div>

      <section className={styles.intro}>
        <div>
          <h1>API OR facturation</h1>
          <p>
            Generateur de mail technique pour les editeurs de logiciels de facturation atelier.
            Cette page est dans le super-admin et reste protegee par la session admin.
          </p>
        </div>
        <div className={styles.endpointBox}>
          <span>endpoint</span>
          <code>{endpointUrl}</code>
        </div>
      </section>

      {garages.length === 0 ? (
        <div className={styles.empty}>
          Aucun garage LIVO recupere. Verifier LIVO_API_URL et INTERNAL_API_KEY avant de generer un mail.
        </div>
      ) : (
        <ApiOrMailClient
          endpointUrl={endpointUrl}
          garages={garages.map((garage) => ({
            id: garage.id,
            nom: garage.nom,
            ville: garage.ville,
            ownerEmail: garage.owner.email,
          }))}
        />
      )}
    </div>
  )
}
