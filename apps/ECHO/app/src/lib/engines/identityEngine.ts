import { countValidatedMemories } from "@/lib/db";
import type { IdentityState } from "./types";

const MIN_MEMORIES_FOR_FIRST_NAME = 10;

export class IdentityEngine {
  getCurrentState(): IdentityState {
    return {
      temporaryName: "ECHO",
      chosenFirstName: null,
      status: "provisoire",
      canSuggestFirstName: false,
      validationRequired: true,
    };
  }

  async getEnrichedState(): Promise<IdentityState> {
    try {
      const count = await countValidatedMemories();
      const canSuggest = count >= MIN_MEMORIES_FOR_FIRST_NAME;
      return {
        temporaryName: "ECHO",
        chosenFirstName: null,
        status: canSuggest ? "propose" : "provisoire",
        canSuggestFirstName: canSuggest,
        validationRequired: true,
      };
    } catch {
      return this.getCurrentState();
    }
  }

  canSuggestFirstName(input: {
    understandsMathieu: boolean;
    understandsRole: boolean;
    understandsMission: boolean;
    understandsPersonality: boolean;
  }) {
    return (
      input.understandsMathieu &&
      input.understandsRole &&
      input.understandsMission &&
      input.understandsPersonality
    );
  }
}

export const identityEngine = new IdentityEngine();
