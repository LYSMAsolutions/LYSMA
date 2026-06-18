import type { IdentityState } from "./types";

export class IdentityEngine {
  getCurrentState(): IdentityState {
    return {
      temporaryName: "ECHO",
      chosenFirstName: null,
      status: "provisoire",
      canSuggestFirstName: false,
      validationRequired: true
    };
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
