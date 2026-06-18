import type { EchoEngineDescriptor } from "./types";

export const echoEngineRegistry: EchoEngineDescriptor[] = [
  {
    name: "memory",
    status: "ready",
    purpose: "Classer et stocker la memoire autonome, probabiliste ou protegee.",
    canRunAutonomously: true,
    requiresValidation: false
  },
  {
    name: "insight",
    status: "planned",
    purpose: "Detecter contradictions, schemas recurrents, opportunites et risques de dispersion.",
    canRunAutonomously: false,
    requiresValidation: true
  },
  {
    name: "morning_brief",
    status: "planned",
    purpose: "Agreger cap, projets, observations, veille et recommandations.",
    canRunAutonomously: false,
    requiresValidation: false
  },
  {
    name: "tech_watch",
    status: "planned",
    purpose: "Surveiller des sources reelles et produire une veille fortement filtree.",
    canRunAutonomously: false,
    requiresValidation: false
  },
  {
    name: "identity",
    status: "planned",
    purpose: "Gerer l'identite evolutive et le futur prenom valide par Mathieu.",
    canRunAutonomously: false,
    requiresValidation: true
  },
  {
    name: "cap",
    status: "planned",
    purpose: "Comparer idees, projets et actions au cap actuel de Mathieu.",
    canRunAutonomously: false,
    requiresValidation: true
  }
];
