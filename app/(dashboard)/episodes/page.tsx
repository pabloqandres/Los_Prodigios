'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

type EpisodeSummary = {
  id: string
  season: number
  episode_number: number
  title: string | null
  logline: string | null
  status: 'draft' | 'outline' | 'script' | 'in_production' | 'completed'
  updated_at: string
}

const STATUS_LABELS: Record<string, string> = {
  draft: 'Borrador',
  outline: 'Outline',
  script: 'Guión',
  in_production: 'En producción',
  completed: 'Completado',
}

const STATUS_COLORS: Record<string, string> = {
  draft: 'rgba(240,235,225,0.15)',
  outline: '#F5A52A',
  script: '#9B6FD4',
  in_production: '#4ECDC4',
  completed: '#D4256A',
}

const MARQUEE = Array(8).fill('EPISODIOS\u2003—\u2003LOS PRODIGIOS\u2003—\u2003T1→T5\u2003—\u200350 EP\u2003—\u2003').join('')

export default function EpisodesPage() {
  const router = useRouter()
  const [episodes, setEpisodes] = useState<EpisodeSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState<{ season: number; ep: number } | null>(null)

  useEffect(() => {
    fetch('/api/episodes')
      .then(r => r.json())
      .then(d => { if (Array.isArray(d)) setEpisodes(d) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  async function createEpisode(season: number, episode_number: number) {
    setCreating({ season, ep: episode_number })
    try {
      const res = await fetch('/api/episodes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ season, episode_number }),
      })
      const data = await res.json()
      if (data.id) router.push(`/episodes/${data.id}`)
    } finally {
      setCreating(null)
    }
  }

  function episodeForSlot(season: number, ep: number) {
    return episodes.find(e => e.season === season && e.episode_number === ep)
  }

  const completedCount = episodes.filter(e => e.status === 'completed').length

  return (
    <div style={{ width: '100%', fontFamily: 'IBM Plex Sans, sans-serif' }}>

      {/* Hero */}
      <div style={{ position: 'relative', background: '#08060F', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', top: '-40px', left: '-20px', width: '500px', height: '300px', borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(212,37,106,0.10) 0%, transparent 70%)', filter: 'blur(50px)' }} />
          <div style={{ position: 'absolute', top: '20px', right: '-40px', width: '400px', height: '280px', borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(155,111,212,0.08) 0%, transparent 70%)', filter: 'blur(55px)' }} />
        </div>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(212,37,106,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(212,37,106,0.025) 1px, transparent 1px)', backgroundSize: '60px 60px', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '40%', background: 'linear-gradient(transparent, #08060F)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', padding: '2.5rem 2.5rem 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <span style={{ fontFamily: 'monospace', fontSize: '0.625rem', letterSpacing: '0.14em', color: 'rgba(240,235,225,0.28)', textTransform: 'uppercase' }}>SERIE_01 · TEMPORADAS_1–5</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#D4256A' }} />
              <span style={{ fontFamily: 'monospace', fontSize: '0.625rem', letterSpacing: '0.18em', color: '#D4256A', textTransform: 'uppercase' }}>EN_PRODUCCIÓN</span>
            </div>
          </div>

          <div style={{ lineHeight: 0.88, marginBottom: '0' }}>
            <div style={{ fontFamily: 'Bebas Neue, Impact, sans-serif', fontSize: 'clamp(2rem, 5vw, 3rem)', letterSpacing: '0.12em', color: 'rgba(240,235,225,0.35)', lineHeight: 1, marginBottom: '0.1em' }}>LOS PRODIGIOS</div>
            <div style={{ fontFamily: 'Bebas Neue, Impact, sans-serif', fontSize: 'clamp(4rem, 14vw, 10rem)', letterSpacing: '0.02em', color: '#F0EBE1', lineHeight: 0.85, whiteSpace: 'nowrap' }}>EPISODIOS</div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1.5rem 0 2.5rem', flexWrap: 'wrap' }}>
            <span style={{ fontFamily: 'Bebas Neue, Impact, sans-serif', fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', letterSpacing: '0.04em', color: 'rgba(240,235,225,0.55)', lineHeight: 1 }}>
              {completedCount} de 50 completados
            </span>
            <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, rgba(212,37,106,0.3), transparent)' }} />
          </div>
        </div>
      </div>

      {/* Marquee */}
      <div style={{ background: '#D4256A', overflow: 'hidden', padding: '0.55rem 0' }}>
        <div style={{ display: 'inline-block', whiteSpace: 'nowrap', animation: 'marquee 32s linear infinite' }}>
          <span style={{ fontFamily: 'Bebas Neue, Impact, sans-serif', fontSize: '0.9rem', letterSpacing: '0.12em', color: '#F0EBE1' }}>{MARQUEE}</span>
        </div>
      </div>

      {/* Grid por temporada */}
      <div style={{ padding: '2.5rem', maxWidth: '1200px' }}>
        {loading ? (
          <div style={{ color: 'rgba(240,235,225,0.25)', fontSize: '0.875rem' }}>Cargando episodios...</div>
        ) : (
          [1, 2, 3, 4, 5].map(season => (
            <div key={season} style={{ marginBottom: '3rem' }}>
              {/* Season header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
                <div style={{ fontFamily: 'Bebas Neue, Impact, sans-serif', fontSize: '1.5rem', letterSpacing: '0.1em', color: '#D4256A' }}>
                  TEMPORADA {String(season).padStart(2, '0')}
                </div>
                <div style={{ flex: 1, height: '1px', background: 'rgba(212,37,106,0.15)' }} />
                <div style={{ fontFamily: 'monospace', fontSize: '0.6rem', letterSpacing: '0.12em', color: 'rgba(240,235,225,0.2)' }}>
                  {episodes.filter(e => e.season === season && e.status === 'completed').length} / 10 completados
                </div>
              </div>

              {/* Episode grid */}
              <div data-tutorial="episodes-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.75rem' }}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(ep => {
                  const episode = episodeForSlot(season, ep)
                  const isCreating = creating?.season === season && creating?.ep === ep
                  const code = `T${season}E${String(ep).padStart(2, '0')}`
                  const statusColor = episode ? STATUS_COLORS[episode.status] : 'rgba(240,235,225,0.06)'

                  if (episode) {
                    return (
                      <div
                        key={ep}
                        onClick={() => router.push(`/episodes/${episode.id}`)}
                        style={{
                          background: '#0D0920',
                          borderRadius: '4px',
                          borderTop: `2px solid ${statusColor}`,
                          border: `1px solid rgba(212,37,106,0.10)`,
                          borderTopColor: statusColor,
                          padding: '1rem',
                          cursor: 'pointer',
                          transition: 'background 0.15s, box-shadow 0.15s',
                          minHeight: '140px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.375rem',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#130D2A'; e.currentTarget.style.boxShadow = `0 4px 20px rgba(212,37,106,0.12)` }}
                        onMouseLeave={e => { e.currentTarget.style.background = '#0D0920'; e.currentTarget.style.boxShadow = 'none' }}
                      >
                        <div style={{ fontFamily: 'monospace', fontSize: '0.55rem', letterSpacing: '0.16em', color: 'rgba(240,235,225,0.3)', textTransform: 'uppercase' }}>{code}</div>
                        <div style={{ fontFamily: 'Bebas Neue, Impact, sans-serif', fontSize: '1rem', letterSpacing: '0.05em', color: '#F0EBE1', lineHeight: 1.1, flex: 1 }}>
                          {episode.title || 'Sin título'}
                        </div>
                        {episode.logline && (
                          <div style={{ fontSize: '0.6875rem', color: 'rgba(240,235,225,0.35)', lineHeight: 1.4, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                            {episode.logline}
                          </div>
                        )}
                        <div style={{ marginTop: 'auto', paddingTop: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span style={{ fontSize: '0.55rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: statusColor, fontWeight: 600 }}>
                            {STATUS_LABELS[episode.status]}
                          </span>
                          <span style={{ fontSize: '0.6rem', color: '#D4256A', fontWeight: 700 }}>Abrir →</span>
                        </div>
                      </div>
                    )
                  }

                  // Empty slot
                  return (
                    <div
                      key={ep}
                      onClick={() => !isCreating && createEpisode(season, ep)}
                      style={{
                        background: 'rgba(212,37,106,0.02)',
                        borderRadius: '4px',
                        border: '1px dashed rgba(212,37,106,0.12)',
                        padding: '1rem',
                        cursor: isCreating ? 'not-allowed' : 'pointer',
                        minHeight: '140px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        transition: 'background 0.15s, border-color 0.15s',
                        opacity: isCreating ? 0.6 : 1,
                      }}
                      onMouseEnter={e => { if (!isCreating) { e.currentTarget.style.background = 'rgba(212,37,106,0.05)'; e.currentTarget.style.borderColor = 'rgba(212,37,106,0.3)' } }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(212,37,106,0.02)'; e.currentTarget.style.borderColor = 'rgba(212,37,106,0.12)' }}
                    >
                      <div style={{ fontFamily: 'monospace', fontSize: '0.55rem', letterSpacing: '0.16em', color: 'rgba(240,235,225,0.2)' }}>{code}</div>
                      <div style={{ fontSize: '1.25rem', color: 'rgba(212,37,106,0.3)' }}>{isCreating ? '...' : '+'}</div>
                      <div style={{ fontSize: '0.625rem', color: 'rgba(240,235,225,0.2)', textAlign: 'center', letterSpacing: '0.06em' }}>
                        {isCreating ? 'Creando...' : 'Crear episodio'}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
