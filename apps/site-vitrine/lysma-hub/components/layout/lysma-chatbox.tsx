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
  "Oui. Dites-nous le métier, qui utilisera l'outil et ce qui vous fait perdre du temps. Avec ça, on peut cadrer une première version sans gros cahier des charges.",
  "Si vous avez déjà une idée, envoyez-nous deux ou trois situations réelles : une demande client, une intervention ou une donnée difficile à retrouver. C'est souvent suffisant pour démarrer proprement.",
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

  return "Je vous ai déjà donné les grandes lignes. Pour préciser, dites-nous surtout votre métier et ce que vous voulez simplifier au quotidien.";
};

const getAnswer = (message: string, history: ChatMessage[] = []) => {
  const normalized = normalizeQuestion(message);
  let answer =
    "Je peux vous guider sur un site vitrine, un outil métier ou la façon de cadrer votre besoin. Pour un cas précis, écrivez-nous avec deux ou trois détails.";

  if (hasAnyKeyword(normalized, ["prix", "tarif", "combien", "cout", "budget", "devis"])) {
    answer =
      "Je ne peux pas donner un prix sérieux sans connaître le besoin. Le montant dépend du contenu, du nombre de pages, des fonctionnalités et du suivi attendu. Pour un devis, envoyez-nous le contexte du projet.";
  } else if (hasAnyKeyword(normalized, ["boutique", "ecommerce", "e-commerce", "reservation", "réservation"])) {
    answer =
      "Non. LYSMA ne fait pas de boutique en ligne ni de gros système de réservation. Nous restons concentrés sur les sites vitrines et les outils métier simples.";
  } else if (normalized.includes("site")) {
    answer =
      "Oui. Pour un site, nous construisons une vitrine claire : structure, domaine, contenus et pages importantes. Le but est que le visiteur comprenne vite qui vous êtes et comment vous contacter.";
  } else if (isToolQuestion(normalized) && hasAnyKeyword(normalized, ["plombier", "plomberie"])) {
    answer =
      "Pour un plombier, je commencerais par ce qui prend du temps : urgences, devis, interventions, photos, rappels ou planning. Il nous faut surtout savoir qui utilise l'outil et quelles infos reviennent à chaque intervention.";
  } else if (
    isToolQuestion(normalized) &&
    hasAnyKeyword(normalized, ["besoin", "besoins", "metier", "artisan", "chantier", "intervention", "depannage", "planning"])
  ) {
    answer =
      "Le bon point de départ, c'est un problème concret : qui utilise l'outil, quelles infos doivent être suivies et quelle action doit devenir plus simple. Ensuite, on peut proposer une première version utile.";
  } else if (isToolQuestion(normalized)) {
    answer =
      "Un outil utile part rarement d'une liste de fonctionnalités. On part plutôt d'un problème métier : organiser, suivre, centraliser ou gagner du temps.";
  } else if (normalized.includes("realisation") || normalized.includes("livo") || normalized.includes("mounier")) {
    answer =
      "Oui. Carrosserie Mounier montre un site vitrine, et LIVO App montre un outil métier pensé pour le suivi d'atelier.";
  } else if (normalized.includes("methode") || normalized.includes("comment")) {
    answer =
      "On fait simple : comprendre le besoin, cadrer ce qui doit être livré, construire, tester, puis améliorer si les retours terrain le demandent.";
  } else if (normalized.includes("contact") || normalized.includes("mail") || normalized.includes("devis")) {
    answer =
      "Le plus direct est de nous écrire. Le bouton de contact prépare un email à lysmasolutions@gmail.com.";
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
