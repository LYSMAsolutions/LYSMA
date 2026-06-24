import { NextResponse } from "next/server";
import { ECHO_SYSTEM_PROMPT } from "@/lib/echoPrompt";
import { getDirectAnswer } from "@/lib/direct-answer";
import { saveChatMessage, type ChatRole } from "@/lib/db";
import { askOllama, type EchoChatMessage } from "@/lib/ollama";
import { sanitizeConversation } from "@/lib/response-safety";
import { buildMemoryContextMessage } from "@/lib/memory-context";
import { extractAndStoreMemories } from "@/lib/memory-extractor";
import { identityEngine } from "@/lib/engines/identityEngine";

export const runtime = "nodejs";

const MAX_MESSAGE_LENGTH = 4000;
const MAX_HISTORY_ITEMS = 8;

const DEFAULT_OLLAMA_MODEL = "gemma3:1b";

type IncomingHistoryItem = {
  role?: unknown;
  content?: unknown;
};

function createRequestId() {
  return `echo-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function getPromptSize(messages: EchoChatMessage[]) {
  return messages.reduce((total, message) => total + message.content.length, 0);
}

function getConfiguredModel() {
  return process.env.OLLAMA_MODEL || DEFAULT_OLLAMA_MODEL;
}

function serializeError(error: unknown): Record<string, unknown> {
  if (error instanceof Error) {
    const errorWithCause = error as Error & { cause?: unknown };

    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
      cause: errorWithCause.cause
        ? serializeError(errorWithCause.cause)
        : undefined
    };
  }

  return {
    value: error
  };
}

async function saveChatMessageBestEffort(input: {
  role: ChatRole;
  content: string;
  model: string;
  requestId: string;
  metadata: Record<string, unknown>;
}) {
  try {
    const id = await saveChatMessage(input);

    console.log(`[ECHO][db][${input.requestId}] chat_message_saved`, {
      role: input.role,
      id,
      contentChars: input.content.length
    });

    return id;
  } catch (error) {
    console.error(`[ECHO][db][${input.requestId}] chat_message_save_error`, {
      role: input.role,
      contentChars: input.content.length,
      error: serializeError(error)
    });

    return null;
  }
}

function sanitizeHistory(history: unknown): EchoChatMessage[] {
  if (!Array.isArray(history)) {
    return [];
  }

  const normalizedHistory = history
    .filter((item: IncomingHistoryItem) => {
      return (
        (item.role === "user" || item.role === "assistant") &&
        typeof item.content === "string"
      );
    })
    .map((item) => ({
      role: item.role as "user" | "assistant",
      content: item.content.trim().slice(0, MAX_MESSAGE_LENGTH)
    }))
    .filter((item) => item.content.length > 0);

  return sanitizeConversation(normalizedHistory).slice(-MAX_HISTORY_ITEMS);
}

export async function POST(request: Request) {
  const requestId = createRequestId();
  const startedAt = new Date();
  const startedMs = Date.now();
  const model = getConfiguredModel();

  console.log(`[ECHO][api/chat][${requestId}] start`, {
    startedAt: startedAt.toISOString(),
    method: request.method,
    url: request.url,
    model
  });

  try {
    const body = (await request.json()) as {
      message?: unknown;
      history?: unknown;
    };

    const message =
      typeof body.message === "string" ? body.message.trim() : "";
    const sanitizedHistory = sanitizeHistory(body.history);
    const rawHistoryCount = Array.isArray(body.history)
      ? body.history.length
      : 0;

    console.log(`[ECHO][api/chat][${requestId}] request_body`, {
      receivedAt: new Date().toISOString(),
      durationMs: Date.now() - startedMs,
      messageType: typeof body.message,
      messageChars: message.length,
      rawHistoryCount,
      sanitizedHistoryCount: sanitizedHistory.length
    });

    if (!message) {
      console.warn(`[ECHO][api/chat][${requestId}] validation_error`, {
        endedAt: new Date().toISOString(),
        durationMs: Date.now() - startedMs,
        reason: "empty_message"
      });

      return NextResponse.json(
        { error: "Message vide. Ecris une demande avant d'envoyer." },
        { status: 400 }
      );
    }

    if (message.length > MAX_MESSAGE_LENGTH) {
      console.warn(`[ECHO][api/chat][${requestId}] validation_error`, {
        endedAt: new Date().toISOString(),
        durationMs: Date.now() - startedMs,
        reason: "message_too_long",
        messageChars: message.length,
        maxMessageLength: MAX_MESSAGE_LENGTH
      });

      return NextResponse.json(
        { error: "Message trop long pour cette V2 locale." },
        { status: 400 }
      );
    }

    const directAnswer = getDirectAnswer(message);

    if (directAnswer) {
      const policyModel = "echo-policy-v1";
      const userMessageId = await saveChatMessageBestEffort({
        role: "user",
        content: message,
        model: policyModel,
        requestId,
        metadata: {
          source: "api_chat",
          resolvedBy: directAnswer.reason,
          historyMessageCount: sanitizedHistory.length
        }
      });

      await saveChatMessageBestEffort({
        role: "assistant",
        content: directAnswer.reply,
        model: policyModel,
        requestId,
        metadata: {
          source: "direct_answer_policy",
          sourceUserMessageId: userMessageId,
          resolvedBy: directAnswer.reason,
          durationMs: Date.now() - startedMs
        }
      });

      console.log(`[ECHO][api/chat][${requestId}] direct_answer`, {
        endedAt: new Date().toISOString(),
        durationMs: Date.now() - startedMs,
        reason: directAnswer.reason,
        replyChars: directAnswer.reply.length
      });

      return NextResponse.json({ reply: directAnswer.reply });
    }

    // Charger les mémoires actives et l'état identité en parallèle
    const [memoryContextMessage, identityState] = await Promise.all([
      buildMemoryContextMessage(),
      identityEngine.getEnrichedState(),
    ]);

    const identityNote = identityState.canSuggestFirstName
      ? `\n[IDENTITY] Tu connais suffisamment Mathieu pour personnaliser tes réponses avec son prénom.`
      : "";

    const messages: EchoChatMessage[] = [
      {
        role: "system",
        content: ECHO_SYSTEM_PROMPT + identityNote
      },
      ...(memoryContextMessage ? [memoryContextMessage] : []),
      ...sanitizedHistory,
      {
        role: "user",
        content: message
      }
    ];

    const promptSizeChars = getPromptSize(messages);

    console.log(`[ECHO][api/chat][${requestId}] ollama_payload_ready`, {
      preparedAt: new Date().toISOString(),
      durationMs: Date.now() - startedMs,
      messageCount: messages.length,
      promptSizeChars,
      systemPromptChars: ECHO_SYSTEM_PROMPT.length,
      memoryContextCount: 0,
      historyMessageCount: sanitizedHistory.length,
      latestUserMessageChars: message.length,
      roles: messages.map((item) => item.role)
    });

    const userMessageId = await saveChatMessageBestEffort({
      role: "user",
      content: message,
      model,
      requestId,
      metadata: {
        source: "api_chat",
        promptSizeChars,
        messageCount: messages.length,
        historyMessageCount: sanitizedHistory.length
      }
    });

    const reply = await askOllama(messages, requestId);

    const assistantMessageId = await saveChatMessageBestEffort({
      role: "assistant",
      content: reply,
      model,
      requestId,
      metadata: {
        source: "api_chat",
        sourceUserMessageId: userMessageId,
        durationMs: Date.now() - startedMs,
        promptSizeChars,
        messageCount: messages.length
      }
    });

    // Extraction asynchrone — ne bloque pas la réponse
    extractAndStoreMemories(message, reply, assistantMessageId).catch((err) => {
      console.error(`[ECHO][api/chat][${requestId}] memory_extraction_error`, err);
    });

    console.log(`[ECHO][api/chat][${requestId}] success`, {
      endedAt: new Date().toISOString(),
      durationMs: Date.now() - startedMs,
      replyChars: reply.length
    });

    return NextResponse.json({ reply });
  } catch (error) {
    const rawMessage =
      error instanceof Error ? error.message : "Erreur inconnue.";

    const isOllamaError =
      rawMessage.toLowerCase().includes("ollama") ||
      rawMessage.toLowerCase().includes("fetch failed") ||
      rawMessage.toLowerCase().includes("econnrefused");
    const isRejectedOutput = rawMessage.startsWith("Ollama output rejected:");
    const statusReturned = isRejectedOutput ? 502 : isOllamaError ? 503 : 500;

    console.error(`[ECHO][api/chat][${requestId}] error`, {
      endedAt: new Date().toISOString(),
      durationMs: Date.now() - startedMs,
      rawMessage,
      isOllamaError,
      isRejectedOutput,
      statusReturned,
      error: serializeError(error)
    });

    return NextResponse.json(
      {
        error: isOllamaError
          ? isRejectedOutput
            ? "ECHO n'a pas obtenu de reponse finale exploitable. Reessaie."
            : `Ollama ne repond pas. Verifie qu'il tourne sur http://localhost:11434 et que le modele ${model} est disponible.`
          : "ECHO a rencontre une erreur locale pendant la reponse."
      },
      { status: statusReturned }
    );
  }
}
