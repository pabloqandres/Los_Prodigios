import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { createServerClient } from '@/lib/supabase'

const VALID_MODULE_KEYS = [
  'canon_log',
  'timeline',
  'open_issues',
  'character_states',
  'location_states',
  'prop_states',
] as const

type ModuleKey = typeof VALID_MODULE_KEYS[number]

async function requireAdmin(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  if (!token?.email) return null
  const supabase = createServerClient()
  const { data } = await supabase.from('user_roles').select('role').eq('email', token.email).single()
  if (data?.role !== 'admin') return null
  return token
}

// POST /api/continuity/seed — upserts the 6 modules into supabase
export async function POST(req: NextRequest) {
  const token = await requireAdmin(req)
  if (!token) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const body = await req.json()
  const { modules } = body as { modules: { module_key: string; content: string }[] }

  if (!Array.isArray(modules) || modules.length === 0) {
    return NextResponse.json({ error: 'modules array requerido' }, { status: 400 })
  }

  // Validate all keys
  const invalidKeys = modules
    .map((m) => m.module_key)
    .filter((k) => !(VALID_MODULE_KEYS as readonly string[]).includes(k))

  if (invalidKeys.length > 0) {
    return NextResponse.json(
      { error: `module_key(s) inválidos: ${invalidKeys.join(', ')}` },
      { status: 400 }
    )
  }

  const supabase = createServerClient()
  const rows = modules.map((m) => ({
    module_key: m.module_key as ModuleKey,
    content: m.content,
    updated_by: token.email as string,
    updated_at: new Date().toISOString(),
  }))

  const { data, error } = await supabase
    .from('continuity_modules')
    .upsert(rows, { onConflict: 'module_key' })
    .select()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ seeded: data?.length ?? 0, data }, { status: 200 })
}
