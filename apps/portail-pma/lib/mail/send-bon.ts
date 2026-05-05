import { prisma } from "@/lib/prisma";

export async function sendBonToStore(bonId: string) {
  const bon = await prisma.bons.findUnique({
    where: { id: bonId },
    include: {
      stores: true,
      clients: true,
    },
  });

  if (!bon || !bon.stores?.email) {
    throw new Error("Impossible d'envoyer le bon");
  }

  console.log("MAIL BON ENVOYÉ →", bon.stores.email, bon.id);

  await prisma.bons.update({
    where: { id: bon.id },
    data: {
      sent_at: new Date(),
    },
  });
}
