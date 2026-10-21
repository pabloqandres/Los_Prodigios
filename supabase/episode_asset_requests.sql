-- ─── EPISODE ASSET REQUESTS ────────────────────────────────────────────────────
-- Stores asset gaps detected by the script analysis pipeline.
-- Run in Supabase SQL Editor after episodes_schema.sql

CREATE TABLE IF NOT EXISTS episode_asset_requests (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  episode_id      uuid NOT NULL REFERENCES episodes(id) ON DELETE CASCADE,

  -- Which scene needs this asset
  scene_ref       text,             -- e.g. "Escena 3" or scene id if structured

  -- The asset being requested
  category        text NOT NULL,    -- personajes, locaciones, props, criaturas, etc.
  entity_name     text NOT NULL,    -- PascalCase slug, e.g. "MateoGonzalez"
  entity_label    text NOT NULL,    -- Human-readable, e.g. "Mateo González"
  matrix_key      text,             -- entrenadores, personajes, locaciones, etc.
  view_type       text NOT NULL,    -- e.g. "Identidad facial", "Uniforme partido"
  outfit          text,             -- e.g. "Casual", "Uniforme titular"
  age_version     text,             -- e.g. "Frontal", "3/4"

  -- Why this asset is needed
  reason          text,             -- brief justification from the analysis

  -- Status tracking
  status          text NOT NULL DEFAULT 'pending'
                  CHECK (status IN ('pending', 'linked', 'created', 'skipped')),
  linked_slot_id  uuid REFERENCES asset_slots(id) ON DELETE SET NULL,

  -- Metadata
  ai_generated    boolean DEFAULT true,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ear_episode_id  ON episode_asset_requests(episode_id);
CREATE INDEX IF NOT EXISTS idx_ear_entity_name ON episode_asset_requests(entity_name);
CREATE INDEX IF NOT EXISTS idx_ear_status      ON episode_asset_requests(status);
