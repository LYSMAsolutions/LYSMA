CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE "echo_chat_messages" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "role" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "model" TEXT,
  "request_id" TEXT,
  "metadata" JSONB NOT NULL DEFAULT '{}',

  CONSTRAINT "echo_chat_messages_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "echo_chat_messages_role_check" CHECK ("role" IN ('system', 'user', 'assistant'))
);

CREATE TABLE "echo_memory_entries" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "source_message_id" UUID,
  "source" TEXT NOT NULL DEFAULT 'chat',
  "category" TEXT NOT NULL DEFAULT 'general',
  "type" TEXT NOT NULL,
  "sensitivity" TEXT NOT NULL,
  "confidence" DECIMAL(3,2) NOT NULL DEFAULT 0,
  "human_summary" TEXT NOT NULL,
  "source_content" TEXT,
  "status" TEXT NOT NULL DEFAULT 'en_validation',
  "validated" BOOLEAN NOT NULL DEFAULT false,
  "links" JSONB NOT NULL DEFAULT '[]',
  "metadata" JSONB NOT NULL DEFAULT '{}',

  CONSTRAINT "echo_memory_entries_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "echo_memory_entries_type_check" CHECK ("type" IN ('fait', 'hypothese', 'preference', 'decision', 'contradiction', 'a_verifier')),
  CONSTRAINT "echo_memory_entries_sensitivity_check" CHECK ("sensitivity" IN ('faible', 'moyenne', 'elevee', 'critique')),
  CONSTRAINT "echo_memory_entries_confidence_check" CHECK ("confidence" >= 0 AND "confidence" <= 1),
  CONSTRAINT "echo_memory_entries_status_check" CHECK ("status" IN ('autonome', 'probabiliste', 'en_validation', 'valide', 'corrige', 'rejete', 'ancien', 'abandonne', 'contredit', 'obsolete', 'actif'))
);

CREATE TABLE "echo_hypotheses" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "source_message_id" UUID,
  "hypothesis" TEXT NOT NULL,
  "confidence" DECIMAL(3,2) NOT NULL DEFAULT 0,
  "observed_elements" TEXT,
  "validation_question" TEXT,
  "mathieu_response" TEXT,
  "status" TEXT NOT NULL DEFAULT 'en_attente',
  "metadata" JSONB NOT NULL DEFAULT '{}',

  CONSTRAINT "echo_hypotheses_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "echo_hypotheses_confidence_check" CHECK ("confidence" >= 0 AND "confidence" <= 1),
  CONSTRAINT "echo_hypotheses_status_check" CHECK ("status" IN ('en_attente', 'validee', 'rejetee', 'corrigee'))
);

CREATE TABLE "echo_decisions" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "source_message_id" UUID,
  "decision" TEXT NOT NULL,
  "reason" TEXT,
  "status" TEXT NOT NULL DEFAULT 'actif',
  "decided_at" TIMESTAMPTZ(6),
  "metadata" JSONB NOT NULL DEFAULT '{}',

  CONSTRAINT "echo_decisions_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "idx_echo_chat_messages_created_at" ON "echo_chat_messages"("created_at" DESC);
CREATE INDEX "idx_echo_chat_messages_request_id" ON "echo_chat_messages"("request_id");
CREATE INDEX "idx_echo_memory_entries_created_at" ON "echo_memory_entries"("created_at" DESC);
CREATE INDEX "idx_echo_memory_entries_type" ON "echo_memory_entries"("type");
CREATE INDEX "idx_echo_memory_entries_validated" ON "echo_memory_entries"("validated");
CREATE INDEX "idx_echo_memory_entries_source_message_id" ON "echo_memory_entries"("source_message_id");
CREATE INDEX "idx_echo_hypotheses_created_at" ON "echo_hypotheses"("created_at" DESC);
CREATE INDEX "idx_echo_hypotheses_status" ON "echo_hypotheses"("status");
CREATE INDEX "idx_echo_hypotheses_source_message_id" ON "echo_hypotheses"("source_message_id");
CREATE INDEX "idx_echo_decisions_created_at" ON "echo_decisions"("created_at" DESC);
CREATE INDEX "idx_echo_decisions_status" ON "echo_decisions"("status");
CREATE INDEX "idx_echo_decisions_source_message_id" ON "echo_decisions"("source_message_id");

ALTER TABLE "echo_memory_entries"
  ADD CONSTRAINT "echo_memory_entries_source_message_id_fkey"
  FOREIGN KEY ("source_message_id") REFERENCES "echo_chat_messages"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "echo_hypotheses"
  ADD CONSTRAINT "echo_hypotheses_source_message_id_fkey"
  FOREIGN KEY ("source_message_id") REFERENCES "echo_chat_messages"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "echo_decisions"
  ADD CONSTRAINT "echo_decisions_source_message_id_fkey"
  FOREIGN KEY ("source_message_id") REFERENCES "echo_chat_messages"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;
