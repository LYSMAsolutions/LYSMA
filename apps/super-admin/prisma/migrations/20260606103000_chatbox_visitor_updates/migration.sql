-- Chatbox visitor/session identifiers, review workflow and answer update notifications.
CREATE TYPE "ChatProblemType" AS ENUM (
  'DUPLICATE',
  'USER_REPORTED',
  'MISUNDERSTANDING',
  'LOST_CONTEXT',
  'USER_NEGATIVE_FEEDBACK',
  'FALLBACK',
  'OTHER'
);

CREATE TYPE "ChatReviewStatus" AS ENUM (
  'UNTREATED',
  'TREATED'
);

CREATE TYPE "ChatUpdateStatus" AS ENUM (
  'ANSWER_UPDATED'
);

ALTER TABLE "chat_logs"
  ADD COLUMN "visitorId" TEXT,
  ADD COLUMN "sessionId" TEXT,
  ADD COLUMN "questionSignature" TEXT,
  ADD COLUMN "problemType" "ChatProblemType" NOT NULL DEFAULT 'OTHER',
  ADD COLUMN "reviewStatus" "ChatReviewStatus" NOT NULL DEFAULT 'UNTREATED';

CREATE TABLE "chatbox_update_notifications" (
  "id" TEXT NOT NULL,
  "source" TEXT NOT NULL,
  "visitorId" TEXT,
  "conversationId" TEXT,
  "questionSignature" TEXT,
  "originalLogId" TEXT,
  "userPrompt" TEXT NOT NULL,
  "improvedResponse" TEXT NOT NULL,
  "status" "ChatUpdateStatus" NOT NULL DEFAULT 'ANSWER_UPDATED',
  "seen" BOOLEAN NOT NULL DEFAULT false,
  "seenAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "chatbox_update_notifications_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "chat_logs_source_visitorId_idx" ON "chat_logs"("source", "visitorId");
CREATE INDEX "chat_logs_source_reviewStatus_idx" ON "chat_logs"("source", "reviewStatus");
CREATE INDEX "chat_logs_problemType_idx" ON "chat_logs"("problemType");
CREATE INDEX "chat_logs_questionSignature_idx" ON "chat_logs"("questionSignature");

CREATE INDEX "chatbox_update_notifications_source_visitorId_seen_idx" ON "chatbox_update_notifications"("source", "visitorId", "seen");
CREATE INDEX "chatbox_update_notifications_conversationId_idx" ON "chatbox_update_notifications"("conversationId");
CREATE INDEX "chatbox_update_notifications_questionSignature_idx" ON "chatbox_update_notifications"("questionSignature");
CREATE INDEX "chatbox_update_notifications_createdAt_idx" ON "chatbox_update_notifications"("createdAt");
