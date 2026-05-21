import { formatDateTime } from "@/lib/admin/bons";

type BonLike = {
  bon_lines: Array<{
    id: string;
    line_number: number;
    designation: string | null;
    reference: string | null;
    quantity: unknown;
    unit_price: unknown;
    billing_code: string | null;
    comment: string | null;
  }>;
  bon_status_history: Array<{
    id: string;
    action_key: string | null;
    old_status: string | null;
    new_status: string | null;
    reason: string | null;
    created_at: Date;
    users: { first_name: string; last_name: string } | null;
    store_staff: { first_name: string; last_name: string } | null;
  }>;
};

export function BonLinesCard({ bon }: { bon: BonLike }) {
  return (
    <section className="card-lysma p-8">
      <h2 className="text-xl font-semibold text-[#0F172A]">Lignes</h2>
      <div className="mt-6 space-y-4">
        {bon.bon_lines.map((line) => (
          <div key={line.id} className="rounded-2xl border border-[#E2E8F0] bg-[#F8FBFF] px-5 py-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="font-semibold text-[#0F172A]">Ligne {line.line_number} - {line.designation || "Sans designation"}</p>
                <p className="mt-1 text-sm text-[#6B7280]">{line.reference || "Reference non renseignee"}</p>
              </div>
              <div className="grid gap-2 text-sm text-[#6B7280] md:min-w-[300px] md:grid-cols-3 md:text-right">
                <span>Qte {line.quantity !== null && line.quantity !== undefined ? String(line.quantity) : "-"}</span>
                <span>{line.unit_price !== null && line.unit_price !== undefined ? `${line.unit_price} EUR` : "-"}</span>
                <span>{line.billing_code || "-"}</span>
              </div>
            </div>
            {line.comment ? <p className="mt-3 text-sm text-[#6B7280]">{line.comment}</p> : null}
          </div>
        ))}
        {!bon.bon_lines.length ? <p className="text-sm text-[#6B7280]">Aucune ligne trouvee.</p> : null}
      </div>
    </section>
  );
}

export function BonHistoryCard({ bon }: { bon: BonLike }) {
  return (
    <section className="card-lysma p-8">
      <h2 className="text-xl font-semibold text-[#0F172A]">Historique</h2>
      <div className="mt-6 space-y-4">
        {bon.bon_status_history.map((item) => {
          const actor = item.users
            ? `${item.users.first_name} ${item.users.last_name}`.trim()
            : item.store_staff
              ? `${item.store_staff.first_name} ${item.store_staff.last_name}`.trim()
              : "-";

          return (
            <div key={item.id} className="rounded-2xl border border-[#E2E8F0] bg-[#F8FBFF] px-5 py-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-semibold text-[#0F172A]">{item.action_key || "Action"}</p>
                  <p className="mt-1 text-sm text-[#6B7280]">{actor}</p>
                </div>
                <div className="grid gap-2 text-sm text-[#6B7280] md:min-w-[360px] md:grid-cols-3 md:text-right">
                  <span>{item.old_status || "-"}</span>
                  <span>{item.new_status || "-"}</span>
                  <span>{formatDateTime(item.created_at)}</span>
                </div>
              </div>
              {item.reason ? <p className="mt-3 text-sm text-[#6B7280]">{item.reason}</p> : null}
            </div>
          );
        })}
        {!bon.bon_status_history.length ? <p className="text-sm text-[#6B7280]">Aucun historique trouve.</p> : null}
      </div>
    </section>
  );
}
