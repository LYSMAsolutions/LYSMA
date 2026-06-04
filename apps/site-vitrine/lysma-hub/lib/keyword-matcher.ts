import { assistantKnowledge } from "../data/assistant-knowledge";
import type { AssistantRule } from "./site-types";

const fallbackAnswer =
  "Je ne suis pas certain de pouvoir répondre précisément. Le plus simple est de nous envoyer votre demande avec vos coordonnées, l'atelier vous recontactera rapidement.";

export const normalizeMessage = (message: string) =>
  message
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const scoreRule = (normalizedMessage: string, rule: AssistantRule) => {
  const matchedKeywords = rule.keywords.filter((keyword) =>
    normalizedMessage.includes(normalizeMessage(keyword)),
  );

  return {
    rule,
    matchedKeywords,
    score: matchedKeywords.length / Math.max(rule.keywords.length, 1),
  };
};

export const matchAssistantAnswer = (siteSlug: string, message: string) => {
  const normalizedMessage = normalizeMessage(message);
  const siteRules = assistantKnowledge.filter((rule) => rule.siteSlug === siteSlug);
  const ranked = siteRules
    .map((rule) => scoreRule(normalizedMessage, rule))
    .sort((a, b) => b.matchedKeywords.length - a.matchedKeywords.length || b.score - a.score);

  const best = ranked[0];

  if (!normalizedMessage || !best || best.matchedKeywords.length === 0) {
    return {
      answer: fallbackAnswer,
      matchedKeywords: [],
      confidence: 0.18,
      action: { label: "Envoyer une demande", type: "contact" as const },
    };
  }

  return {
    answer: best.rule.answer,
    matchedKeywords: best.matchedKeywords,
    confidence: Math.min(0.95, 0.45 + best.matchedKeywords.length * 0.18),
    action: best.rule.action,
  };
};
