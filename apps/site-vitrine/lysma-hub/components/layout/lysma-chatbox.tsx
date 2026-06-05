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
  "Pour avancer concrètement, dites-nous le métier, les utilisateurs de l'outil, les informations à suivre et le moment où vous perdez le plus de temps. À partir de ça, nous pouvons cadrer une version simple sans vous demander un cahier des charges complet.",
  "Si le sujet est déjà cadré, envoyez-nous deux ou trois situations réelles : une demande client, une intervention, un suivi ou une donnée à retrouver. C'est suffisant pour proposer une première structure d'outil.",
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

  return "Je vous ai déjà donné les grandes lignes. Pour préciser, le plus utile est de nous dire votre objectif, votre métier et ce que vous voulez simplifier.";
};

const getAnswer = (message: string, history: ChatMessage[] = []) => {
  const normalized = normalizeQuestion(message);
  let answer =
    "Nous pouvons vous orienter sur un site premium, un outil web métier ou la meilleure façon de cadrer votre besoin. Pour une demande précise, écrivez-nous directement.";

  if (normalized.includes("site")) {
    answer =
      "Nous créons des sites vitrines premium à la demande, avec une vraie structure, un domaine propre, du contenu lisible et une base pensée pour évoluer.";
  } else if (isToolQuestion(normalized) && hasAnyKeyword(normalized, ["plombier", "plomberie"])) {
    answer =
      "Pour un plombier, nous chercherions d'abord le vrai point de friction : demandes clients, urgences, devis, interventions, photos, suivi de chantier ou rappels. Pour cadrer l'outil, nous avons surtout besoin de savoir qui l'utilise, quelles informations reviennent à chaque intervention et ce qui vous fait perdre du temps. Deux ou trois situations réelles suffisent pour proposer une première version simple.";
  } else if (
    isToolQuestion(normalized) &&
    hasAnyKeyword(normalized, ["besoin", "besoins", "metier", "artisan", "chantier", "intervention", "depannage", "planning"])
  ) {
    answer =
      "Pour cadrer un outil métier, nous avons besoin d'un problème concret : qui l'utilise, quelles informations doivent être suivies, ce qui prend trop de temps et quelle action doit devenir plus simple. On peut ensuite imaginer une première version utile, par exemple un suivi de demandes, un tableau d'activité ou des fiches de travail.";
  } else if (isToolQuestion(normalized)) {
    answer =
      "Pour un outil web, nous partons d'un besoin métier concret : organisation, suivi, centralisation ou gain de temps. L'objectif est de livrer une première version utile, puis de l'améliorer avec les retours terrain.";
  } else if (normalized.includes("realisation") || normalized.includes("livo") || normalized.includes("mounier")) {
    answer =
      "Vous pouvez découvrir nos réalisations sur la page dédiée : Carrosserie Mounier pour une vitrine premium, et LIVO App pour un outil web métier.";
  } else if (normalized.includes("methode") || normalized.includes("comment")) {
    answer =
      "Notre méthode reste simple : comprendre le besoin, cadrer le projet, construire proprement, tester, livrer puis améliorer si nécessaire.";
  } else if (normalized.includes("contact") || normalized.includes("mail") || normalized.includes("devis")) {
    answer =
      "Le plus simple est de nous écrire directement. Le bouton de contact prépare un email à lysmasolutions@gmail.com.";
  }

  return avoidRepeatedAnswer(answer, normalized, history);
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
