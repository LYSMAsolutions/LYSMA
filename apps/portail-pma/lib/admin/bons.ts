import { prisma } from "@/lib/prisma";

export type BonActionKey =
  | "prendre-en-charge"
  | "demarrer"
  | "attente-client"
  | "attente-fournisseur"
  | "corriger"
  | "reprendre"
  | "traiter"
  | "refuser";

export type BonActionItem = {
  key: BonActionKey;
  title: string;
  description: string;
  submitLabel: string;
  needsReason: boolean;
  reasonPlaceholder?: string;
};

export function formatDateTime(value: Date | null | undefined) {
  if (!value) return "—";

  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(value);
}

export function getBonStatusLabel(status: string) {
  switch (status) {
    case "frigo":
      return "Frigo";
    case "envoye":
      return "Envoyé";
    case "non_pris_en_charge":
      return "Non pris en charge";
    case "pris_en_charge":
      return "Pris en charge";
    case "en_cours":
      return "En cours";
    case "attente_client":
      return "Attente client";
    case "attente_fournisseur":
      return "Attente fournisseur";
    case "a_corriger":
      return "À corriger";
    case "traite":
      return "Traité";
    case "refuse":
      return "Refusé";
    default:
      return status || "Inconnu";
  }
}

export function getAvailableBonActions(status: string): BonActionItem[] {
  switch (status) {
    case "envoye":
    case "non_pris_en_charge":
      return [
        {
          key: "prendre-en-charge",
          title: "Prendre en charge",
          description: "Attribue le bon au magasin / magasinier et démarre la responsabilité.",
          submitLabel: "Prendre en charge",
          needsReason: false,
        },
        {
          key: "corriger",
          title: "Demander une correction",
          description: "Place le bon en correction lorsqu’une information est incomplète ou incohérente.",
          submitLabel: "Passer en correction",
          needsReason: true,
          reasonPlaceholder: "Expliquer ce qui doit être corrigé",
        },
        {
          key: "refuser",
          title: "Refuser",
          description: "Refuse le bon avec un motif clair.",
          submitLabel: "Refuser le bon",
          needsReason: true,
          reasonPlaceholder: "Motif du refus",
        },
      ];

    case "pris_en_charge":
      return [
        {
          key: "demarrer",
          title: "Démarrer",
          description: "Passe le bon en cours de traitement.",
          submitLabel: "Démarrer",
          needsReason: false,
        },
        {
          key: "attente-client",
          title: "Mettre en attente client",
          description: "Le traitement est bloqué côté client.",
          submitLabel: "Mettre en attente client",
          needsReason: true,
          reasonPlaceholder: "Expliquer l’attente client",
        },
        {
          key: "attente-fournisseur",
          title: "Mettre en attente fournisseur",
          description: "Le traitement dépend d’un fournisseur.",
          submitLabel: "Mettre en attente fournisseur",
          needsReason: true,
          reasonPlaceholder: "Expliquer l’attente fournisseur",
        },
        {
          key: "refuser",
          title: "Refuser",
          description: "Refuse le bon avec motif.",
          submitLabel: "Refuser le bon",
          needsReason: true,
          reasonPlaceholder: "Motif du refus",
        },
      ];

    case "en_cours":
      return [
        {
          key: "attente-client",
          title: "Mettre en attente client",
          description: "Le traitement attend une réponse ou une action du client.",
          submitLabel: "Mettre en attente client",
          needsReason: true,
          reasonPlaceholder: "Expliquer l’attente client",
        },
        {
          key: "attente-fournisseur",
          title: "Mettre en attente fournisseur",
          description: "Le traitement attend une réponse ou une livraison fournisseur.",
          submitLabel: "Mettre en attente fournisseur",
          needsReason: true,
          reasonPlaceholder: "Expliquer l’attente fournisseur",
        },
        {
          key: "corriger",
          title: "Demander une correction",
          description: "Une information doit être corrigée avant poursuite.",
          submitLabel: "Passer en correction",
          needsReason: true,
          reasonPlaceholder: "Expliquer ce qui doit être corrigé",
        },
        {
          key: "traiter",
          title: "Marquer comme traité",
          description: "Clôture le bon comme terminé.",
          submitLabel: "Marquer comme traité",
          needsReason: false,
        },
        {
          key: "refuser",
          title: "Refuser",
          description: "Refuse le bon avec motif.",
          submitLabel: "Refuser le bon",
          needsReason: true,
          reasonPlaceholder: "Motif du refus",
        },
      ];

    case "attente_client":
    case "attente_fournisseur":
    case "a_corriger":
      return [
        {
          key: "reprendre",
          title: "Reprendre le traitement",
          description: "Relance le bon et le repasse en cours.",
          submitLabel: "Reprendre",
          needsReason: false,
        },
        {
          key: "traiter",
          title: "Marquer comme traité",
          description: "Clôture le bon comme terminé.",
          submitLabel: "Marquer comme traité",
          needsReason: false,
        },
        {
          key: "refuser",
          title: "Refuser",
          description: "Refuse le bon avec motif.",
          submitLabel: "Refuser le bon",
          needsReason: true,
          reasonPlaceholder: "Motif du refus",
        },
      ];

    default:
      return [];
  }
}

export async function getBonListForAtc(params: {
  distributorId: string;
  userId: string;
}) {
  const rows = await prisma.bons.findMany({
    where: {
      distributor_id: params.distributorId,
      created_by_user_id: params.userId,
    },
    include: {
      clients: {
        select: {
          id: true,
          name: true,
          code: true,
        },
      },
      stores: {
        select: {
          id: true,
          code: true,
          name: true,
        },
      },
      users: {
        select: {
          id: true,
          first_name: true,
          last_name: true,
        },
      },
    },
    orderBy: {
      created_at: "desc",
    },
  });

  return rows.map((row) => ({
    id: row.id,
    bon_number: row.bon_number,
    bon_type: row.bon_type,
    status: row.status,
    priority: row.priority,
    clientName: row.clients?.code
      ? `${row.clients.code} · ${row.clients.name}`
      : row.clients?.name || "—",
    storeName: row.stores
      ? `${row.stores.code} · ${row.stores.name}`
      : "—",
    creatorName: row.users
      ? `${row.users.first_name} ${row.users.last_name}`.trim()
      : "—",
    createdAt: formatDateTime(row.created_at),
  }));
}

export async function getStoreScopeForUser(params: {
  distributorId: string;
  userId: string;
}) {
  const links = await prisma.user_store_links.findMany({
    where: {
      user_id: params.userId,
    },
    include: {
      stores: true,
    },
    orderBy: {
      created_at: "asc",
    },
  });

  const filtered = links.filter(
    (item) => item.stores.distributor_id === params.distributorId
  );

  return filtered.map((item) => item.stores);
}

export async function getBonListForStore(params: {
  distributorId: string;
  storeIds: string[];
}) {
  if (!params.storeIds.length) {
    return [];
  }

  const rows = await prisma.bons.findMany({
    where: {
      distributor_id: params.distributorId,
      assigned_store_id: {
        in: params.storeIds,
      },
    },
    include: {
      clients: {
        select: {
          id: true,
          name: true,
          code: true,
        },
      },
      stores: {
        select: {
          id: true,
          code: true,
          name: true,
        },
      },
      users: {
        select: {
          id: true,
          first_name: true,
          last_name: true,
        },
      },
    },
    orderBy: {
      created_at: "desc",
    },
  });

  return rows.map((row) => ({
    id: row.id,
    bon_number: row.bon_number,
    bon_type: row.bon_type,
    status: row.status,
    priority: row.priority,
    clientName: row.clients?.code
      ? `${row.clients.code} · ${row.clients.name}`
      : row.clients?.name || "—",
    storeName: row.stores
      ? `${row.stores.code} · ${row.stores.name}`
      : "—",
    creatorName: row.users
      ? `${row.users.first_name} ${row.users.last_name}`.trim()
      : "—",
    createdAt: formatDateTime(row.created_at),
  }));
}

export async function getBonById(params: {
  distributorId: string;
  bonId: string;
}) {
  return prisma.bons.findFirst({
    where: {
      id: params.bonId,
      distributor_id: params.distributorId,
    },
    include: {
      clients: true,
      stores: true,
      users: true,
      store_staff: true,
      bon_lines: {
        orderBy: {
          line_number: "asc",
        },
      },
      bon_status_history: {
        include: {
          users: true,
          store_staff: true,
        },
        orderBy: {
          created_at: "desc",
        },
      },
    },
  });
}

export async function getBonListForCdv(params: {
  distributorId: string;
}) {
  const rows = await prisma.bons.findMany({
    where: {
      distributor_id: params.distributorId,
    },
    include: {
      clients: {
        select: {
          id: true,
          name: true,
          code: true,
        },
      },
      stores: {
        select: {
          id: true,
          code: true,
          name: true,
        },
      },
      users: {
        select: {
          id: true,
          first_name: true,
          last_name: true,
        },
      },
    },
    orderBy: {
      created_at: "desc",
    },
  });

  return rows.map((row) => ({
    id: row.id,
    bon_number: row.bon_number,
    bon_type: row.bon_type,
    status: row.status,
    priority: row.priority,
    clientName: row.clients?.code
      ? `${row.clients.code} · ${row.clients.name}`
      : row.clients?.name || "—",
    storeName: row.stores
      ? `${row.stores.code} · ${row.stores.name}`
      : "—",
    creatorName: row.users
      ? `${row.users.first_name} ${row.users.last_name}`.trim()
      : "—",
    createdAt: formatDateTime(row.created_at),
  }));
}

export async function getBonKpisForCdv(params: {
  distributorId: string;
}) {
  const rows = await prisma.bons.findMany({
    where: {
      distributor_id: params.distributorId,
    },
    select: {
      status: true,
    },
  });

  return {
    total: rows.length,
    nonPrisEnCharge: rows.filter((item) =>
      ["envoye", "non_pris_en_charge"].includes(item.status)
    ).length,
    enCours: rows.filter((item) =>
      ["pris_en_charge", "en_cours", "attente_client", "attente_fournisseur", "a_corriger"].includes(item.status)
    ).length,
    traites: rows.filter((item) => item.status === "traite").length,
    refuses: rows.filter((item) => item.status === "refuse").length,
  };
}

export async function getGlobalBonKpis(params: {
  distributorId: string;
}) {
  const rows = await prisma.bons.findMany({
    where: {
      distributor_id: params.distributorId,
    },
    select: {
      status: true,
    },
  });

  return {
    total: rows.length,
    nonPrisEnCharge: rows.filter((item) =>
      ["envoye", "non_pris_en_charge"].includes(item.status)
    ).length,
    enCours: rows.filter((item) =>
      [
        "pris_en_charge",
        "en_cours",
        "attente_client",
        "attente_fournisseur",
        "a_corriger",
      ].includes(item.status)
    ).length,
    traites: rows.filter((item) => item.status === "traite").length,
    refuses: rows.filter((item) => item.status === "refuse").length,
  };
}

export async function getBonListForRdm(params: {
  distributorId: string;
  storeIds: string[];
}) {
  if (!params.storeIds.length) {
    return [];
  }

  const rows = await prisma.bons.findMany({
    where: {
      distributor_id: params.distributorId,
      assigned_store_id: {
        in: params.storeIds,
      },
    },
    include: {
      clients: {
        select: {
          id: true,
          name: true,
          code: true,
        },
      },
      stores: {
        select: {
          id: true,
          code: true,
          name: true,
        },
      },
      users: {
        select: {
          id: true,
          first_name: true,
          last_name: true,
        },
      },
    },
    orderBy: {
      created_at: "desc",
    },
  });

  return rows.map((row) => ({
    id: row.id,
    bon_number: row.bon_number,
    bon_type: row.bon_type,
    status: row.status,
    priority: row.priority,
    clientName: row.clients?.code
      ? `${row.clients.code} · ${row.clients.name}`
      : row.clients?.name || "—",
    storeName: row.stores
      ? `${row.stores.code} · ${row.stores.name}`
      : "—",
    creatorName: row.users
      ? `${row.users.first_name} ${row.users.last_name}`.trim()
      : "—",
    createdAt: formatDateTime(row.created_at),
  }));
}

export async function getBonKpisForRdm(params: {
  distributorId: string;
  storeIds: string[];
}) {
  if (!params.storeIds.length) {
    return {
      total: 0,
      nonPrisEnCharge: 0,
      prisEnCharge: 0,
      enCours: 0,
      enAttente: 0,
      traites: 0,
      refuses: 0,
    };
  }

  const rows = await prisma.bons.findMany({
    where: {
      distributor_id: params.distributorId,
      assigned_store_id: {
        in: params.storeIds,
      },
    },
    select: {
      status: true,
    },
  });

  return {
    total: rows.length,
    nonPrisEnCharge: rows.filter((item) =>
      ["envoye", "non_pris_en_charge"].includes(item.status)
    ).length,
    prisEnCharge: rows.filter((item) => item.status === "pris_en_charge").length,
    enCours: rows.filter((item) => item.status === "en_cours").length,
    enAttente: rows.filter((item) =>
      ["attente_client", "attente_fournisseur", "a_corriger"].includes(item.status)
    ).length,
    traites: rows.filter((item) => item.status === "traite").length,
    refuses: rows.filter((item) => item.status === "refuse").length,
  };
}