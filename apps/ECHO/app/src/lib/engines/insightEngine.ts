import type { InsightCandidate } from "./types";

export type InsightEngineInput = {
  recentMessages?: string[];
  memorySummaries?: string[];
  projectSummaries?: string[];
};

export class InsightEngine {
  analyze(input: InsightEngineInput): InsightCandidate[] {
    const hasContext =
      Boolean(input.recentMessages?.length) ||
      Boolean(input.memorySummaries?.length) ||
      Boolean(input.projectSummaries?.length);

    if (!hasContext) {
      return [];
    }

    // V2.3 keeps the contract ready without pretending to detect patterns yet.
    return [];
  }
}

export const insightEngine = new InsightEngine();
