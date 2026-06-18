import type { HTMLAttributes, ReactNode } from "react";
import { cx } from "../utils";

type CardLysmaProps = HTMLAttributes<HTMLElement> & {
  as?: "article" | "section" | "div";
  variant?: "surface" | "elevated" | "outlined" | "ghost";
  padding?: "none" | "sm" | "md" | "lg";
  interactive?: boolean;
  eyebrow?: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
};

export function CardLysma({
  as: Component = "article",
  variant = "surface",
  padding = "md",
  interactive = false,
  eyebrow,
  title,
  description,
  action,
  className,
  children,
  ...props
}: CardLysmaProps) {
  return (
    <Component
      className={cx(
        "lysma-card",
        `lysma-card--${variant}`,
        `lysma-card--pad-${padding}`,
        interactive && "lysma-card--interactive",
        className
      )}
      {...props}
    >
      {eyebrow || title || description || action ? (
        <header className="lysma-card__header">
          <div>
            {eyebrow ? <p className="lysma-eyebrow">{eyebrow}</p> : null}
            {title ? <h3 className="lysma-card__title">{title}</h3> : null}
            {description ? <p className="lysma-card__description">{description}</p> : null}
          </div>
          {action ? <div className="lysma-card__action">{action}</div> : null}
        </header>
      ) : null}
      {children ? <div className="lysma-card__body">{children}</div> : null}
    </Component>
  );
}
