"use client";

import type { ReactNode } from "react";

type TabItem = {
  key: string;
  label: string;
  content: ReactNode;
};

type TabsProps = {
  value: string;
  onChange: (value: string) => void;
  items: TabItem[];
};

export default function Tabs({ value, onChange, items }: TabsProps) {
  return (
    <div className="page-stack">
      <div className="flex flex-wrap gap-2">
        {items.map((item) => {
          const active = item.key === value;

          return (
            <button
              key={item.key}
              type="button"
              onClick={() => onChange(item.key)}
              className={
                active
                  ? "inline-flex items-center rounded-full border border-[var(--brand)] bg-[var(--brand)] px-4 py-2 text-sm font-medium text-white"
                  : "inline-flex items-center rounded-full border border-[var(--border)] bg-white px-4 py-2 text-sm font-medium text-[var(--text)] transition hover:bg-[var(--bg1)]"
              }
            >
              {item.label}
            </button>
          );
        })}
      </div>

      <div>{items.find((item) => item.key === value)?.content}</div>
    </div>
  );
}