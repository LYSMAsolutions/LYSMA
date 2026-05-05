"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface Entry {
  id: string;
  dossier: string | null;
  comment: string | null;
  startTime: string;
  endTime: string;
  durationMin: number;
  tempsConstructeurMin: number | null;
  indice: string | null;
}

interface Compagnon {
  userId: string;
  nomPrenom: string;
  matricule: string;
  entries: Entry[];
  totalRealH: number;
  totalTCH: number;
  deltaH: number | null;
}

interface ReportData {
  garage: { name: string; email: string | null; logoUrl: string | null };
  period: { from: string; to: string };
  generatedAt: string;
  stats: {
    totalSessions: number;
    totalRealH: number;
    totalTCH: number;
    deltaH: number | null;
    nbCompagnons: number;
  };
  compagnons: Compagnon[];
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function fmtDateTime(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "2-digit", month: "2-digit", year: "2-digit", hour: "2-digit", minute: "2-digit",
  });
}

function fmtH(min: number) {
  return (Math.round((min / 60) * 100) / 100).toFixed(2) + "h";
}

function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
}

function DeltaChip({ val }: { val: number | null }) {
  if (val === null || val === undefined) return <span style={{ color: "#94a3b8" }}>—</span>;
  const positive = val >= 0;
  return (
    <span style={{
      fontWeight: 700,
      color: positive ? "#16a34a" : "#dc2626",
      background: positive ? "#f0fdf4" : "#fef2f2",
      padding: "2px 8px",
      borderRadius: "4px",
      fontSize: "0.78rem",
      border: `1px solid ${positive ? "#bbf7d0" : "#fecaca"}`,
    }}>
      {positive ? "+" : ""}{val.toFixed(2)}h
    </span>
  );
}

function entryDelta(durationMin: number, tcMin: number | null): number | null {
  if (!tcMin) return null;
  return Math.round(((tcMin - durationMin) / 60) * 100) / 100;
}

export default function RapportsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [data, setData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [filterDossier, setFilterDossier] = useState("");
  const [filterUserId, setFilterUserId] = useState("");
  const [compagnonsList, setCompagnonsList] = useState<{ id: string; nomPrenom: string }[]>([]);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  // Période par défaut = mois en cours
  useEffect(() => {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().slice(0, 10);
    setDateFrom(firstDay);
    setDateTo(lastDay);
  }, []);

  // Charge la liste des compagnons
  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/users/list")
        .then(r => r.json())
        .then(d => {
          const list = (d.users || []).map((u: any) => ({
            id: u.id,
            nomPrenom: `${u.prenom || ""} ${u.nom || ""}`.trim(),
          }));
          setCompagnonsList(list);
        })
        .catch(() => {});
    }
  }, [status]);

  const fetchReport = async () => {
    if (!dateFrom || !dateTo) return setError("Sélectionne une période");
    setLoading(true);
    setError("");
    setData(null);
    try {
      const p = new URLSearchParams({ from: dateFrom, to: dateTo });
      if (filterDossier) p.set("dossier", filterDossier);
      if (filterUserId) p.set("userId", filterUserId);
      const res = await fetch(`/api/reports/data?${p}`);
      const json = await res.json();
      if (json.error) setError(json.error);
      else setData(json);
    } catch {
      setError("Erreur lors du chargement");
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => { window.print(); };

  if (status === "loading") return (
    <div style={{ minHeight: "100vh", background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ color: "#94a3b8" }}>Chargement...</p>
    </div>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Inter', sans-serif; background: #f1f5f9; color: #0f172a; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        .rp-screen { min-height: 100vh; padding: 1.5rem; }
        .rp-toolbar { background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 1.25rem 1.5rem; margin-bottom: 1.5rem; display: flex; flex-wrap: wrap; gap: 0.75rem; align-items: flex-end; box-shadow: 0 1px 3px rgba(0,0,0,0.06); max-width: 1000px; margin-left: auto; margin-right: auto; }
        .rp-field { display: flex; flex-direction: column; gap: 4px; }
        .rp-label { font-size: 0.65rem; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: #64748b; }
        .rp-input { border: 1px solid #e2e8f0; border-radius: 8px; padding: 0.5rem 0.75rem; font-size: 0.875rem; font-family: 'Inter', sans-serif; outline: none; color: #0f172a; background: #fff; }
        .rp-input:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59,130,246,0.1); }
        .rp-btn { padding: 0.55rem 1.25rem; border: none; border-radius: 8px; font-family: 'Inter', sans-serif; font-size: 0.875rem; font-weight: 600; cursor: pointer; transition: all 0.15s; }
        .rp-btn-primary { background: #1e40af; color: #fff; }
        .rp-btn-primary:hover { background: #1d4ed8; }
        .rp-btn-secondary { background: #f1f5f9; color: #475569; border: 1px solid #e2e8f0; }
        .rp-btn-secondary:hover { background: #e2e8f0; }
        .rp-btn-print { background: #0f172a; color: #fff; }
        .rp-btn-print:hover { background: #1e293b; }
        .report { background: #fff; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.08); overflow: hidden; max-width: 1000px; margin: 0 auto; }
        .report-header { background: linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%); color: #fff; padding: 2rem 2.5rem; display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem; }
        .report-header-left { display: flex; align-items: center; gap: 1rem; }
        .report-logo { height: 55px; width: auto; object-fit: contain; filter: brightness(0) invert(1); }
        .report-garage-name { font-size: 1.5rem; font-weight: 700; letter-spacing: -0.02em; margin-bottom: 0.25rem; }
        .report-garage-sub { font-size: 0.8rem; color: rgba(255,255,255,0.6); }
        .report-meta { text-align: right; font-size: 0.8rem; color: rgba(255,255,255,0.7); line-height: 1.6; }
        .report-meta strong { color: #fff; display: block; font-size: 1rem; font-weight: 600; margin-bottom: 4px; }
        .report-title-bar { background: #1e40af; color: #fff; padding: 0.65rem 2.5rem; font-size: 0.7rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; }
        .report-stats { display: grid; grid-template-columns: repeat(5, 1fr); border-bottom: 1px solid #e2e8f0; }
        .report-stat { padding: 1.25rem 1rem; border-right: 1px solid #e2e8f0; text-align: center; }
        .report-stat:last-child { border-right: none; }
        .report-stat-val { font-size: 1.4rem; font-weight: 700; color: #0f172a; line-height: 1; margin-bottom: 4px; }
        .report-stat-label { font-size: 0.6rem; font-weight: 500; text-transform: uppercase; letter-spacing: 0.08em; color: #94a3b8; }
        .report-section { padding: 1.5rem 2.5rem; }
        .report-section-title { font-size: 0.68rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: #1e40af; padding-bottom: 0.75rem; border-bottom: 2px solid #1e40af; margin-bottom: 1rem; display: flex; align-items: center; gap: 8px; }
        .report-table { width: 100%; border-collapse: collapse; font-size: 0.82rem; }
        .report-table th { text-align: left; padding: 0.55rem 0.75rem; background: #f8fafc; color: #64748b; font-size: 0.65rem; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; border-bottom: 1px solid #e2e8f0; }
        .report-table td { padding: 0.6rem 0.75rem; border-bottom: 1px solid #f1f5f9; color: #374151; vertical-align: middle; }
        .report-table tr:last-child td { border-bottom: none; }
        .report-table .td-num { font-variant-numeric: tabular-nums; font-weight: 500; color: #0f172a; }
        .report-table .td-muted { color: #94a3b8; font-size: 0.78rem; }
        .report-table .td-blue { color: #1e40af; font-weight: 500; }
        .report-table tr.total-row td { background: #f8fafc; font-weight: 700; border-top: 2px solid #e2e8f0; }
        .compagnon-block { border: 1px solid #e2e8f0; border-radius: 10px; overflow: hidden; margin-bottom: 1.5rem; page-break-inside: avoid; break-inside: avoid; }
        .compagnon-header { background: linear-gradient(135deg, #f8fafc, #f1f5f9); padding: 1rem 1.5rem; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e2e8f0; }
        .compagnon-name { font-size: 1rem; font-weight: 700; color: #0f172a; }
        .compagnon-mat { font-size: 0.72rem; color: #64748b; margin-top: 2px; }
        .compagnon-kpis { display: flex; gap: 1.5rem; align-items: center; }
        .compagnon-kpi { text-align: right; }
        .compagnon-kpi-val { font-size: 0.95rem; font-weight: 700; color: #0f172a; }
        .compagnon-kpi-label { font-size: 0.6rem; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.06em; }
        .compagnon-totaux { background: #f8fafc; border-top: 2px solid #e2e8f0; padding: 0.85rem 1.5rem; display: flex; justify-content: space-between; align-items: center; }
        .compagnon-totaux-label { font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #475569; }
        .compagnon-totaux-vals { display: flex; gap: 2rem; }
        .compagnon-totaux-item { display: flex; flex-direction: column; align-items: flex-end; font-size: 0.85rem; font-weight: 600; color: #0f172a; }
        .compagnon-totaux-item span { font-size: 0.58rem; color: #94a3b8; font-weight: 400; text-transform: uppercase; margin-top: 1px; }
        .signature-zone { border-top: 1px solid #e2e8f0; padding: 1.25rem 1.5rem; display: grid; grid-template-columns: 1fr 1fr; gap: 2.5rem; background: #fff; }
        .signature-label { font-size: 0.62rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #94a3b8; margin-bottom: 10px; }
        .signature-line { border-bottom: 1.5px solid #0f172a; height: 38px; width: 100%; }
        .signature-sublabel { font-size: 0.62rem; color: #94a3b8; margin-top: 5px; }
        .report-footer { background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 0.85rem 2.5rem; display: flex; justify-content: space-between; align-items: center; font-size: 0.68rem; color: #94a3b8; }
        @media print {
          body { background: #fff !important; }
          .rp-screen { padding: 0 !important; }
          .rp-toolbar { display: none !important; }
          .no-print { display: none !important; }
          .report { box-shadow: none !important; border-radius: 0 !important; max-width: 100% !important; }
          .compagnon-block { page-break-inside: avoid; break-inside: avoid; }
          .report-section { padding: 1rem 1.5rem !important; }
          .report-header { padding: 1.5rem !important; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          .report-title-bar { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          .compagnon-header { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        }
        @page { margin: 1.5cm; size: A4 portrait; }
      `}</style>

      <div className="rp-screen">
        {/* Toolbar */}
        <div className="rp-toolbar no-print">
          <button onClick={() => router.push("/admin")} className="rp-btn rp-btn-secondary">← Admin</button>
          <div style={{ flex: 1, display: "flex", alignItems: "center" }}>
            <span style={{ fontSize: "1rem", fontWeight: 700, color: "#0f172a" }}>Rapports de productivité</span>
          </div>
          <div className="rp-field">
            <label className="rp-label">Du</label>
            <input type="date" className="rp-input" value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
          </div>
          <div className="rp-field">
            <label className="rp-label">Au</label>
            <input type="date" className="rp-input" value={dateTo} onChange={e => setDateTo(e.target.value)} />
          </div>
          <div className="rp-field">
            <label className="rp-label">Compagnon</label>
            <select
              className="rp-input"
              value={filterUserId}
              onChange={e => setFilterUserId(e.target.value)}
              style={{ minWidth: "160px" }}
            >
              <option value="">Tous</option>
              {compagnonsList.map(c => (
                <option key={c.id} value={c.id}>{c.nomPrenom}</option>
              ))}
            </select>
          </div>
          <div className="rp-field">
            <label className="rp-label">Dossier / OR</label>
            <input
              type="text"
              className="rp-input"
              value={filterDossier}
              onChange={e => setFilterDossier(e.target.value)}
              placeholder="Tous"
              style={{ width: "120px" }}
            />
          </div>
          <button onClick={fetchReport} disabled={loading} className="rp-btn rp-btn-primary">
            {loading ? "Chargement..." : "Générer →"}
          </button>
          {data && (
            <button onClick={handlePrint} className="rp-btn rp-btn-print">🖨 Imprimer / PDF</button>
          )}
        </div>

        {error && (
          <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "8px", padding: "0.75rem 1rem", marginBottom: "1rem", color: "#dc2626", fontSize: "0.875rem", maxWidth: "1000px", margin: "0 auto 1rem" }} className="no-print">
            ⚠ {error}
          </div>
        )}

        {!data && !loading && (
          <div style={{ textAlign: "center", padding: "5rem", color: "#94a3b8", fontSize: "0.875rem" }} className="no-print">
            Sélectionne une période et clique sur "Générer"
          </div>
        )}

        {data && (
          <div className="report">
            <div className="report-header">
              <div className="report-header-left">
                {data.garage.logoUrl && (
                  <img src={data.garage.logoUrl} alt="Logo" className="report-logo" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                )}
                <div>
                  <div className="report-garage-name">{data.garage.name}</div>
                  <div className="report-garage-sub">{data.garage.email || "Rapport de productivité atelier"}</div>
                </div>
              </div>
              <div className="report-meta">
                <strong>Du {fmtDate(data.period.from)} au {fmtDate(data.period.to)}</strong>
                Généré le {fmtDateTime(data.generatedAt)}<br />
                GARAGETIMER · LYSMA Solutions
              </div>
            </div>

            <div className="report-title-bar">Rapport de productivité atelier</div>

            <div className="report-stats">
              <div className="report-stat">
                <div className="report-stat-val">{data.stats.nbCompagnons}</div>
                <div className="report-stat-label">Compagnons</div>
              </div>
              <div className="report-stat">
                <div className="report-stat-val">{data.stats.totalSessions}</div>
                <div className="report-stat-label">Interventions</div>
              </div>
              <div className="report-stat">
                <div className="report-stat-val">{data.stats.totalRealH.toFixed(2)}h</div>
                <div className="report-stat-label">H. réelles</div>
              </div>
              <div className="report-stat">
                <div className="report-stat-val">{data.stats.totalTCH > 0 ? data.stats.totalTCH.toFixed(2) + "h" : "—"}</div>
                <div className="report-stat-label">H. constructeur</div>
              </div>
              <div className="report-stat">
                <div className="report-stat-val"><DeltaChip val={data.stats.deltaH} /></div>
                <div className="report-stat-label">Gain / Perte</div>
              </div>
            </div>

            <div className="report-section">
              <div className="report-section-title">📊 Récapitulatif productivité</div>
              <table className="report-table">
                <thead>
                  <tr>
                    <th>Compagnon</th>
                    <th>Matricule</th>
                    <th style={{ textAlign: "center" }}>Interventions</th>
                    <th style={{ textAlign: "right" }}>H. réelles</th>
                    <th style={{ textAlign: "right" }}>H. constructeur</th>
                    <th style={{ textAlign: "center" }}>Gain / Perte</th>
                  </tr>
                </thead>
                <tbody>
                  {data.compagnons.map(c => (
                    <tr key={c.userId}>
                      <td style={{ fontWeight: 600 }}>{c.nomPrenom}</td>
                      <td className="td-muted">{c.matricule}</td>
                      <td className="td-num" style={{ textAlign: "center" }}>{c.entries.length}</td>
                      <td className="td-num" style={{ textAlign: "right" }}>{c.totalRealH.toFixed(2)}h</td>
                      <td className="td-num" style={{ textAlign: "right" }}>{c.totalTCH > 0 ? c.totalTCH.toFixed(2) + "h" : "—"}</td>
                      <td style={{ textAlign: "center" }}><DeltaChip val={c.deltaH} /></td>
                    </tr>
                  ))}
                  <tr className="total-row">
                    <td colSpan={2}>TOTAL ATELIER</td>
                    <td className="td-num" style={{ textAlign: "center" }}>{data.stats.totalSessions}</td>
                    <td className="td-num" style={{ textAlign: "right" }}>{data.stats.totalRealH.toFixed(2)}h</td>
                    <td className="td-num" style={{ textAlign: "right" }}>{data.stats.totalTCH > 0 ? data.stats.totalTCH.toFixed(2) + "h" : "—"}</td>
                    <td style={{ textAlign: "center" }}><DeltaChip val={data.stats.deltaH} /></td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="report-section">
              <div className="report-section-title">👷 Détail par compagnon</div>
              {data.compagnons.map(c => (
                <div key={c.userId} className="compagnon-block">
                  <div className="compagnon-header">
                    <div>
                      <div className="compagnon-name">{c.nomPrenom}</div>
                      <div className="compagnon-mat">Matricule : {c.matricule} · {c.entries.length} intervention{c.entries.length > 1 ? "s" : ""}</div>
                    </div>
                    <div className="compagnon-kpis">
                      <div className="compagnon-kpi">
                        <div className="compagnon-kpi-val">{c.totalRealH.toFixed(2)}h</div>
                        <div className="compagnon-kpi-label">H. réelles</div>
                      </div>
                      <div className="compagnon-kpi">
                        <div className="compagnon-kpi-val">{c.totalTCH > 0 ? c.totalTCH.toFixed(2) + "h" : "—"}</div>
                        <div className="compagnon-kpi-label">H. construct.</div>
                      </div>
                      <div className="compagnon-kpi">
                        <DeltaChip val={c.deltaH} />
                        <div className="compagnon-kpi-label" style={{ marginTop: "4px" }}>Gain / Perte</div>
                      </div>
                    </div>
                  </div>

                  <table className="report-table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>OR / Dossier</th>
                        <th>Début</th>
                        <th>Fin</th>
                        <th style={{ textAlign: "right" }}>H. réelles</th>
                        <th style={{ textAlign: "right" }}>H. construct.</th>
                        <th style={{ textAlign: "center" }}>Gain / Perte</th>
                        <th>Commentaire</th>
                      </tr>
                    </thead>
                    <tbody>
                      {c.entries.map(e => (
                        <tr key={e.id}>
                          <td className="td-muted">{fmtDate(e.startTime)}</td>
                          <td className="td-blue">{e.dossier || "—"}</td>
                          <td className="td-num">{fmtTime(e.startTime)}</td>
                          <td className="td-num">{fmtTime(e.endTime)}</td>
                          <td className="td-num" style={{ textAlign: "right", fontWeight: 600 }}>{fmtH(e.durationMin)}</td>
                          <td className="td-num" style={{ textAlign: "right" }}>{e.tempsConstructeurMin ? fmtH(e.tempsConstructeurMin) : "—"}</td>
                          <td style={{ textAlign: "center" }}>
                            <DeltaChip val={entryDelta(e.durationMin, e.tempsConstructeurMin)} />
                          </td>
                          <td className="td-muted" style={{ fontSize: "0.72rem" }}>{e.comment || ""}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className="compagnon-totaux">
                    <div className="compagnon-totaux-label">Total période</div>
                    <div className="compagnon-totaux-vals">
                      <div className="compagnon-totaux-item">
                        {c.totalRealH.toFixed(2)}h
                        <span>H. réelles</span>
                      </div>
                      <div className="compagnon-totaux-item">
                        {c.totalTCH > 0 ? c.totalTCH.toFixed(2) + "h" : "—"}
                        <span>H. constructeur</span>
                      </div>
                      <div className="compagnon-totaux-item">
                        <DeltaChip val={c.deltaH} />
                        <span>Gain / Perte</span>
                      </div>
                    </div>
                  </div>

                  <div className="signature-zone">
                    <div>
                      <div className="signature-label">Signature du compagnon</div>
                      <div className="signature-line" />
                      <div className="signature-sublabel">{c.nomPrenom} — Mat. {c.matricule}</div>
                    </div>
                    <div>
                      <div className="signature-label">Signature du responsable</div>
                      <div className="signature-line" />
                      <div className="signature-sublabel">Lu et approuvé — Date : _____ / _____ / _____</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="report-footer">
              <span>{data.garage.name} · Du {fmtDate(data.period.from)} au {fmtDate(data.period.to)}</span>
              <span>GARAGETIMER · LYSMA Solutions</span>
            </div>
          </div>
        )}
      </div>
    </>
  );
}