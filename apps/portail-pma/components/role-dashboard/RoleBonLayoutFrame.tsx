import { PortalSectionNav } from "@/components/navigation/portal-section-nav";
import { getBonNavItems } from "@/lib/navigation/bon-nav";

export function RoleBonLayoutFrame({
  children,
  distributor,
  section,
  bonNumber,
  bonId,
  label,
}: {
  children: React.ReactNode;
  distributor: string;
  section: "cdv" | "rdm" | "store";
  bonNumber: string;
  bonId: string;
  label: string;
}) {
  const items = getBonNavItems(distributor, bonId, section);

  return (
    <div className="space-y-8">
      <section className="glass-panel relative overflow-hidden rounded-[2rem] p-8">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(10,77,155,0.08),rgba(30,115,216,0.04),rgba(255,255,255,0.1))]" />
        <div className="relative z-10">
          <p className="text-sm font-semibold tracking-[0.18em] text-[#6B7280] uppercase">{label}</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#0A4D9B]">{bonNumber}</h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-[#6B7280]">
            Acces au detail, historique, lignes, documents, photos, commentaires et anomalies du bon.
          </p>
          <PortalSectionNav items={items} />
        </div>
      </section>
      {children}
    </div>
  );
}
