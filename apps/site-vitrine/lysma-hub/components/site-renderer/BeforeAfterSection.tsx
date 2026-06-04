import type { BeforeAfterSectionData } from "../../lib/site-types";

export function BeforeAfterSection({
  data,
  anchorId,
}: {
  data: BeforeAfterSectionData;
  anchorId?: string;
}) {
  return (
    <section className="hub-section" id={anchorId}>
      <div className="hub-shell hub-before-after">
        <div>
          <p className="hub-kicker">{data.eyebrow}</p>
          <h2>{data.title}</h2>
          <p>{data.description}</p>
        </div>
        <div className="hub-before-after-visual" aria-label="Illustration avant apres">
          <div>
            <span>{data.beforeLabel}</span>
          </div>
          <div>
            <span>{data.afterLabel}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
