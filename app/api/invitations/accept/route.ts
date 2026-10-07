import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { createServerClient } from '@/lib/supabase'

// POST /api/invitations/accept — authenticated, verifies email match + adds to user_roles
export async function POST(req: NextRequest) {
  const authToken = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  if (!authToken?.email) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  }

  const { token } = await req.json()
  if (!token) return NextResponse.json({ error: 'token requerido' }, { status: 400 })

  const supabase = createServerClient()

  const { data: inv, error } = await supabase
    .from('invitations')
    .select('*')
    .eq('token', token)
    .single()

  if (error || !inv) {
    return NextResponse.json({ error: 'Invitación no encontrada' }, { status: 404 })
  }
  if (inv.used_at) {
    return NextResponse.json({ error: 'Esta invitación ya fue utilizada' }, { status: 410 })
  }
  if (inv.email.toLowerCase() !== authToken.email.toLowerCase()) {
    return NextResponse.json(
      { error: `Esta invitación es para ${inv.email}, no para ${authToken.email}` },
      { status: 403 }
    )
  }

  // Add to user_roles
  const { error: upsertError } = await supabase
    .from('user_roles')
    .upsert({ email: authToken.email.toLowerCase(), role: inv.role }, { onConflict: 'email' })

  if (upsertError) {
    return NextResponse.json({ error: upsertError.message }, { status: 500 })
  }

  // Mark invitation as used
  await supabase
    .from('invitations')
    .update({ used_at: new Date().toISOString() })
    .eq('token', token)

  return NextResponse.json({ ok: true })
}
