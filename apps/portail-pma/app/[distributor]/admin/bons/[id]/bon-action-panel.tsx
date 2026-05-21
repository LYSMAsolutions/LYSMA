"use client";

import { useMemo, useState } from "react";

type BonActionItem = {
  key: string;
  title: string;
  description: string;
  submitLabel: string;
  needsReason: boolean;
  reasonPlaceholder?: string;
};

type Props = {
  distributor: string;
  bonId: string;
  actions: BonActionItem[];
  actionHandler: (formData: FormData) => void | Promise<void>;
};

export function BonActionPanel({
  distributor,
  bonId,
  actions,
  actionHandler,
}: Props) {
  const [selectedKey, setSelectedKey] = useState(actions[0]?.key ?? "");

  const selectedAction = useMemo(
    () => actions.find((item: any) => item.key === selectedKey) ?? null,
    [actions, selectedKey]
  );

  if (actions.length === 0 || !selectedAction) {
    return (
      <div className="rounded-2xl border border-dashed border-[#D9E3F0] bg-[#F8FBFF] px-5 py-6 text-sm text-[#6B7280]">
        Aucune action spécifique disponible pour ce statut actuellement.
      </div>
    );
  }

  return (
    <div className="rounded-[1.75rem] border border-[#E2E8F0] bg-[#F8FBFF] p-6">
      <form action={actionHandler} className="space-y-5">
        <input type="hidden" name="bonId" value={bonId} />
        <input type="hidden" name="action" value={selectedAction.key} />
        <input type="hidden" name="distributor" value={distributor} />

        <div>
          <label className="mb-2 block text-sm font-medium text-[#0F172A]">
            Action
          </label>

          <select
            value={selectedKey}
            onChange={(e) => setSelectedKey(e.target.value)}
            className="w-full rounded-2xl border border-[#D9E3F0] bg-white px-4 py-3 text-sm text-[#0F172A] outline-none transition focus:border-[#0A4D9B]"
          >
            {actions.map((action) => (
              <option key={action.key} value={action.key}>
                {action.title}
              </option>
            ))}
          </select>
        </div>

        <div className="rounded-2xl border border-[#E2E8F0] bg-white px-5 py-4">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#94A3B8]">
            Libellé
          </p>
          <p className="mt-2 text-base font-semibold text-[#0F172A]">
            {selectedAction.title}
          </p>
          <p className="mt-2 text-sm leading-6 text-[#6B7280]">
            {selectedAction.description}
          </p>
        </div>

        {selectedAction.needsReason ? (
          <div>
            <label className="mb-2 block text-sm font-medium text-[#0F172A]">
              Motif
            </label>
            <textarea
              name="reason"
              placeholder={selectedAction.reasonPlaceholder || "Précision"}
              className="w-full rounded-2xl border border-[#D9E3F0] bg-white px-4 py-3 text-sm text-[#0F172A] outline-none transition focus:border-[#0A4D9B]"
              rows={4}
            />
            <p className="mt-2 text-xs text-[#6B7280]">
              Tu peux laisser vide si aucun détail supplémentaire n’est nécessaire.
            </p>
          </div>
        ) : null}

        <div className="flex flex-wrap gap-3">
          <button type="submit" className="btn-secondary">
            {selectedAction.submitLabel}
          </button>
        </div>
      </form>
    </div>
  );
}