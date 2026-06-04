import type { ReviewsSectionData } from "../../lib/site-types";
import { Card } from "../ui/Card";

export function ReviewsSection({ data, anchorId }: { data: ReviewsSectionData; anchorId?: string }) {
  return (
    <section className="hub-section hub-section-muted" id={anchorId}>
      <div className="hub-shell">
        <div className="hub-section-head">
          <div>
            <p className="hub-kicker">{data.eyebrow}</p>
            <h2>{data.title}</h2>
          </div>
        </div>
        <div className="hub-review-grid">
          {data.items.map((review) => (
            <Card key={`${review.author}-${review.context}`}>
              <div className="hub-stars" aria-label={`${review.rating} etoiles`}>
                {"*".repeat(review.rating)}
              </div>
              <p>{review.comment}</p>
              <strong>{review.author}</strong>
              {review.context ? <span>{review.context}</span> : null}
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
