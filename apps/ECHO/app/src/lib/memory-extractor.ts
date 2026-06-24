import { memoryEngine } from "@/lib/engines";
import type { MemoryCandidate } from "@/lib/engines/types";

const EXTRACTION_SCHEMA = {
  type: "object",
  properties: {
    memories: {
      type: "array",
      items: {
        type: "object",
        properties: {
          type: { type: "string", enum: ["fait", "preference", "decision", "hypothese", "a_verifier"] },
          summary: { type: "string" },
          confidence: { type: "number" },
          sensitivity: { type: "string", enum: ["faible", "moyenne", "elevee", "critique"] },
          category: { type: "string" },
        },
        required: ["type", "summary", "confidence", "sensitivity"],
        additionalProperties: false,
      },
    },
  },
  required: ["memories"],
  additionalProperties: false,
} as const;

type RawMemoryCandidate = {
  type?: unknown;
  summary?: unknown;
  confidence?: unknown;
  sensitivity?: unknown;
  category?: unknown;
};

type ExtractionResult = {
  memories?: RawMemoryCandidate[];
};

const VALID_TYPES = ["fait", "preference", "decision", "hypothese", "a_verifier"] as const;
const VALID_SENSITIVITIES = ["faible", "moyenne", "elevee", "critique"] as const;

type ValidType = typeof VALID_TYPES[number];
type ValidSensitivity = typeof VALID_SENSITIVITIES[number];

function isValidType(v: unknown): v is ValidType {
  return VALID_TYPES.includes(v as ValidType);
}
function isValidSensitivity(v: unknown): v is ValidSensitivity {
  return VALID_SENSITIVITIES.includes(v as ValidSensitivity);
}

function resolveMemoryLevel(
  confidence: number,
  sensitivity: ValidSensitivity,
  type: ValidType
): MemoryCandidate["level"] {
  if (type === "decision") return "protected";
  if (sensitivity === "elevee" || sensitivity === "critique") return "protected";
  if (confidence >= 0.71 && sensitivity === "faible") return "autonomous";
  if (confidence >= 0.41 && confidence <= 0.70) return "probabilistic";
  return "protected";
}

async function callOllamaExtractor(
  userMessage: string,
  assistantReply: string
): Promise<ExtractionResult | null> {
  const baseUrl = (process.env.OLLAMA_BASE_URL || "http://localhost:11434").replace(/\/$/, "");
  const model = process.env.OLLAMA_MODEL || "mistral:7b";

  const extractionPrompt = `Tu es un extracteur de mémoire.
Analyse l'échange suivant et extrais les informations importantes sur Mathieu.

ÉCHANGE :
Mathieu : "${userMessage.slice(0, 800)}"
ECHO : "${assistantReply.slice(0, 400)}"

Retourne UNIQUEMENT les informations factuelles, préférences, décisions ou hypothèses sur Mathieu.
N'extrais rien si l'échange est banal ou ne révèle rien de nouveau.
Pour chaque élément, estime la confiance (0.0 à 1.0) et la sensibilité.`;

  try {
    const res = await fetch(`${baseUrl}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: AbortSignal.timeout(30000),
      body: JSON.stringify({
        model,
        messages: [{ role: "user", content: extractionPrompt }],
        stream: false,
        think: false,
        format: EXTRACTION_SCHEMA,
        options: { num_ctx: 2048, num_predict: 256, temperature: 0.0, seed: 0 },
      }),
    });

    if (!res.ok) return null;

    const data = await res.json() as { message?: { content?: string }; response?: string };
    const raw = data.message?.content || data.response || "";
    const cleaned = raw.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();
    return JSON.parse(cleaned) as ExtractionResult;
  } catch {
    return null;
  }
}

export async function extractAndStoreMemories(
  userMessage: string,
  assistantReply: string,
  sourceMessageId?: string | null
): Promise<void> {
  const result = await callOllamaExtractor(userMessage, assistantReply);
  if (!result?.memories?.length) return;

  for (const raw of result.memories) {
    if (
      typeof raw.summary !== "string" ||
      !raw.summary.trim() ||
      typeof raw.confidence !== "number" ||
      !isValidType(raw.type) ||
      !isValidSensitivity(raw.sensitivity)
    ) {
      continue;
    }

    const candidate: MemoryCandidate = {
      level: resolveMemoryLevel(raw.confidence, raw.sensitivity, raw.type),
      type: raw.type === "hypothese" ? "hypothese" : raw.type,
      sensitivity: raw.sensitivity,
      confidence: Math.max(0, Math.min(1, raw.confidence)),
      summary: raw.summary.trim().slice(0, 500),
      sourceContent: `${userMessage.slice(0, 300)} → ${assistantReply.slice(0, 200)}`,
      sourceMessageId: sourceMessageId ?? undefined,
      category: typeof raw.category === "string" ? raw.category : "general",
      source: "chat_extraction",
    };

    try {
      await memoryEngine.storeCandidate(candidate);
    } catch (err) {
      console.error("[ECHO][memory-extractor] storeCandidate failed", err);
    }
  }
}
