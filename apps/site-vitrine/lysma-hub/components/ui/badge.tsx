import type { ReactNode } from "react";

export function Badge({ children }: { children: ReactNode }) {
  return <span className="lysma-ui-badge">{children}</span>;
}
