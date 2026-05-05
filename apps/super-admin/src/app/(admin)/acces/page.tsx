import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import styles from './page.module.css'

export default async function AccesPage() {
  const session = await auth()
  if (!session) redirect('/connexion')

  const acces = await prisma.acces.findMany({
    include: { client: true },
    orderBy: { createdAt: 'desc' },
    take: 50,
  })

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <span className={styles.prompt}>$</span>
        <span className={styles.cmd}>acces --list</span>
        <span className={styles.count}>{acces.length} accès générés</span>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>email</th>
            <th>client</th>
            <th>mot_de_passe_temp</th>
            <th>actif</th>
            <th>1ère_connexion</th>
            <th>créé</th>
          </tr>
        </thead>
        <tbody>
          {acces.map(a => (
            <tr key={a.id}>
              <td className={styles.mono}>{a.email}</td>
              <td><a href={`/clients/${a.clientId}`} className={styles.link}>{a.client.nom}</a></td>
              <td>
                {a.motDePasseTemp
                  ? <span className={styles.pwd}>{a.motDePasseTemp}</span>
                  : <span className={styles.muted}>—</span>}
              </td>
              <td><span style={{color: a.actif ? 'var(--green)' : 'var(--red)'}}>{a.actif ? '✓' : '✗'}</span></td>
              <td><span style={{color: a.premiereConnexion ? 'var(--green)' : 'var(--yellow)'}}>{a.premiereConnexion ? 'oui' : 'non'}</span></td>
              <td className={styles.muted}>{new Date(a.createdAt).toLocaleDateString('fr-FR')}</td>
            </tr>
          ))}
          {acces.length === 0 && (
            <tr><td colSpan={6} className={styles.empty}>// aucun accès généré</td></tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
