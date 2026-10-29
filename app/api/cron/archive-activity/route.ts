import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export const runtime = 'nodejs'

// POST /api/cron/archive-activity
// Called by Vercel cron on the 1st of each month at 02:00 UTC.
// Stamps archive_month = 'YYYY-MM' on all rows from previous months.
export async function POST(req: NextRequest) {
  // Verify Vercel cron secret
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createServerClient()

  // Archive all rows older than the current month that aren't archived yet
  const startOfCurrentMonth = new Date()
  startOfCurrentMonth.setUTCDate(1)
  startOfCurrentMonth.setUTCHours(0, 0, 0, 0)

  const { data, error } = await supabase.rpc('archive_activity_log', {
    cutoff: startOfCurrentMonth.toISOString(),
  })

  if (error) {
    console.error('archive_activity_log error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true, archived: data ?? 0 })
}

// GET — for manual trigger from admin UI
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return POST(req)
}
