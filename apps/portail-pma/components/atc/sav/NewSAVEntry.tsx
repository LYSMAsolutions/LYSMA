"use client";

import type { CSSProperties } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Wrench, Ruler, Settings2, BarChart2 } from "lucide-react";
import CreateInterventionForm from "@/components/atc/bons/CreateInterventionForm";
import CreateDevisMaterielForm from "@/components/atc/bons/CreateDevisMaterielForm";
import CreatePiecesSAVForm from "@/components/atc/bons/CreatePiecesSAVForm";
import CreateReleveParc from "@/components/atc/bons/CreateReleveParc";

type Client = { id: string; name: string; code: string | null; storeId: string | null; storeName: string | null; storeCode: string | null; representativeName?: string | null; phone?: string | null; email?: string | null; addressLine1?: string | null; postalCode?: string | null; city?: string | null; billingName?: string | null; status?: string };
type Store  = { id: string; name: string; code: string };

type Props = {
  distributorSlug: string;
  clients:         Client[];
  savStores:       Store[];
  allStores:       Store[];
  activeCodes:     string[];
};

const TYPES = [
  { code: "intervention", label: "Demande d'intervention",    desc: "Sur site client ou réparation en atelier",              Icon: Wrench,    color: "#7c3aed", bg: "rgba(124,58,237,0.05)", border: "rgba(196,181,253,0.5)", form: "intervention", bloc: null },
  { code: "materiel",     label: "Devis / Commande matériel", desc: "Devis ou commande d'équipement — transformation incluse", Icon: Ruler,     color: "#0a4d9b", bg: "rgba(10,77,155,0.05)",  border: "rgba(191,219,254,0.6)", form: "materiel",     bloc: null },
  { code: "sav",   label: "Pièces SAV",               desc: "Pièces pour réparation d'équipement — matériel obligatoire", Icon: Settings2, color: "#7c3aed", bg: "rgba(124,58,237,0.05)", border: "rgba(196,181,253,0.5)", form: "sav",   bloc: null },
  { code: "contrat_maintenance",  label: "Relevé de parc",           desc: "Relevé des équipements client pour contrat maintenance",  Icon: BarChart2,  color: "#059669", bg: "rgba(5,150,105,0.05)",  border: "rgba(167,243,208,0.5)", form: "contrat_maintenance",       bloc: "releve_parc" },
];

function TypeBar({ types, selected, onSelect, onBack }: { types: typeof TYPES; selected: string; onSelect: (c: string) => void; onBack: () => void }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
      <button type="button" onClick={onBack} style={{ padding: "0.4rem 0.875rem", borderRadius: "0.875rem", background: "rgba(255,255,255,0.8)", border: "1px solid #e2e8f0", color: "#6b7280", fontWeight: 600, fontSize: "0.78rem", cursor: "pointer" }}>← Changer</button>
      {types.map((t) => {
        const { Icon } = t;
        return (
          <button key={t.code} type="button" onClick={() => onSelect(t.code)}
            style={{ padding: "0.4rem 0.875rem", borderRadius: "0.875rem", border: "1px solid", borderColor: selected === t.code ? t.color : "#e2e8f0", background: selected === t.code ? t.bg : "rgba(255,255,255,0.8)", color: selected === t.code ? t.color : "#6b7280", fontWeight: selected === t.code ? 700 : 500, fontSize: "0.78rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <Icon size={13} strokeWidth={2} /><span>{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export default function NewSAVEntry({ distributorSlug, clients, savStores, allStores, activeCodes }: Props) {
  const router    = useRouter();
  const [selected, setSelected] = useState<string | null>(null);
  const available = TYPES.filter((t) => !t.bloc || (activeCodes ?? []).includes(t.bloc));
  const def       = TYPES.find((t) => t.code === selected);

  if (selected && def) {
    const bar = <TypeBar types={available} selected={selected} onSelect={setSelected} onBack={() => setSelected(null)} />;
    if (def.form === "intervention") return <div><div>{bar}</div><div style={{ marginTop: "1.5rem" }}><CreateInterventionForm distributorSlug={distributorSlug} clients={clients as any} savStores={savStores} /></div></div>;
    if (def.form === "materiel")     return <div><div>{bar}</div><div style={{ marginTop: "1.5rem" }}><CreateDevisMaterielForm distributorSlug={distributorSlug} clients={clients as any} savStores={savStores} /></div></div>;
    if (def.form === "sav")   return <div><div>{bar}</div><div style={{ marginTop: "1.5rem" }}><CreatePiecesSAVForm distributorSlug={distributorSlug} clients={clients as any} savStores={savStores} /></div></div>;
    if (def.form === "contrat_maintenance")       return <div><div>{bar}</div><div style={{ marginTop: "1.5rem" }}><CreateReleveParc distributorSlug={distributorSlug} clients={clients as any} stores={allStores} /></div></div>;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      <div style={{ padding: "1.75rem", borderRadius: "1.5rem", background: "linear-gradient(135deg,rgba(124,58,237,0.06),rgba(139,92,246,0.03))", border: "1px solid rgba(196,181,253,0.5)" }}>
        <p style={{ margin: "0 0 0.25rem", fontSize: "0.72rem", fontWeight: 800, color: "#7c3aed", textTransform: "uppercase", letterSpacing: "0.1em" }}>ATC · SAV</p>
        <h1 style={{ margin: 0, fontSize: "1.5rem", fontWeight: 800, color: "#0f172a", letterSpacing: "-0.02em" }}>Nouvelle demande SAV</h1>
        <p style={{ margin: "0.4rem 0 0", fontSize: "0.875rem", color: "#6b7280" }}>Choisissez le type de demande SAV.</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px,1fr))", gap: "1rem" }}>
        {available.map((t) => {
          const { Icon } = t;
          return (
            <button key={t.code} type="button" onClick={() => setSelected(t.code)}
              style={{ padding: "1.5rem", borderRadius: "1.5rem", border: `1px solid ${t.border}`, background: t.bg, cursor: "pointer", textAlign: "left", transition: "all 0.15s", boxShadow: "0 4px 16px rgba(15,23,42,0.04)" }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 28px rgba(15,23,42,0.1)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(15,23,42,0.04)"; }}>
              <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: `${t.color}18`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1rem" }}>
                <Icon size={22} color={t.color} strokeWidth={2} />
              </div>
              <p style={{ margin: "0 0 0.3rem", fontSize: "1rem", fontWeight: 800, color: "#0f172a" }}>{t.label}</p>
              <p style={{ margin: "0 0 1rem", fontSize: "0.78rem", color: "#6b7280", lineHeight: 1.5 }}>{t.desc}</p>
              <div style={{ fontSize: "0.78rem", fontWeight: 700, color: t.color }}>Créer →</div>
            </button>
          );
        })}
      </div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <button type="button" onClick={() => router.push(`/${distributorSlug}/atc/sav`)} style={{ padding: "0.6rem 1.5rem", borderRadius: "0.875rem", background: "none", border: "1px solid #e2e8f0", color: "#6b7280", fontWeight: 600, fontSize: "0.875rem", cursor: "pointer" }}>← Retour SAV</button>
      </div>
    </div>
  );
}