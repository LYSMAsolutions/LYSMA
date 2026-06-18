import type { TechWatchItem, TechWatchSource } from "./types";

export type TechWatchInput = {
  sources: TechWatchSource[];
};

export class TechWatchEngine {
  summarize(input: TechWatchInput): TechWatchItem[] {
    if (input.sources.length === 0) {
      return [];
    }

    return input.sources.slice(0, 3).map((source) => ({
      topic: source.topic,
      title: source.title,
      summary: "Source a analyser avant synthese.",
      sourceUrl: source.url,
      confidence: 0.5,
      usefulFor: "Veille future ECHO. Ne pas presenter comme verifie sans analyse."
    }));
  }
}

export const techWatchEngine = new TechWatchEngine();
