import type { ReactNode } from "react";
import { lysmaMainNavigation } from "../../lib/navigation";
import { AppSidebar } from "./app-sidebar";
import { CookieConsent } from "./cookie-consent";
import { LysmaChatbox } from "./lysma-chatbox";
import { SiteFooter } from "./site-footer";
import { UpdateNotice } from "./update-notice";

export function AppShell({
  children,
  sidebarItems = lysmaMainNavigation,
  sidebarTitle = "LYSMA",
  sidebarSubtitle = "Solutions",
  withFooter = true,
  withChatbox = withFooter,
}: {
  children: ReactNode;
  sidebarItems?: Parameters<typeof AppSidebar>[0]["items"];
  sidebarTitle?: string;
  sidebarSubtitle?: string;
  withFooter?: boolean;
  withChatbox?: boolean;
}) {
  return (
    <div className="lysma-app-shell">
      <AppSidebar items={sidebarItems} title={sidebarTitle} subtitle={sidebarSubtitle} />
      <div className="lysma-app-content">
        {children}
        {withFooter ? <SiteFooter /> : null}
      </div>
      <UpdateNotice />
      <CookieConsent />
      {withChatbox ? <LysmaChatbox /> : null}
    </div>
  );
}
