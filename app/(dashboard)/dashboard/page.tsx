'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useState, useEffect } from 'react'

interface QuickAction {
  href: string
  title: string
  description: string
  icon: React.ReactNode
  accent: string
  bg: string
}

function IconSparkle() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 2l2.4 7.2H22l-6.2 4.5 2.4 7.2L12 16.4l-6.2 4.5 2.4-7.2L2 9.2h7.6L12 2z" />
    </svg>
  )
}

function IconBook() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
    </svg>
  )
}

function IconPalette() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="10" />
      <circle cx="8" cy="14" r="1.5" fill="currentColor" />
      <circle cx="12" cy="9" r="1.5" fill="currentColor" />
      <circle cx="16" cy="14" r="1.5" fill="currentColor" />
    </svg>
  )
}

function IconLayers() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  )
}

const QUICK_ACTIONS: QuickAction[] = [
  {
    href: '/studio',
    title: 'Nueva Sesión',
    description: 'Asistente de IA — guión, personajes, arte, marketing.',
    icon: <IconSparkle />,
    accent: '#F5A52A',
    bg: 'rgba(245,165,42,0.08)',
  },
  {
    href: '/bible',
    title: 'Biblia',
    description: 'Documentos canónicos de la serie.',
    icon: <IconBook />,
    accent: '#4A8FE8',
    bg: 'rgba(74,143,232,0.08)',
  },
  {
    href: '/assets',
    title: 'Generar Arte',
    description: 'Biblioteca de assets y generación de imágenes.',
    icon: <IconPalette />,
    accent: '#9B6FD4',
    bg: 'rgba(155,111,212,0.08)',
  },
  {
    href: '/continuity',
    title: 'Continuidad',
    description: 'Estado de personajes, locaciones y línea de tiempo.',
    icon: <IconLayers />,
    accent: '#D4256A',
    bg: 'rgba(212,37,106,0.08)',
  },
]

const STATS = [
  { label: 'Temporadas',        value: '5',       bg: '#F5A52A',  text: '#08060F' },
  { label: 'Episodios',         value: '50',      bg: '#4ECDC4',  text: '#08060F' },
  { label: 'Minutos aprox.',    value: '600',      bg: '#9B6FD4',  text: '#F0EBE1' },
  { label: 'Ep. por temporada', value: '10',      bg: '#4A8FE8',  text: '#08060F' },
]

function useCurrentTime() {
  const [time, setTime] = useState('')
  const [date, setDate] = useState('')
  useEffect(() => {
    function update() {
      const now = new Date()
      const days = ['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB']
      const months = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC']
      const h = now.getHours().toString().padStart(2, '0')
      const m = now.getMinutes().toString().padStart(2, '0')
      setTime(`${h}:${m}`)
      setDate(`${days[now.getDay()]}_${now.getDate()}_${months[now.getMonth()]}`)
    }
    update()
    const id = setInterval(update, 30000)
    return () => clearInterval(id)
  }, [])
  return { time, date }
}

function greet(name: string) {
  const h = new Date().getHours()
  if (h < 13) return `Buenos días, ${name}`
  if (h < 20) return `Buenas tardes, ${name}`
  return `Buenas noches, ${name}`
}

const MARQUEE_TEXT = Array(6).fill(
  'LOS PRODIGIOS\u2003—\u2003SERIE 01\u2003—\u20035 TEMPORADAS\u2003—\u200350 EPISODIOS\u2003—\u2003600 MIN\u2003—\u2003EN PRODUCCIÓN\u2003—\u2003'
).join('')

type ActivityItem = {
  id: string
  type: string
  title: string
  subtitle: string
  user: string
  ts: string
  accent: string
  href: string
}

function timeAgo(ts: string) {
  const diff = Date.now() - new Date(ts).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Ahora'
  if (mins < 60) return `Hace ${mins} min`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `Hace ${hrs}h`
  const days = Math.floor(hrs / 24)
  if (days < 7) return `Hace ${days}d`
  return new Date(ts).toLocaleDateString('es-CL', { day: 'numeric', month: 'short' })
}

export default function DashboardPage() {
  const { data: session } = useSession()
  const { time, date } = useCurrentTime()
  const firstName = session?.user?.name?.split(' ')[0] ?? 'Equipo'
  const [activity, setActivity] = useState<ActivityItem[]>([])
  const [loadingActivity, setLoadingActivity] = useState(true)

  useEffect(() => {
    fetch('/api/activity')
      .then(r => r.json())
      .then(d => { if (Array.isArray(d)) setActivity(d) })
      .catch(() => {})
      .finally(() => setLoadingActivity(false))
  }, [])

  return (
    <div style={{ width: '100%' }}>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <div style={{ position: 'relative', width: '100%', overflow: 'hidden', background: '#08060F' }}>

        {/* Aurora blobs */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', top: '-60px', left: '-40px', width: '550px', height: '380px', borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(245,165,42,0.12) 0%, transparent 70%)', filter: 'blur(50px)', animation: 'aurora-drift-1 14s ease-in-out infinite alternate' }} />
          <div style={{ position: 'absolute', top: '-20px', right: '-60px', width: '480px', height: '320px', borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(78,205,196,0.10) 0%, transparent 70%)', filter: 'blur(55px)', animation: 'aurora-drift-2 17s ease-in-out infinite alternate' }} />
          <div style={{ position: 'absolute', top: '80px', left: '35%', width: '380px', height: '260px', borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(155,111,212,0.07) 0%, transparent 70%)', filter: 'blur(60px)', animation: 'aurora-drift-3 20s ease-in-out infinite alternate' }} />
        </div>

        {/* Noise grain */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.055, pointerEvents: 'none' }}>
          <filter id="grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#grain)" />
        </svg>

        {/* Grid texture */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(245,165,42,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(245,165,42,0.03) 1px, transparent 1px)', backgroundSize: '60px 60px', pointerEvents: 'none' }} />

        {/* Bottom fade */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '40%', background: 'linear-gradient(transparent, #08060F)', pointerEvents: 'none' }} />

        {/* Hero content */}
        <div style={{ position: 'relative', padding: '2.5rem 2.5rem 0' }}>

          {/* Top metadata — AVA SRG style */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <span style={{ fontFamily: 'monospace', fontSize: '0.625rem', letterSpacing: '0.14em', color: 'rgba(240,235,225,0.28)', textTransform: 'uppercase' }}>
                {date || 'S01_EP_00'}
              </span>
              {time && (
                <span style={{ fontFamily: 'monospace', fontSize: '0.625rem', letterSpacing: '0.14em', color: 'rgba(240,235,225,0.22)' }}>
                  {time}
                </span>
              )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#4ECDC4' }} className="badge-teal" />
              <span style={{ fontFamily: 'monospace', fontSize: '0.625rem', letterSpacing: '0.18em', color: '#4ECDC4', textTransform: 'uppercase' }}>
                EN_PRODUCCIÓN
              </span>
            </div>
          </div>

          {/* MASSIVE TITLE — typography as graphic element */}
          <div style={{ marginBottom: '0', lineHeight: 0.88, overflow: 'hidden' }}>
            <div style={{
              fontFamily: 'Bebas Neue, Impact, sans-serif',
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              letterSpacing: '0.12em',
              color: 'rgba(240,235,225,0.45)',
              lineHeight: 1,
              marginBottom: '0.1em',
            }}>
              LOS
            </div>
            <div style={{
              fontFamily: 'Bebas Neue, Impact, sans-serif',
              fontSize: 'clamp(5.5rem, 16vw, 13rem)',
              letterSpacing: '0.02em',
              color: '#F0EBE1',
              lineHeight: 0.85,
              whiteSpace: 'nowrap',
              marginLeft: '-0.01em',
            }}>
              PRODIGIOS
            </div>
          </div>

          {/* Greeting + divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1.75rem 0 2.5rem', flexWrap: 'wrap' }}>
            <span style={{ fontFamily: 'Bebas Neue, Impact, sans-serif', fontSize: 'clamp(2rem, 4vw, 3.25rem)', letterSpacing: '0.04em', color: 'rgba(240,235,225,0.70)', lineHeight: 1 }}>
              {greet(firstName)}
            </span>
            <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, rgba(245,165,42,0.2), transparent)' }} />
            <span style={{ fontFamily: 'monospace', fontSize: '0.5625rem', letterSpacing: '0.14em', color: 'rgba(240,235,225,0.18)', textTransform: 'uppercase' }}>
              1920×1080 · SERIE_01
            </span>
          </div>

        </div>
      </div>

      {/* ── MARQUEE STRIP ────────────────────────────────────────────────── */}
      <div style={{
        background: '#F5A52A',
        overflow: 'hidden',
        padding: '0.6rem 0',
        position: 'relative',
      }}>
        <div style={{
          display: 'inline-block',
          whiteSpace: 'nowrap',
          animation: 'marquee 28s linear infinite',
        }}>
          <span style={{
            fontFamily: 'Bebas Neue, Impact, sans-serif',
            fontSize: '1rem',
            letterSpacing: '0.12em',
            color: '#08060F',
          }}>
            {MARQUEE_TEXT}
          </span>
        </div>
      </div>

      {/* ── BODY ─────────────────────────────────────────────────────────── */}
      <div style={{ padding: '2.5rem 2.5rem 3rem', maxWidth: '1100px' }}>

        {/* Solid color stat cards — GET HYPED style */}
        <div
          className="grid grid-cols-2 md:grid-cols-4"
          style={{ gap: '0.75rem', marginBottom: '2.5rem' }}
        >
          {STATS.map((stat, i) => (
            <div
              key={stat.label}
              className="card-enter"
              style={{
                background: stat.bg,
                borderRadius: '4px',
                padding: '1.5rem 1.25rem',
                animationDelay: `${i * 0.07}s`,
                animationFillMode: 'both',
                transform: [0, 2].includes(i) ? 'rotate(-0.4deg)' : 'rotate(0.3deg)',
              }}
            >
              <div style={{
                fontFamily: 'Bebas Neue, Impact, sans-serif',
                fontSize: '3.5rem',
                letterSpacing: '0.02em',
                color: stat.text,
                lineHeight: 1,
                marginBottom: '0.25rem',
              }}>
                {stat.value}
              </div>
              <div style={{
                fontSize: '0.625rem',
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: stat.text,
                opacity: 0.6,
                fontWeight: 700,
              }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ fontSize: '0.625rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(240,235,225,0.30)', fontWeight: 600, marginBottom: '1rem' }}>
            Acciones rápidas
          </div>
          <div data-tutorial="quick-actions" className="grid grid-cols-1 md:grid-cols-2" style={{ gap: '0.75rem' }}>
            {QUICK_ACTIONS.map((action, i) => (
              <Link
                key={action.href}
                href={action.href}
                onClick={() => window.dispatchEvent(new Event('tutorial:dashboard_action'))}
                className="card-enter"
                style={{
                  display: 'block',
                  background: '#120D28',
                  border: '1px solid rgba(245,165,42,0.10)',
                  borderRadius: '4px',
                  padding: '1.375rem 1.5rem',
                  textDecoration: 'none',
                  transition: 'border-color 0.18s ease, background 0.18s ease, box-shadow 0.18s ease, transform 0.18s ease',
                  animationDelay: `${0.28 + i * 0.06}s`,
                  animationFillMode: 'both',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.35)',
                  transform: i % 2 === 0 ? 'rotate(-0.3deg)' : 'rotate(0.3deg)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = action.accent
                  e.currentTarget.style.background = '#150B26'
                  e.currentTarget.style.boxShadow = `0 4px 24px rgba(0,0,0,0.5), 0 0 24px ${action.accent}18`
                  e.currentTarget.style.transform = 'rotate(0deg)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(245,165,42,0.10)'
                  e.currentTarget.style.background = '#120D28'
                  e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.35)'
                  e.currentTarget.style.transform = i % 2 === 0 ? 'rotate(-0.3deg)' : 'rotate(0.3deg)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.875rem' }}>
                  <div style={{ color: action.accent, padding: '0.5rem', background: action.bg, borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {action.icon}
                  </div>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={action.accent} strokeWidth="2" style={{ opacity: 0.5, marginTop: '0.25rem' }}>
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </div>
                <div style={{ fontFamily: 'Bebas Neue, Impact, sans-serif', fontSize: '1.25rem', letterSpacing: '0.05em', color: '#F0EBE1', marginBottom: '0.375rem', lineHeight: 1 }}>
                  {action.title}
                </div>
                <div style={{ fontSize: '0.8125rem', color: 'rgba(240,235,225,0.45)', lineHeight: 1.55 }}>
                  {action.description}
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent activity */}
        <div>
          <div style={{ fontSize: '0.625rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(240,235,225,0.30)', fontWeight: 600, marginBottom: '1rem' }}>
            Actividad reciente
          </div>
          {loadingActivity ? (
            <div style={{ background: '#0D0920', border: '1px solid rgba(245,165,42,0.07)', borderRadius: '4px', padding: '2rem', color: 'rgba(240,235,225,0.2)', fontSize: '0.8125rem' }}>
              Cargando...
            </div>
          ) : activity.length === 0 ? (
            <div style={{ background: '#0D0920', border: '1px solid rgba(245,165,42,0.07)', borderRadius: '4px', padding: '2.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ color: 'rgba(240,235,225,0.15)' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                  <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <p style={{ fontSize: '0.8125rem', color: 'rgba(240,235,225,0.35)', textAlign: 'center' }}>Sin actividad reciente</p>
            </div>
          ) : (
            <div style={{ background: '#0D0920', border: '1px solid rgba(245,165,42,0.07)', borderRadius: '4px', overflow: 'hidden' }}>
              {activity.map((item, i) => (
                <Link
                  key={item.id}
                  href={item.href}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.875rem',
                    padding: '0.875rem 1.25rem',
                    borderBottom: i < activity.length - 1 ? '1px solid rgba(245,165,42,0.05)' : 'none',
                    textDecoration: 'none',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(245,165,42,0.03)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  {/* Type badge */}
                  <div style={{ flexShrink: 0, width: '6px', height: '6px', borderRadius: '50%', background: item.accent }} />
                  {/* Content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.5rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: item.accent, fontWeight: 700, opacity: 0.8 }}>{item.type}</span>
                      <span style={{ fontSize: '0.8125rem', color: '#F0EBE1', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title}</span>
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'rgba(240,235,225,0.35)', marginTop: '2px' }}>
                      {item.subtitle}
                      {item.user && <span style={{ marginLeft: '0.5rem', opacity: 0.6 }}>· {item.user.split('@')[0]}</span>}
                    </div>
                  </div>
                  {/* Time */}
                  <div style={{ flexShrink: 0, fontSize: '0.6875rem', color: 'rgba(240,235,225,0.25)', fontFamily: 'monospace' }}>
                    {timeAgo(item.ts)}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
