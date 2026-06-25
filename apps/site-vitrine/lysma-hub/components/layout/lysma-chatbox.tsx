"use client";

import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { Flag, MessageCircle, Send, X } from "lucide-react";
import { getChatboxPageMetadata } from "../../lib/chatbox-page-metadata";

type ProblemType =
  | "USER_REPORTED"
  | "MISUNDERSTANDING"
  | "LOST_CONTEXT"
  | "USER_NEGATIVE_FEEDBACK"
  | "DUPLICATE";

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
    "LYSMA Solutions crée des sites vitrines premium et des outils web métier sur mesure. Dites-nous ce que vous cherchez à résoudre ou à mettre en place — nous pouvons cadrer votre besoin rapidement.";

  if (hasAnyKeyword(normalized, ["prix", "tarif", "combien", "cout", "budget", "investissement"])) {
    answer =
      "Chaque projet étant différent, nous travaillons sur devis. Le prix dépend de la complexité, du contenu à produire et des fonctionnalités souhaitées. Écrivez-nous avec quelques détails sur votre projet pour qu'on vous réponde précisément.";
  } else if (hasAnyKeyword(normalized, ["delai", "duree", "temps", "quand", "livraison", "combien de temps"])) {
    answer =
      "Les délais varient selon l'ampleur du projet. Un site vitrine peut être livré en quelques semaines. Un outil métier demande un peu plus de temps selon les fonctionnalités. Nous travaillons par étapes : on livre une première version utile rapidement, puis on améliore.";
  } else if (normalized.includes("site") && !isToolQuestion(normalized)) {
    answer =
      "Nous créons des sites vitrines premium pensés pour durer : structure claire, contenu lisible, domaine propre, hébergement inclus et base technique solide. Chaque site est conçu sur mesure — pas de template générique. Vous pouvez voir Carrosserie Mounier comme exemple de réalisation.";
  } else if (isToolQuestion(normalized) && hasAnyKeyword(normalized, ["plombier", "plomberie", "electricien", "artisan", "batiment", "chantier"])) {
    answer =
      "Pour un artisan, le vrai sujet c'est souvent la perte de temps : devis à rédiger, interventions à suivre, clients à rappeler. Dites-nous quel moment de votre journée vous coûte le plus de temps — c'est là qu'un outil bien ciblé fait la différence.";
  } else if (isToolQuestion(normalized) && hasAnyKeyword(normalized, ["garage", "carrosserie", "mecanique", "atelier", "reparation"])) {
    answer =
      "Pour un garage ou un atelier, LIVO App est notre outil métier : suivi des ordres de réparation, pointage compagnons, fiches véhicules et indicateurs de rentabilité. Vous pouvez découvrir LIVO sur la page réalisations.";
  } else if (
    isToolQuestion(normalized) &&
    hasAnyKeyword(normalized, ["besoin", "metier", "suivi", "gestion", "intervention", "depannage", "planning", "organisation"])
  ) {
    answer =
      "Pour cadrer un outil métier, nous avons besoin d'un problème concret : qui l'utilise au quotidien, quelles informations doivent être suivies et ce qui prend trop de temps. Deux ou trois situations réelles suffisent pour proposer une première structure utile.";
  } else if (isToolQuestion(normalized)) {
    answer =
      "Nous créons des outils web métier sur mesure : organisation interne, suivi d'activité, centralisation de données ou automatisation de tâches répétitives. On part toujours d'un besoin concret et on livre une première version utilisable rapidement.";
  } else if (hasAnyKeyword(normalized, ["realisation", "exemple", "portfolio", "reference", "livo", "mounier"])) {
    answer =
      "Nos deux réalisations principales : Carrosserie Mounier, un site vitrine premium pour une carrosserie locale, et LIVO App, un outil web métier pour la gestion d'atelier automobile. Les deux sont accessibles depuis la page réalisations.";
  } else if (hasAnyKeyword(normalized, ["methode", "comment", "fonctionne", "processus", "etape", "demarche"])) {
    answer =
      "Notre méthode : on commence par comprendre le vrai besoin, on cadre le projet en quelques échanges, on construit proprement, on teste avec vous, on livre. Ensuite on améliore sur la durée si nécessaire. Pas de cahier des charges imposé — on avance à votre rythme.";
  } else if (hasAnyKeyword(normalized, ["envoie", "envoyer", "transmettre", "faire parvenir", "vous l envoie", "vous envoyer"])) {
    answer =
      "Envoyez-nous vos informations directement à lysmasolutions@gmail.com. Vous pouvez aussi utiliser le bouton de contact ci-dessous — il prépare le message avec le bon sujet. Nous revenons vers vous rapidement.";
  } else if (hasAnyKeyword(normalized, ["contact", "mail", "email", "ecrire", "joindre", "parler", "echanger", "appel"])) {
    answer =
      "Le plus simple est de nous écrire directement à lysmasolutions@gmail.com. Le bouton de contact prépare le message avec le bon sujet. Nous répondons rapidement.";
  } else if (hasAnyKeyword(normalized, ["devis", "proposition", "projet"])) {
    answer =
      "Pour recevoir une proposition, partagez-nous votre contexte : type de projet (site ou outil), votre secteur, ce que vous voulez améliorer ou créer. Nous revenons vers vous avec une première orientation sans engagement.";
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

function CopyEmailButton({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);
  const copy = useCallback(() => {
    navigator.clipboard.writeText(email).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [email]);
  return (
    <button type="button" className="lysma-chatbox-copy-email" onClick={copy}>
      {copied ? "Adresse copiée ✓" : "Copier l'adresse mail"}
    </button>
  );
}

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

    const previousAnswers = messages
      .filter((m) => m.role === "assistant")
      .map((m) => m.content);
    const isDuplicate = previousAnswers.includes(answer);

    setMessages((current) => [
      ...current,
      { role: "user", content: cleanMessage },
      { role: "assistant", content: answer, reportPrompt: cleanMessage, reportAnswer: answer },
    ]);

    logChatExchange({
      userPrompt: cleanMessage,
      assistantResponse: answer,
      quality: isDuplicate ? "BAD" : "UNKNOWN",
      problemType: isDuplicate ? "DUPLICATE" : undefined,
      qualityNotes: isDuplicate ? "Réponse identique à une réponse précédente dans la conversation." : undefined,
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
            <CopyEmailButton email="lysmasolutions@gmail.com" />
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
