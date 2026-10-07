'use client'

import { Suspense, useState, useEffect, useRef, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { signIn } from 'next-auth/react'
import Image from 'next/image'

// ── Types ─────────────────────────────────────────────────────────────────────
type Phase = 'black' | 'emblem' | 'fadeout' | 'init' | 'code' | 'envelope' | 'opening' | 'letter' | 'ready'

// ── Helpers ───────────────────────────────────────────────────────────────────
function genCode(nombre: string) {
  let n = 0
  for (let i = 0; i < nombre.length; i++) n = (n * 31 + nombre.charCodeAt(i)) & 0xffff
  return `LP-L-26-LAT-${String(100 + (n % 900)).padStart(3, '0')}`
}

interface LetterLine { text: string; style: React.CSSProperties }

function buildLines(nombre: string, rol: string): LetterLine[] {
  const lines: LetterLine[] = []
  const ink = '#1E1408'
  const inkD = 'rgba(30,20,8,0.62)'

  const add = (text: string, extra: React.CSSProperties = {}) =>
    lines.push({ text, style: { fontFamily: 'Georgia, serif', color: ink, lineHeight: 1.65, ...extra } })

  add(`${nombre}:`, { fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.5rem' })
  add('Hemos visto cómo construyes mundos. No sólo lo que haces con una idea, sino lo que ocurre a su alrededor cuando decides darle forma.', { fontSize: '0.6875rem', marginBottom: '0.4rem' })
  add('Vimos una cualidad que no puede medirse en portafolio o reconocimiento. Vimos una forma propia de entender cómo se cuentan las historias.', { fontSize: '0.6875rem', color: inkD, marginBottom: '0.4rem' })
  add('Por eso, la Red Continental de Observación te invita a ser parte de la construcción de Los Prodigios.', { fontSize: '0.6875rem', marginBottom: '0.4rem' })
  add('Esta invitación no garantiza que todo esté resuelto. Garantiza algo que pocos proyectos ofrecen: un espacio real para construir algo que todavía no existe.', { fontSize: '0.625rem', color: inkD, marginBottom: '0.4rem' })
  add('Trae tu criterio. Trae también la historia que todavía no te has atrevido a contar.', { fontSize: '0.6875rem', marginBottom: '0.5rem' })

  const linea = rol
    ? `Lo que nos llamó la atención no fue únicamente lo que ya habías hecho como ${rol}. Fue lo que todavía guardabas.`
    : 'Lo que nos llamó la atención no fue únicamente lo que ya habías hecho. Fue lo que todavía guardabas.'
  add(linea, {
    fontSize: '0.625rem', fontStyle: 'italic',
    color: 'rgba(30,20,8,0.55)',
    borderLeft: '2px solid rgba(198,149,42,0.45)',
    paddingLeft: '0.5rem', marginBottom: '0.5rem',
  })

  add('Te estamos esperando.', { fontSize: '0.6875rem', marginBottom: '0.2rem' })
  add('Red Continental de Observación — Nueva Corona', { fontSize: '0.5625rem', color: inkD, letterSpacing: '0.06em' })
  return lines
}

// ── Particle canvas ───────────────────────────────────────────────────────────
function useParticles(canvasRef: React.RefObject<HTMLCanvasElement | null>, trigger: boolean) {
  useEffect(() => {
    if (!trigger) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    interface Particle {
      x: number; y: number; vx: number; vy: number
      size: number; alpha: number; decay: number; color: string
    }

    const colors = ['#C6952A', '#E8B84B', '#F5D07A', '#D4A032', '#FFF0B0']
    const particles: Particle[] = []

    const cx = canvas.width / 2
    const cy = canvas.height * 0.42

    for (let i = 0; i < 120; i++) {
      const angle = Math.random() * Math.PI * 2
      const speed = 1.5 + Math.random() * 5
      particles.push({
        x: cx + (Math.random() - 0.5) * 60,
        y: cy + (Math.random() - 0.5) * 30,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        size: 1.5 + Math.random() * 3.5,
        alpha: 0.9 + Math.random() * 0.1,
        decay: 0.012 + Math.random() * 0.018,
        color: colors[Math.floor(Math.random() * colors.length)],
      })
    }

    let raf: number
    function draw() {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height)
      let alive = false
      for (const p of particles) {
        p.x += p.vx; p.y += p.vy
        p.vy += 0.12
        p.vx *= 0.98
        p.alpha -= p.decay
        if (p.alpha <= 0) continue
        alive = true
        ctx!.save()
        ctx!.globalAlpha = p.alpha
        ctx!.fillStyle = p.color
        ctx!.beginPath()
        ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx!.fill()
        ctx!.restore()
      }
      if (alive) raf = requestAnimationFrame(draw)
      else ctx!.clearRect(0, 0, canvas!.width, canvas!.height)
    }
    raf = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(raf)
  }, [trigger, canvasRef])
}

// ── Audio helper ──────────────────────────────────────────────────────────────
function playOpenSound() {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    const ctx = new AudioCtx()

    // Warm chord: root + major third + fifth, slow attack
    const freqs = [220, 277.18, 329.63, 440]
    freqs.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.value = freq
      gain.gain.setValueAtTime(0, ctx.currentTime)
      gain.gain.linearRampToValueAtTime(0.06 - i * 0.01, ctx.currentTime + 0.3)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 3.5)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(ctx.currentTime)
      osc.stop(ctx.currentTime + 3.5)
    })
  } catch { /* silent fail */ }
}

function playAmbient() {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    const ctx = new AudioCtx()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.value = 55
    gain.gain.setValueAtTime(0, ctx.currentTime)
    gain.gain.linearRampToValueAtTime(0.025, ctx.currentTime + 2)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 8)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 8)
  } catch { /* silent fail */ }
}

// ── Inner component ───────────────────────────────────────────────────────────
function LlamadoContent() {
  const params     = useSearchParams()
  const tokenParam = params.get('t')

  const [invData, setInvData] = useState<{ nombre: string; rol: string } | null>(null)
  const [invError, setInvError] = useState('')

  useEffect(() => {
    if (!tokenParam) return
    fetch(`/api/invitations/${tokenParam}`)
      .then(r => r.json())
      .then(d => { if (d.error) setInvError(d.error); else setInvData(d) })
  }, [tokenParam])

  const nombre = invData?.nombre ?? params.get('n') ?? params.get('nombre') ?? 'Prodigio'
  const rol    = invData?.rol    ?? params.get('r') ?? params.get('rol')    ?? ''
  const code   = genCode(nombre)
  const lines  = buildLines(nombre, rol)

  const [phase, setPhase]          = useState<Phase>('black')
  const [visibleLines, setVisible] = useState(0)
  const [flash, setFlash]          = useState(false)
  const [particles, setParticles]  = useState(false)
  const timerRef                   = useRef<ReturnType<typeof setInterval> | null>(null)
  const canvasRef                  = useRef<HTMLCanvasElement>(null)

  useParticles(canvasRef, particles)

  // Cinematic intro sequence
  useEffect(() => {
    const t1 = setTimeout(() => setPhase('emblem'), 600)
    const t2 = setTimeout(() => { playAmbient(); setPhase('fadeout') }, 3200)
    const t3 = setTimeout(() => setPhase('init'), 4200)
    const t4 = setTimeout(() => setPhase('code'), 4600)
    const t5 = setTimeout(() => setPhase('envelope'), 6200)
    return () => [t1,t2,t3,t4,t5].forEach(clearTimeout)
  }, [])

  // Staggered line reveal
  useEffect(() => {
    if (phase !== 'letter') return
    let i = 0
    timerRef.current = setInterval(() => {
      i++; setVisible(i)
      if (i >= lines.length) { clearInterval(timerRef.current!); timerRef.current = null }
    }, 300)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [phase, lines.length])

  useEffect(() => {
    if (visibleLines >= lines.length && phase === 'letter') {
      const t = setTimeout(() => setPhase('ready'), 700)
      return () => clearTimeout(t)
    }
  }, [visibleLines, lines.length, phase])

  const openEnvelope = useCallback(() => {
    if (phase !== 'envelope') return
    // Flash + particles + sound
    setFlash(true)
    setTimeout(() => setFlash(false), 500)
    setTimeout(() => setParticles(true), 50)
    setTimeout(() => setParticles(false), 2500)
    playOpenSound()
    setPhase('opening')
    setTimeout(() => setPhase('letter'), 750)
  }, [phase])

  const isBlack    = phase === 'black'
  const showEmblem = phase === 'emblem' || phase === 'fadeout'
  const emblemOut  = phase === 'fadeout'
  const showCode   = !['black','emblem','fadeout','init'].includes(phase)
  const showEnv    = phase === 'envelope' || phase === 'opening'
  const envLeaving = phase === 'opening'
  const showLetter = phase === 'letter' || phase === 'ready'

  return (
    <div style={{
      minHeight: '100vh',
      background: '#04060F',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center',
      justifyContent: showLetter ? 'flex-start' : 'center',
      padding: showLetter ? '2.5rem 1rem 5rem' : '0 1rem',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <style>{`
        @keyframes aurora-drift-1 { from { transform: translate(0,0) scale(1); } to { transform: translate(60px,40px) scale(1.15); } }
        @keyframes aurora-drift-2 { from { transform: translate(0,0) scale(1); } to { transform: translate(-40px,-30px) scale(1.1); } }
        @keyframes envelope-in   { from { opacity:0; transform: translateY(40px) scale(0.96); } to { opacity:1; transform: translateY(0) scale(1); } }
        @keyframes letter-rise   { from { opacity:0; transform: translateY(24px); } to { opacity:1; transform: translateY(0); } }
        @keyframes emblem-in     { from { opacity:0; transform: scale(0.88); } to { opacity:1; transform: scale(1); } }
        @keyframes fade-in       { from { opacity:0; } to { opacity:1; } }
        @keyframes hint-pulse    { 0%,100% { opacity:0.4; } 50% { opacity:0.8; } }
        @keyframes seal-glow     { 0%,100% { filter: drop-shadow(0 0 8px rgba(198,149,42,0.3)); } 50% { filter: drop-shadow(0 0 20px rgba(198,149,42,0.7)); } }
        @keyframes flash-out     { 0% { opacity:0.7; } 100% { opacity:0; } }
      `}</style>

      {/* ── CINEMATIC INTRO ── */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 50,
        background: '#04060F',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        opacity: isBlack || showEmblem ? 1 : 0,
        transition: 'opacity 0.8s ease',
        pointerEvents: isBlack || showEmblem ? 'all' : 'none',
      }}>
        {/* LP Emblem */}
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem',
          opacity: showEmblem ? 1 : 0,
          transform: emblemOut ? 'scale(1.08)' : 'scale(1)',
          transition: emblemOut ? 'opacity 0.9s ease, transform 0.9s ease' : 'opacity 0.7s ease 0.2s, transform 0.7s ease 0.2s',
          animation: showEmblem && !emblemOut ? 'emblem-in 0.8s ease forwards' : undefined,
        }}>
          {/* SVG emblema P atravesada */}
          <svg width="72" height="72" viewBox="0 0 72 72" fill="none" style={{ animation: showEmblem ? 'seal-glow 2s ease-in-out infinite' : 'none' }}>
            <circle cx="36" cy="36" r="34" stroke="#C6952A" strokeWidth="1.2" opacity="0.4"/>
            <circle cx="36" cy="36" r="28" stroke="#C6952A" strokeWidth="0.6" opacity="0.25"/>
            <text x="36" y="48" textAnchor="middle" fontFamily="Georgia,serif" fontSize="38" fontWeight="700" fill="#C6952A" opacity="0.9">P</text>
            {/* Línea ascendente diagonal atravesando la P */}
            <line x1="18" y1="58" x2="54" y2="14" stroke="#C6952A" strokeWidth="1.8" strokeLinecap="round" opacity="0.85"/>
          </svg>

          <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
            <div style={{
              fontFamily: 'Georgia, serif', fontSize: '1.375rem', letterSpacing: '0.32em',
              color: '#C6952A', textTransform: 'uppercase',
            }}>
              Los Prodigios
            </div>
            <div style={{
              fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '0.5rem', letterSpacing: '0.28em',
              color: 'rgba(198,149,42,0.45)', textTransform: 'uppercase',
            }}>
              Red Continental de Observación
            </div>
          </div>
        </div>
      </div>

      {/* ── FLASH ── */}
      {flash && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 40,
          background: 'radial-gradient(ellipse at center, rgba(198,149,42,0.55) 0%, transparent 70%)',
          animation: 'flash-out 0.5s ease forwards',
          pointerEvents: 'none',
        }} />
      )}

      {/* ── PARTICLES CANVAS ── */}
      <canvas
        ref={canvasRef}
        style={{ position: 'fixed', inset: 0, zIndex: 30, pointerEvents: 'none' }}
      />

      {/* ── AURORA BG ── */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', width: 700, height: 700, top: '-20%', left: '-15%', background: 'radial-gradient(circle, rgba(6,18,42,0.85) 0%, transparent 65%)', filter: 'blur(80px)', animation: 'aurora-drift-1 18s ease-in-out infinite alternate' }} />
        <div style={{ position: 'absolute', width: 400, height: 400, bottom: '-10%', right: 0, background: 'radial-gradient(circle, rgba(198,149,42,0.05) 0%, transparent 70%)', filter: 'blur(80px)', animation: 'aurora-drift-2 22s ease-in-out infinite alternate' }} />
      </div>

      {/* ── GRAIN ── */}
      <svg style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', opacity: 0.04, pointerEvents: 'none', zIndex: 0 }}>
        <filter id="gr-ll"><feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" /><feColorMatrix type="saturate" values="0" /></filter>
        <rect width="100%" height="100%" filter="url(#gr-ll)" />
      </svg>

      {/* ── CONTENT ── */}
      <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.875rem', width: '100%' }}>

        {/* Código */}
        <div style={{
          fontFamily: 'monospace', fontSize: '0.6875rem', letterSpacing: '0.22em',
          color: '#C6952A', textAlign: 'center',
          opacity: showCode ? 1 : 0,
          transition: 'opacity 1.2s ease',
        }}>
          {code}
        </div>

        {/* Org */}
        <div style={{
          fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '0.5625rem',
          letterSpacing: '0.28em', textTransform: 'uppercase',
          color: 'rgba(198,149,42,0.5)', textAlign: 'center',
          opacity: showCode ? 1 : 0,
          transition: 'opacity 1.2s ease 0.5s',
        }}>
          Red Continental de Observación
        </div>

        {/* ── SOBRE ── */}
        {showEnv && (
          <div
            onClick={openEnvelope}
            style={{
              position: 'relative',
              cursor: envLeaving ? 'default' : 'pointer',
              width: 'min(480px, 88vw)',
              opacity: envLeaving ? 0 : 1,
              transform: envLeaving ? 'translateY(-20px) scale(1.04)' : 'translateY(0) scale(1)',
              transition: 'opacity 0.6s ease, transform 0.6s ease',
              animation: !envLeaving ? 'envelope-in 0.7s cubic-bezier(0.2,0,0,1) forwards' : undefined,
              filter: `drop-shadow(0 24px 48px rgba(0,0,0,0.7)) drop-shadow(0 0 ${envLeaving ? '40' : '0'}px rgba(198,149,42,0.4))`,
            }}
          >
            <Image
              src="/llamado/sobre.png"
              alt="Sobre El Llamado"
              width={1280} height={914}
              style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '2px' }}
              priority
            />
            {/* Nombre sobre el sobre */}
            <div style={{
              position: 'absolute', top: '73%', left: '50%',
              transform: 'translateX(-50%)',
              fontFamily: 'Georgia, serif',
              fontSize: 'clamp(0.75rem, 2vw, 0.9375rem)',
              color: 'rgba(240,235,225,0.65)',
              letterSpacing: '0.14em', whiteSpace: 'nowrap',
              pointerEvents: 'none',
            }}>
              {nombre}
            </div>

            {/* Hint pulsante */}
            {!envLeaving && (
              <div style={{
                position: 'absolute', bottom: '-2.25rem', left: '50%', transform: 'translateX(-50%)',
                fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '0.5625rem',
                letterSpacing: '0.22em', textTransform: 'uppercase',
                color: 'rgba(198,149,42,0.5)',
                whiteSpace: 'nowrap',
                animation: 'hint-pulse 2s ease-in-out infinite',
              }}>
                ✦ Abrir sobre ✦
              </div>
            )}
          </div>
        )}

        {/* ── CARTA ── */}
        {showLetter && (
          <div style={{
            position: 'relative', width: 'min(640px, 90vw)',
            animation: 'letter-rise 0.65s cubic-bezier(0.2,0,0,1) forwards',
            filter: 'drop-shadow(0 28px 56px rgba(0,0,0,0.75))',
          }}>
            <Image
              src="/llamado/hoja.png"
              alt="Carta El Llamado"
              width={952} height={1232}
              style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '1px' }}
              priority
            />

            {/* Código en la carta */}
            <div style={{
              position: 'absolute', top: '7.5%', right: '9%',
              fontFamily: 'monospace', fontSize: 'clamp(0.35rem, 0.7vw, 0.5rem)',
              color: 'rgba(30,20,8,0.5)', letterSpacing: '0.08em',
              textAlign: 'right', lineHeight: 1.8,
            }}>
              {code}<br /><span>RED CONTINENTAL DE OBSERVACIÓN</span>
            </div>

            {/* Texto de la carta */}
            <div style={{
              position: 'absolute', top: '24%', left: '13%', right: '13%',
              maxHeight: '44%',
              display: 'flex', flexDirection: 'column',
              justifyContent: 'flex-start', overflow: 'hidden',
            }}>
              {lines.map((line, i) => (
                <div key={i} style={{
                  ...line.style,
                  opacity: i < visibleLines ? 1 : 0,
                  transform: i < visibleLines ? 'translateY(0)' : 'translateY(6px)',
                  transition: 'opacity 0.45s ease, transform 0.45s ease',
                }}>
                  {line.text || <>&nbsp;</>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── CTA ── */}
        {phase === 'ready' && (
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem',
            animation: 'letter-rise 0.6s ease 0.2s both',
            marginTop: '0.75rem',
          }}>
            <button
              onClick={() => signIn('google', {
                callbackUrl: tokenParam ? `/llamado/accept?t=${tokenParam}` : '/dashboard',
              })}
              style={{
                fontFamily: 'Bebas Neue, Impact, sans-serif',
                fontSize: '1.0625rem', letterSpacing: '0.2em',
                color: '#04060F', background: 'linear-gradient(135deg, #C6952A 0%, #E8B84B 50%, #C6952A 100%)',
                border: 'none', borderRadius: '2px',
                padding: '0.875rem 3rem',
                cursor: 'pointer',
                boxShadow: '0 4px 32px rgba(198,149,42,0.45), 0 0 0 1px rgba(198,149,42,0.2)',
                transition: 'all 0.2s ease',
                backgroundSize: '200% auto',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.boxShadow = '0 8px 40px rgba(198,149,42,0.65), 0 0 0 1px rgba(198,149,42,0.4)'
                e.currentTarget.style.transform = 'translateY(-2px)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.boxShadow = '0 4px 32px rgba(198,149,42,0.45), 0 0 0 1px rgba(198,149,42,0.2)'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              Aceptar el Llamado
            </button>
            <div style={{
              fontFamily: 'Georgia, serif', fontStyle: 'italic',
              fontSize: '0.625rem', color: 'rgba(198,149,42,0.4)',
              letterSpacing: '0.06em', textAlign: 'center',
            }}>
              El talento abre la puerta; el carácter decide cómo cruzarla.
            </div>
          </div>
        )}

        {/* Error de token */}
        {invError && (
          <div style={{
            marginTop: '1rem', padding: '0.75rem 1.25rem',
            background: 'rgba(212,37,106,0.08)', border: '1px solid rgba(212,37,106,0.2)',
            borderRadius: '2px', fontSize: '0.8125rem', color: '#D4256A',
            fontFamily: 'IBM Plex Sans, sans-serif',
          }}>
            {invError}
          </div>
        )}
      </div>
    </div>
  )
}

export default function LlamadoPage() {
  return (
    <Suspense>
      <LlamadoContent />
    </Suspense>
  )
}
