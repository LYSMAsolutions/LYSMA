"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { Flag, MessageCircle, Send, X } from "lucide-react";
import { getChatboxPageMetadata } from "../../lib/chatbox-page-metadata";

type ProblemType =
  | "USER_REPORTED"
  | "MISUNDERSTANDING"
  | "LOST_CONTEXT"
  | "USER_NEGATIVE_FEEDBACK";

type ChatMessage = {
  role: "assistant" | "user";
  content: string;
  reportPrompt?: string;
  reportAnswer?: string;
};

type UpdateNotice = {
  id: string;
  userPrompt: string;
  improvedResponse: string;
};

const CHATBOX_SOURCE = "site-vitrine:lysma-hub";
const STORAGE_PREFIX = "lysma:chatbox:v3:lysma-hub";
const VISITOR_KEY = `${STORAGE_PREFIX}:visitorId`;
const SESSION_KEY = `${STORAGE_PREFIX}:sessionId`;
const CONVERSATION_KEY = `${STORAGE_PREFIX}:conversationId`;
const OPT_OUT_KEY = `${STORAGE_PREFIX}:disabled`;

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

const detectNegativeFeedback = (message: string): ProblemType | null => {
  const normalized = normalizeQuestion(message);
  if (
    [
      "tu nas pas repondu",
      "tu n as pas repondu",
      "ce nest pas ma question",
      "ce n est pas ma question",
      "tu reponds a cote",
      "tu nas pas compris",
      "tu n as pas compris",
    ].some((phrase) => normalized.includes(phrase))
  ) {
    return "MISUNDERSTANDING";
  }

  if (
    [
      "relis ma question",
      "ce nest pas ce que jai demande",
      "ce n est pas ce que j ai demande",
      "pourquoi tu me parles de ca",
    ].some((phrase) => normalized.includes(phrase))
  ) {
    return "LOST_CONTEXT";
  }

  if (["cest faux", "c est faux", "nimporte quoi", "n importe quoi"].some((phrase) => normalized.includes(phrase))) {
    return "USER_NEGATIVE_FEEDBACK";
  }

  return null;
};

const randomId = (prefix: string) => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}_${crypto.randomUUID()}`;
  }

  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 12)}`;
};

const readStorageId = (storage: Storage | undefined, key: string, prefix: string) => {
  if (!storage) return randomId(prefix);

  try {
    const existing = storage.getItem(key);
    if (existing) return existing;
    const generated = randomId(prefix);
    storage.setItem(key, generated);
    return generated;
  } catch {
    return randomId(prefix);
  }
};

const isStorageDisabled = () => {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(OPT_OUT_KEY) === "true";
};

const getVisitorId = () => {
  if (typeof window === "undefined" || isStorageDisabled()) return null;
  return readStorageId(window.localStorage, VISITOR_KEY, "visitor");
};

const getSessionId = () => {
  if (typeof window === "undefined" || isStorageDisabled()) return randomId("session");
  return readStorageId(window.sessionStorage, SESSION_KEY, "session");
};

const getConversationId = () => {
  if (typeof window === "undefined" || isStorageDisabled()) return randomId("conversation");
  return readStorageId(window.sessionStorage, CONVERSATION_KEY, "conversation");
};

const getLastExchange = (messages: ChatMessage[]) => {
  for (let index = messages.length - 1; index >= 1; index -= 1) {
    const answer = messages[index];
    const question = messages[index - 1];
    if (answer.role === "assistant" && question.role === "user") {
      return { prompt: question.content, answer: answer.content };
    }
  }

  return null;
};

export function LysmaChatbox() {
  const [open, setOpen] = useState(false);
  const [visitorId, setVisitorId] = useState<string | null>(null);
  const [storageDisabled, setStorageDisabled] = useState(false);
  const [updates, setUpdates] = useState<UpdateNotice[]>([]);
  const [hasUnreadUpdates, setHasUnreadUpdates] = useState(false);
  const [reportNotice, setReportNotice] = useState<string | null>(null);
  const visitorIdRef = useRef<string | null>(null);
  const sessionId = useRef(getSessionId());
  const conversationId = useRef(getConversationId());
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: "Bonjour. Dites-moi ce que vous cherchez : un site, un outil métier, une méthode de travail ou un exemple de réalisation.",
    },
  ]);
  const hasUserMessage = messages.some((message) => message.role === "user");

  useEffect(() => {
    const disabled = isStorageDisabled();
    const nextVisitorId = getVisitorId();
    visitorIdRef.current = nextVisitorId;
    sessionId.current = getSessionId();
    conversationId.current = getConversationId();
    setVisitorId(nextVisitorId);
    setStorageDisabled(disabled);

    if (nextVisitorId) {
      void loadUpdates(nextVisitorId);
    }
  }, []);

  useEffect(() => {
    if (!open || !visitorIdRef.current || !hasUnreadUpdates || updates.length === 0) return;

    setHasUnreadUpdates(false);
    updates.forEach((update) => {
      void fetch("/api/chatbox/updates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visitorId: visitorIdRef.current, updateId: update.id }),
      }).catch(() => undefined);
    });
  }, [hasUnreadUpdates, open, updates]);

  const loadUpdates = async (nextVisitorId: string) => {
    const response = await fetch(`/api/chatbox/updates?visitorId=${encodeURIComponent(nextVisitorId)}`).catch(() => null);
    if (!response?.ok) return;
    const data = await response.json().catch(() => null) as { updates?: UpdateNotice[] } | null;
    const unread = data?.updates ?? [];
    setUpdates(unread);
    setHasUnreadUpdates(unread.length > 0);
  };

  const logChatExchange = (input: {
    userPrompt: string;
    assistantResponse: string;
    quality?: "UNKNOWN" | "GOOD" | "BAD";
    qualityNotes?: string;
    problemType?: ProblemType;
    metadata?: Record<string, unknown>;
  }) => {
    void fetch("/api/chatbox/log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source: CHATBOX_SOURCE,
        conversationId: conversationId.current,
        visitorId: visitorIdRef.current,
        sessionId: sessionId.current,
        userPrompt: input.userPrompt,
        assistantResponse: input.assistantResponse,
        quality: input.quality,
        qualityNotes: input.qualityNotes,
        problemType: input.problemType,
        metadata: {
          ...getChatboxPageMetadata(),
          privacy: {
            visitorIdEnabled: Boolean(visitorIdRef.current),
            storageDisabled,
          },
          ...input.metadata,
        },
      }),
    }).catch((error) => {
      console.error("Chatbox log error:", error);
    });
  };

  const ask = (message: string) => {
    const cleanMessage = message.trim();
    if (!cleanMessage) {
      return;
    }

    setReportNotice(null);
    const problemType = detectNegativeFeedback(cleanMessage);

    if (problemType) {
      const previous = getLastExchange(messages);
      const answer = previous
        ? `D'accord, je reprends en partant de votre question précédente. ${getAnswer(previous.prompt, messages)}`
        : "D'accord, je reprends. Ma réponse précédente n'était pas assez claire : pouvez-vous préciser le point à corriger ?";

      setMessages((current) => [
        ...current,
        { role: "user", content: cleanMessage },
        { role: "assistant", content: answer },
      ]);

      logChatExchange({
        userPrompt: cleanMessage,
        assistantResponse: previous?.answer ?? answer,
        quality: "BAD",
        problemType,
        qualityNotes: "Signal d'incomprehension utilisateur depuis la chatbox.",
        metadata: previous ? { feedback: previous } : undefined,
      });
      return;
    }

    const answer = getAnswer(cleanMessage, messages);

    setMessages((current) => [
      ...current,
      { role: "user", content: cleanMessage },
      { role: "assistant", content: answer, reportPrompt: cleanMessage, reportAnswer: answer },
    ]);

    logChatExchange({
      userPrompt: cleanMessage,
      assistantResponse: answer,
    });
  };

  const reportAnswer = (prompt: string, answer: string) => {
    logChatExchange({
      userPrompt: prompt,
      assistantResponse: answer,
      quality: "BAD",
      problemType: "USER_REPORTED",
      qualityNotes: "Signalement utilisateur depuis la chatbox.",
      metadata: { report: { reportedAnswer: answer } },
    });
    setReportNotice("Merci, le retour a bien été transmis. Cela nous aide à améliorer les réponses.");
  };

  const disableConversationStorage = () => {
    try {
      window.localStorage.setItem(OPT_OUT_KEY, "true");
      window.localStorage.removeItem(VISITOR_KEY);
      window.sessionStorage.removeItem(SESSION_KEY);
      window.sessionStorage.removeItem(CONVERSATION_KEY);
    } catch {
      // Local storage may be unavailable; keep the chat usable.
    }

    visitorIdRef.current = null;
    sessionId.current = randomId("session");
    conversationId.current = randomId("conversation");
    setVisitorId(null);
    setUpdates([]);
    setHasUnreadUpdates(false);
    setStorageDisabled(true);
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

          {updates.length > 0 ? (
            <div className="lysma-chatbox-updates">
              <strong>Une réponse à votre question a été améliorée.</strong>
              {updates.map((update) => (
                <div key={update.id}>
                  <span>Question initiale</span>
                  <p>{update.userPrompt}</p>
                  <span>Nouvelle réponse</span>
                  <p>{update.improvedResponse}</p>
                </div>
              ))}
            </div>
          ) : null}

          <div className="lysma-chatbox-messages">
            {messages.map((message, index) => (
              <div key={`${message.role}-${index}`} className="lysma-chatbox-message-row">
                <p className={`lysma-chatbox-message is-${message.role}`}>
                  {message.content}
                </p>
                {message.role === "assistant" && message.reportPrompt && message.reportAnswer ? (
                  <button
                    type="button"
                    className="lysma-chatbox-report"
                    onClick={() => reportAnswer(message.reportPrompt!, message.reportAnswer!)}
                  >
                    <Flag aria-hidden="true" />
                    Signaler cette réponse
                  </button>
                ) : null}
              </div>
            ))}
          </div>

          {reportNotice ? <p className="lysma-chatbox-feedback">{reportNotice}</p> : null}

          <p className="lysma-chatbox-notice">
            Les échanges peuvent être enregistrés pour améliorer la qualité des réponses. L'identifiant anonyme sert seulement à retrouver cette conversation sur ce site.
          </p>

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

          <div className="lysma-chatbox-footer-actions">
            <a className="lysma-chatbox-mail" href={mailUrl}>
              Écrire à LYSMA
            </a>
            <button type="button" onClick={disableConversationStorage} disabled={storageDisabled}>
              {visitorId ? "Ne pas conserver ma conversation" : "Conversation non conservée"}
            </button>
          </div>
        </section>
      ) : null}

      <button
        className="lysma-chatbox-bubble"
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-label={open ? "Fermer la chatbox" : "Ouvrir la chatbox"}
      >
        {hasUnreadUpdates && !open ? <span className="lysma-chatbox-badge" aria-hidden="true" /> : null}
        <MessageCircle aria-hidden="true" />
      </button>
    </div>
  );
}
