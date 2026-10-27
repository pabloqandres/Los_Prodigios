-- ── entity_doc_links ────────────────────────────────────────────────────────
-- Bidirectional many-to-many between reference_docs and canonical entities.
-- An entity is identified by (entity_name, category) — same keys used in asset_slots.
-- One doc can link to many entities; one entity can have many docs.

CREATE TABLE IF NOT EXISTS entity_doc_links (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  doc_id          uuid        NOT NULL REFERENCES reference_docs(id) ON DELETE CASCADE,
  entity_name     text        NOT NULL,   -- PascalCase canonical key, e.g. "MateoGonzalez"
  entity_label    text        NOT NULL,   -- Display name, e.g. "Mateo González"
  entity_category text        NOT NULL,   -- 'personajes' | 'locaciones' | 'props' | etc.
  link_type       text        NOT NULL DEFAULT 'primary'
                              CHECK (link_type IN ('primary', 'supporting', 'reference')),
  created_by      text        NOT NULL,
  created_at      timestamptz NOT NULL DEFAULT now(),
  UNIQUE (doc_id, entity_name)
);

-- Index for fast lookup in both directions
CREATE INDEX IF NOT EXISTS entity_doc_links_doc_id_idx      ON entity_doc_links(doc_id);
CREATE INDEX IF NOT EXISTS entity_doc_links_entity_name_idx ON entity_doc_links(entity_name);
