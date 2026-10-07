'use client'

import { CONTEXT_LABELS } from '@/lib/contexts'

interface ContextSelectorProps {
  value: string
  onChange: (value: string) => void
}

export function ContextSelector({ value, onChange }: ContextSelectorProps) {
  return (
    <div style={{ position: 'relative' }}>
      <label
        style={{
          display: 'block',
          fontFamily: 'IBM Plex Sans, sans-serif',
          fontSize: '0.5625rem',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          color: 'rgba(240,235,225,0.28)',
          marginBottom: '0.375rem',
        }}
      >
        Contexto de trabajo
      </label>
      <div style={{ position: 'relative' }}>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            width: '100%',
            background: '#1A1235',
            border: '1px solid rgba(245,165,42,0.12)',
            borderRadius: '2px',
            color: '#F0EBE1',
            fontFamily: 'IBM Plex Sans, sans-serif',
            fontSize: '0.875rem',
            padding: '0.5rem 2rem 0.5rem 0.75rem',
            appearance: 'none',
            WebkitAppearance: 'none',
            cursor: 'pointer',
            transition: 'border-color 0.15s ease',
            outline: 'none',
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = 'rgba(245,165,42,0.35)'
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = 'rgba(245,165,42,0.12)'
          }}
        >
          {Object.entries(CONTEXT_LABELS).map(([key, label]) => (
            <option
              key={key}
              value={key}
              style={{ background: '#0D0920', color: '#F0EBE1' }}
            >
              {label}
            </option>
          ))}
        </select>
        {/* Chevron */}
        <div
          style={{
            position: 'absolute',
            right: '0.625rem',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'rgba(240,235,225,0.35)',
            pointerEvents: 'none',
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </div>
    </div>
  )
}
