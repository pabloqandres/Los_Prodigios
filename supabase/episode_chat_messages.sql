-- Chat history per episode (persists AI conversations across sessions)
CREATE TABLE IF NOT EXISTS episode_chat_messages (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  episode_id  UUID NOT NULL REFERENCES episodes(id) ON DELETE CASCADE,
  workflow_key TEXT NOT NULL DEFAULT 'general',
  role        TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content     TEXT NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_episode_chat_episode_id ON episode_chat_messages(episode_id, created_at);
