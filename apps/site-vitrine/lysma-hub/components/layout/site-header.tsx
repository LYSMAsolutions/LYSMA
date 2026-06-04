import { UiButtonLink } from "../ui/Button";

export function SiteHeader({
  eyebrow,
  title,
  description,
  actionHref = "/contact",
  actionLabel = "Nous écrire",
}: {
  eyebrow: string;
  title: string;
  description: string;
  actionHref?: string;
  actionLabel?: string;
}) {
  return (
    <header className="lysma-site-header">
      <div>
        <p className="lysma-eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      <UiButtonLink href={actionHref} variant="secondary">
        {actionLabel}
      </UiButtonLink>
    </header>
  );
}
