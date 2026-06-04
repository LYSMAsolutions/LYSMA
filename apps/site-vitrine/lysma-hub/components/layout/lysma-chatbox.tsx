"use client";

import { FormEvent, useRef, useState } from "react";
import { MessageCircle, Send, X } from "lucide-react";

type ChatMessage = {
  role: "assistant" | "user";
  content: string;
};

const quickReplies = [
  "Créer un site web",
  "Créer un outil web",
  "Voir les réalisations",
  "Comprendre la méthode",
  "Contacter LYSMA",
];

const mailUrl =
  "mailto:lysmasolutions@gmail.com?subject=Projet%20LYSMA%20Solutions&body=Bonjour%20LYSMA%20Solutions%2C%0A%0ANous%20souhaitons%20vous%20parler%20d%27un%20projet.%0A";

const getAnswer = (message: string) => {
  const normalized = message
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  if (normalized.includes("site")) {
    return "Nous créons des sites vitrines premium à la demande, avec une vraie structure, un domaine propre, du contenu lisible et une base pensée pour évoluer.";
  }

  if (normalized.includes("outil") || normalized.includes("application") || normalized.includes("app")) {
    return "Pour un outil web, nous partons d’un besoin métier concret : organisation, suivi, centralisation ou gain de temps. L’objectif est de livrer une première version utile, puis de l’améliorer.";
  }

  if (normalized.includes("realisation") || normalized.includes("livo") || normalized.includes("mounier")) {
    return "Vous pouvez découvrir nos réalisations sur la page dédiée : Carrosserie Mounier pour une vitrine premium, et LIVO App pour un outil web métier.";
  }

  if (normalized.includes("methode") || normalized.includes("comment")) {
    return "Notre méthode reste simple : comprendre le besoin, cadrer le projet, construire proprement, tester, livrer puis améliorer si nécessaire.";
  }

  if (normalized.includes("contact") || normalized.includes("mail") || normalized.includes("devis")) {
    return "Le plus simple est de nous écrire directement. Le bouton de contact prépare un email à lysmasolutions@gmail.com.";
  }

  return "Nous pouvons vous orienter sur un site premium, un outil web métier ou la meilleure façon de cadrer votre besoin. Pour une demande précise, écrivez-nous directement.";
};

export function LysmaChatbox() {
  const [open, setOpen] = useState(false);
  const conversationId = useRef(`site-vitrine:lysma-hub:${Date.now()}:${Math.random().toString(36).slice(2)}`);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: "Bonjour, nous pouvons vous orienter sur LYSMA Solutions, les sites premium et les outils web métier.",
    },
  ]);

  const ask = (message: string) => {
    const cleanMessage = message.trim();
    if (!cleanMessage) {
      return;
    }

    const answer = getAnswer(cleanMessage);

    setMessages((current) => [
      ...current,
      { role: "user", content: cleanMessage },
      { role: "assistant", content: answer },
    ]);

    void fetch("/api/chatbox/log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source: "site-vitrine:lysma-hub",
        conversationId: conversationId.current,
        userPrompt: cleanMessage,
        assistantResponse: answer,
      }),
    }).catch((error) => {
      console.error("Chatbox log error:", error);
    });
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    ask(String(formData.get("question") || ""));
    form.reset();
  };

  return (
    <div className="lysma-chatbox">
      {open ? (
        <section className="lysma-chatbox-panel" aria-label="Chatbox LYSMA">
          <header className="lysma-chatbox-header">
            <div>
              <strong>LYSMA Assistant</strong>
              <span>Réponses rapides</span>
            </div>
            <button type="button" onClick={() => setOpen(false)} aria-label="Fermer la chatbox">
              <X aria-hidden="true" />
            </button>
          </header>

          <div className="lysma-chatbox-messages">
            {messages.map((message, index) => (
              <p key={`${message.role}-${index}`} className={`lysma-chatbox-message is-${message.role}`}>
                {message.content}
              </p>
            ))}
          </div>

          <div className="lysma-chatbox-quick">
            {quickReplies.map((reply) => (
              <button key={reply} type="button" onClick={() => ask(reply)}>
                {reply}
              </button>
            ))}
          </div>

          <form className="lysma-chatbox-form" onSubmit={submit}>
            <input name="question" placeholder="Votre question" maxLength={260} />
            <button type="submit" aria-label="Envoyer la question">
              <Send aria-hidden="true" />
            </button>
          </form>

          <a className="lysma-chatbox-mail" href={mailUrl}>
            Écrire à LYSMA
          </a>
        </section>
      ) : null}

      <button className="lysma-chatbox-bubble" type="button" onClick={() => setOpen(true)} aria-label="Ouvrir la chatbox">
        <MessageCircle aria-hidden="true" />
      </button>
    </div>
  );
}
