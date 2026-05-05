import { existsSync } from 'fs'
import { mkdir, readdir, readFile, writeFile } from 'fs/promises'
import path from 'path'

export type ShowcaseSite = {
  id: string
  name: string
  kind: 'next' | 'static'
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
const IGNORED_DIRS = new Set(['node_modules', '.next', '.git', 'dist', 'build'])

export function getShowcaseRoot() {
  return SITES_ROOT
}

export async function getShowcaseSites(): Promise<ShowcaseSite[]> {
  if (!existsSync(SITES_ROOT)) return []

  const entries = await readdir(SITES_ROOT, { withFileTypes: true })
  const directories = entries.filter((entry) => entry.isDirectory())

  const sites = await Promise.all(
    directories.map(async (entry) => getShowcaseSite(entry.name)),
  )

  return sites
    .filter((site): site is ShowcaseSite => Boolean(site))
    .sort((a, b) => a.name.localeCompare(b.name, 'fr'))
}

export async function getShowcaseSite(id: string): Promise<ShowcaseSite | null> {
  if (!/^[a-zA-Z0-9-_]+$/.test(id)) return null

  const absolutePath = path.join(SITES_ROOT, id)
  if (!existsSync(absolutePath)) return null

  const packagePath = path.join(absolutePath, 'package.json')
  const indexPath = path.join(absolutePath, 'index.html')
  const hasPackage = existsSync(packagePath)
  const hasIndex = existsSync(indexPath)

  if (!hasPackage && !hasIndex) return null

  let name = humanize(id)
  let packageName: string | undefined
  let scripts: string[] = []
  let entry = 'ouvrir index.html'
  let kind: ShowcaseSite['kind'] = hasPackage ? 'next' : 'static'

  if (hasPackage) {
    const raw = await readFile(packagePath, 'utf8')
    const pkg = JSON.parse(raw) as {
      name?: string
      scripts?: Record<string, string>
    }

    packageName = pkg.name
    name = humanize(pkg.name ?? id)
    scripts = Object.keys(pkg.scripts ?? {})
    kind = pkg.scripts?.dev?.includes('next') ? 'next' : 'static'
    entry = pkg.name && scripts.includes('dev')
      ? `pnpm --filter ${pkg.name} run dev`
      : 'pnpm install && pnpm run dev'
  }

  if (!hasPackage && hasIndex) {
    entry = 'ouvrir index.html'
  }

  return {
    id,
    name,
    kind,
    path: absolutePath,
    relativePath: path.relative(process.cwd(), absolutePath),
    entry,
    packageName,
    scripts,
    files: await countFiles(absolutePath),
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

async function countFiles(directory: string): Promise<number> {
  const entries = await readdir(directory, { withFileTypes: true })
  let total = 0

  for (const entry of entries) {
    if (IGNORED_DIRS.has(entry.name)) continue

    const entryPath = path.join(directory, entry.name)
    if (entry.isDirectory()) {
      total += await countFiles(entryPath)
    } else if (entry.isFile()) {
      total += 1
    }
  }

  return total
}

function humanize(value: string) {
  return value
    .replace(/^@[^/]+\//, '')
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
}
