import { auth } from '@/lib/auth'
import { getFinanceData } from '@/lib/finance'
import { buildFinancePdf, buildFinanceSpreadsheet } from '@/lib/finance-export'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Non autorise' }, { status: 401 })

  const url = new URL(req.url)
  const format = url.searchParams.get('format') === 'pdf' ? 'pdf' : 'excel'
  const period = url.searchParams.get('period') === 'annual' ? 'annuel' : 'mensuel'
  const data = await getFinanceData()

  if (format === 'pdf') {
    const pdf = buildFinancePdf(data, period)
    return new Response(pdf, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="lysma-finance-${period}.pdf"`,
      },
    })
  }

  const workbook = buildFinanceSpreadsheet(data, period)
  return new Response(workbook, {
    headers: {
      'Content-Type': 'application/vnd.ms-excel; charset=utf-8',
      'Content-Disposition': `attachment; filename="lysma-finance-${period}.xls"`,
    },
  })
}
