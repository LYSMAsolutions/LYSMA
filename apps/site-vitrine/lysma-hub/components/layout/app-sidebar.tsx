"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  CreditCard,
  FileText,
  Home,
  Lightbulb,
  LayoutList,
  LockKeyhole,
  MessageSquareText,
  Monitor,
  ShieldCheck,
  Sparkles,
  Star,
  UserRound,
  Workflow,
} from "lucide-react";
import type { LysmaNavItem } from "../../lib/navigation";

function NavIcon({ href }: { href: string }) {
  if (href === "/") {
    return <Home aria-hidden="true" />;
  }

  if (href.includes("presentation")) {
    return <Lightbulb aria-hidden="true" />;
  }

  if (href.includes("sites-web") || href.includes("dashboard/site")) {
    return <Monitor aria-hidden="true" />;
  }

  if (href.includes("outils-web")) {
    return <LayoutList aria-hidden="true" />;
  }

  if (href.includes("methode")) {
    return <Workflow aria-hidden="true" />;
  }

  if (href.includes("realisations")) {
    return <Star aria-hidden="true" />;
  }

  if (href.includes("espace-client") || href === "/dashboard") {
    return <UserRound aria-hidden="true" />;
  }

  if (href.includes("nouveautes")) {
    return <Sparkles aria-hidden="true" />;
  }

  if (href.includes("contact") || href.includes("support")) {
    return <MessageSquareText aria-hidden="true" />;
  }

  if (href.includes("contenus")) {
    return <FileText aria-hidden="true" />;
  }

  if (href.includes("abonnement")) {
    return <CreditCard aria-hidden="true" />;
  }

  if (href.includes("security")) {
    return <ShieldCheck aria-hidden="true" />;
  }

  return <LockKeyhole aria-hidden="true" />;
}

export function AppSidebar({
  items,
  title = "LYSMA",
  subtitle = "Solutions",
}: {
  items: LysmaNavItem[];
  title?: string;
  subtitle?: string;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        className="lysma-mobile-nav-toggle"
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        Menu
      </button>
      <aside className={`lysma-app-sidebar ${open ? "is-open" : ""}`}>
        <Link href="/" className="lysma-sidebar-brand" onClick={() => setOpen(false)}>
          <img src="/logo-lysma.PNG" alt="" aria-hidden="true" />
          <span>
            <strong>{title}</strong>
            <small>{subtitle}</small>
          </span>
        </Link>
        <nav aria-label="Navigation LYSMA">
          {items.map((item) => {
            const active = item.href === "/" ? pathname === "/" : pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={active ? "is-active" : undefined}
                onClick={() => setOpen(false)}
              >
                <strong aria-hidden="true">
                  <NavIcon href={item.href} />
                </strong>
                <span>
                  <em>{item.label}</em>
                  {item.description ? <small>{item.description}</small> : null}
                </span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
