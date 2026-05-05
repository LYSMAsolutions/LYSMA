"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart, RotateCcw, ArrowLeft } from "lucide-react";
import CreateBonForm from "@/components/atc/bons/CreateBonForm";
import CreateRetourForm from "@/components/atc/bons/CreateRetourForm";
import { useSearchParams } from "next/navigation";

type Client = { id: string; name: string; code: string | null; storeId: string | null; storeName: string | null; storeCode: string | null; status?: string };
type Store  = { id: string; name: string; code: string };

type Props = {
  distributorSlug: string;
  clients:         Client[];
  normalStores:    Store[];
  savStores:       Store[];
  allStores:       Store[];
  activeCodes:     string[];
  retourConfig:    { requireBonRef: boolean; requireMotif: boolean; requireDesignation: boolean };
};

const TYPES = [
  {
    code: "bon_pieces", label: "Bon pièces",
    desc: "Commande ou devis de pièces — choix par ligne",
    Icon: ShoppingCart,
    color: "#0A4D9B", bg: "rgba(10,77,155,0.05)", border: "rgba(191,219,254,0.6)",
    form: "bon_pieces",
  },
  {
    code: "retour", label: "Retour pièces",
    desc: "Retourner des pièces — envoi automatique magasin + client",
    Icon: RotateCcw,
    color: "#dc2626", bg: "rgba(220,38,38,0.04)", border: "rgba(252,165,165,0.5)",
    form: "retour",
  },
];

function TypeBar({ types, selected, onSelect, onBack }: { types: typeof TYPES; selected: string; onSelect: (c: string) => void; onBack: () => void }) {
  return (
    <div className="atc-typebar">
      <button type="button" onClick={onBack} className="btn-ghost"
        style={{ borderRadius: "999px", border: "1px solid var(--c-border)", fontSize: "var(--font-sm)" }}>
        <ArrowLeft size={13} strokeWidth={2.5} /> Changer
      </button>
      {types.map((t) => {
        const { Icon } = t;
        const active = selected === t.code;
        return (
          <button key={t.code} type="button" onClick={() => onSelect(t.code)}
            style={{
              padding: "0.4rem 0.875rem", borderRadius: "999px",
              border: `1px solid ${active ? t.color : "var(--c-border)"}`,
              background: active ? t.bg : "rgba(255,255,255,0.8)",
              color: active ? t.color : "var(--c-text-secondary)",
              fontWeight: active ? 700 : 500, fontSize: "var(--font-sm)",
              cursor: "pointer", display: "flex", alignItems: "center", gap: "0.4rem",
            }}>
            <Icon size={13} strokeWidth={2} /><span>{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export default function NewBonEntry({ distributorSlug, clients, normalStores, savStores, allStores, activeCodes, retourConfig }: Props) {
  const router = useRouter();
  
  const searchParams = useSearchParams();
  const fromCatalogue = searchParams.get("from") === "catalogue";
  
  const [selected, setSelected] = useState<string | null>(
    fromCatalogue ? "commande_devis" : null
  );
  const def = TYPES.find((t) => t.code === selected);

  if (selected && def) {
    const bar = <TypeBar types={TYPES} selected={selected} onSelect={setSelected} onBack={() => setSelected(null)} />;
    if (def.form === "bon_pieces")
      return (
        <div>
          <div>{bar}</div>
          <div style={{ marginTop: "1.5rem" }}>
            <CreateBonForm distributorSlug={distributorSlug} clients={clients as any} normalStores={normalStores} savStores={savStores} activeCodes={activeCodes} initialBonType="commande_devis" />
          </div>
        </div>
      );
    if (def.form === "retour")
      return (
        <div>
          <div>{bar}</div>
          <div style={{ marginTop: "1.5rem" }}>
            <CreateRetourForm distributorSlug={distributorSlug} clients={clients as any} stores={allStores} {...retourConfig} />
          </div>
        </div>
      );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>

      {/* Hero */}
      <div style={{ padding: "1.75rem", borderRadius: "var(--r-2xl)", background: "linear-gradient(135deg,rgba(10,77,155,0.07),rgba(30,115,216,0.04))", border: "1px solid rgba(191,219,254,0.5)" }}>
        <p style={{ margin: "0 0 0.25rem", fontSize: "var(--font-xs)", fontWeight: 800, color: "var(--c-blue-primary)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
          ATC · Bons
        </p>
        <h1 style={{ margin: 0, fontSize: "1.5rem", fontWeight: 800, color: "var(--c-text)", letterSpacing: "-0.02em" }}>
          Nouveau bon pièces
        </h1>
        <p style={{ margin: "0.4rem 0 0", fontSize: "var(--font-md)", color: "var(--c-text-secondary)" }}>
          Commande / devis de pièces ou retour.
        </p>
      </div>

      {/* Tuiles type */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1rem" }}>
        {TYPES.map((t) => {
          const { Icon } = t;
          return (
            <button key={t.code} type="button" onClick={() => setSelected(t.code)}
              style={{ padding: "1.5rem", borderRadius: "var(--r-2xl)", border: `1px solid ${t.border}`, background: t.bg, cursor: "pointer", textAlign: "left", transition: "all 0.15s", boxShadow: "var(--shadow-sm)" }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "var(--shadow-lg)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "var(--shadow-sm)"; }}>
              <div style={{ width: "44px", height: "44px", borderRadius: "var(--r-md)", background: `${t.color}18`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1rem" }}>
                <Icon size={22} color={t.color} strokeWidth={2} />
              </div>
              <p style={{ margin: "0 0 0.3rem", fontSize: "var(--font-lg)", fontWeight: 800, color: "var(--c-text)" }}>{t.label}</p>
              <p style={{ margin: "0 0 1rem", fontSize: "var(--font-sm)", color: "var(--c-text-secondary)", lineHeight: 1.5 }}>{t.desc}</p>
              <div style={{ fontSize: "var(--font-sm)", fontWeight: 700, color: t.color }}>Créer →</div>
            </button>
          );
        })}
      </div>

      {/* Retour */}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <button type="button" onClick={() => router.push(`/${distributorSlug}/atc/bons`)} className="btn-secondary"
          style={{ borderRadius: "999px" }}>
          <ArrowLeft size={15} strokeWidth={2} /> Retour à mes bons
        </button>
      </div>
    </div>
  );
}