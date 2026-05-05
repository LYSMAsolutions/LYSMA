"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  History,
  ListOrdered,
} from "lucide-react";

type PortalNavItem = {
  label: string;
  href: string;
  icon: "layout-dashboard" | "file-text" | "history" | "list-ordered";
};

type PortalSectionNavProps = {
  items: readonly PortalNavItem[];
};

const iconMap = {
  "layout-dashboard": LayoutDashboard,
  "file-text": FileText,
  history: History,
  "list-ordered": ListOrdered,
} as const;

export function PortalSectionNav({ items }: PortalSectionNavProps) {
  const pathname = usePathname();

  return (
    <div className="mt-6 flex flex-wrap gap-3">
      {items.map((item) => {
        const Icon = iconMap[item.icon];
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`inline-flex items-center gap-2 rounded-2xl border px-4 py-2 text-sm font-medium transition ${
              isActive
                ? "border-[#0A4D9B] bg-[#E8F1FB] text-[#0A4D9B]"
                : "border-[#D9E3F0] bg-white/80 text-[#475569] hover:bg-white"
            }`}
          >
            <Icon className="h-4 w-4" />
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}