import type { ReactNode } from "react";

type EmptyStateProps = {
  title: string;
  description?: string;
  action?: ReactNode;
  compact?: boolean;
};

export default function EmptyState({
  title,
  description,
  action,
  compact = false,
}: EmptyStateProps) {
  return (
    <div
      className="card-lysma text-center"
      style={{
        padding: compact ? "2rem" : "3rem",
      }}
    >
      <h3
        className="section-title"
        style={{
          fontSize: compact ? "1.1rem" : "1.35rem",
        }}
      >
        {title}
      </h3>

      {description ? (
        <p
          className="section-copy"
          style={{
            marginTop: ".75rem",
            maxWidth: "720px",
            marginInline: "auto",
          }}
        >
          {description}
        </p>
      ) : null}

      {action ? <div style={{ marginTop: "1.25rem" }}>{action}</div> : null}
    </div>
  );
}