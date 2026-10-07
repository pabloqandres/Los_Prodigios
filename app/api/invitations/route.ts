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

// POST /api/invitations — create a new invitation (admin only)
export async function POST(req: NextRequest) {
  const adminToken = await requireAdmin(req)
  if (!adminToken) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { email, nombre, rol = '', role = 'member' } = await req.json()
  if (!email || !nombre) {
    return NextResponse.json({ error: 'email y nombre son requeridos' }, { status: 400 })
  }
  if (!['admin', 'member'].includes(role)) {
    return NextResponse.json({ error: 'role inválido' }, { status: 400 })
  }

  const token = crypto.randomUUID()
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('invitations')
    .insert({ token, email: email.toLowerCase().trim(), nombre, rol, role, created_by: adminToken.email! })
    .select('token')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ token: data.token })
}

// GET /api/invitations — list all invitations (admin only)
export async function GET(req: NextRequest) {
  const adminToken = await requireAdmin(req)
  if (!adminToken) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('invitations')
    .select('id, email, nombre, rol, role, used_at, created_at, created_by')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
