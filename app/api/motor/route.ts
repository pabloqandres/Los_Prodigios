import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { createServerClient } from '@/lib/supabase'

export const runtime = 'nodejs'

// GET /api/motor?season=1  → episodios con sus análisis actuales
export async function GET(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createServerClient()
  const season = Number(request.nextUrl.searchParams.get('season') ?? '1')

  const { data: episodes, error: epErr } = await supabase
    .from('episodes')
    .select('id, season, episode_number, title, status')
    .eq('season', season)
    .order('episode_number')

  if (epErr || !episodes) {
    return NextResponse.json({ error: epErr?.message ?? 'Error fetching episodes' }, { status: 500 })
  }

  if (episodes.length === 0) {
    return NextResponse.json([])
  }

  const epIds = episodes.map(e => e.id)

  const { data: analyses } = await supabase
    .from('script_analyses')
    .select('episode_id, overall_score, scores_snapshot')
    .in('episode_id', epIds)
    .eq('is_current', true)

  const analysisMap = new Map(
    (analyses ?? []).map(a => [a.episode_id, a])
  )

  const result = episodes.map(ep => {
    const a = analysisMap.get(ep.id)
    return {
      ...ep,
      overall_score: a?.overall_score ?? null,
      scores_snapshot: a?.scores_snapshot ?? null,
    }
  })

  return NextResponse.json(result)
}
