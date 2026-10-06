import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { createServerClient } from '@/lib/supabase'

// GET /api/assets/slots?category=&status=&entity_name=
export async function GET(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createServerClient()
  const { searchParams } = req.nextUrl
  const category    = searchParams.get('category')
  const status      = searchParams.get('status')
  const entity_name = searchParams.get('entity_name')

  let query = supabase
    .from('asset_slots')
    .select('*, asset_approvals(*)')
    .order('category')
    .order('entity_name')
    .order('view_type')

  if (category)    query = query.eq('category', category)
  if (status)      query = query.eq('status', status)
  if (entity_name) query = query.eq('entity_name', entity_name)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json(data)
}

// POST /api/assets/slots — crear slot manualmente
export async function POST(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createServerClient()
  const body = await req.json()

  const { data, error } = await supabase
    .from('asset_slots')
    .insert({
      ...body,
      created_by: token.email ?? 'system',
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
