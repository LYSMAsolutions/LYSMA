import type { FinanceData } from '@/lib/finance'
import { formatDate, formatEuro, formatPercent } from '@/lib/finance'

export function buildFinanceSpreadsheet(data: FinanceData, period: string) {
  const accountingRevenues = data.revenues.filter((item) => item.status === 'ACTIF' || item.status === 'ACTIF_PAYANT')
  const worksheets = [
    sheet('Resume', [
      ['Periode', period],
      ['CA du mois', money(data.kpis.monthRevenue)],
      ['CA annuel', money(data.kpis.yearRevenue)],
      ['MRR', money(data.kpis.mrr)],
      ['ARR', money(data.kpis.arr)],
      ['Charges mensuelles', money(data.kpis.monthlyExpenses)],
      ['URSSAF estimee', money(data.kpis.urssafEstimate)],
      ['Resultat net estime', money(data.kpis.netResult)],
      ['Rentabilite globale', percent(data.kpis.profitabilityRate)],
    ]),
    sheet('Revenus', [
      ['Client', 'Societe', 'Outil', 'Formule', 'HT', 'TVA', 'TTC', 'Frequence', 'Statut', 'Prochaine facture', 'Prochain paiement'],
      ...accountingRevenues.map((item) => [
        item.clientName,
        item.clientCompany ?? '',
        item.tool,
        item.planName,
        money(item.amountHT),
        money(item.vatAmount),
        money(item.amountTTC),
        item.frequency,
        item.status,
        formatDate(item.nextInvoiceAt),
        formatDate(item.nextPaymentAt),
      ]),
    ]),
    sheet('Charges', [
      ['Nom', 'Fournisseur', 'Categorie', 'Outil', 'HT', 'TVA', 'TTC', 'Frequence', 'Statut', 'Renouvellement'],
      ...data.expenses.map((item) => [
        item.name,
        item.provider,
        item.category,
        item.relatedTool,
        money(item.amountHT),
        money(item.vatAmount),
        money(item.amountTTC),
        item.frequency,
        item.status,
        formatDate(item.renewalDate),
      ]),
    ]),
    sheet('Sites vitrines', [
      ['Site', 'Client', 'Ligne client', 'Creation standard HT', 'Creation vendue HT', 'Statut creation', 'Maintenance HT/mois', 'Statut maintenance', 'Couts internes mensuels HT', 'Marge mensuelle HT'],
      ...data.showcaseSites.map((site) => {
        const costs = site.domainCostHT / 12 + site.workspaceCostHT + site.otherMonthlyCostsHT
        const revenue = site.maintenanceStatus === 'MAINTENANCE_PAYANTE' || site.maintenanceStatus === 'ABONNEMENT_ACTIF' ? site.maintenanceMonthlyHT : 0
        return [
          site.siteName,
          site.clientCompany ?? site.clientName,
          site.publicLabel,
          money(site.creationStandardPriceHT),
          money(site.creationSoldHT),
          site.creationStatus,
          money(site.maintenanceMonthlyHT),
          site.maintenanceStatus,
          money(costs),
          money(revenue - costs),
        ]
      }),
    ]),
    sheet('URSSAF', [
      ['CA encaisse mensuel estime', money(data.kpis.monthRevenue)],
      ['CA encaisse annuel estime', money(data.kpis.yearRevenue)],
      ['Taux URSSAF', percent(data.settings.urssafRate)],
      ['Montant URSSAF estime', money(data.kpis.urssafEstimate)],
      ['Reste apres URSSAF', money(data.kpis.monthRevenue - data.kpis.urssafEstimate)],
      ['TVA estimee', money(data.kpis.vatEstimate)],
    ]),
    sheet('Factures', [
      ['Numero', 'Client', 'Societe', 'Outil', 'HT', 'TVA', 'TTC', 'Statut', 'Emission', 'Echeance', 'Electronique'],
      ...data.invoices.map((item) => [
        item.invoiceNumber,
        item.clientName,
        item.clientCompany ?? '',
        item.tool,
        money(item.amountHT),
        money(item.vatAmount),
        money(item.amountTTC),
        item.status,
        formatDate(item.issueDate),
        formatDate(item.dueDate),
        item.electronicInvoiceStatus,
      ]),
    ]),
    sheet('Paiements', [
      ['Montant', 'Statut', 'Methode', 'Paye le', 'Echec le', 'Raison echec'],
      ...data.payments.map((item) => [
        money(item.amount),
        item.status,
        item.method ?? '',
        formatDate(item.paidAt),
        formatDate(item.failedAt),
        item.failureReason ?? '',
      ]),
    ]),
    sheet('Rentabilite', [
      ['Outil', 'CA', 'Charges', 'Marge brute', 'Marge nette', 'Clients', 'Revenu moyen', 'Cout moyen'],
      ...data.margins.map((item) => [
        item.tool,
        money(item.revenue),
        money(item.expenses),
        money(item.grossMargin),
        percent(item.netMargin),
        item.customers.toString(),
        money(item.averageRevenue),
        money(item.averageCost),
      ]),
    ]),
  ].join('')

  return `<?xml version="1.0"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
 <DocumentProperties xmlns="urn:schemas-microsoft-com:office:office">
  <Author>LYSMA Solutions</Author>
  <Title>Export finance LYSMA</Title>
 </DocumentProperties>
 ${worksheets}
</Workbook>`
}

export function buildFinancePdf(data: FinanceData, period: string) {
  const accountingRevenues = data.revenues.filter((item) => item.status === 'ACTIF' || item.status === 'ACTIF_PAYANT')
  const lines = [
    'LYSMA Solutions - Synthese pre-comptable',
    `Periode analysee : ${period}`,
    `Contact LYSMA : lysmasolutions@gmail.com`,
    'Document de synthese pre-comptable genere par LYSMA Solutions.',
    'Donnees a verifier et valider par l expert-comptable.',
    '',
    `CA du mois : ${formatEuro(data.kpis.monthRevenue)}`,
    `CA annuel : ${formatEuro(data.kpis.yearRevenue)}`,
    `MRR : ${formatEuro(data.kpis.mrr)} / ARR : ${formatEuro(data.kpis.arr)}`,
    `Charges mensuelles : ${formatEuro(data.kpis.monthlyExpenses)}`,
    `URSSAF estimee : ${formatEuro(data.kpis.urssafEstimate)} (${formatPercent(data.settings.urssafRate)})`,
    `TVA estimee : ${formatEuro(data.kpis.vatEstimate)}`,
    `Resultat net estime : ${formatEuro(data.kpis.netResult)}`,
    `Rentabilite globale : ${formatPercent(data.kpis.profitabilityRate)}`,
    '',
    'Revenus comptables retenus',
    ...accountingRevenues.slice(0, 12).map((item) => (
      `- ${item.clientCompany ?? item.clientName} / ${item.tool} / ${item.planName} : ${formatEuro(item.amountHT)} HT (${item.status})`
    )),
    '',
    'Essais et offres exclus du CA',
    ...data.revenues.filter((item) => item.status === 'ESSAI' || item.status === 'OFFERT').slice(0, 8).map((item) => (
      `- ${item.clientCompany ?? item.clientName} / ${item.tool} : ${item.status}`
    )),
    '',
    'Sites vitrines',
    ...data.showcaseSites.slice(0, 10).map((site) => (
      `- ${site.siteName} / ${site.publicLabel} : maintenance ${formatEuro(site.maintenanceMonthlyHT)} HT/mois (${site.maintenanceStatus})`
    )),
    '',
    'Charges principales',
    ...data.expenses.slice(0, 12).map((item) => (
      `- ${item.provider} / ${item.name} : ${formatEuro(item.amountHT)} HT (${item.frequency}, ${item.status})`
    )),
    '',
    'Rentabilite par outil',
    ...data.margins.map((item) => (
      `- ${item.tool} : CA ${formatEuro(item.revenue)}, charges ${formatEuro(item.expenses)}, marge ${formatEuro(item.grossMargin)}`
    )),
  ]

  return Buffer.from(createSimplePdf(lines))
}

function sheet(name: string, rows: string[][]) {
  return `<Worksheet ss:Name="${xml(name)}"><Table>${rows.map(row).join('')}</Table></Worksheet>`
}

function row(cells: string[]) {
  return `<Row>${cells.map((cell) => `<Cell><Data ss:Type="String">${xml(cell)}</Data></Cell>`).join('')}</Row>`
}

function xml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function money(value: number) {
  return `${value.toFixed(2).replace('.', ',')} EUR`
}

function percent(value: number) {
  return value.toFixed(2).replace('.', ',') + ' %'
}

function createSimplePdf(lines: string[]) {
  const objects: string[] = []
  const push = (content: string) => {
    objects.push(content)
    return objects.length
  }

  const content = lines
    .slice(0, 42)
    .map((line, index) => `BT /F1 ${index === 0 ? 18 : 10} Tf 48 ${790 - index * 17} Td (${pdfText(line)}) Tj ET`)
    .join('\n')

  const catalog = push('<< /Type /Catalog /Pages 2 0 R >>')
  const pages = push('<< /Type /Pages /Kids [3 0 R] /Count 1 >>')
  const page = push('<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>')
  const font = push('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>')
  const stream = push(`<< /Length ${Buffer.byteLength(content)} >>\nstream\n${content}\nendstream`)
  void catalog
  void pages
  void page
  void font
  void stream

  let pdf = '%PDF-1.4\n'
  const offsets = [0]
  objects.forEach((object, index) => {
    offsets.push(Buffer.byteLength(pdf))
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`
  })
  const xref = Buffer.byteLength(pdf)
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`
  offsets.slice(1).forEach((offset) => {
    pdf += `${String(offset).padStart(10, '0')} 00000 n \n`
  })
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`

  return pdf
}

function pdfText(value: string) {
  return value
    .replace(/[^\x20-\x7E]/g, ' ')
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)')
}
