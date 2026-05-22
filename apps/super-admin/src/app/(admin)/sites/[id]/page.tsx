import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { getShowcaseSite, readShowcaseText } from '@/lib/site-vitrine'
import { getPublishingStatus } from '@/lib/publishing'
import { SiteDeployButton } from './SiteDeployButton'
import styles from './page.module.css'

type Props = {
  params: Promise<{ id: string }>
}

export default async function SiteDetailPage({ params }: Props) {
  const session = await auth()
  if (!session) redirect('/connexion')

  const { id } = await params
  const site = await getShowcaseSite(id)
  if (!site) notFound()
  const publishing = getPublishingStatus(id)

  const [readme, packageJson, indexHtml] = await Promise.all([
    readShowcaseText(id, 'README.md'),
    readShowcaseText(id, 'package.json'),
    readShowcaseText(id, 'index.html'),
  ])

  return (
    <main className={styles.page}>
      <div className={styles.termHeader}>
        <Link href="/sites" className={styles.back}>sites</Link>
        <span className={styles.termCmd}> / {site.id}</span>
      </div>

      <section className={styles.hero}>
        <div>
          <p className={styles.eyebrow}>site vitrine</p>
          <h1>{site.name}</h1>
          <p className={styles.path}>{site.relativePath}</p>
        </div>
        <div className={styles.heroActions}>
          <a href={`/sites/${site.id}/studio`} className={styles.studioBtn}>ouvrir_studio</a>
          <SiteDeployButton siteId={site.id} />
          <span className={styles.status}>{site.kind}</span>
        </div>
      </section>

      <section className={styles.grid}>
        <InfoCard label="fichiers" value={site.files} />
        <InfoCard label="package" value={site.packageName ?? '-'} />
        <InfoCard label="scripts" value={site.scripts.length ? site.scripts.join(', ') : '-'} />
        <InfoCard label="commande" value={site.entry} wide />
        <InfoCard label="github" value={publishing.githubReady ? `${publishing.repository}/${publishing.branch}` : 'non configure'} wide />
        <InfoCard label="vercel" value={publishing.vercelReady ? 'deploy hook pret' : 'hook manquant'} />
      </section>

      <section className={styles.panel}>
        <div className={styles.panelHeader}>
          <span className={styles.panelTitle}>// fichiers_reference</span>
        </div>
        <div className={styles.previewGrid}>
          <Preview title="README.md" content={readme} />
          <Preview title="package.json" content={packageJson} />
          <Preview title="index.html" content={indexHtml} />
        </div>
      </section>
    </main>
  )
}

function InfoCard({ label, value, wide = false }: { label: string; value: number | string; wide?: boolean }) {
  return (
    <div className={`${styles.infoCard} ${wide ? styles.infoWide : ''}`}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  )
}

function Preview({ title, content }: { title: string; content: string | null }) {
  return (
    <article className={styles.preview}>
      <div className={styles.previewTitle}>{title}</div>
      <pre>{content ? content.slice(0, 2400) : '// fichier absent'}</pre>
    </article>
  )
}
