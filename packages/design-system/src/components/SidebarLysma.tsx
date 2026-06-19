"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import type {
  LysmaBrand,
  LysmaNavGroup,
  LysmaNavItem,
  LysmaSidebarEntry,
  LysmaTone,
} from "../types";
import { cx } from "../utils";

export type SidebarLysmaProps = {
  brand: LysmaBrand;
  items?: LysmaNavItem[];
  navigation?: LysmaSidebarEntry[];
  bottomItems?: LysmaNavItem[];
  activeHref?: string;
  heading?: string;
  tone?: LysmaTone;
  footer?: ReactNode;
  mobileMenuLabel?: string;
  renderLink?: (item: LysmaNavItem, className: string, children: ReactNode) => ReactNode;
  className?: string;
};

const MOBILE_BREAKPOINT = "(max-width: 1024px)";
const FOCUSABLE_ELEMENTS = [
  "a[href]",
  "button:not([disabled])",
  "summary",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

function isGroup(entry: LysmaSidebarEntry): entry is LysmaNavGroup {
  return "items" in entry;
}

function isActive(item: LysmaNavItem, activeHref?: string) {
  if (!activeHref) return false;
  if (item.match === "exact") return activeHref === item.href;
  return activeHref === item.href || activeHref.startsWith(`${item.href}/`);
}

function renderItem(
  item: LysmaNavItem,
  active: boolean,
  renderLink?: SidebarLysmaProps["renderLink"],
  onNavigate?: () => void,
  subItem = false,
) {
  const className = cx(
    "lysma-sidebar__item",
    subItem && "lysma-sidebar__subItem",
    item.variant && item.variant !== "default" && `lysma-sidebar__item--${item.variant}`,
    active && "is-active",
  );
  const children = (
    <>
      {item.icon ? (
        <span className="lysma-sidebar__icon" aria-hidden="true">
          {item.icon}
        </span>
      ) : subItem ? (
        <span className="lysma-sidebar__subDot" aria-hidden="true" />
      ) : null}
      <span className="lysma-sidebar__label">
        <strong>{item.label}</strong>
        {item.description ? <small>{item.description}</small> : null}
      </span>
      {item.badge ? <span className="lysma-sidebar__badge">{item.badge}</span> : null}
    </>
  );

  if (renderLink) {
    return (
      <div className="lysma-sidebar__linkProxy" onClick={onNavigate}>
        {renderLink(item, className, children)}
      </div>
    );
  }

  return (
    <a
      className={className}
      href={item.href}
      aria-current={active ? "page" : undefined}
      onClick={onNavigate}
    >
      {children}
    </a>
  );
}

type SidebarContentProps = Pick<
  SidebarLysmaProps,
  "brand" | "bottomItems" | "activeHref" | "heading" | "footer" | "renderLink" | "className"
> & {
  entries: LysmaSidebarEntry[];
  mobile?: boolean;
  onNavigate?: () => void;
  onRequestClose?: () => void;
};

function SidebarContent({
  brand,
  entries,
  bottomItems = [],
  activeHref,
  heading,
  footer,
  renderLink,
  className,
  mobile = false,
  onNavigate,
  onRequestClose,
}: SidebarContentProps) {
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
    <aside
      className={cx("lysma-sidebar", mobile && "lysma-sidebar--mobile", className)}
      aria-label="Navigation LYSMA"
    >
      {brand.href ? (
        <a className="lysma-sidebar__brand" href={brand.href} onClick={onNavigate}>
          {brandContent}
        </a>
      ) : (
        <div className="lysma-sidebar__brand">{brandContent}</div>
      )}

      {mobile ? (
        <button
          type="button"
          className="lysma-sidebar__mobileClose"
          aria-label="Fermer le menu"
          data-lysma-mobile-close
          onClick={onRequestClose}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="m6 6 12 12M18 6 6 18" />
          </svg>
        </button>
      ) : null}

      {heading ? (
        <div className="lysma-sidebar__heading">
          <span>{heading}</span>
          <span aria-hidden="true" />
        </div>
      ) : null}

      <nav className="lysma-sidebar__nav" aria-label="Navigation principale">
        {entries.map((entry) => {
          if (!isGroup(entry)) {
            return (
              <div key={entry.href}>
                {renderItem(entry, isActive(entry, activeHref), renderLink, onNavigate)}
              </div>
            );
          }

          const groupActive = entry.items.some((item) => isActive(item, activeHref));

          return (
            <details
              key={entry.id}
              className="lysma-sidebar__group"
              open={groupActive || entry.defaultOpen || undefined}
            >
              <summary
                className={cx("lysma-sidebar__item", "lysma-sidebar__groupTrigger", groupActive && "is-active")}
              >
                {entry.icon ? (
                  <span className="lysma-sidebar__icon" aria-hidden="true">
                    {entry.icon}
                  </span>
                ) : null}
                <span className="lysma-sidebar__label">
                  <strong>{entry.label}</strong>
                </span>
                <svg className="lysma-sidebar__caret" viewBox="0 0 20 20" aria-hidden="true">
                  <path d="m5 7.5 5 5 5-5" />
                </svg>
              </summary>
              <div className="lysma-sidebar__subnav">
                {entry.items.map((item) => (
                  <div key={item.href}>
                    {renderItem(item, isActive(item, activeHref), renderLink, onNavigate, true)}
                  </div>
                ))}
              </div>
            </details>
          );
        })}
      </nav>

      {bottomItems.length || footer ? (
        <div className="lysma-sidebar__bottom">
          {bottomItems.length ? (
            <nav aria-label="Navigation secondaire">
              {bottomItems.map((item) => (
                <div key={item.href}>
                  {renderItem(item, isActive(item, activeHref), renderLink, onNavigate)}
                </div>
              ))}
            </nav>
          ) : null}
          {footer ? <div className="lysma-sidebar__footer">{footer}</div> : null}
        </div>
      ) : null}
    </aside>
  );
}

export function SidebarLysma({
  brand,
  items = [],
  navigation,
  bottomItems = [],
  activeHref,
  heading = "Navigation",
  tone = "blue",
  footer,
  mobileMenuLabel = "Menu de navigation",
  renderLink,
  className,
}: SidebarLysmaProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const entries = navigation ?? items;
  const closeMobile = useCallback(() => setMobileOpen(false), []);

  useEffect(() => {
    closeMobile();
  }, [activeHref, closeMobile]);

  useEffect(() => {
    const mediaQuery = window.matchMedia(MOBILE_BREAKPOINT);
    const handleBreakpointChange = (event: MediaQueryListEvent) => {
      if (!event.matches) closeMobile();
    };

    mediaQuery.addEventListener("change", handleBreakpointChange);
    return () => mediaQuery.removeEventListener("change", handleBreakpointChange);
  }, [closeMobile]);

  useEffect(() => {
    if (!mobileOpen) return;

    const drawer = drawerRef.current;
    const previousOverflow = document.body.style.overflow;
    const previousTouchAction = document.body.style.touchAction;
    const focusFrame = window.requestAnimationFrame(() => {
      drawer?.querySelector<HTMLElement>("[data-lysma-mobile-close]")?.focus();
    });

    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeMobile();
        return;
      }

      if (event.key !== "Tab" || !drawer) return;

      const focusableElements = Array.from(
        drawer.querySelectorAll<HTMLElement>(FOCUSABLE_ELEMENTS),
      ).filter((element) => element.getClientRects().length > 0);

      if (!focusableElements.length) {
        event.preventDefault();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      document.body.style.touchAction = previousTouchAction;
      menuButtonRef.current?.focus();
    };
  }, [mobileOpen, closeMobile]);

  return (
    <div className={cx("lysma-sidebar-shell", `lysma-tone-${tone}`)}>
      <div className="lysma-sidebar-shell__desktop">
        <SidebarContent
          brand={brand}
          entries={entries}
          bottomItems={bottomItems}
          activeHref={activeHref}
          heading={heading}
          footer={footer}
          renderLink={renderLink}
          className={className}
        />
      </div>

      <header className="lysma-sidebar-mobileHeader">
        <button
          ref={menuButtonRef}
          type="button"
          className="lysma-sidebar-mobileHeader__button"
          aria-label="Ouvrir le menu"
          aria-controls="lysma-mobile-navigation"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen(true)}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </button>

        {brand.href ? (
          <a className="lysma-sidebar-mobileHeader__brand" href={brand.href}>
            {brand.logo ? <span>{brand.logo}</span> : null}
            <strong>{brand.name}</strong>
          </a>
        ) : (
          <div className="lysma-sidebar-mobileHeader__brand">
            {brand.logo ? <span>{brand.logo}</span> : null}
            <strong>{brand.name}</strong>
          </div>
        )}

        <span className="lysma-sidebar-mobileHeader__spacer" aria-hidden="true" />
      </header>

      <div
        className="lysma-sidebar-backdrop"
        data-open={mobileOpen || undefined}
        aria-hidden="true"
        onClick={closeMobile}
      />

      <div
        ref={drawerRef}
        id="lysma-mobile-navigation"
        className="lysma-sidebar-drawer"
        data-open={mobileOpen || undefined}
        role="dialog"
        aria-modal="true"
        aria-label={mobileMenuLabel}
        aria-hidden={mobileOpen ? undefined : true}
        inert={mobileOpen ? undefined : true}
      >
        <SidebarContent
          brand={brand}
          entries={entries}
          bottomItems={bottomItems}
          activeHref={activeHref}
          heading={heading}
          footer={footer}
          renderLink={renderLink}
          className={className}
          mobile
          onNavigate={closeMobile}
          onRequestClose={closeMobile}
        />
      </div>
    </div>
  );
}
