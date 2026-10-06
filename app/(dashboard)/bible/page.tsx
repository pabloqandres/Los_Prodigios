'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

const ALL_CATEGORIES = [
  { key: 'personajes', label: 'Personajes' },
  { key: 'arte', label: 'Arte' },
  { key: 'guion', label: 'Guión' },
  { key: 'continuidad', label: 'Continuidad' },
  { key: 'marketing', label: 'Marketing' },
  { key: 'merchandise', label: 'Merchandise' },
  { key: 'trailers', label: 'Trailers' },
  { key: 'redes', label: 'Redes' },
  { key: 'licensing', label: 'Licensing' },
  { key: 'general', label: 'General' },
]

// Palette of accent colors for book spines — editorial choice, independent of categories
const ACCENT_COLORS = [
  { value: '#F5A52A', label: 'Dorado'   },
  { value: '#4ECDC4', label: 'Teal'     },
  { value: '#9B6FD4', label: 'Púrpura'  },
  { value: '#D4256A', label: 'Crimson'  },
  { value: '#4A8FE8', label: 'Azul'     },
  { value: '#F0EBE1', label: 'Marfil'   },
  { value: '#8BC34A', label: 'Verde'    },
  { value: '#FF5722', label: 'Naranja'  },
]

// Keep for category tag colors in modals
const SPINE_COLORS: Record<string, { stripe: string }> = {
  personajes:  { stripe: '#4A8FE8' },
  arte:        { stripe: '#4ECDC4' },
  guion:       { stripe: '#9B6FD4' },
  continuidad: { stripe: '#D4256A' },
  marketing:   { stripe: '#F5A52A' },
  merchandise: { stripe: '#8BC34A' },
  trailers:    { stripe: '#FF5722' },
  redes:       { stripe: '#29B6F6' },
  licensing:   { stripe: '#66BB6A' },
  general:     { stripe: '#F5A52A' },
}

function getSpineStyle(accentColor: string) {
  const c = accentColor || '#9B6FD4'
  return {
    bg:     `linear-gradient(180deg, color-mix(in srgb, ${c} 18%, #0D0920) 0%, color-mix(in srgb, ${c} 8%, #060410) 100%)`,
    stripe: c,
    text:   '#F0EBE1',
  }
}

type RefDoc = {
  id: string
  title: string
  description: string | null
  categories: string[]
  accent_color: string
  filename: string
  created_by: string
  created_at: string
  updated_at: string
}

type ChatMsg = { role: 'user' | 'assistant'; content: string }

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('es-CL', { day: 'numeric', month: 'short', year: 'numeric' })
}

// ── Upload modal ──────────────────────────────────────────────────────────────
function UploadModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [file, setFile] = useState<File | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [categories, setCategories] = useState<string[]>([])
  const [accentColor, setAccentColor] = useState('#9B6FD4')
  const [uploading, setUploading] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [error, setError] = useState('')
  const [storagePath, setStoragePath] = useState<string | null>(null)
  const [assetSuggestion, setAssetSuggestion] = useState<{
    category: string; entity_name: string; entity_label: string; confidence: number
  } | null>(null)
  const [createAssetSlots, setCreateAssetSlots] = useState(false)
  const [existingSlotCount, setExistingSlotCount] = useState<number | null>(null)
  const [expectedSlotCount, setExpectedSlotCount] = useState<number | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f) return
    setFile(f)
    setTitle(f.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '))
    setDescription('')
    setCategories([])
    setAssetSuggestion(null)
    setCreateAssetSlots(false)
    setExistingSlotCount(null)
    setExpectedSlotCount(null)
    setStoragePath(null)
    setError('')
    setAnalyzing(true)
    try {
      // 1. Get a signed upload URL from server (service role bypasses RLS) then PUT directly to Supabase
      const path = `docs/${Date.now()}_${f.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`
      const signedRes = await fetch('/api/assets/upload-signed-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path }),
      })
      if (!signedRes.ok) { setError('Error generando URL de subida'); return }
      const { signed_url } = await signedRes.json()
      const putRes = await fetch(signed_url, { method: 'PUT', body: f, headers: { 'Content-Type': f.type || 'application/octet-stream' } })
      if (!putRes.ok) { setError(`Error al subir archivo (${putRes.status})`); return }
      setStoragePath(path)

      // 2. Parse + analyze via API (reads from Storage, no file in body)
      const parseRes = await fetch('/api/parse-doc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ storage_path: path, filename: f.name }),
      })
      if (!parseRes.ok) { setError('Error al leer el documento'); return }
      const { text } = await parseRes.json()

      const analyzeRes = await fetch('/api/analyze-doc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, filename: f.name }),
      })
      if (analyzeRes.ok) {
        const data = await analyzeRes.json()
        setDescription(data.description ?? '')
        setCategories(data.categories ?? [])
        if (data.needs_assets && data.asset_entity_name) {
          const suggestion = {
            category: data.asset_category,
            entity_name: data.asset_entity_name,
            entity_label: data.asset_entity_label,
            confidence: data.asset_confidence,
          }
          setAssetSuggestion(suggestion)

          // Check existing slots and expected total in parallel
          const [existingRes, previewRes] = await Promise.all([
            fetch(`/api/assets/slots?entity_name=${encodeURIComponent(data.asset_entity_name)}`),
            fetch(`/api/assets/seed-checklist/preview?entity_name=${encodeURIComponent(data.asset_entity_name)}&category=${encodeURIComponent(data.asset_category)}`),
          ])
          if (existingRes.ok) {
            const existingData = await existingRes.json()
            setExistingSlotCount(Array.isArray(existingData) ? existingData.length : 0)
          }
          if (previewRes.ok) {
            const previewData = await previewRes.json()
            setExpectedSlotCount(previewData.total ?? null)
          }
          setCreateAssetSlots(true)
        }
      }
    } finally {
      setAnalyzing(false)
    }
  }

  function toggleCategory(key: string) {
    setCategories((prev) => prev.includes(key) ? prev.filter((c) => c !== key) : [...prev, key])
  }

  async function handleSubmit() {
    if (!file || !title.trim()) return
    setUploading(true)
    setError('')
    try {
      // If file wasn't analyzed yet (user skipped analysis), upload it now
      let path = storagePath
      if (!path) {
        path = `docs/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`
        const signedRes = await fetch('/api/assets/upload-signed-url', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ path }),
        })
        if (!signedRes.ok) { setError('Error generando URL de subida'); return }
        const { signed_url } = await signedRes.json()
        const putRes = await fetch(signed_url, { method: 'PUT', body: file, headers: { 'Content-Type': file.type || 'application/octet-stream' } })
        if (!putRes.ok) { setError(`Error al subir archivo (${putRes.status})`); return }
      }

      const res = await fetch('/api/reference-docs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          storage_path: path,
          filename: file.name,
          title: title.trim(),
          description: description.trim(),
          categories,
          accent_color: accentColor,
        }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Error al subir'); return }

      // Si el usuario confirmó crear slots de assets
      if (createAssetSlots && assetSuggestion) {
        await fetch('/api/assets/create-entity', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            category: assetSuggestion.category,
            entity_name: assetSuggestion.entity_name,
            entity_label: assetSuggestion.entity_label,
          }),
        })
      }

      onSuccess()
      onClose()
    } finally {
      setUploading(false)
    }
  }

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(8,6,15,0.92)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 300, padding: '1.5rem' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div style={{ background: '#120D28', border: '1px solid rgba(245,165,42,0.18)', borderRadius: '2px', width: '100%', maxWidth: '520px', maxHeight: '90vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid rgba(245,165,42,0.07)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontFamily: 'Bebas Neue, Impact, sans-serif', fontSize: '1.375rem', letterSpacing: '0.05em', color: '#F0EBE1' }}>Agregar a la biblioteca</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'rgba(240,235,225,0.35)', cursor: 'pointer', padding: '0.25rem' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div style={{ padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.125rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8125rem', color: 'rgba(240,235,225,0.5)', marginBottom: '0.5rem' }}>
              Archivo <span style={{ color: '#D4256A' }}>*</span>
            </label>
            <div
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: `2px dashed ${file ? 'rgba(78,205,196,0.35)' : 'rgba(245,165,42,0.15)'}`,
                borderRadius: '2px', padding: '1.5rem', textAlign: 'center', cursor: 'pointer',
                background: file ? 'rgba(78,205,196,0.04)' : 'rgba(245,165,42,0.02)',
                transition: 'all 0.15s ease',
              }}
            >
              {file ? (
                <div>
                  <div style={{ fontSize: '0.9rem', color: '#4ECDC4', fontWeight: 500 }}>{file.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'rgba(240,235,225,0.3)', marginTop: '0.25rem' }}>{(file.size / 1024).toFixed(0)} KB · click para cambiar</div>
                </div>
              ) : (
                <div>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(245,165,42,0.3)" strokeWidth="1" style={{ marginBottom: '0.5rem' }}>
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/>
                  </svg>
                  <div style={{ fontSize: '0.875rem', color: 'rgba(240,235,225,0.35)' }}>Click para seleccionar</div>
                  <div style={{ fontSize: '0.75rem', color: 'rgba(240,235,225,0.2)', marginTop: '0.25rem' }}>.docx · .txt · .md</div>
                </div>
              )}
            </div>
            <input ref={fileInputRef} type="file" accept=".docx,.txt,.md" onChange={handleFileChange} style={{ display: 'none' }} />
          </div>

          {/* Character template shortcut */}
          {!file && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ flex: 1, height: '1px', background: 'rgba(245,165,42,0.08)' }} />
              <span style={{ fontSize: '0.6875rem', color: 'rgba(240,235,225,0.2)', letterSpacing: '0.1em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>o crear desde template</span>
              <div style={{ flex: 1, height: '1px', background: 'rgba(245,165,42,0.08)' }} />
            </div>
          )}
          {!file && (
            <button
              onClick={() => {
                const name = prompt('Nombre del personaje:')
                if (!name?.trim()) return
                const templateContent = `# ${name.trim()} — Canon Visual

## Datos básicos
- **Nombre completo:** ${name.trim()}
- **Edad:**
- **Rol en la serie:**

## Rasgos físicos
- **Complexión:**
- **Altura:**
- **Tez / tono de piel:**
- **Pelo:** color, largo, textura, peinado
- **Ojos:** color y forma
- **Cejas:**
- **Mandíbula / estructura facial:**
- **Rasgos distintivos** (cicatrices, lunares, etc.):

## Vestuario canónico
- **Outfit principal:**
- **Colores dominantes:**
- **Calzado:**
- **Accesorios:**

## Distinción física vs otros personajes
> Esta sección es crítica para mantener consistencia entre personajes en generación de imágenes y video.

- **Vs. [Personaje A]:** [describe qué los diferencia físicamente]
- **Vs. [Personaje B]:** [describe qué los diferencia físicamente]

**Frase de ancla para prompts:**
"Physically distinct from [X]: [rasgo 1], [rasgo 2], [rasgo 3]"

**Negative prompt base:**
"NOT [otros personajes]: no [rasgo X], no [rasgo Y]"

## Paleta de color del personaje
- **Color dominante:**
- **Color de acento:**
- **Hex principal:**

## Energía y postura
- **Cómo se para y mueve:**
- **Expresión facial característica:**
- **Gestos típicos:**

## Notas para generación de imagen
- **Imagen de referencia aprobada:** (completar cuando exista)
- **Modelo base preferido:**
- **Palabras que lo anclan al universo visual:**
`
                const blob = new Blob([templateContent], { type: 'text/markdown' })
                const templateFile = new File([blob], `${name.trim().replace(/\s+/g, '_')}_canon.md`, { type: 'text/markdown' })
                setFile(templateFile)
                setTitle(`${name.trim()} — Canon Visual`)
                setDescription(`Documento canónico visual del personaje ${name.trim()}. Contiene rasgos físicos, vestuario, distinción vs otros personajes y notas para generación de imagen.`)
                setCategories(['personajes', 'arte'])
                setAccentColor('#4A8FE8')
              }}
              style={{ width: '100%', padding: '0.625rem', background: 'rgba(74,143,232,0.06)', border: '1px solid rgba(74,143,232,0.2)', borderRadius: '2px', color: 'rgba(74,143,232,0.8)', fontSize: '0.8125rem', cursor: 'pointer', fontFamily: 'IBM Plex Sans, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="8" r="4"/><path d="M6 20v-2a6 6 0 0112 0v2"/></svg>
              Crear canon de personaje desde template
            </button>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '0.8125rem', color: 'rgba(240,235,225,0.5)', marginBottom: '0.5rem' }}>
              Título <span style={{ color: '#D4256A' }}>*</span>
            </label>
            <input
              type="text" value={title} onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: Biblia Personajes T1, Guión Piloto v3..."
              style={{ width: '100%', background: '#1A1235', border: '1px solid rgba(245,165,42,0.12)', borderRadius: '2px', color: '#F0EBE1', fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '0.875rem', padding: '0.625rem 0.75rem', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          {analyzing && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', padding: '0.75rem 1rem', background: 'rgba(245,165,42,0.05)', border: '1px solid rgba(245,165,42,0.1)', borderRadius: '2px' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F5A52A" strokeWidth="2" style={{ animation: 'spin 1s linear infinite', flexShrink: 0 }}>
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
              </svg>
              <span style={{ fontSize: '0.8125rem', color: 'rgba(245,165,42,0.8)' }}>Analizando documento...</span>
            </div>
          )}

          {!analyzing && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <label style={{ fontSize: '0.8125rem', color: 'rgba(240,235,225,0.5)' }}>Descripción</label>
                {description && <span style={{ fontSize: '0.6875rem', color: 'rgba(78,205,196,0.6)', letterSpacing: '0.08em' }}>✓ generada por AI</span>}
              </div>
              <textarea
                value={description} onChange={(e) => setDescription(e.target.value)}
                placeholder={file ? 'Selecciona un archivo para generar automáticamente...' : 'Qué contiene este documento y para qué sirve...'}
                rows={2}
                style={{ width: '100%', background: '#1A1235', border: `1px solid ${description ? 'rgba(78,205,196,0.2)' : 'rgba(245,165,42,0.12)'}`, borderRadius: '2px', color: '#F0EBE1', fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '0.875rem', padding: '0.625rem 0.75rem', outline: 'none', resize: 'vertical', lineHeight: 1.5, boxSizing: 'border-box' }}
              />
            </div>
          )}

          {!analyzing && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.625rem' }}>
                <label style={{ fontSize: '0.8125rem', color: 'rgba(240,235,225,0.5)' }}>Áreas que afecta</label>
                {categories.length > 0 && <span style={{ fontSize: '0.6875rem', color: 'rgba(78,205,196,0.6)', letterSpacing: '0.08em' }}>✓ generadas por AI</span>}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
                {ALL_CATEGORIES.map((cat) => {
                  const active = categories.includes(cat.key)
                  const color = SPINE_COLORS[cat.key]?.stripe ?? '#F5A52A'
                  return (
                    <button
                      key={cat.key} onClick={() => toggleCategory(cat.key)}
                      style={{
                        padding: '0.3rem 0.75rem', borderRadius: '2px', fontSize: '0.75rem', cursor: 'pointer', fontFamily: 'IBM Plex Sans, sans-serif', transition: 'all 0.12s',
                        background: active ? `${color}22` : 'transparent',
                        border: `1px solid ${active ? color : 'rgba(245,165,42,0.1)'}`,
                        color: active ? color : 'rgba(240,235,225,0.4)',
                      }}
                    >
                      {cat.label}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Color picker */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8125rem', color: 'rgba(240,235,225,0.5)', marginBottom: '0.625rem' }}>Color del lomo</label>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {ACCENT_COLORS.map(({ value, label }) => (
                <button
                  key={value}
                  title={label}
                  onClick={() => setAccentColor(value)}
                  style={{
                    width: 28, height: 28, borderRadius: '50%', border: accentColor === value ? '2px solid #F0EBE1' : '2px solid transparent',
                    background: value, cursor: 'pointer', outline: accentColor === value ? `2px solid ${value}` : 'none', outlineOffset: 2,
                    boxSizing: 'border-box', transition: 'outline 0.1s',
                  }}
                />
              ))}
            </div>
          </div>

          {/* Asset suggestion */}
          {assetSuggestion && (() => {
            const newSlots = expectedSlotCount !== null && existingSlotCount !== null
              ? Math.max(0, expectedSlotCount - existingSlotCount)
              : null
            const alreadyComplete = newSlots === 0
            const accent = alreadyComplete ? '#F5A52A' : '#4ECDC4'

            return (
              <div style={{
                background: `${accent}08`,
                border: `1px solid ${createAssetSlots && !alreadyComplete ? accent + '44' : 'rgba(255,255,255,0.08)'}`,
                borderRadius: '4px', padding: '0.875rem 1rem',
                display: 'flex', flexDirection: 'column', gap: '0.75rem',
              }}>
                {/* Header row */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.8125rem', color: accent, fontWeight: 600, marginBottom: 3 }}>
                      Elemento visual detectado
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'rgba(240,235,225,0.6)' }}>
                      <strong style={{ color: 'rgba(240,235,225,0.85)' }}>{assetSuggestion.entity_label}</strong>
                      {' '}· {assetSuggestion.category}
                      {' '}· {Math.round(assetSuggestion.confidence * 100)}% confianza
                    </div>
                  </div>
                  {!alreadyComplete && (
                    <button
                      onClick={() => setCreateAssetSlots(v => !v)}
                      style={{
                        padding: '0.375rem 0.75rem', flexShrink: 0,
                        background: createAssetSlots ? accent : 'transparent',
                        border: `1px solid ${accent}66`,
                        borderRadius: '3px',
                        color: createAssetSlots ? '#08060F' : accent,
                        fontSize: '0.7rem', fontWeight: 600,
                        cursor: 'pointer', fontFamily: 'IBM Plex Sans, sans-serif',
                      }}
                    >
                      {createAssetSlots ? '✓ Crear slots' : 'Crear slots'}
                    </button>
                  )}
                </div>

                {/* Slot status */}
                <div style={{
                  display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem',
                }}>
                  {[
                    { label: 'Ya existen', value: existingSlotCount ?? '…', color: 'rgba(240,235,225,0.4)' },
                    { label: 'Se crearían', value: newSlots ?? '…', color: newSlots === 0 ? 'rgba(240,235,225,0.2)' : '#4ECDC4' },
                    { label: 'Total esperado', value: expectedSlotCount ?? '…', color: 'rgba(240,235,225,0.4)' },
                  ].map(stat => (
                    <div key={stat.label} style={{
                      background: 'rgba(0,0,0,0.2)', borderRadius: 4, padding: '0.5rem 0.625rem', textAlign: 'center',
                    }}>
                      <div style={{ fontSize: '1.1rem', fontWeight: 700, color: stat.color, fontFamily: 'Bebas Neue, Impact, sans-serif', lineHeight: 1 }}>
                        {stat.value}
                      </div>
                      <div style={{ fontSize: '0.55rem', color: 'rgba(240,235,225,0.25)', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 2 }}>
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Status message */}
                {alreadyComplete ? (
                  <div style={{ fontSize: '0.6875rem', color: 'rgba(245,165,42,0.7)' }}>
                    <strong>{assetSuggestion.entity_label}</strong> ya tiene todos los slots creados — no se añadirá ninguno nuevo.
                  </div>
                ) : createAssetSlots ? (
                  <div style={{ fontSize: '0.6875rem', color: 'rgba(78,205,196,0.7)' }}>
                    Se añadirán <strong>{newSlots ?? '...'} slots nuevos</strong> para <strong>{assetSuggestion.entity_label}</strong> en Aprobación. Los {existingSlotCount ?? '...'} existentes no se tocan.
                  </div>
                ) : (
                  <div style={{ fontSize: '0.6875rem', color: 'rgba(240,235,225,0.3)' }}>
                    Slots no se crearán. Puedes activarlo con el botón de arriba.
                  </div>
                )}
              </div>
            )
          })()}

          {error && <p style={{ fontSize: '0.8125rem', color: '#D4256A', margin: 0 }}>{error}</p>}
        </div>

        <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid rgba(245,165,42,0.07)', display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{ padding: '0.5rem 1rem', background: 'transparent', border: '1px solid rgba(245,165,42,0.1)', borderRadius: '2px', color: 'rgba(240,235,225,0.45)', fontSize: '0.875rem', cursor: 'pointer', fontFamily: 'IBM Plex Sans, sans-serif' }}>Cancelar</button>
          <button
            onClick={handleSubmit} disabled={!file || !title.trim() || uploading}
            style={{ padding: '0.5rem 1.25rem', background: file && title.trim() ? '#F5A52A' : 'rgba(245,165,42,0.15)', border: 'none', borderRadius: '2px', color: file && title.trim() ? '#08060F' : 'rgba(245,165,42,0.4)', fontSize: '0.875rem', fontWeight: 600, cursor: file && title.trim() ? 'pointer' : 'not-allowed', fontFamily: 'IBM Plex Sans, sans-serif' }}
          >
            {uploading ? 'Subiendo...' : 'Agregar a biblioteca'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Edit modal ────────────────────────────────────────────────────────────────
function EditModal({ doc, onClose, onSuccess }: { doc: RefDoc; onClose: () => void; onSuccess: () => void }) {
  const [title, setTitle] = useState(doc.title)
  const [description, setDescription] = useState(doc.description ?? '')
  const [categories, setCategories] = useState<string[]>(doc.categories)
  const [accentColor, setAccentColor] = useState(doc.accent_color || '#9B6FD4')
  const [saving, setSaving] = useState(false)

  function toggleCategory(key: string) {
    setCategories((prev) => prev.includes(key) ? prev.filter((c) => c !== key) : [...prev, key])
  }

  async function handleSave() {
    setSaving(true)
    await fetch(`/api/reference-docs?id=${doc.id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description, categories, accent_color: accentColor }),
    })
    setSaving(false)
    onSuccess()
    onClose()
  }

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(8,6,15,0.92)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 300, padding: '1.5rem' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div style={{ background: '#120D28', border: '1px solid rgba(245,165,42,0.15)', borderRadius: '2px', width: '100%', maxWidth: '460px' }}>
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid rgba(245,165,42,0.07)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontFamily: 'Bebas Neue, Impact, sans-serif', fontSize: '1.25rem', letterSpacing: '0.05em', color: '#F0EBE1' }}>Editar ficha</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'rgba(240,235,225,0.35)', cursor: 'pointer' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8125rem', color: 'rgba(240,235,225,0.5)', marginBottom: '0.5rem' }}>Título</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} style={{ width: '100%', background: '#1A1235', border: '1px solid rgba(245,165,42,0.12)', borderRadius: '2px', color: '#F0EBE1', fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '0.875rem', padding: '0.625rem 0.75rem', outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.8125rem', color: 'rgba(240,235,225,0.5)', marginBottom: '0.5rem' }}>Descripción</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} style={{ width: '100%', background: '#1A1235', border: '1px solid rgba(245,165,42,0.12)', borderRadius: '2px', color: '#F0EBE1', fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '0.875rem', padding: '0.625rem 0.75rem', outline: 'none', resize: 'vertical', lineHeight: 1.5, boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.8125rem', color: 'rgba(240,235,225,0.5)', marginBottom: '0.625rem' }}>Áreas</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
              {ALL_CATEGORIES.map((cat) => {
                const active = categories.includes(cat.key)
                const color = SPINE_COLORS[cat.key]?.stripe ?? '#F5A52A'
                return (
                  <button key={cat.key} onClick={() => toggleCategory(cat.key)} style={{ padding: '0.3rem 0.625rem', borderRadius: '2px', fontSize: '0.75rem', cursor: 'pointer', fontFamily: 'IBM Plex Sans, sans-serif', background: active ? `${color}22` : 'transparent', border: `1px solid ${active ? color : 'rgba(245,165,42,0.1)'}`, color: active ? color : 'rgba(240,235,225,0.4)' }}>
                    {cat.label}
                  </button>
                )
              })}
            </div>
          </div>
          {/* Color picker */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8125rem', color: 'rgba(240,235,225,0.5)', marginBottom: '0.625rem' }}>Color del lomo</label>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {ACCENT_COLORS.map(({ value, label }) => (
                <button
                  key={value}
                  title={label}
                  onClick={() => setAccentColor(value)}
                  style={{
                    width: 28, height: 28, borderRadius: '50%', border: accentColor === value ? '2px solid #F0EBE1' : '2px solid transparent',
                    background: value, cursor: 'pointer', outline: accentColor === value ? `2px solid ${value}` : 'none', outlineOffset: 2,
                    boxSizing: 'border-box',
                  }}
                />
              ))}
            </div>
          </div>
        </div>
        <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid rgba(245,165,42,0.07)', display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{ padding: '0.5rem 1rem', background: 'transparent', border: '1px solid rgba(245,165,42,0.1)', borderRadius: '2px', color: 'rgba(240,235,225,0.45)', fontSize: '0.875rem', cursor: 'pointer', fontFamily: 'IBM Plex Sans, sans-serif' }}>Cancelar</button>
          <button onClick={handleSave} disabled={saving} style={{ padding: '0.5rem 1.25rem', background: '#F5A52A', border: 'none', borderRadius: '2px', color: '#08060F', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'IBM Plex Sans, sans-serif' }}>
            {saving ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── First confirmation modal (simple) ─────────────────────────────────────────
function Confirm1Modal({ doc, onContinue, onClose }: { doc: RefDoc; onContinue: () => void; onClose: () => void }) {
  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(8,6,15,0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 400, padding: '1.5rem' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div style={{ background: '#120D28', border: '1px solid rgba(212,37,106,0.25)', borderRadius: '2px', width: '100%', maxWidth: '440px' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(212,37,106,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.875rem' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D4256A" strokeWidth="2">
              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
            <h2 style={{ fontFamily: 'Bebas Neue, Impact, sans-serif', fontSize: '1.25rem', letterSpacing: '0.06em', color: '#F0EBE1' }}>
              Editar Canon de la Serie
            </h2>
          </div>
          <p style={{ fontSize: '0.9375rem', color: 'rgba(240,235,225,0.65)', lineHeight: 1.65, marginBottom: '0.75rem' }}>
            Estás a punto de modificar el documento canónico{' '}
            <span style={{ color: '#F0EBE1', fontWeight: 500 }}>&ldquo;{doc.title}&rdquo;</span>.
          </p>
          <p style={{ fontSize: '0.875rem', color: 'rgba(240,235,225,0.45)', lineHeight: 1.6 }}>
            Los cambios que hagas reemplazarán el contenido que el asistente AI usa como fuente de verdad de la serie.
          </p>
        </div>
        <div style={{ padding: '1.125rem 1.5rem', display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{ padding: '0.5rem 1rem', background: 'transparent', border: '1px solid rgba(245,165,42,0.1)', borderRadius: '2px', color: 'rgba(240,235,225,0.45)', fontSize: '0.875rem', cursor: 'pointer', fontFamily: 'IBM Plex Sans, sans-serif' }}>
            Cancelar
          </button>
          <button
            onClick={onContinue}
            style={{ padding: '0.5rem 1.25rem', background: 'rgba(212,37,106,0.12)', border: '1px solid rgba(212,37,106,0.35)', borderRadius: '2px', color: '#D4256A', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'IBM Plex Sans, sans-serif' }}
          >
            Continuar
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Second confirmation modal (dramatic glitch) ───────────────────────────────
function Confirm2Modal({ doc, onConfirm, onClose }: { doc: RefDoc; onConfirm: (summary: string) => void; onClose: () => void }) {
  const [summary, setSummary] = useState('')
  const canConfirm = summary.trim().length > 0

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.97)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 500, padding: '1.5rem' }}>
      <style>{`
        @keyframes glitch-1 {
          0%,100% { clip-path: inset(0 0 98% 0); transform: skewX(0deg) translateX(0); opacity: 0; }
          8%  { clip-path: inset(5% 0 75% 0); transform: skewX(-4deg) translateX(-6px); opacity: 1; }
          18% { clip-path: inset(40% 0 40% 0); transform: skewX(3deg) translateX(4px); opacity: 1; }
          28% { clip-path: inset(70% 0 10% 0); transform: skewX(-2deg) translateX(-3px); opacity: 1; }
          38% { clip-path: inset(20% 0 65% 0); transform: skewX(1deg) translateX(2px); opacity: 1; }
          48% { clip-path: inset(0 0 98% 0); opacity: 0; }
        }
        @keyframes glitch-2 {
          0%,100% { clip-path: inset(0 0 98% 0); transform: skewX(0deg) translateX(0); opacity: 0; }
          12% { clip-path: inset(60% 0 20% 0); transform: skewX(3deg) translateX(5px); opacity: 1; }
          22% { clip-path: inset(15% 0 70% 0); transform: skewX(-2deg) translateX(-4px); opacity: 1; }
          32% { clip-path: inset(80% 0 5% 0); transform: skewX(2deg) translateX(3px); opacity: 1; }
          42% { clip-path: inset(30% 0 55% 0); transform: skewX(-3deg) translateX(-2px); opacity: 1; }
          52% { clip-path: inset(0 0 98% 0); opacity: 0; }
        }
        @keyframes flicker {
          0%,100% { opacity: 1; }
          92% { opacity: 1; }
          93% { opacity: 0.4; }
          94% { opacity: 1; }
          96% { opacity: 0.6; }
          97% { opacity: 1; }
        }
        @keyframes scanlines {
          from { background-position: 0 0; }
          to { background-position: 0 4px; }
        }
        @keyframes pulse-border {
          0%,100% { border-color: rgba(212,37,106,0.35); box-shadow: 0 0 0 rgba(212,37,106,0); }
          50% { border-color: rgba(212,37,106,0.7); box-shadow: 0 0 20px rgba(212,37,106,0.15); }
        }
      `}</style>

      <div style={{ width: '100%', maxWidth: '560px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
        {/* Glitch title */}
        <div style={{ position: 'relative', textAlign: 'center', userSelect: 'none' }}>
          {/* Base text */}
          <div style={{
            fontFamily: 'Bebas Neue, Impact, sans-serif',
            fontSize: 'clamp(2.5rem, 8vw, 4.5rem)',
            letterSpacing: '0.12em',
            color: '#F0EBE1',
            animation: 'flicker 4s infinite',
            lineHeight: 1,
          }}>
            MODIFICANDO EL MUNDO
          </div>
          {/* Glitch layer 1 — red */}
          <div style={{
            position: 'absolute', inset: 0,
            fontFamily: 'Bebas Neue, Impact, sans-serif',
            fontSize: 'clamp(2.5rem, 8vw, 4.5rem)',
            letterSpacing: '0.12em',
            color: '#D4256A',
            lineHeight: 1,
            animation: 'glitch-1 2.8s infinite',
            pointerEvents: 'none',
          }}>
            MODIFICANDO EL MUNDO
          </div>
          {/* Glitch layer 2 — cyan */}
          <div style={{
            position: 'absolute', inset: 0,
            fontFamily: 'Bebas Neue, Impact, sans-serif',
            fontSize: 'clamp(2.5rem, 8vw, 4.5rem)',
            letterSpacing: '0.12em',
            color: '#4ECDC4',
            lineHeight: 1,
            animation: 'glitch-2 2.8s infinite 0.4s',
            pointerEvents: 'none',
          }}>
            MODIFICANDO EL MUNDO
          </div>
          {/* Scan lines overlay */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.12) 2px, rgba(0,0,0,0.12) 4px)',
            animation: 'scanlines 0.08s linear infinite',
            pointerEvents: 'none',
          }} />
          <div style={{ marginTop: '0.5rem', fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '0.6875rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(240,235,225,0.25)' }}>
            {doc.title}
          </div>
        </div>

        {/* Warning card */}
        <div style={{ width: '100%', background: 'rgba(212,37,106,0.04)', border: '1px solid rgba(212,37,106,0.2)', borderRadius: '2px', padding: '1.25rem 1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.875rem' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D4256A" strokeWidth="2">
              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
            <span style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#D4256A', fontWeight: 600 }}>
              Esta acción puede afectar
            </span>
          </div>
          <ul style={{ margin: 0, paddingLeft: '1rem', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            {[
              'Prompts de generación de imágenes construidos sobre este documento',
              'Diseños y referencias visuales de personajes y escenarios',
              'Continuidad narrativa de los 50 episodios de la serie',
              'Otros documentos canónicos que dependen de este',
            ].map((item) => (
              <li key={item} style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '0.8125rem', color: 'rgba(240,235,225,0.5)', lineHeight: 1.5 }}>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Summary input */}
        <div style={{ width: '100%' }}>
          <label style={{ display: 'block', fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(240,235,225,0.35)', marginBottom: '0.625rem' }}>
            Describe brevemente qué vas a cambiar y por qué <span style={{ color: '#D4256A' }}>*</span>
          </label>
          <textarea
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="Ej: Actualizando el nombre de la mascota de Tito — decidimos que es una salamandra según acuerdo del Writers Room del 14/08..."
            rows={3}
            style={{
              width: '100%', boxSizing: 'border-box',
              background: 'rgba(26,18,53,0.8)', border: '1px solid rgba(245,165,42,0.15)', borderRadius: '2px',
              color: '#F0EBE1', fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '0.875rem',
              padding: '0.75rem', outline: 'none', resize: 'vertical', lineHeight: 1.6,
            }}
          />
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '1rem', width: '100%' }}>
          <button
            onClick={onClose}
            style={{ flex: 1, padding: '0.75rem', background: 'transparent', border: '1px solid rgba(240,235,225,0.12)', borderRadius: '2px', color: 'rgba(240,235,225,0.4)', fontSize: '0.875rem', cursor: 'pointer', fontFamily: 'IBM Plex Sans, sans-serif' }}
          >
            Cancelar
          </button>
          <button
            onClick={() => canConfirm && onConfirm(summary.trim())}
            disabled={!canConfirm}
            style={{
              flex: 2, padding: '0.75rem',
              background: canConfirm ? '#D4256A' : 'rgba(212,37,106,0.08)',
              border: `1px solid ${canConfirm ? '#D4256A' : 'rgba(212,37,106,0.2)'}`,
              borderRadius: '2px',
              color: canConfirm ? '#fff' : 'rgba(212,37,106,0.3)',
              fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.06em',
              cursor: canConfirm ? 'pointer' : 'not-allowed',
              fontFamily: 'Bebas Neue, Impact, sans-serif',
              animation: canConfirm ? 'pulse-border 2s infinite' : 'none',
              transition: 'all 0.2s',
            }}
          >
            Confirmar Modificación
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Canon editor panel ────────────────────────────────────────────────────────
function CanonEditorPanel({
  doc,
  initialContent,
  changeSummary,
  onClose,
  onSaved,
}: {
  doc: RefDoc
  initialContent: string
  changeSummary: string
  onClose: () => void
  onSaved: () => void
}) {
  const [content, setContent] = useState(initialContent)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState('')

  // Mini chat state
  const [chatMsgs, setChatMsgs] = useState<ChatMsg[]>([])
  const [chatInput, setChatInput] = useState('')
  const [chatStreaming, setChatStreaming] = useState(false)
  const chatBottomRef = useRef<HTMLDivElement>(null)
  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMsgs])

  async function sendChat() {
    const text = chatInput.trim()
    if (!text || chatStreaming) return
    setChatInput('')

    // Prepend document context to first message only
    const contextPrefix = chatMsgs.length === 0
      ? `[Estoy editando el documento canónico "${doc.title}". Ayúdame a mejorar este contenido.]\n\n`
      : ''

    const userMsg: ChatMsg = { role: 'user', content: contextPrefix + text }
    const updatedMsgs = [...chatMsgs, userMsg]
    setChatMsgs(updatedMsgs)
    setChatStreaming(true)

    const assistantMsg: ChatMsg = { role: 'assistant', content: '' }
    setChatMsgs([...updatedMsgs, assistantMsg])

    abortRef.current = new AbortController()
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMsgs, context: 'continuidad' }),
        signal: abortRef.current.signal,
      })
      const reader = res.body?.getReader()
      const decoder = new TextDecoder()
      if (!reader) return
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value, { stream: true })
        setChatMsgs((prev) => {
          const msgs = [...prev]
          msgs[msgs.length - 1] = { role: 'assistant', content: msgs[msgs.length - 1].content + chunk }
          return msgs
        })
      }
    } catch {
      // aborted or error
    } finally {
      setChatStreaming(false)
      abortRef.current = null
    }
  }

  async function handleSave() {
    setSaving(true)
    try {
      const patchRes = await fetch(`/api/reference-docs?id=${doc.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: doc.title, description: doc.description, categories: doc.categories, content }),
      })
      if (!patchRes.ok) {
        const err = await patchRes.json()
        setToast(`Error: ${err.error}`)
        return
      }

      // Log the change
      await fetch('/api/canon-log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          doc_id: doc.id,
          doc_title: doc.title,
          change_summary: changeSummary,
          old_content_snippet: initialContent.substring(0, 500),
        }),
      })

      setToast('Canon actualizado')
      setTimeout(() => {
        onSaved()
        onClose()
      }, 1200)
    } finally {
      setSaving(false)
    }
  }

  const spineStyle = getSpineStyle(doc.accent_color)

  return (
    <div style={{ marginTop: '1.5rem' }}>
      <style>{`
        @keyframes slideDown { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes toast-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: '2rem', left: '50%', transform: 'translateX(-50%)',
          background: toast.startsWith('Error') ? '#D4256A' : '#4ECDC4',
          color: '#08060F', padding: '0.625rem 1.5rem', borderRadius: '2px',
          fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '0.875rem', fontWeight: 600,
          zIndex: 9999, animation: 'toast-in 0.2s ease',
          boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
        }}>
          {toast}
        </div>
      )}

      <div style={{
        background: '#120D28',
        border: `1px solid rgba(212,37,106,0.25)`,
        borderTop: `3px solid #D4256A`,
        borderRadius: '0 0 2px 2px',
        animation: 'slideDown 0.25s ease',
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{ padding: '0.875rem 1.5rem', borderBottom: '1px solid rgba(212,37,106,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(212,37,106,0.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D4256A" strokeWidth="2">
              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
            <span style={{ fontFamily: 'Bebas Neue, Impact, sans-serif', fontSize: '1rem', letterSpacing: '0.1em', color: '#D4256A' }}>
              MODO CANON
            </span>
            <span style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '0.8125rem', color: 'rgba(240,235,225,0.4)' }}>
              — {doc.title}
            </span>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'rgba(240,235,225,0.3)', cursor: 'pointer', padding: '0.25rem' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        {/* Split editor */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: '480px' }}>
          {/* Left: content editor */}
          <div style={{ display: 'flex', flexDirection: 'column', borderRight: '1px solid rgba(245,165,42,0.08)' }}>
            <div style={{ padding: '0.625rem 1rem', borderBottom: '1px solid rgba(245,165,42,0.06)', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(240,235,225,0.25)" strokeWidth="2">
                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
              <span style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '0.6875rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(240,235,225,0.25)' }}>
                Editor de contenido
              </span>
            </div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              style={{
                flex: 1, padding: '1.25rem', background: '#0D0920', border: 'none', outline: 'none',
                color: 'rgba(240,235,225,0.82)', fontFamily: 'monospace', fontSize: '0.8125rem',
                lineHeight: 1.75, resize: 'none', minHeight: '440px',
              }}
            />
          </div>

          {/* Right: mini chat */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '0.625rem 1rem', borderBottom: '1px solid rgba(245,165,42,0.06)', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(78,205,196,0.4)" strokeWidth="2">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
              </svg>
              <span style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '0.6875rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(240,235,225,0.25)' }}>
                Asistente AI
              </span>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '360px', background: '#0D0920' }}>
              {chatMsgs.length === 0 && (
                <div style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '0.8125rem', color: 'rgba(240,235,225,0.2)', fontStyle: 'italic', textAlign: 'center', marginTop: '3rem' }}>
                  Consulta al asistente mientras editas el documento...
                </div>
              )}
              {chatMsgs.map((msg, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                  <div style={{
                    maxWidth: '85%', padding: '0.5rem 0.75rem', borderRadius: '2px',
                    fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '0.8125rem', lineHeight: 1.55,
                    background: msg.role === 'user' ? 'rgba(245,165,42,0.1)' : 'rgba(78,205,196,0.06)',
                    border: `1px solid ${msg.role === 'user' ? 'rgba(245,165,42,0.15)' : 'rgba(78,205,196,0.12)'}`,
                    color: msg.role === 'user' ? 'rgba(240,235,225,0.75)' : 'rgba(240,235,225,0.65)',
                    whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                  }}>
                    {msg.content || (msg.role === 'assistant' && chatStreaming && i === chatMsgs.length - 1 ? (
                      <span style={{ opacity: 0.4 }}>...</span>
                    ) : null)}
                  </div>
                </div>
              ))}
              <div ref={chatBottomRef} />
            </div>

            {/* Chat input */}
            <div style={{ padding: '0.75rem', borderTop: '1px solid rgba(245,165,42,0.06)', display: 'flex', gap: '0.5rem', background: '#120D28' }}>
              <textarea
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendChat() } }}
                placeholder="Pregunta al asistente... (Enter para enviar)"
                rows={2}
                style={{
                  flex: 1, background: '#1A1235', border: '1px solid rgba(245,165,42,0.1)', borderRadius: '2px',
                  color: '#F0EBE1', fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '0.8125rem',
                  padding: '0.5rem 0.625rem', outline: 'none', resize: 'none', lineHeight: 1.5,
                }}
              />
              <button
                onClick={sendChat}
                disabled={!chatInput.trim() || chatStreaming}
                style={{
                  padding: '0.5rem 0.75rem', background: chatInput.trim() && !chatStreaming ? 'rgba(78,205,196,0.15)' : 'transparent',
                  border: `1px solid ${chatInput.trim() && !chatStreaming ? 'rgba(78,205,196,0.3)' : 'rgba(245,165,42,0.08)'}`,
                  borderRadius: '2px', color: chatInput.trim() && !chatStreaming ? '#4ECDC4' : 'rgba(240,235,225,0.2)',
                  cursor: chatInput.trim() && !chatStreaming ? 'pointer' : 'not-allowed', alignSelf: 'flex-end',
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid rgba(212,37,106,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(212,37,106,0.02)' }}>
          <div style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '0.75rem', color: 'rgba(240,235,225,0.25)', maxWidth: '420px', lineHeight: 1.4 }}>
            <span style={{ color: 'rgba(212,37,106,0.5)' }}>Motivo: </span>{changeSummary}
          </div>
          <div style={{ display: 'flex', gap: '0.625rem' }}>
            <button onClick={onClose} style={{ padding: '0.5rem 1rem', background: 'transparent', border: '1px solid rgba(245,165,42,0.1)', borderRadius: '2px', color: 'rgba(240,235,225,0.4)', fontSize: '0.875rem', cursor: 'pointer', fontFamily: 'IBM Plex Sans, sans-serif' }}>
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              style={{
                padding: '0.5rem 1.375rem', background: saving ? 'rgba(212,37,106,0.3)' : '#D4256A',
                border: 'none', borderRadius: '2px', color: '#fff',
                fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.04em',
                cursor: saving ? 'not-allowed' : 'pointer', fontFamily: 'Bebas Neue, Impact, sans-serif',
                display: 'flex', alignItems: 'center', gap: '0.375rem',
              }}
            >
              {saving ? (
                <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 1s linear infinite' }}><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4"/></svg> Guardando...</>
              ) : 'Guardar Canon'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Book spine ─────────────────────────────────────────────────────────────────
function BookSpine({ doc, selected, onClick }: { doc: RefDoc; selected: boolean; onClick: () => void }) {
  const style = getSpineStyle(doc.accent_color)
  const [hovered, setHovered] = useState(false)
  const [tipPos, setTipPos] = useState({ x: 0, y: 0 })
  const btnRef = useRef<HTMLButtonElement>(null)

  function handleMouseEnter() {
    setHovered(true)
    if (btnRef.current) {
      const r = btnRef.current.getBoundingClientRect()
      const cx = Math.max(128, Math.min(window.innerWidth - 128, r.left + r.width / 2))
      setTipPos({ x: cx, y: r.top - 12 })
    }
  }

  return (
    <div style={{ position: 'relative', flexShrink: 0 }}>
      {hovered && !selected && (
        <div style={{
          position: 'fixed',
          top: tipPos.y,
          left: tipPos.x,
          transform: 'translateX(-50%) translateY(-100%)',
          background: '#1A1235',
          border: `1px solid ${style.stripe}55`,
          borderRadius: '2px',
          padding: '0.5rem 0.75rem',
          maxWidth: '260px',
          zIndex: 9999,
          pointerEvents: 'none',
          boxShadow: '0 4px 20px rgba(0,0,0,0.7)',
        }}>
          <div style={{ fontFamily: 'Bebas Neue, Impact, sans-serif', fontSize: '0.9375rem', letterSpacing: '0.06em', color: '#F0EBE1', marginBottom: doc.description ? '0.2rem' : 0, whiteSpace: 'nowrap' }}>
            {doc.title}
          </div>
          {doc.description && (
            <div style={{ fontSize: '0.6875rem', color: 'rgba(240,235,225,0.4)', whiteSpace: 'normal', lineHeight: 1.4 }}>
              {doc.description.substring(0, 80)}{doc.description.length > 80 ? '...' : ''}
            </div>
          )}
          <div style={{ position: 'absolute', bottom: '-5px', left: '50%', transform: 'translateX(-50%)', width: '8px', height: '8px', background: '#1A1235', border: `1px solid ${style.stripe}55`, borderTop: 'none', borderLeft: 'none', rotate: '45deg' }} />
        </div>
      )}

      <button
        ref={btnRef}
        onClick={onClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setHovered(false)}
        style={{
          width: '64px', minWidth: '64px', height: '210px',
          background: style.bg,
          border: 'none',
          borderRadius: '2px 4px 4px 2px',
          cursor: 'pointer',
          position: 'relative',
          transform: selected ? 'translateY(-28px) scale(1.06)' : hovered ? 'translateY(-10px) scale(1.02)' : 'translateY(0) scale(1)',
          transition: 'transform 0.28s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.28s ease',
          boxShadow: selected
            ? `4px 0 32px rgba(0,0,0,0.8), inset -1px 0 0 rgba(255,255,255,0.05)`
            : hovered
            ? `3px 0 16px rgba(0,0,0,0.7), inset -1px 0 0 rgba(255,255,255,0.04)`
            : `2px 0 8px rgba(0,0,0,0.5), inset -1px 0 0 rgba(255,255,255,0.03)`,
          outline: selected ? `1px solid ${style.stripe}44` : 'none',
        }}
      >
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '6px', background: style.stripe, borderRadius: '2px 4px 0 0', opacity: 0.9 }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '4px', background: style.stripe, borderRadius: '0 0 4px 2px', opacity: 0.5 }} />
        <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: '4px', background: 'rgba(0,0,0,0.35)', borderRadius: '2px 0 0 2px' }} />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px 4px' }}>
          <span style={{
            writingMode: 'vertical-rl',
            transform: 'rotate(180deg)',
            fontFamily: 'Bebas Neue, Impact, sans-serif',
            fontSize: '12px',
            letterSpacing: '0.12em',
            color: style.text,
            lineHeight: 1.1,
            maxHeight: '160px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            width: '100%',
            textAlign: 'center',
          }}>
            {doc.title}
          </span>
        </div>
        {selected && (
          <div style={{ position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)', width: '6px', height: '6px', borderRadius: '50%', background: style.stripe }} />
        )}
      </button>
    </div>
  )
}

// ── Detail panel ──────────────────────────────────────────────────────────────
function DetailPanel({
  doc,
  isAdmin,
  onEdit,
  onEditCanon,
  onDelete,
  onClose,
}: {
  doc: RefDoc
  isAdmin: boolean
  onEdit: () => void
  onEditCanon: () => void
  onDelete: () => void
  onClose: () => void
}) {
  const style = getSpineStyle(doc.accent_color)
  const [reading, setReading] = useState(false)
  const [content, setContent] = useState<string | null>(null)
  const [loadingContent, setLoadingContent] = useState(false)
  const [canonBtnHovered, setCanonBtnHovered] = useState(false)

  async function handleRead() {
    if (content) { setReading(true); return }
    setLoadingContent(true)
    try {
      const res = await fetch(`/api/reference-docs?id=${doc.id}`)
      if (res.ok) {
        const data = await res.json()
        setContent(data.content ?? '')
        setReading(true)
      }
    } finally {
      setLoadingContent(false)
    }
  }

  function handleDownload() {
    const text = content
      ? `# ${doc.title}\n\n${doc.description ? `_${doc.description}_\n\n` : ''}---\n\n${content}`
      : `# ${doc.title}\n\n_${doc.description ?? ''}_\n_Archivo: ${doc.filename}_\n`
    const blob = new Blob([text], { type: 'text/markdown;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${doc.title.replace(/\s+/g, '_')}.md`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div style={{
      background: '#120D28',
      border: '1px solid rgba(245,165,42,0.1)',
      borderTop: `3px solid ${style.stripe}`,
      borderRadius: '0 0 2px 2px',
      animation: 'slideDown 0.25s ease',
      overflow: 'hidden',
    }}>
      <style>{`
        @keyframes slideDown { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes canon-pulse { 0%,100% { box-shadow: 0 0 0 rgba(212,37,106,0); } 50% { box-shadow: 0 0 12px rgba(212,37,106,0.25); } }
      `}</style>

      <div style={{ padding: '1.25rem 1.5rem', borderBottom: reading ? '1px solid rgba(245,165,42,0.07)' : 'none' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', marginBottom: '0.875rem' }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h2 style={{ fontFamily: 'Bebas Neue, Impact, sans-serif', fontSize: '1.5rem', letterSpacing: '0.05em', color: '#F0EBE1', lineHeight: 1, marginBottom: '0.3rem' }}>
              {doc.title}
            </h2>
            <div style={{ fontSize: '0.6875rem', color: 'rgba(240,235,225,0.25)', fontFamily: 'monospace' }}>
              {doc.filename} · {formatDate(doc.updated_at)}
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'rgba(240,235,225,0.3)', cursor: 'pointer', flexShrink: 0, padding: '0.25rem' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        {doc.description && (
          <p style={{ fontSize: '0.875rem', color: 'rgba(240,235,225,0.55)', lineHeight: 1.6, marginBottom: '0.875rem' }}>
            {doc.description}
          </p>
        )}

        {doc.categories.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem', marginBottom: '1rem' }}>
            {doc.categories.map((cat) => {
              const color = SPINE_COLORS[cat]?.stripe ?? '#F5A52A'
              const found = ALL_CATEGORIES.find((c) => c.key === cat)
              return (
                <span key={cat} style={{ fontSize: '0.625rem', letterSpacing: '0.1em', textTransform: 'uppercase', background: `${color}18`, border: `1px solid ${color}40`, color, borderRadius: '2px', padding: '0.2rem 0.5rem' }}>
                  {found?.label ?? cat}
                </span>
              )
            })}
          </div>
        )}

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Read */}
          <button
            onClick={reading ? () => setReading(false) : handleRead}
            disabled={loadingContent}
            style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', padding: '0.5rem 1.125rem', background: reading ? 'rgba(245,165,42,0.15)' : '#F5A52A', border: reading ? '1px solid rgba(245,165,42,0.3)' : 'none', borderRadius: '2px', color: reading ? '#F5A52A' : '#08060F', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'IBM Plex Sans, sans-serif' }}
          >
            {loadingContent
              ? <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 1s linear infinite' }}><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4"/></svg> Cargando...</>
              : reading
              ? <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="18 15 12 9 6 15"/></svg> Cerrar lectura</>
              : <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg> Leer documento</>
            }
          </button>
          {/* Download */}
          <button onClick={handleDownload} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', padding: '0.5rem 1rem', background: 'rgba(245,165,42,0.06)', border: '1px solid rgba(245,165,42,0.15)', borderRadius: '2px', color: 'rgba(245,165,42,0.8)', fontSize: '0.8125rem', cursor: 'pointer', fontFamily: 'IBM Plex Sans, sans-serif' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Descargar
          </button>
          {/* Edit metadata */}
          <button onClick={onEdit} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', padding: '0.5rem 1rem', background: 'rgba(78,205,196,0.06)', border: '1px solid rgba(78,205,196,0.15)', borderRadius: '2px', color: '#4ECDC4', fontSize: '0.8125rem', cursor: 'pointer', fontFamily: 'IBM Plex Sans, sans-serif' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            Editar ficha
          </button>
          {/* Edit canon — admin only */}
          {isAdmin && (
            <button
              onClick={onEditCanon}
              onMouseEnter={() => setCanonBtnHovered(true)}
              onMouseLeave={() => setCanonBtnHovered(false)}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.375rem',
                padding: '0.5rem 1rem',
                background: canonBtnHovered ? 'rgba(212,37,106,0.12)' : 'rgba(212,37,106,0.06)',
                border: `1px solid ${canonBtnHovered ? 'rgba(212,37,106,0.45)' : 'rgba(212,37,106,0.2)'}`,
                borderRadius: '2px',
                color: '#D4256A',
                fontSize: '0.8125rem', cursor: 'pointer', fontFamily: 'IBM Plex Sans, sans-serif',
                animation: 'canon-pulse 3s infinite',
                transition: 'background 0.15s, border-color 0.15s',
              }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
              Editar Canon
            </button>
          )}
          {/* Delete */}
          <button onClick={onDelete} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', padding: '0.5rem 1rem', background: 'transparent', border: '1px solid rgba(212,37,106,0.15)', borderRadius: '2px', color: 'rgba(212,37,106,0.65)', fontSize: '0.8125rem', cursor: 'pointer', fontFamily: 'IBM Plex Sans, sans-serif' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/></svg>
            Eliminar
          </button>
        </div>
      </div>

      {reading && content !== null && (
        <div style={{ maxHeight: '520px', overflowY: 'auto', padding: '2rem 2.5rem', background: '#0D0920', borderTop: `1px solid ${style.stripe}22` }}>
          <div style={{ maxWidth: '720px', margin: '0 auto', fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '0.9375rem', lineHeight: 1.85, color: 'rgba(240,235,225,0.78)', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
            {content || <span style={{ color: 'rgba(240,235,225,0.2)', fontStyle: 'italic' }}>El documento no tiene contenido de texto legible.</span>}
          </div>
        </div>
      )}
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function BiblePage() {
  const [docs, setDocs] = useState<RefDoc[]>([])
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [showUpload, setShowUpload] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [editDoc, setEditDoc] = useState<RefDoc | null>(null)

  // Canon editor flow
  const [confirm1Doc, setConfirm1Doc] = useState<RefDoc | null>(null)
  const [confirm2Doc, setConfirm2Doc] = useState<RefDoc | null>(null)
  const [canonEditorDoc, setCanonEditorDoc] = useState<RefDoc | null>(null)
  const [canonEditorContent, setCanonEditorContent] = useState('')
  const [canonChangeSummary, setCanonChangeSummary] = useState('')

  const fetchDocs = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/reference-docs')
      if (res.ok) setDocs(await res.json())
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchDocs() }, [fetchDocs])

  useEffect(() => {
    fetch('/api/me').then((r) => r.json()).then((d) => setIsAdmin(d.isAdmin === true)).catch(() => {})
  }, [])

  const selectedDoc = docs.find((d) => d.id === selectedId) ?? null

  function handleToggle(id: string) {
    setSelectedId((prev) => prev === id ? null : id)
    // Close canon editor if open and a different doc is selected
    if (canonEditorDoc && canonEditorDoc.id !== id) {
      setCanonEditorDoc(null)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('¿Eliminar este documento? No se puede deshacer.')) return
    await fetch(`/api/reference-docs?id=${id}`, { method: 'DELETE' })
    setSelectedId(null)
    fetchDocs()
  }

  async function handleStartCanonEdit(doc: RefDoc) {
    // Load content first, then show confirm1
    const res = await fetch(`/api/reference-docs?id=${doc.id}`)
    if (res.ok) {
      const data = await res.json()
      setCanonEditorContent(data.content ?? '')
    }
    setConfirm1Doc(doc)
  }

  return (
    <div style={{ width: '100%' }}>
      {/* ── PAGE HEADER ──────────────────────────────────────────────────── */}
      <div style={{
        position: 'relative',
        overflow: 'hidden',
        background: '#0D0920',
        borderBottom: '1px solid rgba(74,143,232,0.12)',
        padding: '3rem 2.5rem 2.5rem',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        gap: '1.5rem',
        flexWrap: 'wrap',
      }}>
        {/* Decorative background text */}
        <div style={{
          position: 'absolute',
          right: '1.5rem',
          top: '50%',
          transform: 'translateY(-50%)',
          fontFamily: 'Bebas Neue, Impact, sans-serif',
          fontSize: 'clamp(5rem, 11vw, 9rem)',
          letterSpacing: '-0.03em',
          color: '#4A8FE8',
          opacity: 0.04,
          lineHeight: 1,
          userSelect: 'none',
          pointerEvents: 'none',
        }}>
          BIBLE
        </div>
        {/* Blue glow blob */}
        <div style={{
          position: 'absolute',
          top: '-60px',
          right: '20%',
          width: '380px',
          height: '280px',
          borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(74,143,232,0.08) 0%, transparent 70%)',
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
          background: 'linear-gradient(90deg, #4A8FE8 0%, rgba(74,143,232,0.4) 40%, transparent 100%)',
        }} />

        {/* Title block */}
        <div>
          <div style={{
            fontSize: '0.625rem',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: '#4A8FE8',
            fontWeight: 600,
            marginBottom: '0.75rem',
            opacity: 0.85,
          }}>
            Producción · Documentos canónicos
          </div>
          <h1 style={{
            fontFamily: 'Bebas Neue, Impact, sans-serif',
            fontSize: 'clamp(3.5rem, 7vw, 5.5rem)',
            letterSpacing: '0.04em',
            color: '#F0EBE1',
            lineHeight: 0.9,
            marginBottom: '1rem',
          }}>
            BIBLIA
          </h1>
          <p style={{ fontSize: '0.9375rem', color: 'rgba(240,235,225,0.45)', marginBottom: '1.5rem' }}>
            {docs.length === 0
              ? 'La biblioteca está vacía — agrega el primer volumen.'
              : `${docs.length} ${docs.length === 1 ? 'volumen' : 'volúmenes'} en la biblioteca canónica`}
          </p>
          {/* Stats chips */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.375rem' }}>
            <span style={{ fontFamily: 'Bebas Neue, Impact, sans-serif', fontSize: '1.25rem', color: '#4A8FE8', letterSpacing: '0.04em' }}>
              {docs.length}
            </span>
            <span style={{ fontSize: '0.625rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(240,235,225,0.35)', fontWeight: 600 }}>
              Volúmenes
            </span>
          </div>
        </div>

        {/* Action */}
        <button
          onClick={() => setShowUpload(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1.5rem',
            background: '#4A8FE8',
            border: 'none',
            borderRadius: '4px',
            color: '#F0EBE1',
            fontSize: '0.875rem',
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: 'IBM Plex Sans, sans-serif',
            whiteSpace: 'nowrap',
            flexShrink: 0,
            letterSpacing: '0.01em',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Agregar volumen
        </button>
      </div>

      {/* ── MARQUEE STRIP ────────────────────────────────────────────────── */}
      <div style={{ background: '#4A8FE8', overflow: 'hidden', padding: '0.55rem 0' }}>
        <div style={{ display: 'inline-block', whiteSpace: 'nowrap', animation: 'marquee 26s linear infinite' }}>
          <span style={{ fontFamily: 'Bebas Neue, Impact, sans-serif', fontSize: '0.9375rem', letterSpacing: '0.14em', color: '#F0EBE1' }}>
            {Array(8).fill('PERSONAJES\u2003—\u2003ARTE\u2003—\u2003GUIÓN\u2003—\u2003CONTINUIDAD\u2003—\u2003MARKETING\u2003—\u2003LOCACIONES\u2003—\u2003WORLDBUILDING\u2003—\u2003').join('')}
          </span>
        </div>
      </div>

    <div className="px-4 py-6 md:px-10 md:py-6" style={{ maxWidth: '1100px', width: '100%' }}>

      {loading ? (
        <div style={{ padding: '4rem', textAlign: 'center', color: 'rgba(240,235,225,0.25)', fontSize: '0.875rem' }}>Cargando biblioteca...</div>
      ) : docs.length === 0 ? (
        <div style={{ background: '#0D0920', border: '1px solid rgba(245,165,42,0.08)', borderRadius: '2px', padding: '5rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', textAlign: 'center' }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(245,165,42,0.15)" strokeWidth="0.75">
            <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
          </svg>
          <p style={{ fontSize: '1rem', color: 'rgba(240,235,225,0.3)', fontWeight: 500 }}>La biblioteca está vacía</p>
          <p style={{ fontSize: '0.875rem', color: 'rgba(240,235,225,0.2)' }}>Sube tu primer documento del Writers Room.</p>
          <button
            onClick={() => setShowUpload(true)}
            style={{ marginTop: '0.5rem', padding: '0.625rem 1.5rem', background: 'rgba(245,165,42,0.08)', border: '1px solid rgba(245,165,42,0.2)', borderRadius: '2px', color: '#F5A52A', fontSize: '0.875rem', cursor: 'pointer', fontFamily: 'IBM Plex Sans, sans-serif' }}
          >
            Agregar primer volumen
          </button>
        </div>
      ) : (
        <>
          {/* Shelf */}
          <div style={{
            background: 'linear-gradient(180deg, #0A0716 0%, #0F0B1E 60%, #0D0920 100%)',
            border: '1px solid rgba(245,165,42,0.06)',
            borderRadius: '2px 2px 0 0',
            padding: '2rem 1.5rem 0',
            minHeight: '280px',
            position: 'relative',
            overflowX: 'auto',
          }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(245,165,42,0.08), transparent)' }} />
            <div data-tutorial="bible-grid" style={{ display: 'flex', gap: '6px', alignItems: 'flex-end', minHeight: '220px', paddingBottom: '0' }}>
              {docs.map((doc) => (
                <BookSpine
                  key={doc.id}
                  doc={doc}
                  selected={selectedId === doc.id}
                  onClick={() => { handleToggle(doc.id); window.dispatchEvent(new Event('tutorial:bible_opened')) }}
                />
              ))}
              <button
                onClick={() => setShowUpload(true)}
                style={{
                  width: '48px', minWidth: '48px', height: '210px',
                  background: 'transparent',
                  border: '1px dashed rgba(245,165,42,0.15)',
                  borderRadius: '2px 4px 4px 2px',
                  cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'rgba(245,165,42,0.25)',
                  transition: 'all 0.15s ease',
                  flexShrink: 0,
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(245,165,42,0.35)'; e.currentTarget.style.color = 'rgba(245,165,42,0.5)' }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(245,165,42,0.15)'; e.currentTarget.style.color = 'rgba(245,165,42,0.25)' }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              </button>
            </div>
          </div>

          {/* Shelf board */}
          <div style={{
            height: '18px',
            background: 'linear-gradient(180deg, #1A1000 0%, #120C00 100%)',
            border: '1px solid rgba(245,165,42,0.12)',
            borderTop: '2px solid rgba(245,165,42,0.15)',
            borderRadius: '0 0 2px 2px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
          }} />

          {/* Detail panel or Canon editor */}
          {selectedDoc && !canonEditorDoc && (
            <div data-tutorial="bible-modal" style={{ marginTop: '1.5rem' }}>
              <DetailPanel
                doc={selectedDoc}
                isAdmin={isAdmin}
                onEdit={() => setEditDoc(selectedDoc)}
                onEditCanon={() => handleStartCanonEdit(selectedDoc)}
                onDelete={() => handleDelete(selectedDoc.id)}
                onClose={() => setSelectedId(null)}
              />
            </div>
          )}

          {canonEditorDoc && (
            <CanonEditorPanel
              doc={canonEditorDoc}
              initialContent={canonEditorContent}
              changeSummary={canonChangeSummary}
              onClose={() => { setCanonEditorDoc(null); setCanonChangeSummary('') }}
              onSaved={() => { fetchDocs(); setCanonEditorDoc(null); setCanonChangeSummary('') }}
            />
          )}

          {!selectedDoc && !canonEditorDoc && (
            <p style={{ marginTop: '1rem', fontSize: '0.75rem', color: 'rgba(240,235,225,0.18)', textAlign: 'center', letterSpacing: '0.06em' }}>
              Haz clic en un volumen para ver su ficha
            </p>
          )}
        </>
      )}

      {showUpload && <UploadModal onClose={() => setShowUpload(false)} onSuccess={fetchDocs} />}
      {editDoc && <EditModal doc={editDoc} onClose={() => setEditDoc(null)} onSuccess={fetchDocs} />}

      {/* Confirmation modals */}
      {confirm1Doc && (
        <Confirm1Modal
          doc={confirm1Doc}
          onContinue={() => { setConfirm2Doc(confirm1Doc); setConfirm1Doc(null) }}
          onClose={() => setConfirm1Doc(null)}
        />
      )}
      {confirm2Doc && (
        <Confirm2Modal
          doc={confirm2Doc}
          onConfirm={(summary) => {
            setCanonChangeSummary(summary)
            setCanonEditorDoc(confirm2Doc)
            setConfirm2Doc(null)
          }}
          onClose={() => { setConfirm2Doc(null); setCanonChangeSummary('') }}
        />
      )}
    </div>
    </div>
  )
}
