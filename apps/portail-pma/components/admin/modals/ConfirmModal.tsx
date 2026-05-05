"use client";

import { ReactNode } from "react";
import { AlertTriangle } from "lucide-react";

type ConfirmModalProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
};

export default function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title = "Confirmer",
  description,
  confirmLabel = "Confirmer",
  cancelLabel = "Annuler",
}: ConfirmModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <button
        onClick={onClose}
        className="absolute inset-0 bg-[#0F172A]/45 backdrop-blur-[2px]"
      />

      <div className="relative z-[101] w-full max-w-md rounded-[2rem] border border-[#D9E3F0] bg-white shadow-xl p-6 space-y-6">
        <div className="flex items-start gap-4">
          <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-red-100">
            <AlertTriangle className="h-5 w-5 text-red-600" />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-[#0F172A]">
              {title}
            </h2>
            {description && (
              <p className="text-sm text-[#6B7280] mt-1">
                {description}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-[#E2E8F0]"
          >
            {cancelLabel}
          </button>

          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 rounded-xl bg-red-600 text-white"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}