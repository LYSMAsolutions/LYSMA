import type { Metadata } from "next";
import type { ReactNode } from "react";
import "../../../packages/design-system/src/styles.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "LYSMA Design System Preview",
  description: "Laboratoire isole pour explorer les variantes premium du futur Design System LYSMA.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
