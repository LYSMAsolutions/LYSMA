export type UUID = string;

export type CatalogueType =
  | "supplier"
  | "promo"
  | "operation"
  | "internal"
  | "outillage"
  | "materiel";

export type CatalogueItemFamily =
  | "fournisseur"
  | "promo"
  | "operation_commerciale"
  | "interne"
  | "outillage"
  | "materiel";

export interface Catalogue {
  id: UUID;
  distributor_id: UUID;
  supplier_id: UUID | null;
  code: string;
  name: string;
  catalogue_type: CatalogueType;
  description: string | null;
  is_active: boolean;
  valid_from: string | null;
  valid_to: string | null;
  created_at: string;
  updated_at: string;
}

export interface CatalogueItem {
  id: UUID;
  distributor_id: UUID;
  catalogue_id: UUID | null;
  supplier_id: UUID | null;
  internal_code: string | null;
  supplier_reference: string | null;
  billing_code: string | null;
  designation: string;
  description: string | null;
  item_family: CatalogueItemFamily;
  brand: string | null;
  unit_price_ht: number | null;
  unit_price_ttc: number | null;
  vat_rate: number | null;
  currency: string;
  stock_quantity: number | null;
  is_active: boolean;
  is_featured: boolean;
  searchable_text: string | null;
  created_at: string;
  updated_at: string;
}

export interface CatalogueFilters {
  search?: string;
  catalogue_type?: CatalogueType | "all";
  is_active?: boolean | "all";
  valid_on?: string;
  page?: number;
  page_size?: number;
}

export interface CatalogueItemFilters {
  search?: string;
  catalogue_id?: UUID;
  supplier_id?: UUID;
  item_family?: CatalogueItemFamily | "all";
  is_active?: boolean | "all";
  is_featured?: boolean | "all";
  page?: number;
  page_size?: number;
}

export interface CreateCatalogueInput {
  distributor_id: UUID;
  code: string;
  name: string;
  catalogue_type: CatalogueType;
  supplier_id?: UUID | null;
  description?: string | null;
  is_active?: boolean;
  valid_from?: string | null;
  valid_to?: string | null;
}

export interface UpdateCatalogueInput {
  code?: string;
  name?: string;
  catalogue_type?: CatalogueType;
  supplier_id?: UUID | null;
  description?: string | null;
  is_active?: boolean;
  valid_from?: string | null;
  valid_to?: string | null;
}

export interface CreateCatalogueItemInput {
  distributor_id: UUID;
  catalogue_id?: UUID | null;
  supplier_id?: UUID | null;
  internal_code?: string | null;
  supplier_reference?: string | null;
  billing_code?: string | null;
  designation: string;
  description?: string | null;
  item_family: CatalogueItemFamily;
  brand?: string | null;
  unit_price_ht?: number | null;
  unit_price_ttc?: number | null;
  vat_rate?: number | null;
  currency?: string;
  stock_quantity?: number | null;
  is_active?: boolean;
  is_featured?: boolean;
  searchable_text?: string | null;
}