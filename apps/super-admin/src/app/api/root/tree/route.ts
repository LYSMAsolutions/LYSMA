import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { listWorkspaceDirectory } from '@/lib/workspace'

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Non autorise' }, { status: 401 })
  }

  const path = req.nextUrl.searchParams.get('path') ?? ''

  try {
    const entries = await listWorkspaceDirectory(path)
    return NextResponse.json({ entries })
  } catch {
    return NextResponse.json({ error: 'Chemin invalide' }, { status: 400 })
  }
}
