import { PrismaPg } from "@prisma/adapter-pg";
import { Prisma, PrismaClient } from "@/generated/prisma/client";

type EchoGlobal = typeof globalThis & {
  echoPrisma?: PrismaClient;
};

export type DatabaseReadiness = {
  planned: true;
  configured: boolean;
  message: string;
};

export type ChatRole = "system" | "user" | "assistant";

export type SaveChatMessageInput = {
  role: ChatRole;
  content: string;
  model?: string;
  requestId?: string;
  metadata?: Record<string, unknown>;
};

export type MemoryEntryType =
  | "fait"
  | "hypothese"
  | "preference"
  | "decision"
  | "contradiction"
  | "a_verifier";

export type SensitivityLevel = "faible" | "moyenne" | "elevee" | "critique";

export type MemoryStatus =
  | "autonome"
  | "probabiliste"
  | "en_validation"
  | "valide"
  | "corrige"
  | "rejete"
  | "ancien"
  | "abandonne"
  | "contredit"
  | "obsolete";

export type SaveHypothesisInput = {
  hypothesis: string;
  confidence?: number;
  observedElements?: string;
  validationQuestion?: string;
  sourceMessageId?: string;
  metadata?: Record<string, unknown>;
};

export type SaveAutonomousMemoryEntryInput = {
  type: Exclude<MemoryEntryType, "decision">;
  sensitivity: "faible";
  humanSummary: string;
  category?: string;
  source?: string;
  confidence: number;
  sourceContent?: string;
  sourceMessageId?: string;
  links?: Prisma.InputJsonArray;
  metadata?: Record<string, unknown>;
};

export type SaveProbabilisticMemoryEntryInput = {
  type: Exclude<MemoryEntryType, "decision">;
  sensitivity: "faible" | "moyenne";
  humanSummary: string;
  category?: string;
  source?: string;
  confidence: number;
  sourceContent?: string;
  sourceMessageId?: string;
  links?: Prisma.InputJsonArray;
  metadata?: Record<string, unknown>;
};

export type SaveProtectedMemoryEntryInput = {
  type: MemoryEntryType;
  sensitivity: SensitivityLevel;
  humanSummary: string;
  category?: string;
  source?: string;
  confidence?: number;
  sourceContent?: string;
  sourceMessageId?: string;
  links?: Prisma.InputJsonArray;
  metadata?: Record<string, unknown>;
};

export type SaveValidatedMemoryEntryInput = {
  validatedByMathieu: true;
  type: MemoryEntryType;
  sensitivity: SensitivityLevel;
  humanSummary: string;
  category?: string;
  source?: string;
  confidence?: number;
  sourceContent?: string;
  sourceMessageId?: string;
  links?: Prisma.InputJsonArray;
  metadata?: Record<string, unknown>;
};

export type SaveDecisionInput = {
  confirmedByMathieu: true;
  decision: string;
  reason?: string;
  decidedAt?: Date;
  sourceMessageId?: string;
  metadata?: Record<string, unknown>;
};

const echoGlobal = globalThis as EchoGlobal;

function getDatabaseUrl() {
  return process.env.DATABASE_URL?.trim() || "";
}

export function getDatabaseReadiness(): DatabaseReadiness {
  const configured = Boolean(getDatabaseUrl());

  return {
    planned: true,
    configured,
    message: configured
      ? "DATABASE_URL is configured. PostgreSQL persistence is active through Prisma."
      : "DATABASE_URL is missing. PostgreSQL persistence is disabled."
  };
}

function getPrismaClient() {
  const connectionString = getDatabaseUrl();

  if (!connectionString) {
    return null;
  }

  if (!echoGlobal.echoPrisma) {
    const adapter = new PrismaPg({ connectionString });

    echoGlobal.echoPrisma = new PrismaClient({
      adapter,
      log:
        process.env.NODE_ENV === "development"
          ? ["warn", "error"]
          : ["error"]
    });
  }

  return echoGlobal.echoPrisma;
}

function toJsonObject(metadata?: Record<string, unknown>) {
  return (metadata ?? {}) as Prisma.InputJsonObject;
}

function clampConfidence(confidence: number) {
  return Math.max(0, Math.min(1, confidence));
}

function assertConfidenceRange(
  confidence: number,
  min: number,
  max: number,
  status: MemoryStatus
) {
  if (confidence < min || confidence > max) {
    throw new Error(
      `[ECHO][db] Invalid confidence for ${status} memory. Expected ${min}-${max}, received ${confidence}.`
    );
  }
}

export async function ensureDatabaseSchema() {
  const prisma = getPrismaClient();

  if (!prisma) {
    console.warn("[ECHO][db] DATABASE_URL missing; database check skipped.");
    return;
  }

  await prisma.$queryRaw`SELECT 1`;
}

export async function saveChatMessage(input: SaveChatMessageInput) {
  const prisma = getPrismaClient();

  if (!prisma) {
    console.warn("[ECHO][db] DATABASE_URL missing; chat message not saved.", {
      role: input.role,
      requestId: input.requestId
    });
    return null;
  }

  const result = await prisma.echoChatMessage.create({
    data: {
      role: input.role,
      content: input.content,
      model: input.model || null,
      requestId: input.requestId || null,
      metadata: toJsonObject(input.metadata)
    },
    select: {
      id: true
    }
  });

  return result.id;
}

export async function saveHypothesis(input: SaveHypothesisInput) {
  const prisma = getPrismaClient();

  if (!prisma) {
    console.warn("[ECHO][db] DATABASE_URL missing; hypothesis not saved.", {
      sourceMessageId: input.sourceMessageId
    });
    return null;
  }

  const result = await prisma.echoHypothesis.create({
    data: {
      hypothesis: input.hypothesis,
      confidence: input.confidence ?? 0,
      observedElements: input.observedElements || null,
      validationQuestion: input.validationQuestion || null,
      sourceMessageId: input.sourceMessageId || null,
      status: "en_attente",
      metadata: toJsonObject(input.metadata)
    },
    select: {
      id: true
    }
  });

  return result.id;
}

export async function saveAutonomousMemoryEntry(
  input: SaveAutonomousMemoryEntryInput
) {
  const confidence = clampConfidence(input.confidence);
  assertConfidenceRange(confidence, 0.71, 1, "autonome");

  const prisma = getPrismaClient();

  if (!prisma) {
    console.warn("[ECHO][db] DATABASE_URL missing; autonomous memory not saved.", {
      sourceMessageId: input.sourceMessageId
    });
    return null;
  }

  const result = await prisma.echoMemoryEntry.create({
    data: {
      sourceMessageId: input.sourceMessageId || null,
      source: input.source || "chat",
      category: input.category || "general",
      type: input.type,
      sensitivity: input.sensitivity,
      confidence,
      humanSummary: input.humanSummary,
      sourceContent: input.sourceContent || null,
      status: "autonome",
      validated: false,
      links: input.links ?? [],
      metadata: toJsonObject({
        ...input.metadata,
        memoryLevel: "autonomous",
        validationRequired: false
      })
    },
    select: {
      id: true
    }
  });

  return result.id;
}

export async function saveProbabilisticMemoryEntry(
  input: SaveProbabilisticMemoryEntryInput
) {
  const confidence = clampConfidence(input.confidence);
  assertConfidenceRange(confidence, 0.41, 0.7, "probabiliste");

  const prisma = getPrismaClient();

  if (!prisma) {
    console.warn("[ECHO][db] DATABASE_URL missing; probabilistic memory not saved.", {
      sourceMessageId: input.sourceMessageId
    });
    return null;
  }

  const result = await prisma.echoMemoryEntry.create({
    data: {
      sourceMessageId: input.sourceMessageId || null,
      source: input.source || "chat",
      category: input.category || "general",
      type: input.type,
      sensitivity: input.sensitivity,
      confidence,
      humanSummary: input.humanSummary,
      sourceContent: input.sourceContent || null,
      status: "probabiliste",
      validated: false,
      links: input.links ?? [],
      metadata: toJsonObject({
        ...input.metadata,
        memoryLevel: "probabilistic",
        validationRequired: false,
        neverPresentAsCertain: true
      })
    },
    select: {
      id: true
    }
  });

  return result.id;
}

export async function saveProtectedMemoryEntry(
  input: SaveProtectedMemoryEntryInput
) {
  const prisma = getPrismaClient();

  if (!prisma) {
    console.warn("[ECHO][db] DATABASE_URL missing; protected memory not saved.", {
      sourceMessageId: input.sourceMessageId
    });
    return null;
  }

  const result = await prisma.echoMemoryEntry.create({
    data: {
      sourceMessageId: input.sourceMessageId || null,
      source: input.source || "chat",
      category: input.category || "general",
      type: input.type,
      sensitivity: input.sensitivity,
      confidence: clampConfidence(input.confidence ?? 0),
      humanSummary: input.humanSummary,
      sourceContent: input.sourceContent || null,
      status: "en_validation",
      validated: false,
      links: input.links ?? [],
      metadata: toJsonObject({
        ...input.metadata,
        memoryLevel: "protected",
        validationRequired: true
      })
    },
    select: {
      id: true
    }
  });

  return result.id;
}

export async function saveValidatedMemoryEntry(
  input: SaveValidatedMemoryEntryInput
) {
  const prisma = getPrismaClient();

  if (!prisma) {
    console.warn("[ECHO][db] DATABASE_URL missing; memory entry not saved.", {
      sourceMessageId: input.sourceMessageId
    });
    return null;
  }

  const result = await prisma.echoMemoryEntry.create({
    data: {
      sourceMessageId: input.sourceMessageId || null,
      source: input.source || "chat",
      category: input.category || "general",
      type: input.type,
      sensitivity: input.sensitivity,
      confidence: input.confidence ?? 1,
      humanSummary: input.humanSummary,
      sourceContent: input.sourceContent || null,
      status: "valide",
      validated: true,
      links: input.links ?? [],
      metadata: toJsonObject({
        ...input.metadata,
        validationRequired: true,
        validatedByMathieu: input.validatedByMathieu
      })
    },
    select: {
      id: true
    }
  });

  return result.id;
}

export async function saveDecision(input: SaveDecisionInput) {
  const prisma = getPrismaClient();

  if (!prisma) {
    console.warn("[ECHO][db] DATABASE_URL missing; decision not saved.", {
      sourceMessageId: input.sourceMessageId
    });
    return null;
  }

  const result = await prisma.echoDecision.create({
    data: {
      sourceMessageId: input.sourceMessageId || null,
      decision: input.decision,
      reason: input.reason || null,
      decidedAt: input.decidedAt || null,
      status: "actif",
      metadata: toJsonObject(input.metadata)
    },
    select: {
      id: true
    }
  });

  return result.id;
}

export async function checkDatabaseConnection() {
  const prisma = getPrismaClient();

  if (!prisma) {
    return {
      ok: false,
      database: null,
      message: "DATABASE_URL is missing."
    };
  }

  const result = await prisma.$queryRaw<
    Array<{ database: string | null; now: Date }>
  >`SELECT current_database() AS database, now() AS now`;

  return {
    ok: true,
    database: result[0]?.database || null,
    message: "PostgreSQL connection OK through Prisma."
  };
}
