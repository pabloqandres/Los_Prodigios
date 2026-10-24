'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { createClient } from '@/lib/supabase'
import type { SeasonEpisode } from '@/components/NuppaSeasonGraph'

const NuppaSeasonGraph = dynamic(() => import('@/components/NuppaSeasonGraph'), { ssr: false })

type RawEpisode = {
  id: string
  season: number
  episode_number: number
  title: string | null
  status: string
}

type RawAnalysis = {
  episode_id: string
  overall_score: number
  scores_snapshot: Array<{ key: string; label: string; score: number; strength?: string; weakness?: string }> | null
}

function scoreColor(score?: number): string {
  if (score === undefined) return 'rgba(240,235,225,0.25)'
  if (score >= 4.3) return '#88D8B0'
  if (score >= 3.5) return '#FFE66D'
  return '#D4256A'
}

function scoreLabel(score?: number): string {
  if (score === undefined) return '–'
  if (score >= 4.3) return 'Listo'
  if (score >= 3.5) return 'Revisar'
  return 'Crítico'
}

export default function MotorPage() {
  const [episodes, setEpisodes] = useState<SeasonEpisode[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const supabase = createClient()

      const { data: rawEps } = await supabase
        .from('episodes')
        .select('id, season, episode_number, title, status')
        .eq('season', 1)
        .order('episode_number')

      if (!rawEps || rawEps.length === 0) {
        setLoading(false)
        return
      }

      const epIds = rawEps.map((e: RawEpisode) => e.id)

      const { data: rawAnalyses } = await supabase
        .from('script_analyses')
        .select('episode_id, overall_score, scores_snapshot')
        .in('episode_id', epIds)
        .eq('is_current', true)

      const analysisMap = new Map<string, RawAnalysis>()
      for (const a of (rawAnalyses ?? []) as RawAnalysis[]) {
        analysisMap.set(a.episode_id, a)
      }

      const merged: SeasonEpisode[] = (rawEps as RawEpisode[]).map(ep => {
        const a = analysisMap.get(ep.id)
        return {
          ...ep,
          overall_score: a?.overall_score,
          scores_snapshot: a?.scores_snapshot ?? undefined,
        }
      })

      setEpisodes(merged)
      setLoading(false)
    }

    load()
  }, [])

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

  // Weakest dimension across all analyzed episodes
  const dimTotals: Record<string, { sum: number; count: number; label: string }> = {}
  for (const ep of analyzed) {
    for (const d of ep.scores_snapshot ?? []) {
      if (!dimTotals[d.key]) dimTotals[d.key] = { sum: 0, count: 0, label: d.label }
      dimTotals[d.key].sum += d.score
      dimTotals[d.key].count++
    }
  }
  const dimAvgs = Object.entries(dimTotals)
    .map(([key, v]) => ({ key, label: v.label, avg: v.sum / v.count }))
    .sort((a, b) => a.avg - b.avg)
  const weakestDim = dimAvgs[0]

  return (
    <div style={{
      height: '100vh',
      background: '#0D0D0D',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        padding: '1.25rem 1.75rem 0.75rem',
        borderBottom: '1px solid rgba(223,248,24,0.08)',
        display: 'flex',
        alignItems: 'baseline',
        gap: '1rem',
        flexShrink: 0,
      }}>
        <div style={{
          fontFamily: 'Bebas Neue, Impact, sans-serif',
          fontSize: '1.375rem',
          letterSpacing: '0.1em',
          color: '#DFF818',
        }}>
          MOTOR NUPPA
        </div>
        <div style={{ fontSize: '0.6875rem', color: 'rgba(240,235,225,0.35)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
          T01 · Los Prodigios · Salud de temporada
        </div>
        {analyzed.length > 0 && avgScore !== undefined && (
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.6875rem', color: 'rgba(240,235,225,0.35)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              Media T01
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
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'rgba(240,235,225,0.3)', fontSize: '0.875rem', letterSpacing: '0.08em' }}>
            Cargando temporada...
          </div>
        ) : episodes.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '0.75rem' }}>
            <div style={{ color: 'rgba(240,235,225,0.25)', fontSize: '0.875rem', letterSpacing: '0.06em' }}>
              No hay episodios en T01
            </div>
          </div>
        ) : (
          <NuppaSeasonGraph episodes={episodes} seasonLabel="T01" />
        )}

        {/* Legend overlay — bottom left */}
        {!loading && episodes.length > 0 && (
          <div style={{
            position: 'absolute',
            bottom: '1.25rem',
            left: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.375rem',
          }}>
            {[
              { color: '#88D8B0', label: 'Score ≥ 4.3 — Listo para producción' },
              { color: '#FFE66D', label: 'Score 3.5–4.2 — Revisar' },
              { color: '#D4256A', label: 'Score < 3.5 — Atención crítica' },
              { color: '#555555', label: 'Sin análisis' },
            ].map(({ color, label }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: color, flexShrink: 0 }} />
                <span style={{ fontSize: '0.625rem', color: 'rgba(240,235,225,0.35)', letterSpacing: '0.08em' }}>{label}</span>
              </div>
            ))}
            <div style={{ marginTop: '0.25rem', fontSize: '0.5625rem', color: 'rgba(240,235,225,0.2)', letterSpacing: '0.06em' }}>
              Nodos pequeños = dimensión débil del episodio · Click = ir al episodio
            </div>
          </div>
        )}
      </div>

      {/* Stats bar — bottom */}
      {analyzed.length > 0 && (
        <div style={{
          borderTop: '1px solid rgba(223,248,24,0.08)',
          padding: '0.875rem 1.75rem',
          display: 'flex',
          gap: '2.5rem',
          flexShrink: 0,
          background: 'rgba(0,0,0,0.4)',
        }}>
          <StatBlock
            label="Episodios analizados"
            value={`${analyzed.length} / ${episodes.length}`}
            color="rgba(240,235,225,0.7)"
          />
          {best && (
            <StatBlock
              label="Mejor episodio"
              value={`E${String(best.episode_number).padStart(2,'0')}  ${best.overall_score?.toFixed(1)}`}
              color={scoreColor(best.overall_score)}
            />
          )}
          {worst && (
            <StatBlock
              label="Necesita atención"
              value={`E${String(worst.episode_number).padStart(2,'0')}  ${worst.overall_score?.toFixed(1)}`}
              color={scoreColor(worst.overall_score)}
            />
          )}
          {weakestDim && (
            <StatBlock
              label="Dimensión más débil"
              value={`${weakestDim.label}  ${weakestDim.avg.toFixed(1)}`}
              color="rgba(240,235,225,0.5)"
            />
          )}
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
            <span style={{ fontSize: '0.5625rem', color: 'rgba(240,235,225,0.18)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Arrastra para rotar · Click para navegar
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

function StatBlock({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
      <div style={{ fontSize: '0.5rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(240,235,225,0.28)', fontWeight: 600 }}>
        {label}
      </div>
      <div style={{ fontFamily: 'Bebas Neue, Impact, sans-serif', fontSize: '1.125rem', letterSpacing: '0.06em', color }}>
        {value}
      </div>
    </div>
  )
}
