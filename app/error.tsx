'use client'

import { useEffect } from 'react'

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error('[GlobalError]', error)
  }, [error])

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      minHeight: '100vh', background: '#08060F', fontFamily: 'IBM Plex Sans, sans-serif', gap: '1.5rem',
      textAlign: 'center', padding: '2rem',
    }}>
      <span style={{ fontSize: '0.625rem', fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(212,37,106,0.6)' }}>
        Error inesperado
      </span>
      <h1 style={{ fontSize: '1.5rem', fontFamily: 'Bebas Neue, sans-serif', letterSpacing: '0.05em', color: '#F0EBE1', margin: 0 }}>
        Algo salió mal
      </h1>
      <p style={{ fontSize: '0.875rem', color: 'rgba(240,235,225,0.45)', maxWidth: 360, lineHeight: 1.6, margin: 0 }}>
        {error.message ?? 'Error interno del cliente. Por favor intenta de nuevo.'}
      </p>
      <button
        onClick={reset}
        style={{
          background: '#F5A52A', color: '#08060F', fontWeight: 700, fontSize: '0.875rem',
          padding: '0.625rem 1.25rem', borderRadius: 3, border: 'none', cursor: 'pointer',
        }}
      >
        Reintentar
      </button>
    </div>
  )
}
