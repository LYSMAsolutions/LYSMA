DO $$
BEGIN
  CREATE TYPE "ChatQuality" AS ENUM ('UNKNOWN', 'GOOD', 'BAD');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS "chat_logs" (
  "id" TEXT NOT NULL,
  "source" TEXT NOT NULL,
  "conversationId" TEXT,
  "userName" TEXT,
  "userEmail" TEXT,
  "userPrompt" TEXT NOT NULL,
  "assistantResponse" TEXT,
  "quality" "ChatQuality" NOT NULL DEFAULT 'UNKNOWN',
  "qualityNotes" TEXT,
  "metadata" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "chat_logs_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "chat_logs_source_idx" ON "chat_logs"("source");
CREATE INDEX IF NOT EXISTS "chat_logs_conversationId_idx" ON "chat_logs"("conversationId");
CREATE INDEX IF NOT EXISTS "chat_logs_createdAt_idx" ON "chat_logs"("createdAt");
