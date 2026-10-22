import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { createServerClient } from '@/lib/supabase'

export const runtime = 'nodejs'

const VALID_STATUSES = ['pending', 'in_review', 'implemented', 'verified', 'discarded']

export async function PATCH(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
  if (!token?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const id = request.nextUrl.searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'id requerido' }, { status: 400 })

  const body = await request.json()
  const { status, discarded_reason } = body

  if (!status) return NextResponse.json({ error: 'status requerido' }, { status: 400 })

  if (!VALID_STATUSES.includes(status)) {
    return NextResponse.json(
      { error: `status inválido. Valores permitidos: ${VALID_STATUSES.join(', ')}` },
      { status: 400 }
    )
  }

  const supabase = createServerClient()

  const patch: Record<string, unknown> = {
    status,
    updated_at: new Date().toISOString(),
  }

  if (discarded_reason !== undefined) {
    patch.discarded_reason = discarded_reason
  }

  const { data, error } = await supabase
    .from('script_findings')
    .update(patch)
    .eq('id', id)
    .select('*')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json(data)
}
