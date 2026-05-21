import { existsSync } from 'fs'
import { mkdir, readdir, readFile, writeFile } from 'fs/promises'
import path from 'path'
import { SHOWCASE_MANIFEST, type ShowcaseKind } from './site-vitrine-manifest'

export type ShowcaseSite = {
  id: string
  name: string
  kind: ShowcaseKind
  path: string
  relativePath: string
  entry: string
  packageName?: string
  scripts: string[]
  files: number
  status: 'present' | 'missing'
}

export type ShowcasePreviewPage = {
  label: string
  value: string
}

const SITES_ROOT = path.resolve(process.cwd(), '..', 'site-vitrine')

export function getShowcaseRoot() {
  return SITES_ROOT
}

export async function getShowcaseSites(): Promise<ShowcaseSite[]> {
  if (!existsSync(SITES_ROOT)) return []

  const sites = await Promise.all(
    SHOWCASE_MANIFEST.map(async (site) => getShowcaseSite(site.id)),
  )

  return sites
    .filter((site): site is ShowcaseSite => Boolean(site))
    .sort((a, b) => a.name.localeCompare(b.name, 'fr'))
}

export async function getShowcaseSite(id: string): Promise<ShowcaseSite | null> {
  if (!/^[a-zA-Z0-9-_]+$/.test(id)) return null

  const absolutePath = path.join(SITES_ROOT, id)
  const indexPath = path.join(absolutePath, 'index.html')
  const manifest = SHOWCASE_MANIFEST.find((site) => site.id === id)

  if (!manifest && !existsSync(indexPath)) return null

  const name = manifest?.name ?? humanize(id)
  const packageName = manifest?.packageName
  const scripts = manifest?.scripts ?? []
  const entry = manifest?.entry ?? 'ouvrir index.html'
  const kind: ShowcaseSite['kind'] = manifest?.kind ?? 'static'

  return {
    id,
    name,
    kind,
    path: absolutePath,
    relativePath: path.relative(process.cwd(), absolutePath),
    entry,
    packageName,
    scripts,
    files: 0,
    status: 'present',
  }
}

export async function readShowcaseText(id: string, fileName: string) {
  const site = await getShowcaseSite(id)
  if (!site) return null

  const absoluteFile = path.join(site.path, fileName)
  if (!absoluteFile.startsWith(site.path) || !existsSync(absoluteFile)) return null

  return readFile(absoluteFile, 'utf8')
}

export async function readShowcaseContent(id: string) {
  const site = await getShowcaseSite(id)
  if (!site) return null

  const contentPath = path.join(site.path, 'content', 'site.json')
  if (!contentPath.startsWith(site.path) || !existsSync(contentPath)) {
    return defaultShowcaseContent(site.name)
  }

  const raw = await readFile(contentPath, 'utf8')
  return JSON.parse(raw)
}

export async function hasShowcaseContent(id: string) {
  const site = await getShowcaseSite(id)
  if (!site) return false

  return existsSync(path.join(site.path, 'content', 'site.json'))
}

export async function getShowcasePreviewPages(id: string): Promise<ShowcasePreviewPage[]> {
  const site = await getShowcaseSite(id)
  if (!site) return []

  const pages: ShowcasePreviewPage[] = []
  const indexPath = path.join(site.path, 'index.html')

  if (existsSync(indexPath)) {
    pages.push({ label: 'Accueil', value: 'index.html' })
  }

  const pagesDir = path.join(site.path, 'pages')
  if (existsSync(pagesDir)) {
    const entries = await readdir(pagesDir, { withFileTypes: true })
    for (const entry of entries) {
      if (!entry.isFile() || !entry.name.endsWith('.html')) continue

      const name = entry.name.replace(/\.html$/, '')
      pages.push({
        label: humanize(name),
        value: `pages/${entry.name}`,
      })
    }
  }

  return pages
}

export async function writeShowcaseContent(id: string, content: unknown) {
  const site = await getShowcaseSite(id)
  if (!site) return null

  const contentDir = path.join(site.path, 'content')
  const contentPath = path.join(contentDir, 'site.json')

  if (!contentPath.startsWith(site.path)) return null

  await mkdir(contentDir, { recursive: true })
  await writeFile(contentPath, JSON.stringify(content, null, 2) + '\n', 'utf8')

  return content
}

export function resolveShowcaseFile(id: string, relativeFilePath = 'index.html') {
  if (!/^[a-zA-Z0-9-_]+$/.test(id)) return null

  const sitePath = path.join(SITES_ROOT, id)
  const cleanPath = relativeFilePath.replace(/^[/\\]+/, '') || 'index.html'
  const absoluteFile = path.resolve(sitePath, cleanPath)

  if (absoluteFile !== sitePath && !absoluteFile.startsWith(sitePath + path.sep)) return null
  if (!existsSync(absoluteFile)) return null

  return absoluteFile
}

function defaultShowcaseContent(name: string) {
  return {
    brand: { name, logo: '' },
    colors: {
      primary: '#383e42',
      primaryDark: '#2b3033',
      accent: '#ff6a00',
      accentSoft: '#ff8a2a',
      text: '#172027',
      muted: '#6b737a',
      background: '#f4f5f6',
    },
    hero: {
      eyebrow: '',
      title: name,
      highlight: '',
      description: '',
      primaryCta: '',
      secondaryCta: '',
      panelTitle: '',
      panelText: '',
      image: '',
    },
    sections: {
      processTitle: '',
      processDescription: '',
      atelierTitle: '',
      atelierText: '',
      ctaTitle: '',
      ctaText: '',
    },
    pages: {
      atelier: { kicker: 'Atelier', title: '', description: '', seoTitle: '', seoDescription: '' },
      technologies: { kicker: 'Technologies', title: '', description: '', seoTitle: '', seoDescription: '' },
      prestations: { kicker: 'Prestations', title: '', description: '', seoTitle: '', seoDescription: '' },
      realisations: { kicker: 'Realisations', title: '', description: '', seoTitle: '', seoDescription: '' },
      contact: { kicker: 'Contact', title: '', description: '', seoTitle: '', seoDescription: '' },
    },
    contact: {
      address: '',
      phone: '',
      email: '',
      hours: '',
    },
    seo: {
      title: name,
      description: '',
    },
  }
}

function humanize(value: string) {
  return value
    .replace(/^@[^/]+\//, '')
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
}
