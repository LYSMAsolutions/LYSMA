'use client'

import { useMemo, useRef, useState } from 'react'
import styles from './page.module.css'

type SiteContent = {
  brand: { name: string; logo: string }
  colors: {
    primary: string
    primaryDark: string
    accent: string
    accentSoft: string
    text: string
    muted: string
    background: string
  }
  hero: {
    eyebrow: string
    title: string
    highlight: string
    description: string
    primaryCta: string
    secondaryCta: string
    panelTitle: string
    panelText: string
    image: string
  }
  sections: {
    processTitle: string
    processDescription: string
    atelierTitle: string
    atelierText: string
    ctaTitle: string
    ctaText: string
  }
  pages: Record<string, {
    kicker: string
    title: string
    description: string
    seoTitle: string
    seoDescription: string
  }>
  contact: {
    address: string
    phone: string
    email: string
    hours: string
  }
  seo: {
    title: string
    description: string
    canonical: string
    keywords: string
    robots: string
    ogTitle: string
    ogDescription: string
    ogImage: string
  }
}

type Props = {
  siteId: string
  siteName: string
  initialContent: SiteContent
  previewPages: { label: string; value: string }[]
  editable: boolean
  publishing: {
    githubReady: boolean
    repository: string
    branch: string
    vercelReady: boolean
  }
}

type PublicationResponse = {
  github?: {
    configured: boolean
    committed: boolean
    path?: string
    commitUrl?: string
    error?: string
  }
  vercel?: {
    configured: boolean
    triggered: boolean
    error?: string
  }
}

export function SiteStudioClient({ siteId, siteName, initialContent, previewPages, editable, publishing }: Props) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [content, setContent] = useState(initialContent)
  const [previewPage, setPreviewPage] = useState(previewPages[0]?.value ?? 'index.html')
  const [previewVersion, setPreviewVersion] = useState(0)
  const [saving, setSaving] = useState(false)
  const [savedAt, setSavedAt] = useState<string | null>(null)
  const [publication, setPublication] = useState<PublicationResponse | null>(null)

  const previewUrl = useMemo(() => `/preview/sites/${siteId}/${previewPage}?studio=${previewVersion}`, [siteId, previewPage, previewVersion])

  function patch(path: string, value: string) {
    setContent((current) => {
      const next = structuredClone(current)
      const [group, key] = path.split('.') as [keyof SiteContent, string]
      ;(next[group] as Record<string, string>)[key] = value
      postPreview(next)
      return next
    })
  }

  function patchPage(page: string, key: string, value: string) {
    setContent((current) => {
      const next = structuredClone(current)
      next.pages[page][key as keyof SiteContent['pages'][string]] = value
      postPreview(next)
      return next
    })
  }

  function postPreview(next = content) {
    iframeRef.current?.contentWindow?.postMessage({ type: 'lysma-preview', content: next }, '*')
  }

  async function save() {
    setSaving(true)
    try {
      const res = await fetch(`/api/sites/${siteId}/content`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content),
      })

      if (!res.ok) {
        const data = await res.json()
        alert(data.error ?? 'Enregistrement impossible')
        return
      }

      const data = await res.json()
      setPublication(data.publication ?? null)
      setSavedAt(new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }))
      setPreviewVersion((version) => version + 1)
    } finally {
      setSaving(false)
    }
  }

  async function uploadImage(path: string, file: File | null) {
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)

    const res = await fetch(`/api/sites/${siteId}/upload`, {
      method: 'POST',
      body: formData,
    })
    const data = await res.json()

    if (!res.ok) {
      alert(data.error ?? 'Upload impossible')
      return
    }

    setPublication(data.publication ?? null)
    patch(path, data.path)
  }

  return (
    <div className={styles.studio}>
      <section className={styles.editor}>
        <div className={styles.panelHeader}>
          <div>
            <span className={styles.panelTitle}>// studio</span>
            <strong>{siteName}</strong>
          </div>
          <button className={styles.saveBtn} onClick={save} disabled={!editable || saving}>
            {!editable ? 'lecture_seule' : saving ? 'publication...' : 'enregistrer + publier'}
          </button>
        </div>

        <div className={styles.form}>
          <div className={styles.publishBox}>
            <div>
              <span>GitHub</span>
              <strong data-state={publishing.githubReady ? 'ready' : 'missing'}>
                {publishing.githubReady ? `${publishing.repository} / ${publishing.branch}` : 'non configure'}
              </strong>
            </div>
            <div>
              <span>Vercel</span>
              <strong data-state={publishing.vercelReady ? 'ready' : 'missing'}>
                {publishing.vercelReady ? 'deploy hook pret' : 'deploy hook absent'}
              </strong>
            </div>
          </div>

          <Group title="Apercu">
            <label className={styles.field}>
              <span>Page</span>
              <select value={previewPage} onChange={(event) => setPreviewPage(event.target.value)}>
                {previewPages.map((page) => (
                  <option key={page.value} value={page.value}>{page.label}</option>
                ))}
              </select>
            </label>
          </Group>

          {!editable && (
            <div className={styles.notice}>
              Ce site est disponible en apercu, mais il n&apos;est pas encore connecte au studio de modification.
              Pour le moment, l&apos;edition complete est active sur les sites qui ont un fichier content/site.json et les balises CMS branchees.
            </div>
          )}

          {editable && (
            <>

          <Group title="Identite">
            <Input label="Nom" value={content.brand.name} onChange={(value) => patch('brand.name', value)} />
            <Input label="Logo" value={content.brand.logo} onChange={(value) => patch('brand.logo', value)} />
            <Upload label="Importer logo" onChange={(file) => uploadImage('brand.logo', file)} />
          </Group>

          <Group title="Couleurs">
            <Color label="Principal" value={content.colors.primary} onChange={(value) => patch('colors.primary', value)} />
            <Color label="Principal sombre" value={content.colors.primaryDark} onChange={(value) => patch('colors.primaryDark', value)} />
            <Color label="Accent" value={content.colors.accent} onChange={(value) => patch('colors.accent', value)} />
            <Color label="Accent doux" value={content.colors.accentSoft} onChange={(value) => patch('colors.accentSoft', value)} />
            <Color label="Texte" value={content.colors.text} onChange={(value) => patch('colors.text', value)} />
            <Color label="Fond" value={content.colors.background} onChange={(value) => patch('colors.background', value)} />
          </Group>

          <Group title="Hero">
            <Input label="Eyebrow" value={content.hero.eyebrow} onChange={(value) => patch('hero.eyebrow', value)} />
            <Input label="Titre" value={content.hero.title} onChange={(value) => patch('hero.title', value)} />
            <Input label="Mot accent" value={content.hero.highlight} onChange={(value) => patch('hero.highlight', value)} />
            <Textarea label="Description" value={content.hero.description} onChange={(value) => patch('hero.description', value)} />
            <Input label="Image hero" value={content.hero.image} onChange={(value) => patch('hero.image', value)} />
            <Upload label="Importer image hero" onChange={(file) => uploadImage('hero.image', file)} />
            <Input label="Bouton principal" value={content.hero.primaryCta} onChange={(value) => patch('hero.primaryCta', value)} />
            <Input label="Bouton secondaire" value={content.hero.secondaryCta} onChange={(value) => patch('hero.secondaryCta', value)} />
            <Input label="Encart titre" value={content.hero.panelTitle} onChange={(value) => patch('hero.panelTitle', value)} />
            <Textarea label="Encart texte" value={content.hero.panelText} onChange={(value) => patch('hero.panelText', value)} />
          </Group>

          <Group title="Sections">
            <Textarea label="Titre process" value={content.sections.processTitle} onChange={(value) => patch('sections.processTitle', value)} />
            <Textarea label="Description process" value={content.sections.processDescription} onChange={(value) => patch('sections.processDescription', value)} />
            <Textarea label="Titre atelier" value={content.sections.atelierTitle} onChange={(value) => patch('sections.atelierTitle', value)} />
            <Textarea label="Texte atelier" value={content.sections.atelierText} onChange={(value) => patch('sections.atelierText', value)} />
            <Textarea label="Titre final" value={content.sections.ctaTitle} onChange={(value) => patch('sections.ctaTitle', value)} />
            <Textarea label="Texte final" value={content.sections.ctaText} onChange={(value) => patch('sections.ctaText', value)} />
          </Group>

          <Group title="Pages internes">
            {Object.entries(content.pages).map(([page, data]) => (
              <div key={page} className={styles.pageBlock}>
                <strong>{page}</strong>
                <Input label="Kicker" value={data.kicker} onChange={(value) => patchPage(page, 'kicker', value)} />
                <Textarea label="Titre" value={data.title} onChange={(value) => patchPage(page, 'title', value)} />
                <Textarea label="Description" value={data.description} onChange={(value) => patchPage(page, 'description', value)} />
                <Input label="SEO title" value={data.seoTitle} onChange={(value) => patchPage(page, 'seoTitle', value)} />
                <Textarea label="SEO description" value={data.seoDescription} onChange={(value) => patchPage(page, 'seoDescription', value)} />
              </div>
            ))}
          </Group>

          <Group title="Contact">
            <Input label="Adresse" value={content.contact.address} onChange={(value) => patch('contact.address', value)} />
            <Input label="Telephone" value={content.contact.phone} onChange={(value) => patch('contact.phone', value)} />
            <Input label="Email" value={content.contact.email} onChange={(value) => patch('contact.email', value)} />
            <Input label="Horaires" value={content.contact.hours} onChange={(value) => patch('contact.hours', value)} />
          </Group>

          <Group title="SEO">
            <Input label="Title" value={content.seo.title} onChange={(value) => patch('seo.title', value)} />
            <Textarea label="Description" value={content.seo.description} onChange={(value) => patch('seo.description', value)} />
            <Input label="URL canonique" value={content.seo.canonical ?? ''} onChange={(value) => patch('seo.canonical', value)} />
            <Input label="Mots cles" value={content.seo.keywords ?? ''} onChange={(value) => patch('seo.keywords', value)} />
            <Input label="Robots" value={content.seo.robots ?? ''} onChange={(value) => patch('seo.robots', value)} />
            <Input label="Open Graph title" value={content.seo.ogTitle ?? ''} onChange={(value) => patch('seo.ogTitle', value)} />
            <Textarea label="Open Graph description" value={content.seo.ogDescription ?? ''} onChange={(value) => patch('seo.ogDescription', value)} />
            <Input label="Image reseaux" value={content.seo.ogImage ?? ''} onChange={(value) => patch('seo.ogImage', value)} />
            <Upload label="Importer image reseaux" onChange={(file) => uploadImage('seo.ogImage', file)} />
          </Group>
            </>
          )}
        </div>

        {savedAt && (
          <div className={styles.saved}>
            <span>enregistre a {savedAt}</span>
            {publication?.github?.configured && (
              <span>
                GitHub : {publication.github.committed ? 'commit cree' : publication.github.error ?? 'non publie'}
              </span>
            )}
            {publication?.vercel?.configured && (
              <span>
                Vercel : {publication.vercel.triggered ? 'deploiement lance' : publication.vercel.error ?? 'non lance'}
              </span>
            )}
          </div>
        )}
      </section>

      <section className={styles.preview}>
        <div className={styles.previewBar}>
          <span>{previewUrl.replace(/\?.*$/, '')}</span>
          <button className={styles.ghostBtn} onClick={() => setPreviewVersion((version) => version + 1)}>rafraichir_apercu</button>
        </div>
        <iframe
          ref={iframeRef}
          src={previewUrl}
          className={styles.iframe}
          onLoad={() => postPreview()}
          title={`Apercu ${siteName}`}
        />
      </section>
    </div>
  )
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className={styles.group}>
      <legend>{title}</legend>
      {children}
    </fieldset>
  )
}

function Input({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className={styles.field}>
      <span>{label}</span>
      <input value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  )
}

function Textarea({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className={styles.field}>
      <span>{label}</span>
      <textarea value={value} onChange={(event) => onChange(event.target.value)} rows={3} />
    </label>
  )
}

function Color({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className={styles.field}>
      <span>{label}</span>
      <div className={styles.colorRow}>
        <input type="color" value={value} onChange={(event) => onChange(event.target.value)} />
        <input value={value} onChange={(event) => onChange(event.target.value)} />
      </div>
    </label>
  )
}

function Upload({ label, onChange }: { label: string; onChange: (file: File | null) => void }) {
  return (
    <label className={styles.field}>
      <span>{label}</span>
      <input type="file" accept="image/*" onChange={(event) => onChange(event.target.files?.[0] ?? null)} />
    </label>
  )
}
