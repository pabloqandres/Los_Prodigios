import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { createServerClient } from '@/lib/supabase'

export const runtime = 'nodejs'

// PATCH /api/acts?id=uuid — update act fields
export async function PATCH(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
  if (!token?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const id = request.nextUrl.searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'id requerido' }, { status: 400 })

  const body = await request.json()
  const allowed = ['title', 'summary', 'goal', 'conflict', 'resolution']
  const patch: Record<string, unknown> = { updated_at: new Date().toISOString() }
  for (const key of allowed) {
    if (body[key] !== undefined) patch[key] = body[key]
  }

  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('acts')
    .update(patch)
    .eq('id', id)
    .select('*')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
