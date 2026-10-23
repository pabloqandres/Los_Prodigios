-- Motor NUPPA — Migration 001
-- Adds doc_type column to reference_docs
-- Run this in Supabase SQL editor BEFORE running seed-knowledge.js

ALTER TABLE reference_docs
  ADD COLUMN IF NOT EXISTS doc_type text NOT NULL DEFAULT 'bible';

UPDATE reference_docs SET doc_type = 'bible' WHERE doc_type IS NULL OR doc_type = '';

CREATE INDEX IF NOT EXISTS reference_docs_doc_type_idx ON reference_docs (doc_type);
