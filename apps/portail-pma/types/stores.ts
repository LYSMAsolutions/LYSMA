export type UUID = string;

export interface Store {
  id: UUID;
  distributor_id: UUID;
  code: string;
  name: string;
  email: string | null;
  phone: string | null;
  address_line_1: string | null;
  address_line_2: string | null;
  postal_code: string | null;
  city: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface StoreAccount {
  id: UUID;
  store_id: UUID;
  login_email: string;
  password_hash: string;
  is_active: boolean;
  last_login_at: string | null;
  created_at: string;
  updated_at: string;
  failed_login_attempts: number;
  locked_until: string | null;
  password_updated_at: string | null;
  must_change_password: boolean;
}

export interface StoreStaff {
  id: UUID;
  store_id: UUID;
  first_name: string;
  last_name: string;
  initials: string;
  pin_hash: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  failed_pin_attempts: number;
  locked_until: string | null;
  pin_updated_at: string | null;
  must_change_pin: boolean;
}

export interface StoreListItem extends Store {
  account_email?: string | null;
  staff_count?: number;
}

export interface StoreFilters {
  search?: string;
  is_active?: boolean | "all";
  city?: string;
  page?: number;
  page_size?: number;
}

export interface CreateStoreInput {
  distributor_id: UUID;
  code: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  address_line_1?: string | null;
  address_line_2?: string | null;
  postal_code?: string | null;
  city?: string | null;
  is_active?: boolean;
}

export interface UpdateStoreInput {
  code?: string;
  name?: string;
  email?: string | null;
  phone?: string | null;
  address_line_1?: string | null;
  address_line_2?: string | null;
  postal_code?: string | null;
  city?: string | null;
  is_active?: boolean;
}

export interface CreateStoreAccountInput {
  store_id: UUID;
  login_email: string;
  password_hash: string;
  is_active?: boolean;
  must_change_password?: boolean;
}

export interface UpdateStoreAccountInput {
  login_email?: string;
  password_hash?: string;
  is_active?: boolean;
  must_change_password?: boolean;
  failed_login_attempts?: number;
  locked_until?: string | null;
}

export interface CreateStoreStaffInput {
  store_id: UUID;
  first_name: string;
  last_name: string;
  initials: string;
  pin_hash: string;
  is_active?: boolean;
  must_change_pin?: boolean;
}

export interface UpdateStoreStaffInput {
  first_name?: string;
  last_name?: string;
  initials?: string;
  pin_hash?: string;
  is_active?: boolean;
  must_change_pin?: boolean;
  failed_pin_attempts?: number;
  locked_until?: string | null;
}