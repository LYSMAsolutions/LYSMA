const REASONING_LEAK_PATTERNS = [
  /<\/?think>/i,
  /(^|\n)\s*(analysis|reasoning)\s*:/i,
  /^\s*(okay[,!.]?\s*)?(let'?s|let us)\s+(see|think|analy[sz]e)\b/i,
  /\bthe user (is|asked|wants)\b/i,
  /\bi need to (follow|answer|respond|analy[sz]e)\b/i,
  /\bsystem prompt\b/i
];

const GENERIC_IDENTITY_PATTERNS = [
  /^\s*je suis echo\b/i,
  /^\s*oui[,\s]+je suis echo\b/i,
  /^\s*echo est (ton|votre) (assistant|intelligence)\b/i
];

const IDENTITY_QUESTION_PATTERNS = [
  /\bqui es[- ]tu\b/i,
  /\bpresente[- ]toi\b/i,
  /\bquelle est ton identite\b/i
];

const ENGLISH_WORDS =
  /\b(the|user|answer|should|need|first|then|because|this|that|with|from|into|let|okay)\b/gi;
const FRENCH_WORDS =
  /\b(le|la|les|un|une|je|tu|vous|oui|non|est|suis|avec|pour|dans|que|qui|pas)\b/gi;

type ConversationMessage = {
  role: string;
  content: string;
};

export function containsReasoningLeak(content: string) {
  return REASONING_LEAK_PATTERNS.some((pattern) => pattern.test(content));
}

export function appearsToBeEnglish(content: string) {
  const englishWords = content.match(ENGLISH_WORDS)?.length || 0;
  const frenchWords = content.match(FRENCH_WORDS)?.length || 0;

  return englishWords >= 3 && englishWords > frenchWords;
}

export function isGenericIdentityReply(content: string) {
  return GENERIC_IDENTITY_PATTERNS.some((pattern) => pattern.test(content));
}

export function isIdentityQuestion(content: string) {
  return IDENTITY_QUESTION_PATTERNS.some((pattern) => pattern.test(content));
}

export function requiresYesNoAnswer(content: string) {
  return /\b(uniquement|seulement)\s+(par\s+)?oui\s+ou\s+non\b/i.test(
    content
  );
}

export function isUnsafeAssistantContent(content: string) {
  return containsReasoningLeak(content) || appearsToBeEnglish(content);
}

export function sanitizeConversation<T extends ConversationMessage>(
  messages: T[]
) {
  return messages.filter((message, index) => {
    if (message.role !== "assistant") {
      return true;
    }

    if (isUnsafeAssistantContent(message.content)) {
      return false;
    }

    if (!isGenericIdentityReply(message.content)) {
      return true;
    }

    for (let previousIndex = index - 1; previousIndex >= 0; previousIndex -= 1) {
      const previousMessage = messages[previousIndex];

      if (previousMessage.role === "user") {
        return isIdentityQuestion(previousMessage.content);
      }
    }

    return false;
  });
}
