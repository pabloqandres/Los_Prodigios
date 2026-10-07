'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { DocumentsList } from '@/components/DocumentsList'

interface DriveCategory {
  id: string
  name: string
  count: number
}

interface DriveFile {
  id: string
  name: string
  mimeType: string
  thumbnailLink?: string
  webViewLink?: string
  createdTime?: string
  size?: string
}

const CATEGORY_META: Record<string, { label: string; description: string; accent: string; icon: React.ReactNode }> = {
  'concept-art': {
    label: 'Concept Art',
    description: 'Diseños exploratorios de personajes, escenarios e identidad visual.',
    accent: '#F5A52A',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="3" width="18" height="18" rx="2"/>
        <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" stroke="none"/>
        <polyline points="21 15 16 10 5 21"/>
      </svg>
    ),
  },
  'personajes': {
    label: 'Personajes',
    description: 'Arte final de personajes aprobados — canon visual de referencia.',
    accent: '#9B6FD4',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
    ),
  },
  'locaciones': {
    label: 'Locaciones',
    description: 'Fondos y escenarios definitivos de la serie.',
    accent: '#4ECDC4',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/>
        <line x1="8" y1="2" x2="8" y2="18"/>
        <line x1="16" y1="6" x2="16" y2="22"/>
      </svg>
    ),
  },
  'props': {
    label: 'Props',
    description: 'Objetos y elementos del mundo: armas, tecnología, artefactos.',
    accent: '#4A8FE8',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
      </svg>
    ),
  },
  'criaturas': {
    label: 'Criaturas',
    description: 'Seres del universo de Los Prodigios, desde boceto hasta diseño final.',
    accent: '#D4256A',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
        <circle cx="12" cy="12" r="3"/>
      </svg>
    ),
  },
  'storyboards': {
    label: 'Storyboards',
    description: 'Páginas de storyboard organizadas por episodio y secuencia.',
    accent: '#8BC34A',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="2" width="20" height="20" rx="2"/>
        <line x1="7" y1="2" x2="7" y2="22"/>
        <line x1="17" y1="2" x2="17" y2="22"/>
        <line x1="2" y1="12" x2="22" y2="12"/>
      </svg>
    ),
  },
}

const CATEGORY_ORDER = ['concept-art', 'personajes', 'locaciones', 'props', 'criaturas', 'storyboards']

function formatSize(bytes?: string) {
  if (!bytes) return ''
  const b = parseInt(bytes)
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(0)} KB`
  return `${(b / (1024 * 1024)).toFixed(1)} MB`
}

export default function AssetsPage() {
  const [categories, setCategories] = useState<DriveCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeCategory, setActiveCategory] = useState<DriveCategory | null>(null)
  const [files, setFiles] = useState<DriveFile[]>([])
  const [filesLoading, setFilesLoading] = useState(false)
  const [lightbox, setLightbox] = useState<DriveFile | null>(null)
  const [canonSlots, setCanonSlots]     = useState<any[]>([])
  const [canonLoading, setCanonLoading] = useState(false)
  const [activeTab, setActiveTab]       = useState<'drive' | 'canon'>('drive')

  useEffect(() => {
    fetch('/api/drive/categories')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) setCategories(data)
        else setError('No se pudo conectar con Google Drive.')
      })
      .catch(() => setError('Error al conectar con Google Drive.'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    setCanonLoading(true)
    fetch('/api/assets/approved')
      .then(r => r.json())
      .then(d => { if (Array.isArray(d)) setCanonSlots(d) })
      .catch(() => {})
      .finally(() => setCanonLoading(false))
  }, [])

  async function openCategory(cat: DriveCategory) {
    if (activeCategory?.id === cat.id) { setActiveCategory(null); setFiles([]); return }
    setActiveCategory(cat)
    setFiles([])
    setFilesLoading(true)
    try {
      const res = await fetch(`/api/drive/files?folderId=${cat.id}`)
      const data = await res.json()
      setFiles(Array.isArray(data) ? data : [])
    } finally {
      setFilesLoading(false)
    }
  }

  // Build a lookup from name → DriveCategory
  const catMap: Record<string, DriveCategory> = {}
  for (const c of categories) {
    if (c.name) catMap[c.name] = c
  }

  const totalFiles = categories.reduce((acc, c) => acc + c.count, 0)

  return (
    <div style={{ width: '100%' }}>

      {/* ── PAGE HEADER ──────────────────────────────────────────────────── */}
      <div style={{ position: 'relative', overflow: 'hidden', background: '#0D0920', borderBottom: '1px solid rgba(155,111,212,0.12)', padding: '3rem 2.5rem 2.5rem' }}>
        <div style={{ position: 'absolute', right: '1.5rem', top: '50%', transform: 'translateY(-50%)', fontFamily: 'Bebas Neue, Impact, sans-serif', fontSize: 'clamp(5rem, 12vw, 9rem)', letterSpacing: '-0.03em', color: '#9B6FD4', opacity: 0.04, lineHeight: 1, userSelect: 'none', pointerEvents: 'none' }}>ART</div>
        <div style={{ position: 'absolute', top: '-60px', right: '25%', width: '350px', height: '280px', borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(155,111,212,0.08) 0%, transparent 70%)', filter: 'blur(40px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, #9B6FD4 0%, rgba(155,111,212,0.4) 40%, transparent 100%)' }} />

        <div style={{ fontSize: '0.625rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#9B6FD4', fontWeight: 600, marginBottom: '0.75rem', opacity: 0.85 }}>Arte · Biblioteca</div>
        <h1 style={{ fontFamily: 'Bebas Neue, Impact, sans-serif', fontSize: 'clamp(3.5rem, 7vw, 5.5rem)', letterSpacing: '0.04em', color: '#F0EBE1', lineHeight: 0.9, marginBottom: '1rem' }}>ASSETS</h1>
        <p style={{ fontSize: '0.9375rem', color: 'rgba(240,235,225,0.45)', maxWidth: '480px' }}>Imágenes y archivos generados para la producción de Los Prodigios.</p>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
          {[
            { value: String(CATEGORY_ORDER.length), label: 'Categorías' },
            { value: loading ? '…' : String(totalFiles), label: 'Archivos' },
          ].map(s => (
            <div key={s.label} style={{ display: 'flex', alignItems: 'baseline', gap: '0.375rem' }}>
              <span style={{ fontFamily: 'Bebas Neue, Impact, sans-serif', fontSize: '1.25rem', color: '#9B6FD4', letterSpacing: '0.04em' }}>{s.value}</span>
              <span style={{ fontSize: '0.625rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(240,235,225,0.35)', fontWeight: 600 }}>{s.label}</span>
            </div>
          ))}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
            <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: loading ? 'rgba(240,235,225,0.2)' : '#4ECDC4' }} />
            <span style={{ fontSize: '0.6875rem', color: 'rgba(240,235,225,0.35)', letterSpacing: '0.04em' }}>
              {loading ? 'Conectando con Drive…' : error ? 'Error de conexión' : 'Drive conectado'}
            </span>
          </div>
        </div>
      </div>

      {/* ── MARQUEE ───────────────────────────────────────────────────────── */}
      <div style={{ background: '#9B6FD4', overflow: 'hidden', padding: '0.55rem 0' }}>
        <div style={{ display: 'inline-block', whiteSpace: 'nowrap', animation: 'marquee 22s linear infinite' }}>
          <span style={{ fontFamily: 'Bebas Neue, Impact, sans-serif', fontSize: '0.9375rem', letterSpacing: '0.14em', color: '#F0EBE1' }}>
            {Array(8).fill('CONCEPT ART\u2003—\u2003PERSONAJES\u2003—\u2003LOCACIONES\u2003—\u2003PROPS\u2003—\u2003CRIATURAS\u2003—\u2003STORYBOARDS\u2003—\u2003').join('')}
          </span>
        </div>
      </div>

      {/* ── BODY ─────────────────────────────────────────────────────────── */}
      <div style={{ padding: '2rem 2.5rem 3rem', maxWidth: '1100px' }}>

        {/* Tab selector */}
        <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid rgba(245,165,42,0.07)', marginBottom: '2rem' }}>
          {([['drive', 'Drive'], ['canon', '✓ Canon Aprobados']] as const).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              style={{
                padding: '0.75rem 1.25rem', background: 'none', border: 'none',
                borderBottom: activeTab === key ? '2px solid #F5A52A' : '2px solid transparent',
                color: activeTab === key ? '#F5A52A' : 'rgba(240,235,225,0.35)',
                fontSize: '0.875rem', fontWeight: activeTab === key ? 600 : 400,
                cursor: 'pointer', fontFamily: 'IBM Plex Sans, sans-serif',
                display: 'flex', alignItems: 'center', gap: '6px',
              }}
            >
              {label}
              {key === 'canon' && (
                <span style={{ fontSize: '0.6875rem', padding: '1px 6px', borderRadius: '10px', background: activeTab === key ? 'rgba(245,165,42,0.15)' : 'rgba(255,255,255,0.05)', color: activeTab === key ? '#F5A52A' : 'rgba(240,235,225,0.3)' }}>
                  {canonSlots.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {activeTab === 'drive' && (
          <>
            {error && (
              <div style={{ padding: '1rem 1.25rem', background: 'rgba(212,37,106,0.06)', border: '1px solid rgba(212,37,106,0.2)', borderRadius: '4px', marginBottom: '1.5rem', fontSize: '0.875rem', color: '#D4256A' }}>
                {error} — Asegúrate de estar logueado con tu cuenta de Google.
              </div>
            )}

            {/* Category grid */}
            <div style={{ fontSize: '0.625rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(240,235,225,0.30)', fontWeight: 600, marginBottom: '1rem' }}>
              Categorías
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: '0.875rem', marginBottom: activeCategory ? '0' : '2.5rem' }}>
              {CATEGORY_ORDER.map((key, i) => {
                const meta = CATEGORY_META[key]
                const driveData = catMap[key]
                const isActive = activeCategory?.name === key
                return (
                  <div
                    key={key}
                    className="card-enter"
                    onClick={() => driveData && openCategory(driveData)}
                    style={{
                      position: 'relative',
                      background: isActive ? '#150B26' : '#0D0920',
                      border: `1px solid ${isActive ? meta.accent : 'rgba(245,165,42,0.07)'}`,
                      borderTop: `2px solid ${meta.accent}`,
                      borderRadius: '4px',
                      padding: '1.25rem',
                      overflow: 'hidden',
                      animationDelay: `${i * 0.05}s`,
                      animationFillMode: 'both',
                      cursor: driveData ? 'pointer' : 'default',
                      transition: 'border-color 0.15s ease, background 0.15s ease',
                    }}
                    onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = '#120D28'; e.currentTarget.style.borderColor = meta.accent } }}
                    onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = '#0D0920'; e.currentTarget.style.borderColor = 'rgba(245,165,42,0.07)' } }}
                  >
                    {/* BG number */}
                    <div style={{ position: 'absolute', right: '-4px', bottom: '-10px', fontFamily: 'Bebas Neue, Impact, sans-serif', fontSize: '5rem', color: meta.accent, opacity: 0.04, lineHeight: 1, userSelect: 'none', pointerEvents: 'none' }}>
                      {String(i + 1).padStart(2, '0')}
                    </div>

                    {/* Icon + count */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.875rem' }}>
                      <div style={{ color: meta.accent, padding: '0.5rem', background: `${meta.accent}12`, borderRadius: '4px' }}>
                        {meta.icon}
                      </div>
                      <div style={{ fontFamily: 'Bebas Neue, Impact, sans-serif', fontSize: '1.75rem', color: meta.accent, opacity: loading ? 0.2 : 0.5, lineHeight: 1 }}>
                        {loading ? '…' : driveData ? String(driveData.count) : '—'}
                      </div>
                    </div>

                    <div style={{ fontFamily: 'Bebas Neue, Impact, sans-serif', fontSize: '1.25rem', letterSpacing: '0.05em', color: '#F0EBE1', lineHeight: 1, marginBottom: '0.5rem' }}>
                      {meta.label}
                    </div>
                    <p style={{ fontSize: '0.8125rem', color: 'rgba(240,235,225,0.40)', lineHeight: 1.55 }}>
                      {meta.description}
                    </p>

                    {isActive && (
                      <div style={{ marginTop: '0.75rem', fontSize: '0.625rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: meta.accent, fontWeight: 600 }}>
                        ▲ Ver archivos
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {/* File gallery — expands below grid when a category is open */}
            {activeCategory && (
              <div style={{ marginBottom: '2.5rem', marginTop: '0.875rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div style={{ fontSize: '0.625rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(240,235,225,0.30)', fontWeight: 600 }}>
                    {CATEGORY_META[activeCategory.name]?.label ?? activeCategory.name} — {activeCategory.count} archivos
                  </div>
                  <a
                    href={`https://drive.google.com/drive/folders/${activeCategory.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontSize: '0.75rem', color: 'rgba(240,235,225,0.35)', textDecoration: 'none', letterSpacing: '0.06em' }}
                  >
                    Abrir en Drive →
                  </a>
                </div>

                {filesLoading ? (
                  <div style={{ padding: '3rem', textAlign: 'center', color: 'rgba(240,235,225,0.25)', fontSize: '0.875rem' }}>
                    Cargando archivos…
                  </div>
                ) : files.length === 0 ? (
                  <div style={{ padding: '3rem', textAlign: 'center', background: '#0D0920', border: '1px solid rgba(245,165,42,0.07)', borderRadius: '4px', color: 'rgba(240,235,225,0.30)', fontSize: '0.875rem' }}>
                    Carpeta vacía — sube archivos desde Google Drive.
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '0.75rem' }}>
                    {files.map(file => {
                      const isImage = file.mimeType?.startsWith('image/')
                      return (
                        <div
                          key={file.id}
                          onClick={() => isImage && setLightbox(file)}
                          style={{
                            background: '#0D0920',
                            border: '1px solid rgba(245,165,42,0.08)',
                            borderRadius: '4px',
                            overflow: 'hidden',
                            cursor: isImage ? 'zoom-in' : 'default',
                            transition: 'border-color 0.15s ease',
                          }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(245,165,42,0.22)' }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(245,165,42,0.08)' }}
                        >
                          {/* Thumbnail */}
                          <div style={{ height: '120px', background: '#120D28', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                            {file.thumbnailLink ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={file.thumbnailLink} alt={file.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(245,165,42,0.2)" strokeWidth="1">
                                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                                <polyline points="14 2 14 8 20 8"/>
                              </svg>
                            )}
                          </div>
                          {/* File info */}
                          <div style={{ padding: '0.5rem 0.625rem' }}>
                            <div style={{ fontSize: '0.6875rem', color: 'rgba(240,235,225,0.55)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {file.name}
                            </div>
                            <div style={{ fontSize: '0.5625rem', color: 'rgba(240,235,225,0.25)', marginTop: '0.15rem' }}>
                              {formatSize(file.size)}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )}

            {/* CTA */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem', padding: '1.375rem 1.5rem', background: '#120D28', border: '1px solid rgba(155,111,212,0.12)', borderRadius: '4px', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
              <div>
                <p style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#F0EBE1', marginBottom: '0.25rem' }}>Generar arte con el Asistente</p>
                <p style={{ fontSize: '0.8125rem', color: 'rgba(240,235,225,0.40)' }}>Abre el Asistente en modo Arte para prompts, briefs visuales y concept art.</p>
              </div>
              <Link href="/studio?context=arte" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.625rem 1.375rem', background: '#9B6FD4', borderRadius: '4px', color: '#F0EBE1', fontSize: '0.875rem', fontWeight: 600, textDecoration: 'none', whiteSpace: 'nowrap', flexShrink: 0 }}>
                Abrir Asistente
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </Link>
            </div>

            {/* Saved prompts */}
            <div style={{ fontSize: '0.625rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(240,235,225,0.30)', fontWeight: 600, marginBottom: '1rem' }}>
              Prompts y briefs guardados
            </div>
            <DocumentsList
              area="arte"
              emptyLabel="prompts o briefs de arte"
              onCreateNew={() => window.location.href = '/studio?context=arte'}
              createLabel="Abrir Asistente de Arte"
            />
          </>
        )}

        {activeTab === 'canon' && (
          <div>
            {canonLoading ? (
              <div style={{ textAlign: 'center', padding: '4rem', color: 'rgba(240,235,225,0.3)', fontSize: '0.875rem' }}>Cargando canon...</div>
            ) : canonSlots.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem', color: 'rgba(240,235,225,0.2)', fontSize: '0.875rem' }}>
                No hay assets aprobados aún. Ve a <strong style={{ color: '#F5A52A' }}>Aprobación</strong> para subir y aprobar imágenes.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {/* Group by category */}
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
                      {Object.entries(byEntity).map(([entityName, entitySlots]) => (
                        <div key={entityName} style={{ marginBottom: '1.5rem' }}>
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
                                  <div style={{ display: 'flex', gap: '4px' }}>
                                    <button
                                      onClick={() => navigator.clipboard.writeText(slot.direct_url)}
                                      style={{ flex: 1, padding: '3px 0', background: 'rgba(78,205,196,0.08)', border: '1px solid rgba(78,205,196,0.2)', borderRadius: '3px', color: '#4ECDC4', fontSize: '0.5625rem', cursor: 'pointer', fontFamily: 'IBM Plex Sans, sans-serif' }}
                                    >
                                      Copiar URL
                                    </button>
                                    <a
                                      href={`https://drive.google.com/file/d/${slot.approved_drive_file_id}/view`}
                                      target="_blank" rel="noopener noreferrer"
                                      style={{ flex: 1, padding: '3px 0', background: 'rgba(245,165,42,0.06)', border: '1px solid rgba(245,165,42,0.2)', borderRadius: '3px', color: '#F5A52A', fontSize: '0.5625rem', cursor: 'pointer', fontFamily: 'IBM Plex Sans, sans-serif', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                    >
                                      Drive ↗
                                    </a>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          onClick={() => setLightbox(null)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(8,6,15,0.92)', zIndex: 100, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', cursor: 'zoom-out' }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={lightbox.thumbnailLink}
            alt={lightbox.name}
            style={{ maxWidth: '90vw', maxHeight: '80vh', objectFit: 'contain', borderRadius: '4px', boxShadow: '0 0 80px rgba(0,0,0,0.8)' }}
            onClick={e => e.stopPropagation()}
          />
          <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <span style={{ fontSize: '0.8125rem', color: 'rgba(240,235,225,0.50)' }}>{lightbox.name}</span>
            <a
              href={lightbox.webViewLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              style={{ fontSize: '0.75rem', color: '#9B6FD4', textDecoration: 'none', letterSpacing: '0.04em' }}
            >
              Abrir en Drive →
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
