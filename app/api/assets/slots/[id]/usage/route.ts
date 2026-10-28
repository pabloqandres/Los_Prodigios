import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { createServerClient } from '@/lib/supabase'

// GET /api/assets/slots/[id]/usage
// Returns all episode usages for a given asset slot (the Maestro view).

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id: slotId } = await params
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from('asset_episode_usage')
    .select(`
      id,
      usage_type,
      scene_ref,
      note,
      created_at,
      episodes (
        id,
        season,
        episode_number,
        title,
        status
      )
    `)
    .eq('slot_id', slotId)
    .order('created_at')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json(data ?? [])
}
