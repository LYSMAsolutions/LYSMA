import { prisma } from "@/lib/prisma";
import type { UpdateDistributorSettingsInput } from "@/types/settings";

export async function getDistributorBySlug(slug: string) {
  return prisma.distributors.findFirst({
    where: { slug },
  });
}

export async function getDistributorById(id: string) {
  return prisma.distributors.findUnique({
    where: { id },
  });
}

export async function getDistributorSettings(distributorId: string) {
  const distributor = await prisma.distributors.findUnique({
    where: { id: distributorId },
  });

  if (!distributor) {
    return null;
  }

  const settings = await prisma.distributor_settings.findUnique({
    where: {
      distributor_id: distributorId,
    },
  });

  return {
    distributor,
    settings,
  };
}

export async function upsertDistributorSettings(
  distributorId: string,
  input: UpdateDistributorSettingsInput,
) {
  return prisma.distributor_settings.upsert({
    where: {
      distributor_id: distributorId,
    },
    create: {
      distributor_id: distributorId,
      company_display_name: input.company_display_name?.trim() || null,
      support_email: input.support_email?.trim().toLowerCase() || null,
      support_phone: input.support_phone?.trim() || null,
      alerts_configured: input.alerts_configured ?? false,
      legal_documents_configured: input.legal_documents_configured ?? false,
    },
    update: {
      ...(input.company_display_name !== undefined
        ? { company_display_name: input.company_display_name?.trim() || null }
        : {}),
      ...(input.support_email !== undefined
        ? { support_email: input.support_email?.trim().toLowerCase() || null }
        : {}),
      ...(input.support_phone !== undefined
        ? { support_phone: input.support_phone?.trim() || null }
        : {}),
      ...(input.alerts_configured !== undefined
        ? { alerts_configured: input.alerts_configured }
        : {}),
      ...(input.legal_documents_configured !== undefined
        ? { legal_documents_configured: input.legal_documents_configured }
        : {}),
    },
  });
}

export async function getDistributorSettingsKpis(distributorId: string) {
  const [settings, users, stores, clients] = await prisma.$transaction([
    prisma.distributor_settings.findUnique({
      where: {
        distributor_id: distributorId,
      },
    }),
    prisma.users.count({
      where: {
        distributor_id: distributorId,
      },
    }),
    prisma.stores.count({
      where: {
        distributor_id: distributorId,
      },
    }),
    prisma.clients.count({
      where: {
        distributor_id: distributorId,
      },
    }),
  ]);

  return {
    alerts_configured: settings?.alerts_configured ?? false,
    legal_documents_configured: settings?.legal_documents_configured ?? false,
    users,
    stores,
    clients,
  };
}