"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";

type MemoryEntry = {
  id: string;
  type: string;
  sensitivity: string;
  confidence: number;
  humanSummary: string;
  sourceContent: string | null;
  status: string;
  validated: boolean;
  category: string;
  source: string;
  createdAt: string;
};

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  en_validation: { label: "En validation", color: "#f4c95d" },
  autonome: { label: "Autonome", color: "#8be9ff" },
  probabiliste: { label: "Probabiliste", color: "#a6e3a1" },
  valide: { label: "Validé", color: "#50fa7b" },
  rejete: { label: "Rejeté", color: "#ff5555" },
  obsolete: { label: "Obsolète", color: "#6272a4" },
  ancien: { label: "Ancien", color: "#6272a4" },
  contredit: { label: "Contredit", color: "#ffb86c" },
};

const FILTER_TABS = [
  { key: "", label: "Toutes" },
  { key: "en_validation", label: "À valider" },
  { key: "valide", label: "Validées" },
  { key: "autonome", label: "Autonomes" },
  { key: "probabiliste", label: "Probabilistes" },
  { key: "rejete", label: "Rejetées" },
];

export default function MemoirePage() {
  const [entries, setEntries] = useState<MemoryEntry[]>([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  const fetchEntries = useCallback(async () => {
    setLoading(true);
    setError(null);
    const url = filter ? `/api/memoire?status=${filter}` : "/api/memoire";
    const res = await fetch(url);
    if (!res.ok) {
      setError("Erreur lors du chargement des mémoires.");
      setLoading(false);
      return;
    }
    const data = await res.json() as { entries: MemoryEntry[] };
    setEntries(data.entries);
    setLoading(false);
  }, [filter]);

  useEffect(() => { void fetchEntries(); }, [fetchEntries]);

  async function applyAction(id: string, action: "valider" | "rejeter" | "obsolete") {
    setPendingId(id);
    const res = await fetch(`/api/memoire/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    setPendingId(null);
    if (res.ok) await fetchEntries();
    else setError("Action échouée.");
  }

  async function deleteEntry(id: string) {
    if (!confirm("Supprimer définitivement cette mémoire ?")) return;
    setPendingId(id);
    await fetch(`/api/memoire/${id}`, { method: "DELETE" });
    setPendingId(null);
    await fetchEntries();
  }

  const enValidationCount = entries.filter((e) => e.status === "en_validation").length;

  return (
    <main style={{ minHeight: "100vh", padding: "2rem 1.25rem", color: "#f4f7fb", maxWidth: 900, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2rem", flexWrap: "wrap" }}>
        <Link href="/" style={{ color: "#8be9ff", textDecoration: "none", fontSize: "0.875rem" }}>
          ← Accueil
        </Link>
        <h1 style={{ margin: 0, fontSize: "1.75rem", fontWeight: 600, color: "#fff" }}>
          Mémoire ECHO
        </h1>
        {enValidationCount > 0 && (
          <span style={{
            background: "#f4c95d",
            color: "#07080b",
            borderRadius: "999px",
            padding: "0.125rem 0.6rem",
            fontSize: "0.75rem",
            fontWeight: 700,
          }}>
            {enValidationCount} à valider
          </span>
        )}
      </div>

      {/* Onglets */}
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
        {FILTER_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            style={{
              padding: "0.375rem 0.875rem",
              borderRadius: "6px",
              border: filter === tab.key ? "1px solid #8be9ff" : "1px solid #2d3142",
              background: filter === tab.key ? "rgba(139,233,255,0.12)" : "rgba(18,22,31,0.8)",
              color: filter === tab.key ? "#8be9ff" : "#94a3b8",
              fontSize: "0.875rem",
              cursor: "pointer",
              fontWeight: filter === tab.key ? 600 : 400,
            }}
          >
            {tab.label}
          </button>
        ))}
        <button
          onClick={fetchEntries}
          style={{
            marginLeft: "auto",
            padding: "0.375rem 0.875rem",
            borderRadius: "6px",
            border: "1px solid #2d3142",
            background: "transparent",
            color: "#94a3b8",
            fontSize: "0.875rem",
            cursor: "pointer",
          }}
        >
          ↻ Rafraîchir
        </button>
      </div>

      {error && (
        <div style={{ background: "rgba(255,85,85,0.12)", border: "1px solid #ff5555", borderRadius: 8, padding: "0.75rem 1rem", marginBottom: "1rem", color: "#ff5555", fontSize: "0.875rem" }}>
          {error}
        </div>
      )}

      {loading ? (
        <div style={{ color: "#6272a4", textAlign: "center", padding: "3rem" }}>Chargement…</div>
      ) : entries.length === 0 ? (
        <div style={{ color: "#6272a4", textAlign: "center", padding: "3rem" }}>
          Aucune mémoire{filter ? ` avec le statut « ${filter} »` : ""}.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {entries.map((entry) => {
            const statusInfo = STATUS_LABELS[entry.status] ?? { label: entry.status, color: "#6272a4" };
            const isExpanded = expanded === entry.id;
            const isPending = pendingId === entry.id;

            return (
              <div
                key={entry.id}
                style={{
                  background: "rgba(18,22,31,0.9)",
                  border: `1px solid ${entry.status === "en_validation" ? "#f4c95d55" : "#1e2533"}`,
                  borderRadius: 10,
                  padding: "1rem",
                  opacity: isPending ? 0.5 : 1,
                  transition: "opacity 0.15s",
                }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", flexWrap: "wrap" }}>
                  <span style={{
                    display: "inline-block",
                    padding: "0.2rem 0.6rem",
                    borderRadius: 5,
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    background: statusInfo.color + "22",
                    color: statusInfo.color,
                    flexShrink: 0,
                    marginTop: 2,
                  }}>
                    {statusInfo.label}
                  </span>

                  <div style={{ flex: 1, minWidth: 200 }}>
                    <p style={{ margin: 0, color: "#f4f7fb", fontWeight: 500, lineHeight: 1.5 }}>
                      {entry.humanSummary}
                    </p>
                    <p style={{ margin: "0.25rem 0 0", fontSize: "0.75rem", color: "#6272a4" }}>
                      {entry.category} · {entry.type} · confiance {Number(entry.confidence).toFixed(2)} · {new Date(entry.createdAt).toLocaleDateString("fr-FR")}
                    </p>
                  </div>

                  <div style={{ display: "flex", gap: "0.375rem", flexShrink: 0, flexWrap: "wrap" }}>
                    {entry.status === "en_validation" && (
                      <>
                        <button
                          onClick={() => void applyAction(entry.id, "valider")}
                          disabled={isPending}
                          style={actionBtn("#50fa7b")}
                        >
                          ✓ Valider
                        </button>
                        <button
                          onClick={() => void applyAction(entry.id, "rejeter")}
                          disabled={isPending}
                          style={actionBtn("#ff5555")}
                        >
                          ✕ Rejeter
                        </button>
                      </>
                    )}
                    {(entry.status === "autonome" || entry.status === "probabiliste" || entry.status === "valide") && (
                      <button
                        onClick={() => void applyAction(entry.id, "obsolete")}
                        disabled={isPending}
                        style={actionBtn("#6272a4")}
                      >
                        Obsolète
                      </button>
                    )}
                    {entry.sourceContent && (
                      <button
                        onClick={() => setExpanded(isExpanded ? null : entry.id)}
                        style={actionBtn("#8be9ff")}
                      >
                        {isExpanded ? "Masquer" : "Source"}
                      </button>
                    )}
                    <button
                      onClick={() => void deleteEntry(entry.id)}
                      disabled={isPending}
                      style={{ ...actionBtn("#ff5555"), background: "transparent", border: "1px solid #ff555533" }}
                    >
                      🗑
                    </button>
                  </div>
                </div>

                {isExpanded && entry.sourceContent && (
                  <div style={{
                    marginTop: "0.75rem",
                    padding: "0.75rem",
                    background: "#07080b",
                    borderRadius: 6,
                    fontSize: "0.8rem",
                    color: "#94a3b8",
                    lineHeight: 1.6,
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                  }}>
                    {entry.sourceContent}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}

function actionBtn(color: string): React.CSSProperties {
  return {
    padding: "0.3rem 0.65rem",
    borderRadius: 5,
    border: `1px solid ${color}44`,
    background: `${color}15`,
    color: color,
    fontSize: "0.75rem",
    cursor: "pointer",
    fontWeight: 600,
    whiteSpace: "nowrap" as const,
  };
}
