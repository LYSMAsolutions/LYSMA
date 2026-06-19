import type { ReactNode } from "react";
import type { LysmaBrand, LysmaNavItem } from "../types";
import { cx } from "../utils";

type FooterLysmaProps = {
  brand: LysmaBrand;
  navigation?: LysmaNavItem[];
  legal?: LysmaNavItem[];
  note?: ReactNode;
  social?: ReactNode;
  className?: string;
};

export function FooterLysma({ brand, navigation = [], legal = [], note, social, className }: FooterLysmaProps) {
  const year = new Date().getFullYear();

  return (
    <footer className={cx("lysma-footer", className)}>
      <div className="lysma-footer__brand">
        <div className="lysma-footer__brandLine">
          {brand.logo ? <span className="lysma-footer__logo">{brand.logo}</span> : null}
          <div>
            <strong>{brand.name}</strong>
            {brand.subtitle ? <span>{brand.subtitle}</span> : null}
          </div>
        </div>
        {note ? <p>{note}</p> : null}
        <small>Copyright {year} {brand.name}. Tous droits reserves.</small>
      </div>

      {navigation.length ? (
        <nav className="lysma-footer__nav" aria-label="Navigation secondaire">
          {navigation.map((item, index) => (
            <a key={`${item.href}-${item.label}-${index}`} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
      ) : null}

      {legal.length || social ? (
        <div className="lysma-footer__meta">
          {legal.length ? (
            <nav aria-label="Liens legaux">
              {legal.map((item, index) => (
                <a key={`${item.href}-${item.label}-${index}`} href={item.href}>
                  {item.label}
                </a>
              ))}
            </nav>
          ) : null}
          {social}
        </div>
      ) : null}
    </footer>
  );
}
