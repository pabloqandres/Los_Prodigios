'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function ProjectsPage() {
  const { data: session } = useSession()
  const router = useRouter()

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0E0E0E',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background grid */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'linear-gradient(rgba(223,248,24,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(223,248,24,0.02) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
          pointerEvents: 'none',
        }}
      />

      {/* Corner accents */}
      <div style={{ position: 'absolute', top: '2rem', left: '2rem', width: '40px', height: '40px', borderTop: '1px solid rgba(223,248,24,0.2)', borderLeft: '1px solid rgba(223,248,24,0.2)' }} />
      <div style={{ position: 'absolute', bottom: '2rem', right: '2rem', width: '40px', height: '40px', borderBottom: '1px solid rgba(223,248,24,0.2)', borderRight: '1px solid rgba(223,248,24,0.2)' }} />

      {/* Header */}
      <div style={{ position: 'relative', textAlign: 'center', marginBottom: '3rem' }}>
        <img src="/nuppa_logo.svg" alt="NUPPA!" style={{ height: '52px', width: 'auto', display: 'block', margin: '0 auto 1.25rem' }} />
        <div
          style={{
            fontSize: '0.6875rem',
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            color: 'rgba(242,238,234,0.30)',
            fontFamily: 'IBM Plex Sans, sans-serif',
          }}
        >
          Elige tu proyecto
        </div>
      </div>

      {/* Cards */}
      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', justifyContent: 'center', position: 'relative' }}>

        {/* Los Prodigios */}
        <div
          onClick={() => router.push('/dashboard')}
          style={{
            width: '280px',
            borderRadius: '4px',
            overflow: 'hidden',
            cursor: 'pointer',
            border: '1px solid rgba(223,248,24,0.14)',
            background: '#131313',
            transition: 'border-color 0.2s, transform 0.2s, box-shadow 0.2s',
            position: 'relative',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#DFF818'
            e.currentTarget.style.transform = 'translateY(-3px)'
            e.currentTarget.style.boxShadow = '0 12px 40px rgba(223,248,24,0.1)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'rgba(223,248,24,0.14)'
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = 'none'
          }}
        >
          {/* Cover image */}
          <div style={{ height: '340px', position: 'relative', overflow: 'hidden' }}>
            <img
              src="/poster_prodigios.png"
              alt="Los Prodigios"
              style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }}
            />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 40%, rgba(14,14,14,0.92) 100%)' }} />
            {/* Badge */}
            <div style={{
              position: 'absolute', top: '14px', left: '14px',
              fontSize: '0.5625rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase',
              padding: '4px 10px', background: '#DFF818', color: '#0E0E0E', borderRadius: '2px',
            }}>
              Activo
            </div>
          </div>

          {/* Info */}
          <div style={{ padding: '1.125rem 1.25rem 1.375rem' }}>
            <div style={{ fontFamily: 'Bebas Neue, Impact, sans-serif', fontSize: '1.625rem', letterSpacing: '0.06em', color: '#F2EEEA', lineHeight: 1, marginBottom: '0.25rem' }}>
              Los Prodigios
            </div>
            <div style={{ fontSize: '0.6875rem', color: 'rgba(242,238,234,0.35)', letterSpacing: '0.06em' }}>
              Serie 01 · 5 temporadas
            </div>
          </div>

          {/* Arrow */}
          <div style={{ position: 'absolute', bottom: '1.25rem', right: '1.25rem', color: '#DFF818', fontSize: '1.125rem', opacity: 0, transition: 'opacity 0.2s, transform 0.2s' }}
            className="ps-arrow">
            →
          </div>
        </div>

        {/* Nuevo Proyecto */}
        <div
          style={{
            width: '280px',
            height: '420px',
            borderRadius: '4px',
            cursor: 'pointer',
            border: '1px dashed rgba(242,238,234,0.15)',
            background: 'transparent',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
            transition: 'border-color 0.2s, transform 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'rgba(223,248,24,0.35)'
            e.currentTarget.style.transform = 'translateY(-2px)'
            const icon = e.currentTarget.querySelector('.new-icon') as HTMLElement
            if (icon) { icon.style.borderColor = '#DFF818'; icon.style.color = '#DFF818' }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'rgba(242,238,234,0.15)'
            e.currentTarget.style.transform = 'translateY(0)'
            const icon = e.currentTarget.querySelector('.new-icon') as HTMLElement
            if (icon) { icon.style.borderColor = 'rgba(242,238,234,0.18)'; icon.style.color = 'rgba(242,238,234,0.35)' }
          }}
          onClick={() => {
            const overlay = document.getElementById('coming-soon')
            if (overlay) overlay.style.display = 'flex'
          }}
        >
          <div className="new-icon" style={{ width: '52px', height: '52px', borderRadius: '50%', border: '1.5px solid rgba(242,238,234,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.375rem', color: 'rgba(242,238,234,0.35)', transition: 'border-color 0.2s, color 0.2s' }}>
            +
          </div>
          <div style={{ fontFamily: 'Bebas Neue, Impact, sans-serif', fontSize: '1.375rem', letterSpacing: '0.06em', color: 'rgba(242,238,234,0.50)' }}>
            Nuevo Proyecto
          </div>
          <div style={{ fontSize: '0.75rem', color: 'rgba(242,238,234,0.25)', textAlign: 'center', maxWidth: '160px', lineHeight: 1.5 }}>
            Crea tu próxima producción en NUPPA
          </div>
        </div>
      </div>

      {/* Coming soon overlay */}
      <div
        id="coming-soon"
        style={{ position: 'fixed', inset: 0, background: 'rgba(14,14,14,0.85)', backdropFilter: 'blur(4px)', display: 'none', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}
        onClick={() => {
          const el = document.getElementById('coming-soon')
          if (el) el.style.display = 'none'
        }}
      >
        <div
          style={{ background: '#131313', border: '1px solid rgba(223,248,24,0.14)', borderLeft: '3px solid #DFF818', padding: '2.5rem 3rem', borderRadius: '4px', textAlign: 'center', maxWidth: '340px' }}
          onClick={(e) => e.stopPropagation()}
        >
          <div style={{ fontFamily: 'Bebas Neue, Impact, sans-serif', fontSize: '2.25rem', color: '#DFF818', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>
            PRÓXIMAMENTE
          </div>
          <p style={{ fontSize: '0.8125rem', color: 'rgba(242,238,234,0.55)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            La creación de nuevos proyectos estará disponible en la próxima versión de NUPPA.
          </p>
          <button
            onClick={() => {
              const el = document.getElementById('coming-soon')
              if (el) el.style.display = 'none'
            }}
            style={{ padding: '0.625rem 1.5rem', background: '#DFF818', color: '#0E0E0E', border: 'none', borderRadius: '2px', fontSize: '0.6875rem', fontWeight: 700, cursor: 'pointer', letterSpacing: '0.1em', textTransform: 'uppercase' }}
          >
            Entendido
          </button>
        </div>
      </div>

      {/* User + logout (bottom right) */}
      {session?.user && (
        <div style={{ position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontSize: '0.75rem', color: 'rgba(242,238,234,0.28)', letterSpacing: '0.04em' }}>
            {session.user.email}
          </span>
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            style={{ fontSize: '0.75rem', color: 'rgba(242,238,234,0.28)', background: 'none', border: 'none', cursor: 'pointer', letterSpacing: '0.06em', transition: 'color 0.12s' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#FB3794' }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(242,238,234,0.28)' }}
          >
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  )
}
