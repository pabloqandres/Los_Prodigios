'use client'

import { TUTORIAL_TRACKS, type TutorialTrack } from '@/lib/tutorial-steps'

interface Props {
  onSelect: (track: TutorialTrack) => void
  onClose: () => void
}

export default function TutorialSelector({ onSelect, onClose }: Props) {
  const [featured, ...rest] = TUTORIAL_TRACKS

  return (
    <>
      <style>{`
        @keyframes ts-in {
          from { opacity: 0; transform: scale(0.96) translateY(12px); }
          to   { opacity: 1; transform: scale(1)    translateY(0); }
        }
        .ts-card {
          cursor: pointer;
          transition: all 0.15s ease;
          border-radius: 6px;
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 6px;
          border: 1px solid rgba(255,255,255,0.06);
          background: rgba(255,255,255,0.02);
        }
        .ts-card:hover {
          background: rgba(255,255,255,0.05);
          border-color: rgba(255,255,255,0.12);
          transform: translateY(-1px);
        }
      `}</style>

      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(8,6,15,0.85)',
          zIndex: 1100,
          backdropFilter: 'blur(4px)',
        }}
      />

      {/* Modal */}
      <div style={{
        position: 'fixed',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 1101,
        width: 'min(680px, 94vw)',
        background: '#0F0C22',
        border: '1px solid rgba(245,165,42,0.2)',
        borderRadius: '10px',
        boxShadow: '0 24px 80px rgba(0,0,0,0.7), 0 0 40px rgba(245,165,42,0.05)',
        animation: 'ts-in 0.22s ease both',
        overflow: 'hidden',
      }}>
        {/* Gold top accent */}
        <div style={{ height: '2px', background: 'linear-gradient(90deg, #F5A52A, #4ECDC4)' }} />

        {/* Header */}
        <div style={{ padding: '1.5rem 1.5rem 1rem', display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
          <img
            src="/bit/bit_happy.png"
            alt="Bit"
            style={{ width: '64px', height: '64px', objectFit: 'contain', objectPosition: 'bottom', flexShrink: 0 }}
          />
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'Bebas Neue, Impact, sans-serif', fontSize: '1.5rem', letterSpacing: '0.06em', color: '#F0EBE1', lineHeight: 1.1 }}>
              ¡Ey, de vuelta!
            </div>
            <div style={{ fontSize: '0.875rem', color: 'rgba(240,235,225,0.5)', marginTop: '4px', lineHeight: 1.5 }}>
              ¿Qué sección quieres repasar? Puedo mostrarte todo de nuevo o ir directo a lo que necesitas.
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none', border: 'none',
              color: 'rgba(240,235,225,0.25)', fontSize: '1.25rem',
              cursor: 'pointer', padding: '4px', lineHeight: 1,
              transition: 'color 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.color = 'rgba(240,235,225,0.6)'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(240,235,225,0.25)'}
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '0 1.5rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {/* Featured — Tutorial Completo */}
          <div
            className="ts-card"
            onClick={() => onSelect(featured)}
            style={{
              background: 'rgba(245,165,42,0.06)',
              border: '1px solid rgba(245,165,42,0.2)',
              flexDirection: 'row',
              alignItems: 'center',
              gap: '1rem',
              padding: '1.125rem 1.25rem',
            }}
          >
            <div style={{ fontSize: '2rem', lineHeight: 1, flexShrink: 0 }}>{featured.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ fontFamily: 'Bebas Neue, Impact, sans-serif', fontSize: '1.125rem', letterSpacing: '0.06em', color: '#F5A52A' }}>
                  {featured.label}
                </div>
                <div style={{
                  fontSize: '0.5625rem', padding: '2px 6px', borderRadius: '10px',
                  background: 'rgba(245,165,42,0.15)', color: '#F5A52A',
                  letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 700,
                }}>
                  Recomendado
                </div>
              </div>
              <div style={{ fontSize: '0.8125rem', color: 'rgba(240,235,225,0.5)', marginTop: '2px' }}>
                {featured.description}
              </div>
            </div>
            <div style={{ fontSize: '0.6875rem', color: 'rgba(245,165,42,0.5)', whiteSpace: 'nowrap', flexShrink: 0 }}>
              {featured.stepIds.length} pasos →
            </div>
          </div>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.05)' }} />
            <div style={{ fontSize: '0.625rem', color: 'rgba(240,235,225,0.2)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              O elige una sección
            </div>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.05)' }} />
          </div>

          {/* Section grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
            gap: '0.5rem',
          }}>
            {rest.map(track => (
              <div
                key={track.id}
                className="ts-card"
                onClick={() => onSelect(track)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '1.25rem', lineHeight: 1 }}>{track.icon}</span>
                  <div style={{
                    fontFamily: 'Bebas Neue, Impact, sans-serif',
                    fontSize: '0.9375rem',
                    letterSpacing: '0.05em',
                    color: track.color,
                    lineHeight: 1.2,
                  }}>
                    {track.label}
                  </div>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(240,235,225,0.4)', lineHeight: 1.4 }}>
                  {track.description}
                </div>
                <div style={{ fontSize: '0.625rem', color: 'rgba(240,235,225,0.2)', marginTop: '2px' }}>
                  {track.stepIds.length} {track.stepIds.length === 1 ? 'paso' : 'pasos'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
