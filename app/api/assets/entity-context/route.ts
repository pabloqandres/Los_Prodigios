import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { createServerClient } from '@/lib/supabase'
import { assembleEntityContext } from '@/lib/doc-context'

export const runtime = 'nodejs'

/**
 * GET /api/assets/entity-context
 *   ?entity_name=MateoGonzalez
 *   &entity_label=Mateo+González
 *   &outfit=Casual          (optional)
 *
 * Returns assembled multi-doc context from the Bible for a given entity.
 * Used by validate-canon and generate-prompts to inject rich context into AI calls.
 */
export async function GET(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const sp           = request.nextUrl.searchParams
  const entity_name  = sp.get('entity_name') ?? ''
  const entity_label = sp.get('entity_label') ?? ''
  const outfit       = sp.get('outfit') ?? null

  if (!entity_name && !entity_label) {
    return NextResponse.json({ error: 'entity_name or entity_label required' }, { status: 400 })
  }

  const supabase = createServerClient()
  const context  = await assembleEntityContext(supabase, entity_name, entity_label, outfit)

  return NextResponse.json(context)
}
