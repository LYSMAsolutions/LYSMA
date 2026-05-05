import { notFound, redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { getShowcasePreviewPages, getShowcaseSite, hasShowcaseContent, readShowcaseContent } from '@/lib/site-vitrine'
import { SiteStudioClient } from './SiteStudioClient'
import styles from './page.module.css'

export const dynamic = 'force-dynamic'

export default async function SiteStudioPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) redirect('/connexion')

  const { id } = await params
  const site = await getShowcaseSite(id)
  if (!site) notFound()

  const content = await readShowcaseContent(id)
  if (!content) notFound()

  const previewPages = await getShowcasePreviewPages(id)
  const editable = await hasShowcaseContent(id)

  return (
    <main className={styles.page}>
      <div className={styles.termHeader}>
        <a href="/sites" className={styles.back}>sites</a>
        <span className={styles.termCmd}> / {site.id} / studio</span>
      </div>

      <SiteStudioClient
        siteId={site.id}
        siteName={site.name}
        initialContent={content}
        previewPages={previewPages}
        editable={editable}
      />
    </main>
  )
}
