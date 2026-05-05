import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import path from 'path'
import { resolveShowcaseFile } from '@/lib/site-vitrine'

const TYPES: Record<string, string> = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string; filePath?: string[] }> },
) {
  const { id, filePath } = await params
  const relativePath = filePath?.join('/') || 'index.html'
  const file = resolveShowcaseFile(id, relativePath)

  if (!file) return new NextResponse('Not found', { status: 404 })

  const body = await readFile(file)
  const ext = path.extname(file).toLowerCase()
  const responseBody = ext === '.html'
    ? rewriteHtml(body.toString('utf8'), id, relativePath)
    : body

  return new NextResponse(responseBody, {
    headers: {
      'Content-Type': TYPES[ext] ?? 'application/octet-stream',
      'Cache-Control': 'no-store',
    },
  })
}

function rewriteHtml(html: string, siteId: string, relativePath: string) {
  const fileDir = path.posix.dirname(relativePath.replace(/\\/g, '/'))
  const base = `/preview/sites/${siteId}`

  function resolveAsset(value: string) {
    const normalized = path.posix.normalize(path.posix.join(base, fileDir === '.' ? '' : fileDir, value))
    return normalized.startsWith(base) ? normalized : path.posix.normalize(path.posix.join(base, value.replace(/^(\.\.\/)+/, '')))
  }

  return html
    .replace(/(href|src)="(?!https?:|mailto:|tel:|#|\/)([^"]+)"/g, (_match, attr, value) => {
      return `${attr}="${resolveAsset(value)}"`
    })
    .replace(/url\(['"]?(?!https?:|data:|\/)([^'")]+)['"]?\)/g, (_match, value) => {
      return `url('${resolveAsset(value)}')`
    })
}
