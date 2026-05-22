import { mkdir, writeFile } from 'fs/promises'
import path from 'path'
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { publishShowcaseFile } from '@/lib/publishing'
import { getShowcaseRepoPath, getShowcaseSite, shouldWriteLocalShowcaseFiles } from '@/lib/site-vitrine'

const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/x-icon'])

function safeFileName(name: string) {
  const extension = path.extname(name).toLowerCase()
  const base = path.basename(name, extension)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9-_]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase()
    .slice(0, 60)

  return `${base || 'image'}-${Date.now()}${extension || '.jpg'}`
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Non autorise' }, { status: 401 })
  }

  const { id } = await params
  const site = await getShowcaseSite(id)
  if (!site) return NextResponse.json({ error: 'Site introuvable' }, { status: 404 })

  const formData = await req.formData()
  const file = formData.get('file')

  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'Fichier manquant' }, { status: 400 })
  }

  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json({ error: 'Format image non autorise' }, { status: 400 })
  }

  if (file.size > 4_000_000) {
    return NextResponse.json({ error: 'Image trop lourde, max 4 Mo' }, { status: 400 })
  }

  const uploadDir = path.join(site.path, 'assets', 'uploads')
  const fileName = safeFileName(file.name)
  const absolutePath = path.join(uploadDir, fileName)

  if (!absolutePath.startsWith(site.path)) {
    return NextResponse.json({ error: 'Chemin invalide' }, { status: 400 })
  }

  const buffer = Buffer.from(await file.arrayBuffer())
  const writeLocal = shouldWriteLocalShowcaseFiles()

  if (writeLocal) {
    await mkdir(uploadDir, { recursive: true })
    await writeFile(absolutePath, buffer)
  }

  const relativePath = `assets/uploads/${fileName}`
  const publication = await publishShowcaseFile(id, {
    path: getShowcaseRepoPath(id, relativePath),
    content: buffer.toString('base64'),
    encoding: 'base64',
    message: `chore(site-vitrine): upload ${fileName}`,
  })

  if (!writeLocal && !publication.github.committed) {
    return NextResponse.json({
      error: publication.github.error ?? 'Publication GitHub non configuree. Upload impossible sur Vercel.',
      publication,
    }, { status: 500 })
  }

  return NextResponse.json({
    success: true,
    path: relativePath,
    publication,
  })
}
