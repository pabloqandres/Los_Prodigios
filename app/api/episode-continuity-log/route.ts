import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { createServerClient } from '@/lib/supabase'

export const runtime = 'nodejs'

// GET /api/episode-continuity-log?episode_id=uuid
export async function GET(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
  if (!token?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const episode_id = request.nextUrl.searchParams.get('episode_id')
  if (!episode_id) return NextResponse.json({ error: 'episode_id requerido' }, { status: 400 })

  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('episode_continuity_log')
    .select('*')
    .eq('episode_id', episode_id)
    .order('created_at', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data ?? [])
}

// POST /api/episode-continuity-log — save array of change entries
export async function POST(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
  if (!token?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { episode_id, changes } = await request.json()
  if (!episode_id || !Array.isArray(changes) || changes.length === 0) {
    return NextResponse.json({ error: 'episode_id y changes[] requeridos' }, { status: 400 })
  }

  const supabase = createServerClient()

  const rows = changes.map((c: { type: string; entity: string; description: string }) => ({
    episode_id,
    type: c.type ?? 'canon_fact',
    entity: c.entity ?? '',
    description: c.description ?? '',
    created_by: token.email,
  }))

  const { data, error } = await supabase
    .from('episode_continuity_log')
    .insert(rows)
    .select('*')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true, saved: data?.length ?? 0 }, { status: 201 })
}

// DELETE /api/episode-continuity-log?id=uuid — delete single entry
export async function DELETE(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
  if (!token?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const id = request.nextUrl.searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'id requerido' }, { status: 400 })

  const supabase = createServerClient()
  const { error } = await supabase.from('episode_continuity_log').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
