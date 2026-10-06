'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { storageUrl } from '@/lib/supabase'
import ApprovalStats from '@/components/approval/ApprovalStats'
import EntitySheet from '@/components/approval/EntitySheet'
import type { AssetSlotWithApprovals } from '@/lib/supabase'
import { SLOT_MATRIX, CATEGORY_LABELS, CATEGORY_ORDER } from '@/lib/approval-config'

// ── Category visual config ─────────────────────────────────────────────────────
const CATEGORY_STYLE: Record<string, { color: string; accent: string; icon: string }> = {
  personajes:  { color: '#4A8FE8', accent: '#1a2a4a', icon: '◈' },
  locaciones:  { color: '#4ECDC4', accent: '#0d2a28', icon: '⬡' },
  props:       { color: '#F5A52A', accent: '#2a1e00', icon: '◇' },
  criaturas:   { color: '#D4256A', accent: '#2a0a18', icon: '◉' },
  secundarios: { color: '#9B6FD4', accent: '#1a0f2a', icon: '◎' },
  mascotas:    { color: '#8BC34A', accent: '#182400', icon: '◈' },
  simbolos:    { color: '#E8C94A', accent: '#2a2000', icon: '◆' },
  rivales:     { color: '#D4256A', accent: '#2a0818', icon: '⬡' },
  hawks:       { color: '#E05A00', accent: '#2a1200', icon: '⬡' },
}

// ── Entity mini card ───────────────────────────────────────────────────────────
function EntityCard({
  entity, category, slots, onClick,
}: {
  entity: { entity_name: string; entity_label: string }
  category: string
  slots: AssetSlotWithApprovals[]
  onClick: () => void
}) {
  const approved = slots.filter(s => s.status === 'approved').length
  const total    = slots.length
  const pct      = total > 0 ? Math.round((approved / total) * 100) : 0
  const style    = CATEGORY_STYLE[category] ?? CATEGORY_STYLE.personajes
  const complete = approved === total && total > 0

  const portrait = (() => {
    // isHero: Vista general · Frente (approved or pending)
    const isHero = (s: { view_type: string; age_version: string | null }) =>
      s.view_type === 'Vista general' && (s.age_version === 'Frente' || s.age_version === 'v1' || !s.age_version)
    // isGeneral: any Vista general (excludes accessories, acciones, etc.)
    const isGeneral = (s: { view_type: string }) => s.view_type === 'Vista general'

    const approvedHero = slots.find(s => isHero(s) && s.status === 'approved' && s.approved_drive_file_id)
    if (approvedHero) return storageUrl(approvedHero.approved_drive_file_id)

    const pendingHero = slots.find(s => isHero(s) && s.pending_drive_file_id)
    if (pendingHero) return storageUrl(pendingHero.pending_drive_file_id)

    const anyApprovedGeneral = slots.find(s => isGeneral(s) && s.status === 'approved' && s.approved_drive_file_id)
    if (anyApprovedGeneral) return storageUrl(anyApprovedGeneral.approved_drive_file_id)

    const anyApproved = slots.find(s => s.status === 'approved' && s.approved_drive_file_id)
    if (anyApproved) return storageUrl(anyApproved.approved_drive_file_id)

    // Fallback: any pending image (covers simbolos and non-standard view types)
    const anyPending = slots.find(s => s.pending_drive_file_id)
    if (anyPending) return storageUrl(anyPending.pending_drive_file_id)

    return null
  })()

  return (
    <div
      onClick={onClick}
      style={{
        background: '#0D0920',
        border: `1px solid ${complete ? style.color + '55' : 'rgba(255,255,255,0.07)'}`,
        borderRadius: '8px', overflow: 'hidden',
        cursor: 'pointer',
        transition: 'all 0.18s ease',
        display: 'flex', flexDirection: 'column',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = style.color + '66'
        e.currentTarget.style.transform = 'translateY(-2px)'
        e.currentTarget.style.boxShadow = `0 8px 24px rgba(0,0,0,0.4), 0 0 0 1px ${style.color}22`
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = complete ? style.color + '55' : 'rgba(255,255,255,0.07)'
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      {/* Photo */}
      <div style={{
        height: 160, background: `linear-gradient(135deg, ${style.accent}, #06040F)`,
        position: 'relative', overflow: 'hidden', flexShrink: 0,
      }}>
        {portrait ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={portrait} alt={entity.entity_label} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontFamily: 'Bebas Neue, Impact, sans-serif', fontSize: '4rem', color: `${style.color}18`, letterSpacing: '0.05em' }}>
              {entity.entity_label.charAt(0)}
            </span>
          </div>
        )}
        {/* Complete badge */}
        {complete && (
          <div style={{
            position: 'absolute', top: 8, right: 8,
            background: style.color, borderRadius: '50%',
            width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: `0 0 12px ${style.color}88`,
          }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#08060F" strokeWidth="3" strokeLinecap="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
        )}
      </div>

      {/* Info */}
      <div style={{ padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ fontFamily: 'Bebas Neue, Impact, sans-serif', fontSize: '1rem', letterSpacing: '0.04em', color: '#F0EBE1', lineHeight: 1.1 }}>
          {entity.entity_label}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ flex: 1, height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${pct}%`, background: complete ? style.color : `linear-gradient(90deg,${style.color}88,${style.color})`, borderRadius: 2, transition: 'width 0.4s' }} />
          </div>
          <span style={{ fontSize: '0.5625rem', color: complete ? style.color : 'rgba(240,235,225,0.3)', fontWeight: 600, minWidth: 28, textAlign: 'right' }}>
            {pct}%
          </span>
        </div>
        <div style={{ fontSize: '0.5625rem', color: 'rgba(240,235,225,0.25)', letterSpacing: '0.06em' }}>
          {approved}/{total} vistas
        </div>
      </div>
    </div>
  )
}

// ── New entity modal ───────────────────────────────────────────────────────────
function NewEntityModal({
  category, onClose, onCreated,
}: {
  category: string
  onClose: () => void
  onCreated: () => void
}) {
  const style = CATEGORY_STYLE[category] ?? CATEGORY_STYLE.personajes
  const [label, setLabel]     = useState('')
  const [preview, setPreview] = useState<{ total: number } | null>(null)
  const [creating, setCreating] = useState(false)
  const [msg, setMsg]         = useState<string | null>(null)

  // Auto-generate entity_name from label (CamelCase, no spaces/accents)
  function toEntityName(s: string) {
    return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .split(/\s+/).filter(Boolean)
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join('')
  }

  const entity_name  = toEntityName(label)
  const slotCount    = SLOT_MATRIX[category]?.reduce((acc, row) => acc + row.age_versions.length, 0) ?? 0

  async function handleCreate() {
    if (!label.trim()) return
    setCreating(true)
    setMsg(null)
    try {
      const res = await fetch('/api/assets/create-entity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entity_name, entity_label: label.trim(), category }),
      })
      const data = await res.json()
      if (!res.ok) { setMsg(data.error ?? 'Error'); return }
      setMsg(data.message)
      setTimeout(() => { onCreated(); onClose() }, 1200)
    } finally {
      setCreating(false)
    }
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 100,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }} onClick={onClose}>
      <div style={{
        background: '#0D0920', border: `1px solid ${style.color}33`,
        borderRadius: 12, padding: '2rem', width: 460, maxWidth: '90vw',
      }} onClick={e => e.stopPropagation()}>
        <div style={{ fontFamily: 'Bebas Neue, Impact, sans-serif', fontSize: '1.5rem', color: '#F0EBE1', letterSpacing: '0.06em', marginBottom: '0.25rem' }}>
          Nueva entidad — {CATEGORY_LABELS[category] ?? category}
        </div>
        <div style={{ fontSize: '0.8125rem', color: 'rgba(240,235,225,0.35)', marginBottom: '1.5rem' }}>
          Se crearán {slotCount} slots automáticamente
        </div>

        <div style={{ marginBottom: '1.25rem' }}>
          <label style={{ display: 'block', fontSize: '0.75rem', color: 'rgba(240,235,225,0.5)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            Nombre
          </label>
          <input
            autoFocus
            value={label}
            onChange={e => setLabel(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleCreate()}
            placeholder={`Ej: ${category === 'personajes' ? 'Nombre Apellido' : category === 'rivales' ? 'El Cóndor FC' : 'Nombre del elemento'}`}
            style={{
              width: '100%', padding: '0.625rem 0.875rem',
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 6, color: '#F0EBE1', fontSize: '0.9375rem',
              fontFamily: 'IBM Plex Sans, sans-serif', outline: 'none', boxSizing: 'border-box',
            }}
          />
          {entity_name && (
            <div style={{ marginTop: '0.4rem', fontSize: '0.6875rem', color: 'rgba(240,235,225,0.25)', fontFamily: 'IBM Plex Mono, monospace' }}>
              ID: {entity_name}
            </div>
          )}
        </div>

        {msg && (
          <div style={{ marginBottom: '1rem', fontSize: '0.8125rem', color: msg.includes('Error') || msg.includes('error') ? '#f44336' : '#4ECDC4' }}>
            {msg}
          </div>
        )}

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{ padding: '0.5rem 1rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, color: 'rgba(240,235,225,0.4)', fontSize: '0.8125rem', cursor: 'pointer', fontFamily: 'IBM Plex Sans, sans-serif' }}>
            Cancelar
          </button>
          <button
            onClick={handleCreate}
            disabled={!label.trim() || creating}
            style={{
              padding: '0.5rem 1.25rem',
              background: !label.trim() || creating ? `${style.color}22` : `${style.color}18`,
              border: `1px solid ${style.color}${!label.trim() ? '22' : '55'}`,
              borderRadius: 6, color: !label.trim() || creating ? `${style.color}55` : style.color,
              fontSize: '0.8125rem', fontWeight: 600, cursor: !label.trim() || creating ? 'not-allowed' : 'pointer',
              fontFamily: 'IBM Plex Sans, sans-serif',
            }}
          >
            {creating ? 'Creando...' : `Crear ${slotCount} slots`}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Category accordion ─────────────────────────────────────────────────────────
function CategoryAccordion({
  category, slots, userEmail, isOpen, onToggle, onSeed, seeding,
  onSlotUpdated, onSlotDeleted, onEntityCreated,
}: {
  category: string
  slots: AssetSlotWithApprovals[]
  userEmail: string
  isOpen: boolean
  onToggle: () => void
  onSeed: () => void
  seeding: boolean
  onSlotUpdated: (updated: AssetSlotWithApprovals) => void
  onSlotDeleted: (id: string) => void
  onEntityCreated: () => void
}) {
  const [activeEntity, setActiveEntity] = useState<{ entity_name: string; entity_label: string } | null>(null)
  const [showNewEntity, setShowNewEntity] = useState(false)
  const style   = CATEGORY_STYLE[category] ?? CATEGORY_STYLE.personajes
  const label   = CATEGORY_LABELS[category] ?? category

  const approvedAll  = slots.filter(s => s.status === 'approved').length
  const totalAll     = slots.length
  const pct          = totalAll > 0 ? Math.round((approvedAll / totalAll) * 100) : 0
  const complete     = approvedAll === totalAll && totalAll > 0

  // Derive unique entities dynamically from slots in DB
  const entityMap = new Map<string, { entity_name: string; entity_label: string }>()
  for (const slot of slots) {
    if (!entityMap.has(slot.entity_name)) {
      entityMap.set(slot.entity_name, { entity_name: slot.entity_name, entity_label: slot.entity_label })
    }
  }
  const entities = Array.from(entityMap.values()).sort((a, b) =>
    a.entity_label.localeCompare(b.entity_label, 'es', { sensitivity: 'base' })
  )

  // Group slots by entity
  const byEntity: Record<string, AssetSlotWithApprovals[]> = {}
  for (const slot of slots) {
    if (!byEntity[slot.entity_name]) byEntity[slot.entity_name] = []
    byEntity[slot.entity_name].push(slot)
  }

  return (
    <>
      <div style={{ borderRadius: '8px', overflow: 'hidden', border: `1px solid ${isOpen ? style.color + '22' : 'rgba(255,255,255,0.05)'}`, transition: 'border-color 0.2s' }}>
        {/* Visual header */}
        <div
          onClick={onToggle}
          style={{
            position: 'relative', cursor: 'pointer', overflow: 'hidden',
            background: `linear-gradient(135deg, ${style.accent} 0%, #06040F 60%)`,
            minHeight: 100,
          }}
        >
          {/* Big letter watermark */}
          <div style={{
            position: 'absolute', right: -10, top: -20,
            fontFamily: 'Bebas Neue, Impact, sans-serif',
            fontSize: '10rem', lineHeight: 1,
            color: `${style.color}06`,
            userSelect: 'none', pointerEvents: 'none',
            letterSpacing: '0.02em',
          }}>
            {label.charAt(0)}
          </div>

          {/* Content overlay */}
          <div style={{ position: 'relative', padding: '1.5rem 1.75rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            {/* Chevron */}
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              background: `${style.color}18`, border: `1px solid ${style.color}33`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              transition: 'transform 0.2s',
              transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)',
            }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={style.color} strokeWidth="2.5" strokeLinecap="round">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </div>

            {/* Title block */}
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'Bebas Neue, Impact, sans-serif', fontSize: '2.25rem', letterSpacing: '0.06em', color: '#F0EBE1', lineHeight: 1, marginBottom: 4 }}>
                {label}
              </div>
              <div style={{ fontSize: '0.6875rem', color: 'rgba(240,235,225,0.4)', letterSpacing: '0.04em' }}>
                {entities.length} {entities.length === 1 ? 'elemento' : 'elementos'}
                {totalAll > 0 && <span style={{ marginLeft: 8, color: 'rgba(240,235,225,0.25)' }}>· {approvedAll}/{totalAll} aprobados</span>}
              </div>
            </div>

            {/* Progress + complete badge + add button */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, flexShrink: 0 }}>
              <button
                onClick={e => { e.stopPropagation(); setShowNewEntity(true) }}
                title="Nueva entidad"
                style={{
                  padding: '3px 10px', background: 'transparent',
                  border: `1px solid ${style.color}33`, borderRadius: 4,
                  color: `${style.color}88`, fontSize: '0.75rem', fontWeight: 600,
                  cursor: 'pointer', fontFamily: 'IBM Plex Sans, sans-serif',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = style.color; e.currentTarget.style.color = style.color }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = `${style.color}33`; e.currentTarget.style.color = `${style.color}88` }}
              >
                + Nueva
              </button>
              {complete && totalAll > 0 ? (
                <div style={{
                  padding: '4px 12px', borderRadius: 20,
                  background: `${style.color}22`, border: `1px solid ${style.color}55`,
                  fontSize: '0.6875rem', color: style.color, fontWeight: 700, letterSpacing: '0.08em',
                }}>
                  ✓ Completo
                </div>
              ) : totalAll > 0 ? (
                <>
                  <div style={{ fontFamily: 'Bebas Neue, Impact, sans-serif', fontSize: '1.75rem', color: style.color, lineHeight: 1 }}>
                    {pct}%
                  </div>
                  <div style={{ width: 100, height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: `linear-gradient(90deg,${style.color}88,${style.color})`, borderRadius: 2, transition: 'width 0.5s' }} />
                  </div>
                </>
              ) : (
                <button
                  onClick={e => { e.stopPropagation(); onSeed() }}
                  disabled={seeding}
                  style={{
                    padding: '5px 12px', background: `${style.color}18`,
                    border: `1px solid ${style.color}33`, borderRadius: 4,
                    color: style.color, fontSize: '0.75rem', fontWeight: 600,
                    cursor: seeding ? 'not-allowed' : 'pointer',
                    fontFamily: 'IBM Plex Sans, sans-serif',
                  }}
                >
                  {seeding ? 'Inicializando...' : 'Inicializar'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Entity grid */}
        {isOpen && (
          <div style={{ padding: '1.5rem', background: '#06040F' }}>
            {entities.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <div style={{ fontSize: '0.8125rem', color: 'rgba(240,235,225,0.2)', fontStyle: 'italic', marginBottom: '1rem' }}>
                  Sin entidades en esta categoría
                </div>
                <button
                  onClick={() => setShowNewEntity(true)}
                  style={{
                    padding: '0.5rem 1.25rem', background: `${style.color}0D`,
                    border: `1px dashed ${style.color}33`, borderRadius: 6,
                    color: `${style.color}88`, fontSize: '0.8125rem', cursor: 'pointer',
                    fontFamily: 'IBM Plex Sans, sans-serif',
                  }}
                >
                  + Crear primera entidad
                </button>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                gap: '1rem',
              }}>
                {entities.map(entity => (
                  <EntityCard
                    key={entity.entity_name}
                    entity={entity}
                    category={category}
                    slots={byEntity[entity.entity_name] ?? []}
                    onClick={() => setActiveEntity(entity)}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Entity sheet modal */}
      {activeEntity && (
        <EntitySheet
          entity={activeEntity}
          category={category}
          slots={byEntity[activeEntity.entity_name] ?? []}
          userEmail={userEmail}
          onClose={() => setActiveEntity(null)}
          onSlotUpdated={onSlotUpdated}
          onSlotDeleted={onSlotDeleted}
        />
      )}

      {/* New entity modal */}
      {showNewEntity && (
        <NewEntityModal
          category={category}
          onClose={() => setShowNewEntity(false)}
          onCreated={() => { setShowNewEntity(false); onEntityCreated() }}
        />
      )}
    </>
  )
}

// ── Main page ──────────────────────────────────────────────────────────────────
export default function ApprovalPage() {
  const { data: session } = useSession()
  const [slots, setSlots]     = useState<AssetSlotWithApprovals[]>([])
  const [loading, setLoading] = useState(true)
  const [seeding, setSeeding] = useState(false)
  const [seedMsg, setSeedMsg] = useState<string | null>(null)
  const [openCats, setOpenCats] = useState<Record<string, boolean>>(
    Object.fromEntries(CATEGORY_ORDER.map(c => [c, true]))
  )
  const userEmail = session?.user?.email ?? ''

  const fetchSlots = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/assets/slots')
      if (res.ok) setSlots(await res.json())
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchSlots() }, [fetchSlots])

  function handleSlotUpdated(updated: AssetSlotWithApprovals) {
    setSlots(prev => prev.map(s => s.id === updated.id ? updated : s))
  }

  function handleSlotDeleted(id: string) {
    setSlots(prev => prev.filter(s => s.id !== id))
  }

  async function handleSeed() {
    if (seeding) return
    setSeeding(true)
    setSeedMsg(null)
    try {
      const res = await fetch('/api/assets/seed-checklist', { method: 'POST' })
      const data = await res.json()
      setSeedMsg(data.message ?? 'Listo')
      fetchSlots()
    } finally {
      setSeeding(false)
    }
  }

  // Group slots by category
  const byCategory: Record<string, AssetSlotWithApprovals[]> = {}
  for (const slot of slots) {
    if (!byCategory[slot.category]) byCategory[slot.category] = []
    byCategory[slot.category].push(slot)
  }

  return (
    <div style={{ padding: '2.5rem 2.5rem 4rem', maxWidth: '1400px', width: '100%' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '0.6875rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(240,235,225,0.28)', marginBottom: '0.5rem' }}>
          Producción
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
          <h1 style={{ fontFamily: 'Bebas Neue, Impact, sans-serif', fontSize: '2.75rem', letterSpacing: '0.04em', color: '#F0EBE1', lineHeight: 1 }}>
            Aprobación de Assets
          </h1>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <button
              onClick={() => setOpenCats(Object.fromEntries(CATEGORY_ORDER.map(c => [c, true])))}
              style={{ padding: '0.4rem 0.75rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '3px', color: 'rgba(240,235,225,0.4)', fontSize: '0.75rem', cursor: 'pointer', fontFamily: 'IBM Plex Sans, sans-serif' }}
            >
              Abrir todo
            </button>
            <button
              onClick={() => setOpenCats(Object.fromEntries(CATEGORY_ORDER.map(c => [c, false])))}
              style={{ padding: '0.4rem 0.75rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '3px', color: 'rgba(240,235,225,0.4)', fontSize: '0.75rem', cursor: 'pointer', fontFamily: 'IBM Plex Sans, sans-serif' }}
            >
              Cerrar todo
            </button>
            <button
              onClick={handleSeed}
              disabled={seeding}
              style={{
                padding: '0.5rem 1rem',
                background: seeding ? 'rgba(245,165,42,0.06)' : 'rgba(245,165,42,0.08)',
                border: '1px solid rgba(245,165,42,0.2)', borderRadius: '3px',
                color: '#F5A52A', fontSize: '0.8125rem', fontWeight: 600,
                cursor: seeding ? 'not-allowed' : 'pointer', fontFamily: 'IBM Plex Sans, sans-serif',
              }}
            >
              {seeding ? 'Inicializando...' : '⚙ Inicializar Checklist'}
            </button>
          </div>
        </div>
        {seedMsg && <div style={{ marginTop: '0.5rem', fontSize: '0.8125rem', color: '#4ECDC4' }}>{seedMsg}</div>}
        <p style={{ fontSize: '0.9375rem', color: 'rgba(240,235,225,0.4)', marginTop: '0.5rem' }}>
          Revisión y aprobación doble de todos los assets canónicos de Los Prodigios
        </p>
      </div>

      {/* Stats */}
      <ApprovalStats slots={slots} />

      {/* Categories */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'rgba(240,235,225,0.3)', fontSize: '0.875rem' }}>
          Cargando assets...
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {CATEGORY_ORDER.map(category => (
            <CategoryAccordion
              key={category}
              category={category}
              slots={byCategory[category] ?? []}
              userEmail={userEmail}
              isOpen={openCats[category] ?? true}
              onToggle={() => setOpenCats(prev => ({ ...prev, [category]: !prev[category] }))}
              onSeed={handleSeed}
              seeding={seeding}
              onSlotUpdated={handleSlotUpdated}
              onSlotDeleted={handleSlotDeleted}
              onEntityCreated={fetchSlots}
            />
          ))}
        </div>
      )}
    </div>
  )
}
