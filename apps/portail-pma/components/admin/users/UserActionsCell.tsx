"use client";

import { useState } from "react";

type AtcItem = { id: string; first_name: string; last_name: string; email: string };

type Props = {
  userId: string;
  userName: string;
  roleCode: string;
  isActive: boolean;
  isSelf: boolean;
  atcs: AtcItem[]; // liste des ATC actifs pour le remplacement
};

export default function UserActionsCell({ userId, userName, roleCode, isActive, isSelf, atcs }: Props) {
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [replacementId, setReplacementId] = useState("");
  const [replacementInfo, setReplacementInfo] = useState<{ clientCount: number; bonCount: number } | null>(null);

  if (isSelf) return <span style={{ fontSize: "0.75rem", color: "#94a3b8", fontStyle: "italic" }}>Vous</span>;

  async function toggleStatus() {
    setLoading(true);
    await fetch(`/api/admin/users/${userId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !isActive }),
    });
    setLoading(false);
    window.location.reload();
  }

  async function handleDelete() {
    setLoading(true);
    const res = await fetch(`/api/admin/users/${userId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ replacementUserId: replacementId || undefined }),
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok && data.requiresReplacement) {
      setReplacementInfo({ clientCount: data.clientCount, bonCount: data.bonCount });
      return;
    }
    if (!res.ok) { alert(data.message); return; }
    window.location.reload();
  }

  const btnBase: React.CSSProperties = { display: "inline-flex", alignItems: "center", padding: "0.3rem 0.65rem", borderRadius: "999px", fontSize: "0.75rem", fontWeight: 600, border: "none", cursor: "pointer", transition: "opacity 0.15s" };

  return (
    <>
      <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", justifyContent: "flex-end" }}>
        <button type="button" onClick={toggleStatus} disabled={loading} style={{ ...btnBase, background: isActive ? "#fef2f2" : "#f0fdf4", color: isActive ? "#dc2626" : "#15803d" }}>
          {isActive ? "Désactiver" : "Activer"}
        </button>
        <button type="button" onClick={() => { setShowDeleteModal(true); setReplacementInfo(null); setReplacementId(""); }} disabled={loading} style={{ ...btnBase, background: "#fef2f2", color: "#dc2626" }}>
          Supprimer
        </button>
      </div>

      {/* Modale de confirmation suppression */}
      {showDeleteModal && (
        <div style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem" }}>
          <button type="button" onClick={() => setShowDeleteModal(false)} style={{ position: "absolute", inset: 0, background: "rgba(15,23,42,0.5)", backdropFilter: "blur(4px)", border: "none", cursor: "pointer" }} />
          <div style={{ position: "relative", zIndex: 10000, width: "100%", maxWidth: "480px", borderRadius: "1.5rem", background: "#fff", border: "1px solid rgba(217,227,240,0.9)", boxShadow: "0 24px 64px rgba(15,23,42,0.18)", padding: "1.75rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div>
              <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 700, color: "#0f172a" }}>
                {roleCode === "atc" ? "Supprimer l'ATC" : "Supprimer l'utilisateur"}
              </h3>
              <p style={{ margin: "0.35rem 0 0", fontSize: "0.875rem", color: "#6b7280" }}>
                Vous allez supprimer <strong>{userName}</strong>. Cette action est irréversible.
              </p>
            </div>

            {replacementInfo && (
              <div style={{ borderRadius: "0.875rem", background: "#fffbeb", border: "1px solid #fde68a", padding: "1rem" }}>
                <p style={{ margin: "0 0 0.75rem", fontSize: "0.82rem", fontWeight: 700, color: "#b45309" }}>
                  Remplacement requis — {replacementInfo.clientCount} client{replacementInfo.clientCount > 1 ? "s" : ""} · {replacementInfo.bonCount} bon{replacementInfo.bonCount > 1 ? "s" : ""} actif{replacementInfo.bonCount > 1 ? "s" : ""}
                </p>
                <select
                  value={replacementId}
                  onChange={(e) => setReplacementId(e.target.value)}
                  style={{ width: "100%", padding: "0.65rem 1rem", borderRadius: "0.75rem", border: "1px solid #dce5f0", background: "#fff", fontSize: "0.875rem", outline: "none" }}
                >
                  <option value="">— Choisir un ATC remplaçant —</option>
                  {atcs.filter((a) => a.id !== userId).map((a) => (
                    <option key={a.id} value={a.id}>{`${a.first_name} ${a.last_name}`.trim()} · {a.email}</option>
                  ))}
                </select>
              </div>
            )}

            <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
              <button type="button" onClick={() => setShowDeleteModal(false)} style={{ padding: "0.65rem 1.25rem", borderRadius: "0.875rem", border: "1px solid #e2e8f0", background: "#f8fafc", fontSize: "0.875rem", fontWeight: 600, cursor: "pointer" }}>
                Annuler
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={loading || (replacementInfo !== null && !replacementId)}
                style={{ padding: "0.65rem 1.25rem", borderRadius: "0.875rem", background: "#dc2626", color: "#fff", fontSize: "0.875rem", fontWeight: 700, border: "none", cursor: "pointer" }}
              >
                {loading ? "Suppression..." : "Confirmer la suppression"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}