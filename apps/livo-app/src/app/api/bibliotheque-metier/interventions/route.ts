import { NextRequest, NextResponse } from 'next/server'
import {
  bibliothequeMetierMeta,
  getCategoriesInterventionsMetier,
  searchInterventionsMetier,
} from '@/lib/bibliotheque-metier'

export function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const query = searchParams.get('q') ?? ''
  const categorie = searchParams.get('categorie') ?? undefined
  const limitParam = Number(searchParams.get('limit') ?? 12)
  const limit = Number.isFinite(limitParam) ? limitParam : 12

  const interventions = searchInterventionsMetier({
    query,
    categorie,
    limit,
  })

  return NextResponse.json({
    meta: {
      ...bibliothequeMetierMeta,
      returned: interventions.length,
    },
    categories: getCategoriesInterventionsMetier(),
    interventions,
  })
}
