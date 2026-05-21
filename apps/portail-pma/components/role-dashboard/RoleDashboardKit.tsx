import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowRight, ChevronRight } from "lucide-react";

type Tone = "warning" | "info" | "success" | "default" | "danger";

const toneClasses: Record<Tone, { wrap: string; icon: string }> = {
  warning: {
    wrap: "bg-[linear-gradient(135deg,#FFF7ED,#FFFFFF)] border-[#FED7AA]",
    icon: "bg-[#FFF1E6] text-[#C2410C]",
  },
  info: {
    wrap: "bg-[linear-gradient(135deg,#EFF6FF,#FFFFFF)] border-[#BFDBFE]",
    icon: "bg-[#E8F1FB] text-[#0A4D9B]",
  },
  success: {
    wrap: "bg-[linear-gradient(135deg,#ECFDF5,#FFFFFF)] border-[#BBF7D0]",
    icon: "bg-[#EAFBF2] text-[#15803D]",
  },
  danger: {
    wrap: "bg-[linear-gradient(135deg,#FEF2F2,#FFFFFF)] border-[#FECACA]",
    icon: "bg-[#FEE2E2] text-[#B91C1C]",
  },
  default: {
    wrap: "bg-[linear-gradient(135deg,#F8FAFC,#FFFFFF)] border-[#E2E8F0]",
    icon: "bg-[#EEF3F9] text-[#334155]",
  },
};

export function RoleHero({
  eyebrow,
  title,
  description,
  primary,
  secondary,
}: {
  eyebrow: string;
  title: string;
  description: string;
  primary?: { href: string; label: string };
  secondary?: { href: string; label: string };
}) {
  return (
    <section className="glass-panel relative overflow-hidden rounded-[2rem] p-8 md:p-12">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-20 left-[-40px] h-56 w-56 rounded-full bg-[#1E73D8]/10 blur-3xl" />
        <div className="absolute bottom-[-70px] right-[-30px] h-64 w-64 rounded-full bg-[#0A4D9B]/10 blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col justify-between gap-8 xl:flex-row xl:items-start">
        <div className="max-w-4xl">
          <h1 className="text-3xl font-semibold tracking-tight text-[#0A4D9B] md:text-4xl">
            <span className="block text-sm font-semibold tracking-[0.18em] text-[#6B7280] uppercase">
              {eyebrow}
            </span>
            <span className="mt-2 block">{title}</span>
          </h1>

          <p className="mt-4 max-w-3xl text-[15px] leading-8 text-[#6B7280] md:text-base">
            {description}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {primary ? (
            <Link href={primary.href} className="btn-primary px-5">
              {primary.label}
            </Link>
          ) : null}

          {secondary ? (
            <Link href={secondary.href} className="btn-secondary">
              {secondary.label}
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
}

export function RoleKpiGrid({
  items,
}: {
  items: Array<{
    title: string;
    value: number | string;
    subtitle: string;
    href: string;
    icon: LucideIcon;
    tone?: Tone;
  }>;
}) {
  return (
    <section className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-5">
      {items.map((item) => {
        const Icon = item.icon;
        const tone = toneClasses[item.tone ?? "default"];

        return (
          <Link
            key={item.title}
            href={item.href}
            className={`group rounded-[2rem] border p-6 transition hover:-translate-y-[1px] hover:shadow-[0_18px_40px_rgba(10,77,155,0.10)] ${tone.wrap}`}
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium text-[#6B7280]">{item.title}</p>
              <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${tone.icon}`}>
                <Icon className="h-4 w-4" />
              </div>
            </div>

            <p className="mt-4 text-4xl font-semibold tracking-tight text-[#0F172A]">
              {item.value}
            </p>

            <p className="mt-2 text-sm leading-6 text-[#6B7280]">{item.subtitle}</p>
          </Link>
        );
      })}
    </section>
  );
}

export function QuickActions({
  title = "Acces rapides",
  items,
}: {
  title?: string;
  items: Array<{ title: string; description: string; href: string; icon: LucideIcon }>;
}) {
  return (
    <div className="card-lysma p-8">
      <h3 className="text-xl font-semibold text-[#0F172A]">{title}</h3>

      <div className="mt-6 space-y-4">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.title}
              href={item.href}
              className="group flex items-start justify-between gap-4 rounded-2xl border border-[#E2E8F0] bg-[#F8FBFF] px-5 py-4 transition hover:border-[#C9D8EB] hover:bg-white"
            >
              <div className="flex gap-3">
                <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#E8F1FB]">
                  <Icon className="h-4 w-4 text-[#0A4D9B]" />
                </div>
                <div>
                  <p className="font-medium text-[#0F172A]">{item.title}</p>
                  <p className="mt-1 text-sm leading-6 text-[#6B7280]">{item.description}</p>
                </div>
              </div>

              <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-[#0A4D9B] transition group-hover:translate-x-0.5" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export function PriorityPanel({
  title,
  subtitle,
  icon: PanelIcon,
  items,
}: {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  items: Array<{ title: string; value: number | string; hint: string; href: string; icon: LucideIcon }>;
}) {
  return (
    <div className="card-lysma p-8">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#FFF1E6]">
          <PanelIcon className="h-5 w-5 text-[#C2410C]" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-[#0F172A]">{title}</h3>
          <p className="text-sm text-[#6B7280]">{subtitle}</p>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.title}
              href={item.href}
              className="group flex items-start gap-4 rounded-2xl border border-[#E2E8F0] bg-[#F8FBFF] p-5 transition hover:border-[#C9D8EB] hover:bg-white"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white shadow-[0_8px_20px_rgba(10,77,155,0.06)]">
                <Icon className="h-5 w-5 text-[#0A4D9B]" />
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between gap-4">
                  <p className="font-medium text-[#0F172A]">{item.title}</p>
                  <span className="text-2xl font-semibold text-[#0A4D9B]">{item.value}</span>
                </div>
                <p className="mt-2 text-sm leading-6 text-[#6B7280]">{item.hint}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export function RecentCard({
  title,
  href,
  empty,
  children,
}: {
  title: string;
  href: string;
  empty?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="card-lysma p-8">
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-xl font-semibold text-[#0F172A]">{title}</h3>
        <Link
          href={href}
          className="inline-flex items-center gap-2 text-sm font-medium text-[#0A4D9B] transition hover:opacity-80"
        >
          Voir tout
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="mt-6 space-y-4">
        {empty ? <p className="text-sm text-[#6B7280]">Aucune donnee trouvee.</p> : children}
      </div>
    </div>
  );
}
