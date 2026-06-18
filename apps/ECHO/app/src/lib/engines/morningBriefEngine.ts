import type { MorningBrief, MorningBriefSection } from "./types";

export type MorningBriefInput = {
  date?: Date;
  cap?: string[];
  projects?: string[];
  observations?: string[];
  watchItems?: string[];
  recommendations?: string[];
};

function section(title: string, items: string[]): MorningBriefSection | null {
  const cleanedItems = items.map((item) => item.trim()).filter(Boolean);

  if (cleanedItems.length === 0) {
    return null;
  }

  return {
    title,
    items: cleanedItems
  };
}

export class MorningBriefEngine {
  build(input: MorningBriefInput): MorningBrief {
    const sections = [
      section("Cap actuel", input.cap ?? []),
      section("Projets", input.projects ?? []),
      section("Observations", input.observations ?? []),
      section("Veille", input.watchItems ?? []),
      section("Recommandations", input.recommendations ?? [])
    ].filter((item): item is MorningBriefSection => item !== null);

    return {
      date: (input.date ?? new Date()).toISOString().slice(0, 10),
      sections,
      warnings:
        sections.length === 0
          ? ["Aucune source de briefing disponible pour le moment."]
          : []
    };
  }
}

export const morningBriefEngine = new MorningBriefEngine();
