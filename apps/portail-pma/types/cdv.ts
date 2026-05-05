import type { ClientListItem } from "./clients";
import type { UserListItem } from "./users";

export interface CdvDashboardStats {
  total_atc: number;
  total_clients: number;
  total_bons: number;
  bons_a_traiter: number;
  bons_en_retard: number;
}

export interface CdvAtcListItem extends UserListItem {
  clients_count?: number;
  bons_count?: number;
}

export interface CdvEquipeMember extends UserListItem {
  clients_count?: number;
}

export interface CdvClientListResponse {
  items: ClientListItem[];
  total: number;
}

export interface CdvAtcListResponse {
  items: CdvAtcListItem[];
  total: number;
}