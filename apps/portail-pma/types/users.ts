export type UUID = string;

export type UserRoleCode =
  | "admin"
  | "cdv"
  | "atc"
  | "rdm"
  | "super_admin"
  | string;

export interface Role {
  id: UUID;
  code: UserRoleCode;
  label: string;
  created_at: string;
}

export interface User {
  id: UUID;
  distributor_id: UUID;
  role_id: UUID;
  first_name: string;
  last_name: string;
  email: string;
  password_hash: string;
  is_active: boolean;
  last_login_at: string | null;
  created_at: string;
  updated_at: string;
  failed_login_attempts: number;
  locked_until: string | null;
  password_updated_at: string | null;
  must_change_password: boolean;
  code: string | null;
  phone: string | null;
}

export interface UserListItem extends User {
  role_code?: UserRoleCode | null;
  role_label?: string | null;
  full_name?: string;
}

export interface UserFilters {
  search?: string;
  role_code?: UserRoleCode | "all";
  is_active?: boolean | "all";
  distributor_id?: UUID;
  page?: number;
  page_size?: number;
}

export interface CreateUserInput {
  distributor_id: UUID;
  role_id: UUID;
  first_name: string;
  last_name: string;
  email: string;
  password_hash: string;
  is_active?: boolean;
  code?: string | null;
  phone?: string | null;
  must_change_password?: boolean;
}

export interface UpdateUserInput {
  first_name?: string;
  last_name?: string;
  email?: string;
  is_active?: boolean;
  code?: string | null;
  phone?: string | null;
  role_id?: UUID;
  password_hash?: string;
  must_change_password?: boolean;
}