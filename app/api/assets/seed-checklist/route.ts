import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { createServerClient } from '@/lib/supabase'
import { SLOT_MATRIX, ENTITIES, makeVersionLabel } from '@/lib/approval-config'

// POST /api/assets/seed-checklist
// Genera todos los slots del checklist desde SLOT_MATRIX x ENTITIES
// Idempotente: no duplica slots que ya existen

export async function POST(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createServerClient()

  // 1. Obtener combinaciones ya existentes
  const { data: existing } = await supabase
    .from('asset_slots')
    .select('entity_name, view_type, outfit, age_version')

  const existingKeys = new Set(
    (existing ?? []).map(s =>
      `${s.entity_name}|${s.view_type}|${s.outfit ?? ''}|${s.age_version ?? ''}`
    )
  )

  // 2. Generar todos los slots esperados
  const allSlots: object[] = []
  for (const [category, entities] of Object.entries(ENTITIES)) {
    const matrix = SLOT_MATRIX[category] ?? []
    for (const entity of entities) {
      for (const row of matrix) {
        // Use per-entity accessories if defined, falling back to the matrix row
        const ageVersions = (row.view_type === 'Accesorio' && entity.accessories && entity.accessories.length > 0)
          ? entity.accessories
          : row.age_versions
        for (const age_version of ageVersions) {
          allSlots.push({
            category,
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
  }

  // 3. Filtrar solo los nuevos
  const newSlots = allSlots.filter((s: any) => {
    const key = `${s.entity_name}|${s.view_type}|${s.outfit ?? ''}|${s.age_version ?? ''}`
    return !existingKeys.has(key)
  })

  if (newSlots.length === 0) {
    return NextResponse.json({
      message: `Checklist ya está completo. ${allSlots.length} slots existentes, 0 nuevos.`,
      created: 0,
      total: allSlots.length,
    })
  }

  // 4. Insertar solo los nuevos
  const { data, error } = await supabase
    .from('asset_slots')
    .insert(newSlots)
    .select()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({
    message: `${data?.length ?? 0} slots nuevos añadidos. Total esperado: ${allSlots.length}.`,
    created: data?.length ?? 0,
    total: allSlots.length,
  })
}
