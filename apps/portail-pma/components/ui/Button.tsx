"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: ButtonVariant;
};

function getVariantClass(variant: ButtonVariant) {
  switch (variant) {
    case "secondary":
      return "btn-secondary";
    case "ghost":
      return "btn-ghost";
    case "danger":
      return "inline-flex items-center justify-center rounded-2xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60";
    default:
      return "btn-primary";
  }
}

export default function Button({
  children,
  variant = "primary",
  className = "",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`${getVariantClass(variant)} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
}