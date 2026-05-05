import { existsSync } from 'fs'
import { readFile } from 'fs/promises'
import path from 'path'

export type LysmaTool = {
  id: string
  name: string
  kind: 'app' | 'site'
  status: 'ready' | 'partial' | 'missing'
  relativePath: string
  command: string
  envFile: string
  packageName?: string
  notes: string[]
}

const WORKSPACE_ROOT = path.resolve(process.cwd(), '..', '..')

const TOOL_DEFINITIONS = [
  {
    id: 'livo-app',
    name: 'LIVO App',
    kind: 'app' as const,
    relativePath: 'apps/livo-app',
    command: 'pnpm --filter livo-app run dev',
    envFile: '.env.local',
  },
  {
    id: 'portail-pma',
    name: 'Portail PMA',
    kind: 'app' as const,
    relativePath: 'apps/portail-pma',
    command: 'pnpm --filter portail-pma run dev',
    envFile: '.env.local',
  },
  {
    id: 'sites-vitrine',
    name: 'Sites vitrine',
    kind: 'site' as const,
    relativePath: 'apps/site-vitrine',
    command: 'ouvrir /sites',
    envFile: '',
  },
]

export async function getLysmaTools(): Promise<LysmaTool[]> {
  return Promise.all(TOOL_DEFINITIONS.map(getToolStatus))
}

async function getToolStatus(definition: typeof TOOL_DEFINITIONS[number]): Promise<LysmaTool> {
  const absolutePath = path.join(WORKSPACE_ROOT, definition.relativePath)
  const packagePath = path.join(absolutePath, 'package.json')
  const envPath = definition.envFile ? path.join(absolutePath, definition.envFile) : ''
  const notes: string[] = []

  const hasFolder = existsSync(absolutePath)
  const hasPackage = existsSync(packagePath)
  const hasEnv = !definition.envFile || existsSync(envPath)
  let packageName: string | undefined

  if (hasPackage) {
    const raw = await readFile(packagePath, 'utf8')
    const pkg = JSON.parse(raw) as { name?: string }
    packageName = pkg.name
  }

  if (!hasFolder) notes.push('dossier introuvable')
  if (definition.kind === 'app' && !hasPackage) notes.push('package.json manquant')
  if (definition.envFile && !hasEnv) notes.push(`${definition.envFile} manquant`)

  const status = !hasFolder ? 'missing' : notes.length > 0 ? 'partial' : 'ready'

  return {
    ...definition,
    status,
    packageName,
    notes,
  }
}
