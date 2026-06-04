import type { StatsSectionData } from "../../lib/site-types";

export function StatsSection({ data, anchorId }: { data: StatsSectionData; anchorId?: string }) {
  return (
    <section className="hub-stats" id={anchorId}>
      <div className="hub-shell hub-stats-grid">
        {data.items.map((item) => (
          <div key={`${item.value}-${item.label}`} className="hub-stat">
            <strong>{item.value}</strong>
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
