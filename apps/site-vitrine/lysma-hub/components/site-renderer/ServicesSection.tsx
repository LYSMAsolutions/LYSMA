import type { ServicesSectionData } from "../../lib/site-types";
import { Card } from "../ui/Card";

export function ServicesSection({ data, anchorId = "prestations" }: { data: ServicesSectionData; anchorId?: string }) {
  return (
    <section className="hub-section" id={anchorId}>
      <div className="hub-shell">
        <div className="hub-section-head">
          <div>
            <p className="hub-kicker">{data.eyebrow}</p>
            <h2>{data.title}</h2>
          </div>
          <p>{data.description}</p>
        </div>
        <div className="hub-card-grid">
          {data.items.map((service) => (
            <Card key={service.title}>
              {service.badge ? <span className="hub-badge">{service.badge}</span> : null}
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
