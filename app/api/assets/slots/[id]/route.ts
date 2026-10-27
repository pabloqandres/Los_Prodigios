import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { createServerClient } from '@/lib/supabase'

// GET /api/assets/slots/[id] — fetch a single slot with approvals
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from('asset_slots')
    .select('*, asset_approvals(*)')
    .eq('id', id)
    .single()

  if (error || !data) return NextResponse.json({ error: 'Slot no encontrado' }, { status: 404 })
  return NextResponse.json(data)
}
