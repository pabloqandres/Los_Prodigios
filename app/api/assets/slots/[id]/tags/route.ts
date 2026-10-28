import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { createServerClient } from '@/lib/supabase'

// PATCH /api/assets/slots/[id]/tags
// Body: { semantic_tags: string[], usage_context?: string }
// Updates the semantic metadata on an approved slot.

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id: slotId } = await params
  const { semantic_tags, usage_context } = await req.json()

  if (!Array.isArray(semantic_tags)) {
    return NextResponse.json({ error: 'semantic_tags debe ser un array' }, { status: 400 })
  }

  const supabase = createServerClient()

  const update: Record<string, unknown> = {
    semantic_tags,
    updated_at: new Date().toISOString(),
  }
  if (usage_context !== undefined) update.usage_context = usage_context

  const { data, error } = await supabase
    .from('asset_slots')
    .update(update)
    .eq('id', slotId)
    .select('id, semantic_tags, usage_context')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
