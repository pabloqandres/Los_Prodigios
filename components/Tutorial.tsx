'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { TUTORIAL_STEPS, TUTORIAL_TRACKS, type TutorialStep, type TutorialTrack } from '@/lib/tutorial-steps'
import TutorialSelector from './TutorialSelector'

const BIT_IMAGES: Record<string, string> = {
  happy:     '/bit/bit_happy.png',
  neutral:   '/bit/bit_neutral.png',
  surprised: '/bit/bit_surprised.png',
  night:     '/bit/bit_night.png',
}

interface SpotlightRect {
  top: number
  left: number
  width: number
  height: number
}

export default function Tutorial() {
  const router   = useRouter()
  const pathname = usePathname()
  const { data: session } = useSession()

  const [showSelector, setShowSelector] = useState(false)
  const [activeSteps, setActiveSteps]   = useState<TutorialStep[]>([])
  const [visible, setVisible]           = useState(false)
  const [stepIndex, setStepIndex]       = useState(0)
  const [conditionMet, setConditionMet] = useState(false)
  const [spotlightRect, setSpotlightRect] = useState<SpotlightRect | null>(null)
  const [isAdmin, setIsAdmin]           = useState(false)
  const overlayRef = useRef<HTMLDivElement>(null)

  // Detect admin role
  useEffect(() => {
    if (!session?.user?.email) return
    fetch('/api/me')
      .then(r => r.json())
      .then(d => { if (d?.role === 'admin') setIsAdmin(true) })
      .catch(() => {})
  }, [session])


  // Listen for open-selector or restart from Sidebar
  useEffect(() => {
    const handleOpen = () => setShowSelector(true)
    window.addEventListener('tutorial:open-selector', handleOpen)
    window.addEventListener('tutorial:restart', handleOpen)
    return () => {
      window.removeEventListener('tutorial:open-selector', handleOpen)
      window.removeEventListener('tutorial:restart', handleOpen)
    }
  }, [])

  function startTrack(track: TutorialTrack) {
    const steps = TUTORIAL_STEPS.filter(s => track.stepIds.includes(s.id))
    // Preserve original order as defined in the track
    const ordered = track.stepIds.map(id => steps.find(s => s.id === id)).filter(Boolean) as TutorialStep[]
    setActiveSteps(ordered)
    setStepIndex(0)
    setConditionMet(ordered[0]?.condition === 'none')
    setVisible(true)
    setShowSelector(false)
  }

  const step = activeSteps[stepIndex] ?? null

  // Auto-navigate to first episode when reaching episode builder steps
  useEffect(() => {
    if (step?.id !== 'episodes-builder') return
    const isInsideEpisode = pathname.startsWith('/episodes/') && pathname !== '/episodes'
    if (isInsideEpisode) return
    fetch('/api/episodes')
      .then(r => r.json())
      .then((data: { id: string; season: number; episode_number: number }[]) => {
        const sorted = [...data].sort((a, b) => a.season - b.season || a.episode_number - b.episode_number)
        const first = sorted[0]
        if (first?.id) router.push(`/episodes/${first.id}`)
      })
      .catch(() => {})
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepIndex])

  // Listen for condition events
  useEffect(() => {
    const evt = step?.conditionEvent
    if (!evt) return
    const handler = () => setConditionMet(true)
    window.addEventListener(evt, handler)
    return () => window.removeEventListener(evt, handler)
  }, [step?.conditionEvent])

  // Reset condition when step changes
  useEffect(() => {
    setConditionMet(step?.condition === 'none')
  }, [stepIndex, step?.condition])

  // Update spotlight position
  const updateSpotlight = useCallback(() => {
    if (!step?.spotlightSelector || !visible) {
      setSpotlightRect(null)
      return
    }
    const el = document.querySelector(step.spotlightSelector)
    if (!el) { setSpotlightRect(null); return }
    const rect = el.getBoundingClientRect()
    setSpotlightRect({
      top:    rect.top  - 8,
      left:   rect.left - 8,
      width:  rect.width  + 16,
      height: rect.height + 16,
    })
  }, [step?.spotlightSelector, visible])

  useEffect(() => {
    updateSpotlight()
    const interval = setInterval(updateSpotlight, 300)
    window.addEventListener('resize', updateSpotlight)
    return () => { clearInterval(interval); window.removeEventListener('resize', updateSpotlight) }
  }, [updateSpotlight])

  useEffect(() => {
    const t1 = setTimeout(updateSpotlight, 400)
    const t2 = setTimeout(updateSpotlight, 900)
    const t3 = setTimeout(updateSpotlight, 1800)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [pathname, updateSpotlight])

  const needsNavigation = step?.route ? !pathname.startsWith(step.route) : false
  const bitImage = step ? (isAdmin && step.bitAdmin ? BIT_IMAGES[step.bitAdmin] : BIT_IMAGES[step.bit]) : BIT_IMAGES.happy

  const dialogue = step
    ? (needsNavigation
        ? (step.navDialogue ?? step.dialogue)
        : (isAdmin && step.dialogueAdmin ? step.dialogueAdmin : step.dialogue))
    : ''

  function handleNext() {
    const isLast = stepIndex === activeSteps.length - 1
    if (isLast) {
      localStorage.setItem('bit_tutorial_done', 'true')
      setVisible(false)
      setActiveSteps([])
      return
    }
    setStepIndex(i => i + 1)
  }

  function handleSkip() {
    localStorage.setItem('bit_tutorial_done', 'true')
    setVisible(false)
    setActiveSteps([])
  }

  function handleNavigate() {
    if (step?.route) router.push(step.route)
  }

  const progress = activeSteps.length > 1 ? stepIndex / (activeSteps.length - 1) : 1

  return (
    <>
      {/* Track selector */}
      {showSelector && (
        <TutorialSelector
          onSelect={startTrack}
          onClose={() => setShowSelector(false)}
        />
      )}

      {visible && step && (
        <>
          <style>{`
            @keyframes tutorial-pulse {
              0%, 100% { box-shadow: 0 0 0 9999px rgba(8,6,15,0.82), 0 0 0 3px rgba(245,165,42,0.9), 0 0 20px 4px rgba(245,165,42,0.35); }
              50%       { box-shadow: 0 0 0 9999px rgba(8,6,15,0.82), 0 0 0 3px rgba(245,165,42,1),   0 0 32px 8px rgba(245,165,42,0.55); }
            }
          `}</style>

          {/* Overlay */}
          <div ref={overlayRef} style={{ position: 'fixed', inset: 0, zIndex: 1000, pointerEvents: 'none' }}>
            {step.spotlightSelector && !spotlightRect && (
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(8,6,15,0.78)', pointerEvents: 'none' }} />
            )}
            {spotlightRect && (
              <div
                style={{
                  position: 'absolute',
                  top: spotlightRect.top, left: spotlightRect.left,
                  width: spotlightRect.width, height: spotlightRect.height,
                  borderRadius: '6px', background: 'transparent',
                  animation: 'tutorial-pulse 2s ease-in-out infinite',
                  zIndex: 1001, pointerEvents: 'none',
                }}
              />
            )}
          </div>

          {/* Bit card */}
          {(() => {
            const spotlightOnRight = spotlightRect
              ? spotlightRect.left + spotlightRect.width / 2 > window.innerWidth / 2
              : false
            return (
              <div style={{
                position: 'fixed',
                bottom: '2rem',
                ...(spotlightOnRight ? { left: '2rem' } : { right: '2rem' }),
                width: '340px',
                zIndex: 1002,
              }}>
                {/* Bit image */}
                <div style={{
                  position: 'absolute', bottom: 'calc(100% - 28px)', left: '12px',
                  width: '148px', height: '148px', zIndex: 1003, pointerEvents: 'none',
                }}>
                  <img
                    src={bitImage} alt="Bit"
                    style={{
                      width: '100%', height: '100%',
                      objectFit: 'contain', objectPosition: 'bottom',
                      filter: 'drop-shadow(0 8px 20px rgba(78,205,196,0.25)) drop-shadow(0 2px 6px rgba(0,0,0,0.5))',
                    }}
                  />
                </div>

                {/* Card body */}
                <div style={{
                  background: '#120D28',
                  border: '1px solid rgba(245,165,42,0.25)',
                  borderRadius: '6px',
                  boxShadow: '0 8px 40px rgba(0,0,0,0.6), 0 0 32px rgba(245,165,42,0.06)',
                  overflow: 'hidden',
                }}>
                  {/* Top bar: step indicator + skip */}
                  <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '0.625rem 0.875rem 0',
                  }}>
                    <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', maxWidth: '220px' }}>
                      {activeSteps.map((_, i) => (
                        <div key={i} style={{
                          width: i === stepIndex ? '16px' : '6px',
                          height: '6px', borderRadius: '3px',
                          background: i <= stepIndex ? '#F5A52A' : 'rgba(245,165,42,0.2)',
                          transition: 'all 0.2s ease',
                        }} />
                      ))}
                    </div>
                    <button
                      onClick={handleSkip}
                      style={{
                        background: 'none', border: 'none',
                        color: 'rgba(240,235,225,0.25)', fontSize: '0.6875rem',
                        cursor: 'pointer', letterSpacing: '0.08em', textTransform: 'uppercase',
                        fontFamily: 'IBM Plex Sans, sans-serif', padding: '0.25rem',
                      }}
                      onMouseEnter={e => e.currentTarget.style.color = 'rgba(240,235,225,0.5)'}
                      onMouseLeave={e => e.currentTarget.style.color = 'rgba(240,235,225,0.25)'}
                    >
                      Saltar
                    </button>
                  </div>

                  {/* Dialogue */}
                  <div style={{ padding: '0.75rem 0.875rem 0.875rem' }}>
                    <div style={{
                      fontFamily: 'IBM Plex Sans, sans-serif',
                      fontSize: '0.8125rem',
                      color: 'rgba(240,235,225,0.82)',
                      lineHeight: 1.6,
                      whiteSpace: 'pre-line',
                    }}>
                      {dialogue}
                    </div>
                  </div>

                  {/* Footer */}
                  <div style={{ padding: '0 0.875rem 0.875rem', display: 'flex', justifyContent: 'flex-end' }}>
                    {needsNavigation ? (
                      <button
                        onClick={handleNavigate}
                        style={{
                          padding: '0.5rem 1.125rem',
                          background: 'rgba(245,165,42,0.1)',
                          border: '1px solid rgba(245,165,42,0.3)',
                          borderRadius: '3px', color: '#F5A52A',
                          fontSize: '0.8125rem', fontWeight: 600,
                          fontFamily: 'IBM Plex Sans, sans-serif', cursor: 'pointer',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(245,165,42,0.18)'; e.currentTarget.style.borderColor = 'rgba(245,165,42,0.5)' }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(245,165,42,0.1)'; e.currentTarget.style.borderColor = 'rgba(245,165,42,0.3)' }}
                      >
                        {step.navLabel ?? `Ir a ${step.route} →`}
                      </button>
                    ) : (
                      <button
                        onClick={handleNext}
                        disabled={!conditionMet}
                        style={{
                          padding: '0.5rem 1.25rem',
                          background: conditionMet ? '#F5A52A' : 'rgba(245,165,42,0.12)',
                          border: 'none', borderRadius: '3px',
                          color: conditionMet ? '#08060F' : 'rgba(245,165,42,0.35)',
                          fontSize: '0.8125rem', fontWeight: 700,
                          fontFamily: 'IBM Plex Sans, sans-serif',
                          cursor: conditionMet ? 'pointer' : 'not-allowed',
                          letterSpacing: '0.02em',
                        }}
                      >
                        {conditionMet ? step.buttonLabel : '⏳ ' + step.buttonLabel}
                      </button>
                    )}
                  </div>

                  {/* Gold bottom accent */}
                  <div style={{
                    height: '2px',
                    background: `linear-gradient(90deg, rgba(245,165,42,${0.2 + progress * 0.6}) 0%, rgba(78,205,196,0.2) 100%)`,
                  }} />
                </div>
              </div>
            )
          })()}
        </>
      )}
    </>
  )
}
