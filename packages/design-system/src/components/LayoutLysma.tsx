import type { ReactNode } from "react";
import { cx } from "../utils";

type LayoutLysmaProps = {
  sidebar?: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
  contained?: boolean;
  className?: string;
};

export function LayoutLysma({
  sidebar,
  header,
  footer,
  children,
  contained = false,
  className,
}: LayoutLysmaProps) {
  return (
    <div className={cx("lysma-layout", Boolean(sidebar) && "lysma-layout--with-sidebar", className)}>
      {sidebar ? <div className="lysma-layout__sidebar">{sidebar}</div> : null}
      <div className="lysma-layout__main">
        {header ? <div className="lysma-layout__header">{header}</div> : null}
        <main className={cx("lysma-layout__content", contained && "lysma-layout__content--contained")}>
          {children}
        </main>
        {footer ? <div className="lysma-layout__footer">{footer}</div> : null}
      </div>
    </div>
  );
}
