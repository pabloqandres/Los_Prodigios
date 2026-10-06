import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { createServerClient } from '@/lib/supabase'

export const runtime = 'nodejs'

// GET /api/episode-chat?episode_id=uuid
export async function GET(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
  if (!token?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const episode_id = request.nextUrl.searchParams.get('episode_id')
  if (!episode_id) return NextResponse.json({ error: 'episode_id requerido' }, { status: 400 })

  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('episode_chat_messages')
    .select('id, workflow_key, role, content, created_at')
    .eq('episode_id', episode_id)
    .order('created_at', { ascending: true })
    .limit(200)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data ?? [])
}

// POST /api/episode-chat — save one or many messages
export async function POST(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
  if (!token?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const supabase = createServerClient()

  // Accept array or single message
  const messages = Array.isArray(body) ? body : [body]
  const rows = messages.map((m: { episode_id: string; workflow_key: string; role: string; content: string }) => ({
    episode_id: m.episode_id,
    workflow_key: m.workflow_key ?? 'general',
    role: m.role,
    content: m.content,
  }))

  const { error } = await supabase.from('episode_chat_messages').insert(rows)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true }, { status: 201 })
}

// DELETE /api/episode-chat?episode_id=uuid&workflow_key=key — clear history for a workflow
export async function DELETE(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
  if (!token?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const episode_id = request.nextUrl.searchParams.get('episode_id')
  const workflow_key = request.nextUrl.searchParams.get('workflow_key')
  if (!episode_id) return NextResponse.json({ error: 'episode_id requerido' }, { status: 400 })

  const supabase = createServerClient()
  let query = supabase.from('episode_chat_messages').delete().eq('episode_id', episode_id)
  if (workflow_key) query = query.eq('workflow_key', workflow_key)

  const { error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
