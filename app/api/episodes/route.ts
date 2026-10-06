import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { createServerClient } from '@/lib/supabase'

export const runtime = 'nodejs'

// GET /api/episodes          → lista todos (o filtrado por ?season=N)
// GET /api/episodes?id=uuid  → episodio completo con actos y escenas
export async function GET(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createServerClient()
  const id = request.nextUrl.searchParams.get('id')
  const season = request.nextUrl.searchParams.get('season')

  if (id) {
    // Full episode with acts and scenes
    const { data: episode, error } = await supabase
      .from('episodes')
      .select('*')
      .eq('id', id)
      .single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    const { data: acts } = await supabase
      .from('acts')
      .select('*')
      .eq('episode_id', id)
      .order('act_number')

    const actIds = (acts ?? []).map(a => a.id)
    const { data: scenes } = actIds.length > 0
      ? await supabase.from('scenes').select('*, scene_characters(*)').in('act_id', actIds).order('scene_number')
      : { data: [] }

    return NextResponse.json({ ...episode, acts: acts ?? [], scenes: scenes ?? [] })
  }

  let query = supabase
    .from('episodes')
    .select('id, season, episode_number, title, logline, status, created_by, updated_at')
    .order('season')
    .order('episode_number')

  if (season) query = query.eq('season', parseInt(season))

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data ?? [])
}

// POST /api/episodes — crear episodio nuevo
export async function POST(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
  if (!token?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { season, episode_number, title } = await request.json()
  if (!season || !episode_number) {
    return NextResponse.json({ error: 'season y episode_number requeridos' }, { status: 400 })
  }

  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('episodes')
    .insert({ season, episode_number, title: title || null, created_by: token.email })
    .select('id, season, episode_number, title, status, created_at')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Auto-create 3 acts
  await supabase.from('acts').insert([
    { episode_id: data.id, act_number: 1 },
    { episode_id: data.id, act_number: 2 },
    { episode_id: data.id, act_number: 3 },
  ])

  return NextResponse.json(data, { status: 201 })
}

// PATCH /api/episodes?id=uuid
export async function PATCH(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
  if (!token?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const id = request.nextUrl.searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'id requerido' }, { status: 400 })

  const body = await request.json()
  const allowed = ['title', 'logline', 'synopsis', 'theme', 'cold_open', 'tag', 'script', 'status', 'completed_at', 'script_version', 'script_finalized', 'script_pdf_url', 'script_pdf_drive_id']
  const patch: Record<string, unknown> = { updated_at: new Date().toISOString() }
  for (const key of allowed) {
    if (body[key] !== undefined) patch[key] = body[key]
  }

  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('episodes')
    .update(patch)
    .eq('id', id)
    .select('id, season, episode_number, title, status, updated_at')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// DELETE /api/episodes?id=uuid (admin only)
export async function DELETE(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
  if (!token?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createServerClient()
  const { data: role } = await supabase.from('user_roles').select('role').eq('email', token.email).single()
  if (role?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const id = request.nextUrl.searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'id requerido' }, { status: 400 })

  const { error } = await supabase.from('episodes').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
