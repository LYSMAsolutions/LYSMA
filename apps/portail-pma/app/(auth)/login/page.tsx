"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

function LoginForm() {
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [loading,  setLoading]  = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const searchParams = useSearchParams();

  useEffect(() => {
    const error = searchParams.get("error");
    if (error === "session_required") {
      setErrorMsg("Votre session a expiré ou vous devez vous connecter.");
    } else if (error === "unauthorized") {
      setErrorMsg("Vous n'avez pas les droits pour accéder à cette page.");
    }
  }, [searchParams]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!data.success) {
        setErrorMsg(data.message || "Erreur de connexion");
        return;
      }
      window.location.href = data.redirect;
    } catch {
      setErrorMsg("Erreur serveur");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card-lysma p-8 w-full max-w-md">
      <h1 className="text-2xl font-semibold text-center text-[#0F172A]">
        Connexion
      </h1>

      <form onSubmit={handleLogin} className="mt-6 space-y-4">
        <div>
          <label className="text-sm text-[#6B7280]">Adresse email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-lysma mt-2 w-full"
          />
        </div>

        <div>
          <label className="text-sm text-[#6B7280]">Mot de passe</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-lysma mt-2 w-full"
          />
        </div>

        {errorMsg && <div className="alert-error">{errorMsg}</div>}

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full"
        >
          {loading ? "Connexion..." : "Se connecter"}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-[#6B7280]">
        <span>Pas encore de compte ? </span>
        <Link href="/ouverture-compte" className="link-lysma">
          Faire une demande
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="login-bg min-h-screen flex items-center justify-center px-6">
      <div className="login-container">
        <div className="login-left">
          <img src="/logo-lysma.png" alt="LYSMA" />
        </div>
        <div className="login-right">
          <Suspense fallback={<div className="card-lysma p-8 w-full max-w-md">Chargement...</div>}>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </main>
  );
}