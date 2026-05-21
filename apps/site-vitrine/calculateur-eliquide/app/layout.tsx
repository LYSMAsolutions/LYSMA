import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Calculateur e-liquide | LYSMA",
  description:
    "Calculateur e-liquide premium pour recette complète, dilution nicotinée et équilibre PG/VG.",
  manifest: "/manifest-eliquide.json",
};

export default function CalculateurELiquideLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}