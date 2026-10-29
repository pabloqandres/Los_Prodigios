'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ─── Types ────────────────────────────────────────────────────────────────────

interface RawDoc {
  id: string
  title: string
  description: string | null
  categories: string[]
  accent_color: string
  doc_type: string
}

interface DocNode {
  id: string
  title: string
  shortLabel: string
  x: number
  y: number
  r: number
  color: string
  docType: string
  categories: string[]
  isRelevant: boolean
}

interface GraphEdge {
  aId: string; bId: string
  ax: number; ay: number; bx: number; by: number
  color: string
  strong: boolean
}

interface Fact { doc: string; snippet: string }

interface CanonVerificationOverlayProps {
  query: string
  onComplete: (canonContext: string) => void
  onSkip: () => void
}

// ─── Constants ────────────────────────────────────────────────────────────────

const GOLDEN   = 2.39996322972  // golden angle in radians
const MIN_MS   = 10_000          // minimum display time

const SVG = { w: 100, h: 82, cx: 50, cy: 40 }

const svgScale: React.CSSProperties = {
  transformBox:    'fill-box' as never,
  transformOrigin: 'center',
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function shortLabel(title: string): string {
  // Strip leading codes like "FP01 ·", "G01a —", etc.
  const clean = title.replace(/^[A-Z0-9]{2,5}\s*[·—\-]\s*/i, '')
  const words = clean.split(/\s+/)
  let label = words[0] ?? ''
  if (label.length < 7 && words[1]) label += ' ' + words[1]
  return label.slice(0, 14)
}

function buildGraph(
  docs: RawDoc[],
  relevantSet: Set<string>,
): { nodes: DocNode[]; edges: GraphEdge[] } {
  const n = docs.length
  if (n === 0) return { nodes: [], edges: [] }

  // Scale spiral tighter as N grows
  const scale = n > 30 ? 4 : n > 20 ? 5 : n > 10 ? 6.5 : n > 5 ? 8 : 10

  const nodes: DocNode[] = docs.map((doc, i) => {
    const angle  = i === 0 ? 0 : i * GOLDEN
    const radius = i === 0 ? 0 : Math.sqrt(i) * scale
    const x = Math.max(5, Math.min(95, SVG.cx + radius * Math.cos(angle)))
    const y = Math.max(5, Math.min(77, SVG.cy + radius * Math.sin(angle)))

    const isRelevant = relevantSet.has(doc.title.toLowerCase())
    const baseR = 1.7 + (i % 5) * 0.28   // deterministic: 1.7–2.8

    return {
      id:         doc.id,
      title:      doc.title,
      shortLabel: shortLabel(doc.title),
      x, y,
      r:          isRelevant ? Math.min(baseR * 2.3, 6) : baseR,
      color:      doc.accent_color || '#9B6FD4',
      docType:    doc.doc_type,
      categories: doc.categories ?? [],
      isRelevant,
    }
  })

  // Edges: category overlap → strong; same doc_type (adjacent in spiral) → weak
  const edges: GraphEdge[] = []
  const edgeCount: Record<string, number> = {}
  const MAX_E = n > 20 ? 3 : 4

  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const a = nodes[i], b = nodes[j]
      if ((edgeCount[a.id] ?? 0) >= MAX_E) continue
      if ((edgeCount[b.id] ?? 0) >= MAX_E) continue

      const sharedCats   = a.categories.filter(c => b.categories.includes(c))
      const bothRelevant = a.isRelevant && b.isRelevant
      const sameDtype    = a.docType === b.docType && j - i <= 3

      if (sharedCats.length > 0 || bothRelevant) {
        edges.push({
          aId: a.id, bId: b.id,
          ax: a.x, ay: a.y, bx: b.x, by: b.y,
          color:  a.isRelevant ? a.color : `${a.color}30`,
          strong: bothRelevant || sharedCats.length > 1,
        })
        edgeCount[a.id] = (edgeCount[a.id] ?? 0) + 1
        edgeCount[b.id] = (edgeCount[b.id] ?? 0) + 1
      } else if (sameDtype) {
        edges.push({
          aId: a.id, bId: b.id,
          ax: a.x, ay: a.y, bx: b.x, by: b.y,
          color: 'rgba(240,235,225,0.04)',
          strong: false,
        })
        edgeCount[a.id] = (edgeCount[a.id] ?? 0) + 1
        edgeCount[b.id] = (edgeCount[b.id] ?? 0) + 1
      }
    }
  }

  return { nodes, edges }
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function CanonVerificationOverlay({ query, onComplete, onSkip }: CanonVerificationOverlayProps) {
  const [nodes,        setNodes]        = useState<DocNode[]>([])
  const [edges,        setEdges]        = useState<GraphEdge[]>([])
  const [facts,        setFacts]        = useState<Fact[]>([])
  const [totalDocs,    setTotalDocs]    = useState(0)
  const [phase,        setPhase]        = useState<'loading' | 'scanning' | 'analyzing' | 'complete'>('loading')
  const [scannedCount, setScannedCount] = useState(0)
  const [activeIds,    setActiveIds]    = useState<Set<string>>(new Set())
  const [hoveredId,    setHoveredId]    = useState<string | null>(null)
  const [canonContext, setCanonContext] = useState('')
  const [apiDone,      setApiDone]      = useState(false)
  const [animDone,     setAnimDone]     = useState(false)
  const [canProceed,   setCanProceed]   = useState(false)

  const startTimeRef  = useRef(Date.now())
  const completedRef  = useRef(false)

  // ── Fetch real docs + preflight in parallel ─────────────────────────────
  useEffect(() => {
    const ctrl = new AbortController()

    Promise.all([
      fetch('/api/reference-docs', { signal: ctrl.signal }).then(r => r.json()),
      fetch('/api/canon-preflight', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ query }),
        signal:  ctrl.signal,
      }).then(r => r.json()),
    ])
      .then(([docsData, pf]) => {
        const rawDocs: RawDoc[] = Array.isArray(docsData) ? docsData : []
        setTotalDocs(rawDocs.length)

        // Build relevance set from preflight results
        const relevantSet = new Set<string>()
        if (Array.isArray(pf.relevant)) {
          for (const r of pf.relevant) relevantSet.add((r.title as string).toLowerCase())
        }
        // Also match keywords in query directly
        const q = query.toLowerCase()
        for (const d of rawDocs) {
          if (d.title.toLowerCase().split(/\s+/).some((w: string) => w.length > 3 && q.includes(w))) {
            relevantSet.add(d.title.toLowerCase())
          }
        }

        const { nodes: n, edges: e } = buildGraph(rawDocs, relevantSet)
        setNodes(n)
        setEdges(e)

        if (Array.isArray(pf.facts)) setFacts(pf.facts)
        const ctx = (pf.facts as Fact[] ?? []).map(f => `[${f.doc}] ${f.snippet}`).join('\n')
        setCanonContext(ctx)
        setApiDone(true)
        setPhase(rawDocs.length > 0 ? 'scanning' : 'complete')
      })
      .catch(() => {
        setApiDone(true)
        setPhase('complete')
      })

    return () => ctrl.abort()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── Animation: reveal nodes one by one ────────────────────────────────────
  useEffect(() => {
    if (phase !== 'scanning' || nodes.length === 0) return

    const N        = nodes.length
    const interval = Math.min(280, Math.max(55, Math.floor(5800 / N)))
    let idx = 0

    const timer = setInterval(() => {
      idx++
      setScannedCount(idx)
      const nodeId = nodes[idx - 1]?.id
      if (nodeId) setActiveIds(prev => new Set([...prev, nodeId]))

      if (idx >= N) {
        clearInterval(timer)
        setTimeout(() => setPhase('analyzing'), 450)
        setTimeout(() => setPhase('complete'),   1900)
        setTimeout(() => setAnimDone(true),       2300)
      }
    }, interval)

    return () => clearInterval(timer)
  }, [phase, nodes])

  // ── Enable "Continuar" after minimum display time ─────────────────────────
  useEffect(() => {
    if (!animDone || !apiDone) return
    const elapsed   = Date.now() - startTimeRef.current
    const remaining = Math.max(0, MIN_MS - elapsed)
    const t = setTimeout(() => setCanProceed(true), remaining)
    return () => clearTimeout(t)
  }, [animDone, apiDone])

  // ── Auto-proceed 2s after canProceed ─────────────────────────────────────
  useEffect(() => {
    if (!canProceed || completedRef.current) return
    completedRef.current = true
    setTimeout(() => onComplete(canonContext), 2000)
  }, [canProceed, canonContext, onComplete])

  // ── Empty state: no docs — skip after 3s ──────────────────────────────────
  useEffect(() => {
    if (phase === 'complete' && totalDocs === 0 && apiDone) {
      const t = setTimeout(() => { if (!completedRef.current) { completedRef.current = true; onComplete('') } }, 3000)
      return () => clearTimeout(t)
    }
  }, [phase, totalDocs, apiDone, onComplete])

  function handleContinue() {
    if (completedRef.current) return
    completedRef.current = true
    onComplete(canonContext)
  }

  const progress      = nodes.length > 0 ? Math.round((scannedCount / nodes.length) * 100) : 0
  const relevantNodes = nodes.filter(d => d.isRelevant)
  const hoveredNode   = nodes.find(d => d.id === hoveredId) ?? null

  // Unique colors for glow filters
  const uniqueColors = Array.from(new Set(nodes.map(n => n.color)))

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
        .scan-v1 { animation: scan-v 2.4s linear infinite; }
        .scan-v2 { animation: scan-v 2.4s linear infinite 1.2s; }
        .scan-h1 { animation: scan-h 3.6s linear infinite 0.8s; }
        .hdr-flicker { animation: flicker 5s ease-in-out infinite; }
      `}</style>

      {/* Dot grid */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'radial-gradient(circle, rgba(245,165,42,0.07) 1px, transparent 1px)',
        backgroundSize: '28px 28px',
      }} />
      {/* Radial glow center */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 60% 50% at 50% 46%, rgba(78,205,196,0.04) 0%, transparent 70%)',
      }} />

      {/* ── HEADER ──────────────────────────────────────────────────────────── */}
      <div style={{
        flexShrink: 0, padding: '0.9rem 1.75rem',
        borderBottom: '1px solid rgba(245,165,42,0.08)',
        display: 'flex', alignItems: 'center', gap: '1rem',
        background: 'rgba(4,2,14,0.8)', backdropFilter: 'blur(10px)',
        position: 'relative', zIndex: 10,
      }}>
        <div style={{ width: 10, height: 10, borderRadius: '50%', flexShrink: 0,
          background: phase === 'complete' ? '#4ECDC4' : '#F5A52A',
          boxShadow: `0 0 10px ${phase === 'complete' ? '#4ECDC4' : '#F5A52A'}`,
          animation: phase !== 'complete' ? 'pulse-dot 1s ease-in-out infinite' : 'none',
        }} />
        <div>
          <div style={{ fontSize: '0.45rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(240,235,225,0.2)', marginBottom: 3 }}>
            NUPPA · Motor de Verificación Canónica
          </div>
          <div className="hdr-flicker" style={{ fontSize: '0.875rem', color: '#F0EBE1', fontWeight: 600 }}>
            {phase === 'loading'   && 'Cargando biblioteca canónica...'}
            {phase === 'scanning'  && `Escaneando ${scannedCount} / ${nodes.length} documentos...`}
            {phase === 'analyzing' && 'Estableciendo conexiones canónicas...'}
            {phase === 'complete'  && totalDocs === 0 && 'Biblioteca vacía — sube documentos para activar el canon'}
            {phase === 'complete'  && totalDocs > 0  && `✓ ${facts.length} datos canónicos · ${relevantNodes.length} docs relevantes`}
          </div>
        </div>
        <div style={{ flex: 1 }} />
        <div style={{
          fontSize: '0.6rem', color: 'rgba(240,235,225,0.3)',
          background: 'rgba(245,165,42,0.05)', border: '1px solid rgba(245,165,42,0.1)',
          borderRadius: 20, padding: '3px 12px',
          maxWidth: 280, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          "{query.slice(0, 55)}{query.length > 55 ? '…' : ''}"
        </div>

        {/* Action button */}
        {phase === 'complete' && canProceed ? (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={handleContinue}
            style={{
              background: '#4ECDC4', border: 'none', borderRadius: 4,
              color: '#04020E', cursor: 'pointer', fontSize: '0.7rem',
              padding: '6px 16px', fontFamily: 'IBM Plex Sans, sans-serif',
              fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase',
              flexShrink: 0,
            }}
          >
            Continuar →
          </motion.button>
        ) : (
          <button onClick={onSkip} style={{
            background: 'none', border: 'none', color: 'rgba(240,235,225,0.2)',
            cursor: 'pointer', fontSize: '0.7rem', padding: '4px 8px',
            fontFamily: 'inherit', letterSpacing: '0.05em', flexShrink: 0,
          }}>
            Omitir →
          </button>
        )}
      </div>

      {/* ── BODY ────────────────────────────────────────────────────────────── */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>

        {/* Scan beams */}
        {phase === 'scanning' && nodes.length > 0 && (
          <>
            <div className="scan-v1" style={{
              position: 'absolute', top: 0, bottom: 0, width: 2, zIndex: 5, pointerEvents: 'none',
              background: 'linear-gradient(to bottom, transparent, rgba(245,165,42,0.5), rgba(245,165,42,0.85), rgba(245,165,42,0.5), transparent)',
              boxShadow: '0 0 14px rgba(245,165,42,0.45)',
            }} />
            <div className="scan-v2" style={{
              position: 'absolute', top: 0, bottom: 0, width: 1, zIndex: 5, pointerEvents: 'none',
              background: 'linear-gradient(to bottom, transparent, rgba(78,205,196,0.35), rgba(78,205,196,0.55), rgba(78,205,196,0.35), transparent)',
              boxShadow: '0 0 10px rgba(78,205,196,0.3)',
            }} />
            <div className="scan-h1" style={{
              position: 'absolute', left: 0, right: 0, height: 1, zIndex: 5, pointerEvents: 'none',
              background: 'linear-gradient(to right, transparent, rgba(245,165,42,0.25), rgba(245,165,42,0.4), rgba(245,165,42,0.25), transparent)',
            }} />
          </>
        )}

        {/* Empty state */}
        {phase !== 'loading' && totalDocs === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              position: 'absolute', inset: 0,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              gap: '1rem', zIndex: 5,
            }}
          >
            <div style={{ fontSize: '2.5rem', opacity: 0.15 }}>📂</div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.875rem', color: 'rgba(240,235,225,0.35)', marginBottom: 6 }}>
                No hay documentos cargados en la biblioteca canónica
              </div>
              <div style={{ fontSize: '0.7rem', color: 'rgba(240,235,225,0.18)', lineHeight: 1.6 }}>
                Sube los documentos de la biblia en{' '}
                <span style={{ color: 'rgba(245,165,42,0.5)' }}>Biblioteca</span>{' '}
                para que NUPPA pueda verificar el canon
              </div>
            </div>
          </motion.div>
        )}

        {/* SVG Graph */}
        {nodes.length > 0 && (
          <svg
            viewBox={`0 0 ${SVG.w} ${SVG.h}`}
            style={{ width: '100%', height: '100%', display: 'block' }}
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              {uniqueColors.map(c => (
                <filter key={c} id={`gf-${c.replace('#', '')}`} x="-80%" y="-80%" width="260%" height="260%">
                  <feGaussianBlur stdDeviation="1.8" result="b1" />
                  <feGaussianBlur stdDeviation="0.6" result="b2" />
                  <feMerge>
                    <feMergeNode in="b1" />
                    <feMergeNode in="b2" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              ))}
              <filter id="gf-soft" x="-40%" y="-40%" width="180%" height="180%">
                <feGaussianBlur stdDeviation="0.55" result="b" />
                <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>

            {/* EDGES */}
            {edges.map((e, i) => {
              const aActive = activeIds.has(e.aId)
              const bActive = activeIds.has(e.bId)
              const visible = aActive && bActive
              return (
                <g key={i}>
                  <motion.line
                    x1={e.ax} y1={e.ay} x2={e.bx} y2={e.by}
                    stroke={e.color}
                    strokeWidth={e.strong ? 0.4 : 0.15}
                    strokeLinecap="round"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: visible ? (e.strong ? 0.8 : 0.18) : 0 }}
                    transition={{ duration: 0.35, delay: i * 0.012 }}
                  />
                  {/* Data packet on strong/relevant edges */}
                  {visible && e.strong && (
                    <motion.circle
                      r={0.65}
                      fill={e.color}
                      style={svgScale}
                      initial={{ cx: e.ax, cy: e.ay, opacity: 0 }}
                      animate={{
                        cx: [e.ax, e.bx, e.ax],
                        cy: [e.ay, e.by, e.ay],
                        opacity: [0, 0.95, 0.95, 0],
                      }}
                      transition={{
                        duration: 1.8 + (i % 5) * 0.35,
                        repeat: Infinity, ease: 'linear',
                        delay: (i % 7) * 0.22,
                      }}
                    />
                  )}
                </g>
              )
            })}

            {/* NODES */}
            {nodes.map((node) => {
              const isActive   = activeIds.has(node.id)
              const isRelevant = node.isRelevant
              const isHovered  = hoveredId === node.id
              const colorId    = node.color.replace('#', '')

              return (
                <g
                  key={node.id}
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={() => setHoveredId(node.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  {/* Activation burst rings */}
                  {isActive && [0, 1].map(ring => (
                    <motion.circle
                      key={`burst-${ring}`}
                      cx={node.x} cy={node.y} r={node.r}
                      fill="none" stroke={node.color} strokeWidth={0.32}
                      style={svgScale}
                      initial={{ scale: 1, opacity: 0.85 }}
                      animate={{ scale: 3.2 + ring * 0.7, opacity: 0 }}
                      transition={{ duration: 0.65 + ring * 0.12, delay: ring * 0.09, ease: 'easeOut' }}
                    />
                  ))}

                  {/* Continuous pulse for relevant nodes */}
                  {isActive && isRelevant && [0, 1].map(ring => (
                    <motion.circle
                      key={`pulse-${ring}`}
                      cx={node.x} cy={node.y} r={node.r}
                      fill="none" stroke={node.color} strokeWidth={0.26}
                      style={svgScale}
                      animate={{ scale: [1, 2.8 + ring * 0.5], opacity: [0.6, 0] }}
                      transition={{ duration: 1.6 + ring * 0.45, repeat: Infinity, delay: ring * 0.65, ease: 'easeOut' }}
                    />
                  ))}

                  {/* Hover ring */}
                  {isActive && isHovered && (
                    <motion.circle
                      cx={node.x} cy={node.y} r={node.r + 1.8}
                      fill="none" stroke={node.color} strokeWidth={0.35}
                      style={svgScale}
                      animate={{ opacity: [0.5, 0.8, 0.5] }}
                      transition={{ duration: 1.2, repeat: Infinity }}
                    />
                  )}

                  {/* Outer glow halo for relevant */}
                  {isActive && isRelevant && (
                    <motion.circle
                      cx={node.x} cy={node.y} r={node.r + 2.2}
                      fill={`${node.color}06`}
                      stroke={`${node.color}22`}
                      strokeWidth={1.2}
                      filter={`url(#gf-${colorId})`}
                      style={svgScale}
                      animate={{ opacity: [0.3, 0.7, 0.3] }}
                      transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                    />
                  )}

                  {/* Main circle */}
                  <motion.circle
                    cx={node.x} cy={node.y} r={node.r}
                    fill={isActive
                      ? (isRelevant ? node.color : `${node.color}26`)
                      : `${node.color}0A`}
                    stroke={isActive ? node.color : `${node.color}16`}
                    strokeWidth={isRelevant ? 0.5 : 0.2}
                    filter={isActive
                      ? (isRelevant ? `url(#gf-${colorId})` : 'url(#gf-soft)')
                      : undefined}
                    style={svgScale}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: isActive ? 1 : 0, opacity: isActive ? 1 : 0 }}
                    transition={{ type: 'spring', stiffness: 380, damping: 18 }}
                  />

                  {/* Label — always show for relevant or hovered, show for large nodes */}
                  {isActive && (isRelevant || isHovered || node.r >= 4.5) && (
                    <motion.text
                      x={node.x} y={node.y + node.r + 2.5}
                      textAnchor="middle"
                      fontSize={isRelevant ? 2.3 : 1.75}
                      fill={isRelevant || isHovered ? node.color : `${node.color}65`}
                      fontWeight={isRelevant ? '600' : '400'}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      {node.shortLabel}
                    </motion.text>
                  )}
                </g>
              )
            })}
          </svg>
        )}

        {/* ── Right panel: canonical facts ──────────────────────────────────── */}
        <div style={{
          position: 'absolute', top: 0, right: 0, bottom: 0, width: 256,
          background: 'linear-gradient(to left, rgba(4,2,14,0.96) 72%, transparent)',
          padding: '0.75rem 1rem 1rem',
          display: 'flex', flexDirection: 'column', gap: '0.4rem',
          zIndex: 6, pointerEvents: 'none',
        }}>
          <div style={{ fontSize: '0.45rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(240,235,225,0.15)', marginBottom: 2 }}>
            Datos canónicos ·{' '}
            {facts.length > 0
              ? `${facts.length} encontrados`
              : phase !== 'complete' ? 'buscando...' : 'ninguno encontrado'}
          </div>
          {facts.length === 0 && phase === 'complete' && totalDocs > 0 && (
            <div style={{ fontSize: '0.62rem', color: 'rgba(240,235,225,0.2)', fontStyle: 'italic', lineHeight: 1.6 }}>
              Sin especificaciones visuales directas en el canon.<br />NUPPA usará criterio general.
            </div>
          )}
          <div style={{ overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.4rem', pointerEvents: 'auto' }}>
            <AnimatePresence>
              {facts.map((fact, i) => {
                const matchNode = nodes.find(n =>
                  n.title.toLowerCase().includes(fact.doc.toLowerCase().slice(0, 10)) ||
                  fact.doc.toLowerCase().includes(n.title.toLowerCase().slice(0, 10))
                )
                const color = matchNode?.color ?? '#F5A52A'
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1, duration: 0.2 }}
                    style={{
                      background: `${color}08`,
                      border: `1px solid ${color}16`,
                      borderLeft: `2px solid ${color}`,
                      borderRadius: 3, padding: '5px 8px',
                    }}
                  >
                    <div style={{ fontSize: '0.45rem', letterSpacing: '0.1em', textTransform: 'uppercase', color, marginBottom: 2, opacity: 0.85 }}>
                      {fact.doc}
                    </div>
                    <div style={{ fontSize: '0.6rem', color: 'rgba(240,235,225,0.65)', lineHeight: 1.5 }}>
                      {fact.snippet}
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        </div>

        {/* ── Hover tooltip ─────────────────────────────────────────────────── */}
        <AnimatePresence>
          {hoveredNode && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'absolute', bottom: '1rem',
                left: '50%', transform: 'translateX(-50%)',
                background: 'rgba(13,9,32,0.97)',
                border: `1px solid ${hoveredNode.color}28`,
                borderLeft: `3px solid ${hoveredNode.color}`,
                borderRadius: 4, padding: '7px 14px',
                pointerEvents: 'none', zIndex: 20,
                minWidth: 180, maxWidth: 320,
              }}
            >
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: hoveredNode.color, marginBottom: 3 }}>
                {hoveredNode.title}
              </div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.5rem', color: 'rgba(240,235,225,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  {hoveredNode.docType}
                </span>
                {hoveredNode.categories.slice(0, 3).map(c => (
                  <span key={c} style={{
                    fontSize: '0.5rem', color: hoveredNode.color, opacity: 0.7,
                    letterSpacing: '0.08em', textTransform: 'uppercase',
                  }}>
                    {c}
                  </span>
                ))}
                {hoveredNode.isRelevant && (
                  <span style={{ fontSize: '0.5rem', color: '#4ECDC4', fontWeight: 700, letterSpacing: '0.08em' }}>
                    ✓ RELEVANTE
                  </span>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Complete badge */}
        <AnimatePresence>
          {phase === 'complete' && totalDocs > 0 && (
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
                width: 52, height: 52, borderRadius: '50%',
                background: 'rgba(78,205,196,0.08)',
                border: '1px solid rgba(78,205,196,0.4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 8px',
                boxShadow: '0 0 28px rgba(78,205,196,0.15)',
              }}>
                <span style={{ fontSize: '1.3rem', color: '#4ECDC4' }}>✓</span>
              </div>
              <div style={{ fontSize: '0.5rem', color: '#4ECDC4', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
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
        background: 'rgba(4,2,14,0.8)', backdropFilter: 'blur(10px)',
        position: 'relative', zIndex: 10,
      }}>
        <div style={{ fontSize: '0.5rem', color: 'rgba(240,235,225,0.18)', letterSpacing: '0.08em', flexShrink: 0 }}>
          {totalDocs} docs · {edges.length} conexiones · {relevantNodes.length} relevantes
        </div>

        <div style={{ flex: 1, height: 2, background: 'rgba(240,235,225,0.05)', borderRadius: 1, overflow: 'hidden' }}>
          <motion.div
            style={{
              height: '100%', borderRadius: 1,
              background: phase === 'complete'
                ? '#4ECDC4'
                : 'linear-gradient(to right, #F5A52A, #9B6FD4, #4ECDC4)',
            }}
            initial={{ width: '0%' }}
            animate={{ width: `${phase === 'complete' ? 100 : progress}%` }}
            transition={{ ease: 'linear' }}
          />
        </div>

        <div style={{ fontSize: '0.55rem', color: 'rgba(240,235,225,0.22)', flexShrink: 0, minWidth: 60, textAlign: 'right', letterSpacing: '0.06em' }}>
          {phase === 'complete' ? '— LISTO —' : `${progress}%`}
        </div>
      </div>
    </motion.div>
  )
}
