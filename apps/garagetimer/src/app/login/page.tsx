"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError("");
    setLoading(true);
    const res = await signIn("garage-login", {
      email,
      password,
      redirect: false,
    });
    setLoading(false);
    if (res?.error) {
      setError("Email ou mot de passe incorrect");
    } else {
      router.push("/");
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@300;400;600;700;800;900&family=JetBrains+Mono:wght@300;400;500;700&family=Rajdhani:wght@300;400;500;600;700&display=swap');

        .gt-login-root {
          min-height: 100vh;
          background: #070d1a;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Rajdhani', sans-serif;
          overflow: hidden;
          position: relative;
          padding: 1.5rem;
        }

        .gt-bg {
          position: fixed;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
          z-index: 0;
        }

        .gt-navy-radial {
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse 80% 80% at 20% 50%, #0a1f4e 0%, #070d1a 60%);
        }

        .gt-glow-left {
          position: absolute;
          left: -100px;
          top: 40%;
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(37,99,235,0.2) 0%, transparent 70%);
        }

        .gt-arrows {
          position: absolute;
          left: -40px;
          top: 50%;
          transform: translateY(-50%);
          display: flex;
          flex-direction: column;
          gap: 0;
          opacity: 0.1;
        }

        .gt-arrow {
          width: 0;
          height: 0;
          border-top: 60px solid transparent;
          border-bottom: 60px solid transparent;
          border-left: 70px solid #2563eb;
          margin-bottom: -20px;
        }

        .gt-arrow:nth-child(2) { opacity: 0.7; margin-left: 35px; }
        .gt-arrow:nth-child(3) { opacity: 0.4; margin-left: 70px; }

        .gt-arrow-outline {
          position: absolute;
          right: 60px;
          top: 20%;
          opacity: 0.05;
        }

        .gt-arrow-outline div {
          width: 130px;
          height: 130px;
          border-right: 2px solid #4d90fe;
          border-top: 2px solid #4d90fe;
          transform: rotate(45deg);
          margin-bottom: -50px;
          margin-left: 20px;
        }

        .gt-dots {
          position: absolute;
          right: 80px;
          bottom: 60px;
          display: grid;
          grid-template-columns: repeat(8, 1fr);
          gap: 7px;
          opacity: 0.12;
        }

        .gt-dot {
          width: 3px;
          height: 3px;
          border-radius: 50%;
          background: #4d90fe;
        }

        .gt-scan {
          position: absolute;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(77,144,254,0.25), transparent);
          animation: gt-scanline 7s linear infinite;
        }

        @keyframes gt-scanline {
          0% { top: 0; }
          100% { top: 100%; }
        }

        .gt-wrap {
          position: relative;
          z-index: 1;
          display: flex;
          width: 100%;
          max-width: 900px;
          min-height: 480px;
          animation: gt-fadein 0.8s cubic-bezier(0.16,1,0.3,1) both;
        }

        @keyframes gt-fadein {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .gt-left {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 2rem 3rem 2rem 1rem;
        }

        .gt-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(37,99,235,0.1);
          border: 1px solid rgba(37,99,235,0.25);
          padding: 6px 14px;
          margin-bottom: 2rem;
          width: fit-content;
        }

        .gt-badge-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #4d90fe;
          animation: gt-pulse 2s infinite;
        }

        @keyframes gt-pulse {
          0%,100% { opacity: 1; box-shadow: 0 0 0 0 rgba(77,144,254,0.4); }
          50% { opacity: 0.7; box-shadow: 0 0 0 5px rgba(77,144,254,0); }
        }

        .gt-badge-text {
          font-size: 0.62rem;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: #4d90fe;
          font-family: 'Rajdhani', sans-serif;
          font-weight: 600;
        }

        .gt-product-name {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 5rem;
          font-weight: 900;
          letter-spacing: 0.05em;
          line-height: 0.88;
          margin-bottom: 0.75rem;
        }

        .gt-product-name .garage {
          background: linear-gradient(135deg, #c0cfe8, #ffffff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          display: block;
        }

        .gt-product-name .timer {
          background: linear-gradient(135deg, #1d4ed8, #4d90fe, #93c5fd);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          display: block;
        }

        .gt-tagline {
          font-size: 0.65rem;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(180,200,255,0.3);
          margin-bottom: 2.5rem;
          font-family: 'JetBrains Mono', monospace;
        }

        .gt-stats {
          display: flex;
          gap: 1.5rem;
          margin-bottom: 2.5rem;
          align-items: stretch;
        }

        .gt-stat {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .gt-stat-num {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 1.8rem;
          font-weight: 700;
          background: linear-gradient(135deg, #4d90fe, #93c5fd);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          line-height: 1;
        }

        .gt-stat-label {
          font-size: 0.58rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: rgba(100,140,200,0.4);
          font-family: 'JetBrains Mono', monospace;
        }

        .gt-stat-sep {
          width: 1px;
          background: linear-gradient(to bottom, transparent, rgba(37,99,235,0.3), transparent);
          align-self: stretch;
        }

        .gt-brand-footer {
          display: flex;
          align-items: center;
          gap: 10px;
          padding-top: 1.5rem;
          border-top: 1px solid rgba(37,99,235,0.1);
        }

        .gt-brand-footer-text {
          font-size: 0.58rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(100,140,200,0.35);
          font-family: 'JetBrains Mono', monospace;
        }

        .gt-divider-v {
          width: 1px;
          background: linear-gradient(to bottom, transparent, rgba(37,99,235,0.2), rgba(77,144,254,0.25), rgba(37,99,235,0.2), transparent);
          margin: 0 0.5rem;
          flex-shrink: 0;
        }

        .gt-right {
          width: 360px;
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 2rem 0.5rem 2rem 2.5rem;
        }

        .gt-form-header {
          margin-bottom: 2rem;
        }

        .gt-form-title {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 1.7rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #e2e8f0;
          margin-bottom: 0.3rem;
        }

        .gt-form-sub {
          font-size: 0.62rem;
          letter-spacing: 0.15em;
          color: rgba(100,140,200,0.45);
          text-transform: uppercase;
          font-family: 'JetBrains Mono', monospace;
        }

        .gt-field {
          margin-bottom: 1.25rem;
          position: relative;
        }

        .gt-field-label {
          display: block;
          font-size: 0.6rem;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: rgba(100,140,200,0.5);
          margin-bottom: 0.5rem;
          font-family: 'JetBrains Mono', monospace;
        }

        .gt-field-wrap {
          position: relative;
        }

        .gt-field-input {
          width: 100%;
          background: rgba(10,25,70,0.5);
          border: 1px solid rgba(37,99,235,0.2);
          border-bottom: 1px solid rgba(37,99,235,0.35);
          color: #c8d8f0;
          padding: 0.85rem 1rem;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.85rem;
          outline: none;
          transition: all 0.25s;
          letter-spacing: 0.05em;
        }

        .gt-field-input:focus {
          background: rgba(37,99,235,0.06);
          border-color: rgba(77,144,254,0.35);
          border-bottom-color: #4d90fe;
          color: #e8f0ff;
        }

        .gt-field-input::placeholder {
          color: rgba(80,120,180,0.25);
        }

        .gt-btn {
          width: 100%;
          padding: 0.95rem;
          background: linear-gradient(135deg, #1a3fa0, #2563eb);
          border: none;
          color: #e8f4ff;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 1.1rem;
          font-weight: 700;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          cursor: pointer;
          margin-top: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: all 0.2s;
          position: relative;
          overflow: hidden;
        }

        .gt-btn:hover {
          background: linear-gradient(135deg, #2563eb, #4d90fe);
          transform: translateY(-1px);
          box-shadow: 0 8px 30px rgba(37,99,235,0.35);
        }

        .gt-btn:active {
          transform: translateY(0);
        }

        .gt-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .gt-btn-arrow {
          transition: transform 0.2s;
          font-size: 1.1rem;
        }

        .gt-btn:hover .gt-btn-arrow {
          transform: translateX(4px);
        }

        .gt-security {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 1rem;
          padding: 0.6rem 0.85rem;
          background: rgba(37,99,235,0.05);
          border: 1px solid rgba(37,99,235,0.1);
        }

        .gt-security-text {
          font-size: 0.58rem;
          letter-spacing: 0.1em;
          color: rgba(100,140,200,0.4);
          font-family: 'JetBrains Mono', monospace;
          text-transform: uppercase;
        }

        .gt-error {
          color: #f87171;
          font-size: 0.72rem;
          margin-top: 0.75rem;
          text-align: center;
          letter-spacing: 0.05em;
          font-family: 'JetBrains Mono', monospace;
          padding: 0.5rem;
          background: rgba(248,113,113,0.07);
          border: 1px solid rgba(248,113,113,0.15);
        }

        .gt-status-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 1.5rem;
          padding-top: 1rem;
          border-top: 1px solid rgba(37,99,235,0.1);
        }

        .gt-status-live {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .gt-status-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #00d68f;
          box-shadow: 0 0 6px rgba(0,214,143,0.6);
          animation: gt-blink 2.5s ease-in-out infinite;
        }

        @keyframes gt-blink {
          0%,100% { opacity: 1; }
          50% { opacity: 0.3; }
        }

        .gt-status-text {
          font-size: 0.56rem;
          letter-spacing: 0.18em;
          color: rgba(80,120,180,0.35);
          text-transform: uppercase;
          font-family: 'JetBrains Mono', monospace;
        }

        @media (max-width: 700px) {
          .gt-wrap { flex-direction: column; }
          .gt-left { padding: 1.5rem 1rem; }
          .gt-product-name { font-size: 3.5rem; }
          .gt-divider-v { width: 100%; height: 1px; background: linear-gradient(to right, transparent, rgba(37,99,235,0.2), transparent); margin: 0.5rem 0; }
          .gt-right { width: 100%; padding: 1.5rem 0.5rem; }
          .gt-stats { display: none; }
        }
      `}</style>

      <div className="gt-login-root">
        {/* Background */}
        <div className="gt-bg">
          <div className="gt-navy-radial" />
          <div className="gt-glow-left" />
          <div className="gt-arrows">
            <div className="gt-arrow" />
            <div className="gt-arrow" />
            <div className="gt-arrow" />
          </div>
          <div className="gt-arrow-outline">
            <div />
            <div style={{ opacity: 0.5, marginLeft: "25px" }} />
          </div>
          <div className="gt-dots">
            {Array.from({ length: 48 }).map((_, i) => (
              <div key={i} className="gt-dot" />
            ))}
          </div>
          <div className="gt-scan" />
        </div>

        {/* Main wrap */}
        <div className="gt-wrap">
          {/* LEFT — Brand */}
          <div className="gt-left">
            <div className="gt-badge">
              <div className="gt-badge-dot" />
              <span className="gt-badge-text">LYSMA Solutions</span>
            </div>

            <div className="gt-product-name">
              <span className="garage">GARAGE</span>
              <span className="timer">TIMER</span>
            </div>
            <div className="gt-tagline">Chronométrage atelier · Pro</div>

            <div className="gt-stats">
              <div className="gt-stat">
                <div className="gt-stat-num">100%</div>
                <div className="gt-stat-label">Précision</div>
              </div>
              <div className="gt-stat-sep" />
              <div className="gt-stat">
                <div className="gt-stat-num">0s</div>
                <div className="gt-stat-label">Friction</div>
              </div>
              <div className="gt-stat-sep" />
              <div className="gt-stat">
                <div className="gt-stat-num">∞</div>
                <div className="gt-stat-label">Garages</div>
              </div>
            </div>

            <div className="gt-brand-footer">
              <svg width="26" height="26" viewBox="0 0 56 56" fill="none" opacity={0.6}>
                <polygon points="28,4 52,28 28,52 4,28" stroke="#4d90fe" strokeWidth="1.5" fill="rgba(37,99,235,0.1)" />
                <polygon points="28,14 42,28 28,42 14,28" stroke="#4d90fe" strokeWidth="1" fill="none" opacity={0.5} />
                <line x1="14" y1="28" x2="28" y2="14" stroke="#7ab3ff" strokeWidth="1.5" />
                <line x1="28" y1="14" x2="42" y2="28" stroke="#c0d8ff" strokeWidth="1.5" />
                <line x1="42" y1="28" x2="28" y2="42" stroke="#4d90fe" strokeWidth="1.5" />
              </svg>
              <span className="gt-brand-footer-text">lysmasolutions.fr</span>
            </div>
          </div>

          <div className="gt-divider-v" />

          {/* RIGHT — Form */}
          <div className="gt-right">
            <div className="gt-form-header">
              <div className="gt-form-title">Connexion</div>
              <div className="gt-form-sub">Accès sécurisé · Espace garage</div>
            </div>

            <div className="gt-field">
              <label className="gt-field-label">Adresse email</label>
              <div className="gt-field-wrap">
                <input
                  className="gt-field-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="garage@exemple.fr"
                />
              </div>
            </div>

            <div className="gt-field">
              <label className="gt-field-label">Mot de passe</label>
              <div className="gt-field-wrap">
                <input
                  className="gt-field-input"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  placeholder="••••••••••••"
                />
              </div>
            </div>

            <button
              className="gt-btn"
              onClick={handleSubmit}
              disabled={loading}
            >
              <span>{loading ? "CONNEXION..." : "SE CONNECTER"}</span>
              {!loading && <span className="gt-btn-arrow">→</span>}
            </button>

            {error && <div className="gt-error">⚠ {error}</div>}

            <div className="gt-security">
              <span style={{ color: "#4d90fe", fontSize: "0.7rem", opacity: 0.6 }}>◈</span>
              <span className="gt-security-text">Rôle détecté automatiquement · Admin ou Atelier</span>
            </div>

            <div className="gt-status-bar">
              <div className="gt-status-live">
                <div className="gt-status-dot" />
                <span className="gt-status-text">Système opérationnel</span>
              </div>
              <span className="gt-status-text">v1.0.0</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}