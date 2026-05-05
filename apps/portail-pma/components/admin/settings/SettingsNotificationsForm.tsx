"use client";

import { useEffect, useState } from "react";

const NOTIF_EVENTS = [
  { code: "bon_created",       label: "Bon créé",               desc: "Notifier le magasin à la création d'un bon" },
  { code: "bon_pris_en_charge",label: "Bon pris en charge",     desc: "Notifier l'ATC quand le magasin prend en charge un bon" },
  { code: "bon_traite",        label: "Bon traité",             desc: "Notifier l'ATC et le client quand un bon est traité" },
  { code: "bon_a_corriger",    label: "Bon à corriger",         desc: "Notifier l'ATC quand un bon doit être corrigé" },
  { code: "bon_refuse",        label: "Bon refusé",             desc: "Notifier l'ATC quand un bon est refusé" },
  { code: "bon_alerte_delai",  label: "Alerte délai dépassé",   desc: "Notifier le RDM quand un bon dépasse le délai configuré" },
  { code: "transfert_demande", label: "Demande de transfert",   desc: "Notifier l'admin/RDM à chaque nouvelle demande de transfert portefeuille" },
  { code: "user_created",      label: "Nouvel utilisateur",     desc: "Envoyer les identifiants au nouvel utilisateur à la création" },
];

export default function SettingsNotificationsForm() {
  const [enabled,   setEnabled]  = useState<Record<string, boolean>>({});
  const [emailFrom, setEmailFrom]= useState("");
  const [loading,   setLoading]  = useState(false);
  const [fetching,  setFetching] = useState(true);
  const [error,     setError]    = useState("");
  const [success,   setSuccess]  = useState("");

  useEffect(() => {
    fetch("/api/admin/settings/general")
      .then((r) => r.json())
      .then((d) => {
        if (d.success && d.settings?.notifications_config) {
          const cfg = d.settings.notifications_config;
          setEnabled(cfg.events || {});
          setEmailFrom(cfg.email_from || "");
        }
      })
      .finally(() => setFetching(false));
  }, []);

  function toggle(code: string) {
    setEnabled((prev) => ({ ...prev, [code]: !prev[code] }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setLoading(true); setError(""); setSuccess("");
    try {
      const res = await fetch("/api/admin/settings/general", {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notifications_config: { events: enabled, email_from: emailFrom } }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || "Erreur."); return; }
      setSuccess("Notifications enregistrées.");
    } catch { setError("Erreur réseau."); }
    finally { setLoading(false); }
  }

  if (fetching) return <div style={{ padding: "2rem", textAlign: "center", color: "#94a3b8" }}>Chargement...</div>;

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

      <div style={{ padding: "1rem 1.25rem", borderRadius: "0.875rem", background: "rgba(255,251,235,0.6)", border: "1px solid #fde68a" }}>
        <p style={{ margin: 0, fontSize: "0.82rem", color: "#92400e" }}>
          ⚠️ L'envoi d'emails nécessite la configuration d'un service SMTP. Les notifications seront enregistrées mais les emails seront envoyés uniquement une fois le service email configuré.
        </p>
      </div>

      <div>
        <label style={{ display: "block", marginBottom: "0.4rem", fontSize: "0.8rem", fontWeight: 700, color: "#334155", textTransform: "uppercase", letterSpacing: "0.06em" }}>Email expéditeur</label>
        <input type="email" value={emailFrom} onChange={(e) => setEmailFrom(e.target.value)} placeholder="noreply@votresociete.fr" style={{ width: "100%", padding: "0.75rem 1rem", borderRadius: "0.875rem", border: "1px solid #dce5f0", background: "rgba(255,255,255,0.92)", fontSize: "0.875rem", color: "#0f172a", outline: "none" }} />
      </div>

      <div>
        <p style={{ margin: "0 0 0.75rem", fontSize: "0.8rem", fontWeight: 700, color: "#334155", textTransform: "uppercase", letterSpacing: "0.06em" }}>Événements notifiés</p>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {NOTIF_EVENTS.map((ev) => {
            const on = enabled[ev.code] ?? false;
            return (
              <label key={ev.code} onClick={() => toggle(ev.code)} style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "1rem 1.25rem", borderRadius: "1rem", border: "1px solid", borderColor: on ? "#bfdbfe" : "#e2e8f0", background: on ? "rgba(239,246,255,0.4)" : "#f8fafc", cursor: "pointer", transition: "all 0.15s" }}>
                <div style={{ width: "36px", height: "20px", borderRadius: "999px", background: on ? "#0a4d9b" : "#e2e8f0", position: "relative", flexShrink: 0, transition: "background 0.15s" }}>
                  <div style={{ position: "absolute", top: "2px", left: on ? "18px" : "2px", width: "16px", height: "16px", borderRadius: "50%", background: "#fff", transition: "left 0.15s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} />
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: "0.875rem", fontWeight: 700, color: "#0f172a" }}>{ev.label}</p>
                  <p style={{ margin: 0, fontSize: "0.75rem", color: "#6b7280" }}>{ev.desc}</p>
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {error   && <div style={{ padding: "0.875rem", borderRadius: "0.875rem", background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", fontSize: "0.875rem" }}>{error}</div>}
      {success && <div style={{ padding: "0.875rem", borderRadius: "0.875rem", background: "#f0fdf4", border: "1px solid #bbf7d0", color: "#15803d", fontSize: "0.875rem" }}>{success}</div>}

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button type="submit" disabled={loading} style={{ padding: "0.75rem 2rem", borderRadius: "0.875rem", background: loading ? "#94a3b8" : "linear-gradient(135deg,#0a4d9b,#1e73d8)", color: "#fff", fontWeight: 700, fontSize: "0.9rem", border: "none", cursor: loading ? "not-allowed" : "pointer", boxShadow: "0 8px 20px rgba(30,115,216,0.25)" }}>
          {loading ? "Enregistrement..." : "Enregistrer"}
        </button>
      </div>
    </form>
  );
}