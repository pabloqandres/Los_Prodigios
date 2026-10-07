'use client'

import React, { useState, useEffect, useRef } from 'react'
import type { AssetSlotWithApprovals, ValidationResult, CanonCheck } from '@/lib/supabase'
import { storageUrl } from '@/lib/supabase'

interface ApprovedRef {
  id: string
  version_label: string
  view_type: string
  age_version: string | null
  thumbnail_url: string
}

interface SessionRef {
  label: string
  b64: string
  preview: string // data URL
}

type Phase = 'checking' | 'needs-refs' | 'scanning' | 'result'

interface Props {
  slot: AssetSlotWithApprovals
  canonicalFields: Record<string, string>
  onClose: () => void
  onResult: (result: ValidationResult) => void
  initialResult?: ValidationResult
}

const VERDICT_CONFIG = {
  ok:       { label: 'CANON CONSISTENTE', color: '#4ECDC4', bg: 'rgba(78,205,196,0.08)' },
  warning:  { label: 'ADVERTENCIAS',      color: '#F5A52A', bg: 'rgba(245,165,42,0.08)' },
  critical: { label: 'ERROR CRÍTICO',     color: '#D4256A', bg: 'rgba(212,37,106,0.08)' },
}

const STATUS_ICON = { ok: '✓', warning: '⚠', error: '✕' }
const STATUS_COLOR = { ok: '#4ECDC4', warning: '#F5A52A', error: '#D4256A' }

const CHECKS_BY_CATEGORY: Record<string, { id: string; label: string }[]> = {
  personajes: [
    { id: 'identidad',        label: 'Identidad del personaje' },
    { id: 'edad_apariencia',  label: 'Edad y complexión' },
    { id: 'tono_piel',        label: 'Tono de piel' },
    { id: 'pelo',             label: 'Color y estilo de pelo' },
    { id: 'ojos',             label: 'Color de ojos' },
    { id: 'outfit',           label: 'Outfit del slot' },
    { id: 'accesorios_clave', label: 'Accesorios canónicos' },
    { id: 'estilo_visual',    label: 'Estilo 2D cel-shaded' },
    { id: 'proporciones',     label: 'Proporciones y silueta' },
  ],
  locaciones: [
    { id: 'ambiente_general', label: 'Ambiente general' },
    { id: 'paleta_color',     label: 'Paleta de color' },
    { id: 'iluminacion',      label: 'Iluminación' },
    { id: 'elementos_clave',  label: 'Elementos clave' },
    { id: 'estilo_visual',    label: 'Estilo 2D cel-shaded' },
  ],
  props: [
    { id: 'forma_general',    label: 'Forma general' },
    { id: 'materiales',       label: 'Materiales' },
    { id: 'colores',          label: 'Colores' },
    { id: 'detalles_clave',   label: 'Detalles clave' },
    { id: 'estilo_visual',    label: 'Estilo 2D cel-shaded' },
  ],
  criaturas: [
    { id: 'morfologia',           label: 'Morfología' },
    { id: 'tono_piel_o_pelaje',   label: 'Piel o pelaje' },
    { id: 'elementos_clave',      label: 'Elementos clave' },
    { id: 'estilo_visual',        label: 'Estilo 2D cel-shaded' },
  ],
  secundarios: [
    { id: 'identidad',        label: 'Identidad del personaje' },
    { id: 'tono_piel',        label: 'Tono de piel' },
    { id: 'pelo',             label: 'Color y estilo de pelo' },
    { id: 'outfit',           label: 'Outfit característico' },
    { id: 'estilo_visual',    label: 'Estilo 2D cel-shaded' },
    { id: 'proporciones',     label: 'Proporciones y silueta' },
  ],
  mascotas: [
    { id: 'morfologia',           label: 'Morfología y especie' },
    { id: 'tono_piel_o_pelaje',   label: 'Pelaje / textura' },
    { id: 'elementos_clave',      label: 'Elementos clave' },
    { id: 'expresion',            label: 'Expresión y carácter' },
    { id: 'estilo_visual',        label: 'Estilo 2D cel-shaded' },
  ],
  simbolos: [
    { id: 'forma_general',        label: 'Forma y estructura' },
    { id: 'tipografia',           label: 'Tipografía y texto' },
    { id: 'colores',              label: 'Paleta de color' },
    { id: 'detalles_clave',       label: 'Detalles y elementos clave' },
    { id: 'legibilidad',          label: 'Legibilidad y claridad' },
    { id: 'consistencia_marca',   label: 'Consistencia de marca' },
  ],
}

function ScoreCircle({ score, verdict }: { score: number; verdict: 'ok' | 'warning' | 'critical' }) {
  const color = VERDICT_CONFIG[verdict].color
  const r = 28
  const circ = 2 * Math.PI * r
  const offset = circ - (score / 100) * circ

  return (
    <div style={{ position: 'relative', width: 72, height: 72, flexShrink: 0 }}>
      <svg width={72} height={72} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={36} cy={36} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={5} />
        <circle
          cx={36} cy={36} r={r} fill="none"
          stroke={color} strokeWidth={5}
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.8s ease' }}
        />
      </svg>
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
      }}>
        <span style={{ fontSize: '1.1rem', fontWeight: 700, color, fontFamily: 'Bebas Neue, Impact, sans-serif', lineHeight: 1 }}>
          {score}
        </span>
        <span style={{ fontSize: '0.45rem', color: 'rgba(240,235,225,0.3)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          score
        </span>
      </div>
    </div>
  )
}

function PulsingDot() {
  return (
    <span style={{
      display: 'inline-block', width: 6, height: 6, borderRadius: '50%',
      background: 'rgba(245,165,42,0.6)',
      animation: 'pulse 1s ease-in-out infinite',
    }} />
  )
}

function CheckRow({ check, scanning }: { check: CanonCheck | { id: string; label: string }; scanning: boolean }): React.ReactElement {
  const [expanded, setExpanded] = useState(!scanning && (check as CanonCheck).status !== 'ok')

  if (scanning) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.04)',
      }}>
        <PulsingDot />
        <span style={{ fontSize: '0.75rem', color: 'rgba(240,235,225,0.4)', flex: 1 }}>
          {check.label}
        </span>
        <span style={{ fontSize: '0.6rem', color: 'rgba(240,235,225,0.2)', fontFamily: 'monospace' }}>···</span>
      </div>
    )
  }

  const c = check as CanonCheck
  const icon = STATUS_ICON[c.status]
  const color = STATUS_COLOR[c.status]

  return (
    <div style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', padding: '4px 0' }}>
      <div
        style={{
          display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0',
          cursor: c.detail ? 'pointer' : 'default',
        }}
        onClick={() => c.detail && setExpanded(e => !e)}
      >
        <span style={{
          width: 18, height: 18, borderRadius: '50%',
          background: `${color}18`, border: `1px solid ${color}44`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '0.6rem', color, fontWeight: 700, flexShrink: 0,
        }}>
          {icon}
        </span>
        <span style={{ fontSize: '0.75rem', color: 'rgba(240,235,225,0.8)', flex: 1 }}>
          {c.label}
        </span>
        {c.status !== 'ok' && (
          <span style={{ fontSize: '0.5rem', color: 'rgba(240,235,225,0.25)' }}>
            {expanded ? '▲' : '▼'}
          </span>
        )}
      </div>
      {expanded && c.detail && (
        <div style={{ paddingLeft: 26, paddingBottom: 6 }}>
          <p style={{ fontSize: '0.6875rem', color: 'rgba(240,235,225,0.55)', margin: '0 0 4px', lineHeight: 1.5 }}>
            {c.detail}
          </p>
          {c.canon_rule && (
            <p style={{
              fontSize: '0.625rem', color: `${color}99`,
              margin: 0, lineHeight: 1.4,
              borderLeft: `2px solid ${color}44`, paddingLeft: 6,
              fontStyle: 'italic',
            }}>
              Regla: {c.canon_rule}
            </p>
          )}
        </div>
      )}
    </div>
  )
}

export default function CanonValidatorModal({ slot, canonicalFields, onClose, onResult, initialResult }: Props) {
  const [phase, setPhase] = useState<Phase>(initialResult ? 'result' : 'checking')
  const [approvedRefs, setApprovedRefs] = useState<ApprovedRef[]>([])
  const [sessionRefs, setSessionRefs] = useState<SessionRef[]>([])
  const [result, setResult] = useState<ValidationResult | null>(initialResult ?? null)
  const [error, setError] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const scanCalledRef = useRef(false)

  const thumbUrl = storageUrl(slot.pending_drive_file_id)
  const placeholderChecks = CHECKS_BY_CATEGORY[slot.category] ?? CHECKS_BY_CATEGORY.personajes
  const verdictCfg = result ? VERDICT_CONFIG[result.verdict] : null

  // Phase 'checking': fetch approved refs
  useEffect(() => {
    if (initialResult) return
    async function checkRefs() {
      try {
        const res = await fetch(`/api/assets/approved?entity_name=${encodeURIComponent(slot.entity_name)}`)
        const data = await res.json()
        const refs: ApprovedRef[] = Array.isArray(data) ? data : []
        if (refs.length > 0) {
          setApprovedRefs(refs)
          setPhase('scanning')
        } else {
          setPhase('needs-refs')
        }
      } catch {
        // On error, go straight to needs-refs
        setPhase('needs-refs')
      }
    }
    checkRefs()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slot.entity_name])

  // Phase 'scanning': call validate-canon API
  useEffect(() => {
    if (phase !== 'scanning') return
    if (scanCalledRef.current) return
    scanCalledRef.current = true

    let cancelled = false
    async function validate() {
      try {
        const body: { canonical_fields: Record<string, string>; session_refs?: { label: string; b64: string }[] } = {
          canonical_fields: canonicalFields,
        }
        if (sessionRefs.length > 0) {
          body.session_refs = sessionRefs.map(r => ({ label: r.label, b64: r.b64 }))
        }

        const res = await fetch(`/api/assets/slots/${slot.id}/validate-canon`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })
        if (cancelled) return
        let data: Record<string, unknown>
        try {
          data = await res.json()
        } catch {
          setError(`Error del servidor (${res.status}) — respuesta no válida`)
          setPhase('result')
          return
        }
        if (!res.ok) {
          setError((data.error as string) ?? `Error ${res.status} al validar el canon`)
          setPhase('result')
          return
        }
        setResult(data as unknown as ValidationResult)
        setPhase('result')
        onResult(data as unknown as ValidationResult)
      } catch (e) {
        if (!cancelled) {
          setError(`Error de conexión: ${String(e)}`)
          setPhase('result')
        }
      }
    }
    validate()
    return () => { cancelled = true }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, Object.keys(canonicalFields).length])

  function startScanWithSessionRefs() {
    scanCalledRef.current = false
    setPhase('scanning')
  }

  function startScanWithoutRefs() {
    setSessionRefs([])
    scanCalledRef.current = false
    setPhase('scanning')
  }

  async function addRefFiles(files: FileList | File[]) {
    const arr = Array.from(files).slice(0, 5 - sessionRefs.length)
    for (const file of arr) {
      const b64 = await fileToBase64(file)
      // canvas output is always JPEG
      const preview = `data:image/jpeg;base64,${b64}`
      setSessionRefs(prev => [
        ...prev,
        { label: `Referencia ${prev.length + 1}`, b64, preview },
      ])
    }
  }

  function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        const dataUrl = reader.result as string
        const img = new Image()
        img.onload = () => {
          const MAX = 1024
          const scale = Math.min(1, MAX / Math.max(img.width, img.height))
          const w = Math.round(img.width * scale)
          const h = Math.round(img.height * scale)
          const canvas = document.createElement('canvas')
          canvas.width = w
          canvas.height = h
          const ctx = canvas.getContext('2d')
          if (!ctx) { resolve(dataUrl.split(',')[1] ?? dataUrl); return }
          ctx.drawImage(img, 0, 0, w, h)
          const compressed = canvas.toDataURL('image/jpeg', 0.85)
          resolve(compressed.split(',')[1] ?? compressed)
        }
        img.onerror = reject
        img.src = dataUrl
      }
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  function removeSessionRef(index: number) {
    setSessionRefs(prev => prev.filter((_, i) => i !== index))
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files.length > 0) addRefFiles(e.dataTransfer.files)
  }

  return (
    <>
      <style>{`
        @keyframes pulse { 0%,100% { opacity: 0.3 } 50% { opacity: 1 } }
        @keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }
        @keyframes fadeIn { from { opacity: 0; transform: scale(0.97) } to { opacity: 1; transform: scale(1) } }
      `}</style>

      {/* Backdrop */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 600,
        background: 'rgba(6,4,15,0.75)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '2rem',
      }}>
        {/* Modal */}
        <div style={{
          background: '#0D0920',
          border: `1px solid ${verdictCfg ? verdictCfg.color + '33' : 'rgba(245,165,42,0.2)'}`,
          borderRadius: '10px',
          width: '100%', maxWidth: 560,
          maxHeight: '85vh',
          display: 'flex', flexDirection: 'column',
          animation: 'fadeIn 0.2s ease',
          overflow: 'hidden',
        }}>

          {/* Header */}
          <div style={{
            padding: '16px 20px',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <div style={{ flex: 1 }}>
              <div style={{
                fontSize: '0.5rem', letterSpacing: '0.2em', textTransform: 'uppercase',
                color: 'rgba(240,235,225,0.3)', marginBottom: 2, fontFamily: 'IBM Plex Sans, sans-serif',
              }}>
                Validador de Canon
              </div>
              <div style={{
                fontFamily: 'Bebas Neue, Impact, sans-serif',
                fontSize: '1.25rem', letterSpacing: '0.06em', color: '#F0EBE1',
              }}>
                Escáner de Canon
              </div>
            </div>
            <button
              onClick={onClose}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(240,235,225,0.3)', fontSize: '1rem', padding: 4 }}
            >✕</button>
          </div>

          {/* Body */}
          <div style={{ flex: 1, overflow: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Slot info + thumbnail */}
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              {thumbUrl && (
                <div style={{
                  width: 72, height: 72, borderRadius: 6, overflow: 'hidden',
                  border: '1px solid rgba(255,255,255,0.08)', flexShrink: 0,
                }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={thumbUrl} alt={slot.version_label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              )}
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'rgba(240,235,225,0.85)', marginBottom: 2 }}>
                  {slot.version_label}
                </div>
                <div style={{ fontSize: '0.6875rem', color: 'rgba(240,235,225,0.4)' }}>
                  {slot.entity_label} · {slot.view_type}
                </div>
                {phase === 'checking' && (
                  <div style={{ fontSize: '0.6875rem', color: 'rgba(245,165,42,0.6)', marginTop: 4 }}>
                    Buscando referencias aprobadas...
                  </div>
                )}
                {phase === 'scanning' && (
                  <div style={{ fontSize: '0.6875rem', color: '#F5A52A', marginTop: 4 }}>
                    {approvedRefs.length > 0
                      ? `Comparando contra ${approvedRefs.length} referencia${approvedRefs.length > 1 ? 's' : ''} aprobada${approvedRefs.length > 1 ? 's' : ''}...`
                      : sessionRefs.length > 0
                        ? `Comparando contra ${sessionRefs.length} referencia${sessionRefs.length > 1 ? 's' : ''} de sesión...`
                        : 'Comparando contra el canon visual...'}
                  </div>
                )}
              </div>

              {/* Score circle — only when result is ready */}
              {result && (
                <div style={{ marginLeft: 'auto' }}>
                  <ScoreCircle score={result.score} verdict={result.verdict} />
                </div>
              )}
            </div>

            {/* ─── PHASE: checking ─── */}
            {phase === 'checking' && (
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '32px 0', gap: 10,
              }}>
                <div style={{
                  width: 18, height: 18, borderRadius: '50%',
                  border: '2px solid rgba(245,165,42,0.3)',
                  borderTopColor: '#F5A52A',
                  animation: 'spin 0.8s linear infinite',
                  flexShrink: 0,
                }} />
                <span style={{ fontSize: '0.75rem', color: 'rgba(240,235,225,0.5)' }}>
                  Buscando referencias aprobadas...
                </span>
              </div>
            )}

            {/* ─── PHASE: needs-refs ─── */}
            {phase === 'needs-refs' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{
                  padding: '10px 14px',
                  background: 'rgba(245,165,42,0.05)',
                  border: '1px solid rgba(245,165,42,0.15)',
                  borderRadius: 6,
                }}>
                  <div style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'rgba(240,235,225,0.7)', marginBottom: 3 }}>
                    Sin referencias aprobadas
                  </div>
                  <p style={{ fontSize: '0.6rem', color: 'rgba(240,235,225,0.4)', margin: 0, lineHeight: 1.5 }}>
                    No hay imágenes aprobadas de <strong style={{ color: 'rgba(240,235,225,0.6)' }}>{slot.entity_label}</strong> aún.
                    Puedes subir referencias visuales para una validación más precisa, o escanear solo con el canon textual.
                  </p>
                </div>

                {/* Session refs grid */}
                {sessionRefs.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {sessionRefs.map((ref, i) => (
                      <div key={i} style={{ position: 'relative', width: 72, height: 72 }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={ref.preview}
                          alt={ref.label}
                          style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 5, border: '1px solid rgba(255,255,255,0.1)' }}
                        />
                        <button
                          onClick={() => removeSessionRef(i)}
                          style={{
                            position: 'absolute', top: -5, right: -5,
                            width: 18, height: 18, borderRadius: '50%',
                            background: '#D4256A', border: 'none',
                            color: '#fff', fontSize: '0.55rem', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            lineHeight: 1,
                          }}
                        >✕</button>
                        <div style={{
                          position: 'absolute', bottom: 0, left: 0, right: 0,
                          background: 'rgba(0,0,0,0.6)', borderRadius: '0 0 5px 5px',
                          fontSize: '0.45rem', color: 'rgba(255,255,255,0.6)',
                          padding: '2px 4px', textAlign: 'center',
                        }}>
                          {ref.label}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Drop zone */}
                {sessionRefs.length < 5 && (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={e => { e.preventDefault(); setIsDragging(true) }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    style={{
                      border: `1px dashed ${isDragging ? '#F5A52A' : 'rgba(255,255,255,0.12)'}`,
                      borderRadius: 6,
                      padding: '16px',
                      textAlign: 'center',
                      cursor: 'pointer',
                      background: isDragging ? 'rgba(245,165,42,0.04)' : 'transparent',
                      transition: 'all 0.15s',
                    }}
                  >
                    <div style={{ fontSize: '1.2rem', marginBottom: 4, opacity: 0.4 }}>+</div>
                    <div style={{ fontSize: '0.65rem', color: 'rgba(240,235,225,0.4)' }}>
                      Arrastra referencias aquí o haz clic para seleccionar
                    </div>
                    <div style={{ fontSize: '0.55rem', color: 'rgba(240,235,225,0.25)', marginTop: 2 }}>
                      Máx. {5 - sessionRefs.length} imagen{5 - sessionRefs.length !== 1 ? 'es' : ''} más
                    </div>
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  style={{ display: 'none' }}
                  onChange={e => { if (e.target.files) addRefFiles(e.target.files) }}
                />

                {/* Approved refs thumbnails (if scanning with approved) */}
              </div>
            )}

            {/* ─── PHASE: scanning — reference thumbnails ─── */}
            {phase === 'scanning' && (approvedRefs.length > 0 || sessionRefs.length > 0) && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ fontSize: '0.5rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(240,235,225,0.25)', fontFamily: 'IBM Plex Sans, sans-serif' }}>
                  Referencias en uso
                </div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {approvedRefs.slice(0, 5).map(ref => (
                    <div key={ref.id} style={{ position: 'relative', width: 48, height: 48 }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={ref.thumbnail_url}
                        alt={ref.version_label}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 4, border: '1px solid rgba(78,205,196,0.2)' }}
                      />
                      <div style={{
                        position: 'absolute', bottom: 0, left: 0, right: 0,
                        background: 'rgba(0,0,0,0.65)', borderRadius: '0 0 4px 4px',
                        fontSize: '0.4rem', color: 'rgba(255,255,255,0.5)',
                        padding: '1px 3px', textAlign: 'center', lineHeight: 1.4,
                      }}>
                        {ref.view_type}
                      </div>
                    </div>
                  ))}
                  {sessionRefs.map((ref, i) => (
                    <div key={`s-${i}`} style={{ position: 'relative', width: 48, height: 48 }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={ref.preview}
                        alt={ref.label}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 4, border: '1px solid rgba(245,165,42,0.2)' }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Verdict badge */}
            {phase === 'result' && result && verdictCfg && (
              <div style={{
                padding: '8px 14px',
                background: verdictCfg.bg,
                border: `1px solid ${verdictCfg.color}33`,
                borderRadius: 6,
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <span style={{ fontSize: '0.875rem', fontWeight: 700, color: verdictCfg.color }}>
                  {verdictCfg.label}
                </span>
                {result.blocked && (
                  <span style={{ fontSize: '0.6rem', color: '#D4256A', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    · Aprobación bloqueada
                  </span>
                )}
              </div>
            )}

            {/* Error state */}
            {error && (
              <div style={{
                padding: '10px 14px', background: 'rgba(212,37,106,0.08)',
                border: '1px solid rgba(212,37,106,0.2)', borderRadius: 6,
                fontSize: '0.75rem', color: '#D4256A',
              }}>
                {error}
              </div>
            )}

            {/* Checklist — scanning placeholder or real results */}
            {(phase === 'scanning' || phase === 'result') && (
              <div>
                <div style={{
                  fontSize: '0.5rem', letterSpacing: '0.14em', textTransform: 'uppercase',
                  color: 'rgba(240,235,225,0.25)', marginBottom: 8, fontFamily: 'IBM Plex Sans, sans-serif',
                }}>
                  Checks de canon
                </div>
                <div>
                  {phase === 'result' && result
                    ? result.checks.map(check => (
                        <CheckRow key={check.id} check={check} scanning={false} />
                      ))
                    : placeholderChecks.map(check => (
                        <CheckRow key={check.id} check={check} scanning={true} />
                      ))
                  }
                </div>
              </div>
            )}

            {/* Suggestion */}
            {result?.suggestion && (
              <div style={{
                padding: '10px 14px',
                background: 'rgba(245,165,42,0.06)',
                border: '1px solid rgba(245,165,42,0.2)',
                borderRadius: 6,
              }}>
                <div style={{ fontSize: '0.5rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#F5A52A', marginBottom: 4 }}>
                  Sugerencia de corrección
                </div>
                <p style={{ fontSize: '0.6875rem', color: 'rgba(240,235,225,0.65)', margin: 0, lineHeight: 1.5 }}>
                  {result.suggestion}
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div style={{
            padding: '12px 20px',
            borderTop: '1px solid rgba(255,255,255,0.06)',
            display: 'flex', gap: 8, justifyContent: 'flex-end', alignItems: 'center',
          }}>
            {phase === 'needs-refs' ? (
              <>
                <button
                  onClick={onClose}
                  style={{
                    padding: '7px 14px', background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.1)', borderRadius: 4,
                    color: 'rgba(240,235,225,0.4)', fontSize: '0.7rem', cursor: 'pointer',
                    fontFamily: 'IBM Plex Sans, sans-serif',
                  }}
                >
                  Cancelar
                </button>
                <button
                  onClick={startScanWithoutRefs}
                  style={{
                    padding: '7px 14px', background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.12)', borderRadius: 4,
                    color: 'rgba(240,235,225,0.6)', fontSize: '0.7rem', cursor: 'pointer',
                    fontFamily: 'IBM Plex Sans, sans-serif',
                  }}
                >
                  Escanear sin referencias
                </button>
                {sessionRefs.length > 0 && (
                  <button
                    onClick={startScanWithSessionRefs}
                    style={{
                      padding: '7px 14px', background: 'rgba(245,165,42,0.1)',
                      border: '1px solid rgba(245,165,42,0.3)', borderRadius: 4,
                      color: '#F5A52A', fontSize: '0.7rem', fontWeight: 600, cursor: 'pointer',
                      fontFamily: 'IBM Plex Sans, sans-serif',
                    }}
                  >
                    Escanear con {sessionRefs.length} referencia{sessionRefs.length > 1 ? 's' : ''} →
                  </button>
                )}
              </>
            ) : (
              <>
                <button
                  onClick={onClose}
                  style={{
                    padding: '7px 16px', background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.1)', borderRadius: 4,
                    color: 'rgba(240,235,225,0.5)', fontSize: '0.75rem', cursor: 'pointer',
                    fontFamily: 'IBM Plex Sans, sans-serif',
                  }}
                >
                  Cerrar
                </button>
                {phase === 'result' && result && !result.blocked && (
                  <button
                    onClick={onClose}
                    style={{
                      padding: '7px 16px', background: 'rgba(78,205,196,0.1)',
                      border: '1px solid rgba(78,205,196,0.3)', borderRadius: 4,
                      color: '#4ECDC4', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer',
                      fontFamily: 'IBM Plex Sans, sans-serif',
                    }}
                  >
                    Proceder a revisión →
                  </button>
                )}
                {phase === 'result' && result?.blocked && (
                  <div style={{
                    padding: '7px 14px', background: 'rgba(212,37,106,0.06)',
                    border: '1px solid rgba(212,37,106,0.2)', borderRadius: 4,
                    color: '#D4256A', fontSize: '0.6875rem',
                  }}>
                    Corrige los errores críticos para habilitar la aprobación
                  </div>
                )}
              </>
            )}
          </div>

        </div>
      </div>
    </>
  )
}
