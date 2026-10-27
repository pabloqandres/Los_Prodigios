'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import type { SeasonEpisode } from '@/components/NuppaSeasonGraph'

const NuppaSeasonGraph = dynamic(() => import('@/components/NuppaSeasonGraph'), { ssr: false })

const SEASONS = [1, 2, 3, 4, 5]

function scoreColor(score?: number): string {
  if (score === undefined) return 'rgba(240,235,225,0.25)'
  if (score >= 4.3) return '#88D8B0'
  if (score >= 3.5) return '#FFE66D'
  return '#D4256A'
}

export default function MotorPage() {
  const [season, setSeason] = useState(1)
  const [episodes, setEpisodes] = useState<SeasonEpisode[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetch(`/api/motor?season=${season}`)
      .then(r => r.json())
      .then((data: Array<SeasonEpisode & { overall_score: number | null; scores_snapshot: SeasonEpisode['scores_snapshot'] | null }>) => {
        if (Array.isArray(data)) {
          setEpisodes(data.map(ep => ({
            ...ep,
            overall_score: ep.overall_score ?? undefined,
            scores_snapshot: ep.scores_snapshot ?? undefined,
          })))
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [season])

  const analyzed = episodes.filter(e => e.overall_score !== undefined)
  const avgScore = analyzed.length > 0
    ? analyzed.reduce((s, e) => s + (e.overall_score ?? 0), 0) / analyzed.length
    : undefined
  const best = analyzed.length > 0
    ? analyzed.reduce((a, b) => (a.overall_score ?? 0) > (b.overall_score ?? 0) ? a : b)
    : undefined
  const worst = analyzed.length > 0
    ? analyzed.reduce((a, b) => (a.overall_score ?? 0) < (b.overall_score ?? 0) ? a : b)
    : undefined

  const dimTotals: Record<string, { sum: number; count: number; label: string }> = {}
  for (const ep of analyzed) {
    for (const d of ep.scores_snapshot ?? []) {
      if (!dimTotals[d.key]) dimTotals[d.key] = { sum: 0, count: 0, label: d.label }
      dimTotals[d.key].sum += d.score
      dimTotals[d.key].count++
    }
  }
  const weakestDim = Object.entries(dimTotals)
    .map(([, v]) => ({ label: v.label, avg: v.sum / v.count }))
    .sort((a, b) => a.avg - b.avg)[0]

  const seasonLabel = `T0${season}`

  return (
    <div style={{ height: '100vh', background: '#0D0D0D', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

      {/* Header */}
      <div style={{
        padding: '0.875rem 1.75rem',
        borderBottom: '1px solid rgba(223,248,24,0.08)',
        display: 'flex',
        alignItems: 'center',
        gap: '1.25rem',
        flexShrink: 0,
      }}>
        <div style={{
          fontFamily: 'Bebas Neue, Impact, sans-serif',
          fontSize: '1.25rem',
          letterSpacing: '0.1em',
          color: '#DFF818',
          flexShrink: 0,
        }}>
          MOTOR NUPPA
        </div>

        {/* Season selector */}
        <div style={{ display: 'flex', gap: '3px', background: 'rgba(255,255,255,0.04)', borderRadius: '4px', padding: '3px' }}>
          {SEASONS.map(s => {
            const active = s === season
            return (
              <button
                key={s}
                onClick={() => setSeason(s)}
                style={{
                  padding: '4px 12px',
                  background: active ? 'rgba(223,248,24,0.15)' : 'transparent',
                  border: active ? '1px solid rgba(223,248,24,0.4)' : '1px solid transparent',
                  borderRadius: '3px',
                  color: active ? '#DFF818' : 'rgba(240,235,225,0.35)',
                  fontSize: '0.75rem',
                  fontFamily: 'Bebas Neue, Impact, sans-serif',
                  letterSpacing: '0.1em',
                  cursor: 'pointer',
                  transition: 'all 0.12s',
                }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.color = 'rgba(240,235,225,0.7)' }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.color = 'rgba(240,235,225,0.35)' }}
              >
                T0{s}
              </button>
            )
          })}
        </div>

        <div style={{ fontSize: '0.625rem', color: 'rgba(240,235,225,0.3)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
          Los Prodigios · {episodes.length > 0 ? `${episodes.length} episodios` : 'Sin episodios'} · Click en nodo = ir al episodio
        </div>

        {avgScore !== undefined && (
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
            <span style={{ fontSize: '0.5625rem', color: 'rgba(240,235,225,0.3)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
              Media {seasonLabel}
            </span>
            <span style={{
              fontFamily: 'Bebas Neue, Impact, sans-serif',
              fontSize: '1.5rem',
              color: scoreColor(avgScore),
              letterSpacing: '0.05em',
            }}>
              {avgScore.toFixed(1)}
            </span>
          </div>
        )}
      </div>

      {/* Graph */}
      <div style={{ flex: 1, position: 'relative', minHeight: 0 }}>
        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'rgba(240,235,225,0.3)', fontSize: '0.8rem', letterSpacing: '0.1em' }}>
            Cargando {seasonLabel}...
          </div>
        ) : episodes.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '0.5rem' }}>
            <div style={{ color: 'rgba(240,235,225,0.2)', fontSize: '0.8rem', letterSpacing: '0.06em' }}>
              No hay episodios en {seasonLabel}
            </div>
            <div style={{ color: 'rgba(240,235,225,0.12)', fontSize: '0.65rem' }}>
              Crea episodios desde la sección Episodios
            </div>
          </div>
        ) : (
          <NuppaSeasonGraph episodes={episodes} seasonLabel={seasonLabel} />
        )}

        {/* Legend — bottom left */}
        {!loading && episodes.length > 0 && (
          <div style={{ position: 'absolute', bottom: '1.25rem', left: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            {[
              { color: '#88D8B0', label: 'Score ≥ 4.3 — Listo' },
              { color: '#FFE66D', label: 'Score 3.5–4.2 — Revisar' },
              { color: '#D4256A', label: 'Score < 3.5 — Crítico' },
              { color: '#555555', label: 'Sin análisis' },
            ].map(({ color, label }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: color, flexShrink: 0 }} />
                <span style={{ fontSize: '0.5625rem', color: 'rgba(240,235,225,0.3)', letterSpacing: '0.06em' }}>{label}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Stats bar */}
      {analyzed.length > 0 && (
        <div style={{
          borderTop: '1px solid rgba(223,248,24,0.08)',
          padding: '0.75rem 1.75rem',
          display: 'flex',
          gap: '2.5rem',
          alignItems: 'center',
          flexShrink: 0,
          background: 'rgba(0,0,0,0.4)',
        }}>
          <StatBlock label="Analizados" value={`${analyzed.length} / ${episodes.length}`} color="rgba(240,235,225,0.6)" />
          {best && <StatBlock label="Mejor" value={`E${String(best.episode_number).padStart(2,'0')}  ${best.overall_score?.toFixed(1)}`} color={scoreColor(best.overall_score)} />}
          {worst && best?.id !== worst?.id && <StatBlock label="Atención" value={`E${String(worst.episode_number).padStart(2,'0')}  ${worst.overall_score?.toFixed(1)}`} color={scoreColor(worst.overall_score)} />}
          {weakestDim && <StatBlock label="Dimensión débil" value={`${weakestDim.label}  ${weakestDim.avg.toFixed(1)}`} color="rgba(240,235,225,0.45)" />}
          <div style={{ marginLeft: 'auto', fontSize: '0.5rem', color: 'rgba(240,235,225,0.15)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Arrastra para rotar
          </div>
        </div>
      )}
    </div>
  )
}

function StatBlock({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
      <div style={{ fontSize: '0.45rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(240,235,225,0.25)', fontWeight: 600 }}>
        {label}
      </div>
      <div style={{ fontFamily: 'Bebas Neue, Impact, sans-serif', fontSize: '1rem', letterSpacing: '0.06em', color }}>
        {value}
      </div>
    </div>
  )
}
