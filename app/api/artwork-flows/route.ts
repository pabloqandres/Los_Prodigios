import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { createServerClient } from '@/lib/supabase'

async function isAdmin(email: string, supabase: ReturnType<typeof createServerClient>) {
  const { data } = await supabase.from('user_roles').select('role').eq('email', email).single()
  return data?.role === 'admin'
}

// GET /api/artwork-flows          → list (no json payload)
// GET /api/artwork-flows?id=uuid  → full row with nodes_json + edges_json
export async function GET(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
  if (!token || !token.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const id = request.nextUrl.searchParams.get('id')
  const supabase = createServerClient()
  const admin = await isAdmin(token.email, supabase)

  if (id) {
    let query = supabase.from('artwork_flows').select('*').eq('id', id)
    if (!admin) query = query.eq('created_by', token.email)
    const { data, error } = await query.single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data)
  }

  let query = supabase
    .from('artwork_flows')
    .select('id, title, created_by, created_at, updated_at')
    .order('updated_at', { ascending: false })
  if (!admin) query = query.eq('created_by', token.email)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ flows: data ?? [], isAdmin: admin })
}

// POST /api/artwork-flows — create new flow
export async function POST(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
  if (!token || !token.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { title, nodes_json, edges_json } = await request.json()
  if (!title) return NextResponse.json({ error: 'title requerido' }, { status: 400 })

  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('artwork_flows')
    .insert({
      title,
      nodes_json: nodes_json ?? [],
      edges_json: edges_json ?? [],
      created_by: token.email,
    })
    .select('id, title, created_at, updated_at')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}

// PATCH /api/artwork-flows?id=uuid — update flow
export async function PATCH(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
  if (!token || !token.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const id = request.nextUrl.searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'id requerido' }, { status: 400 })

  const body = await request.json()
  const patch: Record<string, unknown> = { updated_at: new Date().toISOString() }
  if (body.title !== undefined) patch.title = body.title
  if (body.nodes_json !== undefined) patch.nodes_json = body.nodes_json
  if (body.edges_json !== undefined) patch.edges_json = body.edges_json

  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('artwork_flows')
    .update(patch)
    .eq('id', id)
    .eq('created_by', token.email)
    .select('id, title, updated_at')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// DELETE /api/artwork-flows?id=uuid
export async function DELETE(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
  if (!token || !token.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const id = request.nextUrl.searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'id requerido' }, { status: 400 })

  const supabase = createServerClient()
  const admin = await isAdmin(token.email, supabase)

  let query = supabase.from('artwork_flows').delete().eq('id', id)
  if (!admin) query = query.eq('created_by', token.email)

  const { error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
