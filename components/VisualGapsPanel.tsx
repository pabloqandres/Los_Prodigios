'use client'

import { useState, useEffect, useCallback } from 'react'
import { storageUrl } from '@/lib/supabase'

// ── Types ──────────────────────────────────────────────────────────────────────

type GapStatus = 'pending' | 'linked' | 'created' | 'skipped'

type Gap = {
  id: string
  scene_ref: string
  category: string
  entity_name: string
  entity_label: string
  matrix_key: string
  view_type: string
  outfit: string | null
  age_version: string | null
  reason: string
  status: GapStatus
  suggested_slots: string[]
}

type MatchedSlot = {
  id: string
  entity_name: string
  entity_label: string
  view_type: string
  age_version: string | null
  version_label: string
  approved_drive_file_id: string | null
  semantic_tags: string[]
  usage_count: number
  usages: Array<{
    usage_type: string
    episodes: { season: number; episode_number: number; title: string | null } | null
  }>
  relevance_score?: number
}

type CanonIssue = {
  scene_ref: string
  entity: string
  issue: string
  severity: 'error' | 'warning'
}

type FilterKey = 'all' | 'match' | 'pending' | 'resolved'

// ── Constants ──────────────────────────────────────────────────────────────────

const C = {
  bg:        '#08060F',
  card:      '#0D0920',
  cardHover: '#100C22',
  border:    'rgba(245,165,42,0.08)',
  text:      '#F0EBE1',
  muted:     'rgba(240,235,225,0.35)',
  dim:       'rgba(240,235,225,0.18)',
  accent:    '#DFF818',
  green:     '#88D8B0',
  yellow:    '#FFE66D',
  red:       '#D4256A',
  purple:    '#9B6FD4',
  teal:      '#4ECDC4',
  orange:    '#F5A52A',
}

const LABEL: React.CSSProperties = {
  fontSize: '0.5rem',
  letterSpacing: '0.18em',
  textTransform: 'uppercase',
  fontWeight: 700,
  color: C.dim,
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function episodeCode(u: MatchedSlot['usages'][number]) {
  if (!u.episodes) return '?'
  return `T${u.episodes.season}E${String(u.episodes.episode_number).padStart(2, '0')}`
}

// ── Thumbnail ──────────────────────────────────────────────────────────────────

function Thumb({
  slot,
  selected,
  onClick,
  size = 80,
}: {
  slot: MatchedSlot
  selected?: boolean
  onClick?: () => void
  size?: number
}) {
  const url = storageUrl(slot.approved_drive_file_id)
  const origin = slot.usages.find(u => u.usage_type === 'origin')
  const badge = origin ? episodeCode(origin) : slot.usages[0] ? episodeCode(slot.usages[0]) : null

  return (
    <button
      onClick={onClick}
      style={{
        position: 'relative',
        width: size,
        height: size,
        borderRadius: 4,
        border: selected
          ? `2px solid ${C.accent}`
          : `1px solid ${C.border}`,
        background: '#0A0715',
        cursor: onClick ? 'pointer' : 'default',
        overflow: 'hidden',
        flexShrink: 0,
        transition: 'border-color 0.12s',
        padding: 0,
      }}
    >
      {url ? (
        <img
          src={url}
          alt={slot.version_label}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      ) : (
        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.dim} strokeWidth="1.2">
            <rect x="3" y="3" width="18" height="18" rx="2"/>
            <circle cx="8.5" cy="8.5" r="1.5"/>
            <path d="M21 15l-5-5L5 21"/>
          </svg>
        </div>
      )}

      {/* Selected check */}
      {selected && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(223,248,24,0.12)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="9" fill="rgba(0,0,0,0.6)"/>
            <polyline points="5 10 9 14 15 7" stroke={C.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      )}

      {/* Episode badge */}
      {badge && !selected && (
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          background: 'rgba(0,0,0,0.65)',
          fontSize: '0.45rem',
          letterSpacing: '0.08em',
          color: C.muted,
          textAlign: 'center',
          padding: '2px 0',
          fontFamily: 'IBM Plex Mono, monospace',
        }}>
          {badge}
        </div>
      )}

      {/* Version label */}
      {!selected && !badge && (
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          background: 'rgba(0,0,0,0.6)',
          fontSize: '0.42rem',
          letterSpacing: '0.06em',
          color: C.muted,
          textAlign: 'center',
          padding: '2px 0',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          paddingInline: 3,
        }}>
          {slot.age_version ?? slot.view_type}
        </div>
      )}
    </button>
  )
}

// ── Select Asset Modal ─────────────────────────────────────────────────────────

function SelectAssetModal({
  gap,
  slots,
  onSelect,
  onClose,
}: {
  gap: Gap
  slots: MatchedSlot[]
  onSelect: (slotId: string, note: string) => void
  onClose: () => void
}) {
  const [selected, setSelected] = useState<string | null>(null)
  const [note, setNote] = useState('')

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [onClose])

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(4,3,10,0.88)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        backdropFilter: 'blur(6px)',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#0D0920',
          border: `1px solid rgba(245,165,42,0.15)`,
          borderRadius: 6,
          width: 'min(680px, 92vw)',
          maxHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Modal header */}
        <div style={{
          padding: '1rem 1.25rem',
          borderBottom: `1px solid ${C.border}`,
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: '1rem',
          flexShrink: 0,
        }}>
          <div>
            <div style={{
              fontFamily: 'Bebas Neue, Impact, sans-serif',
              fontSize: '1.25rem',
              letterSpacing: '0.06em',
              color: C.text,
              lineHeight: 1,
              marginBottom: 4,
            }}>
              {gap.entity_label}
            </div>
            <div style={{ fontSize: '0.6875rem', color: C.muted }}>
              {gap.view_type}{gap.age_version ? ` · ${gap.age_version}` : ''}&nbsp;·&nbsp;
              <span style={{ color: C.dim }}>{gap.scene_ref}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: C.muted, cursor: 'pointer', padding: 4, lineHeight: 1, fontSize: '1.1rem' }}
          >
            ✕
          </button>
        </div>

        {/* Slot grid */}
        <div style={{ padding: '1.25rem', overflowY: 'auto', flex: 1 }}>
          <div style={{ ...LABEL, marginBottom: '0.75rem' }}>
            Assets aprobados ({slots.length})
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))',
            gap: 10,
          }}>
            {slots.map(slot => (
              <div key={slot.id} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <Thumb
                  slot={slot}
                  size={110}
                  selected={selected === slot.id}
                  onClick={() => setSelected(s => s === slot.id ? null : slot.id)}
                />
                <div style={{ fontSize: '0.55rem', color: C.muted, textAlign: 'center', lineHeight: 1.3, letterSpacing: '0.04em' }}>
                  {slot.version_label}
                </div>
                {slot.usage_count > 0 && (
                  <div style={{ fontSize: '0.5rem', color: C.teal, textAlign: 'center', letterSpacing: '0.06em' }}>
                    usado {slot.usage_count}×
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Note + confirm */}
        <div style={{
          padding: '1rem 1.25rem',
          borderTop: `1px solid ${C.border}`,
          display: 'flex',
          gap: '0.75rem',
          alignItems: 'flex-end',
          flexShrink: 0,
        }}>
          <input
            type="text"
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="Nota opcional: contexto de uso..."
            style={{
              flex: 1,
              background: '#06040F',
              border: `1px solid ${C.border}`,
              borderRadius: 3,
              color: C.text,
              fontSize: '0.8125rem',
              padding: '8px 12px',
              outline: 'none',
              fontFamily: 'IBM Plex Sans, sans-serif',
            }}
          />
          <button
            disabled={!selected}
            onClick={() => selected && onSelect(selected, note)}
            style={{
              padding: '8px 20px',
              background: selected ? `rgba(223,248,24,0.12)` : 'rgba(255,255,255,0.03)',
              border: `1px solid ${selected ? 'rgba(223,248,24,0.4)' : C.border}`,
              borderRadius: 3,
              color: selected ? C.accent : C.dim,
              fontSize: '0.8125rem',
              fontWeight: 700,
              cursor: selected ? 'pointer' : 'not-allowed',
              fontFamily: 'IBM Plex Sans, sans-serif',
              whiteSpace: 'nowrap',
              transition: 'all 0.12s',
              letterSpacing: '0.05em',
            }}
          >
            Usar este asset
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Gap Card ───────────────────────────────────────────────────────────────────

function GapCard({
  gap,
  matchedSlots,
  onUse,
  onOpenModal,
  onCreateSlot,
  onSkip,
  creating,
}: {
  gap: Gap
  matchedSlots: MatchedSlot[]
  onUse: (slotId: string, note: string) => void
  onOpenModal: () => void
  onCreateSlot: () => void
  onSkip: () => void
  creating: boolean
}) {
  const [selectedThumb, setSelectedThumb] = useState<string | null>(null)
  const hasMatch = matchedSlots.length > 0
  const isResolved = gap.status !== 'pending'
  const MAX_VISIBLE = 3

  const borderColor = isResolved
    ? gap.status === 'linked' ? `rgba(136,216,176,0.4)` : `rgba(255,230,109,0.3)`
    : hasMatch ? `rgba(223,248,24,0.18)` : C.border

  const visibleSlots = matchedSlots.slice(0, MAX_VISIBLE)
  const extraCount = matchedSlots.length - MAX_VISIBLE

  const statusBadge = {
    linked:  { label: 'Vinculado',            color: C.green,  bg: 'rgba(136,216,176,0.12)' },
    created: { label: 'Slot creado',           color: C.yellow, bg: 'rgba(255,230,109,0.1)'  },
    skipped: { label: 'Descartado',            color: C.muted,  bg: 'rgba(240,235,225,0.06)' },
    pending: null,
  }[gap.status]

  return (
    <div style={{
      background: C.card,
      border: `1px solid ${borderColor}`,
      borderRadius: 5,
      overflow: 'hidden',
      opacity: gap.status === 'skipped' ? 0.45 : 1,
      transition: 'border-color 0.15s, opacity 0.15s',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Card top accent line */}
      {hasMatch && !isResolved && (
        <div style={{ height: 2, background: `linear-gradient(90deg, rgba(223,248,24,0.6), transparent)` }} />
      )}

      <div style={{ padding: '0.875rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>

        {/* Scene ref + status */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
          <span style={{ ...LABEL, color: hasMatch && !isResolved ? 'rgba(223,248,24,0.5)' : C.dim }}>
            {gap.scene_ref}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {hasMatch && !isResolved && (
              <span style={{ fontSize: '0.875rem', lineHeight: 1 }}>⚡</span>
            )}
            {statusBadge && (
              <span style={{
                fontSize: '0.5rem', letterSpacing: '0.12em', textTransform: 'uppercase',
                color: statusBadge.color, background: statusBadge.bg,
                borderRadius: 20, padding: '2px 8px', fontWeight: 700,
              }}>
                {statusBadge.label}
              </span>
            )}
          </div>
        </div>

        {/* Entity + view */}
        <div>
          <div style={{
            fontFamily: 'Bebas Neue, Impact, sans-serif',
            fontSize: '1.125rem',
            letterSpacing: '0.05em',
            color: C.text,
            lineHeight: 1.1,
          }}>
            {gap.entity_label}
          </div>
          <div style={{ fontSize: '0.6875rem', color: C.muted, marginTop: 2 }}>
            {gap.view_type}{gap.outfit ? ` · ${gap.outfit}` : ''}{gap.age_version ? ` · ${gap.age_version}` : ''}
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: `rgba(245,165,42,0.06)` }} />

        {/* Suggestion strip */}
        {hasMatch && !isResolved && (
          <div>
            <div style={{ ...LABEL, color: 'rgba(223,248,24,0.55)', marginBottom: '0.5rem' }}>
              ya tenemos {matchedSlots.length} asset{matchedSlots.length > 1 ? 's' : ''}
            </div>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              {visibleSlots.map(slot => (
                <Thumb
                  key={slot.id}
                  slot={slot}
                  size={64}
                  selected={selectedThumb === slot.id}
                  onClick={() => setSelectedThumb(s => s === slot.id ? null : slot.id)}
                />
              ))}
              {extraCount > 0 && (
                <button
                  onClick={onOpenModal}
                  style={{
                    width: 64, height: 64,
                    background: 'rgba(223,248,24,0.06)',
                    border: `1px dashed rgba(223,248,24,0.2)`,
                    borderRadius: 4,
                    color: C.accent,
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 3,
                    fontFamily: 'IBM Plex Sans, sans-serif',
                    letterSpacing: '0.04em',
                    flexShrink: 0,
                  }}
                >
                  +{extraCount}
                  <span style={{ fontSize: '0.45rem', opacity: 0.7 }}>más</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Reason */}
        {gap.reason && (
          <div style={{
            fontSize: '0.6875rem',
            color: C.dim,
            lineHeight: 1.5,
            fontStyle: 'italic',
            flex: 1,
          }}>
            &ldquo;{gap.reason}&rdquo;
          </div>
        )}
      </div>

      {/* Actions */}
      {!isResolved && (
        <div style={{
          padding: '0.625rem 0.875rem',
          borderTop: `1px solid rgba(245,165,42,0.06)`,
          display: 'flex',
          gap: 6,
        }}>
          {hasMatch && (
            <button
              onClick={selectedThumb ? () => onUse(selectedThumb, '') : onOpenModal}
              style={{
                flex: 1,
                padding: '7px 12px',
                background: selectedThumb ? 'rgba(223,248,24,0.12)' : 'rgba(223,248,24,0.07)',
                border: `1px solid ${selectedThumb ? 'rgba(223,248,24,0.45)' : 'rgba(223,248,24,0.2)'}`,
                borderRadius: 3,
                color: C.accent,
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer',
                fontFamily: 'IBM Plex Sans, sans-serif',
                letterSpacing: '0.05em',
                transition: 'all 0.12s',
                whiteSpace: 'nowrap',
              }}
            >
              {selectedThumb ? 'Usar este' : 'Elegir uno'}
            </button>
          )}
          <button
            onClick={onCreateSlot}
            disabled={creating}
            style={{
              flex: hasMatch ? '0 0 auto' : 1,
              padding: '7px 12px',
              background: 'rgba(255,255,255,0.03)',
              border: `1px solid rgba(240,235,225,0.1)`,
              borderRadius: 3,
              color: C.muted,
              fontSize: '0.75rem',
              cursor: creating ? 'not-allowed' : 'pointer',
              fontFamily: 'IBM Plex Sans, sans-serif',
              whiteSpace: 'nowrap',
            }}
          >
            {creating ? '...' : '+ Crear slot'}
          </button>
          <button
            onClick={onSkip}
            style={{
              padding: '7px 10px',
              background: 'none',
              border: 'none',
              color: C.dim,
              fontSize: '0.7rem',
              cursor: 'pointer',
              fontFamily: 'IBM Plex Sans, sans-serif',
            }}
          >
            Saltar
          </button>
        </div>
      )}
    </div>
  )
}

// ── Main Panel ─────────────────────────────────────────────────────────────────

export default function VisualGapsPanel({
  episodeId,
  hasScript,
  episodeLabel,
}: {
  episodeId: string
  hasScript: boolean
  episodeLabel: string
}) {
  const [gaps, setGaps] = useState<Gap[]>([])
  const [slotsMap, setSlotsMap] = useState<Record<string, MatchedSlot[]>>({}) // entity_name → matched slots
  const [canonIssues, setCanonIssues] = useState<CanonIssue[]>([])
  const [summary, setSummary] = useState('')
  const [filter, setFilter] = useState<FilterKey>('all')
  const [analyzing, setAnalyzing] = useState(false)
  const [analyzeProgress, setAnalyzeProgress] = useState(0)
  const [analyzeStep, setAnalyzeStep] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [creatingGap, setCreatingGap] = useState<string | null>(null)
  const [modalGap, setModalGap] = useState<Gap | null>(null)

  // ── Load saved gaps ──────────────────────────────────────────────────────────

  const loadGaps = useCallback(async () => {
    setLoading(true)
    const res = await fetch(`/api/episodes/${episodeId}/analyze-script`)
    if (res.ok) {
      const data = await res.json()
      setGaps(Array.isArray(data) ? data : [])
    }
    setLoading(false)
  }, [episodeId])

  useEffect(() => { loadGaps() }, [loadGaps])

  // ── Load matched slots for each unique entity ────────────────────────────────

  useEffect(() => {
    if (gaps.length === 0) return
    const entities = [...new Set(gaps.map(g => g.entity_name))]
    Promise.all(
      entities.map(name =>
        fetch(`/api/assets/match?entity_name=${encodeURIComponent(name)}`)
          .then(r => r.ok ? r.json() : [])
          .then((slots: MatchedSlot[]) => ({ name, slots }))
      )
    ).then(results => {
      const map: Record<string, MatchedSlot[]> = {}
      for (const { name, slots } of results) map[name] = slots
      setSlotsMap(map)
    })
  }, [gaps])

  // ── Analyze script ───────────────────────────────────────────────────────────

  const progressTimer = { current: null as ReturnType<typeof setInterval> | null }

  async function analyzeScript() {
    if (analyzing || !hasScript) return
    setAnalyzing(true)
    setError('')
    setAnalyzeProgress(0)

    const steps = [
      { pct: 8,  label: 'Leyendo guión...' },
      { pct: 38, label: 'Validando canon...' },
      { pct: 70, label: 'Detectando gaps...' },
      { pct: 92, label: 'Generando reporte...' },
    ]

    let si = 0
    progressTimer.current = setInterval(() => {
      if (si < steps.length) {
        setAnalyzeProgress(steps[si].pct)
        setAnalyzeStep(steps[si].label)
        si++
      }
    }, 4500)

    try {
      const res = await fetch(`/api/episodes/${episodeId}/analyze-script`, { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Error desconocido')

      setCanonIssues(data.canon_issues ?? [])
      setSummary(data.summary ?? '')
      setGaps(data.gaps ?? [])
      setAnalyzeProgress(100)
      setAnalyzeStep('Listo')
      setTimeout(() => setAnalyzing(false), 600)
      await loadGaps() // reload with IDs and suggested_slots
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Error al analizar')
      setAnalyzing(false)
    } finally {
      if (progressTimer.current) clearInterval(progressTimer.current)
    }
  }

  // ── Link slot to episode ─────────────────────────────────────────────────────

  async function handleUse(gap: Gap, slotId: string, note: string) {
    await fetch(`/api/assets/slots/${slotId}/link-episode`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        episode_id: episodeId,
        scene_ref: gap.scene_ref,
        note: note || undefined,
        gap_request_id: gap.id,
      }),
    })
    setGaps(prev => prev.map(g => g.id === gap.id ? { ...g, status: 'linked' } : g))
    setModalGap(null)
  }

  // ── Create slot from gap ─────────────────────────────────────────────────────

  async function handleCreate(gap: Gap) {
    const key = gap.id
    setCreatingGap(key)
    try {
      const res = await fetch('/api/assets/create-entity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          entity_name: gap.entity_name,
          entity_label: gap.entity_label,
          category: gap.category,
          matrix_key: gap.matrix_key,
          required_approvals: 1,
        }),
      })
      if (res.ok && gap.id) {
        await fetch(`/api/episodes/${episodeId}/analyze-script`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ gap_id: gap.id, status: 'created' }),
        })
        setGaps(prev => prev.map(g => g.id === gap.id ? { ...g, status: 'created' } : g))
      }
    } finally {
      setCreatingGap(null)
    }
  }

  // ── Skip gap ─────────────────────────────────────────────────────────────────

  async function handleSkip(gap: Gap) {
    if (gap.id) {
      await fetch(`/api/episodes/${episodeId}/analyze-script`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gap_id: gap.id, status: 'skipped' }),
      })
    }
    setGaps(prev => prev.map(g => g.id === gap.id ? { ...g, status: 'skipped' } : g))
  }

  // ── Filter ────────────────────────────────────────────────────────────────────

  const withMatch = gaps.filter(g => g.status === 'pending' && (slotsMap[g.entity_name] ?? []).length > 0)
  const pending   = gaps.filter(g => g.status === 'pending' && (slotsMap[g.entity_name] ?? []).length === 0)
  const resolved  = gaps.filter(g => g.status !== 'pending')

  const visible = filter === 'all'     ? gaps
    : filter === 'match'   ? withMatch
    : filter === 'pending' ? pending
    : resolved

  const filterTabs: { key: FilterKey; label: string; count: number }[] = [
    { key: 'all',     label: 'Todos',        count: gaps.length },
    { key: 'match',   label: '⚡ Con match', count: withMatch.length },
    { key: 'pending', label: 'Sin match',    count: pending.length },
    { key: 'resolved',label: 'Resueltos',    count: resolved.length },
  ]

  // ── Render ────────────────────────────────────────────────────────────────────

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: '1rem',
        marginBottom: '1.25rem',
        flexWrap: 'wrap',
      }}>
        <div>
          <div style={{
            fontFamily: 'Bebas Neue, Impact, sans-serif',
            fontSize: '1.125rem',
            letterSpacing: '0.12em',
            color: C.text,
            lineHeight: 1,
            marginBottom: 4,
          }}>
            Visual Gaps
          </div>
          <div style={{ fontSize: '0.6875rem', color: C.muted, lineHeight: 1.5, maxWidth: 420 }}>
            Claude analiza el guión, cruza con la biblia y detecta qué assets visuales faltan por crear o reutilizar.
          </div>
        </div>
        <button
          onClick={analyzeScript}
          disabled={analyzing || !hasScript}
          style={{
            padding: '9px 18px',
            background: analyzing ? 'rgba(155,111,212,0.12)' : 'rgba(155,111,212,0.18)',
            border: `1px solid ${analyzing ? 'rgba(155,111,212,0.25)' : 'rgba(155,111,212,0.45)'}`,
            borderRadius: 4,
            color: analyzing ? 'rgba(155,111,212,0.45)' : C.purple,
            fontSize: '0.8125rem',
            fontWeight: 700,
            cursor: analyzing || !hasScript ? 'not-allowed' : 'pointer',
            fontFamily: 'IBM Plex Sans, sans-serif',
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            gap: 7,
            letterSpacing: '0.04em',
          }}
        >
          <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
            <path d="M12 7A5 5 0 1 1 7 2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
            <path d="M7 2l2-2M7 2l2 2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {analyzing ? 'Analizando...' : 'Analizar guión'}
        </button>
      </div>

      {/* Progress */}
      {analyzing && (
        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7 }}>
            <span style={{ fontSize: '0.75rem', color: C.purple, fontWeight: 600 }}>{analyzeStep}</span>
            <span style={{ fontSize: '0.65rem', color: 'rgba(155,111,212,0.5)', fontFamily: 'monospace' }}>{analyzeProgress}%</span>
          </div>
          <div style={{ height: 2, background: 'rgba(155,111,212,0.1)', borderRadius: 2, overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${analyzeProgress}%`,
              background: 'linear-gradient(90deg, #9B6FD4, #4A8FE8)',
              borderRadius: 2,
              transition: 'width 4.5s cubic-bezier(0.4,0,0.2,1)',
              boxShadow: '0 0 8px rgba(155,111,212,0.5)',
            }} />
          </div>
          <div style={{ display: 'flex', gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
            {['Leyendo guión', 'Validando canon', 'Detectando gaps', 'Generando reporte'].map((s, i) => {
              const done = analyzeProgress >= [8,38,70,92][i]
              return (
                <div key={s} style={{
                  display: 'flex', alignItems: 'center', gap: 4,
                  padding: '3px 9px',
                  background: done ? 'rgba(155,111,212,0.1)' : 'rgba(255,255,255,0.02)',
                  border: `1px solid ${done ? 'rgba(155,111,212,0.3)' : 'rgba(255,255,255,0.05)'}`,
                  borderRadius: 20,
                  transition: 'all 0.4s ease',
                }}>
                  {done
                    ? <svg width="9" height="9" viewBox="0 0 10 10" fill="none"><polyline points="1.5 5 4 7.5 8.5 2.5" stroke={C.purple} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    : <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'rgba(255,255,255,0.12)' }} />
                  }
                  <span style={{ fontSize: '0.58rem', color: done ? C.purple : C.dim, letterSpacing: '0.05em' }}>{s}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* No script warning */}
      {!hasScript && (
        <div style={{
          background: 'rgba(245,165,42,0.05)',
          border: `1px solid rgba(245,165,42,0.14)`,
          borderRadius: 4,
          padding: '1rem 1.25rem',
          fontSize: '0.875rem',
          color: C.muted,
          marginBottom: '1.25rem',
        }}>
          El episodio necesita un guión para poder analizarlo. Ve a la pestaña Guión y escribe o pega el texto.
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={{
          background: 'rgba(212,37,106,0.07)',
          border: `1px solid rgba(212,37,106,0.2)`,
          borderRadius: 4,
          padding: '0.875rem 1rem',
          fontSize: '0.875rem',
          color: C.red,
          marginBottom: '1.25rem',
        }}>
          {error}
        </div>
      )}

      {/* Summary */}
      {summary && (
        <div style={{
          background: 'rgba(155,111,212,0.06)',
          border: `1px solid rgba(155,111,212,0.14)`,
          borderRadius: 4,
          padding: '0.875rem 1.125rem',
          fontSize: '0.875rem',
          color: 'rgba(240,235,225,0.65)',
          lineHeight: 1.65,
          marginBottom: '1.25rem',
        }}>
          {summary}
        </div>
      )}

      {/* Canon issues */}
      {canonIssues.length > 0 && (
        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ ...LABEL, marginBottom: '0.625rem' }}>
            Issues de canon ({canonIssues.length})
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            {canonIssues.map((issue, i) => (
              <div key={i} style={{
                background: issue.severity === 'error' ? 'rgba(212,37,106,0.06)' : 'rgba(245,165,42,0.05)',
                border: `1px solid ${issue.severity === 'error' ? 'rgba(212,37,106,0.18)' : 'rgba(245,165,42,0.14)'}`,
                borderLeft: `3px solid ${issue.severity === 'error' ? C.red : C.orange}`,
                borderRadius: 3,
                padding: '0.875rem 1rem',
                display: 'flex',
                gap: '0.75rem',
                alignItems: 'flex-start',
              }}>
                <div style={{ flexShrink: 0 }}>
                  <span style={{
                    fontSize: '0.52rem', letterSpacing: '0.12em', textTransform: 'uppercase',
                    color: issue.severity === 'error' ? C.red : C.orange,
                    background: issue.severity === 'error' ? 'rgba(212,37,106,0.15)' : 'rgba(245,165,42,0.15)',
                    borderRadius: 20, padding: '2px 8px', fontWeight: 700,
                  }}>{issue.severity}</span>
                  <div style={{ fontSize: '0.58rem', color: C.dim, marginTop: 4 }}>{issue.scene_ref}</div>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '0.875rem', color: C.text, fontWeight: 700, marginBottom: 3 }}>{issue.entity}</div>
                  <div style={{ fontSize: '0.8125rem', color: C.muted, lineHeight: 1.6 }}>{issue.issue}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Gaps section */}
      {(gaps.length > 0 || loading) && (
        <>
          {/* Filter bar */}
          <div style={{
            display: 'flex',
            gap: 3,
            marginBottom: '1rem',
            background: 'rgba(255,255,255,0.025)',
            borderRadius: 4,
            padding: 3,
            alignSelf: 'flex-start',
          }}>
            {filterTabs.map(ft => {
              const active = filter === ft.key
              return (
                <button
                  key={ft.key}
                  onClick={() => setFilter(ft.key)}
                  style={{
                    padding: '5px 12px',
                    background: active ? 'rgba(255,255,255,0.07)' : 'transparent',
                    border: active ? `1px solid rgba(255,255,255,0.1)` : '1px solid transparent',
                    borderRadius: 3,
                    color: active ? C.text : C.dim,
                    fontSize: '0.7rem',
                    cursor: 'pointer',
                    fontFamily: 'IBM Plex Sans, sans-serif',
                    transition: 'all 0.12s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {ft.label}
                  <span style={{
                    fontSize: '0.6rem',
                    background: active
                      ? ft.key === 'match' ? 'rgba(223,248,24,0.2)' : 'rgba(255,255,255,0.1)'
                      : 'rgba(255,255,255,0.05)',
                    color: active && ft.key === 'match' ? C.accent : active ? C.muted : C.dim,
                    borderRadius: 20,
                    padding: '1px 7px',
                    fontWeight: 700,
                  }}>
                    {ft.count}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Grid */}
          {loading ? (
            <div style={{ color: C.dim, fontSize: '0.8125rem', padding: '2rem 0' }}>
              Cargando gaps...
            </div>
          ) : visible.length === 0 ? (
            <div style={{
              padding: '2.5rem',
              textAlign: 'center',
              color: C.dim,
              fontSize: '0.8125rem',
              border: `1px dashed rgba(240,235,225,0.06)`,
              borderRadius: 5,
            }}>
              {filter === 'all' ? 'Sin gaps detectados — el guión está cubierto.' : 'No hay gaps en esta categoría.'}
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: 10,
            }}>
              {visible.map(gap => (
                <GapCard
                  key={gap.id || `${gap.entity_name}-${gap.view_type}`}
                  gap={gap}
                  matchedSlots={slotsMap[gap.entity_name] ?? []}
                  onUse={(slotId, note) => handleUse(gap, slotId, note)}
                  onOpenModal={() => setModalGap(gap)}
                  onCreateSlot={() => handleCreate(gap)}
                  onSkip={() => handleSkip(gap)}
                  creating={creatingGap === gap.id}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* Empty state: no analysis yet */}
      {!loading && gaps.length === 0 && !analyzing && !error && hasScript && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '3rem 2rem',
          gap: '1rem',
          border: `1px dashed rgba(155,111,212,0.15)`,
          borderRadius: 5,
          textAlign: 'center',
        }}>
          <div style={{ color: C.dim, fontSize: '0.875rem' }}>
            Sin análisis previo — presiona <strong style={{ color: C.muted }}>Analizar guión</strong> para detectar las necesidades visuales del episodio.
          </div>
        </div>
      )}

      {/* Modal */}
      {modalGap && (
        <SelectAssetModal
          gap={modalGap}
          slots={slotsMap[modalGap.entity_name] ?? []}
          onSelect={(slotId, note) => handleUse(modalGap, slotId, note)}
          onClose={() => setModalGap(null)}
        />
      )}
    </div>
  )
}
