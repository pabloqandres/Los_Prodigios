'use client'

import { REVIEWER_COLORS } from '@/lib/approval-config'

interface Props {
  name: string
  status: 'approved' | 'rejected' | 'pending'
  note?: string | null
}

export default function ApprovalBadge({ name, status, note }: Props) {
  const color = REVIEWER_COLORS[name] ?? '#F0EBE1'

  const bg = status === 'approved'
    ? `${color}22`
    : status === 'rejected'
    ? 'rgba(212,37,106,0.12)'
    : 'rgba(240,235,225,0.05)'

  const border = status === 'approved'
    ? `1px solid ${color}55`
    : status === 'rejected'
    ? '1px solid rgba(212,37,106,0.3)'
    : '1px solid rgba(240,235,225,0.1)'

  const textColor = status === 'approved'
    ? color
    : status === 'rejected'
    ? '#D4256A'
    : 'rgba(240,235,225,0.3)'

  const icon = status === 'approved' ? '✓' : status === 'rejected' ? '✕' : '·'

  return (
    <div
      title={note ?? undefined}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: '4px',
        padding: '2px 8px', borderRadius: '20px',
        background: bg, border,
        fontSize: '0.6875rem', fontWeight: 600,
        color: textColor, fontFamily: 'IBM Plex Sans, sans-serif',
        letterSpacing: '0.04em', whiteSpace: 'nowrap',
        cursor: note ? 'help' : 'default',
        transition: 'all 0.15s',
      }}
    >
      <span>{icon}</span>
      <span>{name}</span>
    </div>
  )
}
