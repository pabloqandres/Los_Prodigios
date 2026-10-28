-- ─── ASSET MAESTRO ──────────────────────────────────────────────────────────────
-- Smart reuse system: 1 approved asset ↔ N episode usage references.
-- Run in Supabase SQL Editor after episode_asset_requests.sql

-- 1. Semantic tags on asset_slots
ALTER TABLE asset_slots
  ADD COLUMN IF NOT EXISTS semantic_tags  text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS usage_context  text;

CREATE INDEX IF NOT EXISTS idx_as_semantic_tags ON asset_slots USING GIN(semantic_tags);

-- 2. Suggested matching slots on gap requests
ALTER TABLE episode_asset_requests
  ADD COLUMN IF NOT EXISTS suggested_slots uuid[] DEFAULT '{}';

-- 3. Asset usage tracking: 1 slot → N episode references
CREATE TABLE IF NOT EXISTS asset_episode_usage (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  slot_id      uuid        NOT NULL REFERENCES asset_slots(id) ON DELETE CASCADE,
  episode_id   uuid        NOT NULL REFERENCES episodes(id) ON DELETE CASCADE,
  usage_type   text        NOT NULL DEFAULT 'origin'
               CHECK (usage_type IN ('origin', 'reused')),
  scene_ref    text,
  note         text,
  created_by   text,
  created_at   timestamptz NOT NULL DEFAULT now(),
  UNIQUE(slot_id, episode_id)
);

CREATE INDEX IF NOT EXISTS idx_aeu_slot_id    ON asset_episode_usage(slot_id);
CREATE INDEX IF NOT EXISTS idx_aeu_episode_id ON asset_episode_usage(episode_id);
