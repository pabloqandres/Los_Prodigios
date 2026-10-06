-- Add PDF export URL to episodes table
ALTER TABLE episodes ADD COLUMN IF NOT EXISTS script_pdf_url TEXT;
ALTER TABLE episodes ADD COLUMN IF NOT EXISTS script_pdf_drive_id TEXT;
