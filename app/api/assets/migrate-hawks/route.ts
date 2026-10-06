import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { createServerClient } from '@/lib/supabase'
import { SLOT_MATRIX, ENTITIES, makeVersionLabel } from '@/lib/approval-config'

export const runtime = 'nodejs'

// POST /api/assets/migrate-hawks
// 1. Borra todos los slots de entidades Hawks que estén en categoría incorrecta
// 2. Crea los slots nuevos bajo categoría 'hawks'
// Endpoint de uso único — se puede eliminar después de migrar.

export async function POST(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createServerClient()

  const hawksEntityNames = (ENTITIES['hawks'] ?? []).map(e => e.entity_name)

  // 1. Borrar todos los slots de entidades Hawks que NO sean category='hawks'
  const { data: oldSlots, error: fetchErr } = await supabase
    .from('asset_slots')
    .select('id, category, entity_name, version_label')
    .in('entity_name', hawksEntityNames)
    .neq('category', 'hawks')

  if (fetchErr) return NextResponse.json({ error: fetchErr.message }, { status: 500 })

  let deleted = 0
  if (oldSlots && oldSlots.length > 0) {
    const ids = oldSlots.map(s => s.id)
    const { error: delErr } = await supabase.from('asset_slots').delete().in('id', ids)
    if (delErr) return NextResponse.json({ error: delErr.message }, { status: 500 })
    deleted = ids.length
  }

  // 2. Crear slots nuevos bajo 'hawks' para todos los que falten
  const matrix = SLOT_MATRIX['hawks'] ?? []
  const allExpected: object[] = []

  for (const entity of ENTITIES['hawks'] ?? []) {
    for (const row of matrix) {
      const ageVersions = (row.view_type === 'Accesorio' && entity.accessories?.length)
        ? entity.accessories
        : row.age_versions
      if (ageVersions.length === 0) continue
      for (const age_version of ageVersions) {
        allExpected.push({
          category: 'hawks',
          entity_name: entity.entity_name,
          entity_label: entity.entity_label,
          view_type: row.view_type,
          outfit: row.outfit,
          age_version,
          version_label: makeVersionLabel(row.view_type, row.outfit, age_version),
          status: 'pending',
          created_by: token.email ?? 'system',
        })
      }
    }
  }

  // Idempotencia: no duplicar los que ya existan en 'hawks'
  const { data: existing } = await supabase
    .from('asset_slots')
    .select('entity_name, view_type, outfit, age_version')
    .eq('category', 'hawks')

  const existingKeys = new Set(
    (existing ?? []).map((s: any) => `${s.entity_name}|${s.view_type}|${s.outfit ?? ''}|${s.age_version ?? ''}`)
  )

  const toInsert = allExpected.filter((s: any) => {
    const key = `${s.entity_name}|${s.view_type}|${s.outfit ?? ''}|${s.age_version ?? ''}`
    return !existingKeys.has(key)
  })

  let created = 0
  if (toInsert.length > 0) {
    const { data, error: insErr } = await supabase.from('asset_slots').insert(toInsert).select()
    if (insErr) return NextResponse.json({ error: insErr.message }, { status: 500 })
    created = data?.length ?? 0
  }

  return NextResponse.json({
    message: `Migración completa. ${deleted} slots viejos eliminados, ${created} slots Hawks creados.`,
    deleted,
    created,
    total_expected: allExpected.length,
  })
}
