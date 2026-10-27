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

export default function Tutorial() {
  const router   = useRouter()
  const pathname = usePathname()
  const { data: session } = useSession()

  const [showSelector, setShowSelector] = useState(false)
  const [activeSteps, setActiveSteps]   = useState<TutorialStep[]>([])
  const [visible, setVisible]           = useState(false)
  const [stepIndex, setStepIndex]       = useState(0)
  const [isAdmin, setIsAdmin]           = useState(false)

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
    const ordered = track.stepIds
      .map(id => steps.find(s => s.id === id))
      .filter(Boolean) as TutorialStep[]
    setActiveSteps(ordered)
    setStepIndex(0)
    setVisible(true)
    setShowSelector(false)
  }

  const step = activeSteps[stepIndex] ?? null

  function handleNext() {
    if (stepIndex === activeSteps.length - 1) {
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

  function handleExplore() {
    if (step?.route) router.push(step.route)
  }

  const hasImage    = !!step?.image
  const cardWidth   = hasImage ? 480 : 340
  const dialogue    = step
    ? (isAdmin && step.dialogueAdmin ? step.dialogueAdmin : step.dialogue)
    : ''
  const bitImage    = step
    ? (isAdmin && step.bitAdmin ? BIT_IMAGES[step.bitAdmin] : BIT_IMAGES[step.bit])
    : BIT_IMAGES.happy
  const progress    = activeSteps.length > 1 ? stepIndex / (activeSteps.length - 1) : 1

  return (
    <>
      {showSelector && (
        <TutorialSelector onSelect={startTrack} onClose={() => setShowSelector(false)} />
      )}

      {visible && step && (
        <>
          <style>{`
            @keyframes tutorial-pulse {
              0%, 100% { box-shadow: 0 0 0 9999px rgba(8,6,15,0.82), 0 0 0 3px rgba(245,165,42,0.9),  0 0 20px 4px rgba(245,165,42,0.35); }
              50%       { box-shadow: 0 0 0 9999px rgba(8,6,15,0.82), 0 0 0 3px rgba(245,165,42,1),    0 0 32px 8px rgba(245,165,42,0.55); }
            }
            @keyframes tut-fade-in {
              from { opacity: 0; transform: translateY(10px); }
              to   { opacity: 1; transform: translateY(0); }
            }
          `}</style>

          {/* Bit card — fixed bottom-right */}
          <div style={{
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            width: `${cardWidth}px`,
            zIndex: 1002,
            animation: 'tut-fade-in 0.2s ease both',
          }}>
            {/* Bit mascot */}
            <div style={{
              position: 'absolute',
              bottom: 'calc(100% - 28px)',
              left: '12px',
              width: '148px',
              height: '148px',
              zIndex: 1003,
              pointerEvents: 'none',
            }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={bitImage}
                alt="Bit"
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

              {/* Mockup image */}
              {hasImage && (
                <div style={{
                  width: '100%',
                  height: 220,
                  overflow: 'hidden',
                  background: '#08060F',
                  borderBottom: '1px solid rgba(245,165,42,0.1)',
                }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={step.image}
                    alt="mockup"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }}
                  />
                </div>
              )}

              {/* Top bar: step dots + skip */}
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
              <div style={{ padding: '0.75rem 0.875rem 0.5rem' }}>
                <div style={{
                  fontFamily: 'IBM Plex Sans, sans-serif',
                  fontSize: '0.8125rem',
                  color: 'rgba(240,235,225,0.82)',
                  lineHeight: 1.65,
                  whiteSpace: 'pre-line',
                }}>
                  {dialogue}
                </div>
              </div>

              {/* Footer: optional Explore link + Next */}
              <div style={{
                padding: '0.5rem 0.875rem 0.875rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: step?.route ? 'space-between' : 'flex-end',
                gap: '0.5rem',
              }}>
                {step?.route && (
                  <button
                    onClick={handleExplore}
                    style={{
                      background: 'none', border: 'none',
                      color: 'rgba(245,165,42,0.45)',
                      fontSize: '0.6875rem',
                      cursor: 'pointer',
                      fontFamily: 'IBM Plex Sans, sans-serif',
                      letterSpacing: '0.04em',
                      padding: '0.25rem 0',
                      textDecoration: 'underline',
                      textDecorationColor: 'rgba(245,165,42,0.2)',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.color = 'rgba(245,165,42,0.8)' }}
                    onMouseLeave={e => { e.currentTarget.style.color = 'rgba(245,165,42,0.45)' }}
                  >
                    {step.navLabel ?? `Explorar sección →`}
                  </button>
                )}
                <button
                  onClick={handleNext}
                  style={{
                    padding: '0.5rem 1.25rem',
                    background: '#F5A52A',
                    border: 'none', borderRadius: '3px',
                    color: '#08060F',
                    fontSize: '0.8125rem', fontWeight: 700,
                    fontFamily: 'IBM Plex Sans, sans-serif',
                    cursor: 'pointer',
                    letterSpacing: '0.02em',
                  }}
                >
                  {step.buttonLabel}
                </button>
              </div>

              {/* Gold progress bar */}
              <div style={{
                height: '2px',
                background: `linear-gradient(90deg, rgba(245,165,42,${0.2 + progress * 0.65}) 0%, rgba(78,205,196,0.2) 100%)`,
              }} />
            </div>
          </div>
        </>
      )}
    </>
  )
}
