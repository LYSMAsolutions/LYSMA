export type UUID = string;

export interface Client {
  id: UUID;
  distributor_id: UUID;
  assigned_user_id: UUID | null;
  store_id: UUID | null;
  code: string | null;
  name: string;
  email: string | null;
  phone: string | null;
  address_line_1: string | null;
  postal_code: string | null;
  city: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  billing_name: string | null;
  created_import_batch_id: UUID | null;
  representative_name: string | null;
}

export interface ClientListItem extends Client {
  assigned_user_name?: string | null;
  store_name?: string | null;
}

export interface ClientFilters {
  search?: string;
  assigned_user_id?: UUID;
  store_id?: UUID;
  is_active?: boolean | "all";
  page?: number;
  page_size?: number;
}

export interface CreateClientInput {
  distributor_id: UUID;
  name: string;
  assigned_user_id?: UUID | null;
  store_id?: UUID | null;
  code?: string | null;
  email?: string | null;
  phone?: string | null;
  address_line_1?: string | null;
  postal_code?: string | null;
  city?: string | null;
  billing_name?: string | null;
  representative_name?: string | null;
  is_active?: boolean;
}

export interface UpdateClientInput {
  name?: string;
  assigned_user_id?: UUID | null;
  store_id?: UUID | null;
  code?: string | null;
  email?: string | null;
  phone?: string | null;
  address_line_1?: string | null;
  postal_code?: string | null;
  city?: string | null;
  billing_name?: string | null;
  representative_name?: string | null;
  is_active?: boolean;
}