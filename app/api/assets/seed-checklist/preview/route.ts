import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { SLOT_MATRIX, ENTITIES } from '@/lib/approval-config'

export const runtime = 'nodejs'

// GET /api/assets/seed-checklist/preview?entity_name=X&category=Y
// Returns how many slots the seed would create for this entity (without touching the DB)
export async function GET(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const entity_name = req.nextUrl.searchParams.get('entity_name') ?? ''
  const category    = req.nextUrl.searchParams.get('category') ?? ''

  if (!entity_name || !category) {
    return NextResponse.json({ error: 'entity_name and category required' }, { status: 400 })
  }

  const matrix = SLOT_MATRIX[category] ?? []

  // Find entity def (for per-entity accessory overrides)
  const entityDef = Object.values(ENTITIES)
    .flat()
    .find(e => e.entity_name === entity_name)

  let total = 0
  for (const row of matrix) {
    const ageVersions = (row.view_type === 'Accesorio' && entityDef?.accessories?.length)
      ? entityDef.accessories
      : row.age_versions
    total += ageVersions.length
  }

  return NextResponse.json({ total, category, entity_name })
}
