import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { createServerClient } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
  if (!token || !token.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createServerClient()

  // Verify admin role
  const { data: roleData } = await supabase
    .from('user_roles')
    .select('role')
    .eq('email', token.email)
    .single()

  if (!roleData || roleData.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden: admin only' }, { status: 403 })
  }

  const { doc_id, doc_title, change_summary, old_content_snippet } = await request.json()

  if (!doc_title || !change_summary) {
    return NextResponse.json({ error: 'doc_title y change_summary son requeridos' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('canon_log')
    .insert({
      doc_id: doc_id ?? null,
      doc_title,
      change_summary,
      changed_by: token.email as string,
      old_content_snippet: old_content_snippet ?? null,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}

export async function GET(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('canon_log')
    .select('*')
    .order('changed_at', { ascending: false })
    .limit(50)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
