import type { ContentBlocksSectionData, SiteBlock } from "../../lib/site-types";
import { ButtonLink } from "../ui/Button";
import { Card } from "../ui/Card";

const renderBlock = (block: SiteBlock) => {
  if (!block.enabled) {
    return null;
  }

  switch (block.type) {
    case "text":
      return (
        <Card key={block.id} className="hub-content-block hub-content-block-text">
          {block.data.eyebrow ? <span className="hub-badge">{block.data.eyebrow}</span> : null}
          <h3>{block.data.title}</h3>
          <p>{block.data.body}</p>
        </Card>
      );
    case "featureGrid":
      return (
        <Card key={block.id} className="hub-content-block hub-content-block-feature">
          {block.data.title ? <h3>{block.data.title}</h3> : null}
          <div className="hub-block-feature-grid">
            {block.data.items.map((item) => (
              <div key={item.title}>
                {item.badge ? <span className="hub-badge">{item.badge}</span> : null}
                <strong>{item.title}</strong>
                <p>{item.description}</p>
              </div>
            ))}
          </div>
        </Card>
      );
    case "cta":
      return (
        <Card key={block.id} className="hub-content-block hub-content-block-cta">
          <h3>{block.data.title}</h3>
          <p>{block.data.description}</p>
          <ButtonLink href={block.data.href}>{block.data.label}</ButtonLink>
        </Card>
      );
    default:
      return null;
  }
};

export function ContentBlocksSection({
  data,
  anchorId,
}: {
  data: ContentBlocksSectionData;
  anchorId?: string;
}) {
  const blocks = data.blocks
    .filter((block) => block.enabled)
    .sort((a, b) => a.order - b.order);

  return (
    <section className="hub-section" id={anchorId}>
      <div className="hub-shell">
        {data.title || data.description || data.eyebrow ? (
          <div className="hub-section-head">
            <div>
              {data.eyebrow ? <p className="hub-kicker">{data.eyebrow}</p> : null}
              {data.title ? <h2>{data.title}</h2> : null}
            </div>
            {data.description ? <p>{data.description}</p> : null}
          </div>
        ) : null}
        <div className="hub-content-block-grid">{blocks.map(renderBlock)}</div>
      </div>
    </section>
  );
}
