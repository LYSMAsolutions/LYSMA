import { existsSync } from 'fs'
import { readdir, readFile, stat } from 'fs/promises'
import path from 'path'

const WORKSPACE_ROOT = path.resolve(process.cwd(), '..', '..')
const IGNORED = new Set(['.git', '.next', 'node_modules', 'dist', 'build', '.turbo'])
const TEXT_EXTENSIONS = new Set([
  '.css',
  '.env',
  '.html',
  '.js',
  '.json',
  '.md',
  '.mjs',
  '.prisma',
  '.ts',
  '.tsx',
  '.txt',
  '.yaml',
  '.yml',
])

export type WorkspaceEntry = {
  name: string
  path: string
  type: 'file' | 'dir'
  size: number
  updatedAt: string
}

export function getWorkspaceRoot() {
  return WORKSPACE_ROOT
}

export function resolveWorkspacePath(relativePath = '') {
  const cleanPath = relativePath.replace(/^[/\\]+/, '')
  const absolutePath = path.resolve(WORKSPACE_ROOT, cleanPath)

  if (absolutePath !== WORKSPACE_ROOT && !absolutePath.startsWith(WORKSPACE_ROOT + path.sep)) {
    throw new Error('Path outside workspace')
  }

  return absolutePath
}

export function toWorkspaceRelative(absolutePath: string) {
  return path.relative(WORKSPACE_ROOT, absolutePath).replace(/\\/g, '/')
}

export async function listWorkspaceDirectory(relativePath = '') {
  const absolutePath = resolveWorkspacePath(relativePath)

  if (!existsSync(absolutePath)) return []

  const stats = await stat(absolutePath)
  if (!stats.isDirectory()) return []

  const entries = await readdir(absolutePath, { withFileTypes: true })
  const rows: WorkspaceEntry[] = []

  for (const entry of entries) {
    if (IGNORED.has(entry.name)) continue

    const entryPath = path.join(absolutePath, entry.name)
    const entryStats = await stat(entryPath)

    rows.push({
      name: entry.name,
      path: toWorkspaceRelative(entryPath),
      type: entry.isDirectory() ? 'dir' : 'file',
      size: entryStats.size,
      updatedAt: entryStats.mtime.toISOString(),
    })
  }

  return rows.sort((a, b) => {
    if (a.type !== b.type) return a.type === 'dir' ? -1 : 1
    return a.name.localeCompare(b.name, 'fr')
  })
}

export async function readWorkspaceFile(relativePath: string) {
  const absolutePath = resolveWorkspacePath(relativePath)
  const stats = await stat(absolutePath)

  if (!stats.isFile()) throw new Error('Not a file')
  if (stats.size > 300_000) throw new Error('File too large')

  const extension = path.extname(absolutePath).toLowerCase()
  const baseName = path.basename(absolutePath).toLowerCase()

  if (!TEXT_EXTENSIONS.has(extension) && !baseName.startsWith('.env')) {
    throw new Error('Unsupported file type')
  }

  return {
    path: toWorkspaceRelative(absolutePath),
    size: stats.size,
    updatedAt: stats.mtime.toISOString(),
    content: await readFile(absolutePath, 'utf8'),
  }
}
