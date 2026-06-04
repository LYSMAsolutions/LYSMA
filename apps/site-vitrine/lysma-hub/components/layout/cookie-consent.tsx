"use client";

import { useEffect, useState } from "react";

const COOKIE_CONSENT_KEY = "lysma:cookie-consent";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(!localStorage.getItem(COOKIE_CONSENT_KEY));
  }, []);

  const saveChoice = (choice: "accepted" | "declined") => {
    localStorage.setItem(
      COOKIE_CONSENT_KEY,
      JSON.stringify({
        choice,
        savedAt: new Date().toISOString(),
      }),
    );
    setVisible(false);
  };

  if (!visible) {
    return null;
  }

  return (
    <section className="lysma-cookie-consent" aria-label="Gestion des cookies">
      <div>
        <strong>Gestion des cookies</strong>
        <p>
          Nous utilisons uniquement les cookies nécessaires au fonctionnement de LYSMA Hub. Les
          mesures d’audience ou services externes seront activés seulement après votre accord.
        </p>
      </div>
      <div className="lysma-cookie-actions">
        <button type="button" className="lysma-ui-button lysma-ui-button-secondary" onClick={() => saveChoice("declined")}>
          Refuser
        </button>
        <button type="button" className="lysma-ui-button lysma-ui-button-primary" onClick={() => saveChoice("accepted")}>
          Accepter
        </button>
      </div>
    </section>
  );
}
