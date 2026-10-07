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

// GET /api/continuity — returns all 6 modules
export async function GET(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('continuity_modules')
    .select('module_key, content, updated_by, updated_at')
    .order('module_key', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// PATCH /api/continuity — updates a single module by module_key
export async function PATCH(req: NextRequest) {
  const token = await requireAdmin(req)
  if (!token) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const body = await req.json()
  const { module_key, content } = body

  if (!module_key || content === undefined) {
    return NextResponse.json({ error: 'module_key y content son requeridos' }, { status: 400 })
  }

  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('continuity_modules')
    .update({
      content,
      updated_by: token.email as string,
      updated_at: new Date().toISOString(),
    })
    .eq('module_key', module_key)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
