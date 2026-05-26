import { z } from 'zod'

export const showcaseSiteSchema = z.object({
  siteName: z.string().min(1),
  clientName: z.string().min(1),
  clientCompany: z.string().optional(),
  publicLabel: z.string().min(1).default('Abonnement LYSMA - maintenance site vitrine'),
  creationStandardPriceHT: z.coerce.number().min(0),
  creationSoldHT: z.coerce.number().min(0),
  creationStatus: z.enum(['CREATION_FACTUREE', 'CREATION_OFFERTE']),
  maintenanceMonthlyHT: z.coerce.number().min(0),
  maintenanceStatus: z.enum(['ABONNEMENT_ACTIF', 'MAINTENANCE_OFFERTE', 'MAINTENANCE_PAYANTE']),
  domainCostHT: z.coerce.number().min(0),
  workspaceCostHT: z.coerce.number().min(0),
  otherMonthlyCostsHT: z.coerce.number().min(0),
  internalNotes: z.string().optional(),
  sageCustomerId: z.string().optional(),
  officialInvoiceNumber: z.string().optional(),
  officialPdfUrl: z.string().optional(),
  electronicInvoiceStatus: z.enum(['NON_CONCERNE', 'A_PREPARER', 'EN_ATTENTE', 'TRANSMISE', 'REJETEE', 'ACCEPTEE']),
  platformProvider: z.string().optional(),
  platformInvoiceId: z.string().optional(),
  paymentStatus: z.enum(['EN_ATTENTE', 'PAYE', 'ECHOUE', 'REMBOURSE', 'ANNULE']),
})

export type ShowcaseSiteInput = z.infer<typeof showcaseSiteSchema>

export function normalizeShowcaseSiteInput(data: ShowcaseSiteInput) {
  return {
    ...data,
    clientCompany: data.clientCompany || null,
    internalNotes: data.internalNotes || null,
    sageCustomerId: data.sageCustomerId || null,
    officialInvoiceNumber: data.officialInvoiceNumber || null,
    officialPdfUrl: data.officialPdfUrl || null,
    platformProvider: data.platformProvider || null,
    platformInvoiceId: data.platformInvoiceId || null,
  }
}
