import type { ReactNode } from "react";

type EmptyStateProps = {
  title: string;
  description?: string;
  action?: ReactNode;
};

export default function EmptyState({
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="card-lysma px-8 py-12 text-center">
      <h3 className="section-title text-xl">{title}</h3>
      {description ? (
        <p className="section-copy mx-auto mt-3 max-w-2xl">{description}</p>
      ) : null}
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}