'use client'

import { useSession, signIn } from 'next-auth/react'
import { useEffect, useState } from 'react'

const WARN_BEFORE_MS = 10 * 60 * 1000 // show warning 10 min before expiry

export default function SessionExpiryWarning() {
  const { data: session } = useSession()
  const [minutesLeft, setMinutesLeft] = useState<number | null>(null)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    if (!session?.expires) return

    const expiresAt = new Date(session.expires).getTime()

    function check() {
      const now = Date.now()
      const msLeft = expiresAt - now
      if (msLeft <= 0) {
        setMinutesLeft(0)
        return
      }
      if (msLeft <= WARN_BEFORE_MS) {
        setMinutesLeft(Math.ceil(msLeft / 60000))
        setDismissed(false) // re-show if time keeps decreasing
      } else {
        setMinutesLeft(null)
      }
    }

    check()
    const interval = setInterval(check, 30000) // re-check every 30s
    return () => clearInterval(interval)
  }, [session?.expires])

  if (minutesLeft === null || dismissed) return null

  const expired = minutesLeft === 0

  return (
    <div style={{
      position: 'fixed',
      bottom: '1.5rem',
      right: '1.5rem',
      zIndex: 9999,
      background: expired ? '#1A0A0A' : '#120D28',
      border: `1px solid ${expired ? 'rgba(212,37,106,0.5)' : 'rgba(245,165,42,0.4)'}`,
      borderRadius: '6px',
      padding: '0.875rem 1.125rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.875rem',
      maxWidth: '340px',
      boxShadow: `0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px ${expired ? 'rgba(212,37,106,0.1)' : 'rgba(245,165,42,0.06)'}`,
      fontFamily: 'IBM Plex Sans, sans-serif',
      animation: 'card-enter 0.25s ease forwards',
    }}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
        stroke={expired ? '#D4256A' : '#F5A52A'} strokeWidth="2">
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12 6 12 12 16 14"/>
      </svg>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#F0EBE1', marginBottom: '2px' }}>
          {expired ? 'Sesión expirada' : 'Sesión por expirar'}
        </div>
        <div style={{ fontSize: '0.75rem', color: 'rgba(240,235,225,0.5)', lineHeight: 1.4 }}>
          {expired
            ? 'Tu sesión ha terminado. Vuelve a iniciar sesión para continuar.'
            : `Expira en ${minutesLeft} min. Renueva para no perder tu trabajo.`}
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', flexShrink: 0 }}>
        <button
          onClick={() => signIn()}
          style={{
            padding: '0.375rem 0.75rem',
            background: expired ? 'rgba(212,37,106,0.15)' : 'rgba(245,165,42,0.12)',
            border: `1px solid ${expired ? 'rgba(212,37,106,0.4)' : 'rgba(245,165,42,0.35)'}`,
            borderRadius: '3px',
            color: expired ? '#D4256A' : '#F5A52A',
            fontSize: '0.75rem',
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: 'IBM Plex Sans, sans-serif',
            whiteSpace: 'nowrap',
          }}
        >
          Renovar
        </button>
        {!expired && (
          <button
            onClick={() => setDismissed(true)}
            style={{
              padding: '0.375rem 0.75rem',
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: '3px',
              color: 'rgba(240,235,225,0.3)',
              fontSize: '0.75rem',
              cursor: 'pointer',
              fontFamily: 'IBM Plex Sans, sans-serif',
            }}
          >
            Ignorar
          </button>
        )}
      </div>
    </div>
  )
}
