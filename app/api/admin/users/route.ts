import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { createServerClient } from '@/lib/supabase'

async function requireAdmin(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  if (!token?.email) return null
  const supabase = createServerClient()
  const { data } = await supabase.from('user_roles').select('role').eq('email', token.email).single()
  if (data?.role !== 'admin') return null
  return token
}

// GET /api/admin/users — list all users
export async function GET(req: NextRequest) {
  const token = await requireAdmin(req)
  if (!token) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('user_roles')
    .select('email, role, created_at')
    .order('created_at', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// POST /api/admin/users — add a user by email
export async function POST(req: NextRequest) {
  const token = await requireAdmin(req)
  if (!token) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { email, role = 'member' } = await req.json()
  if (!email) return NextResponse.json({ error: 'email requerido' }, { status: 400 })

  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('user_roles')
    .upsert({ email, role }, { onConflict: 'email' })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// PATCH /api/admin/users — update role
export async function PATCH(req: NextRequest) {
  const token = await requireAdmin(req)
  if (!token) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { email, role } = await req.json()
  if (!email || !role) return NextResponse.json({ error: 'email y role requeridos' }, { status: 400 })
  if (!['admin', 'member'].includes(role)) return NextResponse.json({ error: 'role inválido' }, { status: 400 })

  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('user_roles')
    .update({ role })
    .eq('email', email)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// DELETE /api/admin/users — remove a user
export async function DELETE(req: NextRequest) {
  const token = await requireAdmin(req)
  if (!token) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { email } = await req.json()
  if (!email) return NextResponse.json({ error: 'email requerido' }, { status: 400 })
  // Prevent self-deletion
  if (email === token.email) return NextResponse.json({ error: 'No puedes eliminarte a ti mismo' }, { status: 400 })

  const supabase = createServerClient()
  const { error } = await supabase.from('user_roles').delete().eq('email', email)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
