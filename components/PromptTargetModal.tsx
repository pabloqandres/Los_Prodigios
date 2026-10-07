'use client'

import { motion, AnimatePresence } from 'framer-motion'

export type PromptTarget = 'chatgpt' | 'artlist' | 'runway' | 'midjourney' | 'sora'

const TARGETS: { key: PromptTarget; label: string; sub: string; limit: string; icon: string; color: string }[] = [
  {
    key: 'chatgpt',
    label: 'ChatGPT / Claude',
    sub: 'Prompt largo y detallado',
    limit: 'Sin límite · incluye notas de dirección, variantes y contexto canónico completo',
    icon: '🧠',
    color: '#10A37F',
  },
  {
    key: 'artlist',
    label: 'Artlist / Kling',
    sub: 'Prompt corto optimizado',
    limit: 'Máx. 1.800 caracteres · inglés · listo para pegar',
    icon: '🎬',
    color: '#F5A52A',
  },
  {
    key: 'runway',
    label: 'Runway',
    sub: 'Prompt corto optimizado',
    limit: 'Máx. 1.000 caracteres · inglés · listo para pegar',
    icon: '✈️',
    color: '#9B6FD4',
  },
  {
    key: 'midjourney',
    label: 'Midjourney / Sora',
    sub: 'Prompt estructurado',
    limit: 'Máx. 2.000 caracteres · inglés · tags y parámetros incluidos',
    icon: '🖼',
    color: '#4A8FE8',
  },
]

interface PromptTargetModalProps {
  open: boolean
  onSelect: (target: PromptTarget) => void
  onClose: () => void
}

export default function PromptTargetModal({ open, onSelect, onClose }: PromptTargetModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={e => { if (e.target === e.currentTarget) onClose() }}
          style={{
            position: 'fixed', inset: 0, zIndex: 8000,
            background: 'rgba(4,2,14,0.85)',
            backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '1.5rem',
            fontFamily: 'IBM Plex Sans, sans-serif',
          }}
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 12 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            style={{
              background: '#0D0920',
              border: '1px solid rgba(245,165,42,0.15)',
              borderRadius: 6,
              width: '100%', maxWidth: 520,
              overflow: 'hidden',
            }}
          >
            {/* Header */}
            <div style={{
              padding: '1.25rem 1.5rem',
              borderBottom: '1px solid rgba(245,165,42,0.08)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <div>
                <div style={{ fontSize: '0.5rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(240,235,225,0.3)', marginBottom: 4 }}>
                  Generación de prompt
                </div>
                <div style={{ fontSize: '1rem', fontFamily: 'Bebas Neue, Impact, sans-serif', letterSpacing: '0.06em', color: '#F0EBE1' }}>
                  ¿Para qué motor vas a generar?
                </div>
              </div>
              <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'rgba(240,235,225,0.3)', cursor: 'pointer', fontSize: '1.1rem' }}>✕</button>
            </div>

            {/* Options */}
            <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {TARGETS.map(t => (
                <motion.button
                  key={t.key}
                  onClick={() => onSelect(t.key)}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  style={{
                    display: 'flex', alignItems: 'flex-start', gap: '1rem',
                    padding: '0.875rem 1rem',
                    background: 'transparent',
                    border: `1px solid rgba(240,235,225,0.06)`,
                    borderRadius: 4,
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontFamily: 'IBM Plex Sans, sans-serif',
                    transition: 'all 0.12s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = `${t.color}0D`
                    e.currentTarget.style.borderColor = `${t.color}40`
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'transparent'
                    e.currentTarget.style.borderColor = 'rgba(240,235,225,0.06)'
                  }}
                >
                  <span style={{ fontSize: '1.375rem', lineHeight: 1, flexShrink: 0, marginTop: 2 }}>{t.icon}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#F0EBE1', marginBottom: 2 }}>{t.label}</div>
                    <div style={{ fontSize: '0.75rem', color: t.color, marginBottom: 3 }}>{t.sub}</div>
                    <div style={{ fontSize: '0.6875rem', color: 'rgba(240,235,225,0.3)', lineHeight: 1.4 }}>{t.limit}</div>
                  </div>
                  <div style={{ fontSize: '1rem', color: 'rgba(240,235,225,0.2)', flexShrink: 0, marginTop: 4 }}>→</div>
                </motion.button>
              ))}
            </div>

            <div style={{ padding: '0.75rem 1.5rem', borderTop: '1px solid rgba(245,165,42,0.06)', fontSize: '0.6875rem', color: 'rgba(240,235,225,0.2)', textAlign: 'center' }}>
              El asistente ajustará longitud, idioma y estructura según el motor seleccionado
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
