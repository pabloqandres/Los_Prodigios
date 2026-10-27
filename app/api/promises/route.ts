import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { createServerClient } from '@/lib/supabase'

export const runtime = 'nodejs'

// Urgency order for sorting
const URGENCY_ORDER: Record<string, number> = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
}

export async function GET(request: NextRequest) {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
    if (!token?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = createServerClient()

    const { data, error } = await supabase
      .from('narrative_promises')
      .select('*')
      .order('created_at', { ascending: true })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Sort by urgency (critical first), then created_at
    const sorted = (data ?? []).sort((a, b) => {
      const uA = URGENCY_ORDER[a.urgency] ?? 99
      const uB = URGENCY_ORDER[b.urgency] ?? 99
      if (uA !== uB) return uA - uB
      return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    })

    return NextResponse.json(sorted)
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
    if (!token?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { id, status, resolution, resolved_in_episode } = body

    if (!id || !status) {
      return NextResponse.json({ error: 'id and status are required' }, { status: 400 })
    }

    const supabase = createServerClient()

    const update: Record<string, unknown> = {
      status,
      updated_at: new Date().toISOString(),
    }
    if (resolution !== undefined) update.resolution = resolution
    if (resolved_in_episode !== undefined) update.resolved_in_episode = resolved_in_episode

    const { data, error } = await supabase
      .from('narrative_promises')
      .update(update)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Internal server error' },
      { status: 500 }
    )
  }
}
