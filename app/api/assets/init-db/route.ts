import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const SQL = `
CREATE TABLE IF NOT EXISTS asset_slots (
  id                       uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category                 text NOT NULL CHECK (category IN ('personajes','locaciones','props','criaturas')),
  entity_name              text NOT NULL,
  entity_label             text NOT NULL,
  view_type                text NOT NULL,
  outfit                   text,
  age_version              text,
  version_label            text NOT NULL,
  notes                    text,
  status                   text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','in_review','approved','rejected')),
  pending_drive_file_id    text,
  pending_drive_folder_id  text,
  approved_drive_file_id   text,
  approved_drive_folder_id text,
  created_by               text NOT NULL DEFAULT 'system',
  created_at               timestamptz NOT NULL DEFAULT now(),
  updated_at               timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_asset_slots_status   ON asset_slots(status);
CREATE INDEX IF NOT EXISTS idx_asset_slots_category ON asset_slots(category);
CREATE INDEX IF NOT EXISTS idx_asset_slots_entity   ON asset_slots(entity_name);

CREATE TABLE IF NOT EXISTS asset_approvals (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slot_id         uuid NOT NULL REFERENCES asset_slots(id) ON DELETE CASCADE,
  reviewer_email  text NOT NULL,
  reviewer_name   text NOT NULL,
  approved        boolean NOT NULL,
  note            text,
  drive_file_id   text,
  created_at      timestamptz NOT NULL DEFAULT now(),
  UNIQUE (slot_id, reviewer_email)
);

CREATE INDEX IF NOT EXISTS idx_asset_approvals_slot ON asset_approvals(slot_id);
`

export async function POST() {
  const { error } = await supabase.rpc('exec_raw_sql', { sql: SQL }).single()

  // Si exec_raw_sql no existe, usamos el cliente directamente via raw query
  if (error) {
    // Fallback: ejecutar tabla por tabla via insert con select vacío para verificar existencia
    // Supabase no expone exec SQL via REST a menos que tengas una función.
    // Retornamos el SQL para que se ejecute manualmente.
    return NextResponse.json({
      message: 'Ejecuta este SQL en Supabase Dashboard → SQL Editor',
      sql: SQL,
      error: error.message,
    }, { status: 200 })
  }

  return NextResponse.json({ message: 'Tablas creadas correctamente' })
}
