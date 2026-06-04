"use client";

import { FormEvent, useState } from "react";
import { Button } from "../ui/Button";

type Message = {
  role: "assistant" | "user";
  content: string;
};

const quickQuestions = [
  "Demander un devis",
  "Envoyer une photo",
  "Horaires / contact",
  "Assurance / sinistre",
  "Autre question",
];

export function FloatingAssistant({ siteSlug }: { siteSlug: string }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Bonjour, je peux vous orienter pour un devis, des photos, les horaires ou une question liée à l'assurance.",
    },
  ]);

  const ask = async (message: string) => {
    const cleanMessage = message.trim();
    if (!cleanMessage) return;

    setMessages((current) => [...current, { role: "user", content: cleanMessage }]);
    setLoading(true);

    const response = await fetch("/api/assistant", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ siteSlug, message: cleanMessage }),
    });
    const result = (await response.json()) as { answer?: string };

    setMessages((current) => [
      ...current,
      { role: "assistant", content: result.answer || "Je vous invite à envoyer une demande à l'atelier." },
    ]);
    setLoading(false);
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    await ask(String(formData.get("question") || ""));
    form.reset();
  };

  return (
    <div className="hub-assistant">
      {open ? (
        <div className="hub-assistant-panel">
          <div className="hub-assistant-head">
            <div>
              <strong>Assistant atelier</strong>
              <span>Réponses rapides</span>
            </div>
            <button type="button" onClick={() => setOpen(false)} aria-label="Fermer l'assistant">
              ×
            </button>
          </div>
          <div className="hub-assistant-messages">
            {messages.map((message, index) => (
              <p key={`${message.role}-${index}`} className={`hub-message hub-message-${message.role}`}>
                {message.content}
              </p>
            ))}
            {loading ? <p className="hub-message hub-message-assistant">Recherche de la meilleure réponse...</p> : null}
          </div>
          <div className="hub-quick-actions">
            {quickQuestions.map((question) => (
              <button key={question} type="button" onClick={() => ask(question)}>
                {question}
              </button>
            ))}
          </div>
          <form onSubmit={submit} className="hub-assistant-form">
            <input name="question" placeholder="Votre question" maxLength={320} />
            <Button type="submit" disabled={loading}>
              Envoyer
            </Button>
          </form>
        </div>
      ) : null}
      <button className="hub-assistant-bubble" type="button" onClick={() => setOpen(true)} aria-label="Ouvrir l'assistant">
        ?
      </button>
    </div>
  );
}
