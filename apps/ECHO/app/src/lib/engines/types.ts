import type {
  MemoryEntryType,
  MemoryStatus,
  SensitivityLevel
} from "@/lib/db";

export type EchoEngineName =
  | "memory"
  | "insight"
  | "morning_brief"
  | "tech_watch"
  | "identity"
  | "cap";

export type EchoEngineStatus = "ready" | "planned" | "disabled";

export type EchoEngineDescriptor = {
  name: EchoEngineName;
  status: EchoEngineStatus;
  purpose: string;
  canRunAutonomously: boolean;
  requiresValidation: boolean;
};

export type MemoryLevel = "autonomous" | "probabilistic" | "protected";

export type MemoryCandidate = {
  level: MemoryLevel;
  type: MemoryEntryType;
  sensitivity: SensitivityLevel;
  confidence: number;
  summary: string;
  sourceContent?: string;
  sourceMessageId?: string;
  category?: string;
  source?: string;
  metadata?: Record<string, unknown>;
};

export type StoredMemoryResult = {
  stored: boolean;
  id: string | null;
  level: MemoryLevel;
  status: MemoryStatus;
  validationRequired: boolean;
  reason?: string;
};

export type InsightKind =
  | "contradiction"
  | "neglected_opportunity"
  | "delayed_decision"
  | "recurring_pattern"
  | "dispersion_risk"
  | "positive_evolution";

export type InsightCandidate = {
  kind: InsightKind;
  title: string;
  summary: string;
  confidence: number;
  observedFacts: string[];
  limits: string[];
  sourceMessageIds?: string[];
  metadata?: Record<string, unknown>;
};

export type CapSignal = {
  title: string;
  summary: string;
  relationToCap: "aligned" | "neutral" | "dispersion_risk" | "unknown";
  confidence: number;
  source?: string;
};

export type MorningBriefSection = {
  title: string;
  items: string[];
};

export type MorningBrief = {
  date: string;
  sections: MorningBriefSection[];
  warnings: string[];
};

export type TechWatchTopic =
  | "ia"
  | "ollama"
  | "agents_ia"
  | "postgresql"
  | "nextjs"
  | "react"
  | "typescript"
  | "github"
  | "saas"
  | "dordogne"
  | "lysma"
  | "livo"
  | "local_opportunities";

export type TechWatchSource = {
  title: string;
  url: string;
  publishedAt?: string;
  topic: TechWatchTopic;
};

export type TechWatchItem = {
  topic: TechWatchTopic;
  title: string;
  summary: string;
  sourceUrl: string;
  confidence: number;
  usefulFor: string;
};

export type IdentityState = {
  temporaryName: string;
  chosenFirstName: string | null;
  status: "provisoire" | "propose" | "valide";
  canSuggestFirstName: boolean;
  validationRequired: true;
};
