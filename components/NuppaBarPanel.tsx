'use client'

import { useState, useRef, useEffect } from 'react'
import type { SeasonEpisode } from '@/components/NuppaSeasonGraph'

// ── Dimension config ──────────────────────────────────────────────────────────

const DIMS = [
  { key: 'general',    label: 'General',    color: '#F2EEEA' },
  { key: 'narrativa',  label: 'Narrativa',  color: '#4ECDC4' },
  { key: 'personajes', label: 'Personajes', color: '#9B6FD4' },
  { key: 'ritmo',      label: 'Ritmo',      color: '#FF6B35' },
  { key: 'visual',     label: 'Visual',     color: '#DFF818' },
  { key: 'dialogos',   label: 'Diálogos',   color: '#D4256A' },
  { key: 'produccion', label: 'Producción', color: '#FFE66D' },
] as const

type DimKey = typeof DIMS[number]['key']

const THRESHOLD = 4.3
const Y_MIN = 2.5
const Y_MAX = 5.0

// ── Helpers ───────────────────────────────────────────────────────────────────

function scoreColor(score: number): string {
  if (score >= 4.3) return '#88D8B0'
  if (score >= 3.5) return '#FFE66D'
  return '#D4256A'
}

function getScore(ep: SeasonEpisode, dimKey: DimKey): number | undefined {
  if (dimKey === 'general') return ep.overall_score
  if (!ep.scores_snapshot) return undefined
  // Try exact key match first, then fuzzy match on label
  const exact = ep.scores_snapshot.find(d => d.key === dimKey)
  if (exact) return exact.score
  // Fallback: match 'dialogos' → 'diálogos', etc.
  const labelMap: Record<string, string> = {
    dialogos:   'diálogo',
    produccion: 'producción',
    narrativa:  'narrativa',
    personajes: 'personaj',
    ritmo:      'ritmo',
    visual:     'visual',
  }
  const needle = labelMap[dimKey] ?? dimKey
  const fuzzy = ep.scores_snapshot.find(d => d.key.toLowerCase().includes(needle) || d.label.toLowerCase().includes(needle))
  return fuzzy?.score
}

// ── Component ─────────────────────────────────────────────────────────────────

interface Props {
  episodes: SeasonEpisode[]
  seasonLabel: string
}

export default function NuppaBarPanel({ episodes, seasonLabel }: Props) {
  const [activeDim, setActiveDim] = useState<DimKey>('general')
  const [tooltip, setTooltip] = useState<{ x: number; y: number; ep: SeasonEpisode; score: number } | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const dim = DIMS.find(d => d.key === activeDim)!

  // ── Chart geometry ────────────────────────────────────────────────────────

  const BAR_AREA_H = 120   // px height of the bar drawing area
  const BAR_GAP    = 6     // px gap between bars

  function yPct(score: number): number {
    return 1 - (Math.min(Math.max(score, Y_MIN), Y_MAX) - Y_MIN) / (Y_MAX - Y_MIN)
  }

  const thresholdPct = yPct(THRESHOLD)

  // ── Render ────────────────────────────────────────────────────────────────

  const analyzed = episodes.filter(ep => getScore(ep, activeDim) !== undefined)

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        background: 'rgba(0,0,0,0.0)',
        padding: '0.875rem 1.75rem 0.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.625rem',
      }}
    >
      {/* Top row: label + dim selector */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        <span style={{
          fontSize: '0.5rem',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: 'rgba(240,235,225,0.25)',
          fontWeight: 700,
          flexShrink: 0,
        }}>
          {seasonLabel} · por episodio
        </span>

        {/* Dimension pills */}
        <div style={{ display: 'flex', gap: '3px', flexWrap: 'wrap' }}>
          {DIMS.map(d => {
            const active = d.key === activeDim
            return (
              <button
                key={d.key}
                onClick={() => setActiveDim(d.key)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '3px 9px',
                  background: active ? 'rgba(255,255,255,0.06)' : 'transparent',
                  border: active ? `1px solid ${d.color}55` : '1px solid transparent',
                  borderRadius: '20px',
                  cursor: 'pointer',
                  transition: 'all 0.12s',
                }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.03)' }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent' }}
              >
                <div style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: active ? d.color : (d.key === 'general' ? 'rgba(242,238,234,0.3)' : d.color + '66'),
                  flexShrink: 0,
                  transition: 'background 0.12s',
                }} />
                <span style={{
                  fontSize: '0.625rem',
                  letterSpacing: '0.06em',
                  color: active ? d.color : 'rgba(240,235,225,0.3)',
                  fontFamily: 'IBM Plex Sans, sans-serif',
                  transition: 'color 0.12s',
                }}>
                  {d.label}
                </span>
              </button>
            )
          })}
        </div>

        {/* Avg for selected dim */}
        {analyzed.length > 0 && (() => {
          const avg = analyzed.reduce((s, ep) => s + (getScore(ep, activeDim) ?? 0), 0) / analyzed.length
          return (
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'baseline', gap: '4px', flexShrink: 0 }}>
              <span style={{ fontSize: '0.45rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(240,235,225,0.2)' }}>
                Media {dim.label}
              </span>
              <span style={{
                fontFamily: 'Bebas Neue, Impact, sans-serif',
                fontSize: '1.25rem',
                color: scoreColor(avg),
                letterSpacing: '0.05em',
              }}>
                {avg.toFixed(1)}
              </span>
              <span style={{ fontSize: '0.55rem', color: 'rgba(240,235,225,0.18)', letterSpacing: '0.06em' }}>/5</span>
            </div>
          )
        })()}
      </div>

      {/* Chart area */}
      <div style={{ position: 'relative', width: '100%', height: `${BAR_AREA_H + 20}px` }}>

        {/* Y-axis labels */}
        {[5.0, 4.3, 3.5].map(val => {
          const pct = yPct(val)
          const isThreshold = val === THRESHOLD
          return (
            <div
              key={val}
              style={{
                position: 'absolute',
                left: 0,
                top: `${pct * BAR_AREA_H}px`,
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                pointerEvents: 'none',
              }}
            >
              <span style={{
                fontSize: '0.45rem',
                color: isThreshold ? 'rgba(223,248,24,0.35)' : 'rgba(240,235,225,0.15)',
                letterSpacing: '0.08em',
                width: '18px',
                textAlign: 'right',
                flexShrink: 0,
              }}>
                {val.toFixed(1)}
              </span>
              <div style={{
                height: '1px',
                width: 'calc(100% - 24px)',  // approx, refined by bars
                background: isThreshold
                  ? 'rgba(223,248,24,0.18)'
                  : 'rgba(240,235,225,0.05)',
                borderTop: isThreshold ? '1px dashed rgba(223,248,24,0.25)' : 'none',
              }} />
            </div>
          )
        })}

        {/* Bars + x-labels */}
        <div style={{
          position: 'absolute',
          left: '26px',
          right: 0,
          top: 0,
          height: `${BAR_AREA_H + 20}px`,
          display: 'flex',
          alignItems: 'flex-end',
          gap: `${BAR_GAP}px`,
        }}>
          {episodes.length === 0 ? (
            <div style={{ color: 'rgba(240,235,225,0.15)', fontSize: '0.7rem', alignSelf: 'center', margin: 'auto' }}>
              Sin episodios
            </div>
          ) : episodes.map(ep => {
            const score = getScore(ep, activeDim)
            const hasScore = score !== undefined
            const barH = hasScore ? Math.max(4, (1 - yPct(score!)) * BAR_AREA_H) : 3
            const barColor = hasScore ? (activeDim === 'general' ? scoreColor(score!) : dim.color) : 'rgba(240,235,225,0.1)'
            const epLabel = `E${String(ep.episode_number).padStart(2, '0')}`

            return (
              <div
                key={ep.id}
                style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', minWidth: 0 }}
                onMouseEnter={e => {
                  if (!hasScore) return
                  const rect = e.currentTarget.getBoundingClientRect()
                  const containerRect = containerRef.current?.getBoundingClientRect()
                  if (!containerRect) return
                  setTooltip({
                    x: rect.left + rect.width / 2 - containerRect.left,
                    y: rect.top - containerRect.top - 8,
                    ep,
                    score: score!,
                  })
                }}
                onMouseLeave={() => setTooltip(null)}
                onClick={() => {
                  // Nothing here — navigation handled by 3D graph below
                }}
              >
                {/* Score label above bar */}
                <span style={{
                  fontSize: '0.5rem',
                  color: hasScore ? barColor : 'transparent',
                  fontFamily: 'Bebas Neue, Impact, sans-serif',
                  letterSpacing: '0.04em',
                  lineHeight: 1,
                  marginBottom: '1px',
                }}>
                  {hasScore ? score!.toFixed(1) : ''}
                </span>

                {/* Bar */}
                <div style={{
                  width: '100%',
                  height: `${barH}px`,
                  background: hasScore
                    ? `linear-gradient(to top, ${barColor}99, ${barColor}EE)`
                    : 'rgba(240,235,225,0.07)',
                  borderRadius: '2px 2px 0 0',
                  borderTop: hasScore ? `1px solid ${barColor}` : 'none',
                  transition: 'height 0.25s ease, background 0.2s',
                  cursor: hasScore ? 'default' : 'default',
                }} />

                {/* X label */}
                <span style={{
                  fontSize: '0.5rem',
                  color: 'rgba(240,235,225,0.25)',
                  letterSpacing: '0.06em',
                  marginTop: '2px',
                  fontFamily: 'IBM Plex Sans, sans-serif',
                }}>
                  {epLabel}
                </span>
              </div>
            )
          })}
        </div>

        {/* Threshold label */}
        <div style={{
          position: 'absolute',
          left: '26px',
          top: `${thresholdPct * BAR_AREA_H - 9}px`,
          fontSize: '0.4rem',
          color: 'rgba(223,248,24,0.3)',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          pointerEvents: 'none',
          background: 'rgba(0,0,0,0)',
        }}>
          Umbral aprobación ({THRESHOLD})
        </div>

        {/* Tooltip */}
        {tooltip && (() => {
          const dimScores = tooltip.ep.scores_snapshot ?? []
          return (
            <div style={{
              position: 'absolute',
              left: `${tooltip.x}px`,
              top: `${tooltip.y}px`,
              transform: 'translate(-50%, -100%)',
              background: 'rgba(12,10,22,0.97)',
              border: `1px solid ${scoreColor(tooltip.score)}44`,
              borderRadius: '4px',
              padding: '7px 10px',
              pointerEvents: 'none',
              zIndex: 10,
              minWidth: '140px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.6)',
            }}>
              <div style={{ fontSize: '0.625rem', color: 'rgba(240,235,225,0.5)', marginBottom: '4px', letterSpacing: '0.06em' }}>
                E{String(tooltip.ep.episode_number).padStart(2, '0')}
                {tooltip.ep.title ? ` — ${tooltip.ep.title}` : ''}
              </div>
              <div style={{
                fontFamily: 'Bebas Neue, Impact, sans-serif',
                fontSize: '1.1rem',
                color: scoreColor(tooltip.score),
                letterSpacing: '0.06em',
                lineHeight: 1,
                marginBottom: dimScores.length > 0 ? '6px' : 0,
              }}>
                {tooltip.score.toFixed(1)} <span style={{ fontSize: '0.55rem', color: 'rgba(240,235,225,0.2)' }}>/5</span>
              </div>
              {dimScores.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  {dimScores.map(d => {
                    const dc = DIMS.find(x => x.key === d.key || d.key.includes(x.key) || x.key.includes(d.key.split('_')[0]))?.color ?? '#888'
                    return (
                      <div key={d.key} style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.5rem', color: 'rgba(240,235,225,0.4)', letterSpacing: '0.04em' }}>{d.label}</span>
                        <span style={{ fontSize: '0.5625rem', color: dc, fontFamily: 'Bebas Neue, Impact, sans-serif', letterSpacing: '0.04em' }}>{d.score.toFixed(1)}</span>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })()}
      </div>
    </div>
  )
}
