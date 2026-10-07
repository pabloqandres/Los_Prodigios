'use client'

import { useState, useEffect } from 'react'
import { Sidebar } from './Sidebar'
import Tutorial from './Tutorial'

function MobileGate() {
  const [width, setWidth] = useState(0)

  useEffect(() => {
    setWidth(window.innerWidth)
    const handler = () => setWidth(window.innerWidth)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: '#08060F',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      overflow: 'hidden',
    }}>

      {/* Aurora blobs */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '-80px', left: '-60px', width: '400px', height: '300px', borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(245,165,42,0.14) 0%, transparent 70%)', filter: 'blur(50px)', animation: 'aurora-drift-1 12s ease-in-out infinite alternate' }} />
        <div style={{ position: 'absolute', bottom: '-60px', right: '-40px', width: '350px', height: '280px', borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(78,205,196,0.10) 0%, transparent 70%)', filter: 'blur(55px)', animation: 'aurora-drift-2 15s ease-in-out infinite alternate' }} />
        <div style={{ position: 'absolute', top: '40%', left: '20%', width: '300px', height: '240px', borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(155,111,212,0.07) 0%, transparent 70%)', filter: 'blur(60px)', animation: 'aurora-drift-3 18s ease-in-out infinite alternate' }} />
      </div>

      {/* Noise grain */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.05, pointerEvents: 'none' }}>
        <filter id="grain-mobile">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain-mobile)" />
      </svg>

      {/* Grid */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(245,165,42,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(245,165,42,0.025) 1px, transparent 1px)', backgroundSize: '40px 40px', pointerEvents: 'none' }} />

      {/* Top accent line */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, transparent, #F5A52A 30%, #F5A52A 70%, transparent)' }} />

      {/* Content */}
      <div style={{ position: 'relative', textAlign: 'center', maxWidth: '320px' }}>

        {/* Logo */}
        <div style={{ fontFamily: 'Bebas Neue, Impact, sans-serif', fontSize: '2rem', letterSpacing: '0.1em', color: '#F0EBE1', marginBottom: '0.2rem', lineHeight: 1 }}>
          STUDIO<span style={{ color: '#F5A52A' }}>OS</span>
        </div>
        <div style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '0.5625rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(240,235,225,0.35)', marginBottom: '3rem' }}>
          Los Prodigios
        </div>

        {/* Monitor icon */}
        <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'center' }}>
          <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="rgba(245,165,42,0.5)" strokeWidth="0.75">
            <rect x="2" y="3" width="20" height="14" rx="2" />
            <line x1="8" y1="21" x2="16" y2="21" />
            <line x1="12" y1="17" x2="12" y2="21" />
          </svg>
        </div>

        {/* Title */}
        <div style={{ fontFamily: 'Bebas Neue, Impact, sans-serif', fontSize: '2.25rem', letterSpacing: '0.04em', color: '#F0EBE1', lineHeight: 0.95, marginBottom: '1.25rem' }}>
          ESTA PRODUCCIÓN<br />
          <span style={{ color: '#F5A52A' }}>NECESITA</span><br />
          MÁS PANTALLA
        </div>

        {/* Message */}
        <p style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '0.8125rem', color: 'rgba(240,235,225,0.40)', lineHeight: 1.7, marginBottom: '2.5rem' }}>
          StudioOS fue diseñado para desktop.<br />
          Como los mejores episodios,<br />
          necesita espacio para respirar.
        </p>

        {/* Technical readout */}
        <div style={{ background: 'rgba(245,165,42,0.04)', border: '1px solid rgba(245,165,42,0.12)', borderRadius: '4px', padding: '0.875rem 1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontFamily: 'monospace', fontSize: '0.5625rem', letterSpacing: '0.12em', color: 'rgba(240,235,225,0.28)', textTransform: 'uppercase' }}>
              PANTALLA ACTUAL
            </span>
            <span style={{ fontFamily: 'monospace', fontSize: '0.5625rem', letterSpacing: '0.1em', color: '#D4256A', fontWeight: 600 }}>
              {width > 0 ? `${width}px` : '—'}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontFamily: 'monospace', fontSize: '0.5625rem', letterSpacing: '0.12em', color: 'rgba(240,235,225,0.28)', textTransform: 'uppercase' }}>
              MÍNIMO REQUERIDO
            </span>
            <span style={{ fontFamily: 'monospace', fontSize: '0.5625rem', letterSpacing: '0.1em', color: '#4ECDC4', fontWeight: 600 }}>
              1024px
            </span>
          </div>
          {/* Progress bar */}
          <div style={{ marginTop: '0.75rem', height: '3px', background: 'rgba(245,165,42,0.08)', borderRadius: '2px', overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${Math.min((width / 1024) * 100, 100)}%`,
              background: width >= 1024 ? '#4ECDC4' : '#D4256A',
              borderRadius: '2px',
              transition: 'width 0.3s ease',
            }} />
          </div>
        </div>

      </div>

      {/* Bottom metadata */}
      <div style={{ position: 'absolute', bottom: '1.5rem', left: 0, right: 0, display: 'flex', justifyContent: 'space-between', padding: '0 1.5rem' }}>
        <span style={{ fontFamily: 'monospace', fontSize: '0.5rem', letterSpacing: '0.12em', color: 'rgba(240,235,225,0.15)', textTransform: 'uppercase' }}>
          SERIE_01 · EP_00
        </span>
        <span style={{ fontFamily: 'monospace', fontSize: '0.5rem', letterSpacing: '0.12em', color: 'rgba(240,235,225,0.15)', textTransform: 'uppercase' }}>
          DESKTOP_ONLY · v1.0
        </span>
      </div>

    </div>
  )
}

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#08060F' }}>

      {/* Mobile gate — pantallas < 1024px */}
      <div className="lg:hidden">
        <MobileGate />
      </div>

      <Sidebar />

      <main
        className="lg:ml-[240px]"
        style={{
          flex: 1,
          minHeight: '100vh',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          minWidth: 0,
        }}
      >
        {children}
      </main>

      <Tutorial />
    </div>
  )
}
