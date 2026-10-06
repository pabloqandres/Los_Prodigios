import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

// GET /api/invitations/[token] — public, returns nombre/rol for display
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('invitations')
    .select('nombre, rol, used_at')
    .eq('token', token)
    .single()

  if (error || !data) {
    return NextResponse.json({ error: 'Invitación no encontrada' }, { status: 404 })
  }
  if (data.used_at) {
    return NextResponse.json({ error: 'Esta invitación ya fue utilizada' }, { status: 410 })
  }

  return NextResponse.json({ nombre: data.nombre, rol: data.rol })
}
