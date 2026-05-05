"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BarChart2, ChevronRight, Search, X } from "lucide-react";

type ReleveRow = {
  id:         string;
  bon_number: string;
  status:     string;
  created_at: string;
  clientName: string;
  storeName:  string;
  atcName:    string;
  nbMateriel: number;
};

type Props = {
  distributor: string;
  initialRows: ReleveRow[];
};

const STATUS_MAP: Record<string, { label: string; bg: string; color: string; border: string }> = {
  frigo:              { label: "Brouillon",         bg: "#f1f5f9", color: "#64748b", border: "#e2e8f0" },
  envoye:             { label: "Envoyé",            bg: "#fffbeb", color: "#b45309", border: "#fde68a" },
  non_pris_en_charge: { label: "Non pris en charge",bg: "#fef2f2", color: "#dc2626", border: "#fecaca" },
  pris_en_charge:     { label: "Pris en charge",   bg: "#eff6ff", color: "#1d4ed8", border: "#bfdbfe" },
  en_cours:           { label: "En cours",          bg: "#eef2ff", color: "#4338ca", border: "#c7d2fe" },
  traite:             { label: "Traité",            bg: "#f0fdf4", color: "#15803d", border: "#bbf7d0" },
  refuse:             { label: "Refusé",            bg: "#fef2f2", color: "#dc2626", border: "#fecaca" },
};

const fmtDate = (d: string) =>
  new Intl.DateTimeFormat("fr-FR", { dateStyle: "short", timeStyle: "short" }).format(new Date(d));

export default function ReleveFilters({ distributor, initialRows }: Props) {
  const router  = useRouter();
  const base    = `/${distributor}/admin/bons`;

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  const filtered = initialRows.filter((r) => {
    const q = search.trim().toLowerCase();
    const matchSearch = !q ||
      r.bon_number.toLowerCase().includes(q) ||
      r.clientName.toLowerCase().includes(q) ||
      r.storeName.toLowerCase().includes(q) ||
      r.atcName.toLowerCase().includes(q);
    const matchStatus = status === "all" || r.status === status;
    return matchSearch && matchStatus;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

      {/* Filtres */}
      <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "flex-end" }}>
        <div style={{ flex: 1, minWidth: "220px", position: "relative" }}>
          <label style={{ display: "block", marginBottom: "0.375rem", fontSize: "0.78rem", fontWeight: 700, color: "#334155", textTransform: "uppercase" as const, letterSpacing: "0.06em" }}>
            Recherche
          </label>
          <div style={{ position: "relative" }}>
            <Search size={15} color="#94a3b8" style={{ position: "absolute", left: "0.875rem", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
            <input
              style={{ width: "100%", padding: "0.625rem 0.875rem 0.625rem 2.5rem", borderRadius: "0.75rem", border: "1px solid #dce5f0", fontSize: "0.875rem", outline: "none", boxSizing: "border-box" as const }}
              value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="N° bon, client, ATC, magasin..."
              autoComplete="off"
            />
            {search && (
              <button type="button" onClick={() => setSearch("")}
                style={{ position: "absolute", right: "0.875rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#94a3b8", display: "flex" }}>
                <X size={14} />
              </button>
            )}
          </div>
        </div>
        <div style={{ minWidth: "180px" }}>
          <label style={{ display: "block", marginBottom: "0.375rem", fontSize: "0.78rem", fontWeight: 700, color: "#334155", textTransform: "uppercase" as const, letterSpacing: "0.06em" }}>
            Statut
          </label>
          <select
            style={{ width: "100%", padding: "0.625rem 0.875rem", borderRadius: "0.75rem", border: "1px solid #dce5f0", fontSize: "0.875rem", outline: "none", background: "#fff" }}
            value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="all">Tous les statuts</option>
            <option value="envoye">Envoyé</option>
            <option value="pris_en_charge">Pris en charge</option>
            <option value="en_cours">En cours</option>
            <option value="traite">Traité</option>
            <option value="refuse">Refusé</option>
          </select>
        </div>
      </div>

      {/* Compteur */}
      <p style={{ margin: 0, fontSize: "0.78rem", color: "#94a3b8", fontWeight: 600 }}>
        {filtered.length} relevé{filtered.length !== 1 ? "s" : ""}
        {(search || status !== "all") ? " filtré" + (filtered.length !== 1 ? "s" : "") : ""}
      </p>

      {/* Liste */}
      {filtered.length === 0 ? (
        <div style={{ padding: "3rem", textAlign: "center" as const, display: "flex", flexDirection: "column", alignItems: "center", gap: "0.875rem" }}>
          <BarChart2 size={40} color="#94a3b8" strokeWidth={1.5} />
          <p style={{ margin: 0, fontWeight: 700, color: "#0f172a", fontSize: "1rem" }}>Aucun relevé trouvé</p>
          <p style={{ margin: 0, fontSize: "0.875rem", color: "#6b7280" }}>
            {search || status !== "all" ? "Modifiez vos filtres." : "Aucun relevé de parc n'a encore été soumis."}
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {filtered.map((r) => {
            const st = STATUS_MAP[r.status] ?? { label: r.status, bg: "#f1f5f9", color: "#64748b", border: "#e2e8f0" };
            return (
              <div key={r.id} style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "1rem 1.125rem", borderRadius: "0.875rem", background: "#f8fafc", border: "1px solid #e2e8f0", cursor: "pointer", transition: "background 0.12s, border-color 0.12s" }}
                onClick={() => router.push(`${base}/${r.id}`)}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#eff6ff"; e.currentTarget.style.borderColor = "#bfdbfe"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "#f8fafc"; e.currentTarget.style.borderColor = "#e2e8f0"; }}>

                {/* Icône */}
                <div style={{ width: "40px", height: "40px", borderRadius: "0.75rem", background: "rgba(5,150,105,0.08)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <BarChart2 size={18} color="#059669" strokeWidth={2} />
                </div>

                {/* Infos principales */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.2rem" }}>
                    <p style={{ margin: 0, fontSize: "0.9rem", fontWeight: 700, color: "#0f172a", fontFamily: "monospace" }}>{r.bon_number}</p>
                    <span style={{ display: "inline-flex", alignItems: "center", padding: "0.2rem 0.625rem", borderRadius: "999px", fontSize: "0.72rem", fontWeight: 700, background: st.bg, color: st.color, border: `1px solid ${st.border}` }}>
                      {st.label}
                    </span>
                    {r.nbMateriel > 0 && (
                      <span style={{ display: "inline-flex", alignItems: "center", padding: "0.2rem 0.625rem", borderRadius: "999px", fontSize: "0.72rem", fontWeight: 600, background: "rgba(5,150,105,0.08)", color: "#059669", border: "1px solid rgba(5,150,105,0.2)" }}>
                        {r.nbMateriel} équipement{r.nbMateriel > 1 ? "s" : ""}
                      </span>
                    )}
                  </div>
                  <p style={{ margin: 0, fontSize: "0.78rem", color: "#6b7280" }}>
                    {r.clientName} · {r.storeName} · ATC : {r.atcName}
                  </p>
                </div>

                {/* Date */}
                <p style={{ margin: 0, fontSize: "0.78rem", color: "#94a3b8", flexShrink: 0 }}>
                  {fmtDate(r.created_at)}
                </p>
                <ChevronRight size={16} color="#94a3b8" strokeWidth={2} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}