import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";

const buttonClass = (variant: Variant) => `lysma-ui-button lysma-ui-button-${variant}`;
export const buttonClassName = (variant: Variant = "primary") => `lysma-btn lysma-btn-${variant}`;

export function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode; variant?: Variant }) {
  return (
    <button className={`${buttonClassName(variant)} ${className}`.trim()} {...props}>
      {children}
    </button>
  );
}

export function ButtonLink({
  children,
  variant = "primary",
  className = "",
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & { children: ReactNode; variant?: Variant }) {
  return (
    <a className={`${buttonClassName(variant)} ${className}`.trim()} {...props}>
      {children}
    </a>
  );
}

export function UiButton({
  children,
  variant = "primary",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode; variant?: Variant }) {
  return (
    <button className={`${buttonClass(variant)} ${className}`.trim()} {...props}>
      {children}
    </button>
  );
}

export function UiButtonLink({
  children,
  variant = "primary",
  className = "",
  href,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & { children: ReactNode; variant?: Variant; href: string }) {
  const isInternal = href.startsWith("/");

  if (isInternal) {
    return (
      <Link className={`${buttonClass(variant)} ${className}`.trim()} href={href} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <a className={`${buttonClass(variant)} ${className}`.trim()} href={href} {...props}>
      {children}
    </a>
  );
}
