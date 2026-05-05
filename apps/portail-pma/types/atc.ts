import type { ClientFilters, ClientListItem } from "./clients";
import type { BonFilters, BonListItem } from "./bons";
import type { UserListItem } from "./users";

export interface AtcDashboardStats {
  total_clients: number;
  total_bons: number;
  bons_envoyes: number;
  bons_en_cours: number;
  bons_traites: number;
  bons_en_retard: number;
}

export interface AtcClientListResponse {
  items: ClientListItem[];
  total: number;
  filters: ClientFilters;
}

export interface AtcBonListResponse {
  items: BonListItem[];
  total: number;
  filters: BonFilters;
}

export interface AtcProfile extends UserListItem {
  assigned_clients_count?: number;
  bons_count?: number;
}