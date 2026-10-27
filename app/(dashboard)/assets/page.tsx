'use client'

import { useState, useEffect, useMemo, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { CATEGORY_LABELS, CATEGORY_ORDER } from '@/lib/approval-config'

// ── Types ──────────────────────────────────────────────────────────────────────
interface ApprovedSlot {
  id: string
  category: string
  entity_name: string
  entity_label: string
  view_type: string
  outfit: string | null
  age_version: string
  version_label: string
  thumbnail_url: string | null
  direct_url: string | null
  updated_at: string
}

interface EntityGroup {
  entity_name: string
  entity_label: string
  slots: ApprovedSlot[]
  portrait: string | null
}

interface CategoryGroup {
  category: string
  label: string
  entities: EntityGroup[]
}

// ── Category accent colors ─────────────────────────────────────────────────────
// Derived from approval-config CATEGORY_STYLE. Fallback for unknown categories.
const CAT_COLOR: Record<string, string> = {
  personajes:  '#4A8FE8',
  locaciones:  '#4ECDC4',
  props:       '#F5A52A',
  criaturas:   '#D4256A',
  secundarios: '#9B6FD4',
  mascotas:    '#8BC34A',
  simbolos:    '#E8C94A',
  rivales:     '#D4256A',
  hawks:       '#E05A00',
}
function catColor(cat: string) { return CAT_COLOR[cat] ?? '#9B6FD4' }

// ── Portrait selection ─────────────────────────────────────────────────────────
// Picks the best representative thumbnail for the entity sidebar card.
// Priority: identity/frontal shot → any general/master view → first approved image.
function pickPortrait(slots: ApprovedSlot[]): string | null {
  const withImg = slots.filter(s => s.thumbnail_url)
  const identity = withImg.find(s =>
    s.view_type === 'Identidad facial' ||
    s.view_type === 'Identidad' ||
    (s.view_type === 'Vista maestra' && s.age_version === 'Día')
  )
  if (identity) return identity.thumbnail_url!
  const general = withImg.find(s =>
    s.view_type.toLowerCase().includes('general') ||
    s.view_type.toLowerCase().includes('maestra') ||
    s.view_type.toLowerCase().includes('cuerpo')
  )
  if (general) return general.thumbnail_url!
  return withImg[0]?.thumbnail_url ?? null
}

// ── Lightbox ───────────────────────────────────────────────────────────────────
function Lightbox({ slot, onClose }: { slot: ApprovedSlot; onClose: () => void }) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [onClose])

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(6,4,15,0.94)',
        zIndex: 1000,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '2rem',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#0D0920',
          border: '1px solid rgba(155,111,212,0.22)',
          borderRadius: 10,
          maxWidth: 860, width: '100%',
          overflow: 'hidden',
          display: 'flex', flexDirection: 'column',
        }}
      >
        {/* Image */}
        <div style={{
          position: 'relative', background: '#06040F',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          maxHeight: '62vh', overflow: 'hidden',
        }}>
          {slot.thumbnail_url
            // eslint-disable-next-line @next/next/no-img-element
            ? <img
                src={slot.thumbnail_url}
                alt={slot.version_label}
                style={{ maxWidth: '100%', maxHeight: '62vh', objectFit: 'contain' }}
              />
            : <div style={{ padding: '4rem', color: 'rgba(240,235,225,0.15)', fontSize: '0.8125rem' }}>
                Sin imagen
              </div>
          }
          <button
            onClick={onClose}
            style={{
              position: 'absolute', top: 12, right: 12,
              width: 30, height: 30, borderRadius: '50%',
              background: 'rgba(0,0,0,0.55)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#F0EBE1', cursor: 'pointer',
              fontSize: '1.1rem', lineHeight: 1,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'IBM Plex Sans, sans-serif',
            }}
          >×</button>
        </div>

        {/* Metadata bar */}
        <div style={{
          padding: '1.125rem 1.5rem',
          display: 'flex', gap: '1.5rem', flexWrap: 'wrap',
          alignItems: 'center', justifyContent: 'space-between',
          borderTop: '1px solid rgba(255,255,255,0.05)',
        }}>
          <div>
            <div style={{
              fontFamily: 'Bebas Neue, Impact, sans-serif',
              fontSize: '1.125rem', color: '#F0EBE1', letterSpacing: '0.04em',
            }}>
              {slot.entity_label}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'rgba(240,235,225,0.4)', marginTop: 2 }}>
              {slot.version_label}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
            {([
              { l: 'Vista',      v: slot.view_type },
              slot.outfit ? { l: 'Outfit', v: slot.outfit } : null,
              { l: 'Versión',    v: slot.age_version },
              { l: 'Categoría', v: CATEGORY_LABELS[slot.category] ?? slot.category },
            ] as Array<{ l: string; v: string } | null>).filter(Boolean).map(b => (
              <div key={b!.l} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <span style={{
                  fontSize: '0.5rem', letterSpacing: '0.14em', textTransform: 'uppercase',
                  color: 'rgba(240,235,225,0.22)', fontFamily: 'monospace',
                }}>{b!.l}</span>
                <span style={{ fontSize: '0.6875rem', color: 'rgba(240,235,225,0.65)' }}>{b!.v}</span>
              </div>
            ))}
          </div>

          {slot.direct_url && (
            <button
              onClick={() => navigator.clipboard.writeText(slot.direct_url!)}
              style={{
                padding: '0.4rem 0.875rem',
                background: 'rgba(78,205,196,0.07)',
                border: '1px solid rgba(78,205,196,0.22)',
                borderRadius: 5, color: '#4ECDC4',
                fontSize: '0.6875rem', cursor: 'pointer',
                fontFamily: 'IBM Plex Sans, sans-serif', flexShrink: 0,
              }}
            >
              Copiar URL
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Entity gallery (right panel) ───────────────────────────────────────────────
function EntityGallery({
  entity, color, docLinks, onImageClick,
}: {
  entity: EntityGroup
  color: string
  docLinks: any[]
  onImageClick: (s: ApprovedSlot) => void
}) {
  // Group slots by view_type, preserving insertion order
  const grouped: Record<string, ApprovedSlot[]> = {}
  for (const s of entity.slots) {
    if (!grouped[s.view_type]) grouped[s.view_type] = []
    grouped[s.view_type].push(s)
  }
  const category = entity.slots[0]?.category ?? ''

  return (
    <div style={{ padding: '2rem 2.5rem 3rem', height: '100%', overflowY: 'auto', boxSizing: 'border-box' }}>

      {/* Entity header */}
      <div style={{
        marginBottom: '2rem',
        paddingBottom: '1.25rem',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}>
        <div style={{
          fontSize: '0.5625rem', letterSpacing: '0.18em', textTransform: 'uppercase',
          color: color, marginBottom: '0.4rem', fontFamily: 'monospace', opacity: 0.75,
        }}>
          {CATEGORY_LABELS[category] ?? category}
        </div>
        <h2 style={{
          fontFamily: 'Bebas Neue, Impact, sans-serif',
          fontSize: '2.5rem', color: '#F0EBE1',
          letterSpacing: '0.03em', margin: 0, lineHeight: 0.95,
        }}>
          {entity.entity_label}
        </h2>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', marginTop: '0.625rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.6875rem', color: 'rgba(240,235,225,0.3)' }}>
            {entity.slots.length} asset{entity.slots.length !== 1 ? 's' : ''} aprobado{entity.slots.length !== 1 ? 's' : ''}
          </span>

          {/* Biblia pills */}
          {docLinks.length > 0 && (
            <>
              <div style={{ width: 1, height: 12, background: 'rgba(255,255,255,0.08)', flexShrink: 0 }} />
              <span style={{
                fontSize: '0.5rem', letterSpacing: '0.12em', textTransform: 'uppercase',
                color: 'rgba(240,235,225,0.2)', fontFamily: 'monospace',
              }}>Biblia</span>
              {docLinks.map((link: any) => {
                const doc = link.reference_docs
                const accent = doc?.accent_color ?? '#F5A52A'
                return (
                  <a
                    key={link.id}
                    href="/bible"
                    title={doc?.title ?? link.doc_id}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '0.25rem',
                      padding: '0.15rem 0.5rem',
                      background: `${accent}10`, border: `1px solid ${accent}30`,
                      borderRadius: 3, textDecoration: 'none',
                    }}
                  >
                    <div style={{ width: 5, height: 5, borderRadius: 1, background: accent, flexShrink: 0 }} />
                    <span style={{
                      fontSize: '0.625rem', color: `${accent}CC`,
                      fontFamily: 'IBM Plex Sans, sans-serif', whiteSpace: 'nowrap',
                    }}>
                      {doc?.title ?? 'Tomo'}
                    </span>
                  </a>
                )
              })}
            </>
          )}
        </div>
      </div>

      {/* Slots grouped by view_type */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2.25rem' }}>
        {Object.entries(grouped).map(([vt, vtSlots]) => (
          <div key={vt}>
            {/* Section label */}
            <div style={{
              fontSize: '0.5875rem', letterSpacing: '0.16em', textTransform: 'uppercase',
              color: 'rgba(240,235,225,0.28)', marginBottom: '0.875rem',
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              fontFamily: 'monospace',
            }}>
              {vt}
              <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.04)' }} />
              <span style={{ color, opacity: 0.7 }}>{vtSlots.length}</span>
            </div>

            {/* Image grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(155px, 1fr))',
              gap: '0.625rem',
            }}>
              {vtSlots.map(slot => (
                <div
                  key={slot.id}
                  onClick={() => onImageClick(slot)}
                  style={{
                    background: '#080614',
                    border: '1px solid rgba(255,255,255,0.05)',
                    borderRadius: 7, overflow: 'hidden',
                    cursor: 'pointer',
                    transition: 'border-color 0.14s, transform 0.14s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = `${color}44`
                    e.currentTarget.style.transform = 'translateY(-2px)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'
                    e.currentTarget.style.transform = 'translateY(0)'
                  }}
                >
                  <div style={{ height: 125, background: '#06040F', overflow: 'hidden' }}>
                    {slot.thumbnail_url
                      // eslint-disable-next-line @next/next/no-img-element
                      ? <img
                          src={slot.thumbnail_url}
                          alt={slot.version_label}
                          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }}
                        />
                      : <div style={{
                          width: '100%', height: '100%',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          <span style={{
                            fontSize: '0.5rem', color: 'rgba(240,235,225,0.07)',
                            fontFamily: 'monospace', letterSpacing: '0.1em',
                          }}>SIN IMAGEN</span>
                        </div>
                    }
                  </div>
                  <div style={{ padding: '0.5rem 0.625rem' }}>
                    <div style={{ fontSize: '0.5625rem', color: 'rgba(240,235,225,0.35)', lineHeight: 1.4 }}>
                      {slot.version_label}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Main ───────────────────────────────────────────────────────────────────────
function AssetsContent() {
  const searchParams = useSearchParams()

  const [slots, setSlots]               = useState<ApprovedSlot[]>([])
  const [entityDocMap, setEntityDocMap] = useState<Record<string, any[]>>({})
  const [loading, setLoading]           = useState(true)
  const [error, setError]               = useState(false)
  const [search, setSearch]             = useState('')
  const [openCats, setOpenCats]         = useState<Set<string>>(new Set())
  const [selected, setSelected]         = useState<{ entity_name: string; category: string } | null>(null)
  const [lightbox, setLightbox]         = useState<ApprovedSlot | null>(null)

  // ── Load data ────────────────────────────────────────────────────────────
  useEffect(() => {
    Promise.all([
      fetch('/api/assets/approved').then(r => r.json()),
      fetch('/api/entity-doc-links').then(r => r.ok ? r.json() : []),
    ])
      .then(([approved, links]) => {
        if (Array.isArray(approved)) setSlots(approved)
        if (Array.isArray(links)) {
          const map: Record<string, any[]> = {}
          for (const l of links) {
            if (!map[l.entity_name]) map[l.entity_name] = []
            map[l.entity_name].push(l)
          }
          setEntityDocMap(map)
        }
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  // ── Deep link: ?entity=EntityName ────────────────────────────────────────
  useEffect(() => {
    const entity = searchParams.get('entity')
    if (entity && slots.length > 0) {
      const found = slots.find(s => s.entity_name === entity)
      if (found) {
        setSelected({ entity_name: entity, category: found.category })
        setOpenCats(prev => new Set([...prev, found.category]))
      }
    }
  }, [searchParams, slots])

  // ── Build category structure dynamically from DB data ────────────────────
  const categories = useMemo<CategoryGroup[]>(() => {
    const catMap: Record<string, Record<string, ApprovedSlot[]>> = {}
    for (const s of slots) {
      if (!catMap[s.category]) catMap[s.category] = {}
      if (!catMap[s.category][s.entity_name]) catMap[s.category][s.entity_name] = []
      catMap[s.category][s.entity_name].push(s)
    }

    const allCats = Object.keys(catMap)
    // Use CATEGORY_ORDER as sort hint; unknown categories appear at end
    const sortedCats = [
      ...CATEGORY_ORDER.filter(c => allCats.includes(c)),
      ...allCats.filter(c => !CATEGORY_ORDER.includes(c)).sort(),
    ]

    const q = search.toLowerCase().trim()
    return sortedCats.map(cat => {
      const entities: EntityGroup[] = Object.entries(catMap[cat])
        .map(([ename, eslots]) => ({
          entity_name: ename,
          entity_label: eslots[0].entity_label,
          slots: eslots,
          portrait: pickPortrait(eslots),
        }))
        .filter(e => !q || e.entity_label.toLowerCase().includes(q) || e.entity_name.toLowerCase().includes(q))

      return {
        category: cat,
        label: CATEGORY_LABELS[cat] ?? (cat.charAt(0).toUpperCase() + cat.slice(1)),
        entities,
      }
    }).filter(c => c.entities.length > 0)
  }, [slots, search])

  // Auto-expand all categories while searching
  useEffect(() => {
    if (search.trim()) setOpenCats(new Set(categories.map(c => c.category)))
  }, [search, categories])

  const selectedGroup = useMemo(() => {
    if (!selected) return null
    return categories
      .find(c => c.category === selected.category)
      ?.entities.find(e => e.entity_name === selected.entity_name) ?? null
  }, [categories, selected])

  function toggleCat(cat: string) {
    setOpenCats(prev => {
      const n = new Set(prev)
      n.has(cat) ? n.delete(cat) : n.add(cat)
      return n
    })
  }

  function selectEntity(entity_name: string, category: string) {
    setSelected({ entity_name, category })
    setOpenCats(prev => new Set([...prev, category]))
  }

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>

      {/* ── HEADER ──────────────────────────────────────────────────────── */}
      <div style={{
        position: 'relative', overflow: 'hidden',
        background: '#0D0920',
        borderBottom: '1px solid rgba(155,111,212,0.12)',
        padding: '1.625rem 2rem 1.375rem',
        flexShrink: 0,
      }}>
        {/* Top accent line */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
          background: 'linear-gradient(90deg, #9B6FD4 0%, rgba(155,111,212,0.35) 40%, transparent 100%)',
        }} />
        {/* Background watermark */}
        <div style={{
          position: 'absolute', right: '1.5rem', top: '50%', transform: 'translateY(-50%)',
          fontFamily: 'Bebas Neue, Impact, sans-serif',
          fontSize: 'clamp(3.5rem, 7vw, 6rem)',
          letterSpacing: '-0.03em', color: '#9B6FD4', opacity: 0.04,
          lineHeight: 1, userSelect: 'none', pointerEvents: 'none',
        }}>ARTE</div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{
              fontSize: '0.5625rem', letterSpacing: '0.22em', textTransform: 'uppercase',
              color: '#9B6FD4', fontWeight: 600, marginBottom: '0.375rem', opacity: 0.8,
            }}>Arte · Canon visual</div>
            <h1 style={{
              fontFamily: 'Bebas Neue, Impact, sans-serif',
              fontSize: 'clamp(2rem, 3.5vw, 2.75rem)',
              letterSpacing: '0.04em', color: '#F0EBE1', lineHeight: 0.9, margin: 0,
            }}>ASSETS</h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.3rem' }}>
              <span style={{
                fontFamily: 'Bebas Neue, Impact, sans-serif',
                fontSize: '1.25rem', color: '#9B6FD4',
              }}>
                {loading ? '…' : slots.length}
              </span>
              <span style={{
                fontSize: '0.5625rem', letterSpacing: '0.14em', textTransform: 'uppercase',
                color: 'rgba(240,235,225,0.25)', fontWeight: 600,
              }}>aprobados</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <div style={{ width: 5, height: 5, borderRadius: '50%', background: error ? '#D4256A' : '#4ECDC4' }} />
              <span style={{ fontSize: '0.6125rem', color: 'rgba(240,235,225,0.3)', letterSpacing: '0.03em' }}>
                {loading ? 'Cargando…' : error ? 'Error' : 'Canon activo'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── SEARCH ──────────────────────────────────────────────────────── */}
      <div style={{
        padding: '0.625rem 1rem',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        background: '#08060F', flexShrink: 0,
      }}>
        <div style={{ position: 'relative' }}>
          <svg
            style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.22, pointerEvents: 'none' }}
            width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#F0EBE1" strokeWidth="2" strokeLinecap="round"
          >
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar personajes, props, locaciones..."
            style={{
              width: '100%', padding: '0.5rem 2rem 0.5rem 2.25rem',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 6, color: '#F0EBE1',
              fontSize: '0.8125rem', fontFamily: 'IBM Plex Sans, sans-serif',
              outline: 'none', boxSizing: 'border-box',
            }}
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              style={{
                position: 'absolute', right: '0.625rem', top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', color: 'rgba(240,235,225,0.3)',
                cursor: 'pointer', fontSize: '1.1rem', padding: 0, lineHeight: 1,
                fontFamily: 'IBM Plex Sans, sans-serif',
              }}
            >×</button>
          )}
        </div>
      </div>

      {/* ── SPLIT PANEL ─────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', flex: 1, minHeight: 0, overflow: 'hidden' }}>

        {/* LEFT — category / entity nav ─────────────────────────────────── */}
        <div style={{
          width: 252, flexShrink: 0,
          borderRight: '1px solid rgba(255,255,255,0.05)',
          overflowY: 'auto',
          background: '#06040F',
        }}>
          {loading ? (
            <div style={{ padding: '2.5rem 1rem', textAlign: 'center', fontSize: '0.75rem', color: 'rgba(240,235,225,0.2)' }}>
              Cargando…
            </div>
          ) : error ? (
            <div style={{ padding: '1rem', fontSize: '0.75rem', color: '#D4256A' }}>
              Error de conexión
            </div>
          ) : categories.length === 0 ? (
            <div style={{ padding: '2.5rem 1rem', textAlign: 'center', fontSize: '0.75rem', color: 'rgba(240,235,225,0.2)' }}>
              Sin resultados
            </div>
          ) : (
            categories.map(cat => {
              const isOpen = openCats.has(cat.category)
              const color  = catColor(cat.category)
              return (
                <div key={cat.category} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>

                  {/* Category row */}
                  <button
                    onClick={() => toggleCat(cat.category)}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', gap: '0.5rem',
                      padding: '0.75rem 1rem',
                      background: isOpen ? 'rgba(255,255,255,0.02)' : 'none',
                      border: 'none', cursor: 'pointer', textAlign: 'left',
                    }}
                  >
                    <div style={{
                      width: 6, height: 6, borderRadius: '50%',
                      background: color, flexShrink: 0,
                      opacity: isOpen ? 1 : 0.4,
                      boxShadow: isOpen ? `0 0 6px ${color}88` : 'none',
                      transition: 'opacity 0.15s, box-shadow 0.15s',
                    }} />
                    <span style={{
                      fontFamily: 'Bebas Neue, Impact, sans-serif',
                      fontSize: '0.8125rem', letterSpacing: '0.08em',
                      color: isOpen ? '#F0EBE1' : 'rgba(240,235,225,0.4)',
                      flex: 1, transition: 'color 0.15s',
                    }}>
                      {cat.label}
                    </span>
                    <span style={{
                      fontSize: '0.5rem', fontFamily: 'monospace',
                      color: isOpen ? color : 'rgba(240,235,225,0.18)',
                    }}>
                      {cat.entities.length}
                    </span>
                    <svg
                      style={{
                        flexShrink: 0,
                        transform: isOpen ? 'rotate(180deg)' : 'none',
                        transition: 'transform 0.18s',
                        opacity: 0.35,
                      }}
                      width="10" height="10" viewBox="0 0 24 24"
                      fill="none" stroke="#F0EBE1" strokeWidth="2" strokeLinecap="round"
                    >
                      <polyline points="6 9 12 15 18 9"/>
                    </svg>
                  </button>

                  {/* Entity list */}
                  {isOpen && (
                    <div style={{ background: 'rgba(0,0,0,0.2)', paddingBottom: '0.25rem' }}>
                      {cat.entities.map(entity => {
                        const isSel = selected?.entity_name === entity.entity_name
                        return (
                          <button
                            key={entity.entity_name}
                            onClick={() => selectEntity(entity.entity_name, cat.category)}
                            style={{
                              width: '100%',
                              display: 'flex', alignItems: 'center', gap: '0.625rem',
                              padding: '0.4rem 1rem 0.4rem 1.25rem',
                              background: isSel ? `${color}12` : 'none',
                              border: 'none',
                              borderLeft: isSel ? `2px solid ${color}` : '2px solid transparent',
                              cursor: 'pointer', textAlign: 'left',
                              transition: 'background 0.12s',
                            }}
                          >
                            {/* Mini portrait */}
                            <div style={{
                              width: 26, height: 26, borderRadius: 4,
                              overflow: 'hidden', background: '#0D0920', flexShrink: 0,
                              border: `1px solid ${isSel ? color + '44' : 'rgba(255,255,255,0.05)'}`,
                            }}>
                              {entity.portrait
                                // eslint-disable-next-line @next/next/no-img-element
                                ? <img
                                    src={entity.portrait}
                                    alt=""
                                    style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }}
                                  />
                                : <div style={{
                                    width: '100%', height: '100%',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                  }}>
                                    <span style={{
                                      fontSize: '0.6875rem', color: `${color}55`,
                                      fontFamily: 'Bebas Neue, Impact, sans-serif',
                                    }}>
                                      {entity.entity_label.charAt(0)}
                                    </span>
                                  </div>
                              }
                            </div>

                            <span style={{
                              fontSize: '0.75rem',
                              color: isSel ? '#F0EBE1' : 'rgba(240,235,225,0.45)',
                              fontFamily: 'IBM Plex Sans, sans-serif',
                              flex: 1, lineHeight: 1.25,
                            }}>
                              {entity.entity_label}
                            </span>
                            <span style={{
                              fontSize: '0.5rem', fontFamily: 'monospace',
                              color: isSel ? color : 'rgba(240,235,225,0.18)', flexShrink: 0,
                            }}>
                              {entity.slots.length}
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })
          )}
        </div>

        {/* RIGHT — entity gallery ───────────────────────────────────────── */}
        <div style={{ flex: 1, minWidth: 0, overflowY: 'auto', background: '#08060F' }}>
          {selectedGroup ? (
            <EntityGallery
              entity={selectedGroup}
              color={catColor(selected!.category)}
              docLinks={entityDocMap[selectedGroup.entity_name] ?? []}
              onImageClick={setLightbox}
            />
          ) : (
            <div style={{
              height: '100%',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              gap: '0.75rem', padding: '3rem',
            }}>
              <div style={{
                fontFamily: 'Bebas Neue, Impact, sans-serif',
                fontSize: '5rem', color: '#9B6FD4', opacity: 0.05,
                letterSpacing: '0.08em', lineHeight: 1,
              }}>ARTE</div>
              <p style={{
                fontSize: '0.8125rem', color: 'rgba(240,235,225,0.18)',
                textAlign: 'center', maxWidth: 260, margin: 0, lineHeight: 1.6,
              }}>
                {loading
                  ? 'Cargando canon…'
                  : slots.length === 0
                    ? 'No hay assets aprobados aún.'
                    : 'Selecciona una entidad del panel izquierdo para ver su galería.'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── LIGHTBOX ────────────────────────────────────────────────────── */}
      {lightbox && <Lightbox slot={lightbox} onClose={() => setLightbox(null)} />}
    </div>
  )
}

export default function AssetsPage() {
  return (
    <Suspense>
      <AssetsContent />
    </Suspense>
  )
}
