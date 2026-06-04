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
  repository?: string
  repoPathBase?: string
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
  const sites = await Promise.all(
    SHOWCASE_MANIFEST.map(async (site) => getShowcaseSite(site.id)),
  )

  return sites
    .filter((site): site is ShowcaseSite => Boolean(site))
    .sort((a, b) => a.name.localeCompare(b.name, 'fr'))
}

export async function getShowcaseSite(id: string): Promise<ShowcaseSite | null> {
  if (!/^[a-zA-Z0-9-_]+$/.test(id)) return null

  const manifest = SHOWCASE_MANIFEST.find((site) => site.id === id)
  const absolutePath = manifest
    ? path.resolve(process.cwd(), manifest.relativePath)
    : path.join(SITES_ROOT, id)
  const indexPath = path.join(absolutePath, 'index.html')

  if (!manifest && !existsSync(indexPath)) return null
  if (manifest && !existsSync(absolutePath)) return null

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
    repository: manifest?.repository,
    repoPathBase: manifest?.repoPathBase,
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
  return JSON.parse(raw.replace(/^\uFEFF/, ''))
}

export type ShowcaseDiscoveryPage = {
  path: string
  title: string
  description: string | null
  headings: string[]
  keywords: string[]
}

export type ShowcaseDiscovery = {
  meta: {
    title?: string
    description?: string
    source?: string
  }
  pages: ShowcaseDiscoveryPage[]
  colors: string[]
  fonts: string[]
}

export async function discoverShowcaseSite(id: string): Promise<ShowcaseDiscovery | null> {
  const site = await getShowcaseSite(id)
  if (!site) return null

  const htmlFiles = await getFilesByExtension(site.path, '.html')
  const cssFiles = await getFilesByExtension(site.path, '.css')

  const pages = await Promise.all(htmlFiles.map(async (filePath) => {
    const raw = await readFile(filePath, 'utf8')
    return {
      path: path.relative(site.path, filePath).replace(/\\/g, '/'),
      title: extractHtmlTitle(raw),
      description: extractHtmlDescription(raw),
      headings: extractHtmlHeadings(raw),
      keywords: extractHtmlKeywords(raw),
    }
  }))

  const metaPage = pages.find((page) => page.path === 'index.html') || pages[0]
  const colors = await extractCssColors(cssFiles)
  const fonts = await extractCssFonts(cssFiles)

  return {
    meta: {
      title: metaPage?.title,
      description: metaPage?.description ?? undefined,
      source: metaPage?.path,
    },
    pages,
    colors,
    fonts,
  }
}

async function getFilesByExtension(dir: string, extension: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true })
  const files: string[] = []

  for (const entry of entries) {
    const resolved = path.join(dir, entry.name)

    if (entry.isDirectory()) {
      files.push(...await getFilesByExtension(resolved, extension))
      continue
    }

    if (entry.isFile() && path.extname(entry.name).toLowerCase() === extension) {
      files.push(resolved)
    }
  }

  return files
}

function extractHtmlTitle(html: string) {
  const match = html.match(/<title[^>]*>([^<]+)<\/title>/i)
  return match?.[1]?.trim() ?? ''
}

function extractHtmlDescription(html: string) {
  const match = html.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i)
  return match?.[1]?.trim() ?? null
}

function extractHtmlHeadings(html: string) {
  const headings = Array.from(html.matchAll(/<(h[1-3])[^>]*>(.*?)<\/\1>/gi))
    .map((match) => match[2].replace(/<[^>]+>/g, '').trim())
    .filter(Boolean)

  return headings.slice(0, 10)
}

function extractHtmlKeywords(html: string) {
  const meta = html.match(/<meta\s+name=["']keywords["']\s+content=["']([^"']+)["']/i)
  const content = meta?.[1]?.trim() ?? ''
  return content ? content.split(',').map((item) => item.trim()).filter(Boolean) : []
}

async function extractCssColors(cssFiles: string[]) {
  const colors = new Set<string>()

  for (const filePath of cssFiles) {
    const raw = await readFile(filePath, 'utf8')
    for (const match of raw.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/gi)) {
      const value = match[2].trim()
      if (isColorValue(value)) colors.add(value)
    }
    for (const match of raw.matchAll(/(#(?:[0-9a-fA-F]{3,8})|rgba?\([^\)]+\)|hsla?\([^\)]+\))/gi)) {
      colors.add(match[1] ?? match[0])
    }
  }

  return Array.from(colors).slice(0, 20)
}

async function extractCssFonts(cssFiles: string[]) {
  const fonts = new Set<string>()

  for (const filePath of cssFiles) {
    const raw = await readFile(filePath, 'utf8')
    for (const match of raw.matchAll(/font-family\s*:\s*([^;]+);/gi)) {
      const candidate = match[1].trim().replace(/['"]/g, '')
      if (candidate) {
        candidate.split(',').map((font) => font.trim()).forEach((font) => {
          if (font) fonts.add(font)
        })
      }
    }
  }

  return Array.from(fonts).slice(0, 20)
}

function isColorValue(value: string) {
  return /^(#(?:[0-9a-fA-F]{3,8})|rgba?\([^\)]+\)|hsla?\([^\)]+\))$/.test(value)
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

export function getShowcaseRepoPath(id: string, relativeFilePath = '') {
  const manifest = SHOWCASE_MANIFEST.find((site) => site.id === id)
  const cleanPath = relativeFilePath.replace(/^[/\\]+/, '')
  const basePath = manifest?.repoPathBase ?? path.posix.join('apps/site-vitrine', id)
  return path.posix.join(basePath, cleanPath).replace(/\\/g, '/')
}

export function shouldWriteLocalShowcaseFiles() {
  return process.env.VERCEL !== '1'
}

export function resolveShowcaseFile(id: string, relativeFilePath = 'index.html') {
  if (!/^[a-zA-Z0-9-_]+$/.test(id)) return null

  const manifest = SHOWCASE_MANIFEST.find((site) => site.id === id)
  const sitePath = manifest
    ? path.resolve(process.cwd(), manifest.relativePath)
    : path.join(SITES_ROOT, id)
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
      canonical: '',
      keywords: '',
      robots: 'index, follow',
      ogTitle: name,
      ogDescription: '',
      ogImage: '',
    },
  }
}

function humanize(value: string) {
  return value
    .replace(/^@[^/]+\//, '')
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
}
