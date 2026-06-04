import type { GallerySectionData } from "../../lib/site-types";
import { Card } from "../ui/Card";

export function GallerySection({ data, anchorId }: { data: GallerySectionData; anchorId?: string }) {
  return (
    <section className="hub-section hub-section-muted" id={anchorId}>
      <div className="hub-shell">
        <div className="hub-section-head">
          <div>
            <p className="hub-kicker">{data.eyebrow}</p>
            <h2>{data.title}</h2>
          </div>
          <p>{data.description}</p>
        </div>
        <div className="hub-gallery-grid">
          {data.items.map((item, index) => (
            <Card key={item.title} className="hub-gallery-card">
              <div className={`hub-gallery-visual hub-gallery-visual-${index + 1}`} />
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
