'use client'

import type { AssetSlotWithApprovals } from '@/lib/supabase'

export type StatusFilter = 'all' | 'pending' | 'in_review' | 'rejected' | 'approved'

interface Props {
  slots: AssetSlotWithApprovals[]
  activeFilter: StatusFilter
  onFilterChange: (filter: StatusFilter) => void
}

export default function ApprovalStats({ slots, activeFilter, onFilterChange }: Props) {
  const total     = slots.length
  const pending   = slots.filter(s => s.status === 'pending').length
  const inReview  = slots.filter(s => s.status === 'in_review').length
  const approved  = slots.filter(s => s.status === 'approved').length
  const rejected  = slots.filter(s => s.status === 'rejected').length
  const pct       = total > 0 ? Math.round((approved / total) * 100) : 0

  const stats: { key: StatusFilter; label: string; value: number; color: string }[] = [
    { key: 'all',       label: 'Total',       value: total,    color: 'rgba(240,235,225,0.5)' },
    { key: 'pending',   label: 'Pendiente',   value: pending,  color: 'rgba(240,235,225,0.3)' },
    { key: 'in_review', label: 'En revisión', value: inReview, color: '#F5A52A' },
    { key: 'rejected',  label: 'Rechazados',  value: rejected, color: '#D4256A' },
    { key: 'approved',  label: 'Aprobados',   value: approved, color: '#4ECDC4' },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        {stats.map(s => {
          const isActive = activeFilter === s.key
          return (
            <div
              key={s.key}
              onClick={() => onFilterChange(isActive ? 'all' : s.key)}
              style={{
                background: isActive ? `${s.color}12` : 'rgba(255,255,255,0.03)',
                border: `1px solid ${isActive ? `${s.color}55` : 'rgba(245,165,42,0.07)'}`,
                borderRadius: '4px', padding: '0.625rem 1rem',
                display: 'flex', flexDirection: 'column', gap: '2px',
                cursor: 'pointer', transition: 'all 0.15s',
                userSelect: 'none',
              }}
            >
              <div style={{ fontSize: '1.375rem', fontFamily: 'Bebas Neue, Impact, sans-serif', letterSpacing: '0.04em', color: s.color, lineHeight: 1 }}>
                {s.value}
              </div>
              <div style={{
                fontSize: '0.625rem', letterSpacing: '0.12em', textTransform: 'uppercase',
                color: isActive ? s.color : 'rgba(240,235,225,0.3)',
                fontWeight: isActive ? 700 : 400,
              }}>
                {s.label}
              </div>
            </div>
          )
        })}

        {/* Progress */}
        <div style={{ flex: 1, minWidth: '200px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '4px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6875rem', color: 'rgba(240,235,225,0.4)' }}>
            <span>Progreso canon</span>
            <span style={{ color: '#4ECDC4', fontWeight: 600 }}>{pct}%</span>
          </div>
          <div style={{ height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{
              height: '100%', width: `${pct}%`,
              background: 'linear-gradient(90deg, #F5A52A, #4ECDC4)',
              borderRadius: '3px', transition: 'width 0.5s ease',
            }} />
          </div>
        </div>
      </div>

      {/* Active filter indicator */}
      {activeFilter !== 'all' && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: '0.6875rem', color: 'rgba(240,235,225,0.4)' }}>
            Filtrando: <strong style={{ color: stats.find(s => s.key === activeFilter)?.color }}>{stats.find(s => s.key === activeFilter)?.label}</strong>
            {' '}({stats.find(s => s.key === activeFilter)?.value})
          </span>
          <button
            onClick={() => onFilterChange('all')}
            style={{
              padding: '2px 8px', background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.1)', borderRadius: 3,
              color: 'rgba(240,235,225,0.35)', fontSize: '0.625rem', cursor: 'pointer',
              fontFamily: 'IBM Plex Sans, sans-serif',
            }}
          >
            ✕ Quitar filtro
          </button>
        </div>
      )}
    </div>
  )
}
