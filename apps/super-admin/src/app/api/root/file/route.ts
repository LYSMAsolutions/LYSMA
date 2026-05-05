import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { readWorkspaceFile } from '@/lib/workspace'

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Non autorise' }, { status: 401 })
  }

  const path = req.nextUrl.searchParams.get('path')
  if (!path) return NextResponse.json({ error: 'Fichier manquant' }, { status: 400 })

  try {
    const file = await readWorkspaceFile(path)
    return NextResponse.json({ file })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Lecture impossible' },
      { status: 400 },
    )
  }
}
