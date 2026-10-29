import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { createServerClient } from '@/lib/supabase'

const ACTION_META: Record<string, { type: string; accent: string; href: string }> = {
  'doc.upload':        { type: 'Biblia',      accent: '#4A8FE8', href: '/bible' },
  'doc.delete':        { type: 'Biblia',      accent: '#D4256A', href: '/bible' },
  'doc.edit':          { type: 'Biblia',      accent: '#4A8FE8', href: '/bible' },
  'asset.upload':      { type: 'Asset',       accent: '#9B6FD4', href: '/approval' },
  'asset.approve':     { type: 'Aprobación',  accent: '#4ECDC4', href: '/approval' },
  'asset.reject':      { type: 'Aprobación',  accent: '#D4256A', href: '/approval' },
  'asset.delete':      { type: 'Asset',       accent: '#D4256A', href: '/approval' },
  'asset.bulk_approve':{ type: 'Aprobación',  accent: '#4ECDC4', href: '/approval' },
  'entity.create':     { type: 'Entidad',     accent: '#F5A52A', href: '/approval' },
  'entity.delete':     { type: 'Entidad',     accent: '#D4256A', href: '/approval' },
  'episode.create':    { type: 'Episodio',    accent: '#D4256A', href: '/episodes' },
  'episode.edit':      { type: 'Episodio',    accent: '#D4256A', href: '/episodes' },
  'artwork.create':    { type: 'Arte',        accent: '#F5A52A', href: '/artwork' },
  'artwork.edit':      { type: 'Arte',        accent: '#F5A52A', href: '/artwork' },
}

const ACTION_VERB: Record<string, string> = {
  'doc.upload':        'Biblia subida',
  'doc.delete':        'Biblia eliminada',
  'doc.edit':          'Biblia editada',
  'asset.upload':      'Imagen subida',
  'asset.approve':     'Asset aprobado',
  'asset.reject':      'Asset rechazado',
  'asset.delete':      'Slot eliminado',
  'asset.bulk_approve':'Aprobación masiva',
  'entity.create':     'Entidad creada',
  'entity.delete':     'Entidad eliminada',
  'episode.create':    'Episodio creado',
  'episode.edit':      'Episodio editado',
  'artwork.create':    'Flow de arte creado',
  'artwork.edit':      'Flow de arte editado',
}

export async function GET(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
  if (!token || !token.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createServerClient()
  const limit = parseInt(request.nextUrl.searchParams.get('limit') ?? '10')
  const offset = parseInt(request.nextUrl.searchParams.get('offset') ?? '0')
  const month = request.nextUrl.searchParams.get('month') // 'current' | 'YYYY-MM' | null

  // ?months=1 → return list of distinct archived months
  if (request.nextUrl.searchParams.get('months') === '1') {
    const { data, error } = await supabase
      .from('activity_log')
      .select('archive_month')
      .not('archive_month', 'is', null)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    const months = [...new Set((data ?? []).map((r: { archive_month: string }) => r.archive_month))].sort().reverse()
    return NextResponse.json(months)
  }

  let q = supabase
    .from('activity_log')
    .select('*')
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (!month || month === 'current') {
    // Current month: rows not yet archived
    q = q.is('archive_month', null)
  } else {
    // Specific archived month
    q = q.eq('archive_month', month)
  }

  const { data, error } = await q

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const items = (data ?? []).map((row: {
    id: string
    action: string
    entity_label: string
    detail: string | null
    user_email: string
    created_at: string
  }) => {
    const meta = ACTION_META[row.action] ?? { type: row.action, accent: '#9B6FD4', href: '/' }
    return {
      id: row.id,
      type: meta.type,
      title: row.entity_label,
      subtitle: row.detail ?? ACTION_VERB[row.action] ?? row.action,
      user: row.user_email,
      ts: row.created_at,
      accent: meta.accent,
      href: meta.href,
    }
  })

  return NextResponse.json(items)
}
