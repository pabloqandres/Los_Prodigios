'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { DocumentsList } from '@/components/DocumentsList'

// ── Types ──────────────────────────────────────────────────────────────────────

interface ContinuityModuleRow {
  module_key: string
  content: string
  updated_by: string | null
  updated_at: string | null
}

interface ContinuityModule {
  num: string
  type: string
  title: string
  description: string
  module_key: string
  accent: string
  items: string[]
}

// ── Static module definitions ──────────────────────────────────────────────────

const MODULES: ContinuityModule[] = [
  {
    num: '01',
    type: 'Registro histórico',
    title: 'Canon Log',
    description: 'Historial completo de cambios permanentes al canon de la serie, episodio por episodio.',
    module_key: 'canon_log',
    accent: '#D4256A',
    items: ['Cambios de diseño aprobados', 'Hechos establecidos como canon', 'Decisiones narrativas permanentes'],
  },
  {
    num: '02',
    type: 'Línea de tiempo',
    title: 'Timeline Visual',
    description: 'Cronología de hitos narrativos que afectan el estado visual de personajes y locaciones.',
    module_key: 'timeline',
    accent: '#4A8FE8',
    items: ['Hitos por temporada', 'Eventos con impacto visual', 'Cronología interna de la serie'],
  },
  {
    num: '03',
    type: 'Problemas abiertos',
    title: 'Issues Abiertos',
    description: 'Inconsistencias detectadas y promesas narrativas sembradas pendientes de resolución.',
    module_key: 'open_issues',
    accent: '#F5A52A',
    items: ['Inconsistencias visuales', 'Promesas narrativas sin cerrar', 'Conflictos de canon'],
  },
  {
    num: '04',
    type: 'Estado actual',
    title: 'Estados: Personajes',
    description: 'Snapshot visual de cada personaje: apariencia, posesiones, cicatrices, cambios acumulados.',
    module_key: 'character_states',
    accent: '#9B6FD4',
    items: [],
  },
  {
    num: '05',
    type: 'Estado actual',
    title: 'Estados: Locaciones',
    description: 'Cambios permanentes en escenarios: daños estructurales, elementos añadidos o destruidos.',
    module_key: 'location_states',
    accent: '#4ECDC4',
    items: [],
  },
  {
    num: '06',
    type: 'Estado actual',
    title: 'Estados: Props',
    description: 'Historial de objetos importantes: ubicación, posesión actual y eventos que los afectaron.',
    module_key: 'prop_states',
    accent: '#4ECDC4',
    items: [],
  },
]

// ── Helpers ────────────────────────────────────────────────────────────────────

function formatDate(iso: string | null): string {
  if (!iso) return 'Sin datos'
  try {
    return new Date(iso).toLocaleDateString('es-MX', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  } catch {
    return 'Sin datos'
  }
}

function hasRealContent(content: string | null | undefined): boolean {
  if (!content) return false
  const trimmed = content.trim()
  return trimmed.length > 0
}

// ── Modal ──────────────────────────────────────────────────────────────────────

interface EditModalProps {
  module: ContinuityModule
  initialContent: string
  onClose: () => void
  onSave: (module_key: string, content: string) => Promise<void>
}

function EditModal({ module, initialContent, onClose, onSave }: EditModalProps) {
  const [content, setContent] = useState(initialContent)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSave = async () => {
    setSaving(true)
    setError(null)
    try {
      await onSave(module.module_key, content)
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar')
    } finally {
      setSaving(false)
    }
  }

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.72)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#0D0920',
          border: `1px solid rgba(${module.accent === '#D4256A' ? '212,37,106' : '255,255,255'},0.12)`,
          borderTop: `2px solid ${module.accent}`,
          borderRadius: '6px',
          width: '100%',
          maxWidth: '760px',
          maxHeight: '85vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Modal header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1.125rem 1.5rem',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          flexShrink: 0,
        }}>
          <div>
            <div style={{
              fontSize: '0.5625rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: module.accent,
              fontWeight: 600,
              opacity: 0.8,
              marginBottom: '0.2rem',
            }}>
              {module.type}
            </div>
            <h3 style={{
              fontFamily: 'Bebas Neue, Impact, sans-serif',
              fontSize: '1.375rem',
              letterSpacing: '0.04em',
              color: '#F0EBE1',
              lineHeight: 1,
            }}>
              {module.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'rgba(240,235,225,0.35)',
              padding: '0.25rem',
              lineHeight: 1,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Textarea */}
        <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', padding: '1.25rem 1.5rem' }}>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            spellCheck={false}
            style={{
              flex: 1,
              width: '100%',
              minHeight: '340px',
              background: '#080614',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: '4px',
              color: '#F0EBE1',
              fontSize: '0.8125rem',
              fontFamily: 'monospace',
              lineHeight: 1.7,
              padding: '1rem',
              resize: 'vertical',
              outline: 'none',
            }}
            placeholder={`# ${module.title}\n\nContenido en Markdown...`}
          />
        </div>

        {/* Footer */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1rem 1.5rem',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          flexShrink: 0,
          gap: '1rem',
        }}>
          <div style={{ fontSize: '0.75rem', color: 'rgba(240,235,225,0.28)', fontFamily: 'monospace' }}>
            {module.module_key}
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            {error && (
              <span style={{ fontSize: '0.75rem', color: '#F5A52A' }}>{error}</span>
            )}
            <button
              onClick={onClose}
              style={{
                background: 'transparent',
                border: '1px solid rgba(240,235,225,0.12)',
                borderRadius: '4px',
                color: 'rgba(240,235,225,0.55)',
                fontSize: '0.8125rem',
                fontWeight: 600,
                padding: '0.5rem 1rem',
                cursor: 'pointer',
              }}
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              style={{
                background: saving ? 'rgba(212,37,106,0.5)' : '#D4256A',
                border: 'none',
                borderRadius: '4px',
                color: '#F0EBE1',
                fontSize: '0.8125rem',
                fontWeight: 600,
                padding: '0.5rem 1.25rem',
                cursor: saving ? 'not-allowed' : 'pointer',
                letterSpacing: '0.01em',
              }}
            >
              {saving ? 'Guardando…' : 'Guardar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default function ContinuityPage() {
  const [moduleData, setModuleData] = useState<Record<string, ContinuityModuleRow>>({})
  const [loading, setLoading] = useState(true)
  const [activeModal, setActiveModal] = useState<ContinuityModule | null>(null)

  // Fetch all modules on mount
  const fetchModules = useCallback(async () => {
    try {
      const res = await fetch('/api/continuity')
      if (!res.ok) return
      const rows: ContinuityModuleRow[] = await res.json()
      const map: Record<string, ContinuityModuleRow> = {}
      for (const row of rows) map[row.module_key] = row
      setModuleData(map)
    } catch {
      // silently fail — will show empty state
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchModules() }, [fetchModules])

  const handleSave = async (module_key: string, content: string) => {
    const res = await fetch('/api/continuity', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ module_key, content }),
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Error desconocido' }))
      throw new Error(err.error ?? 'Error al guardar')
    }
    // Refresh data after save
    await fetchModules()
  }

  return (
    <div style={{ width: '100%' }}>

      {/* ── PAGE HEADER ──────────────────────────────────────────────────── */}
      <div style={{
        position: 'relative',
        overflow: 'hidden',
        background: '#0D0920',
        borderBottom: '1px solid rgba(212,37,106,0.12)',
        padding: '3rem 2.5rem 2.5rem',
      }}>
        {/* Decorative background number */}
        <div style={{
          position: 'absolute',
          right: '1.5rem',
          top: '50%',
          transform: 'translateY(-50%)',
          fontFamily: 'Bebas Neue, Impact, sans-serif',
          fontSize: 'clamp(6rem, 14vw, 11rem)',
          letterSpacing: '-0.05em',
          color: '#D4256A',
          opacity: 0.04,
          lineHeight: 1,
          userSelect: 'none',
          pointerEvents: 'none',
        }}>
          50
        </div>
        {/* Crimson glow blob */}
        <div style={{
          position: 'absolute',
          top: '-60px',
          right: '20%',
          width: '400px',
          height: '300px',
          borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(212,37,106,0.08) 0%, transparent 70%)',
          filter: 'blur(40px)',
          pointerEvents: 'none',
        }} />
        {/* Top accent line */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '2px',
          background: 'linear-gradient(90deg, #D4256A 0%, rgba(212,37,106,0.4) 40%, transparent 100%)',
        }} />

        {/* Content */}
        <div style={{
          fontSize: '0.625rem',
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: '#D4256A',
          fontWeight: 600,
          marginBottom: '0.75rem',
          opacity: 0.85,
        }}>
          Producción · Sistema de control
        </div>
        <h1 style={{
          fontFamily: 'Bebas Neue, Impact, sans-serif',
          fontSize: 'clamp(3.5rem, 7vw, 5.5rem)',
          letterSpacing: '0.04em',
          color: '#F0EBE1',
          lineHeight: 0.9,
          marginBottom: '1rem',
        }}>
          CONTINUIDAD
        </h1>
        <p style={{ fontSize: '0.9375rem', color: 'rgba(240,235,225,0.45)', maxWidth: '480px' }}>
          Canon visual y narrativo consistente a lo largo de los 50 episodios de Los Prodigios.
        </p>

        {/* Stats chips */}
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
          {[
            { value: '6', label: 'Módulos' },
            { value: '50', label: 'Episodios' },
            { value: '5', label: 'Temporadas' },
          ].map((s) => (
            <div key={s.label} style={{ display: 'flex', alignItems: 'baseline', gap: '0.375rem' }}>
              <span style={{ fontFamily: 'Bebas Neue, Impact, sans-serif', fontSize: '1.25rem', color: '#D4256A', letterSpacing: '0.04em' }}>
                {s.value}
              </span>
              <span style={{ fontSize: '0.625rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(240,235,225,0.35)', fontWeight: 600 }}>
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── MARQUEE STRIP ────────────────────────────────────────────────── */}
      <div style={{ background: '#D4256A', overflow: 'hidden', padding: '0.55rem 0' }}>
        <div style={{ display: 'inline-block', whiteSpace: 'nowrap', animation: 'marquee 24s linear infinite' }}>
          <span style={{ fontFamily: 'Bebas Neue, Impact, sans-serif', fontSize: '0.9375rem', letterSpacing: '0.14em', color: '#F0EBE1' }}>
            {Array(8).fill('CANON LOG\u2003—\u2003TIMELINE\u2003—\u2003ISSUES\u2003—\u2003ESTADOS\u2003—\u2003PROPS\u2003—\u2003LOCACIONES\u2003—\u2003PERSONAJES\u2003—\u2003').join('')}
          </span>
        </div>
      </div>

      {/* ── BODY ─────────────────────────────────────────────────────────── */}
      <div style={{ padding: '2rem 2.5rem 3rem', maxWidth: '1100px' }}>

        {/* Rule banner */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          alignItems: 'flex-start',
          padding: '1rem 1.25rem',
          background: 'rgba(245,165,42,0.04)',
          border: '1px solid rgba(245,165,42,0.10)',
          borderLeft: '3px solid rgba(245,165,42,0.5)',
          borderRadius: '0 4px 4px 0',
          marginBottom: '2.5rem',
        }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#F5A52A" strokeWidth="1.5" style={{ flexShrink: 0, marginTop: '2px' }}>
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <div>
            <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'rgba(245,165,42,0.8)', marginBottom: '0.2rem', letterSpacing: '0.01em' }}>
              Regla de operación
            </p>
            <p style={{ fontSize: '0.8125rem', color: 'rgba(240,235,225,0.38)', lineHeight: 1.6 }}>
              Actualizar el sistema después de cada episodio antes de avanzar al siguiente.
              Usa el Asistente con contexto <em>Continuidad</em> para registrar cambios.
            </p>
          </div>
        </div>

        {/* Modules grid */}
        <div style={{
          fontSize: '0.625rem',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: 'rgba(240,235,225,0.30)',
          fontWeight: 600,
          marginBottom: '1rem',
        }}>
          Módulos de control
        </div>

        <div
          className="grid grid-cols-1 md:grid-cols-3"
          style={{ gap: '0.875rem', marginBottom: '2.5rem' }}
        >
          {MODULES.map((mod) => {
            const row = moduleData[mod.module_key]
            const hasContent = hasRealContent(row?.content)
            const dotColor = loading
              ? 'rgba(240,235,225,0.1)'
              : hasContent
              ? '#4ECDC4'
              : 'rgba(240,235,225,0.2)'
            const statusLabel = loading
              ? '…'
              : hasContent
              ? 'Activo'
              : 'Sin datos'

            return (
              <div
                key={mod.module_key}
                className="card-enter"
                style={{
                  position: 'relative',
                  background: '#0D0920',
                  border: '1px solid rgba(245,165,42,0.07)',
                  borderTop: `2px solid ${mod.accent}`,
                  borderRadius: '4px',
                  padding: '1.375rem 1.25rem 1.125rem',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.625rem',
                }}
              >
                {/* Background number */}
                <div style={{
                  position: 'absolute',
                  right: '-4px',
                  bottom: '-12px',
                  fontFamily: 'Bebas Neue, Impact, sans-serif',
                  fontSize: '6rem',
                  letterSpacing: '-0.04em',
                  color: mod.accent,
                  opacity: 0.05,
                  lineHeight: 1,
                  userSelect: 'none',
                  pointerEvents: 'none',
                }}>
                  {mod.num}
                </div>

                {/* Type label */}
                <div style={{
                  fontSize: '0.5625rem',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: mod.accent,
                  fontWeight: 600,
                  opacity: 0.75,
                }}>
                  {mod.type}
                </div>

                {/* Title */}
                <h2 style={{
                  fontFamily: 'Bebas Neue, Impact, sans-serif',
                  fontSize: '1.5rem',
                  letterSpacing: '0.04em',
                  color: '#F0EBE1',
                  lineHeight: 1,
                }}>
                  {mod.title}
                </h2>

                {/* Description */}
                <p style={{ fontSize: '0.8125rem', color: 'rgba(240,235,225,0.42)', lineHeight: 1.6, flex: 1 }}>
                  {mod.description}
                </p>

                {/* Items */}
                {mod.items.length > 0 && (
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                    {mod.items.map((item) => (
                      <li key={item} style={{ fontSize: '0.6875rem', color: 'rgba(240,235,225,0.28)', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                        <span style={{ color: mod.accent, opacity: 0.5 }}>—</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                )}

                {/* Footer */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: '0.75rem',
                  borderTop: '1px solid rgba(245,165,42,0.05)',
                  marginTop: '0.25rem',
                  gap: '0.5rem',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', minWidth: 0 }}>
                    <div style={{
                      width: '5px',
                      height: '5px',
                      borderRadius: '50%',
                      background: dotColor,
                      flexShrink: 0,
                      transition: 'background 0.3s',
                    }} />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem', minWidth: 0 }}>
                      <span style={{ fontSize: '0.625rem', color: 'rgba(240,235,225,0.35)', letterSpacing: '0.08em' }}>
                        {statusLabel}
                      </span>
                      {!loading && row?.updated_at && (
                        <span style={{ fontSize: '0.5625rem', color: 'rgba(240,235,225,0.2)', fontFamily: 'monospace' }}>
                          {formatDate(row.updated_at)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Ver / Editar button */}
                  <button
                    onClick={() => setActiveModal(mod)}
                    style={{
                      background: 'transparent',
                      border: `1px solid ${mod.accent}28`,
                      borderRadius: '3px',
                      color: mod.accent,
                      fontSize: '0.5625rem',
                      fontWeight: 700,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      padding: '0.3rem 0.625rem',
                      cursor: 'pointer',
                      flexShrink: 0,
                      transition: 'border-color 0.2s, background 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = `${mod.accent}14`
                      e.currentTarget.style.borderColor = `${mod.accent}60`
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent'
                      e.currentTarget.style.borderColor = `${mod.accent}28`
                    }}
                  >
                    Ver / Editar
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {/* CTA */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1.5rem',
          padding: '1.375rem 1.5rem',
          background: '#120D28',
          border: '1px solid rgba(212,37,106,0.12)',
          borderRadius: '4px',
          marginBottom: '2.5rem',
          flexWrap: 'wrap',
        }}>
          <div>
            <p style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#F0EBE1', marginBottom: '0.25rem' }}>
              Supervisor de Continuidad
            </p>
            <p style={{ fontSize: '0.8125rem', color: 'rgba(240,235,225,0.40)' }}>
              Usa el Asistente en modo Continuidad para registrar cambios de un episodio o resolver inconsistencias.
            </p>
          </div>
          <Link
            href="/studio?context=continuidad"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.625rem 1.375rem',
              background: '#D4256A',
              borderRadius: '4px',
              color: '#F0EBE1',
              fontSize: '0.875rem',
              fontWeight: 600,
              textDecoration: 'none',
              whiteSpace: 'nowrap',
              flexShrink: 0,
              letterSpacing: '0.01em',
            }}
          >
            Abrir Asistente
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Saved documents */}
        <div style={{
          fontSize: '0.625rem',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: 'rgba(240,235,225,0.30)',
          fontWeight: 600,
          marginBottom: '1rem',
        }}>
          Registros guardados
        </div>
        <DocumentsList area="continuidad" emptyLabel="registros" />
      </div>

      {/* ── MODAL ────────────────────────────────────────────────────────── */}
      {activeModal && (
        <EditModal
          module={activeModal}
          initialContent={moduleData[activeModal.module_key]?.content ?? ''}
          onClose={() => setActiveModal(null)}
          onSave={handleSave}
        />
      )}
    </div>
  )
}
