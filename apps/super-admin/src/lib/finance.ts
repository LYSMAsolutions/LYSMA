import { prisma } from '@/lib/prisma'

export type FinanceToolKey = 'GLOBAL' | 'LIVO' | 'PMA' | 'TRANSPORT' | 'AUTRE'
export type FinanceFrequencyKey = 'MENSUEL' | 'ANNUEL' | 'PONCTUEL'
export type RevenueStatusKey = 'ACTIF' | 'ESSAI' | 'SUSPENDU' | 'IMPAYE' | 'RESILIE'
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
}

export type FinanceData = {
  settings: FinanceSettingsView
  revenues: RevenueSubscriptionView[]
  expenses: ExpenseView[]
  invoices: InvoiceView[]
  payments: PaymentView[]
  kpis: FinanceKpis
  margins: ToolMargin[]
  usesMockData: boolean
}

const now = () => new Date()
const addDays = (date: Date, days: number) => new Date(date.getTime() + days * 86400000)

export async function getFinanceData(): Promise<FinanceData> {
  const [settings, revenuesRaw, expensesRaw, invoicesRaw, paymentsRaw] = await Promise.all([
    getFinanceSettings(),
    prisma.revenueSubscription.findMany({ orderBy: { createdAt: 'desc' }, take: 500 }),
    prisma.lysmaExpense.findMany({ orderBy: [{ status: 'asc' }, { renewalDate: 'asc' }], take: 500 }),
    prisma.financeInvoice.findMany({ orderBy: { issueDate: 'desc' }, take: 500 }),
    prisma.financePayment.findMany({ orderBy: { createdAt: 'desc' }, take: 500 }),
  ])

  const revenues = revenuesRaw.length > 0 ? revenuesRaw.map(mapRevenue) : mockRevenues()
  const expenses = expensesRaw.length > 0 ? expensesRaw.map(mapExpense) : mockExpenses()
  const invoices = invoicesRaw.map(mapInvoice)
  const payments = paymentsRaw.map(mapPayment)
  const kpis = computeKpis(revenues, expenses, payments, settings)
  const margins = computeMargins(revenues, expenses)

  return {
    settings,
    revenues,
    expenses,
    invoices,
    payments,
    kpis,
    margins,
    usesMockData: revenuesRaw.length === 0 && expensesRaw.length === 0,
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
): FinanceKpis {
  const activeOrTrial = revenues.filter((revenue) => revenue.status === 'ACTIF' || revenue.status === 'ESSAI')
  const mrr = activeOrTrial.reduce((sum, revenue) => sum + normalizeMonthly(revenue.amountHT, revenue.frequency), 0)
  const monthRevenue = mrr
  const yearRevenue = activeOrTrial.reduce((sum, revenue) => sum + normalizeAnnual(revenue.amountHT, revenue.frequency), 0)
  const monthlyExpenses = expenses
    .filter((expense) => expense.status !== 'ARRETE')
    .reduce((sum, expense) => sum + normalizeMonthly(expense.amountHT, expense.frequency), 0)
  const annualExpenses = expenses
    .filter((expense) => expense.status !== 'ARRETE')
    .reduce((sum, expense) => sum + normalizeAnnual(expense.amountHT, expense.frequency), 0)
  const paidThisYear = payments
    .filter((payment) => payment.status === 'PAYE' && isCurrentYear(payment.paidAt))
    .reduce((sum, payment) => sum + payment.amount, 0)
  const urssafBase = paidThisYear > 0 ? paidThisYear / 12 : monthRevenue
  const urssafEstimate = urssafBase * (settings.urssafRate / 100)
  const vatEstimate = settings.vatStatus === 'ASSUJETTI'
    ? activeOrTrial.reduce((sum, revenue) => sum + normalizeMonthly(revenue.vatAmount, revenue.frequency), 0)
    : 0
  const netResult = monthRevenue - monthlyExpenses - urssafEstimate
  const profitabilityRate = monthRevenue > 0 ? (netResult / monthRevenue) * 100 : 0

  return {
    monthRevenue,
    yearRevenue,
    mrr,
    arr: mrr * 12,
    activeSubscriptions: revenues.filter((revenue) => revenue.status === 'ACTIF').length,
    trialSubscriptions: revenues.filter((revenue) => revenue.status === 'ESSAI').length,
    unpaidSubscriptions: revenues.filter((revenue) => revenue.status === 'IMPAYE').length,
    monthlyExpenses,
    annualExpenses,
    urssafEstimate,
    netResult,
    profitabilityRate,
    nextMonthForecast: mrr - monthlyExpenses - urssafEstimate,
    vatEstimate,
  }
}

export function computeMargins(revenues: RevenueSubscriptionView[], expenses: ExpenseView[]): ToolMargin[] {
  const tools: FinanceToolKey[] = ['LIVO', 'PMA', 'TRANSPORT', 'AUTRE']

  return tools.map((tool) => {
    const toolRevenues = revenues.filter((revenue) => revenue.tool === tool && revenue.status !== 'RESILIE')
    const toolExpenses = expenses.filter((expense) => expense.relatedTool === tool && expense.status !== 'ARRETE')
    const revenue = toolRevenues.reduce((sum, item) => sum + normalizeMonthly(item.amountHT, item.frequency), 0)
    const expense = toolExpenses.reduce((sum, item) => sum + normalizeMonthly(item.amountHT, item.frequency), 0)
    const customers = new Set(toolRevenues.map((item) => `${item.clientCompany ?? ''}:${item.clientName}`)).size

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
    maximumFractionDigits: 0,
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
  return date.getFullYear() === now().getFullYear()
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

function mockRevenues(): RevenueSubscriptionView[] {
  const today = now()

  return [
    {
      id: 'mock-livo-carmath',
      clientName: 'Mathieu Joseph',
      clientCompany: 'CAR MATH',
      tool: 'LIVO',
      planName: 'Livo Atelier',
      amountHT: 89,
      vatAmount: 17.8,
      amountTTC: 106.8,
      frequency: 'MENSUEL',
      status: 'ACTIF',
      trialStartAt: null,
      trialEndAt: null,
      startDate: today,
      nextInvoiceAt: addDays(today, 28),
      nextPaymentAt: addDays(today, 30),
      gocardlessCustomerId: null,
      gocardlessMandateId: null,
      gocardlessSubscriptionId: null,
      sageCustomerId: null,
    },
    {
      id: 'mock-pma-demo',
      clientName: 'Jean Dupont',
      clientCompany: 'PMA Demo',
      tool: 'PMA',
      planName: 'Portail distributeur',
      amountHT: 149,
      vatAmount: 29.8,
      amountTTC: 178.8,
      frequency: 'MENSUEL',
      status: 'ESSAI',
      trialStartAt: addDays(today, -8),
      trialEndAt: addDays(today, 22),
      startDate: today,
      nextInvoiceAt: addDays(today, 22),
      nextPaymentAt: addDays(today, 23),
      gocardlessCustomerId: null,
      gocardlessMandateId: null,
      gocardlessSubscriptionId: null,
      sageCustomerId: null,
    },
  ]
}

function mockExpenses(): ExpenseView[] {
  const today = now()

  return [
    {
      id: 'mock-vercel',
      name: 'Vercel Pro',
      provider: 'Vercel',
      category: 'HEBERGEMENT',
      relatedTool: 'GLOBAL',
      amountHT: 20,
      vatAmount: 4,
      amountTTC: 24,
      frequency: 'MENSUEL',
      startDate: today,
      renewalDate: addDays(today, 30),
      paymentMethod: 'Carte bancaire',
      status: 'ACTIF',
      notes: 'Hebergement projets LYSMA',
    },
    {
      id: 'mock-openai',
      name: 'API IA',
      provider: 'OpenAI',
      category: 'IA',
      relatedTool: 'GLOBAL',
      amountHT: 60,
      vatAmount: 12,
      amountTTC: 72,
      frequency: 'MENSUEL',
      startDate: today,
      renewalDate: addDays(today, 30),
      paymentMethod: 'Carte bancaire',
      status: 'A_VERIFIER',
      notes: 'Budget variable selon usage',
    },
    {
      id: 'mock-ovh',
      name: 'Domaines et DNS',
      provider: 'OVH',
      category: 'DOMAINE',
      relatedTool: 'GLOBAL',
      amountHT: 72,
      vatAmount: 14.4,
      amountTTC: 86.4,
      frequency: 'ANNUEL',
      startDate: today,
      renewalDate: addDays(today, 300),
      paymentMethod: 'Carte bancaire',
      status: 'ACTIF',
      notes: 'Domaines LYSMA et clients',
    },
  ]
}
