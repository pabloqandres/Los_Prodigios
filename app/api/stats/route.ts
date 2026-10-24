import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { createServerClient } from '@/lib/supabase'

export const runtime = 'nodejs'

// GET /api/stats → production summary counts
export async function GET(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createServerClient()

  const [{ count: totalEpisodes }, { count: analyzedEpisodes }] = await Promise.all([
    supabase.from('episodes').select('*', { count: 'exact', head: true }),
    supabase.from('script_analyses').select('*', { count: 'exact', head: true }).eq('is_current', true),
  ])

  return NextResponse.json({
    total_episodes: totalEpisodes ?? 0,
    analyzed_episodes: analyzedEpisodes ?? 0,
  })
}
