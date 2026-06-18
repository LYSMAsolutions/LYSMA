import type { ReactNode } from "react";

export type LysmaTone = "blue" | "orange" | "green" | "neutral";

export type LysmaAction = {
  label: string;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost";
  icon?: ReactNode;
};

export type LysmaBrand = {
  name: string;
  subtitle?: string;
  logo?: ReactNode;
  href?: string;
};

export type LysmaNavItem = {
  label: string;
  href: string;
  description?: string;
  icon?: ReactNode;
  badge?: ReactNode;
  match?: "exact" | "prefix";
};

export type LysmaMetric = {
  label: string;
  value: string;
  detail?: string;
};
