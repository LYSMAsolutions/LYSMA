import { prisma } from "@/lib/prisma";

export type GarantieStatusAction =
  | "envoyer-expert"
  | "valider-echange"
  | "valider-avoir"
  | "refuser";

export type GarantieActionItem = {
  key:               GarantieStatusAction;
  title:             string;
  description:       string;
  submitLabel:       string;
  needsReason:       boolean;
  needsDecisionBl?:  boolean;
  reasonPlaceholder?: string;
};

export function getGarantieStatusLabel(status: string) {
  switch (status) {
    case "brouillon":               return "Brouillon";
    case "en_cours":                return "En cours";
    case "en_attente_fournisseur":  return "Attente fournisseur";
    case "validee":                 return "Validée";
    case "refusee":                 return "Refusée";
    default:                        return status || "Inconnu";
  }
}

export function getAvailableGarantieActions(status: string): GarantieActionItem[] {
  switch (status) {
    case "en_cours":
      return [
        {
          key:         "envoyer-expert",
          title:       "Envoyer chez le fournisseur / expert",
          description: "Place la garantie en attente de décision fournisseur.",
          submitLabel: "Envoyer pour expertise",
          needsReason: false,
        },
        {
          key:         "valider-echange",
          title:       "Valider — Échange sous garantie",
          description: "La pièce est acceptée en garantie et sera échangée.",
          submitLabel: "Valider l'échange",
          needsReason:      false,
          needsDecisionBl:  true,
        },
        {
          key:         "valider-avoir",
          title:       "Valider — Avoir",
          description: "La garantie est acceptée sous forme d'avoir.",
          submitLabel: "Valider l'avoir",
          needsReason:      false,
          needsDecisionBl:  true,
        },
        {
          key:               "refuser",
          title:             "Refuser la garantie",
          description:       "La demande de garantie est rejetée.",
          submitLabel:       "Refuser",
          needsReason:       true,
          reasonPlaceholder: "Motif du refus (affiché à l'ATC)",
        },
      ];

    case "en_attente_fournisseur":
      return [
        {
          key:         "valider-echange",
          title:       "Valider — Échange sous garantie",
          description: "Le fournisseur a accepté : la pièce sera échangée.",
          submitLabel: "Valider l'échange",
          needsReason:      false,
          needsDecisionBl:  true,
        },
        {
          key:         "valider-avoir",
          title:       "Valider — Avoir",
          description: "Le fournisseur a accepté sous forme d'avoir.",
          submitLabel: "Valider l'avoir",
          needsReason:      false,
          needsDecisionBl:  true,
        },
        {
          key:               "refuser",
          title:             "Refuser la garantie",
          description:       "Le fournisseur a refusé la garantie.",
          submitLabel:       "Refuser",
          needsReason:       true,
          reasonPlaceholder: "Motif du refus fournisseur",
        },
      ];

    default:
      return [];
  }
}

// ── Liste pour l'admin ──────────────────────────────────────────
export async function getGarantieListForAdmin(params: {
  distributorId: string;
  status?:       string;
  search?:       string;
}) {
  const where: Record<string, unknown> = {
    distributor_id: params.distributorId,
  };

  if (params.status && params.status !== "all") {
    where.status = params.status;
  }

  if (params.search?.trim()) {
    const q = params.search.trim();
    where.OR = [
      { numero_garantie:  { contains: q, mode: "insensitive" } },
      { reference_piece:  { contains: q, mode: "insensitive" } },
      { marque_piece:     { contains: q, mode: "insensitive" } },
      { immat_vehicule:   { contains: q, mode: "insensitive" } },
      { clients: { name:  { contains: q, mode: "insensitive" } } },
      { clients: { code:  { contains: q, mode: "insensitive" } } },
    ];
  }

  const rows = await prisma.garanties.findMany({
    where,
    include: {
      clients: { select: { name: true, code: true } },
      stores:  { select: { name: true, code: true } },
      users:   { select: { first_name: true, last_name: true } },
    },
    orderBy: { created_at: "desc" },
    take: 500,
  });

  return rows.map((g) => ({
    id:              g.id,
    numero_garantie: g.numero_garantie,
    status:          g.status,
    marque_piece:    g.marque_piece,
    reference_piece: g.reference_piece,
    defaut_constate: g.defaut_constate,
    created_at:      g.created_at,
    clientName:      g.clients?.code
      ? `${g.clients.code} · ${g.clients.name}`
      : g.clients?.name ?? "—",
    storeName:       g.stores
      ? `${g.stores.code} · ${g.stores.name}`
      : "—",
    atcName:         g.users
      ? `${g.users.first_name} ${g.users.last_name}`.trim()
      : "—",
  }));
}

// ── KPIs ────────────────────────────────────────────────────────
export async function getGarantieKpisForAdmin(distributorId: string) {
  const rows = await prisma.garanties.findMany({
    where:  { distributor_id: distributorId },
    select: { status: true },
  });

  return {
    total:                 rows.length,
    en_cours:              rows.filter((r) => r.status === "en_cours").length,
    en_attente_fournisseur:rows.filter((r) => r.status === "en_attente_fournisseur").length,
    validee:               rows.filter((r) => r.status === "validee").length,
    refusee:               rows.filter((r) => r.status === "refusee").length,
    brouillon:             rows.filter((r) => r.status === "brouillon").length,
  };
}

// ── Détail ──────────────────────────────────────────────────────
export async function getGarantieById(params: {
  distributorId: string;
  garantieId:    string;
}) {
  return prisma.garanties.findFirst({
    where: {
      id:             params.garantieId,
      distributor_id: params.distributorId,
    },
    include: {
      clients: true,
      stores:  true,
      users:   { select: { first_name: true, last_name: true, email: true } },
    },
  });
}