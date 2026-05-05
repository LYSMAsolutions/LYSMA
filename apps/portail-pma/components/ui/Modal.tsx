"use client";

import type { ReactNode } from "react";
import { X } from "lucide-react";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
};

export default function Modal({
  open,
  onClose,
  title,
  description,
  children,
}: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Fermer la fenêtre"
        className="absolute inset-0 bg-[#0F172A]/45 backdrop-blur-[2px]"
        onClick={onClose}
      />

      <div className="relative z-[101] max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-[2rem] border border-[var(--border)] bg-white shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-[var(--border)] px-6 py-5">
          <div>
            {title ? (
              <h2 className="text-xl font-semibold text-[var(--text)]">{title}</h2>
            ) : null}
            {description ? (
              <p className="mt-1 text-sm text-[var(--muted)]">{description}</p>
            ) : null}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-[var(--border)] bg-white text-[var(--text)] transition hover:bg-[var(--bg1)]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="max-h-[calc(90vh-88px)] overflow-y-auto px-6 py-6">
          {children}
        </div>
      </div>
    </div>
  );
}