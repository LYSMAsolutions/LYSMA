"use client";

import { FormEvent, useRef, useState } from "react";
import { MessageCircle, Send, X } from "lucide-react";
import { getChatboxPageMetadata } from "../../lib/chatbox-page-metadata";

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

const normalizeQuestion = (message: string) =>
  message
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const hasAnyKeyword = (message: string, keywords: string[]) =>
  keywords.some((keyword) => message.includes(keyword));

const isToolQuestion = (message: string) => {
  const words = message.split(" ");
  return ["outil", "outils", "application", "applications", "app"].some((keyword) => words.includes(keyword));
};

const repeatedToolAnswers = [
  "Oui. Pour avancer concrètement, dites-nous le métier, qui utilisera l'outil, les informations à suivre et le moment où vous perdez le plus de temps. Avec ça, on peut cadrer une première version sans vous demander un gros cahier des charges.",
  "Si vous avez déjà une idée, envoyez-nous deux ou trois situations réelles : une demande client, une intervention, un suivi ou une donnée difficile à retrouver. C'est souvent suffisant pour proposer une structure d'outil claire.",
];

const avoidRepeatedAnswer = (answer: string, normalized: string, history: ChatMessage[]) => {
  const previousAnswers = new Set(
    history.filter((entry) => entry.role === "assistant").map((entry) => entry.content),
  );

  if (!previousAnswers.has(answer)) {
    return answer;
  }

  if (isToolQuestion(normalized)) {
    return repeatedToolAnswers.find((candidate) => !previousAnswers.has(candidate)) ?? repeatedToolAnswers[0];
  }

  return "Je vous ai déjà donné les grandes lignes. Pour aller plus loin, dites-nous surtout votre métier, votre objectif et ce que vous voulez simplifier au quotidien.";
};

const getAnswer = (message: string, history: ChatMessage[] = []) => {
  const normalized = normalizeQuestion(message);
  let answer =
    "Je peux vous guider sur un site vitrine, un outil métier ou la meilleure façon de cadrer votre besoin. Pour un cas précis, le plus simple reste de nous écrire avec deux ou trois détails.";

  if (normalized.includes("site")) {
    answer =
      "Oui. Pour un site, nous construisons une vitrine propre et lisible : structure, domaine, contenus, pages importantes et base prête à évoluer si votre activité grandit.";
  } else if (isToolQuestion(normalized) && hasAnyKeyword(normalized, ["plombier", "plomberie"])) {
    answer =
      "Pour un plombier, je commencerais par repérer ce qui vous fait vraiment perdre du temps : urgences, devis, interventions, photos, suivi de chantier, rappels ou planning. Pour cadrer l'outil, il nous faut surtout savoir qui l'utilise, quelles infos reviennent à chaque intervention et ce que vous voulez retrouver plus vite. Deux ou trois cas réels suffisent pour poser une première version utile.";
  } else if (
    isToolQuestion(normalized) &&
    hasAnyKeyword(normalized, ["besoin", "besoins", "metier", "artisan", "chantier", "intervention", "depannage", "planning"])
  ) {
    answer =
      "Le bon point de départ, c'est un problème concret : qui utilise l'outil, quelles informations doivent être suivies, ce qui prend trop de temps et quelle action doit devenir plus simple. Ensuite, on peut proposer une première version : suivi de demandes, tableau d'activité, fiches de travail ou planning.";
  } else if (isToolQuestion(normalized)) {
    answer =
      "Un outil utile part rarement d'une liste de fonctionnalités. On part plutôt d'un problème métier : organiser, suivre, centraliser ou gagner du temps. L'idée est de livrer une première version simple, puis de l'améliorer avec les vrais retours du terrain.";
  } else if (normalized.includes("realisation") || normalized.includes("livo") || normalized.includes("mounier")) {
    answer =
      "Oui. Vous pouvez regarder les réalisations : Carrosserie Mounier montre une vitrine premium, et LIVO App montre un outil métier pensé pour le suivi d'atelier.";
  } else if (normalized.includes("methode") || normalized.includes("comment")) {
    answer =
      "On fait simple : on comprend le besoin, on cadre ce qui doit vraiment être livré, on construit proprement, on teste, puis on améliore si les retours terrain le demandent.";
  } else if (normalized.includes("contact") || normalized.includes("mail") || normalized.includes("devis")) {
    answer =
      "Le plus direct est de nous écrire. Le bouton de contact prépare un email à lysmasolutions@gmail.com avec le bon sujet.";
  }

  return avoidRepeatedAnswer(answer, normalized, history);
};

export function LysmaChatbox() {
  const [open, setOpen] = useState(false);
  const conversationId = useRef(`site-vitrine:lysma-hub:${Date.now()}:${Math.random().toString(36).slice(2)}`);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: "Bonjour. Dites-moi ce que vous cherchez : un site, un outil métier, une méthode de travail ou un exemple de réalisation.",
    },
  ]);
  const hasUserMessage = messages.some((message) => message.role === "user");

  const ask = (message: string) => {
    const cleanMessage = message.trim();
    if (!cleanMessage) {
      return;
    }

    const answer = getAnswer(cleanMessage, messages);

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
        metadata: getChatboxPageMetadata(),
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
              <span>Message libre</span>
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

          {!hasUserMessage ? (
            <div className="lysma-chatbox-pre-messages" aria-label="Pré-messages disponibles">
              <span>Pré-messages</span>
              <div className="lysma-chatbox-quick">
                {quickReplies.map((reply) => (
                  <button key={reply} type="button" onClick={() => ask(reply)}>
                    {reply}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

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

      <button
        className="lysma-chatbox-bubble"
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-label={open ? "Fermer la chatbox" : "Ouvrir la chatbox"}
      >
        <MessageCircle aria-hidden="true" />
      </button>
    </div>
  );
}
