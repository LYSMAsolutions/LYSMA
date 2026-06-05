"use client";

import { FormEvent, useRef, useState } from "react";
import { getChatboxPageMetadata } from "../../lib/chatbox-page-metadata";
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
  const conversationId = useRef(`site-vitrine:${siteSlug}:${Date.now()}:${Math.random().toString(36).slice(2)}`);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Bonjour. Dites-moi ce qu'il vous faut : devis, photos, horaires, assurance ou question atelier.",
    },
  ]);
  const hasUserMessage = messages.some((message) => message.role === "user");

  const ask = async (message: string) => {
    const cleanMessage = message.trim();
    if (!cleanMessage) return;

    setMessages((current) => [...current, { role: "user", content: cleanMessage }]);
    setLoading(true);

    const response = await fetch("/api/assistant", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        siteSlug,
        message: cleanMessage,
        conversationId: conversationId.current,
        metadata: getChatboxPageMetadata(),
      }),
    });
    const result = (await response.json()) as { answer?: string };

    setMessages((current) => [
      ...current,
      { role: "assistant", content: result.answer || "Je n'ai pas assez d'éléments pour répondre correctement ici. Le plus simple est d'envoyer une demande à l'atelier." },
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
              <span>Message libre</span>
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
            {loading ? <p className="hub-message hub-message-assistant">Je regarde la demande...</p> : null}
          </div>
          {!hasUserMessage ? (
            <div className="hub-pre-messages" aria-label="Pré-messages disponibles">
              <span>Pré-messages</span>
              <div className="hub-quick-actions">
                {quickQuestions.map((question) => (
                  <button key={question} type="button" onClick={() => ask(question)}>
                    {question}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
          <form onSubmit={submit} className="hub-assistant-form">
            <input name="question" placeholder="Votre question" maxLength={320} />
            <Button type="submit" disabled={loading}>
              Envoyer
            </Button>
          </form>
        </div>
      ) : null}
      <button
        className="hub-assistant-bubble"
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-label={open ? "Fermer l'assistant" : "Ouvrir l'assistant"}
      >
        ?
      </button>
    </div>
  );
}
