import { prisma } from '@/lib/prisma'

export type FinanceToolKey = 'GLOBAL' | 'LIVO' | 'PMA' | 'TRANSPORT' | 'SITE_VITRINE' | 'AUTRE'
export type FinanceFrequencyKey = 'MENSUEL' | 'ANNUEL' | 'PONCTUEL'
export type RevenueStatusKey = 'ACTIF_PAYANT' | 'ACTIF' | 'ESSAI' | 'OFFERT' | 'SUSPENDU' | 'IMPAYE' | 'RESILIE'
export type ExpenseStatusKey = 'ACTIF' | 'ARRETE' | 'A_VERIFIER'

export type FinanceSettingsView = {
  id: string
  urssafRate: number
  vatRate: number
  vatStatus: 'FRANCHISE' | 'ASSUJETTI'
  declarationFrequency: 'MENSUELLE' | 'TRIMESTRIELLE'
}

export type RevenueSubscriptionView = {
  id: string
  clientName: string
  clientCompany: string | null
  tool: FinanceToolKey
  planName: string
  amountHT: number
  vatAmount: number
  amountTTC: number
  frequency: FinanceFrequencyKey
  status: RevenueStatusKey
  trialStartAt: Date | null
  trialEndAt: Date | null
  startDate: Date
  nextInvoiceAt: Date | null
  nextPaymentAt: Date | null
  gocardlessCustomerId: string | null
  gocardlessMandateId: string | null
  gocardlessSubscriptionId: string | null
  sageCustomerId: string | null
}

export type ExpenseView = {
  id: string
  name: string
  provider: string
  category: string
  relatedTool: FinanceToolKey
  amountHT: number
  vatAmount: number
  amountTTC: number
  frequency: FinanceFrequencyKey
  startDate: Date
  renewalDate: Date | null
  paymentMethod: string | null
  status: ExpenseStatusKey
  notes: string | null
}

export type InvoiceView = {
  id: string
  invoiceNumber: string
  clientName: string
  clientCompany: string | null
  tool: FinanceToolKey
  amountHT: number
  vatAmount: number
  amountTTC: number
  status: string
  issueDate: Date
  dueDate: Date | null
  paidAt: Date | null
  sageInvoiceStatus: string | null
  electronicInvoiceStatus: string
}

export type PaymentView = {
  id: string
  invoiceId: string | null
  subscriptionId: string | null
  amount: number
  status: string
  method: string | null
  paidAt: Date | null
  failedAt: Date | null
  failureReason: string | null
}

export type ShowcaseSiteFinanceView = {
  id: string
  siteName: string
  clientName: string
  clientCompany: string | null
  publicLabel: string
  creationStandardPriceHT: number
  creationSoldHT: number
  creationStatus: 'CREATION_FACTUREE' | 'CREATION_OFFERTE'
  maintenanceMonthlyHT: number
  maintenanceStatus: 'ABONNEMENT_ACTIF' | 'MAINTENANCE_OFFERTE' | 'MAINTENANCE_PAYANTE'
  domainCostHT: number
  workspaceCostHT: number
  otherMonthlyCostsHT: number
  internalNotes: string | null
  sageCustomerId: string | null
  officialInvoiceNumber: string | null
  officialPdfUrl: string | null
  electronicInvoiceStatus: string
  platformProvider: string | null
  platformInvoiceId: string | null
  paymentStatus: string
}

export type ToolMargin = {
  tool: FinanceToolKey
  revenue: number
  expenses: number
  grossMargin: number
  netMargin: number
  customers: number
  averageRevenue: number
  averageCost: number
}

export type FinanceKpis = {
  monthRevenue: number
  yearRevenue: number
  mrr: number
  arr: number
  activeSubscriptions: number
  trialSubscriptions: number
  unpaidSubscriptions: number
  monthlyExpenses: number
  annualExpenses: number
  urssafEstimate: number
  netResult: number
  profitabilityRate: number
  nextMonthForecast: number
  vatEstimate: number
  offeredRevenue: number
  trialPotentialMrr: number
}

export type FinanceData = {
  settings: FinanceSettingsView
  revenues: RevenueSubscriptionView[]
  expenses: ExpenseView[]
  invoices: InvoiceView[]
  payments: PaymentView[]
  showcaseSites: ShowcaseSiteFinanceView[]
  kpis: FinanceKpis
  margins: ToolMargin[]
}

export async function getFinanceData(): Promise<FinanceData> {
  const [settings, revenuesRaw, expensesRaw, invoicesRaw, paymentsRaw, showcaseSitesRaw] = await Promise.all([
    getFinanceSettings(),
    prisma.revenueSubscription.findMany({ orderBy: { createdAt: 'desc' }, take: 500 }),
    prisma.lysmaExpense.findMany({ orderBy: [{ status: 'asc' }, { renewalDate: 'asc' }], take: 500 }),
    prisma.financeInvoice.findMany({ orderBy: { issueDate: 'desc' }, take: 500 }),
    prisma.financePayment.findMany({ orderBy: { createdAt: 'desc' }, take: 500 }),
    prisma.showcaseSiteFinance.findMany({ orderBy: { createdAt: 'desc' }, take: 500 }),
  ])

  const revenues = revenuesRaw.map(mapRevenue)
  const expenses = expensesRaw.map(mapExpense)
  const invoices = invoicesRaw.map(mapInvoice)
  const payments = paymentsRaw.map(mapPayment)
  const showcaseSites = showcaseSitesRaw.map(mapShowcaseSite)
  const kpis = computeKpis(revenues, expenses, payments, settings, showcaseSites)
  const margins = computeMargins(revenues, expenses, showcaseSites)

  return {
    settings,
    revenues,
    expenses,
    invoices,
    payments,
    showcaseSites,
    kpis,
    margins,
  }
}

export async function getFinanceSettings(): Promise<FinanceSettingsView> {
  const existing = await prisma.financeSettings.findFirst({ orderBy: { createdAt: 'asc' } })
  const settings = existing ?? await prisma.financeSettings.create({ data: {} })

  return {
    id: settings.id,
    urssafRate: toNumber(settings.urssafRate),
    vatRate: toNumber(settings.vatRate),
    vatStatus: settings.vatStatus,
    declarationFrequency: settings.declarationFrequency,
  }
}

export function computeKpis(
  revenues: RevenueSubscriptionView[],
  expenses: ExpenseView[],
  payments: PaymentView[],
  settings: FinanceSettingsView,
  showcaseSites: ShowcaseSiteFinanceView[] = [],
): FinanceKpis {
  const paidRevenues = revenues.filter(isPaidRevenue)
  const paidShowcaseMrr = showcaseSites.reduce((sum, site) => {
    return sum + (site.maintenanceStatus === 'MAINTENANCE_PAYANTE' || site.maintenanceStatus === 'ABONNEMENT_ACTIF' ? site.maintenanceMonthlyHT : 0)
  }, 0)
  const mrr = paidRevenues.reduce((sum, revenue) => sum + normalizeMonthly(revenue.amountHT, revenue.frequency), 0) + paidShowcaseMrr
  const monthRevenue = mrr
  const yearRevenue = paidRevenues.reduce((sum, revenue) => sum + normalizeAnnual(revenue.amountHT, revenue.frequency), 0) + paidShowcaseMrr * 12
  const monthlyExpenses = expenses
    .filter((expense) => expense.status !== 'ARRETE')
    .reduce((sum, expense) => sum + normalizeMonthly(expense.amountHT, expense.frequency), 0)
    + showcaseSites.reduce((sum, site) => sum + site.domainCostHT / 12 + site.workspaceCostHT + site.otherMonthlyCostsHT, 0)
  const annualExpenses = expenses
    .filter((expense) => expense.status !== 'ARRETE')
    .reduce((sum, expense) => sum + normalizeAnnual(expense.amountHT, expense.frequency), 0)
    + showcaseSites.reduce((sum, site) => sum + site.domainCostHT + site.workspaceCostHT * 12 + site.otherMonthlyCostsHT * 12, 0)
  const paidThisYear = payments
    .filter((payment) => payment.status === 'PAYE' && isCurrentYear(payment.paidAt))
    .reduce((sum, payment) => sum + payment.amount, 0)
  const urssafBase = paidThisYear > 0 ? paidThisYear / 12 : monthRevenue
  const urssafEstimate = urssafBase * (settings.urssafRate / 100)
  const vatEstimate = settings.vatStatus === 'ASSUJETTI'
    ? paidRevenues.reduce((sum, revenue) => sum + normalizeMonthly(revenue.vatAmount, revenue.frequency), 0)
    : 0
  const netResult = monthRevenue - monthlyExpenses - urssafEstimate
  const profitabilityRate = monthRevenue > 0 ? (netResult / monthRevenue) * 100 : 0

  return {
    monthRevenue,
    yearRevenue,
    mrr,
    arr: mrr * 12,
    activeSubscriptions: revenues.filter(isPaidRevenue).length + showcaseSites.filter((site) => site.maintenanceStatus === 'MAINTENANCE_PAYANTE' || site.maintenanceStatus === 'ABONNEMENT_ACTIF').length,
    trialSubscriptions: revenues.filter((revenue) => revenue.status === 'ESSAI').length,
    unpaidSubscriptions: revenues.filter((revenue) => revenue.status === 'IMPAYE').length,
    monthlyExpenses,
    annualExpenses,
    urssafEstimate,
    netResult,
    profitabilityRate,
    nextMonthForecast: mrr - monthlyExpenses - urssafEstimate,
    vatEstimate,
    offeredRevenue: revenues.filter((revenue) => revenue.status === 'OFFERT').reduce((sum, revenue) => sum + normalizeMonthly(revenue.amountHT, revenue.frequency), 0)
      + showcaseSites.filter((site) => site.creationStatus === 'CREATION_OFFERTE').reduce((sum, site) => sum + site.creationStandardPriceHT, 0),
    trialPotentialMrr: revenues.filter((revenue) => revenue.status === 'ESSAI').reduce((sum, revenue) => sum + normalizeMonthly(revenue.amountHT, revenue.frequency), 0),
  }
}

export function computeMargins(
  revenues: RevenueSubscriptionView[],
  expenses: ExpenseView[],
  showcaseSites: ShowcaseSiteFinanceView[] = [],
): ToolMargin[] {
  const tools: FinanceToolKey[] = ['LIVO', 'PMA', 'TRANSPORT', 'SITE_VITRINE', 'AUTRE']

  return tools.map((tool) => {
    const toolRevenues = revenues.filter((revenue) => revenue.tool === tool && isPaidRevenue(revenue))
    const toolExpenses = expenses.filter((expense) => expense.relatedTool === tool && expense.status !== 'ARRETE')
    const showcaseRevenue = tool === 'SITE_VITRINE'
      ? showcaseSites.reduce((sum, site) => sum + (site.maintenanceStatus === 'MAINTENANCE_PAYANTE' || site.maintenanceStatus === 'ABONNEMENT_ACTIF' ? site.maintenanceMonthlyHT : 0), 0)
      : 0
    const showcaseExpense = tool === 'SITE_VITRINE'
      ? showcaseSites.reduce((sum, site) => sum + site.domainCostHT / 12 + site.workspaceCostHT + site.otherMonthlyCostsHT, 0)
      : 0
    const revenue = toolRevenues.reduce((sum, item) => sum + normalizeMonthly(item.amountHT, item.frequency), 0) + showcaseRevenue
    const expense = toolExpenses.reduce((sum, item) => sum + normalizeMonthly(item.amountHT, item.frequency), 0) + showcaseExpense
    const customers = new Set([
      ...toolRevenues.map((item) => `${item.clientCompany ?? ''}:${item.clientName}`),
      ...(tool === 'SITE_VITRINE' ? showcaseSites.map((site) => `${site.clientCompany ?? ''}:${site.clientName}`) : []),
    ]).size

    return {
      tool,
      revenue,
      expenses: expense,
      grossMargin: revenue - expense,
      netMargin: revenue > 0 ? ((revenue - expense) / revenue) * 100 : 0,
      customers,
      averageRevenue: customers > 0 ? revenue / customers : 0,
      averageCost: customers > 0 ? expense / customers : 0,
    }
  })
}

export function normalizeMonthly(amount: number, frequency: FinanceFrequencyKey) {
  if (frequency === 'ANNUEL') return amount / 12
  if (frequency === 'PONCTUEL') return 0
  return amount
}

export function normalizeAnnual(amount: number, frequency: FinanceFrequencyKey) {
  if (frequency === 'ANNUEL') return amount
  if (frequency === 'PONCTUEL') return amount
  return amount * 12
}

export function formatEuro(value: number) {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

export function formatPercent(value: number) {
  return new Intl.NumberFormat('fr-FR', {
    maximumFractionDigits: 1,
  }).format(value) + ' %'
}

export function formatDate(value: Date | null) {
  if (!value) return '-'
  return new Intl.DateTimeFormat('fr-FR').format(value)
}

function toNumber(value: unknown) {
  if (typeof value === 'number') return value
  if (typeof value === 'string') return Number(value)
  if (value && typeof value === 'object' && 'toNumber' in value && typeof value.toNumber === 'function') {
    return value.toNumber()
  }
  return Number(value ?? 0)
}

function isCurrentYear(date: Date | null) {
  if (!date) return false
  return date.getFullYear() === new Date().getFullYear()
}

function isPaidRevenue(revenue: RevenueSubscriptionView) {
  return revenue.status === 'ACTIF' || revenue.status === 'ACTIF_PAYANT'
}

function mapRevenue(revenue: any): RevenueSubscriptionView {
  return {
    ...revenue,
    tool: revenue.tool,
    frequency: revenue.frequency,
    status: revenue.status,
    amountHT: toNumber(revenue.amountHT),
    vatAmount: toNumber(revenue.vatAmount),
    amountTTC: toNumber(revenue.amountTTC),
  }
}

function mapExpense(expense: any): ExpenseView {
  return {
    ...expense,
    relatedTool: expense.relatedTool,
    frequency: expense.frequency,
    status: expense.status,
    amountHT: toNumber(expense.amountHT),
    vatAmount: toNumber(expense.vatAmount),
    amountTTC: toNumber(expense.amountTTC),
  }
}

function mapInvoice(invoice: any): InvoiceView {
  return {
    ...invoice,
    tool: invoice.tool,
    amountHT: toNumber(invoice.amountHT),
    vatAmount: toNumber(invoice.vatAmount),
    amountTTC: toNumber(invoice.amountTTC),
  }
}

function mapPayment(payment: any): PaymentView {
  return {
    ...payment,
    amount: toNumber(payment.amount),
  }
}

function mapShowcaseSite(site: any): ShowcaseSiteFinanceView {
  return {
    ...site,
    creationStandardPriceHT: toNumber(site.creationStandardPriceHT),
    creationSoldHT: toNumber(site.creationSoldHT),
    maintenanceMonthlyHT: toNumber(site.maintenanceMonthlyHT),
    domainCostHT: toNumber(site.domainCostHT),
    workspaceCostHT: toNumber(site.workspaceCostHT),
    otherMonthlyCostsHT: toNumber(site.otherMonthlyCostsHT),
  }
}
