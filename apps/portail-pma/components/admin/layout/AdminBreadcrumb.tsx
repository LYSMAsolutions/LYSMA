import Link from "next/link";
import { ChevronRight, ArrowLeft } from "lucide-react";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

type AdminBreadcrumbProps = {
  items?: BreadcrumbItem[];
  backHref?: string;
  backLabel?: string;
};

export default function AdminBreadcrumb({
  items = [],
  backHref,
  backLabel = "Retour",
}: AdminBreadcrumbProps) {
  if (!items.length && !backHref) {
    return null;
  }

  return (
    <div className="card-lysma flex flex-wrap items-center justify-between gap-3 px-5 py-4">
      <div className="flex min-w-0 flex-wrap items-center gap-2 text-sm">
        {backHref ? (
          <Link
            href={backHref}
            className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-white/70 px-3 py-1.5 text-[var(--text)] transition hover:bg-white"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>{backLabel}</span>
          </Link>
        ) : null}

        {items.length ? (
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            {items.map((item, index) => {
              const isLast = index === items.length - 1;

              return (
                <div key={`${item.label}-${index}`} className="flex items-center gap-2">
                  {item.href && !isLast ? (
                    <Link
                      href={item.href}
                      className="truncate text-[var(--muted)] transition hover:text-[var(--brand)]"
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <span
                      className={
                        isLast
                          ? "truncate font-medium text-[var(--text)]"
                          : "truncate text-[var(--muted)]"
                      }
                    >
                      {item.label}
                    </span>
                  )}

                  {!isLast ? (
                    <ChevronRight className="h-4 w-4 shrink-0 text-[var(--muted)]" />
                  ) : null}
                </div>
              );
            })}
          </div>
        ) : null}
      </div>
    </div>
  );
}