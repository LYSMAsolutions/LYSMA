import type { HTMLAttributes, ReactNode } from "react";

export function Card({ children, className = "", ...props }: HTMLAttributes<HTMLDivElement> & { children: ReactNode }) {
  return (
    <div className={`lysma-card ${className}`.trim()} {...props}>
      {children}
    </div>
  );
}

export function UiCard({
  children,
  className = "",
  ...props
}: HTMLAttributes<HTMLElement> & { children: ReactNode }) {
  return (
    <article className={`lysma-ui-card ${className}`.trim()} {...props}>
      {children}
    </article>
  );
}
