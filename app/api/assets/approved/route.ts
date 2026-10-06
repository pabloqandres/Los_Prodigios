import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

// GET /api/assets/approved
// Retorna todos los slots aprobados con URLs de Drive
// Query params opcionales: ?category=personajes  ?entity_name=MateoGonzalez

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const category = searchParams.get('category')
  const entity_name = searchParams.get('entity_name')

  const supabase = createServerClient()

  let query = supabase
    .from('asset_slots')
    .select('id, category, entity_name, entity_label, view_type, outfit, age_version, version_label, approved_drive_file_id, updated_at')
    .eq('status', 'approved')
    .order('category', { ascending: true })
    .order('entity_name', { ascending: true })
    .order('view_type', { ascending: true })

  if (category) query = query.eq('category', category)
  if (entity_name) query = query.eq('entity_name', entity_name)

  const { data, error } = await query

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const base = process.env.NEXT_PUBLIC_SUPABASE_URL
  const withUrls = (data ?? []).map(slot => ({
    ...slot,
    thumbnail_url: slot.approved_drive_file_id
      ? `${base}/storage/v1/object/public/assets/${slot.approved_drive_file_id}`
      : null,
    direct_url: slot.approved_drive_file_id
      ? `${base}/storage/v1/object/public/assets/${slot.approved_drive_file_id}`
      : null,
  }))

  return NextResponse.json(withUrls)
}
