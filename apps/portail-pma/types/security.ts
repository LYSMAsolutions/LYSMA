export type UUID = string;

export type SessionActorType = "user" | "store_account" | "store_staff";
export type ResetType = "password" | "pin";

export interface AuthSession {
  id: UUID;
  distributor_id: UUID | null;
  user_id: UUID | null;
  store_account_id: UUID | null;
  store_staff_id: UUID | null;
  session_token_hash: string;
  refresh_token_hash: string | null;
  actor_type: SessionActorType;
  is_active: boolean;
  ip_address: string | null;
  user_agent: string | null;
  expires_at: string;
  last_seen_at: string | null;
  revoked_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface AuthResetToken {
  id: UUID;
  distributor_id: UUID | null;
  user_id: UUID | null;
  store_account_id: UUID | null;
  store_staff_id: UUID | null;
  token_hash: string;
  reset_type: ResetType;
  is_used: boolean;
  expires_at: string;
  used_at: string | null;
  created_at: string;
}

export interface SecuritySessionFilters {
  actor_type?: SessionActorType | "all";
  is_active?: boolean | "all";
  page?: number;
  page_size?: number;
}

export interface CreateResetTokenInput {
  distributor_id?: UUID | null;
  user_id?: UUID | null;
  store_account_id?: UUID | null;
  store_staff_id?: UUID | null;
  token_hash: string;
  reset_type: ResetType;
  expires_at: string;
}