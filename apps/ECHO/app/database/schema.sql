CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Regle centrale :
-- ECHO peut apprendre seule lorsque l'information est utile, peu sensible et fiable.
-- Mathieu valide ce qui est sensible, structurant ou incertain.
-- La base ne decide jamais. Elle conserve l'etat exact des informations :
-- brut, hypothese, valide, corrige, rejete.

CREATE OR REPLACE FUNCTION echo_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE IF NOT EXISTS echo_chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  role TEXT NOT NULL CHECK (role IN ('system', 'user', 'assistant')),
  content TEXT NOT NULL,
  model TEXT,
  request_id TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb
);

ALTER TABLE echo_chat_messages
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();

CREATE INDEX IF NOT EXISTS idx_echo_chat_messages_created_at
  ON echo_chat_messages (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_echo_chat_messages_request_id
  ON echo_chat_messages (request_id);

DROP TRIGGER IF EXISTS trg_echo_chat_messages_updated_at ON echo_chat_messages;

CREATE TRIGGER trg_echo_chat_messages_updated_at
BEFORE UPDATE ON echo_chat_messages
FOR EACH ROW
EXECUTE FUNCTION echo_set_updated_at();

CREATE TABLE IF NOT EXISTS echo_memory_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  source_message_id UUID REFERENCES echo_chat_messages(id) ON DELETE SET NULL,
  source TEXT NOT NULL DEFAULT 'chat',
  category TEXT NOT NULL DEFAULT 'general',
  type TEXT NOT NULL CHECK (
    type IN ('fait', 'hypothese', 'preference', 'decision', 'contradiction', 'a_verifier')
  ),
  sensitivity TEXT NOT NULL CHECK (
    sensitivity IN ('faible', 'moyenne', 'elevee', 'critique')
  ),
  confidence NUMERIC(3,2) NOT NULL DEFAULT 0 CHECK (
    confidence >= 0 AND confidence <= 1
  ),
  human_summary TEXT NOT NULL,
  source_content TEXT,
  status TEXT NOT NULL DEFAULT 'en_validation' CHECK (
    status IN (
      'autonome',
      'probabiliste',
      'en_validation',
      'valide',
      'corrige',
      'rejete',
      'ancien',
      'abandonne',
      'contredit',
      'obsolete',
      'actif'
    )
  ),
  validated BOOLEAN NOT NULL DEFAULT false,
  links JSONB NOT NULL DEFAULT '[]'::jsonb,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb
);

ALTER TABLE echo_memory_entries
  ADD COLUMN IF NOT EXISTS source_message_id UUID REFERENCES echo_chat_messages(id) ON DELETE SET NULL;

ALTER TABLE echo_memory_entries
  ALTER COLUMN status SET DEFAULT 'en_validation';

ALTER TABLE echo_memory_entries
  DROP CONSTRAINT IF EXISTS echo_memory_entries_status_check;

ALTER TABLE echo_memory_entries
  ADD CONSTRAINT echo_memory_entries_status_check CHECK (
    status IN (
      'autonome',
      'probabiliste',
      'en_validation',
      'valide',
      'corrige',
      'rejete',
      'ancien',
      'abandonne',
      'contredit',
      'obsolete',
      'actif'
    )
  );

CREATE INDEX IF NOT EXISTS idx_echo_memory_entries_created_at
  ON echo_memory_entries (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_echo_memory_entries_type
  ON echo_memory_entries (type);

CREATE INDEX IF NOT EXISTS idx_echo_memory_entries_validated
  ON echo_memory_entries (validated);

CREATE INDEX IF NOT EXISTS idx_echo_memory_entries_source_message_id
  ON echo_memory_entries (source_message_id);

DROP TRIGGER IF EXISTS trg_echo_memory_entries_updated_at ON echo_memory_entries;

CREATE TRIGGER trg_echo_memory_entries_updated_at
BEFORE UPDATE ON echo_memory_entries
FOR EACH ROW
EXECUTE FUNCTION echo_set_updated_at();

CREATE TABLE IF NOT EXISTS echo_hypotheses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  source_message_id UUID REFERENCES echo_chat_messages(id) ON DELETE SET NULL,
  hypothesis TEXT NOT NULL,
  confidence NUMERIC(3,2) NOT NULL DEFAULT 0 CHECK (
    confidence >= 0 AND confidence <= 1
  ),
  observed_elements TEXT,
  validation_question TEXT,
  mathieu_response TEXT,
  status TEXT NOT NULL DEFAULT 'en_attente' CHECK (
    status IN ('en_attente', 'validee', 'rejetee', 'corrigee')
  ),
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb
);

ALTER TABLE echo_hypotheses
  ADD COLUMN IF NOT EXISTS source_message_id UUID REFERENCES echo_chat_messages(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_echo_hypotheses_created_at
  ON echo_hypotheses (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_echo_hypotheses_status
  ON echo_hypotheses (status);

CREATE INDEX IF NOT EXISTS idx_echo_hypotheses_source_message_id
  ON echo_hypotheses (source_message_id);

DROP TRIGGER IF EXISTS trg_echo_hypotheses_updated_at ON echo_hypotheses;

CREATE TRIGGER trg_echo_hypotheses_updated_at
BEFORE UPDATE ON echo_hypotheses
FOR EACH ROW
EXECUTE FUNCTION echo_set_updated_at();

CREATE TABLE IF NOT EXISTS echo_decisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  source_message_id UUID REFERENCES echo_chat_messages(id) ON DELETE SET NULL,
  decision TEXT NOT NULL,
  reason TEXT,
  status TEXT NOT NULL DEFAULT 'actif',
  decided_at TIMESTAMPTZ,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_echo_decisions_created_at
  ON echo_decisions (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_echo_decisions_status
  ON echo_decisions (status);

CREATE INDEX IF NOT EXISTS idx_echo_decisions_source_message_id
  ON echo_decisions (source_message_id);

DROP TRIGGER IF EXISTS trg_echo_decisions_updated_at ON echo_decisions;

CREATE TRIGGER trg_echo_decisions_updated_at
BEFORE UPDATE ON echo_decisions
FOR EACH ROW
EXECUTE FUNCTION echo_set_updated_at();
