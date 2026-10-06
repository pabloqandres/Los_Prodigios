import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { createServerClient } from '@/lib/supabase'
import { SLOT_MATRIX, ENTITIES } from '@/lib/approval-config'

export const runtime = 'nodejs'

// Builds the set of valid keys from the current SLOT_MATRIX × ENTITIES config
function buildValidKeys(): Set<string> {
  const keys = new Set<string>()
  for (const [category, entities] of Object.entries(ENTITIES)) {
    const matrix = SLOT_MATRIX[category] ?? []
    for (const entity of entities) {
      for (const row of matrix) {
        const ageVersions = (row.view_type === 'Accesorio' && entity.accessories && entity.accessories.length > 0)
          ? entity.accessories
          : row.age_versions
        for (const age_version of ageVersions) {
          const key = `${entity.entity_name}|${row.view_type}|${row.outfit ?? ''}|${age_version}`
          keys.add(key)
        }
      }
    }
  }
  return keys
}

function groupByEntity(slots: { entity_label: string; version_label: string }[]) {
  const map: Record<string, string[]> = {}
  for (const s of slots) {
    if (!map[s.entity_label]) map[s.entity_label] = []
    map[s.entity_label].push(s.version_label)
  }
  return map
}

// GET → preview: lists orphaned slots without deleting
export async function GET(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createServerClient()

  const { data: allSlots, error } = await supabase
    .from('asset_slots')
    .select('id, category, entity_name, entity_label, view_type, outfit, age_version, version_label, status, pending_drive_file_id, approved_drive_file_id')
    .order('entity_name')
    .order('view_type')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const validKeys = buildValidKeys()

  const orphans = (allSlots ?? []).filter(s => {
    const key = `${s.entity_name}|${s.view_type}|${s.outfit ?? ''}|${s.age_version ?? ''}`
    return !validKeys.has(key)
  })

  return NextResponse.json({
    total_slots: allSlots?.length ?? 0,
    valid_slots: (allSlots?.length ?? 0) - orphans.length,
    orphan_count: orphans.length,
    orphans_with_images: orphans.filter(s => s.pending_drive_file_id || s.approved_drive_file_id).length,
    orphans_empty: orphans.filter(s => !s.pending_drive_file_id && !s.approved_drive_file_id).length,
    by_entity: groupByEntity(orphans),
    orphans,
  })
}

// POST → delete orphaned slots
// body: { force?: boolean }
// force=false (default): only deletes empty slots (no images) — safe
// force=true: also deletes slots that have images
export async function POST(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json().catch(() => ({}))
  const force = body.force === true

  const supabase = createServerClient()

  const { data: allSlots, error } = await supabase
    .from('asset_slots')
    .select('id, entity_name, entity_label, view_type, outfit, age_version, version_label, status, pending_drive_file_id, approved_drive_file_id')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const validKeys = buildValidKeys()

  const orphans = (allSlots ?? []).filter(s => {
    const key = `${s.entity_name}|${s.view_type}|${s.outfit ?? ''}|${s.age_version ?? ''}`
    return !validKeys.has(key)
  })

  const toDelete = force
    ? orphans
    : orphans.filter(s => !s.pending_drive_file_id && !s.approved_drive_file_id)

  const skipped = force ? [] : orphans.filter(s => s.pending_drive_file_id || s.approved_drive_file_id)

  if (toDelete.length === 0) {
    return NextResponse.json({
      deleted: 0,
      skipped: skipped.length,
      skipped_slots: skipped.map(s => ({ id: s.id, version_label: s.version_label })),
      message: skipped.length > 0
        ? `0 eliminados. ${skipped.length} omitidos por tener imágenes — usa force:true para eliminarlos también.`
        : 'No hay slots huérfanos que eliminar.',
    })
  }

  const ids = toDelete.map(s => s.id)
  const { error: delError } = await supabase.from('asset_slots').delete().in('id', ids)

  if (delError) return NextResponse.json({ error: delError.message }, { status: 500 })

  return NextResponse.json({
    deleted: ids.length,
    skipped: skipped.length,
    deleted_slots: toDelete.map(s => ({ id: s.id, entity_label: s.entity_label, version_label: s.version_label })),
    skipped_slots: skipped.map(s => ({ id: s.id, entity_label: s.entity_label, version_label: s.version_label })),
    message: `${ids.length} slots huérfanos eliminados.${skipped.length > 0 ? ` ${skipped.length} omitidos por tener imágenes.` : ''}`,
  })
}
