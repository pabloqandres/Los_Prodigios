'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface GraphNode {
  id: string
  label: string
  x: number
  y: number
  r: number
  color: string
}

const NODES: GraphNode[] = [
  { id: 'FP01', label: 'Inducción',     x: 10,  y: 25, r: 4,   color: '#F5A52A' },
  { id: 'FP02', label: 'Doctrina',      x: 18,  y: 12, r: 5,   color: '#F5A52A' },
  { id: 'FP03', label: 'Entrenador',    x: 27,  y: 26, r: 4,   color: '#F5A52A' },
  { id: 'FP04', label: 'Casa Prodigio', x: 40,  y: 33, r: 6.5, color: '#4ECDC4' },
  { id: 'FP05', label: 'El Llamado',    x: 47,  y: 14, r: 6,   color: '#4ECDC4' },
  { id: 'FP06', label: 'Red Obs.',      x: 56,  y: 30, r: 4,   color: '#4ECDC4' },
  { id: 'NC',   label: 'Nueva Corona',  x: 22,  y: 48, r: 4,   color: '#4ECDC4' },
  { id: 'FP07', label: 'Símbolos',      x: 45,  y: 52, r: 5,   color: '#4A8FE8' },
  { id: 'FP08', label: 'Arquetipos',    x: 33,  y: 60, r: 4,   color: '#4A8FE8' },
  { id: 'BIT',  label: 'Bit',           x: 57,  y: 64, r: 4,   color: '#9B6FD4' },
  { id: 'FP09', label: 'Profe Casas',   x: 66,  y: 14, r: 4.5, color: '#D4256A' },
  { id: 'FP10', label: 'Tito',          x: 74,  y: 6,  r: 3.5, color: '#D4256A' },
  { id: 'FP11', label: 'Kael',          x: 81,  y: 20, r: 4.5, color: '#D4256A' },
  { id: 'FP12', label: 'Valentina',     x: 77,  y: 36, r: 4,   color: '#D4256A' },
  { id: 'FP13', label: 'Mateo',         x: 68,  y: 48, r: 5.5, color: '#D4256A' },
  { id: 'FP14', label: 'Lucas',         x: 85,  y: 44, r: 3.5, color: '#D4256A' },
  { id: 'FP15', label: 'Sofía',         x: 89,  y: 28, r: 3.5, color: '#D4256A' },
  { id: 'FP16', label: 'Diego',         x: 63,  y: 62, r: 3.5, color: '#D4256A' },
  { id: 'FP17', label: 'Nico',          x: 75,  y: 64, r: 3.5, color: '#D4256A' },
  { id: 'FP18', label: 'Canon 9',       x: 85,  y: 58, r: 4,   color: '#D4256A' },
  { id: 'G01a', label: 'Apertura',      x: 24,  y: 70, r: 4,   color: '#9B6FD4' },
  { id: 'G01b', label: 'Motor Guión',   x: 40,  y: 74, r: 4,   color: '#9B6FD4' },
]

const EDGES: [string, string][] = [
  ['FP01','FP02'], ['FP02','FP03'], ['FP01','FP04'], ['FP03','FP04'],
  ['FP04','FP05'], ['FP04','FP06'], ['FP04','FP07'], ['FP04','NC'],
  ['FP05','FP09'], ['FP06','FP11'], ['FP07','FP08'], ['FP07','BIT'],
  ['FP09','FP10'], ['FP09','FP11'], ['FP11','FP12'], ['FP11','FP15'],
  ['FP12','FP13'], ['FP13','FP14'], ['FP14','FP15'], ['FP13','FP16'],
  ['FP16','FP17'], ['FP17','FP18'], ['FP08','FP13'], ['FP03','FP09'],
  ['G01a','FP04'], ['G01b','G01a'], ['G01b','FP05'], ['NC','FP01'],
  ['FP18','FP14'], ['BIT','FP13'],
]

const DOC_TITLES = [
  { id: 'FP01', short: 'FP01 · Manual de Inducción' },
  { id: 'FP02', short: 'FP02 · La Doctrina Prodigio' },
  { id: 'FP03', short: 'FP03 · Manual del Entrenador' },
  { id: 'FP04', short: 'FP04 · Casa Prodigio' },
  { id: 'FP05', short: 'FP05 · El Llamado' },
  { id: 'FP06', short: 'FP06 · Red de Observación' },
  { id: 'FP07', short: 'FP07 · Biblioteca de Símbolos' },
  { id: 'FP08', short: 'FP08 · Los Once Arquetipos' },
  { id: 'FP09', short: 'FP09 · Perfil Profe Casas' },
  { id: 'FP10', short: 'FP10 · Perfil Tito Hernández' },
  { id: 'FP11', short: 'FP11 · Perfil Kael Santos' },
  { id: 'FP12', short: 'FP12 · Perfil Valentina Ríos' },
  { id: 'FP13', short: 'FP13 · Perfil Mateo González' },
  { id: 'FP14', short: 'FP14 · Perfil Lucas Wong' },
  { id: 'FP15', short: 'FP15 · Perfil Sofía Luna' },
  { id: 'FP16', short: 'FP16 · Perfil Diego Salvatierra' },
  { id: 'FP17', short: 'FP17 · Perfil Nico Aquino' },
  { id: 'FP18', short: 'FP18 · Canon 9 Personajes' },
  { id: 'G01a', short: 'G01 · Apertura Narrativa' },
  { id: 'G01b', short: 'G01 · Motor de Guión' },
  { id: 'NC',   short: 'World · Nueva Corona' },
  { id: 'BIT',  short: 'CR01 · Bit — Mascota' },
]

function nodeById(id: string) { return NODES.find(n => n.id === id)! }

interface Fact { doc: string; snippet: string }
interface RelevantDoc { title: string; score: number }

interface CanonVerificationOverlayProps {
  query: string
  onComplete: (canonContext: string) => void
  onSkip: () => void
}

// SVG transform fix: scale from center of element
const svgScale: React.CSSProperties = { transformBox: 'fill-box' as never, transformOrigin: 'center' }

export default function CanonVerificationOverlay({ query, onComplete, onSkip }: CanonVerificationOverlayProps) {
  const [phase, setPhase]                     = useState<'scanning' | 'analyzing' | 'complete'>('scanning')
  const [scannedCount, setScannedCount]       = useState(0)
  const [activeNodeIds, setActiveNodeIds]     = useState<Set<string>>(new Set())
  const [relevantNodeIds, setRelevantNodeIds] = useState<Set<string>>(new Set())
  const [facts, setFacts]                     = useState<Fact[]>([])
  const [canonContext, setCanonContext]        = useState('')
  const [apiDone, setApiDone]                 = useState(false)
  const [animDone, setAnimDone]               = useState(false)
  const completedRef                          = useRef(false)

  // ── API ─────────────────────────────────────────────────────────────────────
  useEffect(() => {
    fetch('/api/canon-preflight', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    })
      .then(r => r.json())
      .then(data => {
        if (data.facts) setFacts(data.facts)
        if (data.relevant) {
          const titles: string[] = data.relevant.map((r: RelevantDoc) => r.title.toLowerCase())
          const ids = new Set<string>()
          DOC_TITLES.forEach(dt => {
            if (titles.some(t =>
              t.includes(dt.id.toLowerCase().replace('fp', 'fp ')) ||
              dt.short.toLowerCase().includes(titles[0]?.slice(0, 8) ?? '')
            )) ids.add(dt.id)
          })
          const q = query.toLowerCase()
          if (q.includes('mateo'))                                             ids.add('FP13')
          if (q.includes('kael'))                                              ids.add('FP11')
          if (q.includes('valentina'))                                         ids.add('FP12')
          if (q.includes('sofia') || q.includes('sofía'))                     ids.add('FP15')
          if (q.includes('llamado') || q.includes('carta') || q.includes('sobre')) { ids.add('FP05'); ids.add('FP07') }
          if (q.includes('casa prodigio'))                                     ids.add('FP04')
          if (q.includes('bit'))                                               ids.add('BIT')
          setRelevantNodeIds(ids)
        }
        const ctx = data.facts?.map((f: Fact) => `[${f.doc}] ${f.snippet}`).join('\n') ?? ''
        setCanonContext(ctx)
        setApiDone(true)
      })
      .catch(() => setApiDone(true))
  }, [query])

  // ── Animation sequence ───────────────────────────────────────────────────────
  useEffect(() => {
    const total = DOC_TITLES.length
    let count = 0
    const interval = setInterval(() => {
      count++
      setScannedCount(count)
      const nodeId = DOC_TITLES[count - 1]?.id
      if (nodeId) setActiveNodeIds(prev => new Set([...prev, nodeId]))
      if (count >= total) {
        clearInterval(interval)
        setTimeout(() => setPhase('analyzing'), 200)
        setTimeout(() => setPhase('complete'), 1100)
        setTimeout(() => setAnimDone(true), 1400)
      }
    }, 105)
    return () => clearInterval(interval)
  }, [])

  // ── Auto-complete ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (animDone && apiDone && !completedRef.current) {
      completedRef.current = true
      setTimeout(() => onComplete(canonContext), 1000)
    }
  }, [animDone, apiDone, canonContext, onComplete])

  const progress = Math.round((scannedCount / DOC_TITLES.length) * 100)

  const edgeData = EDGES.map(([a, b]) => {
    const na = nodeById(a), nb = nodeById(b)
    if (!na || !nb) return null
    return { a, b, na, nb }
  }).filter(Boolean) as { a: string; b: string; na: GraphNode; nb: GraphNode }[]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.3 } }}
      style={{
        position: 'fixed', inset: 0, zIndex: 9000,
        background: '#04020E',
        display: 'flex', flexDirection: 'column',
        fontFamily: 'IBM Plex Sans, sans-serif',
        overflow: 'hidden',
      }}
    >
      <style>{`
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.4; transform: scale(0.65); }
        }
        @keyframes scan-v {
          0%   { left: -3px; opacity: 0; }
          4%   { opacity: 1; }
          96%  { opacity: 1; }
          100% { left: 100%; opacity: 0; }
        }
        @keyframes scan-v2 {
          0%   { left: -3px; opacity: 0; }
          4%   { opacity: 1; }
          96%  { opacity: 1; }
          100% { left: 100%; opacity: 0; }
        }
        @keyframes scan-h {
          0%   { top: -1px; opacity: 0; }
          4%   { opacity: 1; }
          96%  { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        @keyframes flicker {
          0%, 89%, 91%, 100% { opacity: 1; }
          90% { opacity: 0.35; }
        }
        .scan-v1 { animation: scan-v  2.4s linear infinite; }
        .scan-v2 { animation: scan-v2 2.4s linear infinite 1.15s; }
        .scan-h1 { animation: scan-h  3.6s linear infinite 0.7s; }
        .hdr-flicker { animation: flicker 5s ease-in-out infinite; }
      `}</style>

      {/* dot grid */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'radial-gradient(circle, rgba(245,165,42,0.09) 1px, transparent 1px)',
        backgroundSize: '28px 28px',
      }} />
      {/* radial glow */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 65% 55% at 54% 44%, rgba(78,205,196,0.05) 0%, transparent 70%)',
      }} />

      {/* ── HEADER ──────────────────────────────────────────────────────────── */}
      <div style={{
        flexShrink: 0, padding: '0.9rem 1.75rem',
        borderBottom: '1px solid rgba(245,165,42,0.08)',
        display: 'flex', alignItems: 'center', gap: '1rem',
        background: 'rgba(4,2,14,0.75)', backdropFilter: 'blur(10px)',
        position: 'relative', zIndex: 10,
      }}>
        <div style={{ position: 'relative', width: 10, height: 10, flexShrink: 0 }}>
          <div style={{
            width: 10, height: 10, borderRadius: '50%',
            background: phase === 'complete' ? '#4ECDC4' : '#F5A52A',
            boxShadow: `0 0 10px ${phase === 'complete' ? '#4ECDC4' : '#F5A52A'}`,
            animation: phase !== 'complete' ? 'pulse-dot 1s ease-in-out infinite' : 'none',
          }} />
        </div>
        <div>
          <div style={{ fontSize: '0.45rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(240,235,225,0.2)', marginBottom: 3 }}>
            StudioOS · Motor de Verificación Canónica
          </div>
          <div className="hdr-flicker" style={{ fontSize: '0.875rem', color: '#F0EBE1', fontWeight: 600 }}>
            {phase === 'scanning'  && `Escaneando ${scannedCount} / ${DOC_TITLES.length} documentos...`}
            {phase === 'analyzing' && 'Estableciendo conexiones canónicas...'}
            {phase === 'complete'  && `✓ ${facts.length} datos canónicos verificados`}
          </div>
        </div>
        <div style={{ flex: 1 }} />
        <div style={{
          fontSize: '0.6rem', color: 'rgba(240,235,225,0.3)',
          background: 'rgba(245,165,42,0.05)', border: '1px solid rgba(245,165,42,0.1)',
          borderRadius: 20, padding: '3px 12px',
          maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          "{query.slice(0, 65)}{query.length > 65 ? '…' : ''}"
        </div>
        <button
          onClick={onSkip}
          style={{ background: 'none', border: 'none', color: 'rgba(240,235,225,0.2)', cursor: 'pointer', fontSize: '0.7rem', padding: '4px 8px', fontFamily: 'inherit', letterSpacing: '0.05em' }}
        >
          Omitir →
        </button>
      </div>

      {/* ── BODY ────────────────────────────────────────────────────────────── */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>

        {/* scan beams */}
        {phase === 'scanning' && (
          <>
            <div className="scan-v1" style={{
              position: 'absolute', top: 0, bottom: 0, width: 2,
              background: 'linear-gradient(to bottom, transparent, rgba(245,165,42,0.5), rgba(245,165,42,0.85), rgba(245,165,42,0.5), transparent)',
              boxShadow: '0 0 14px rgba(245,165,42,0.45)',
              zIndex: 5, pointerEvents: 'none',
            }} />
            <div className="scan-v2" style={{
              position: 'absolute', top: 0, bottom: 0, width: 1,
              background: 'linear-gradient(to bottom, transparent, rgba(78,205,196,0.35), rgba(78,205,196,0.55), rgba(78,205,196,0.35), transparent)',
              boxShadow: '0 0 10px rgba(78,205,196,0.3)',
              zIndex: 5, pointerEvents: 'none',
            }} />
            <div className="scan-h1" style={{
              position: 'absolute', left: 0, right: 0, height: 1,
              background: 'linear-gradient(to right, transparent, rgba(245,165,42,0.25), rgba(245,165,42,0.4), rgba(245,165,42,0.25), transparent)',
              zIndex: 5, pointerEvents: 'none',
            }} />
          </>
        )}

        {/* ── SVG graph ──────────────────────────────────────────────────── */}
        <svg
          viewBox="0 0 100 82"
          style={{ width: '100%', height: '100%', display: 'block' }}
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {['#F5A52A','#4ECDC4','#4A8FE8','#D4256A','#9B6FD4'].map(c => (
              <filter key={c} id={`gf-${c.slice(1)}`} x="-80%" y="-80%" width="260%" height="260%">
                <feGaussianBlur stdDeviation="2.2" result="b1" />
                <feGaussianBlur stdDeviation="0.8" result="b2" />
                <feMerge>
                  <feMergeNode in="b1" />
                  <feMergeNode in="b2" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            ))}
            <filter id="gf-soft" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="0.7" result="b" />
              <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

          {/* EDGES — pathLength draw-in + data packets via cx/cy animation */}
          {edgeData.map((e, i) => {
            const bothActive  = activeNodeIds.has(e.a)  && activeNodeIds.has(e.b)
            const anyRelevant = relevantNodeIds.has(e.a) || relevantNodeIds.has(e.b)
            const bothRelevant = relevantNodeIds.has(e.a) && relevantNodeIds.has(e.b)
            const color = anyRelevant ? e.na.color : 'rgba(240,235,225,0.05)'
            const delay = i * 0.022

            return (
              <g key={i}>
                {/* base edge — pathLength draw-in */}
                <motion.path
                  d={`M ${e.na.x} ${e.na.y} L ${e.nb.x} ${e.nb.y}`}
                  stroke={color}
                  strokeWidth={bothRelevant ? 0.5 : anyRelevant ? 0.3 : 0.15}
                  fill="none"
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{
                    pathLength: bothActive ? 1 : 0,
                    opacity: bothActive ? (anyRelevant ? 0.7 : 0.12) : 0,
                  }}
                  transition={{ duration: 0.55, delay, ease: 'easeOut' }}
                />

                {/* glow copy for strongly relevant edges */}
                {bothRelevant && (
                  <motion.path
                    d={`M ${e.na.x} ${e.na.y} L ${e.nb.x} ${e.nb.y}`}
                    stroke={e.na.color}
                    strokeWidth={1.2}
                    fill="none"
                    strokeLinecap="round"
                    filter={`url(#gf-${e.na.color.slice(1)})`}
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={bothActive ? {
                      pathLength: 1,
                      opacity: [0, 0.35, 0.18, 0.35],
                    } : { pathLength: 0, opacity: 0 }}
                    transition={{
                      pathLength: { duration: 0.65, delay, ease: 'easeOut' },
                      opacity: { duration: 2.2, repeat: Infinity, ease: 'easeInOut', delay: 0.65 + delay },
                    }}
                  />
                )}

                {/* data packet A→B */}
                {bothActive && anyRelevant && (
                  <motion.circle
                    r={bothRelevant ? 0.85 : 0.6}
                    fill={e.na.color}
                    style={svgScale}
                    initial={{ cx: e.na.x, cy: e.na.y, opacity: 0 }}
                    animate={{
                      cx: [e.na.x, e.nb.x, e.na.x],
                      cy: [e.na.y, e.nb.y, e.na.y],
                      opacity: [0, 1, 1, 0],
                    }}
                    transition={{
                      duration: 1.8 + (i % 4) * 0.35,
                      repeat: Infinity,
                      ease: 'linear',
                      delay: (i % 5) * 0.3,
                    }}
                  />
                )}

                {/* reverse packet B→A for bidirectional on strong edges */}
                {bothRelevant && bothActive && (
                  <motion.circle
                    r={0.6}
                    fill={e.nb.color}
                    style={svgScale}
                    initial={{ cx: e.nb.x, cy: e.nb.y, opacity: 0 }}
                    animate={{
                      cx: [e.nb.x, e.na.x, e.nb.x],
                      cy: [e.nb.y, e.na.y, e.nb.y],
                      opacity: [0, 0.75, 0.75, 0],
                    }}
                    transition={{
                      duration: 2.2 + (i % 3) * 0.4,
                      repeat: Infinity,
                      ease: 'linear',
                      delay: 0.9 + (i % 4) * 0.25,
                    }}
                  />
                )}
              </g>
            )
          })}

          {/* NODES */}
          {NODES.map(node => {
            const isActive   = activeNodeIds.has(node.id)
            const isRelevant = relevantNodeIds.has(node.id)
            const r = isRelevant ? node.r * 1.45 : node.r

            return (
              <g key={node.id}>
                {/* burst rings on activation — scale from center */}
                {isActive && [0, 1, 2].map(ring => (
                  <motion.circle
                    key={`burst-${ring}`}
                    cx={node.x} cy={node.y} r={node.r}
                    fill="none"
                    stroke={node.color}
                    strokeWidth={0.4}
                    style={svgScale}
                    initial={{ scale: 1, opacity: 0.85 }}
                    animate={{ scale: 3.5 + ring * 0.8, opacity: 0 }}
                    transition={{ duration: 0.75 + ring * 0.15, delay: ring * 0.1, ease: 'easeOut' }}
                  />
                ))}

                {/* continuous pulsing rings for relevant nodes */}
                {isRelevant && isActive && [0, 1].map(ring => (
                  <motion.circle
                    key={`pulse-${ring}`}
                    cx={node.x} cy={node.y} r={r}
                    fill="none"
                    stroke={node.color}
                    strokeWidth={0.3}
                    style={svgScale}
                    animate={{ scale: [1, 2.4 + ring * 0.5], opacity: [0.55, 0] }}
                    transition={{ duration: 1.5 + ring * 0.4, repeat: Infinity, delay: ring * 0.55, ease: 'easeOut' }}
                  />
                ))}

                {/* outer glow halo for relevant */}
                {isRelevant && isActive && (
                  <motion.circle
                    cx={node.x} cy={node.y} r={r + 2}
                    fill={`${node.color}07`}
                    stroke={`${node.color}28`}
                    strokeWidth={1.4}
                    filter={`url(#gf-${node.color.slice(1)})`}
                    style={svgScale}
                    animate={{ opacity: [0.35, 0.75, 0.35] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  />
                )}

                {/* main circle */}
                <motion.circle
                  cx={node.x} cy={node.y} r={r}
                  fill={isActive ? (isRelevant ? node.color : `${node.color}32`) : `${node.color}0F`}
                  stroke={isActive ? node.color : `${node.color}22`}
                  strokeWidth={isRelevant ? 0.65 : 0.28}
                  filter={isActive ? (isRelevant ? `url(#gf-${node.color.slice(1)})` : 'url(#gf-soft)') : undefined}
                  style={svgScale}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: isActive ? 1 : 0, opacity: isActive ? 1 : 0 }}
                  transition={{ type: 'spring', stiffness: 380, damping: 18 }}
                />

                {/* label */}
                {isActive && (isRelevant || node.r >= 5) && (
                  <motion.text
                    x={node.x} y={node.y + r + 2.6}
                    textAnchor="middle"
                    fontSize={isRelevant ? 2.5 : 1.9}
                    fill={isRelevant ? node.color : `${node.color}70`}
                    fontWeight={isRelevant ? '600' : '400'}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.25 }}
                  >
                    {node.label}
                  </motion.text>
                )}
              </g>
            )
          })}
        </svg>

        {/* ── floating left panel: doc list ─────────────────────────────── */}
        <div style={{
          position: 'absolute', top: 0, left: 0, bottom: 0, width: 208,
          background: 'linear-gradient(to right, rgba(4,2,14,0.93) 70%, transparent)',
          paddingTop: '0.75rem', display: 'flex', flexDirection: 'column',
        }}>
          <div style={{ padding: '0 1rem 0.4rem', fontSize: '0.45rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(240,235,225,0.15)' }}>
            {scannedCount}/{DOC_TITLES.length} · Documentos canónicos
          </div>
          <div style={{ overflowY: 'auto', flex: 1 }}>
            {DOC_TITLES.map((doc, i) => {
              const scanned = i < scannedCount
              const isRelevant = relevantNodeIds.has(doc.id)
              const node = nodeById(doc.id)
              return (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: scanned ? 1 : 0.15, x: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.15 }}
                  style={{
                    padding: '4px 1rem',
                    display: 'flex', alignItems: 'center', gap: '7px',
                    background: isRelevant ? `${node.color}0B` : 'transparent',
                    borderLeft: isRelevant ? `2px solid ${node.color}` : '2px solid transparent',
                  }}
                >
                  <div style={{ width: 12, height: 12, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {scanned ? (
                      isRelevant ? (
                        <motion.div
                          animate={{ opacity: [1, 0.4, 1] }}
                          transition={{ duration: 1.2, repeat: Infinity }}
                          style={{ width: 7, height: 7, borderRadius: '50%', background: node.color, boxShadow: `0 0 5px ${node.color}` }}
                        />
                      ) : (
                        <svg width="10" height="10" viewBox="0 0 10 10">
                          <polyline points="1,5 4,8 9,2" fill="none" stroke="rgba(240,235,225,0.18)" strokeWidth="1.5"/>
                        </svg>
                      )
                    ) : (
                      <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'rgba(240,235,225,0.07)' }} />
                    )}
                  </div>
                  <span style={{
                    fontSize: '0.6rem',
                    color: isRelevant ? node.color : scanned ? 'rgba(240,235,225,0.38)' : 'rgba(240,235,225,0.1)',
                    fontWeight: isRelevant ? 600 : 400,
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                  }}>
                    {doc.short}
                  </span>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* ── floating right panel: canonical facts ─────────────────────── */}
        <div style={{
          position: 'absolute', top: 0, right: 0, bottom: 0, width: 252,
          background: 'linear-gradient(to left, rgba(4,2,14,0.93) 70%, transparent)',
          padding: '0.75rem 1rem 1rem',
          display: 'flex', flexDirection: 'column', gap: '0.4rem',
        }}>
          <div style={{ fontSize: '0.45rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(240,235,225,0.15)', marginBottom: '0.1rem' }}>
            Datos canónicos · {facts.length > 0 ? `${facts.length} encontrados` : 'buscando...'}
          </div>
          {facts.length === 0 && phase !== 'complete' && (
            <div style={{ fontSize: '0.65rem', color: 'rgba(240,235,225,0.18)', fontStyle: 'italic', lineHeight: 1.5 }}>
              Buscando especificaciones visuales...
            </div>
          )}
          {facts.length === 0 && phase === 'complete' && (
            <div style={{ fontSize: '0.65rem', color: 'rgba(240,235,225,0.22)', fontStyle: 'italic', lineHeight: 1.5 }}>
              Sin especificaciones visuales directas. El asistente usará el canon general.
            </div>
          )}
          <div style={{ overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <AnimatePresence>
              {facts.map((fact, i) => {
                const node = DOC_TITLES.find(d => fact.doc.toLowerCase().includes(d.id.toLowerCase().replace('fp', 'fp ')))
                const nd = node ? nodeById(node.id) : null
                const color = nd?.color ?? '#F5A52A'
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1, duration: 0.2 }}
                    style={{
                      background: `${color}09`,
                      border: `1px solid ${color}18`,
                      borderLeft: `2px solid ${color}`,
                      borderRadius: 3,
                      padding: '5px 8px',
                    }}
                  >
                    <div style={{ fontSize: '0.45rem', letterSpacing: '0.1em', textTransform: 'uppercase', color, marginBottom: 2, opacity: 0.8 }}>
                      {fact.doc}
                    </div>
                    <div style={{ fontSize: '0.6rem', color: 'rgba(240,235,225,0.68)', lineHeight: 1.5 }}>
                      {fact.snippet}
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        </div>

        {/* complete badge */}
        <AnimatePresence>
          {phase === 'complete' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 280, damping: 22 }}
              style={{
                position: 'absolute', top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center', pointerEvents: 'none', zIndex: 8,
              }}
            >
              <div style={{
                width: 54, height: 54, borderRadius: '50%',
                background: 'rgba(78,205,196,0.1)',
                border: '1px solid rgba(78,205,196,0.4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 8px',
                boxShadow: '0 0 28px rgba(78,205,196,0.18)',
              }}>
                <span style={{ fontSize: '1.4rem', color: '#4ECDC4' }}>✓</span>
              </div>
              <div style={{ fontSize: '0.55rem', color: '#4ECDC4', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                Canon verificado
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── FOOTER ──────────────────────────────────────────────────────────── */}
      <div style={{
        flexShrink: 0, padding: '0.6rem 1.75rem',
        borderTop: '1px solid rgba(245,165,42,0.06)',
        display: 'flex', alignItems: 'center', gap: '1rem',
        background: 'rgba(4,2,14,0.75)', backdropFilter: 'blur(10px)',
        position: 'relative', zIndex: 10,
      }}>
        {/* legend */}
        <div style={{ display: 'flex', gap: '0.875rem', flexShrink: 0 }}>
          {[
            ['#F5A52A', 'Fundación'],
            ['#4ECDC4', 'Mundo'],
            ['#D4256A', 'Personajes'],
            ['#4A8FE8', 'Visual'],
            ['#9B6FD4', 'Narrativa'],
          ].map(([c, l]) => (
            <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <div style={{ width: 5, height: 5, borderRadius: '50%', background: c, boxShadow: `0 0 4px ${c}` }} />
              <span style={{ fontSize: '0.45rem', letterSpacing: '0.1em', color: 'rgba(240,235,225,0.25)', textTransform: 'uppercase' }}>{l}</span>
            </div>
          ))}
        </div>

        <div style={{ flex: 1, height: 2, background: 'rgba(240,235,225,0.05)', borderRadius: 1, overflow: 'hidden' }}>
          <motion.div
            style={{ height: '100%', borderRadius: 1, background: phase === 'complete' ? '#4ECDC4' : 'linear-gradient(to right, #F5A52A, #9B6FD4, #4ECDC4)' }}
            initial={{ width: '0%' }}
            animate={{ width: `${phase === 'complete' ? 100 : progress}%` }}
            transition={{ ease: 'linear' }}
          />
        </div>

        <div style={{ fontSize: '0.55rem', color: 'rgba(240,235,225,0.25)', flexShrink: 0, minWidth: 70, textAlign: 'right', letterSpacing: '0.06em' }}>
          {phase === 'complete' ? '— LISTO —' : `${progress}%`}
        </div>
      </div>
    </motion.div>
  )
}
