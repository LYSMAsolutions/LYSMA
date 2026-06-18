import {
  isGenericIdentityReply,
  isIdentityQuestion,
  isUnsafeAssistantContent,
  requiresYesNoAnswer
} from "@/lib/response-safety";

export type EchoChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

type OllamaChatResponse = {
  message?: {
    role?: string;
    content?: string;
    thinking?: string;
  };
  response?: string;
  thinking?: string;
  done_reason?: string;
  error?: string;
};

type OllamaStructuredAnswer = {
  final_answer?: unknown;
};

const DEFAULT_OLLAMA_BASE_URL = "http://localhost:11434";
const DEFAULT_OLLAMA_MODEL = "gemma3:1b";
const DEFAULT_OLLAMA_TIMEOUT_MS = 60000;
const MAX_REPLY_WORDS = 80;
const FINAL_ANSWER_SCHEMA = {
  type: "object",
  properties: {
    final_answer: {
      type: "string",
      description: "Reponse finale en francais destinee uniquement a Mathieu."
    }
  },
  required: ["final_answer"],
  additionalProperties: false
} as const;

function getOllamaBaseUrl() {
  return (process.env.OLLAMA_BASE_URL || DEFAULT_OLLAMA_BASE_URL).replace(
    /\/$/,
    ""
  );
}

function getOllamaModel() {
  return process.env.OLLAMA_MODEL || DEFAULT_OLLAMA_MODEL;
}

function getOllamaTimeoutMs() {
  const configuredTimeout = Number(process.env.OLLAMA_TIMEOUT_MS);

  if (Number.isFinite(configuredTimeout) && configuredTimeout > 0) {
    return configuredTimeout;
  }

  return DEFAULT_OLLAMA_TIMEOUT_MS;
}

function rejectOllamaOutput(reason: string): never {
  throw new Error(`Ollama output rejected: ${reason}`);
}

function extractFinalAnswer(data: OllamaChatResponse, latestUserMessage: string) {
  if (data.done_reason === "length") {
    rejectOllamaOutput("generation truncated before a safe final answer");
  }

  const content = data.message?.content || data.response || "";
  const withoutThinkBlocks = content
    .replace(/<think>[\s\S]*?<\/think>/gi, "")
    .replace(/<think>[\s\S]*$/gi, "")
    .trim();

  let structured: OllamaStructuredAnswer;

  try {
    structured = JSON.parse(withoutThinkBlocks) as OllamaStructuredAnswer;
  } catch {
    rejectOllamaOutput("response does not match the final-answer JSON schema");
  }

  if (typeof structured.final_answer !== "string") {
    rejectOllamaOutput("final_answer is missing");
  }

  const reply = structured.final_answer.trim();

  if (isUnsafeAssistantContent(reply)) {
    rejectOllamaOutput("internal reasoning or non-French output detected");
  }

  if (
    isGenericIdentityReply(reply) &&
    !isIdentityQuestion(latestUserMessage)
  ) {
    rejectOllamaOutput("generic identity reply does not answer the question");
  }

  if (requiresYesNoAnswer(latestUserMessage)) {
    const binaryAnswer = reply.match(/^\s*(oui|non)\b/i)?.[1];

    if (!binaryAnswer) {
      rejectOllamaOutput("yes-or-no instruction was not respected");
    }

    return `${binaryAnswer[0].toUpperCase()}${binaryAnswer.slice(1).toLowerCase()}.`;
  }

  const words = reply.split(/\s+/);

  if (words.length <= MAX_REPLY_WORDS) {
    return reply;
  }

  return `${words.slice(0, MAX_REPLY_WORDS).join(" ")}…`;
}

function getPromptSize(messages: EchoChatMessage[]) {
  return messages.reduce((total, message) => total + message.content.length, 0);
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

export async function askOllama(
  messages: EchoChatMessage[],
  requestId = "echo-unknown"
) {
  const startedAt = new Date();
  const startedMs = Date.now();
  const baseUrl = getOllamaBaseUrl();
  const model = getOllamaModel();
  const timeoutMs = getOllamaTimeoutMs();
  const promptSizeChars = getPromptSize(messages);
  const payload = {
    model,
    messages,
    think: false,
    stream: false,
    format: FINAL_ANSWER_SCHEMA,
    options: {
      num_ctx: 4096,
      num_predict: 96,
      temperature: 0.1,
      seed: 42
    }
  };

  console.log(`[ECHO][ollama][${requestId}] start`, {
    startedAt: startedAt.toISOString(),
    baseUrl,
    endpoint: `${baseUrl}/api/chat`,
    model,
    timeoutMs,
    think: payload.think,
    stream: payload.stream,
    structuredOutput: true,
    messageCount: messages.length,
    promptSizeChars,
    messageSizes: messages.map((message) => ({
      role: message.role,
      chars: message.content.length
    })),
    options: payload.options
  });

  let response: Response;

  try {
    response = await fetch(`${baseUrl}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      signal: AbortSignal.timeout(timeoutMs),
      body: JSON.stringify(payload)
    });
  } catch (error) {
    console.error(`[ECHO][ollama][${requestId}] fetch_error`, {
      endedAt: new Date().toISOString(),
      durationMs: Date.now() - startedMs,
      model,
      timeoutMs,
      messageCount: messages.length,
      promptSizeChars,
      error: serializeError(error)
    });

    const message = error instanceof Error ? error.message : "unknown error";
    throw new Error(`Ollama request failed: ${message}`);
  }

  console.log(`[ECHO][ollama][${requestId}] response_headers`, {
    receivedAt: new Date().toISOString(),
    durationMs: Date.now() - startedMs,
    status: response.status,
    statusText: response.statusText,
    ok: response.ok,
    contentType: response.headers.get("content-type")
  });

  const rawBody = await response.text();

  console.log(`[ECHO][ollama][${requestId}] raw_body_received`, {
    receivedAt: new Date().toISOString(),
    durationMs: Date.now() - startedMs,
    status: response.status,
    rawBodyChars: rawBody.length
  });

  if (!response.ok) {
    throw new Error(
      `Ollama error ${response.status}: ${rawBody || response.statusText}`
    );
  }

  let data: OllamaChatResponse;

  try {
    data = JSON.parse(rawBody) as OllamaChatResponse;
  } catch (error) {
    console.error(`[ECHO][ollama][${requestId}] parse_error`, {
      endedAt: new Date().toISOString(),
      durationMs: Date.now() - startedMs,
      status: response.status,
      rawBodyChars: rawBody.length,
      error: serializeError(error)
    });

    throw new Error("Ollama returned invalid JSON.");
  }

  const rawReply = data.message?.content || data.response || "";
  const latestUserMessage =
    [...messages].reverse().find((message) => message.role === "user")
      ?.content || "";
  const thinkingChars =
    (data.message?.thinking?.length || 0) + (data.thinking?.length || 0);
  const reply = extractFinalAnswer(data, latestUserMessage);

  console.log(`[ECHO][ollama][${requestId}] parsed_response`, {
    endedAt: new Date().toISOString(),
    durationMs: Date.now() - startedMs,
    model,
    messageCount: messages.length,
    promptSizeChars,
    hasMessageContent: typeof data.message?.content === "string",
    hasLegacyResponse: typeof data.response === "string",
    thinkingDiscarded: thinkingChars > 0,
    thinkingChars,
    doneReason: data.done_reason,
    rawReplyChars: rawReply.length,
    finalReplyChars: reply.length
  });

  if (!reply) {
    console.error(`[ECHO][ollama][${requestId}] empty_reply`, {
      endedAt: new Date().toISOString(),
      durationMs: Date.now() - startedMs,
      rawReplyChars: rawReply.length
    });

    throw new Error("Ollama returned an empty final response.");
  }

  return reply;
}
