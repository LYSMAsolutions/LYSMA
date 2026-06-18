import type { ReactNode } from "react";
import type { LysmaBrand, LysmaNavItem, LysmaTone } from "../types";
import { cx } from "../utils";

type SidebarLysmaProps = {
  brand: LysmaBrand;
  items: LysmaNavItem[];
  bottomItems?: LysmaNavItem[];
  activeHref?: string;
  tone?: LysmaTone;
  footer?: ReactNode;
  renderLink?: (item: LysmaNavItem, className: string, children: ReactNode) => ReactNode;
  className?: string;
};

function isActive(item: LysmaNavItem, activeHref?: string) {
  if (!activeHref) return false;
  if (item.match === "exact") return activeHref === item.href;
  return activeHref === item.href || activeHref.startsWith(`${item.href}/`);
}

function renderItem(
  item: LysmaNavItem,
  active: boolean,
  renderLink?: SidebarLysmaProps["renderLink"]
) {
  const className = cx("lysma-sidebar__item", active && "is-active");
  const children = (
    <>
      <span className="lysma-sidebar__icon" aria-hidden="true">
        {item.icon}
      </span>
      <span className="lysma-sidebar__label">
        <strong>{item.label}</strong>
        {item.description ? <small>{item.description}</small> : null}
      </span>
      {item.badge ? <span className="lysma-sidebar__badge">{item.badge}</span> : null}
    </>
  );

  if (renderLink) return renderLink(item, className, children);

  return (
    <a className={className} href={item.href} aria-current={active ? "page" : undefined}>
      {children}
    </a>
  );
}

export function SidebarLysma({
  brand,
  items,
  bottomItems = [],
  activeHref,
  tone = "blue",
  footer,
  renderLink,
  className,
}: SidebarLysmaProps) {
  const brandContent = (
    <>
      {brand.logo ? <span className="lysma-sidebar__brandLogo">{brand.logo}</span> : null}
      <span className="lysma-sidebar__brandText">
        <strong>{brand.name}</strong>
        {brand.subtitle ? <small>{brand.subtitle}</small> : null}
      </span>
    </>
  );

  return (
    <aside className={cx("lysma-sidebar", `lysma-tone-${tone}`, className)}>
      {brand.href ? (
        <a className="lysma-sidebar__brand" href={brand.href}>
          {brandContent}
        </a>
      ) : (
        <div className="lysma-sidebar__brand">{brandContent}</div>
      )}

      <nav className="lysma-sidebar__nav" aria-label="Navigation principale">
        {items.map((item) => (
          <div key={item.href}>{renderItem(item, isActive(item, activeHref), renderLink)}</div>
        ))}
      </nav>

      {bottomItems.length || footer ? (
        <div className="lysma-sidebar__bottom">
          {bottomItems.length ? (
            <nav aria-label="Navigation secondaire">
              {bottomItems.map((item) => (
                <div key={item.href}>{renderItem(item, isActive(item, activeHref), renderLink)}</div>
              ))}
            </nav>
          ) : null}
          {footer ? <div className="lysma-sidebar__footer">{footer}</div> : null}
        </div>
      ) : null}
    </aside>
  );
}
