"use server";

import { prisma } from "@/lib/prisma";

type ActionState = {
  success: boolean;
  error: string | null;
};

export async function updateStoreRdmAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const storeId = String(formData.get("storeId") || "").trim();
    const rdmId = String(formData.get("rdmId") || "").trim();

    if (!storeId) {
      return {
        success: false,
        error: "Le magasin est obligatoire.",
      };
    }

    const existingRdmLinks = await prisma.user_store_links.findMany({
      where: {
        store_id: storeId,
        users: {
          roles: {
            code: "rdm",
          },
        },
      },
      select: {
        id: true,
      },
    });

    await prisma.$transaction(async (tx) => {
      if (existingRdmLinks.length > 0) {
        await tx.user_store_links.deleteMany({
          where: {
            id: {
              in: existingRdmLinks.map((link) => link.id),
            },
          },
        });
      }

      if (rdmId) {
        await tx.user_store_links.create({
          data: {
            user_id: rdmId,
            store_id: storeId,
          },
        });
      }
    });

    return {
      success: true,
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erreur serveur.",
    };
  }
}
