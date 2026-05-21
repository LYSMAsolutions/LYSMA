import type { ReactNode } from "react";
import Link from "next/link";
import AdminBreadcrumb from "@/components/admin/layout/AdminBreadcrumb";
import AdminPageHeader from "@/components/admin/layout/AdminPageHeader";

type KpiTone = "blue" | "neutral" | "yellow" | "green" | "red";

type KpiItem = {
  title: string;
  value: string | number;
  note?: string;
  href?: string;
  tone?: KpiTone;
};

type AdminModulePageProps = {
  badge?: string;
  title: string;
  description?: string;
  backHref?: string;
  backLabel?: string;
  breadcrumbs?: Array<{ label: string; href?: string }>;
  kpis?: KpiItem[];
  actions?: ReactNode;
  children: ReactNode;
};

const toneStyles: Record<KpiTone, { border: string; bg: string; numColor: string }> = {
  blue:    { border: "#bfdbfe", bg: "linear-gradient(135deg,#eff6ff,#ffffff)", numColor: "#1d4ed8" },
  yellow:  { border: "#fde68a", bg: "linear-gradient(135deg,#fffbeb,#ffffff)", numColor: "#b45309" },
  green:   { border: "#bbf7d0", bg: "linear-gradient(135deg,#f0fdf4,#ffffff)", numColor: "#15803d" },
  red:     { border: "#fecaca", bg: "linear-gradient(135deg,#fef2f2,#ffffff)", numColor: "#dc2626" },
  neutral: { border: "#e2e8f0", bg: "linear-gradient(135deg,#f8fafc,#ffffff)", numColor: "#334155" },
};

function KpiCard({ item }: { item: KpiItem }) {
  const tone = item.tone ?? "blue";
  const s = toneStyles[tone];

  const inner = (
    <div style={{
      height: "100%",
      borderRadius: "1.5rem",
      padding: "1.5rem",
      border: `1px solid ${s.border}`,
      background: s.bg,
      boxShadow: "0 4px 16px rgba(15,23,42,0.05)",
      transition: "transform 0.18s ease, box-shadow 0.18s ease",
    }}>
      <p style={{ margin: 0, fontSize: "0.78rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em" }}>
        {item.title}
      </p>
      <p style={{ margin: "0.75rem 0 0", fontSize: "2.4rem", fontWeight: 800, color: s.numColor, lineHeight: 1, letterSpacing: "-0.03em" }}>
        {item.value}
      </p>
      {item.note && (
        <p style={{ margin: "0.5rem 0 0", fontSize: "0.82rem", color: "#94a3b8" }}>
          {item.note}
        </p>
      )}
    </div>
  );

  if (item.href) {
    return (
      <Link href={item.href} style={{ display: "block", textDecoration: "none" }}>
        {inner}
      </Link>
    );
  }
  return inner;
}

export default function AdminModulePage({
  badge,
  title,
  description,
  backHref,
  backLabel,
  breadcrumbs,
  kpis,
  actions,
  children,
}: AdminModulePageProps) {
  const cols = kpis?.length ?? 4;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
      <AdminBreadcrumb items={breadcrumbs} backHref={backHref} backLabel={backLabel} />
      <AdminPageHeader badge={badge} title={title} description={description} actions={actions} />

      {kpis?.length ? (
        <section style={{
          display: "grid",
          gap: "1rem",
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
        }}>
          {kpis.map((item: any) => (
            <KpiCard key={`${item.title}-${item.value}`} item={item} />
          ))}
        </section>
      ) : null}

      {children}
    </div>
  );
}