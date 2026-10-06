'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import Image from 'next/image'

interface NavItem {
  href: string
  label: string
  icon: React.ReactNode
}

interface NavSection {
  title: string
  items: NavItem[]
}

function IconHome() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" />
      <path d="M9 21V12h6v9" />
    </svg>
  )
}

function IconSparkle() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 2l2.4 7.2H22l-6.2 4.5 2.4 7.2L12 16.4l-6.2 4.5 2.4-7.2L2 9.2h7.6L12 2z" />
    </svg>
  )
}

function IconBook() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
    </svg>
  )
}

function IconPalette() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="10" />
      <circle cx="8" cy="14" r="1.5" fill="currentColor" />
      <circle cx="12" cy="9" r="1.5" fill="currentColor" />
      <circle cx="16" cy="14" r="1.5" fill="currentColor" />
    </svg>
  )
}

function IconLayers() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  )
}

function IconFilm() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="2" y="2" width="20" height="20" rx="2.18" />
      <line x1="7" y1="2" x2="7" y2="22" />
      <line x1="17" y1="2" x2="17" y2="22" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <line x1="2" y1="7" x2="7" y2="7" />
      <line x1="2" y1="17" x2="7" y2="17" />
      <line x1="17" y1="17" x2="22" y2="17" />
      <line x1="17" y1="7" x2="22" y2="7" />
    </svg>
  )
}

function IconFlow() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="5" cy="12" r="2.5" />
      <circle cx="19" cy="6" r="2.5" />
      <circle cx="19" cy="18" r="2.5" />
      <line x1="7.5" y1="11" x2="16.5" y2="7" />
      <line x1="7.5" y1="13" x2="16.5" y2="17" />
    </svg>
  )
}

function IconMegaphone() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M3 11l19-9v18L3 13v-2z" />
      <path d="M11 10v9" />
    </svg>
  )
}

function IconTag() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
      <line x1="7" y1="7" x2="7.01" y2="7" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function IconShare() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  )
}

function IconFolder() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
    </svg>
  )
}

function IconSettings() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
    </svg>
  )
}

function IconGecko() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 3c-1.5 0-2.8.6-3.8 1.5C7 5.5 6.5 7 6.5 8.5c0 1 .3 2 .8 2.8" />
      <path d="M12 3c1.5 0 2.8.6 3.8 1.5C17 5.5 17.5 7 17.5 8.5c0 1-.3 2-.8 2.8" />
      <path d="M8 11.5C6 12.5 4 13 3 14c-1 1-.8 2.5 0 3s2.5.2 3.5-.5" />
      <path d="M16 11.5c2 1 4 1.5 5 2.5 1 1 .8 2.5 0 3s-2.5.2-3.5-.5" />
      <path d="M9 14c0 3 1 6 3 7 2-1 3-4 3-7" />
      <circle cx="9.5" cy="8" r="1" fill="currentColor" stroke="none" />
      <circle cx="14.5" cy="8" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

function IconCheck() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M9 11l3 3L22 4"/>
      <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
    </svg>
  )
}

function IconSignOut() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  )
}

const NAV_SECTIONS: NavSection[] = [
  {
    title: 'PRODUCCIÓN',
    items: [
      { href: '/dashboard',  label: 'Dashboard',  icon: <IconHome /> },
      { href: '/episodes',   label: 'Episodios',  icon: <IconFilm /> },
      { href: '/bible',      label: 'Biblia',     icon: <IconBook /> },
      { href: '/studio',     label: 'Asistente',  icon: <IconSparkle /> },
    ],
  },
  {
    title: 'DISEÑO & ARTE',
    items: [
      { href: '/approval',   label: 'Aprobación', icon: <IconCheck /> },
      { href: '/assets',     label: 'Arte',       icon: <IconPalette /> },
      { href: '/continuity', label: 'Continuidad',icon: <IconLayers /> },
    ],
  },
  {
    title: 'GENERACIÓN',
    items: [
      { href: '/artwork',    label: 'Artwork Flow', icon: <IconFlow /> },
      { href: '/video-flow', label: 'Video Flow',   icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg> },
      { href: '/workflows',  label: 'Workflows',    icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M17.5 14v7M14 17.5h7"/></svg> },
    ],
  },
  {
    title: 'FRANQUICIA',
    items: [
      { href: '/marketing',                 label: 'Marketing',      icon: <IconMegaphone /> },
      { href: '/marketing?tab=merchandise', label: 'Merchandise',    icon: <IconTag /> },
      { href: '/marketing?tab=redes',       label: 'Redes Sociales', icon: <IconShare /> },
    ],
  },
  {
    title: 'SISTEMA',
    items: [
      { href: '/settings', label: 'Configuración', icon: <IconSettings /> },
    ],
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()

  function isActive(href: string) {
    const base = href.split('?')[0]
    if (base === '/dashboard') return pathname === '/dashboard'
    return pathname.startsWith(base)
  }

  return (
    <aside
      data-tutorial="sidebar"
      style={{
        width: '240px',
        minWidth: '240px',
        height: '100vh',
        background: '#131313',
        borderRight: '1px solid rgba(223,248,24,0.10)',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        left: 0,
        top: 0,
        overflowY: 'auto',
        zIndex: 50,
        transition: 'transform 0.22s ease',
      }}
    >
      {/* Logo area */}
      <div style={{ padding: '1.25rem 1.25rem 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <img src="/nuppa_isotipo.svg" alt="N" style={{ height: '28px', width: 'auto' }} />
          <div style={{ fontFamily: 'Bebas Neue, Impact, sans-serif', fontSize: '1.625rem', letterSpacing: '0.08em', color: '#F2EEEA', lineHeight: 1 }}>
            NUPPA!
          </div>
        </div>
        <div style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '0.6875rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#DFF818', marginTop: '0.25rem', fontWeight: 600 }}>
          Los Prodigios
        </div>
        {/* Accent line */}
        <div style={{ height: '1px', background: 'linear-gradient(90deg, rgba(223,248,24,0.5) 0%, rgba(223,248,24,0.05) 70%, transparent 100%)', margin: '1rem 0 0' }} />
      </div>

      {/* User block */}
      {session?.user && (
        <div style={{ padding: '0.875rem 1.25rem 0.875rem', borderBottom: '1px solid rgba(223,248,24,0.07)', display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          <div style={{ position: 'relative', flexShrink: 0 }}>
            {session.user.image ? (
              <Image src={session.user.image} alt={session.user.name ?? 'User'} width={32} height={32} style={{ borderRadius: '50%', border: '1.5px solid rgba(223,248,24,0.25)' }} />
            ) : (
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(223,248,24,0.15)', border: '1.5px solid rgba(223,248,24,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8125rem', fontWeight: 700, color: '#DFF818' }}>
                {(session.user.name ?? session.user.email ?? '?')[0].toUpperCase()}
              </div>
            )}
            {/* Online indicator */}
            <div style={{ position: 'absolute', bottom: 0, right: 0, width: '8px', height: '8px', borderRadius: '50%', background: '#4ECDC4', border: '1.5px solid #131313' }} className="badge-teal" />
          </div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#F0EBE1', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {session.user.name ?? session.user.email}
            </div>
            <div style={{ fontSize: '0.6875rem', color: 'rgba(240,235,225,0.45)', whiteSpace: 'nowrap', letterSpacing: '0.04em' }}>
              Equipo
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '1.125rem 0 0.5rem' }}>
        {NAV_SECTIONS.map((section) => (
          <div key={section.title} style={{ marginBottom: '1.5rem' }}>
            <div style={{ padding: '0 1.25rem 0.5rem', fontSize: '0.625rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(240,235,225,0.35)', fontWeight: 600 }}>
              {section.title}
            </div>
            {section.items.map((item) => {
              const active = isActive(item.href)
              return (
                <Link
                  key={item.href + item.label}
                  href={item.href}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.625rem',
                    padding: '0.4375rem 1.25rem 0.4375rem calc(1.25rem - 2px)',
                    fontSize: '0.875rem',
                    fontWeight: active ? 600 : 400,
                    color: active ? '#DFF818' : 'rgba(240,235,225,0.60)',
                    background: active ? 'rgba(223,248,24,0.08)' : 'transparent',
                    borderLeft: `2px solid ${active ? '#DFF818' : 'transparent'}`,
                    transition: 'color 0.12s ease, background 0.12s ease, border-color 0.12s ease',
                    textDecoration: 'none',
                  }}
                  onMouseEnter={(e) => {
                    if (!active) {
                      e.currentTarget.style.color = '#F0EBE1'
                      e.currentTarget.style.background = 'rgba(223,248,24,0.04)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!active) {
                      e.currentTarget.style.color = 'rgba(240,235,225,0.60)'
                      e.currentTarget.style.background = 'transparent'
                    }
                  }}
                >
                  <span style={{ color: active ? '#DFF818' : 'rgba(240,235,225,0.40)', flexShrink: 0, transition: 'color 0.12s ease' }}>
                    {item.icon}
                  </span>
                  {item.label}
                </Link>
              )
            })}
          </div>
        ))}
      </nav>

      {/* Production context */}
      <div style={{ padding: '0.75rem 1.25rem', borderTop: '1px solid rgba(223,248,24,0.07)' }}>
        <div style={{
          position: 'relative',
          background: 'rgba(223,248,24,0.04)',
          border: '1px solid rgba(223,248,24,0.09)',
          borderRadius: '4px',
          padding: '0.875rem 1rem',
          overflow: 'hidden',
        }}>
          {/* Decorative background text */}
          <div style={{
            position: 'absolute',
            right: '-6px',
            bottom: '-10px',
            fontFamily: 'Bebas Neue, Impact, sans-serif',
            fontSize: '3.75rem',
            letterSpacing: '-0.02em',
            color: '#DFF818',
            opacity: 0.04,
            lineHeight: 1,
            userSelect: 'none',
            pointerEvents: 'none',
          }}>
            S01
          </div>
          <div style={{
            fontSize: '0.5rem',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: 'rgba(240,235,225,0.28)',
            fontWeight: 600,
            marginBottom: '0.3rem',
          }}>
            Producción activa
          </div>
          <div style={{
            fontFamily: 'Bebas Neue, Impact, sans-serif',
            fontSize: '1.0625rem',
            letterSpacing: '0.06em',
            color: '#DFF818',
            lineHeight: 1,
            marginBottom: '0.15rem',
          }}>
            LOS PRODIGIOS
          </div>
          <div style={{
            fontSize: '0.5625rem',
            color: 'rgba(240,235,225,0.30)',
            letterSpacing: '0.06em',
            marginBottom: '0.75rem',
          }}>
            Serie 01 · 5 temporadas
          </div>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.3rem' }}>
              <span style={{ fontSize: '0.5rem', letterSpacing: '0.14em', color: 'rgba(240,235,225,0.25)', textTransform: 'uppercase', fontWeight: 600 }}>
                Episodios
              </span>
              <span style={{ fontSize: '0.625rem', fontFamily: 'Bebas Neue, Impact, sans-serif', color: 'rgba(240,235,225,0.35)', letterSpacing: '0.06em' }}>
                0 / 50
              </span>
            </div>
            <div style={{ height: '2px', background: 'rgba(223,248,24,0.08)', borderRadius: '1px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: '0%', background: 'linear-gradient(90deg, #DFF818, #EAFF4D)', borderRadius: '1px' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Tutorial + Sign out */}
      <div style={{ padding: '0.75rem 1.25rem', borderTop: '1px solid rgba(223,248,24,0.07)' }}>
        <a
          href="/projects"
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%', padding: '0.375rem 0', background: 'none', border: 'none', color: 'rgba(242,238,234,0.40)', fontSize: '0.8125rem', cursor: 'pointer', transition: 'color 0.12s ease', marginBottom: '0.25rem', textDecoration: 'none' }}
          onMouseEnter={(e) => { e.currentTarget.style.color = '#DFF818' }}
          onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(242,238,234,0.40)' }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M19 12H5M5 12l7-7M5 12l7 7"/></svg>
          Proyectos
        </a>
        <button
          onClick={() => {
            localStorage.removeItem('bit_tutorial_done')
            window.dispatchEvent(new Event('tutorial:restart'))
          }}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%', padding: '0.375rem 0', background: 'none', border: 'none', color: 'rgba(240,235,225,0.40)', fontSize: '0.8125rem', cursor: 'pointer', transition: 'color 0.12s ease', marginBottom: '0.25rem' }}
          onMouseEnter={(e) => { e.currentTarget.style.color = '#DFF818' }}
          onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(240,235,225,0.40)' }}
        >
          <IconGecko />
          Tutorial Plataforma
        </button>
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%', padding: '0.375rem 0', background: 'none', border: 'none', color: 'rgba(240,235,225,0.40)', fontSize: '0.8125rem', cursor: 'pointer', transition: 'color 0.12s ease' }}
          onMouseEnter={(e) => { e.currentTarget.style.color = '#FB3794' }}
          onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(240,235,225,0.40)' }}
        >
          <IconSignOut />
          Cerrar sesión
        </button>
      </div>
    </aside>
  )
}
