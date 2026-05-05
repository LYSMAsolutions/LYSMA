"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

interface Compagnon {
  id: string;
  nom: string | null;
  prenom: string | null;
  matricule: string | null;
}

interface LiveSession {
  id: string;
  startTime: string;
  dossier: string | null;
  user: { nom: string | null; prenom: string | null; matricule: string | null };
}

export default function AtelierPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [compagnons, setCompagnons] = useState<Compagnon[]>([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [pin, setPin] = useState(["", "", "", ""]);
  const [dossier, setDossier] = useState("");
  const [liveSessions, setLiveSessions] = useState<LiveSession[]>([]);
  const [elapsed, setElapsed] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">("success");

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  const fetchCompagnons = async () => {
    const res = await fetch("/api/users/list");
    const data = await res.json();
    setCompagnons(data.users || []);
    if (data.users?.length > 0) setSelectedUserId(data.users[0].id);
  };

  const fetchLive = async () => {
    const res = await fetch("/api/session/live");
    const data = await res.json();
    setLiveSessions(data.sessions || []);
  };

  useEffect(() => {
    if (status === "authenticated") {
      fetchCompagnons();
      fetchLive();
      const interval = setInterval(fetchLive, 10000);
      return () => clearInterval(interval);
    }
  }, [status]);

  // Timer live
  useEffect(() => {
    const tick = setInterval(() => {
      const now = Date.now();
      const newElapsed: Record<string, number> = {};
      liveSessions.forEach((s) => {
        newElapsed[s.id] = Math.floor((now - new Date(s.startTime).getTime()) / 1000);
      });
      setElapsed(newElapsed);
    }, 1000);
    return () => clearInterval(tick);
  }, [liveSessions]);

  const formatElapsed = (sec: number) => {
    const h = Math.floor(sec / 3600).toString().padStart(2, "0");
    const m = Math.floor((sec % 3600) / 60).toString().padStart(2, "0");
    const s = (sec % 60).toString().padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  const handlePinChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newPin = [...pin];
    newPin[index] = value.slice(-1);
    setPin(newPin);
    if (value && index < 3) {
      document.getElementById(`pin-${index + 1}`)?.focus();
    }
  };

  const handlePinKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !pin[index] && index > 0) {
      document.getElementById(`pin-${index - 1}`)?.focus();
    }
  };

  const getPinValue = () => pin.join("");

  const clearPin = () => {
    setPin(["", "", "", ""]);
    document.getElementById("pin-0")?.focus();
  };

  const handleStart = async () => {
    const pinValue = getPinValue();
    if (!selectedUserId) return setMessage("Sélectionne un compagnon"), setMessageType("error");
    if (pinValue.length !== 4) return setMessage("PIN 4 chiffres requis"), setMessageType("error");
    if (!dossier.trim()) return setMessage("Référence intervention requise"), setMessageType("error");

    setLoading(true);
    setMessage("");

    const res = await fetch("/api/session/start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: selectedUserId, pinCode: pinValue, dossier, comment: "" }),
    });

    const data = await res.json();
    setLoading(false);

    if (data.success) {
      setMessage("Session démarrée");
      setMessageType("success");
      clearPin();
      setDossier("");
      fetchLive();
    } else {
      setMessage(data.error || "Erreur");
      setMessageType("error");
      clearPin();
    }
  };

  const handleStop = async (sessionId: string) => {
    const res = await fetch("/api/session/stop", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId }),
    });
    const data = await res.json();
    if (data.success) {
      setMessage(`Session arrêtée — ${data.session.durationMin} min`);
      setMessageType("success");
      fetchLive();
    }
  };

  const garage = session?.user as any;

  if (status === "loading") {
    return <div style={{ minHeight: "100vh", background: "#070d1a", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ color: "rgba(77,144,254,0.5)", fontFamily: "'JetBrains Mono',monospace", fontSize: "0.75rem", letterSpacing: "0.3em" }}>CHARGEMENT...</p>
    </div>;
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;700;800;900&family=JetBrains+Mono:wght@400;500;700&family=Rajdhani:wght@400;500;600;700&display=swap');

        .at2-root{min-height:100vh;background:#070d1a;font-family:'Rajdhani',sans-serif;position:relative;overflow-x:hidden;padding:1.5rem}
        .at2-bg{position:fixed;inset:0;pointer-events:none;z-index:0}
        .at2-navy{position:absolute;inset:0;background:radial-gradient(ellipse 90% 70% at 50% 30%,#0a1a3e 0%,#070d1a 65%)}
        .at2-glow{position:absolute;top:-100px;left:50%;transform:translateX(-50%);width:700px;height:500px;background:radial-gradient(circle,rgba(37,99,235,0.1) 0%,transparent 70%)}
        .at2-arrows{position:absolute;left:-40px;top:40%;opacity:0.07}
        .at2-arrow{width:0;height:0;border-top:60px solid transparent;border-bottom:60px solid transparent;border-left:70px solid #2563eb;margin-bottom:-22px}
        .at2-arrow:nth-child(2){opacity:.7;margin-left:30px}
        .at2-arrow:nth-child(3){opacity:.4;margin-left:60px}
        .at2-dots{position:absolute;right:50px;bottom:50px;display:grid;grid-template-columns:repeat(7,1fr);gap:8px;opacity:0.07}
        .at2-dot{width:3px;height:3px;border-radius:50%;background:#4d90fe}
        .at2-scan{position:absolute;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(77,144,254,0.12),transparent);animation:at2-scan 8s linear infinite}
        @keyframes at2-scan{0%{top:0}100%{top:100%}}

        .at2-wrap{position:relative;z-index:1;max-width:700px;margin:0 auto}

        .at2-header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:2rem;padding-bottom:1.25rem;border-bottom:1px solid rgba(37,99,235,0.12)}
        .at2-badge{display:inline-flex;align-items:center;gap:6px;background:rgba(37,99,235,0.08);border:1px solid rgba(37,99,235,0.2);padding:4px 10px;margin-bottom:0.5rem}
        .at2-badge-dot{width:5px;height:5px;border-radius:50%;background:#4d90fe;animation:at2-pulse 2s infinite}
        @keyframes at2-pulse{0%,100%{opacity:1;box-shadow:0 0 0 0 rgba(77,144,254,0.4)}50%{opacity:.7;box-shadow:0 0 0 4px rgba(77,144,254,0)}}
        .at2-badge-text{font-size:0.58rem;letter-spacing:0.22em;text-transform:uppercase;color:#4d90fe;font-family:'JetBrains Mono',monospace}
        .at2-title{font-family:'Barlow Condensed',sans-serif;font-size:1.7rem;font-weight:900;letter-spacing:0.06em}
        .at2-title .g{background:linear-gradient(135deg,#c0cfe8,#fff);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .at2-title .t{background:linear-gradient(135deg,#1d4ed8,#4d90fe);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .at2-sub{font-size:0.6rem;color:rgba(100,140,200,0.4);letter-spacing:0.12em;text-transform:uppercase;font-family:'JetBrains Mono',monospace;margin-top:2px}
        .at2-logout{background:transparent;border:1px solid rgba(37,99,235,0.15);color:rgba(100,140,200,0.4);padding:0.4rem 0.8rem;font-family:'Barlow Condensed',sans-serif;font-size:0.8rem;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;cursor:pointer;transition:all 0.2s}
        .at2-logout:hover{border-color:rgba(77,144,254,0.35);color:#4d90fe}

        .at2-panel{background:rgba(10,25,70,0.4);border:1px solid rgba(37,99,235,0.18);padding:1.5rem;margin-bottom:1.25rem;position:relative;overflow:hidden}
        .at2-panel::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,rgba(37,99,235,0.4),transparent)}

        .at2-panel-title{font-family:'Barlow Condensed',sans-serif;font-size:1rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:rgba(180,200,255,0.6);margin-bottom:1rem;display:flex;align-items:center;gap:8px}

        .at2-field-label{display:block;font-size:0.58rem;letter-spacing:0.22em;text-transform:uppercase;color:rgba(100,140,200,0.5);margin-bottom:0.4rem;font-family:'JetBrains Mono',monospace}

        .at2-select{width:100%;background:rgba(5,15,50,0.7);border:1px solid rgba(37,99,235,0.25);color:#c8d8f0;padding:0.8rem 1rem;font-family:'Rajdhani',sans-serif;font-size:1rem;font-weight:600;outline:none;cursor:pointer;appearance:none;-webkit-appearance:none;transition:all 0.2s}
        .at2-select:focus{border-color:rgba(77,144,254,0.4);background:rgba(37,99,235,0.07)}
        .at2-select option{background:#0a1a3e;color:#c8d8f0}

        .at2-grid-2{display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem}
        @media(max-width:500px){.at2-grid-2{grid-template-columns:1fr}}

        .at2-pin-row{display:flex;gap:0.5rem}
        .at2-pin-box{width:52px;height:52px;text-align:center;background:rgba(5,15,50,0.7);border:1px solid rgba(37,99,235,0.25);color:#4d90fe;font-family:'JetBrains Mono',monospace;font-size:1.4rem;font-weight:700;outline:none;transition:all 0.2s;-webkit-text-security:disc}
        .at2-pin-box:focus{border-color:#4d90fe;background:rgba(37,99,235,0.1);box-shadow:0 0 0 2px rgba(77,144,254,0.15)}

        .at2-input{width:100%;background:rgba(5,15,50,0.7);border:1px solid rgba(37,99,235,0.25);color:#c8d8f0;padding:0.8rem 1rem;font-family:'JetBrains Mono',monospace;font-size:0.9rem;outline:none;transition:all 0.2s;letter-spacing:0.05em}
        .at2-input:focus{border-color:rgba(77,144,254,0.4);background:rgba(37,99,235,0.06)}
        .at2-input::placeholder{color:rgba(80,120,180,0.2)}

        .at2-btn-start{width:100%;padding:1.1rem;background:linear-gradient(135deg,#0d5c2e,#16a34a);border:none;color:#d1fae5;font-family:'Barlow Condensed',sans-serif;font-size:1.4rem;font-weight:800;letter-spacing:0.15em;text-transform:uppercase;cursor:pointer;transition:all 0.2s;display:flex;align-items:center;justify-content:center;gap:10px}
        .at2-btn-start:hover{background:linear-gradient(135deg,#16a34a,#22c55e);transform:translateY(-1px);box-shadow:0 6px 25px rgba(22,163,74,0.3)}
        .at2-btn-start:disabled{opacity:0.5;cursor:not-allowed;transform:none}

        .at2-msg{padding:0.6rem 0.9rem;font-size:0.72rem;font-family:'JetBrains Mono',monospace;letter-spacing:0.05em;margin-top:0.75rem;text-align:center}
        .at2-msg.success{background:rgba(22,163,74,0.08);border:1px solid rgba(22,163,74,0.2);color:rgba(134,239,172,0.8)}
        .at2-msg.error{background:rgba(220,38,38,0.08);border:1px solid rgba(220,38,38,0.2);color:rgba(248,113,113,0.8)}

        .at2-live-table{width:100%;border-collapse:collapse}
        .at2-live-table th{padding:0.5rem 0.75rem;text-align:left;font-size:0.58rem;letter-spacing:0.2em;text-transform:uppercase;color:rgba(80,120,180,0.4);font-family:'JetBrains Mono',monospace;font-weight:400;border-bottom:1px solid rgba(37,99,235,0.12)}
        .at2-live-table td{padding:0.75rem 0.75rem;border-bottom:1px solid rgba(37,99,235,0.08);font-family:'JetBrains Mono',monospace;font-size:0.75rem}
        .at2-live-table tr:hover td{background:rgba(37,99,235,0.04)}
        .at2-td-name{color:rgba(180,200,255,0.9);font-weight:500;font-family:'Barlow Condensed',sans-serif;font-size:1rem}
        .at2-td-dossier{color:#4d90fe}
        .at2-td-time{color:#00d68f;font-weight:700}
        .at2-td-mat{color:rgba(100,140,200,0.4)}

        .at2-btn-stop{padding:0.4rem 0.85rem;background:linear-gradient(135deg,#7c1212,#dc2626);border:none;color:#fee2e2;font-family:'Barlow Condensed',sans-serif;font-size:0.9rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;cursor:pointer;transition:all 0.15s}
        .at2-btn-stop:hover{background:linear-gradient(135deg,#dc2626,#ef4444)}

        .at2-empty{text-align:center;padding:2.5rem;color:rgba(80,120,180,0.3);font-size:0.7rem;letter-spacing:0.2em;text-transform:uppercase;font-family:'JetBrains Mono',monospace;border:1px dashed rgba(37,99,235,0.12)}

        .at2-footer{display:flex;justify-content:space-between;margin-top:1.5rem;padding-top:1rem;border-top:1px solid rgba(37,99,235,0.1)}
        .at2-footer-live{display:flex;align-items:center;gap:6px}
        .at2-footer-dot{width:5px;height:5px;border-radius:50%;background:#00d68f;box-shadow:0 0 5px rgba(0,214,143,0.5);animation:at2-blink 2.5s infinite}
        @keyframes at2-blink{0%,100%{opacity:1}50%{opacity:.3}}
        .at2-footer-text{font-size:0.56rem;letter-spacing:0.18em;text-transform:uppercase;color:rgba(80,120,180,0.3);font-family:'JetBrains Mono',monospace}
      `}</style>

      <div className="at2-root">
        <div className="at2-bg">
          <div className="at2-navy" />
          <div className="at2-glow" />
          <div className="at2-arrows">
            <div className="at2-arrow" /><div className="at2-arrow" /><div className="at2-arrow" />
          </div>
          <div className="at2-dots">{Array.from({ length: 35 }).map((_, i) => <div key={i} className="at2-dot" />)}</div>
          <div className="at2-scan" />
        </div>

        <div className="at2-wrap">
          {/* Header */}
          <div className="at2-header">
            <div>
              <div className="at2-badge"><div className="at2-badge-dot" /><span className="at2-badge-text">LYSMA Solutions</span></div>
              <div className="at2-title"><span className="g">GARAGE</span><span className="t">TIMER</span></div>
              <div className="at2-sub">{garage?.garageName} · Espace atelier</div>
            </div>
            <button className="at2-logout" onClick={() => signOut({ callbackUrl: "/login" })}>Quitter</button>
          </div>

          {/* Formulaire démarrage */}
          <div className="at2-panel">
            <div className="at2-panel-title">▶ Démarrer une session</div>

            <div className="at2-grid-2">
              <div>
                <label className="at2-field-label">Compagnon</label>
                <select
                  className="at2-select"
                  value={selectedUserId}
                  onChange={(e) => setSelectedUserId(e.target.value)}
                >
                  {compagnons.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.prenom} {c.nom}{c.matricule ? ` — ${c.matricule}` : ""}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="at2-field-label">PIN (4 chiffres)</label>
                <div className="at2-pin-row">
                  {[0, 1, 2, 3].map((i) => (
                    <input
                      key={i}
                      id={`pin-${i}`}
                      type="password"
                      inputMode="numeric"
                      maxLength={1}
                      className="at2-pin-box"
                      value={pin[i]}
                      onChange={(e) => handlePinChange(i, e.target.value)}
                      onKeyDown={(e) => handlePinKeyDown(i, e)}
                      autoComplete="off"
                    />
                  ))}
                </div>
              </div>
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <label className="at2-field-label">Référence intervention (OR / immat / texte)</label>
              <input
                className="at2-input"
                type="text"
                value={dossier}
                onChange={(e) => setDossier(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleStart()}
                placeholder="Ex : OR12345 — AB-123-CD — Freins"
              />
            </div>

            <button className="at2-btn-start" onClick={handleStart} disabled={loading}>
              <span>▶</span>
              <span>{loading ? "DÉMARRAGE..." : "DÉMARRER"}</span>
            </button>

            {message && <div className={`at2-msg ${messageType}`}>{messageType === "success" ? "✓" : "⚠"} {message}</div>}
          </div>

          {/* Sessions en cours */}
          <div className="at2-panel">
            <div className="at2-panel-title">
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: liveSessions.length > 0 ? "#00d68f" : "rgba(80,120,180,0.4)", display: "inline-block", animation: liveSessions.length > 0 ? "at2-blink 2s infinite" : "none" }} />
              Sessions en cours ({liveSessions.length})
            </div>

            {liveSessions.length === 0 ? (
              <div className="at2-empty">Aucune session active</div>
            ) : (
              <table className="at2-live-table">
                <thead>
                  <tr>
                    <th>Compagnon</th>
                    <th>Mat.</th>
                    <th>Dossier</th>
                    <th>Durée</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {liveSessions.map((s) => (
                    <tr key={s.id}>
                      <td className="at2-td-name">{s.user.prenom} {s.user.nom}</td>
                      <td className="at2-td-mat">{s.user.matricule || "—"}</td>
                      <td className="at2-td-dossier">{s.dossier || "—"}</td>
                      <td className="at2-td-time">{formatElapsed(elapsed[s.id] || 0)}</td>
                      <td><button className="at2-btn-stop" onClick={() => handleStop(s.id)}>■ STOP</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            <p style={{ fontSize: "0.56rem", color: "rgba(80,120,180,0.3)", letterSpacing: "0.15em", textAlign: "right", marginTop: "0.75rem", fontFamily: "'JetBrains Mono',monospace", textTransform: "uppercase" }}>
              ↻ Mise à jour auto toutes les 10s
            </p>
          </div>

          <div className="at2-footer">
            <div className="at2-footer-live"><div className="at2-footer-dot" /><span className="at2-footer-text">Système opérationnel</span></div>
            <span className="at2-footer-text">v1.0.0</span>
          </div>
        </div>
      </div>
    </>
  );
}
