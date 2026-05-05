import type { ReactNode } from "react";

type AdminPageHeaderProps = {
  badge?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
};

export default function AdminPageHeader({
  badge,
  title,
  description,
  actions,
}: AdminPageHeaderProps) {
  return (
    <section className="glass-panel relative overflow-hidden rounded-[2rem] p-8 md:p-10">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-10 -top-16 h-44 w-44 rounded-full bg-[var(--brand)]/10 blur-3xl" />
        <div className="absolute -bottom-16 right-0 h-52 w-52 rounded-full bg-[var(--brand-2)]/10 blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-4xl">
          {badge ? (
            <div className="inline-flex items-center rounded-full border border-[var(--border)] bg-white/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--brand)]">
              {badge}
            </div>
          ) : null}

          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-[var(--text)] md:text-4xl">
            {title}
          </h1>

          {description ? (
            <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)] md:text-base">
              {description}
            </p>
          ) : null}
        </div>

        {actions ? <div className="shrink-0">{actions}</div> : null}
      </div>
    </section>
  );
}