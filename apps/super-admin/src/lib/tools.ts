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

const TOOL_DEFINITIONS = [
  {
    id: 'livo-app',
    name: 'LIVO App',
    kind: 'app' as const,
    relativePath: 'apps/livo-app',
    command: 'pnpm --filter livo-app run dev',
    envFile: '.env.local',
    packageName: 'livo-app',
  },
  {
    id: 'portail-pma',
    name: 'Portail PMA',
    kind: 'app' as const,
    relativePath: 'apps/portail-pma',
    command: 'pnpm --filter portail-pma run dev',
    envFile: '.env.local',
    packageName: 'portail-pma',
  },
  {
    id: 'sites-vitrine',
    name: 'Sites vitrine',
    kind: 'site' as const,
    relativePath: 'apps/site-vitrine',
    command: 'ouvrir /sites',
    envFile: '',
    packageName: undefined,
  },
]

export async function getLysmaTools(): Promise<LysmaTool[]> {
  return TOOL_DEFINITIONS.map((definition) => ({
    ...definition,
    status: 'ready',
    notes: [],
  }))
}
