import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cx } from "../utils";

type ButtonLysmaProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "outline" | "danger";
  size?: "sm" | "md" | "lg";
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  loading?: boolean;
  fullWidth?: boolean;
};

export function ButtonLysma({
  variant = "primary",
  size = "md",
  icon,
  iconPosition = "left",
  loading = false,
  fullWidth = false,
  className,
  children,
  disabled,
  ...props
}: ButtonLysmaProps) {
  return (
    <button
      className={cx(
        "lysma-button",
        `lysma-button--${variant}`,
        `lysma-button--${size}`,
        fullWidth && "lysma-button--full",
        loading && "is-loading",
        className
      )}
      disabled={disabled || loading}
      aria-busy={loading}
      {...props}
    >
      {loading ? <span className="lysma-button__spinner" aria-hidden="true" /> : null}
      {!loading && icon && iconPosition === "left" ? (
        <span className="lysma-button__icon">{icon}</span>
      ) : null}
      {!loading && children ? <span className="lysma-button__label">{children}</span> : null}
      {!loading && icon && iconPosition === "right" ? (
        <span className="lysma-button__icon">{icon}</span>
      ) : null}
    </button>
  );
}
