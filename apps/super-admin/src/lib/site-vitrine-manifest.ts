export type ShowcaseKind = 'next' | 'static'

export type ShowcaseManifestItem = {
  id: string
  name: string
  kind: ShowcaseKind
  entry: string
  relativePath: string
  packageName?: string
  scripts?: string[]
}

export type ShowcaseOverview = ShowcaseManifestItem & {
  path: string
  files: number
  status: 'present'
}

export const SHOWCASE_MANIFEST: ShowcaseManifestItem[] = [
  {
    id: 'carrosserie-mounier',
    name: 'Carrosserie Mounier',
    kind: 'static',
    entry: 'pnpm run build -> dist',
    relativePath: '../site-vitrine/carrosserie-mounier',
    scripts: ['dev', 'build', 'start', 'check'],
  },
  {
    id: 'lysma-hub',
    name: 'Lysma Hub',
    kind: 'static',
    entry: 'pnpm run build -> dist',
    relativePath: '../site-vitrine/lysma-hub',
    scripts: ['dev', 'build', 'start', 'check'],
  },
  {
    id: 'calculateur-eliquide',
    name: 'Calculateur E-liquide',
    kind: 'next',
    entry: 'pnpm --filter calculateur-eliquide run dev',
    relativePath: '../site-vitrine/calculateur-eliquide',
    packageName: 'calculateur-eliquide',
    scripts: ['dev', 'build', 'start'],
  },
]

export function getShowcaseRootLabel() {
  return 'apps/site-vitrine'
}

export async function getShowcaseOverviewSites(): Promise<ShowcaseOverview[]> {
  return SHOWCASE_MANIFEST.map((site) => ({
    ...site,
    path: site.relativePath,
    files: 0,
    status: 'present',
  }))
}
