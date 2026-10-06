'use client'

import type { AssetSlotWithApprovals } from '@/lib/supabase'

interface Props {
  slots: AssetSlotWithApprovals[]
}

export default function ApprovalStats({ slots }: Props) {
  const total     = slots.length
  const pending   = slots.filter(s => s.status === 'pending').length
  const inReview  = slots.filter(s => s.status === 'in_review').length
  const approved  = slots.filter(s => s.status === 'approved').length
  const rejected  = slots.filter(s => s.status === 'rejected').length
  const pct       = total > 0 ? Math.round((approved / total) * 100) : 0

  const stats = [
    { label: 'Total', value: total,    color: 'rgba(240,235,225,0.5)' },
    { label: 'Pendiente', value: pending,  color: 'rgba(240,235,225,0.3)' },
    { label: 'En revisión', value: inReview, color: '#F5A52A' },
    { label: 'Rechazados', value: rejected, color: '#D4256A' },
    { label: 'Aprobados', value: approved, color: '#4ECDC4' },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        {stats.map(s => (
          <div key={s.label} style={{
            background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(245,165,42,0.07)',
            borderRadius: '4px', padding: '0.625rem 1rem',
            display: 'flex', flexDirection: 'column', gap: '2px',
          }}>
            <div style={{ fontSize: '1.375rem', fontFamily: 'Bebas Neue, Impact, sans-serif', letterSpacing: '0.04em', color: s.color, lineHeight: 1 }}>
              {s.value}
            </div>
            <div style={{ fontSize: '0.625rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(240,235,225,0.3)' }}>
              {s.label}
            </div>
          </div>
        ))}

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
    </div>
  )
}
