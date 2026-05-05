export type UUID = string;

export type AlertType = "non_pris_en_charge" | "retard" | "anomalie";

export type NotificationChannel = "in_app" | "email" | "sms";

export type NotificationType =
  | "alert"
  | "anomaly"
  | "bon_status"
  | "system"
  | "legal"
  | "setup"
  | "reminder";

export type NotificationStatus =
  | "pending"
  | "sent"
  | "read"
  | "failed"
  | "cancelled";

export interface AlertRule {
  id: UUID;
  distributor_id: UUID;
  alert_type: AlertType;
  name: string;
  is_active: boolean;
  initial_delay_minutes: number;
  repeat_every_minutes: number | null;
  max_repeats: number;
  send_to_cdv: boolean;
  send_to_atc: boolean;
  send_to_store: boolean;
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: UUID;
  distributor_id: UUID;
  template_id: UUID | null;
  notification_type: NotificationType;
  channel: NotificationChannel;
  entity_type: string | null;
  entity_id: UUID | null;
  title: string;
  body: string;
  payload: Record<string, unknown> | null;
  status: NotificationStatus;
  scheduled_at: string | null;
  sent_at: string | null;
  failed_at: string | null;
  cancelled_at: string | null;
  failure_reason: string | null;
  created_at: string;
  updated_at: string;
}

export interface AlertFilters {
  search?: string;
  alert_type?: AlertType | "all";
  is_active?: boolean | "all";
  page?: number;
  page_size?: number;
}

export interface NotificationFilters {
  search?: string;
  status?: NotificationStatus | "all";
  notification_type?: NotificationType | "all";
  channel?: NotificationChannel | "all";
  page?: number;
  page_size?: number;
}