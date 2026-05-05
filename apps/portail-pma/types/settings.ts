export type UUID = string;

export type DistributorStatus = "setup_pending" | "active" | "inactive";

export interface Distributor {
  id: UUID;
  name: string;
  legal_name: string | null;
  siret: string | null;
  vat_number: string | null;
  email: string | null;
  phone: string | null;
  status: DistributorStatus;
  created_at: string;
  updated_at: string;
  slug: string;
}

export interface DistributorSettings {
  id: UUID;
  distributor_id: UUID;
  company_display_name: string | null;
  support_email: string | null;
  support_phone: string | null;
  alerts_configured: boolean;
  legal_documents_configured: boolean;
  created_at: string;
  updated_at: string;
}

export interface UpdateDistributorSettingsInput {
  company_display_name?: string | null;
  support_email?: string | null;
  support_phone?: string | null;
  alerts_configured?: boolean;
  legal_documents_configured?: boolean;
}