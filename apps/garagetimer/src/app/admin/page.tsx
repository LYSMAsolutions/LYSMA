"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

type Tab = "live" | "history" | "users" | "settings";

interface LiveSession {
  id: string; startTime: string; dossier: string | null;
  user: { nom: string | null; prenom: string | null; matricule: string | null };
}
interface HistoryEntry {
  id: string; dossier: string | null; comment: string | null;
  startTime: string; endTime: string; durationMin: number;
  nomPrenom: string | null; matricule: string | null;
  tempsConstructeurMin: number | null; indice: string | null;
}
interface User {
  id: string; nom: string | null; prenom: string | null;
  matricule: string | null; role: string; isActive: boolean; email: string | null;
}

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("live");
  const [liveSessions, setLiveSessions] = useState<LiveSession[]>([]);
  const [elapsed, setElapsed] = useState<Record<string, number>>({});
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [filterDate, setFilterDate] = useState("");
  const [filterDossier, setFilterDossier] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ text: "", type: "" });

  // User form
  const [uPrenom, setUPrenom] = useState("");
  const [uNom, setUNom] = useState("");
  const [uMatricule, setUMatricule] = useState("");
  const [uPin, setUPin] = useState("");
  const [uRole, setURole] = useState("ATELIER");
  const [editUserId, setEditUserId] = useState("");

  // Settings form
  const [sName, setSName] = useState("");
  const [sEmail, setSEmail] = useState("");
  const [sAdminPwd, setSAdminPwd] = useState("");
  const [sAtelierPwd, setSAtelierPwd] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [logoLoading, setLogoLoading] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (status === "authenticated") {
      const u = session?.user as any;
      if (u?.role !== "ADMIN") router.push("/atelier");
    }
  }, [status, session, router]);

  const fetchLive = useCallback(async () => {
    try {
      const res = await fetch("/api/session/live");
      if (!res.ok) return;
      const text = await res.text();
      if (!text) return;
      const data = JSON.parse(text);
      setLiveSessions(data.sessions || []);
    } catch (e) {
      console.error("fetchLive error:", e);
    }
  }, []);

  useEffect(() => {
    fetchLive();
    const i = setInterval(fetchLive, 10000);
    return () => clearInterval(i);
  }, [fetchLive]);

  useEffect(() => {
    const tick = setInterval(() => {
      const now = Date.now();
      const e: Record<string, number> = {};
      liveSessions.forEach((s) => {
        e[s.id] = Math.floor((now - new Date(s.startTime).getTime()) / 1000);
      });
      setElapsed(e);
    }, 1000);
    return () => clearInterval(tick);
  }, [liveSessions]);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const p = new URLSearchParams();
      if (filterDate) { p.set("from", filterDate); p.set("to", filterDate); }
      if (filterDossier) p.set("dossier", filterDossier);
      const res = await fetch(`/api/history/list?${p}`);
      if (!res.ok) return;
      const data = await res.json();
      setHistory(data.history || []);
    } catch (e) {
      console.error("fetchHistory error:", e);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/users/manage");
      if (!res.ok) return;
      const data = await res.json();
      setUsers(data.users || []);
    } catch (e) {
      console.error("fetchUsers error:", e);
    }
  };

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/garage/settings");
      if (!res.ok) return;
      const data = await res.json();
      if (data.garage) {
        setSName(data.garage.name || "");
        setSEmail(data.garage.email || "");
        setLogoUrl(data.garage.logoUrl || "");
      }
    } catch (e) {
      console.error("fetchSettings error:", e);
    }
  };

  useEffect(() => {
    if (tab === "history") fetchHistory();
    if (tab === "users") fetchUsers();
    if (tab === "settings") fetchSettings();
  }, [tab]);

  const forceStop = async (sessionId: string) => {
    try {
      await fetch("/api/session/stop", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, stopPar: "ADMIN" }),
      });
      fetchLive();
    } catch (e) {
      console.error(e);
    }
  };

  const saveUser = async () => {
    if (!uPrenom) return setMsg({ text: "Prénom obligatoire", type: "err" });
    if (!uMatricule) return setMsg({ text: "Matricule obligatoire", type: "err" });
    if (uPin && !/^\d{4,6}$/.test(uPin)) return setMsg({ text: "PIN invalide (4-6 chiffres)", type: "err" });

    try {
      const method = editUserId ? "PUT" : "POST";
      const body = editUserId
        ? { id: editUserId, prenom: uPrenom, nom: uNom, matricule: uMatricule, role: uRole, pinCode: uPin }
        : { prenom: uPrenom, nom: uNom, matricule: uMatricule, role: uRole, pinCode: uPin };

      const res = await fetch("/api/users/manage", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const text = await res.text();
      if (!text) return setMsg({ text: "Réponse vide du serveur", type: "err" });
      const data = JSON.parse(text);

      if (data.success) {
        setMsg({ text: editUserId ? "Modifié ✓" : "Créé ✓", type: "ok" });
        setUPrenom(""); setUNom(""); setUMatricule(""); setUPin(""); setURole("ATELIER"); setEditUserId("");
        fetchUsers();
      } else {
        setMsg({ text: data.error || "Erreur", type: "err" });
      }
    } catch (e) {
      setMsg({ text: "Erreur réseau", type: "err" });
    }
  };

  const toggleUser = async (id: string) => {
    try {
      await fetch("/api/users/manage", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      fetchUsers();
    } catch (e) {
      console.error(e);
    }
  };

  const editUser = (u: User) => {
    setEditUserId(u.id); setUPrenom(u.prenom || ""); setUNom(u.nom || "");
    setUMatricule(u.matricule || ""); setUPin(""); setURole(u.role);
    setMsg({ text: "", type: "" });
  };

  const saveSettings = async () => {
    if (!sName) return setMsg({ text: "Nom obligatoire", type: "err" });
    try {
      const res = await fetch("/api/garage/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: sName, email: sEmail, adminPassword: sAdminPwd || undefined, atelierPassword: sAtelierPwd || undefined }),
      });
      const data = await res.json();
      setMsg(data.success ? { text: "Enregistré ✓", type: "ok" } : { text: data.error || "Erreur", type: "err" });
    } catch (e) {
      setMsg({ text: "Erreur réseau", type: "err" });
    }
  };

  const uploadLogo = async (file: File) => {
    setLogoLoading(true);
    try {
      const form = new FormData();
      form.append("logo", file);
      const res = await fetch("/api/garage/logo", { method: "POST", body: form });
      const data = await res.json();
      if (data.success) {
        setLogoUrl(data.logoUrl + "?t=" + Date.now());
        setMsg({ text: "Logo enregistré ✓", type: "ok" });
      } else {
        setMsg({ text: data.error || "Erreur upload", type: "err" });
      }
    } catch (e) {
      setMsg({ text: "Erreur upload", type: "err" });
    } finally {
      setLogoLoading(false);
    }
  };

  const exportCSV = () => {
    if (!history.length) return;
    const cols = ["Dossier", "Compagnon", "Matricule", "Début", "Fin", "Durée (min)", "H. réelles", "Temps constructeur (min)", "H. constructeur", "Indice"];
    const esc = (v: any) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const rows = [cols.join(";")].concat(
      history.map((h) => [
        h.dossier, h.nomPrenom, h.matricule,
        h.startTime?.slice(0, 16), h.endTime?.slice(0, 16),
        h.durationMin,
        (Math.round((h.durationMin / 60) * 100) / 100).toFixed(2),
        h.tempsConstructeurMin ?? "",
        h.tempsConstructeurMin ? (Math.round((h.tempsConstructeurMin / 60) * 100) / 100).toFixed(2) : "",
        h.indice ?? ""
      ].map(esc).join(";"))
    );
    const blob = new Blob(["\uFEFF" + rows.join("\n")], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `GARAGETIMER_${filterDate || "historique"}.csv`;
    a.click();
  };

  const updateTempsCon = async (historyId: string, val: string) => {
    try {
      const min = val ? Math.round(Number(val) * 60) : null;
      const res = await fetch("/api/history/list", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ historyId, tempsConstructeurMin: min }),
      });
      const data = await res.json();
      if (data.success) {
        setHistory((prev) => prev.map((h) => h.id === historyId ? { ...h, tempsConstructeurMin: min, indice: data.indice } : h));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fmtTime = (dt: string) => new Date(dt).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "2-digit", hour: "2-digit", minute: "2-digit" });
  const fmtElapsed = (s: number) => `${Math.floor(s / 3600).toString().padStart(2, "0")}:${Math.floor((s % 3600) / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;
  const fmtH = (min: number) => (Math.round((min / 60) * 100) / 100).toFixed(2) + "h";

  const garage = session?.user as any;

  if (status === "loading") return (
    <div style={{ minHeight: "100vh", background: "#070d1a", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ color: "rgba(77,144,254,0.5)", fontFamily: "'JetBrains Mono',monospace", fontSize: "0.75rem", letterSpacing: "0.3em" }}>CHARGEMENT...</p>
    </div>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800;900&family=JetBrains+Mono:wght@300;400;500;700&family=Rajdhani:wght@400;500;600;700&display=swap');
        .adm2-root{min-height:100vh;background:#070d1a;font-family:'Rajdhani',sans-serif;position:relative;overflow-x:hidden}
        .adm2-bg{position:fixed;inset:0;pointer-events:none;z-index:0}
        .adm2-navy{position:absolute;inset:0;background:radial-gradient(ellipse 100% 60% at 0% 0%,#0a1f4e 0%,#070d1a 55%)}
        .adm2-glow{position:absolute;top:-100px;left:-100px;width:500px;height:500px;background:radial-gradient(circle,rgba(37,99,235,0.12) 0%,transparent 70%)}
        .adm2-dots{position:absolute;right:40px;top:60px;display:grid;grid-template-columns:repeat(10,1fr);gap:7px;opacity:0.07}
        .adm2-dot{width:3px;height:3px;border-radius:50%;background:#4d90fe}
        .adm2-scan{position:absolute;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(77,144,254,0.15),transparent);animation:adm2-scan 8s linear infinite}
        @keyframes adm2-scan{0%{top:0}100%{top:100%}}
        .adm2-content{position:relative;z-index:1;max-width:1100px;margin:0 auto;padding:1.75rem 1.5rem}
        .adm2-header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:2rem;padding-bottom:1.25rem;border-bottom:1px solid rgba(37,99,235,0.12)}
        .adm2-badge{display:inline-flex;align-items:center;gap:6px;background:rgba(37,99,235,0.08);border:1px solid rgba(37,99,235,0.2);padding:4px 10px;margin-bottom:0.5rem}
        .adm2-badge-dot{width:5px;height:5px;border-radius:50%;background:#4d90fe;animation:adm2-pulse 2s infinite}
        @keyframes adm2-pulse{0%,100%{opacity:1}50%{opacity:.7}}
        .adm2-badge-text{font-size:0.58rem;letter-spacing:0.22em;text-transform:uppercase;color:#4d90fe;font-family:'JetBrains Mono',monospace}
        .adm2-title{font-family:'Barlow Condensed',sans-serif;font-size:2rem;font-weight:900;letter-spacing:0.06em;line-height:1}
        .adm2-title .g{background:linear-gradient(135deg,#c0cfe8,#fff);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .adm2-title .t{background:linear-gradient(135deg,#1d4ed8,#4d90fe);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .adm2-title .slash{color:rgba(77,144,254,0.4);margin:0 6px;font-weight:300}
        .adm2-title .admin{color:rgba(180,200,255,0.5);font-size:1.3rem;font-weight:400}
        .adm2-sub{font-size:0.6rem;color:rgba(100,140,200,0.4);letter-spacing:0.15em;text-transform:uppercase;font-family:'JetBrains Mono',monospace;margin-top:3px}
        .adm2-logout{background:transparent;border:1px solid rgba(37,99,235,0.2);color:rgba(100,140,200,0.5);padding:0.5rem 1rem;font-family:'Barlow Condensed',sans-serif;font-size:0.85rem;font-weight:600;letter-spacing:0.15em;text-transform:uppercase;cursor:pointer;transition:all 0.2s}
        .adm2-logout:hover{border-color:rgba(77,144,254,0.4);color:#4d90fe}
        .adm2-kpis{display:flex;gap:1rem;margin-bottom:1.75rem;flex-wrap:wrap}
        .adm2-kpi{flex:1;min-width:120px;background:rgba(10,25,70,0.4);border:1px solid rgba(37,99,235,0.15);padding:1rem 1.25rem;position:relative;overflow:hidden}
        .adm2-kpi::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,#1d4ed8,#4d90fe);opacity:0.6}
        .adm2-kpi-val{font-family:'Barlow Condensed',sans-serif;font-size:1.8rem;font-weight:800;background:linear-gradient(135deg,#4d90fe,#93c5fd);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;line-height:1}
        .adm2-kpi-label{font-size:0.58rem;letter-spacing:0.2em;text-transform:uppercase;color:rgba(100,140,200,0.4);font-family:'JetBrains Mono',monospace;margin-top:0.3rem}
        .adm2-tabs{display:flex;border-bottom:1px solid rgba(37,99,235,0.15);margin-bottom:1.5rem;flex-wrap:wrap}
        .adm2-tab{padding:0.75rem 1.25rem;background:transparent;border:none;border-bottom:2px solid transparent;color:rgba(100,140,200,0.4);cursor:pointer;font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:1rem;letter-spacing:0.1em;text-transform:uppercase;transition:all 0.2s;display:flex;align-items:center;gap:6px}
        .adm2-tab.active{border-bottom-color:#4d90fe;color:#c8d8f0}
        .adm2-tab:hover:not(.active){color:rgba(180,200,255,0.6)}
        .adm2-tab-badge{background:rgba(37,99,235,0.25);color:#4d90fe;font-size:0.65rem;padding:2px 6px;font-family:'JetBrains Mono',monospace}
        .adm2-empty{text-align:center;padding:3rem;border:1px dashed rgba(37,99,235,0.15);color:rgba(80,120,180,0.3);font-size:0.7rem;letter-spacing:0.25em;text-transform:uppercase;font-family:'JetBrains Mono',monospace}
        .adm2-live-card{background:rgba(10,25,70,0.5);border:1px solid rgba(37,99,235,0.2);border-left:3px solid #4d90fe;padding:1rem 1.25rem;display:flex;justify-content:space-between;align-items:center;margin-bottom:0.75rem;transition:all 0.2s}
        .adm2-live-card:hover{border-left-color:#60a5fa}
        .adm2-live-name{font-family:'Barlow Condensed',sans-serif;font-size:1.1rem;font-weight:700;color:#c8d8f0}
        .adm2-live-dossier{font-size:0.65rem;color:#4d90fe;letter-spacing:0.1em;font-family:'JetBrains Mono',monospace;margin-top:2px}
        .adm2-live-meta{font-size:0.6rem;color:rgba(100,140,200,0.4);font-family:'JetBrains Mono',monospace;margin-top:2px}
        .adm2-live-time{font-family:'JetBrains Mono',monospace;font-size:1.4rem;font-weight:700;background:linear-gradient(135deg,#4d90fe,#93c5fd);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;text-align:right}
        .adm2-live-status{font-size:0.56rem;color:rgba(0,214,143,0.6);display:flex;align-items:center;justify-content:flex-end;gap:5px;margin-top:4px}
        .adm2-live-dot{width:5px;height:5px;border-radius:50%;background:#00d68f;animation:adm2-blink 2s infinite}
        @keyframes adm2-blink{0%,100%{opacity:1}50%{opacity:.3}}
        .adm2-btn-stop{padding:0.4rem 0.85rem;background:linear-gradient(135deg,#7c1212,#dc2626);border:none;color:#fee2e2;font-family:'Barlow Condensed',sans-serif;font-size:0.85rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;cursor:pointer;margin-top:0.5rem;transition:all 0.15s}
        .adm2-btn-stop:hover{background:linear-gradient(135deg,#dc2626,#ef4444)}
        .adm2-filters{display:flex;gap:0.75rem;margin-bottom:1rem;flex-wrap:wrap}
        .adm2-filter-input{background:rgba(10,25,70,0.5);border:1px solid rgba(37,99,235,0.2);color:#c8d8f0;padding:0.6rem 0.85rem;font-family:'JetBrains Mono',monospace;font-size:0.8rem;outline:none;transition:all 0.2s}
        .adm2-filter-input:focus{border-color:rgba(77,144,254,0.4)}
        .adm2-filter-input::placeholder{color:rgba(80,120,180,0.25)}
        .adm2-btn{padding:0.6rem 1rem;font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:0.95rem;letter-spacing:0.1em;text-transform:uppercase;cursor:pointer;border:none;transition:all 0.2s}
        .adm2-btn-blue{background:linear-gradient(135deg,#1a3fa0,#2563eb);color:#e8f4ff}
        .adm2-btn-blue:hover{background:linear-gradient(135deg,#2563eb,#4d90fe)}
        .adm2-btn-ghost{background:rgba(37,99,235,0.08);border:1px solid rgba(37,99,235,0.2);color:rgba(100,140,200,0.6)}
        .adm2-btn-ghost:hover{background:rgba(37,99,235,0.15);color:#c8d8f0}
        .adm2-btn-danger{background:rgba(220,38,38,0.1);border:1px solid rgba(220,38,38,0.2);color:rgba(248,113,113,0.7)}
        .adm2-btn-danger:hover{background:rgba(220,38,38,0.2);color:#fca5a5}
        .adm2-table{width:100%;border-collapse:collapse}
        .adm2-table th{padding:0.5rem 0.75rem;text-align:left;color:rgba(80,120,180,0.4);font-size:0.58rem;letter-spacing:0.2em;text-transform:uppercase;font-family:'JetBrains Mono',monospace;font-weight:400;border-bottom:1px solid rgba(37,99,235,0.15)}
        .adm2-table td{padding:0.6rem 0.75rem;border-bottom:1px solid rgba(37,99,235,0.08);font-family:'JetBrains Mono',monospace;font-size:0.75rem}
        .adm2-table tr:hover td{background:rgba(37,99,235,0.04)}
        .adm2-td-date{color:rgba(180,200,255,0.7)}
        .adm2-td-muted{color:rgba(100,140,200,0.4)}
        .adm2-td-blue{color:#4d90fe}
        .adm2-td-green{color:#00d68f;font-weight:700}
        .adm2-panel{background:rgba(10,25,70,0.4);border:1px solid rgba(37,99,235,0.18);padding:1.5rem;margin-bottom:1rem;position:relative;overflow:hidden}
        .adm2-panel::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,rgba(37,99,235,0.4),transparent)}
        .adm2-panel-title{font-family:'Barlow Condensed',sans-serif;font-size:1rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:rgba(180,200,255,0.6);margin-bottom:1.25rem}
        .adm2-grid-2{display:grid;grid-template-columns:1fr 1fr;gap:1rem}
        @media(max-width:700px){.adm2-grid-2{grid-template-columns:1fr}}
        .adm2-field-label{display:block;font-size:0.58rem;letter-spacing:0.22em;text-transform:uppercase;color:rgba(100,140,200,0.5);margin-bottom:0.4rem;font-family:'JetBrains Mono',monospace}
        .adm2-input{width:100%;background:rgba(5,15,50,0.7);border:1px solid rgba(37,99,235,0.22);color:#c8d8f0;padding:0.75rem 0.9rem;font-family:'JetBrains Mono',monospace;font-size:0.85rem;outline:none;transition:all 0.2s;margin-bottom:0.75rem}
        .adm2-input:focus{border-color:rgba(77,144,254,0.4);background:rgba(37,99,235,0.06)}
        .adm2-input::placeholder{color:rgba(80,120,180,0.2)}
        .adm2-select{width:100%;background:rgba(5,15,50,0.7);border:1px solid rgba(37,99,235,0.22);color:#c8d8f0;padding:0.75rem 0.9rem;font-family:'Rajdhani',sans-serif;font-size:0.95rem;outline:none;margin-bottom:0.75rem;cursor:pointer;appearance:none}
        .adm2-select option{background:#0a1a3e;color:#c8d8f0}
        .adm2-msg-ok{color:rgba(134,239,172,0.8);font-size:0.72rem;font-family:'JetBrains Mono',monospace}
        .adm2-msg-err{color:rgba(248,113,113,0.8);font-size:0.72rem;font-family:'JetBrains Mono',monospace}
        .adm2-user-card{background:rgba(10,25,70,0.4);border:1px solid rgba(37,99,235,0.15);padding:0.85rem 1rem;display:flex;justify-content:space-between;align-items:center;margin-bottom:0.5rem}
        .adm2-user-name{font-family:'Barlow Condensed',sans-serif;font-size:1.1rem;font-weight:700;color:#c8d8f0}
        .adm2-user-meta{font-size:0.6rem;color:rgba(100,140,200,0.4);font-family:'JetBrains Mono',monospace;margin-top:2px}
        .adm2-badge-active{font-size:0.55rem;padding:2px 7px;background:rgba(0,214,143,0.1);border:1px solid rgba(0,214,143,0.3);color:rgba(0,214,143,0.7);font-family:'JetBrains Mono',monospace;letter-spacing:0.1em}
        .adm2-badge-inactive{font-size:0.55rem;padding:2px 7px;background:rgba(220,38,38,0.1);border:1px solid rgba(220,38,38,0.2);color:rgba(248,113,113,0.5);font-family:'JetBrains Mono',monospace;letter-spacing:0.1em}
        .adm2-tc-input{background:rgba(5,15,50,0.7);border:1px solid rgba(37,99,235,0.2);color:#c8d8f0;padding:4px 6px;font-family:'JetBrains Mono',monospace;font-size:0.7rem;width:60px;outline:none;text-align:right}
        .adm2-refresh-note{font-size:0.58rem;color:rgba(80,120,180,0.3);letter-spacing:0.15em;text-transform:uppercase;font-family:'JetBrains Mono',monospace;text-align:right;margin-top:0.75rem}
        .adm2-logo-preview{height:60px;width:auto;object-fit:contain;border:1px solid rgba(37,99,235,0.2);padding:8px;background:rgba(10,25,70,0.3)}
        .adm2-logo-placeholder{width:100px;height:60px;border:1px dashed rgba(37,99,235,0.2);display:flex;align-items:center;justify-content:center;color:rgba(100,140,200,0.35);font-size:0.6rem;letter-spacing:0.1em;font-family:'JetBrains Mono',monospace}
      `}</style>

      <div className="adm2-root">
        <div className="adm2-bg">
          <div className="adm2-navy" />
          <div className="adm2-glow" />
          <div className="adm2-dots">{Array.from({ length: 60 }).map((_, i) => <div key={i} className="adm2-dot" />)}</div>
          <div className="adm2-scan" />
        </div>

        <div className="adm2-content">
          {/* Header */}
          <div className="adm2-header">
            <div>
              <div className="adm2-badge"><div className="adm2-badge-dot" /><span className="adm2-badge-text">LYSMA Solutions</span></div>
              <div className="adm2-title">
                <span className="g">GARAGE</span><span className="t">TIMER</span>
                <span className="slash">/</span><span className="admin">ADMIN</span>
              </div>
              <div className="adm2-sub">{garage?.garageName} · Tableau de bord</div>
            </div>
            <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
              <button
                onClick={() => router.push("/rapports")}
                className="adm2-btn adm2-btn-ghost"
                style={{ padding: "0.5rem 1rem", fontSize: "0.85rem" }}
              >
                📄 Rapports PDF
              </button>
              <button className="adm2-logout" onClick={() => signOut({ callbackUrl: "/login" })}>
                Déconnexion →
              </button>
            </div>
          </div>

          {/* KPIs */}
          <div className="adm2-kpis">
            <div className="adm2-kpi"><div className="adm2-kpi-val">{liveSessions.length}</div><div className="adm2-kpi-label">Sessions live</div></div>
            <div className="adm2-kpi"><div className="adm2-kpi-val">{users.filter(u => u.isActive && u.role === "ATELIER").length}</div><div className="adm2-kpi-label">Compagnons actifs</div></div>
            <div className="adm2-kpi"><div className="adm2-kpi-val">{history.length || "—"}</div><div className="adm2-kpi-label">Historique chargé</div></div>
            <div className="adm2-kpi">
              <div className="adm2-kpi-val">
                {history.length > 0 ? fmtH(Math.round(history.reduce((a, h) => a + h.durationMin, 0) / history.length)) : "—"}
              </div>
              <div className="adm2-kpi-label">Durée moyenne</div>
            </div>
          </div>

          {/* Tabs */}
          <div className="adm2-tabs">
            {(["live", "history", "users", "settings"] as Tab[]).map((t) => (
              <button key={t} className={`adm2-tab ${tab === t ? "active" : ""}`} onClick={() => { setTab(t); setMsg({ text: "", type: "" }); }}>
                {t === "live" && (
                  <><span style={{ width: "6px", height: "6px", borderRadius: "50%", background: liveSessions.length > 0 ? "#00d68f" : "rgba(80,120,180,0.4)", display: "inline-block" }} />
                  Live<span className="adm2-tab-badge">{liveSessions.length}</span></>
                )}
                {t === "history" && "Historique"}
                {t === "users" && "Utilisateurs"}
                {t === "settings" && "Paramètres"}
              </button>
            ))}
          </div>

          {/* ===== TAB LIVE ===== */}
          {tab === "live" && (
            <div>
              {liveSessions.length === 0 ? (
                <div className="adm2-empty">Aucune session en cours</div>
              ) : (
                liveSessions.map((s) => (
                  <div key={s.id} className="adm2-live-card">
                    <div>
                      <div className="adm2-live-name">
                        {s.user.prenom} {s.user.nom}
                        {s.user.matricule && <span style={{ color: "rgba(100,140,200,0.5)", fontSize: "0.8rem" }}> — {s.user.matricule}</span>}
                      </div>
                      {s.dossier && <div className="adm2-live-dossier">⬡ {s.dossier}</div>}
                      <div className="adm2-live-meta">Début : {fmtTime(s.startTime)}</div>
                      <button className="adm2-btn-stop" onClick={() => forceStop(s.id)}>■ STOP ADMIN</button>
                    </div>
                    <div>
                      <div className="adm2-live-time">{fmtElapsed(elapsed[s.id] || 0)}</div>
                      <div className="adm2-live-status"><div className="adm2-live-dot" /> En cours</div>
                    </div>
                  </div>
                ))
              )}
              <p className="adm2-refresh-note">↻ Mise à jour auto toutes les 10s</p>
            </div>
          )}

          {/* ===== TAB HISTORY ===== */}
          {tab === "history" && (
            <div>
              <div className="adm2-filters">
                <input type="date" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} className="adm2-filter-input" />
                <input type="text" value={filterDossier} onChange={(e) => setFilterDossier(e.target.value)} placeholder="Filtrer dossier..." className="adm2-filter-input" style={{ flex: 1, minWidth: "140px" }} />
                <button onClick={fetchHistory} className="adm2-btn adm2-btn-blue">Filtrer →</button>
                <button onClick={exportCSV} className="adm2-btn adm2-btn-ghost">Export CSV</button>
              </div>
              {loading ? (
                <div className="adm2-empty">Chargement...</div>
              ) : history.length === 0 ? (
                <div className="adm2-empty">Aucun résultat — sélectionne une date et filtre</div>
              ) : (
                <div style={{ overflowX: "auto" }}>
                  <table className="adm2-table">
                    <thead>
                      <tr>
                        <th>Début</th>
                        <th>Compagnon</th>
                        <th>Mat.</th>
                        <th>Dossier</th>
                        <th>H. réelles</th>
                        <th title="Temps constructeur (heures)">T.C. (h)</th>
                        <th>Gain/Perte</th>
                      </tr>
                    </thead>
                    <tbody>
                      {history.map((h) => (
                        <tr key={h.id}>
                          <td className="adm2-td-date">{fmtTime(h.startTime)}</td>
                          <td className="adm2-td-date">{h.nomPrenom || "—"}</td>
                          <td className="adm2-td-muted">{h.matricule || "—"}</td>
                          <td className="adm2-td-blue">{h.dossier || "—"}</td>
                          <td className="adm2-td-green">{fmtH(h.durationMin)}</td>
                          <td>
                            <input
                              className="adm2-tc-input"
                              type="number" min="0" step="0.1"
                              defaultValue={h.tempsConstructeurMin
                                ? (Math.round((h.tempsConstructeurMin / 60) * 100) / 100)
                                : ""}
                              placeholder="—"
                              onBlur={(e) => updateTempsCon(h.id, e.target.value)}
                            />
                          </td>
                          <td>
                            {(() => {
                              if (!h.tempsConstructeurMin) return <span style={{ color: "rgba(100,140,200,0.4)" }}>—</span>;
                              const delta = Math.round(((h.tempsConstructeurMin - h.durationMin) / 60) * 100) / 100;
                              const positive = delta >= 0;
                              return (
                                <span style={{
                                  fontWeight: 700,
                                  color: positive ? "#00d68f" : "#f87171",
                                  fontFamily: "'JetBrains Mono',monospace",
                                  fontSize: "0.75rem",
                                }}>
                                  {positive ? "+" : ""}{delta.toFixed(2)}h
                                </span>
                              );
                            })()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ===== TAB USERS ===== */}
          {tab === "users" && (
            <div className="adm2-grid-2">
              <div className="adm2-panel">
                <div className="adm2-panel-title">{editUserId ? "✎ Modifier" : "+ Créer"} un compagnon</div>
                <label className="adm2-field-label">Prénom *</label>
                <input className="adm2-input" type="text" value={uPrenom} onChange={(e) => setUPrenom(e.target.value)} placeholder="Jean" />
                <label className="adm2-field-label">Nom</label>
                <input className="adm2-input" type="text" value={uNom} onChange={(e) => setUNom(e.target.value)} placeholder="DUPONT" />
                <label className="adm2-field-label">Matricule *</label>
                <input className="adm2-input" type="text" value={uMatricule} onChange={(e) => setUMatricule(e.target.value)} placeholder="01 ou MAT001" />
                <label className="adm2-field-label">Rôle</label>
                <select className="adm2-select" value={uRole} onChange={(e) => setURole(e.target.value)}>
                  <option value="ATELIER">ATELIER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
                <label className="adm2-field-label">PIN (4-6 chiffres){editUserId ? " — vide = inchangé" : " *"}</label>
                <input className="adm2-input" type="text" inputMode="numeric" value={uPin} onChange={(e) => setUPin(e.target.value)} placeholder="ex: 1234" />
                <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.25rem" }}>
                  <button className="adm2-btn adm2-btn-blue" onClick={saveUser}>{editUserId ? "Enregistrer" : "Créer →"}</button>
                  {editUserId && (
                    <button className="adm2-btn adm2-btn-ghost" onClick={() => { setEditUserId(""); setUPrenom(""); setUNom(""); setUMatricule(""); setUPin(""); setURole("ATELIER"); }}>
                      Annuler
                    </button>
                  )}
                </div>
                {msg.text && (
                  <p style={{ marginTop: "0.75rem" }} className={msg.type === "ok" ? "adm2-msg-ok" : "adm2-msg-err"}>
                    {msg.type === "ok" ? "✓" : "⚠"} {msg.text}
                  </p>
                )}
              </div>
              <div>
                <button className="adm2-btn adm2-btn-ghost" onClick={fetchUsers} style={{ marginBottom: "1rem", width: "100%" }}>↻ Rafraîchir</button>
                {users.length === 0 ? (
                  <div className="adm2-empty">Aucun utilisateur</div>
                ) : (
                  users.map((u) => (
                    <div key={u.id} className="adm2-user-card">
                      <div>
                        <div className="adm2-user-name">{u.prenom} {u.nom}</div>
                        <div className="adm2-user-meta">{u.role} · Mat: {u.matricule || "—"}</div>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.4rem" }}>
                        <span className={u.isActive ? "adm2-badge-active" : "adm2-badge-inactive"}>{u.isActive ? "ACTIF" : "OFF"}</span>
                        <div style={{ display: "flex", gap: "0.35rem" }}>
                          <button className="adm2-btn adm2-btn-ghost" style={{ padding: "0.25rem 0.6rem", fontSize: "0.75rem" }} onClick={() => editUser(u)}>Modifier</button>
                          <button className="adm2-btn adm2-btn-danger" style={{ padding: "0.25rem 0.6rem", fontSize: "0.75rem" }} onClick={() => toggleUser(u.id)}>{u.isActive ? "Désact." : "Réact."}</button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* ===== TAB SETTINGS ===== */}
          {tab === "settings" && (
            <div>
              {/* Logo */}
              <div className="adm2-panel" style={{ marginBottom: "1rem" }}>
                <div className="adm2-panel-title">Logo du garage</div>
                <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
                  {logoUrl ? (
                    <img src={logoUrl} alt="Logo garage" className="adm2-logo-preview" />
                  ) : (
                    <div className="adm2-logo-placeholder">AUCUN LOGO</div>
                  )}
                  <div>
                    <label className="adm2-btn adm2-btn-ghost" style={{ cursor: "pointer", padding: "0.5rem 1rem", fontSize: "0.85rem", display: "inline-block" }}>
                      {logoLoading ? "Upload..." : "📁 Choisir un logo"}
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp,image/svg+xml"
                        style={{ display: "none" }}
                        onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadLogo(f); }}
                      />
                    </label>
                    <p style={{ fontSize: "0.6rem", color: "rgba(100,140,200,0.35)", marginTop: "6px", fontFamily: "'JetBrains Mono',monospace" }}>
                      PNG, JPG, SVG · Max 2MB · Apparaît sur les rapports PDF
                    </p>
                  </div>
                </div>
              </div>

              <div className="adm2-grid-2">
                <div className="adm2-panel">
                  <div className="adm2-panel-title">Infos du garage</div>
                  <label className="adm2-field-label">Nom du garage *</label>
                  <input className="adm2-input" type="text" value={sName} onChange={(e) => setSName(e.target.value)} placeholder="Garage du Centre" />
                  <label className="adm2-field-label">Email</label>
                  <input className="adm2-input" type="email" value={sEmail} onChange={(e) => setSEmail(e.target.value)} placeholder="contact@garage.fr" />
                  <button className="adm2-btn adm2-btn-blue" onClick={saveSettings} style={{ width: "100%" }}>Enregistrer →</button>
                  {msg.text && (
                    <p style={{ marginTop: "0.75rem" }} className={msg.type === "ok" ? "adm2-msg-ok" : "adm2-msg-err"}>
                      {msg.type === "ok" ? "✓" : "⚠"} {msg.text}
                    </p>
                  )}
                </div>
                <div className="adm2-panel">
                  <div className="adm2-panel-title">Mots de passe accès</div>
                  <label className="adm2-field-label">Mot de passe Admin (vide = inchangé)</label>
                  <input className="adm2-input" type="password" value={sAdminPwd} onChange={(e) => setSAdminPwd(e.target.value)} placeholder="••••••••" autoComplete="new-password" />
                  <label className="adm2-field-label">Mot de passe Atelier (vide = inchangé)</label>
                  <input className="adm2-input" type="password" value={sAtelierPwd} onChange={(e) => setSAtelierPwd(e.target.value)} placeholder="••••••••" autoComplete="new-password" />
                  <button className="adm2-btn adm2-btn-blue" onClick={saveSettings} style={{ width: "100%" }}>Enregistrer →</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
