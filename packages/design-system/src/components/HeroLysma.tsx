import type { ReactNode } from "react";
import type { LysmaAction, LysmaMetric, LysmaTone } from "../types";
import { cx } from "../utils";

type HeroLysmaProps = {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  actions?: LysmaAction[];
  metrics?: LysmaMetric[];
  media?: ReactNode;
  tone?: LysmaTone;
  compact?: boolean;
  className?: string;
};

export function HeroLysma({
  eyebrow,
  title,
  description,
  actions = [],
  metrics = [],
  media,
  tone = "blue",
  compact = false,
  className,
}: HeroLysmaProps) {
  return (
    <section className={cx("lysma-hero", `lysma-tone-${tone}`, compact && "lysma-hero--compact", className)}>
      <div className="lysma-hero__copy">
        {eyebrow ? <p className="lysma-eyebrow">{eyebrow}</p> : null}
        <h1>{title}</h1>
        {description ? <p className="lysma-hero__lead">{description}</p> : null}
        {actions.length ? (
          <div className="lysma-hero__actions">
            {actions.map((action) =>
              action.href ? (
                <a
                  key={`${action.label}-${action.href}`}
                  className={cx("lysma-button", `lysma-button--${action.variant ?? "primary"}`)}
                  href={action.href}
                >
                  {action.icon ? <span className="lysma-button__icon">{action.icon}</span> : null}
                  <span className="lysma-button__label">{action.label}</span>
                </a>
              ) : (
                <button
                  key={action.label}
                  className={cx("lysma-button", `lysma-button--${action.variant ?? "primary"}`)}
                  type="button"
                  onClick={action.onClick}
                >
                  {action.icon ? <span className="lysma-button__icon">{action.icon}</span> : null}
                  <span className="lysma-button__label">{action.label}</span>
                </button>
              )
            )}
          </div>
        ) : null}
      </div>

      {media || metrics.length ? (
        <aside className="lysma-hero__panel" aria-label="Informations principales">
          {media ? <div className="lysma-hero__media">{media}</div> : null}
          {metrics.length ? (
            <div className="lysma-hero__metrics">
              {metrics.map((metric) => (
                <div key={metric.label} className="lysma-metric">
                  <span>{metric.label}</span>
                  <strong>{metric.value}</strong>
                  {metric.detail ? <small>{metric.detail}</small> : null}
                </div>
              ))}
            </div>
          ) : null}
        </aside>
      ) : null}
    </section>
  );
}
