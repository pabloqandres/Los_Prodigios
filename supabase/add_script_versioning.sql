-- Script versioning fields for episodes
ALTER TABLE episodes ADD COLUMN IF NOT EXISTS script_version INTEGER NOT NULL DEFAULT 1;
ALTER TABLE episodes ADD COLUMN IF NOT EXISTS script_finalized BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE episodes ADD COLUMN IF NOT EXISTS script_pdf_url TEXT;
ALTER TABLE episodes ADD COLUMN IF NOT EXISTS script_pdf_drive_id TEXT;
