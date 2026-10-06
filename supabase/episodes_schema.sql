-- ─── EPISODE BUILDER SCHEMA ──────────────────────────────────────────────────
-- Run this in Supabase SQL Editor

-- Episodes table
CREATE TABLE IF NOT EXISTS episodes (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  season         smallint NOT NULL CHECK (season BETWEEN 1 AND 5),
  episode_number smallint NOT NULL CHECK (episode_number BETWEEN 1 AND 10),
  title          text,
  logline        text,
  synopsis       text,
  theme          text,
  cold_open      text,
  tag            text,
  script         text,           -- guión completo en formato estándar
  status         text NOT NULL DEFAULT 'draft'
                 CHECK (status IN ('draft', 'outline', 'script', 'in_production', 'completed')),
  completed_at   timestamptz,
  created_by     text NOT NULL,
  created_at     timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now(),
  UNIQUE (season, episode_number)
);

-- Acts table
CREATE TABLE IF NOT EXISTS acts (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  episode_id   uuid NOT NULL REFERENCES episodes(id) ON DELETE CASCADE,
  act_number   smallint NOT NULL CHECK (act_number IN (1, 2, 3)),
  title        text,
  summary      text,
  goal         text,
  conflict     text,
  resolution   text,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now(),
  UNIQUE (episode_id, act_number)
);

-- Scenes table
CREATE TABLE IF NOT EXISTS scenes (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  act_id         uuid NOT NULL REFERENCES acts(id) ON DELETE CASCADE,
  episode_id     uuid NOT NULL REFERENCES episodes(id) ON DELETE CASCADE,
  scene_number   smallint NOT NULL,
  title          text,
  description    text,
  script_text    text,           -- guión de esta escena específica
  location_doc_id uuid,          -- FK a reference_docs si existe
  location_name  text,           -- nombre libre si no está en biblia
  time_of_day    text CHECK (time_of_day IN ('día', 'noche', 'amanecer', 'atardecer', 'interior', 'exterior')),
  duration_est   smallint,       -- segundos estimados
  mood           text,
  action_notes   text,
  visual_notes   text,
  created_at     timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now(),
  UNIQUE (act_id, scene_number)
);

-- Scene characters (junction)
CREATE TABLE IF NOT EXISTS scene_characters (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  scene_id         uuid NOT NULL REFERENCES scenes(id) ON DELETE CASCADE,
  character_ref_id uuid,          -- FK a reference_docs
  character_name   text NOT NULL,
  role_in_scene    text,
  created_at       timestamptz NOT NULL DEFAULT now()
);

-- Storyboard panels
CREATE TABLE IF NOT EXISTS storyboard_panels (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  scene_id        uuid NOT NULL REFERENCES scenes(id) ON DELETE CASCADE,
  panel_number    smallint NOT NULL,
  shot_type       text,
  camera_movement text,
  description     text NOT NULL,
  dialogue        text,
  action          text,
  duration_est    smallint,
  ai_prompt       text,
  image_url       text,
  notes           text,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now(),
  UNIQUE (scene_id, panel_number)
);

-- Episode continuity log
CREATE TABLE IF NOT EXISTS episode_continuity_log (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  episode_id      uuid NOT NULL REFERENCES episodes(id) ON DELETE CASCADE,
  log_type        text NOT NULL CHECK (log_type IN (
    'character_change', 'location_change', 'prop_change',
    'canon_fact', 'narrative_promise', 'issue'
  )),
  ref_entity_name text,
  description     text NOT NULL,
  scene_id        uuid REFERENCES scenes(id),
  is_resolved     boolean DEFAULT false,
  ai_generated    boolean DEFAULT false,
  created_by      text NOT NULL,
  created_at      timestamptz NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_episodes_season ON episodes(season);
CREATE INDEX IF NOT EXISTS idx_episodes_status ON episodes(status);
CREATE INDEX IF NOT EXISTS idx_acts_episode_id ON acts(episode_id);
CREATE INDEX IF NOT EXISTS idx_scenes_act_id ON scenes(act_id);
CREATE INDEX IF NOT EXISTS idx_scenes_episode_id ON scenes(episode_id);
CREATE INDEX IF NOT EXISTS idx_panels_scene_id ON storyboard_panels(scene_id);
CREATE INDEX IF NOT EXISTS idx_scene_chars_scene_id ON scene_characters(scene_id);
CREATE INDEX IF NOT EXISTS idx_continuity_log_episode ON episode_continuity_log(episode_id);
