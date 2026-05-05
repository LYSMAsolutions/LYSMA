import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAccess } from "@/lib/require-access";
import { PortalSectionNav } from "@/components/navigation/portal-section-nav";
import { getBonNavItems } from "@/lib/navigation/bon-nav";

export default async function AdminBonLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ distributor: string; id: string }>;
}) {
  const { distributor, id } = await params;
  const user = await requireAccess({
    allowedRoles: ["admin"],
    distributorSlug: distributor,
  });

  const bon = await prisma.bons.findFirst({
    where: { id, distributor_id: user.distributorId },
    select: { id: true, bon_number: true },
  });

  if (!bon) notFound();

  const items = getBonNavItems(distributor, id);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <section style={{
        position: "relative",
        overflow: "hidden",
        borderRadius: "2rem",
        border: "1px solid rgba(255,255,255,0.5)",
        background: "rgba(255,255,255,0.6)",
        padding: "1.75rem 2rem",
        boxShadow: "0 18px 50px rgba(10,77,155,0.08)",
        backdropFilter: "blur(16px)",
      }}>
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: "linear-gradient(135deg,rgba(10,77,155,0.08),rgba(30,115,216,0.04),rgba(255,255,255,0.1))",
        }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{
            display: "inline-flex", alignItems: "center",
            borderRadius: "999px",
            border: "1px solid rgba(255,255,255,0.6)",
            background: "rgba(255,255,255,0.75)",
            padding: "0.25rem 0.875rem",
            fontSize: "0.7rem", fontWeight: 800,
            textTransform: "uppercase", letterSpacing: "0.2em",
            color: "#0a4d9b",
          }}>
            Gestion
          </div>
          <h2 style={{ margin: "0.75rem 0 0", fontSize: "1.75rem", fontWeight: 800, color: "#0a4d9b", letterSpacing: "-0.03em" }}>
            {bon.bon_number}
          </h2>
          <p style={{ margin: "0.5rem 0 0", fontSize: "0.875rem", color: "#475569", lineHeight: 1.6 }}>
            Naviguez entre la gestion, le détail, l'historique et les lignes du bon.
          </p>
          <PortalSectionNav items={items} />
        </div>
      </section>
      <div>{children}</div>
    </div>
  );
}