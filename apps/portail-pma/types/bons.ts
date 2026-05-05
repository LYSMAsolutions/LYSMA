export type UUID = string;

export type BonType =
  | "commande_devis"
  | "retour"
  | "sav"
  | "intervention"
  | "devis_materiel"
  | "transformation_devis"
  | "garantie"
  | "contrat_maintenance";

export type BonStatus =
  | "frigo"
  | "envoye"
  | "non_pris_en_charge"
  | "pris_en_charge"
  | "en_cours"
  | "attente_fournisseur"
  | "attente_client"
  | "traite"
  | "refuse"
  | "a_corriger";

export type BonPriority = "basse" | "normale" | "haute" | "urgente" | null;

export type BonCommentType =
  | "internal"
  | "note"
  | "correction_request"
  | "status_note"
  | "system";

export type BonCommentVisibility =
  | "internal"
  | "admin_cdv_only"
  | "store_only";

export type BonPhotoType =
  | "general"
  | "sav"
  | "intervention"
  | "garantie"
  | "retour"
  | "vehicule"
  | "piece"
  | "anomalie";

export type BonAnomalyStatus =
  | "open"
  | "in_progress"
  | "resolved"
  | "ignored";

export type BonAnomalySeverity = "low" | "medium" | "high" | "critical";

export type DocumentType =
  | "bon_pdf"
  | "bon_signed_pdf"
  | "client_attachment"
  | "sav_attachment"
  | "intervention_report"
  | "export_csv"
  | "catalogue_pdf"
  | "other";

export type DocumentStatus =
  | "draft"
  | "generated"
  | "signed"
  | "archived"
  | "cancelled";

export interface Bon {
  id: UUID;
  distributor_id: UUID;
  client_id: UUID;
  created_by_user_id: UUID;
  assigned_store_id: UUID | null;
  taken_by_staff_id: UUID | null;
  bon_number: string;
  bon_type: BonType;
  status: BonStatus;
  title: string | null;
  comment: string | null;
  refusal_reason: string | null;
  correction_reason: string | null;
  sent_at: string | null;
  taken_at: string | null;
  started_at: string | null;
  completed_at: string | null;
  refused_at: string | null;
  corrected_at: string | null;
  created_at: string;
  updated_at: string;
  priority: BonPriority;
  due_at: string | null;
}

export interface BonListItem extends Bon {
  client_name?: string | null;
  store_name?: string | null;
  created_by_name?: string | null;
  taken_by_name?: string | null;
}

export interface BonComment {
  id: UUID;
  bon_id: UUID;
  parent_comment_id: UUID | null;
  author_user_id: UUID | null;
  author_store_staff_id: UUID | null;
  comment_type: BonCommentType;
  visibility: BonCommentVisibility;
  content: string;
  is_edited: boolean;
  edited_at: string | null;
  is_deleted: boolean;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface BonPhoto {
  id: UUID;
  bon_id: UUID;
  bon_vehicle_id: UUID | null;
  file_name: string;
  original_name: string | null;
  mime_type: string | null;
  file_size_bytes: number | null;
  storage_provider: string;
  storage_path: string;
  public_url: string | null;
  uploaded_by_user_id: UUID | null;
  uploaded_by_staff_id: UUID | null;
  photo_type: BonPhotoType;
  caption: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface BonAnomaly {
  id: UUID;
  bon_id: UUID;
  anomaly_type_id: UUID;
  detected_by_user_id: UUID | null;
  detected_by_staff_id: UUID | null;
  status: BonAnomalyStatus;
  severity: BonAnomalySeverity;
  description: string | null;
  resolution_note: string | null;
  detected_at: string;
  resolved_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface BonDocument {
  id: UUID;
  distributor_id: UUID;
  bon_id: UUID | null;
  client_id: UUID | null;
  document_type: DocumentType;
  document_status: DocumentStatus;
  title: string;
  description: string | null;
  current_version_id: UUID | null;
  generated_by_user_id: UUID | null;
  generated_by_staff_id: UUID | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface BonFilters {
  search?: string;
  status?: BonStatus | "all";
  bon_type?: BonType | "all";
  priority?: NonNullable<BonPriority> | "all";
  client_id?: UUID;
  assigned_store_id?: UUID;
  created_by_user_id?: UUID;
  taken_by_staff_id?: UUID;
  due_before?: string;
  due_after?: string;
  page?: number;
  page_size?: number;
}

export interface CreateBonInput {
  distributor_id: UUID;
  client_id: UUID;
  created_by_user_id: UUID;
  bon_number: string;
  bon_type: BonType;
  title?: string | null;
  comment?: string | null;
  priority?: BonPriority;
  assigned_store_id?: UUID | null;
  due_at?: string | null;
}

export interface UpdateBonStatusInput {
  bonId: UUID;
  nextStatus: BonStatus;
  actorUserId?: UUID;
  actorStoreStaffId?: UUID;
  note?: string | null;
  reason?: string | null;
}

export interface CreateBonCommentInput {
  bon_id: UUID;
  parent_comment_id?: UUID | null;
  author_user_id?: UUID | null;
  author_store_staff_id?: UUID | null;
  comment_type?: BonCommentType;
  visibility?: BonCommentVisibility;
  content: string;
}

export interface CreateBonPhotoInput {
  bon_id: UUID;
  bon_vehicle_id?: UUID | null;
  file_name: string;
  original_name?: string | null;
  mime_type?: string | null;
  file_size_bytes?: number | null;
  storage_provider?: string;
  storage_path: string;
  public_url?: string | null;
  uploaded_by_user_id?: UUID | null;
  uploaded_by_staff_id?: UUID | null;
  photo_type?: BonPhotoType;
  caption?: string | null;
  sort_order?: number;
}

export interface CreateBonAnomalyInput {
  bon_id: UUID;
  anomaly_type_id: UUID;
  detected_by_user_id?: UUID | null;
  detected_by_staff_id?: UUID | null;
  severity: BonAnomalySeverity;
  description?: string | null;
}

export interface CreateBonDocumentInput {
  distributor_id: UUID;
  bon_id?: UUID | null;
  client_id?: UUID | null;
  document_type: DocumentType;
  title: string;
  description?: string | null;
  generated_by_user_id?: UUID | null;
  generated_by_staff_id?: UUID | null;
}