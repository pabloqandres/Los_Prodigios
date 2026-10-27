'use client'

import Link from 'next/link'

export default function NotFound() {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      minHeight: '100vh', background: '#08060F', fontFamily: 'IBM Plex Sans, sans-serif', gap: '1.5rem',
      textAlign: 'center', padding: '2rem',
    }}>
      <span style={{ fontSize: '0.625rem', fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(240,235,225,0.3)' }}>
        404
      </span>
      <h1 style={{ fontSize: '1.5rem', fontFamily: 'Bebas Neue, sans-serif', letterSpacing: '0.05em', color: '#F0EBE1', margin: 0 }}>
        Página no encontrada
      </h1>
      <p style={{ fontSize: '0.875rem', color: 'rgba(240,235,225,0.45)', maxWidth: 340, lineHeight: 1.6, margin: 0 }}>
        La ruta que buscas no existe o fue movida.
      </p>
      <Link href="/dashboard" style={{
        background: '#F5A52A', color: '#08060F', fontWeight: 700, fontSize: '0.875rem',
        padding: '0.625rem 1.25rem', borderRadius: 3, textDecoration: 'none',
        transition: 'background 0.15s',
      }}>
        Volver al dashboard
      </Link>
    </div>
  )
}
