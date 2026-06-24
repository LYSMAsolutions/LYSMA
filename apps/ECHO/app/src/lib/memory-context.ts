import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import type { EchoChatMessage } from "@/lib/ollama";

type MemoryRow = {
  id: string;
  type: string;
  sensitivity: string;
  confidence: unknown;
  humanSummary: string;
  status: string;
  category: string;
  createdAt: Date;
};

function getPrisma(): PrismaClient | null {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) return null;
  const adapter = new PrismaPg({ connectionString: url });
  return new PrismaClient({ adapter });
}

const ACTIVE_STATUSES = ["valide", "autonome", "probabiliste"];
const MAX_MEMORIES = 40;

function formatMemoryBlock(memories: MemoryRow[]): string {
  if (memories.length === 0) return "";

  const grouped: Record<string, MemoryRow[]> = {};
  for (const m of memories) {
    const key = m.category || "general";
    (grouped[key] ??= []).push(m);
  }

  const lines: string[] = ["=== MÉMOIRE ACTIVE ==="];

  for (const [cat, items] of Object.entries(grouped)) {
    lines.push(`\n[${cat.toUpperCase()}]`);
    for (const m of items) {
      const confidence = Number(m.confidence);
      const certainty =
        m.status === "valide"
          ? "✓ validé"
          : m.status === "autonome"
          ? `(confiance ${confidence.toFixed(2)})`
          : `(probabiliste ${confidence.toFixed(2)})`;
      lines.push(`- ${m.humanSummary} ${certainty}`);
    }
  }

  lines.push("\n=== FIN MÉMOIRE ===");
  return lines.join("\n");
}

export async function buildMemoryContextMessage(): Promise<EchoChatMessage | null> {
  const prisma = getPrisma();
  if (!prisma) return null;

  try {
    const memories = await prisma.echoMemoryEntry.findMany({
      where: { status: { in: ACTIVE_STATUSES } },
      orderBy: [{ status: "asc" }, { createdAt: "desc" }],
      take: MAX_MEMORIES,
      select: {
        id: true,
        type: true,
        sensitivity: true,
        confidence: true,
        humanSummary: true,
        status: true,
        category: true,
        createdAt: true,
      },
    });

    if (memories.length === 0) return null;

    const block = formatMemoryBlock(memories as MemoryRow[]);
    return {
      role: "system",
      content: block,
    };
  } catch (err) {
    console.error("[ECHO][memory-context] failed to load memories", err);
    return null;
  } finally {
    await prisma.$disconnect();
  }
}
