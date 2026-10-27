import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { createServerClient } from '@/lib/supabase'

// GET /api/entity-doc-links?doc_id=xxx
// GET /api/entity-doc-links?entity_name=xxx
// GET /api/entity-doc-links?search=xxx   — distinct entities from asset_slots matching name
export async function GET(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createServerClient()
  const { searchParams } = req.nextUrl
  const doc_id      = searchParams.get('doc_id')
  const entity_name = searchParams.get('entity_name')
  const search      = searchParams.get('search')

  // Entity search mode — returns distinct entities from asset_slots
  if (search !== null) {
    const q = search.trim()
    let query = supabase
      .from('asset_slots')
      .select('entity_name, entity_label, category')
      .order('entity_label')
      .limit(20)

    if (q.length > 0) {
      query = query.ilike('entity_label', `%${q}%`)
    }

    const { data, error } = await query
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    // Deduplicate by entity_name
    const seen = new Set<string>()
    const unique = (data ?? []).filter(row => {
      if (seen.has(row.entity_name)) return false
      seen.add(row.entity_name)
      return true
    })

    return NextResponse.json(unique)
  }

  // Links lookup mode
  let query = supabase
    .from('entity_doc_links')
    .select('*')
    .order('created_at')

  if (doc_id)      query = query.eq('doc_id', doc_id)
  if (entity_name) query = query.eq('entity_name', entity_name)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json(data ?? [])
}

// POST /api/entity-doc-links
// Body: { doc_id, entity_name, entity_label, entity_category, link_type? }
export async function POST(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createServerClient()
  const body = await req.json()
  const { doc_id, entity_name, entity_label, entity_category, link_type = 'primary' } = body

  if (!doc_id || !entity_name || !entity_label || !entity_category) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('entity_doc_links')
    .upsert({
      doc_id,
      entity_name,
      entity_label,
      entity_category,
      link_type,
      created_by: token.email ?? 'system',
    }, { onConflict: 'doc_id,entity_name' })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}

// DELETE /api/entity-doc-links?id=xxx
export async function DELETE(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createServerClient()
  const id = req.nextUrl.searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

  const { error } = await supabase
    .from('entity_doc_links')
    .delete()
    .eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
