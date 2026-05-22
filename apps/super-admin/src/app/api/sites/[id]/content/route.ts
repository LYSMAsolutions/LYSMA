import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { publishShowcaseFile } from '@/lib/publishing'
import {
  getShowcaseRepoPath,
  getShowcaseSite,
  readShowcaseContent,
  shouldWriteLocalShowcaseFiles,
  writeShowcaseContent,
} from '@/lib/site-vitrine'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Non autorise' }, { status: 401 })
  }

  const { id } = await params
  const site = await getShowcaseSite(id)
  if (!site) return NextResponse.json({ error: 'Site introuvable' }, { status: 404 })

  const content = await readShowcaseContent(id)
  return NextResponse.json({ site, content })
}

export async function PUT(
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

  const content = await req.json()
  const writeLocal = shouldWriteLocalShowcaseFiles()

  if (writeLocal) {
    await writeShowcaseContent(id, content)
  }

  const serialized = JSON.stringify(content, null, 2) + '\n'
  const publication = await publishShowcaseFile(id, {
    path: getShowcaseRepoPath(id, 'content/site.json'),
    content: serialized,
    message: `chore(site-vitrine): update ${site.name}`,
  })

  if (!writeLocal && !publication.github.committed) {
    return NextResponse.json({
      error: publication.github.error ?? 'Publication GitHub non configuree. Sauvegarde impossible sur Vercel.',
      publication,
    }, { status: 500 })
  }

  return NextResponse.json({ success: true, content, publication })
}
