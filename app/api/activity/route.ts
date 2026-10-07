import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { createServerClient } from '@/lib/supabase'

type ActivityItem = {
  id: string
  type: string
  title: string
  subtitle: string
  user: string
  ts: string
  accent: string
  href: string
}

export async function GET(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
  if (!token || !token.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createServerClient()

  const { data: roleData } = await supabase
    .from('user_roles')
    .select('role')
    .eq('email', token.email as string)
    .single()
  const isAdmin = roleData?.role === 'admin'

  const results = await Promise.allSettled([
    // Artwork flows
    isAdmin
      ? supabase.from('artwork_flows').select('id, title, created_by, updated_at').order('updated_at', { ascending: false }).limit(8)
      : supabase.from('artwork_flows').select('id, title, created_by, updated_at').eq('created_by', token.email as string).order('updated_at', { ascending: false }).limit(8),
    // Biblia / reference docs
    supabase.from('reference_docs').select('id, title, categories, created_by, created_at').order('created_at', { ascending: false }).limit(6),
    // Approval slots (in_review + approved)
    supabase.from('asset_slots').select('id, entity_label, version_label, status, updated_at').in('status', ['in_review', 'approved']).order('updated_at', { ascending: false }).limit(10),
    // Episodes
    supabase.from('episodes').select('id, season, episode_number, title, status, created_by, updated_at').order('updated_at', { ascending: false }).limit(8),
    // Canon log entries
    supabase.from('canon_log').select('id, doc_title, change_summary, created_by, created_at').order('created_at', { ascending: false }).limit(6),
  ])

  const items: ActivityItem[] = []

  // Artwork flows
  const r0 = results[0]
  if (r0.status === 'fulfilled' && r0.value.data) {
    for (const f of r0.value.data) {
      items.push({
        id: `flow-${f.id}`,
        type: 'Arte',
        title: f.title,
        subtitle: 'Flow de generación',
        user: f.created_by ?? '',
        ts: f.updated_at,
        accent: '#F5A52A',
        href: '/artwork',
      })
    }
  }

  // Reference docs
  const r1 = results[1]
  if (r1.status === 'fulfilled' && r1.value.data) {
    for (const d of r1.value.data) {
      items.push({
        id: `doc-${d.id}`,
        type: 'Biblia',
        title: d.title,
        subtitle: d.categories?.join(', ') || 'Documento canónico',
        user: d.created_by ?? '',
        ts: d.created_at,
        accent: '#4A8FE8',
        href: '/bible',
      })
    }
  }

  // Approval slots
  const r2 = results[2]
  if (r2.status === 'fulfilled' && r2.value.data) {
    const STATUS_LABEL: Record<string, string> = { in_review: 'En revisión', approved: 'Aprobado' }
    for (const s of r2.value.data) {
      items.push({
        id: `slot-${s.id}`,
        type: 'Aprobación',
        title: `${s.entity_label} — ${s.version_label}`,
        subtitle: STATUS_LABEL[s.status] ?? s.status,
        user: '',
        ts: s.updated_at,
        accent: s.status === 'approved' ? '#4ECDC4' : '#9B6FD4',
        href: '/approval',
      })
    }
  }

  // Episodes
  const r3 = results[3]
  if (r3.status === 'fulfilled' && r3.value.data) {
    const EP_STATUS: Record<string, string> = {
      draft: 'Borrador',
      in_progress: 'En progreso',
      completed: 'Completado',
    }
    for (const e of r3.value.data) {
      const epLabel = e.title
        ? `T${e.season}E${e.episode_number} — ${e.title}`
        : `T${e.season}E${e.episode_number}`
      items.push({
        id: `ep-${e.id}`,
        type: 'Episodio',
        title: epLabel,
        subtitle: EP_STATUS[e.status] ?? e.status ?? 'Actualizado',
        user: e.created_by ?? '',
        ts: e.updated_at,
        accent: '#D4256A',
        href: `/episodes/${e.id}`,
      })
    }
  }

  // Canon log
  const r4 = results[4]
  if (r4.status === 'fulfilled' && r4.value.data) {
    for (const c of r4.value.data) {
      items.push({
        id: `canon-${c.id}`,
        type: 'Canon',
        title: c.doc_title,
        subtitle: c.change_summary ?? 'Cambio registrado',
        user: c.created_by ?? '',
        ts: c.created_at,
        accent: '#4ECDC4',
        href: '/bible',
      })
    }
  }

  items.sort((a, b) => new Date(b.ts).getTime() - new Date(a.ts).getTime())
  return NextResponse.json(items.slice(0, 15))
}
