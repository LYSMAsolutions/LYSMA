import type { ReactNode } from "react";

export function SectionTitle({
  eyebrow,
  title,
  description,
  align = "left",
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
}) {
  return (
    <div className={`lysma-section-title lysma-section-title-${align}`}>
      {eyebrow ? <p className="lysma-eyebrow">{eyebrow}</p> : null}
      <h2>{title}</h2>
      {description ? <p>{description}</p> : null}
    </div>
  );
}
