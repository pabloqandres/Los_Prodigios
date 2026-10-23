import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { createServerClient } from '@/lib/supabase'

export const runtime = 'nodejs'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
  if (!token?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id: episodeId } = await params
  const supabase = createServerClient()

  // Fetch current analysis
  const { data: analysis, error: analysisError } = await supabase
    .from('script_analyses')
    .select('*')
    .eq('episode_id', episodeId)
    .eq('is_current', true)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (analysisError || !analysis) {
    return NextResponse.json({ analysis: null })
  }

  // Fetch all findings for this analysis
  const { data: findings, error: findingsError } = await supabase
    .from('script_findings')
    .select('*')
    .eq('analysis_id', analysis.id)
    .order('category')
    .order('order_index')

  if (findingsError) {
    return NextResponse.json({ error: findingsError.message }, { status: 500 })
  }

  const allFindings = findings ?? []

  // Group findings by category
  const findingsByCategory: Record<string, typeof allFindings> = {}
  for (const finding of allFindings) {
    if (!findingsByCategory[finding.category]) {
      findingsByCategory[finding.category] = []
    }
    findingsByCategory[finding.category].push(finding)
  }

  // Parse scores_snapshot (jsonb)
  const scoresSnapshot = Array.isArray(analysis.scores_snapshot)
    ? analysis.scores_snapshot
    : []

  // Inject findings into each category
  const categoriesWithFindings = scoresSnapshot.map((cat: { key: string; [key: string]: unknown }) => ({
    ...cat,
    findings: findingsByCategory[cat.key] ?? [],
  }))

  const pendingCount = allFindings.filter(f => f.status === 'pending').length

  return NextResponse.json({
    analysis: {
      id: analysis.id,
      overall_score: analysis.overall_score,
      verdict: analysis.verdict,
      is_current: analysis.is_current,
      created_at: analysis.created_at,
      script_version_id: analysis.script_version_id,
      categories: categoriesWithFindings,
      findings_count: allFindings.length,
      pending_count: pendingCount,
      structure: analysis.structure_data ?? null,
      canon_issues: Array.isArray(analysis.canon_issues) ? analysis.canon_issues : [],
    },
  })
}
