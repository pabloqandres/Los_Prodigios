'use client'

import { useState, useEffect, useCallback } from 'react'
import type { Document } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

const CONTEXT_LABELS: Record<string, string> = {
  general: 'General',
  personajes: 'Personajes',
  arte: 'Arte',
  marketing: 'Marketing',
  merchandise: 'Merchandise',
  guion: 'Guión',
  continuidad: 'Continuidad',
  redes: 'Redes Sociales',
  publicidad: 'Publicidad',
  trailers: 'Trailers',
  licensing: 'Licensing',
}

function formatDate(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString('es-CL', { day: 'numeric', month: 'short', year: 'numeric' })
}

function DocumentModal({ doc, onClose }: { doc: Document; onClose: () => void }) {
  const router = useRouter()
  const [deleting, setDeleting] = useState(false)

  function handleDownload() {
    const text = `# ${doc.title}\n\n_Área: ${CONTEXT_LABELS[doc.context ?? doc.area] ?? doc.area} — ${formatDate(doc.created_at)}_\n_Por: ${doc.created_by}_\n\n---\n\n${doc.content}`
    const blob = new Blob([text], { type: 'text/markdown;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${doc.title.replace(/[^a-zA-Z0-9áéíóúüñÁÉÍÓÚÜÑ\s]/g, '').trim().replace(/\s+/g, '_')}.md`
    a.click()
    URL.revokeObjectURL(url)
  }

  async function handleDelete() {
    if (!confirm('¿Eliminar este documento?')) return
    setDeleting(true)
    await fetch(`/api/documents?id=${doc.id}`, { method: 'DELETE' })
    onClose()
    router.refresh()
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(8,6,15,0.88)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 200,
        padding: '1.5rem',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        style={{
          background: '#120D28',
          border: '1px solid rgba(245,165,42,0.12)',
          borderRadius: '2px',
          width: '100%',
          maxWidth: '700px',
          maxHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid rgba(245,165,42,0.07)',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: '1rem',
            flexShrink: 0,
          }}
        >
          <div>
            <div style={{ fontSize: '0.6875rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(240,235,225,0.28)', marginBottom: '0.25rem' }}>
              {CONTEXT_LABELS[doc.context ?? doc.area] ?? doc.area} · {formatDate(doc.created_at)}
            </div>
            <h2 style={{ fontFamily: 'Bebas Neue, Impact, sans-serif', fontSize: '1.375rem', letterSpacing: '0.05em', color: '#F0EBE1' }}>
              {doc.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'rgba(240,235,225,0.35)', cursor: 'pointer', flexShrink: 0, padding: '0.25rem' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div
          style={{
            padding: '1.5rem',
            overflowY: 'auto',
            flex: 1,
            fontSize: '0.875rem',
            color: 'rgba(240,235,225,0.75)',
            lineHeight: 1.7,
            whiteSpace: 'pre-wrap',
            fontFamily: 'IBM Plex Sans, sans-serif',
          }}
        >
          {doc.content}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '1rem 1.5rem',
            borderTop: '1px solid rgba(245,165,42,0.07)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexShrink: 0,
            gap: '0.75rem',
          }}
        >
          <span style={{ fontSize: '0.75rem', color: 'rgba(240,235,225,0.25)', flexShrink: 0 }}>
            Por {doc.created_by}
          </span>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={handleDownload}
              style={{
                padding: '0.375rem 0.875rem',
                background: 'rgba(245,165,42,0.08)',
                border: '1px solid rgba(245,165,42,0.2)',
                borderRadius: '2px',
                color: '#F5A52A',
                fontSize: '0.8125rem',
                cursor: 'pointer',
                fontFamily: 'IBM Plex Sans, sans-serif',
                display: 'flex',
                alignItems: 'center',
                gap: '0.375rem',
              }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Descargar .md
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              style={{
                padding: '0.375rem 0.75rem',
                background: 'transparent',
                border: '1px solid rgba(212,37,106,0.2)',
                borderRadius: '2px',
                color: 'rgba(212,37,106,0.6)',
                fontSize: '0.8125rem',
                cursor: 'pointer',
                fontFamily: 'IBM Plex Sans, sans-serif',
              }}
            >
              {deleting ? 'Eliminando...' : 'Eliminar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

interface DocumentsListProps {
  area: string
  onCreateNew?: () => void
  createLabel?: string
  emptyLabel?: string
}

export function DocumentsList({ area, onCreateNew, createLabel = 'Crear nuevo', emptyLabel = 'documentos' }: DocumentsListProps) {
  const [docs, setDocs] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Document | null>(null)
  const router = useRouter()

  const fetchDocs = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/documents?area=${area}`)
      if (res.ok) setDocs(await res.json())
    } finally {
      setLoading(false)
    }
  }, [area])

  useEffect(() => {
    fetchDocs()
  }, [fetchDocs])

  function handleModalClose() {
    setSelected(null)
    fetchDocs()
  }

  if (loading) {
    return (
      <div style={{ padding: '3rem', display: 'flex', justifyContent: 'center' }}>
        <div style={{ fontSize: '0.8125rem', color: 'rgba(240,235,225,0.25)' }}>Cargando...</div>
      </div>
    )
  }

  if (docs.length === 0) {
    return (
      <>
        <div
          style={{
            background: '#120D28',
            border: '1px solid rgba(245,165,42,0.07)',
            borderRadius: '2px',
            padding: '4rem 2rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem',
            textAlign: 'center',
          }}
        >
          <div style={{ color: 'rgba(240,235,225,0.12)', marginBottom: '0.25rem' }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <line x1="9" y1="9" x2="15" y2="9" />
              <line x1="9" y1="12" x2="15" y2="12" />
              <line x1="9" y1="15" x2="12" y2="15" />
            </svg>
          </div>
          <p style={{ fontSize: '0.9375rem', color: 'rgba(240,235,225,0.25)', fontWeight: 500 }}>
            Sin {emptyLabel} guardados aún
          </p>
          <p style={{ fontSize: '0.8125rem', color: 'rgba(240,235,225,0.18)' }}>
            Usa el Asistente para crear contenido y guardalo con &ldquo;Guardar sesión&rdquo;.
          </p>
          {onCreateNew && (
            <button
              onClick={onCreateNew}
              style={{
                marginTop: '0.5rem',
                padding: '0.5rem 1.25rem',
                background: 'rgba(245,165,42,0.08)',
                border: '1px solid rgba(245,165,42,0.15)',
                borderRadius: '2px',
                color: '#F5A52A',
                fontSize: '0.8125rem',
                cursor: 'pointer',
                fontFamily: 'IBM Plex Sans, sans-serif',
              }}
            >
              {createLabel}
            </button>
          )}
        </div>
        {selected && <DocumentModal doc={selected} onClose={handleModalClose} />}
      </>
    )
  }

  return (
    <>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1rem',
        }}
      >
        {docs.map((doc) => (
          <button
            key={doc.id}
            onClick={() => setSelected(doc)}
            style={{
              background: '#120D28',
              border: '1px solid rgba(245,165,42,0.07)',
              borderRadius: '2px',
              padding: '1.25rem',
              textAlign: 'left',
              cursor: 'pointer',
              transition: 'border-color 0.12s ease, background 0.12s ease',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(245,165,42,0.18)'
              e.currentTarget.style.background = '#160E2C'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(245,165,42,0.07)'
              e.currentTarget.style.background = '#120D28'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
              <span
                style={{
                  fontSize: '0.625rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: '#F5A52A',
                  opacity: 0.7,
                }}
              >
                {CONTEXT_LABELS[doc.context ?? doc.area] ?? doc.area}
              </span>
              <span style={{ fontSize: '0.6875rem', color: 'rgba(240,235,225,0.25)' }}>
                {formatDate(doc.created_at)}
              </span>
            </div>
            <div
              style={{
                fontWeight: 500,
                fontSize: '0.9375rem',
                color: '#F0EBE1',
                lineHeight: 1.3,
              }}
            >
              {doc.title}
            </div>
            <div
              style={{
                fontSize: '0.8125rem',
                color: 'rgba(240,235,225,0.35)',
                lineHeight: 1.5,
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical' as const,
              }}
            >
              {doc.content.replace(/\*\*/g, '').replace(/---/g, '').substring(0, 120)}...
            </div>
          </button>
        ))}
      </div>

      {selected && <DocumentModal doc={selected} onClose={handleModalClose} />}
    </>
  )
}
