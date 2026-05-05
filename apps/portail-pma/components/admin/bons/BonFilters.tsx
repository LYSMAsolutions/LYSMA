"use client";

import { useMemo, useState } from "react";
import BonListTable from "./BonListTable";

const typeLabels: Record<string, string> = {
  commande_devis: "Commande / Devis",
  retour: "Retour",
  sav: "SAV",
  intervention: "Intervention",
  devis_materiel: "Devis matériel",
  transformation_devis: "Transformation devis",
  garantie: "Garantie",
  contrat_maintenance: "Contrat maintenance",
};

const statusLabels: Record<string, string> = {
  frigo: "Brouillon",
  envoye: "Envoyé",
  non_pris_en_charge: "Non pris en charge",
  pris_en_charge: "Pris en charge",
  en_cours: "En cours",
  attente_fournisseur: "Attente fournisseur",
  attente_client: "Attente client",
  traite: "Traité",
  refuse: "Refusé",
  a_corriger: "À corriger",
};

type Row = {
  id: string;
  bon_number: string;
  bon_type: string;
  status: string;
  priority?: string | null;
  clientName?: string | null;
  storeName?: string | null;
  creatorName?: string | null;
  createdAt: string;
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.7rem 1rem",
  borderRadius: "0.875rem",
  border: "1px solid rgba(217,227,240,0.9)",
  background: "rgba(255,255,255,0.85)",
  fontSize: "0.875rem",
  color: "#0f172a",
  outline: "none",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  marginBottom: "0.4rem",
  fontSize: "0.75rem",
  fontWeight: 700,
  color: "#94a3b8",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
};

export default function BonFilters({ distributor, initialRows }: { distributor: string; initialRows: Row[] }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  const filteredRows = useMemo(() => {
    return initialRows.filter((row) => {
      const query = search.trim().toLowerCase();
      const matchesSearch =
        !query ||
        row.bon_number.toLowerCase().includes(query) ||
        (row.clientName || "").toLowerCase().includes(query) ||
        (row.storeName || "").toLowerCase().includes(query) ||
        (row.creatorName || "").toLowerCase().includes(query);
      return matchesSearch &&
        (!statusFilter || row.status === statusFilter) &&
        (!typeFilter || row.bon_type === typeFilter);
    });
  }, [initialRows, search, statusFilter, typeFilter]);

  const types = [...new Set(initialRows.map((r) => r.bon_type))].filter(Boolean);
  const statuses = [...new Set(initialRows.map((r) => r.status))].filter(Boolean);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

      {/* Filtres */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: "1rem" }}>
        <div>
          <label style={labelStyle}>Recherche</label>
          <input
            style={inputStyle}
            placeholder="Numéro, client, magasin, ATC…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div>
          <label style={labelStyle}>Statut</label>
          <select style={{ ...inputStyle, cursor: "pointer" }} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">Tous les statuts</option>
            {statuses.map((s) => (
              <option key={s} value={s}>{statusLabels[s] ?? s}</option>
            ))}
          </select>
        </div>
        <div>
          <label style={labelStyle}>Type</label>
          <select style={{ ...inputStyle, cursor: "pointer" }} value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
            <option value="">Tous les types</option>
            {types.map((t) => (
              <option key={t} value={t}>{typeLabels[t] ?? t}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Résultats */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <p style={{ margin: 0, fontSize: "0.82rem", color: "#94a3b8" }}>
          {filteredRows.length} bon{filteredRows.length > 1 ? "s" : ""} affiché{filteredRows.length > 1 ? "s" : ""}
        </p>
        {(search || statusFilter || typeFilter) && (
          <button
            type="button"
            onClick={() => { setSearch(""); setStatusFilter(""); setTypeFilter(""); }}
            style={{
              padding: "0.3rem 0.75rem", borderRadius: "999px",
              fontSize: "0.75rem", fontWeight: 600, color: "#dc2626",
              border: "1px solid #fecaca", background: "#fef2f2", cursor: "pointer",
            }}
          >
            Effacer les filtres
          </button>
        )}
      </div>

      <BonListTable distributor={distributor} rows={filteredRows} />
    </div>
  );
}