import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { createServerClient } from '@/lib/supabase'
import { SLOT_MATRIX, ENTITIES, makeVersionLabel } from '@/lib/approval-config'
import { logActivity } from '@/lib/activity'

// POST /api/assets/create-entity
// Crea todos los slots para una entidad nueva basado en SLOT_MATRIX[category]
// Idempotente: no duplica slots ya existentes
// Body: { entity_name, entity_label, category, dry_run? }

export async function POST(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { entity_name, entity_label, category, matrix_key: bodyMatrixKey, dry_run } = body

  if (!entity_name || !entity_label || !category) {
    return NextResponse.json({ error: 'Faltan campos: entity_name, entity_label, category' }, { status: 400 })
  }

  // Buscar la definición de entidad (para override de matrix_key y accesorios)
  // Prioridad: entityDef.matrix_key > body.matrix_key > category
  const entityDef = Object.values(ENTITIES).flat().find(e => e.entity_name === entity_name)

  const matrixKey = entityDef?.matrix_key ?? bodyMatrixKey ?? category
  const matrix = SLOT_MATRIX[matrixKey]
  if (!matrix) {
    return NextResponse.json({ error: `Categoría no válida: ${category}` }, { status: 400 })
  }

  // Generar todos los slots esperados para esta entidad
  const expectedSlots: object[] = []
  for (const row of matrix) {
    const ageVersions = (row.view_type === 'Accesorio' && entityDef?.accessories?.length)
      ? entityDef.accessories
      : row.age_versions
    if (ageVersions.length === 0) continue
    for (const age_version of ageVersions) {
      expectedSlots.push({
        category,
        entity_name,
        entity_label,
        view_type: row.view_type,
        outfit: row.outfit,
        age_version,
        version_label: makeVersionLabel(row.view_type, row.outfit, age_version),
        status: 'pending',
        created_by: token.email ?? 'system',
      })
    }
  }

  // Si es dry_run, solo devolver el preview
  if (dry_run) {
    return NextResponse.json({
      entity_name,
      entity_label,
      category,
      total: expectedSlots.length,
      slots_preview: expectedSlots,
    })
  }

  const supabase = createServerClient()

  // Verificar cuáles ya existen (idempotencia)
  const { data: existing } = await supabase
    .from('asset_slots')
    .select('view_type, outfit, age_version')
    .eq('entity_name', entity_name)

  const existingKeys = new Set(
    (existing ?? []).map((s: any) =>
      `${s.view_type}|${s.outfit ?? ''}|${s.age_version ?? ''}`
    )
  )

  const newSlots = expectedSlots.filter((s: any) => {
    const key = `${s.view_type}|${s.outfit ?? ''}|${s.age_version ?? ''}`
    return !existingKeys.has(key)
  })

  if (newSlots.length === 0) {
    return NextResponse.json({
      message: `La entidad "${entity_label}" ya tiene todos sus slots (${expectedSlots.length} total).`,
      created: 0,
      total: expectedSlots.length,
    })
  }

  const { data, error } = await supabase
    .from('asset_slots')
    .insert(newSlots)
    .select()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  await logActivity({
    action: 'entity.create',
    entity_type: 'entity',
    entity_label,
    detail: `${data?.length ?? 0} slots creados — categoría: ${category}`,
    user_email: token.email as string,
  })

  return NextResponse.json({
    message: `${data?.length ?? 0} slots creados para "${entity_label}".`,
    created: data?.length ?? 0,
    total: expectedSlots.length,
    entity_name,
    entity_label,
    category,
  }, { status: 201 })
}
