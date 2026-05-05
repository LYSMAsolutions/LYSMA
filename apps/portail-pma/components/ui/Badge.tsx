import type { HTMLAttributes, ReactNode } from "react";

type BadgeVariant =
  | "default"
  | "success"
  | "warning"
  | "danger"
  | "neutral";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  children: ReactNode;
  variant?: BadgeVariant;
};

function getVariantClass(variant: BadgeVariant) {
  switch (variant) {
    case "success":
      return "status-success";
    case "warning":
      return "status-warning";
    case "danger":
      return "status-danger";
    case "neutral":
      return "status-neutral";
    default:
      return "inline-flex items-center rounded-full border border-[var(--border)] bg-white/70 px-2.5 py-1 text-xs font-medium text-[var(--text)]";
  }
}

export default function Badge({
  children,
  variant = "default",
  className = "",
  ...props
}: BadgeProps) {
  return (
    <span className={`${getVariantClass(variant)} ${className}`.trim()} {...props}>
      {children}
    </span>
  );
}