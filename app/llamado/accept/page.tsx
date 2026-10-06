'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

function AcceptContent() {
  const params  = useSearchParams()
  const token   = params.get('t')
  const router  = useRouter()
  const { data: session, status } = useSession()
  const [error, setError] = useState('')

  useEffect(() => {
    if (status === 'loading') return
    if (!session || !token) {
      router.replace('/dashboard')
      return
    }

    fetch('/api/invitations/accept', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ token }),
    }).then(async res => {
      if (res.ok) {
        router.replace('/dashboard')
      } else {
        const d = await res.json()
        setError(d.error ?? 'Error al procesar la invitación')
      }
    })
  }, [session, status, token, router])

  return (
    <div style={{
      minHeight: '100vh',
      background: '#04060F',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      fontFamily: 'IBM Plex Sans, sans-serif',
    }}>
      {error ? (
        <div style={{ textAlign: 'center', maxWidth: 360 }}>
          <div style={{
            fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.5rem',
            letterSpacing: '0.08em', color: '#D4256A', marginBottom: '0.75rem',
          }}>
            Error
          </div>
          <div style={{ color: 'rgba(240,235,225,0.65)', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            {error}
          </div>
          <button
            onClick={() => router.push('/dashboard')}
            style={{
              background: 'transparent',
              border: '1px solid rgba(198,149,42,0.3)',
              color: '#C6952A', fontSize: '0.875rem',
              padding: '0.5rem 1.5rem', borderRadius: '2px',
              cursor: 'pointer',
            }}
          >
            Ir al dashboard
          </button>
        </div>
      ) : (
        <div style={{ textAlign: 'center' }}>
          <div style={{
            fontFamily: 'monospace', fontSize: '0.6875rem',
            letterSpacing: '0.2em', color: '#C6952A',
            marginBottom: '1rem', opacity: 0.7,
          }}>
            RED CONTINENTAL DE OBSERVACIÓN
          </div>
          <div style={{ color: 'rgba(240,235,225,0.5)', fontSize: '0.8125rem', letterSpacing: '0.08em' }}>
            Procesando tu llamado…
          </div>
        </div>
      )}
    </div>
  )
}

export default function AcceptPage() {
  return (
    <Suspense>
      <AcceptContent />
    </Suspense>
  )
}
