import {
  type MemoryEntryType,
  type SensitivityLevel,
  saveAutonomousMemoryEntry,
  saveProbabilisticMemoryEntry,
  saveProtectedMemoryEntry
} from "@/lib/db";
import type { MemoryCandidate, StoredMemoryResult } from "./types";

type AutomaticMemoryType = Exclude<MemoryEntryType, "decision">;
type ProbabilisticSensitivity = Extract<SensitivityLevel, "faible" | "moyenne">;

function isLowSensitivity(candidate: MemoryCandidate) {
  return candidate.sensitivity === "faible";
}

function isAutomaticMemoryType(type: MemoryEntryType): type is AutomaticMemoryType {
  return type !== "decision";
}

function isLimitedSensitivity(
  sensitivity: SensitivityLevel
): sensitivity is ProbabilisticSensitivity {
  return sensitivity === "faible" || sensitivity === "moyenne";
}

export class MemoryEngine {
  async storeCandidate(candidate: MemoryCandidate): Promise<StoredMemoryResult> {
    if (candidate.confidence < 0 || candidate.confidence > 1) {
      return {
        stored: false,
        id: null,
        level: candidate.level,
        status: "rejete",
        validationRequired: true,
        reason: "confidence_out_of_range"
      };
    }

    if (candidate.level === "autonomous") {
      if (
        !isAutomaticMemoryType(candidate.type) ||
        !isLowSensitivity(candidate) ||
        candidate.confidence < 0.71
      ) {
        return {
          stored: false,
          id: null,
          level: candidate.level,
          status: "en_validation",
          validationRequired: true,
          reason: "autonomous_memory_requires_non_decision_low_sensitivity_and_high_confidence"
        };
      }

      const id = await saveAutonomousMemoryEntry({
        type: candidate.type,
        sensitivity: "faible",
        humanSummary: candidate.summary,
        category: candidate.category,
        source: candidate.source,
        confidence: candidate.confidence,
        sourceContent: candidate.sourceContent,
        sourceMessageId: candidate.sourceMessageId,
        metadata: candidate.metadata
      });

      return {
        stored: Boolean(id),
        id,
        level: "autonomous",
        status: "autonome",
        validationRequired: false
      };
    }

    if (candidate.level === "probabilistic") {
      if (
        !isAutomaticMemoryType(candidate.type) ||
        !isLimitedSensitivity(candidate.sensitivity) ||
        candidate.confidence < 0.41 ||
        candidate.confidence > 0.7
      ) {
        return {
          stored: false,
          id: null,
          level: candidate.level,
          status: "en_validation",
          validationRequired: true,
          reason: "probabilistic_memory_requires_non_decision_limited_sensitivity_and_medium_confidence"
        };
      }

      const id = await saveProbabilisticMemoryEntry({
        type: candidate.type,
        sensitivity: candidate.sensitivity,
        humanSummary: candidate.summary,
        category: candidate.category,
        source: candidate.source,
        confidence: candidate.confidence,
        sourceContent: candidate.sourceContent,
        sourceMessageId: candidate.sourceMessageId,
        metadata: candidate.metadata
      });

      return {
        stored: Boolean(id),
        id,
        level: "probabilistic",
        status: "probabiliste",
        validationRequired: false
      };
    }

    const id = await saveProtectedMemoryEntry({
      type: candidate.type,
      sensitivity: candidate.sensitivity,
      humanSummary: candidate.summary,
      category: candidate.category,
      source: candidate.source,
      confidence: candidate.confidence,
      sourceContent: candidate.sourceContent,
      sourceMessageId: candidate.sourceMessageId,
      metadata: candidate.metadata
    });

    return {
      stored: Boolean(id),
      id,
      level: "protected",
      status: "en_validation",
      validationRequired: true
    };
  }
}

export const memoryEngine = new MemoryEngine();
