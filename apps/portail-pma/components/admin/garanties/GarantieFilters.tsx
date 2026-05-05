"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, ChevronRight, Search, X } from "lucide-react";

type GarantieRow = {
  id:              string;
  numero_garantie: string | null;
  status:          string | null;
  marque_piece:    string | null;
  reference_piece: string | null;
  clientName:      string;
  storeName:       string;
  atcName:         string;
  created_at:      string;
};

type Props = {
  distributor:      string;
  initialGaranties: GarantieRow[];
};

const STATUS_LABELS: Record<string, string> = {
  brouillon:              "Brouillon",
  en_cours:               "En cours",
  en_attente_fournisseur: "Attente fournisseur",
  validee:                "Validée",
  refusee:                "Refusée",
};

const STATUS_CLS: Record<string, string> = {
  brouillon:              "badge-gray",
  en_cours:               "badge-blue",
  en_attente_fournisseur: "badge-yellow",
  validee:                "badge-green",
  refusee:                "badge-red",
};

const fmtDate = (d: string) =>
  new Intl.DateTimeFormat("fr-FR", { dateStyle: "short", timeStyle: "short" }).format(new Date(d));

export default function GarantieFilters({ distributor, initialGaranties }: Props) {
  const router = useRouter();
  const base   = `/${distributor}/admin/garanties`;

  const [search, setSearch]   = useState("");
  const [status, setStatus]   = useState("all");

  const filtered = initialGaranties.filter((g) => {
    const q = search.trim().toLowerCase();
    const matchSearch = !q ||
      (g.numero_garantie ?? "").toLowerCase().includes(q) ||
      (g.reference_piece ?? "").toLowerCase().includes(q) ||
      (g.marque_piece    ?? "").toLowerCase().includes(q) ||
      g.clientName.toLowerCase().includes(q) ||
      g.storeName.toLowerCase().includes(q) ||
      g.atcName.toLowerCase().includes(q);
    const matchStatus = status === "all" || g.status === status;
    return matchSearch && matchStatus;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      {/* Filtres */}
      <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "flex-end" }}>
        <div style={{ flex: 1, minWidth: "220px", position: "relative" }}>
          <label className="label-field">Recherche</label>
          <div style={{ position: "relative" }}>
            <Search size={15} color="#94a3b8" style={{ position: "absolute", left: "0.875rem", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
            <input
              className="input-lysma"
              style={{ paddingLeft: "2.5rem" }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="N° garantie, référence, client, ATC..."
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
        <div style={{ minWidth: "200px" }}>
          <label className="label-field">Statut</label>
          <select className="select-lysma" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="all">Tous les statuts</option>
            <option value="en_cours">En cours</option>
            <option value="en_attente_fournisseur">Attente fournisseur</option>
            <option value="validee">Validées</option>
            <option value="refusee">Refusées</option>
            <option value="brouillon">Brouillons</option>
          </select>
        </div>
      </div>

      {/* Compteur */}
      <p style={{ margin: 0, fontSize: "var(--font-xs)", color: "var(--c-text-muted)", fontWeight: 600 }}>
        {filtered.length} garantie{filtered.length !== 1 ? "s" : ""}
        {(search || status !== "all") ? " filtrée" + (filtered.length !== 1 ? "s" : "") : ""}
      </p>

      {/* Liste */}
      {filtered.length === 0 ? (
        <div style={{ padding: "3rem", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.875rem" }}>
          <Shield size={40} color="var(--c-text-muted)" strokeWidth={1.5} />
          <p style={{ margin: 0, fontWeight: 700, color: "var(--c-text)" }}>Aucune garantie trouvée</p>
          <p style={{ margin: 0, fontSize: "var(--font-sm)", color: "var(--c-text-secondary)" }}>
            {search || status !== "all" ? "Modifiez vos filtres." : "Les ATC n'ont pas encore soumis de garantie."}
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {filtered.map((g) => {
            const cls = STATUS_CLS[g.status ?? "brouillon"] ?? "badge-gray";
            return (
              <div key={g.id} className="atc-list-row" style={{ cursor: "pointer" }}
                onClick={() => router.push(`${base}/${g.id}`)}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.2rem" }}>
                    <p style={{ margin: 0, fontSize: "var(--font-md)", fontWeight: 700, color: "var(--c-text)" }}>
                      {g.numero_garantie ?? "Brouillon"}
                      {g.reference_piece ? ` — ${g.reference_piece}` : ""}
                      {g.marque_piece    ? ` (${g.marque_piece})`    : ""}
                    </p>
                    <span className={`badge-lysma ${cls}`}>
                      {STATUS_LABELS[g.status ?? "brouillon"] ?? g.status}
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: "var(--font-xs)", color: "var(--c-text-secondary)" }}>
                    {g.clientName} · {g.storeName} · ATC : {g.atcName}
                  </p>
                </div>
                <p style={{ margin: 0, fontSize: "var(--font-xs)", color: "var(--c-text-muted)", flexShrink: 0 }}>
                  {fmtDate(g.created_at)}
                </p>
                <ChevronRight size={16} color="var(--c-text-muted)" strokeWidth={2} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}