import type { ReactNode } from "react";
import "../styles/lysma.css";

export const metadata = {
  title: "LYSMA Hub",
  description: "LYSMA Solutions crée des sites vitrines premium et des outils web métier à la demande.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
