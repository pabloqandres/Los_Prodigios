'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

function AssetsContent() {
  const searchParams = useSearchParams()
  const [canonSlots, setCanonSlots]     = useState<any[]>([])
  const [canonLoading, setCanonLoading] = useState(true)
  const [canonError, setCanonError]     = useState(false)
  const [highlightEntity, setHighlightEntity] = useState<string | null>(null)
  const [entityDocMap, setEntityDocMap] = useState<Record<string, any[]>>({})
  const highlightRef = useRef<HTMLDivElement | null>(null)

  // Read deep-link params on mount
  useEffect(() => {
    const entity = searchParams.get('entity')
    if (entity) setHighlightEntity(entity)
  }, [])

  useEffect(() => {
    Promise.all([
      fetch('/api/assets/approved').then(r => r.json()),
      fetch('/api/entity-doc-links').then(r => r.ok ? r.json() : []),
    ])
      .then(([approved, links]) => {
        if (Array.isArray(approved)) setCanonSlots(approved)
        if (Array.isArray(links)) {
          const map: Record<string, any[]> = {}
          for (const link of links) {
            if (!map[link.entity_name]) map[link.entity_name] = []
            map[link.entity_name].push(link)
          }
          setEntityDocMap(map)
        }
      })
      .catch(() => { setCanonError(true) })
      .finally(() => setCanonLoading(false))
  }, [])

  // Scroll to highlighted entity once slots are loaded
  useEffect(() => {
    if (highlightEntity && !canonLoading && highlightRef.current) {
      highlightRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [highlightEntity, canonLoading])

  const totalApproved = canonSlots.length

  return (
    <div style={{ width: '100%' }}>

      {/* ── PAGE HEADER ──────────────────────────────────────────────────── */}
      <div style={{ position: 'relative', overflow: 'hidden', background: '#0D0920', borderBottom: '1px solid rgba(155,111,212,0.12)', padding: '3rem 2.5rem 2.5rem' }}>
        <div style={{ position: 'absolute', right: '1.5rem', top: '50%', transform: 'translateY(-50%)', fontFamily: 'Bebas Neue, Impact, sans-serif', fontSize: 'clamp(5rem, 12vw, 9rem)', letterSpacing: '-0.03em', color: '#9B6FD4', opacity: 0.04, lineHeight: 1, userSelect: 'none', pointerEvents: 'none' }}>ART</div>
        <div style={{ position: 'absolute', top: '-60px', right: '25%', width: '350px', height: '280px', borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(155,111,212,0.08) 0%, transparent 70%)', filter: 'blur(40px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, #9B6FD4 0%, rgba(155,111,212,0.4) 40%, transparent 100%)' }} />

        <div style={{ fontSize: '0.625rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#9B6FD4', fontWeight: 600, marginBottom: '0.75rem', opacity: 0.85 }}>Arte · Canon visual</div>
        <h1 style={{ fontFamily: 'Bebas Neue, Impact, sans-serif', fontSize: 'clamp(3.5rem, 7vw, 5.5rem)', letterSpacing: '0.04em', color: '#F0EBE1', lineHeight: 0.9, marginBottom: '1rem' }}>ASSETS</h1>
        <p style={{ fontSize: '0.9375rem', color: 'rgba(240,235,225,0.45)', maxWidth: '480px' }}>Imágenes aprobadas — canon visual oficial de Los Prodigios.</p>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginTop: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.375rem' }}>
            <span style={{ fontFamily: 'Bebas Neue, Impact, sans-serif', fontSize: '1.25rem', color: '#9B6FD4', letterSpacing: '0.04em' }}>
              {canonLoading ? '…' : totalApproved}
            </span>
            <span style={{ fontSize: '0.625rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(240,235,225,0.35)', fontWeight: 600 }}>Aprobados</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
            <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: canonError ? '#D4256A' : '#4ECDC4' }} />
            <span style={{ fontSize: '0.6875rem', color: 'rgba(240,235,225,0.35)', letterSpacing: '0.04em' }}>
              {canonLoading ? 'Cargando…' : canonError ? 'Error de conexión' : 'Canon activo'}
            </span>
          </div>
        </div>
      </div>

      {/* ── MARQUEE ───────────────────────────────────────────────────────── */}
      <div style={{ background: '#9B6FD4', overflow: 'hidden', padding: '0.55rem 0' }}>
        <div style={{ display: 'inline-block', whiteSpace: 'nowrap', animation: 'marquee 22s linear infinite' }}>
          <span style={{ fontFamily: 'Bebas Neue, Impact, sans-serif', fontSize: '0.9375rem', letterSpacing: '0.14em', color: '#F0EBE1' }}>
            {Array(8).fill('PERSONAJES\u2003—\u2003LOCACIONES\u2003—\u2003PROPS\u2003—\u2003CRIATURAS\u2003—\u2003STORYBOARDS\u2003—\u2003').join('')}
          </span>
        </div>
      </div>

      {/* ── BODY ─────────────────────────────────────────────────────────── */}
      <div style={{ padding: '2rem 2.5rem 3rem', maxWidth: '1100px' }}>
        {canonError && (
          <div style={{ padding: '1rem 1.25rem', background: 'rgba(212,37,106,0.06)', border: '1px solid rgba(212,37,106,0.2)', borderRadius: '4px', marginBottom: '1.5rem', fontSize: '0.875rem', color: '#D4256A' }}>
            No se pudo cargar los assets aprobados. Verifica la conexión.
          </div>
        )}

        {canonLoading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'rgba(240,235,225,0.3)', fontSize: '0.875rem' }}>Cargando canon...</div>
        ) : canonError ? null : canonSlots.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'rgba(240,235,225,0.2)', fontSize: '0.875rem' }}>
            No hay assets aprobados aún. Ve a <strong style={{ color: '#F5A52A' }}>Aprobación</strong> para subir y aprobar imágenes.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {['personajes','locaciones','props','criaturas','secundarios','mascotas'].map(cat => {
              const catSlots = canonSlots.filter(s => s.category === cat)
              if (catSlots.length === 0) return null
              const byEntity: Record<string, any[]> = {}
              for (const s of catSlots) {
                if (!byEntity[s.entity_name]) byEntity[s.entity_name] = []
                byEntity[s.entity_name].push(s)
              }
              const catLabel: Record<string, string> = { personajes: 'Personajes Principales', locaciones: 'Locaciones', props: 'Props & Objetos', criaturas: 'Criaturas', secundarios: 'Personajes Secundarios', mascotas: 'Mascotas & Animales' }
              return (
                <div key={cat}>
                  <div style={{ fontFamily: 'Bebas Neue, Impact, sans-serif', fontSize: '1rem', letterSpacing: '0.1em', color: 'rgba(240,235,225,0.4)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    {catLabel[cat] ?? cat}
                    <div style={{ flex: 1, height: '1px', background: 'rgba(245,165,42,0.07)' }} />
                    <span style={{ fontSize: '0.6875rem', color: '#4ECDC4' }}>{catSlots.length} aprobados</span>
                  </div>
                  {Object.entries(byEntity).map(([entityName, entitySlots]) => {
                    const isHighlighted = entityName === highlightEntity
                    return (
                      <div
                        key={entityName}
                        ref={isHighlighted ? highlightRef : null}
                        style={{
                          marginBottom: '1.5rem',
                          ...(isHighlighted ? {
                            border: '1px solid rgba(155,111,212,0.4)',
                            boxShadow: '0 0 0 1px rgba(155,111,212,0.15)',
                            borderRadius: '6px',
                            padding: '0.75rem',
                          } : {}),
                        }}
                      >
                        <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#F0EBE1', marginBottom: '0.5rem' }}>
                          {entitySlots[0].entity_label}
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '0.5rem' }}>
                          {entitySlots.map((slot: any) => (
                            <div key={slot.id} style={{ background: '#0D0920', border: '1px solid rgba(78,205,196,0.2)', borderRadius: '6px', overflow: 'hidden' }}>
                              <div style={{ height: '120px', background: '#080614', overflow: 'hidden' }}>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={slot.thumbnail_url} alt={slot.version_label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              </div>
                              <div style={{ padding: '0.5rem' }}>
                                <div style={{ fontSize: '0.625rem', color: 'rgba(240,235,225,0.5)', lineHeight: 1.3, marginBottom: '0.375rem' }}>{slot.version_label}</div>
                                <button
                                  onClick={() => navigator.clipboard.writeText(slot.direct_url)}
                                  style={{ width: '100%', padding: '3px 0', background: 'rgba(78,205,196,0.08)', border: '1px solid rgba(78,205,196,0.2)', borderRadius: '3px', color: '#4ECDC4', fontSize: '0.5625rem', cursor: 'pointer', fontFamily: 'IBM Plex Sans, sans-serif' }}
                                >
                                  Copiar URL
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Documentos vinculados */}
                        {entityDocMap[entityName] && entityDocMap[entityName].length > 0 && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.625rem', flexWrap: 'wrap' }}>
                            <span style={{ fontSize: '0.5625rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(240,235,225,0.2)', fontFamily: 'monospace', flexShrink: 0 }}>Biblia</span>
                            {entityDocMap[entityName].map((link: any) => {
                              const doc = link.reference_docs
                              const accent = doc?.accent_color ?? '#F5A52A'
                              return (
                                <a
                                  key={link.id}
                                  href="/bible"
                                  title={doc?.title ?? link.doc_id}
                                  style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', padding: '0.2rem 0.625rem', background: `${accent}10`, border: `1px solid ${accent}35`, borderRadius: '3px', textDecoration: 'none' }}
                                >
                                  <div style={{ width: '6px', height: '6px', borderRadius: '1px', background: accent, flexShrink: 0 }} />
                                  <span style={{ fontSize: '0.6875rem', color: `${accent}CC`, fontFamily: 'IBM Plex Sans, sans-serif', whiteSpace: 'nowrap' }}>
                                    {doc?.title ?? 'Tomo'}
                                  </span>
                                </a>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )
            })}
          </div>
        )}
      </div>
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
