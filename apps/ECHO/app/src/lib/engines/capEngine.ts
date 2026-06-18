import type { CapSignal } from "./types";

export type CapAssessmentInput = {
  idea: string;
  currentCap?: string;
  activePriorities?: string[];
};

export class CapEngine {
  assessIdea(input: CapAssessmentInput): CapSignal {
    const hasCapContext = Boolean(input.currentCap || input.activePriorities?.length);

    return {
      title: "Evaluation du cap",
      summary: hasCapContext
        ? `Idee a comparer au cap actuel : ${input.idea}`
        : `Cap insuffisamment renseigne pour evaluer l'idee : ${input.idea}`,
      relationToCap: "unknown",
      confidence: hasCapContext ? 0.4 : 0.1,
      source: "cap_engine"
    };
  }
}

export const capEngine = new CapEngine();
