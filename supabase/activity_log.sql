-- ─── ACTIVITY LOG ─────────────────────────────────────────────────────────────
-- Tabla de trazabilidad completa: registra quién hizo qué y cuándo.
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS activity_log (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  action       text        NOT NULL,  -- 'doc.upload' | 'doc.delete' | 'doc.edit' |
                                      -- 'asset.upload' | 'asset.approve' | 'asset.reject' |
                                      -- 'asset.delete' | 'asset.bulk_approve' |
                                      -- 'entity.create' | 'entity.delete' |
                                      -- 'episode.create' | 'episode.edit' |
                                      -- 'artwork.create' | 'artwork.edit'
  entity_type  text        NOT NULL,  -- 'document' | 'asset_slot' | 'entity' | 'episode' | 'artwork_flow'
  entity_id    text,                  -- uuid del recurso afectado
  entity_label text        NOT NULL,  -- nombre legible para mostrar en el feed
  detail       text,                  -- contexto extra (versión, categoría, etc.)
  user_email   text        NOT NULL,
  created_at   timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_activity_log_created_at  ON activity_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_log_user_email  ON activity_log(user_email);
CREATE INDEX IF NOT EXISTS idx_activity_log_entity_type ON activity_log(entity_type);

ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;
