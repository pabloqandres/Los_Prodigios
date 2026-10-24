'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

interface GraphNode {
  id: string
  type: 'episode' | 'dimension' | 'finding'
  label: string
  sub: string
  color: string
  r: number
  x: number; y: number; z: number
  // full data for panel
  data?: Record<string, unknown>
}
interface GraphLink { s: string; t: string; color: string; w: number }

const DIM_COLORS: Record<string, string> = {
  narrativa:   '#FF6B35',
  personajes:  '#4ECDC4',
  visual:      '#DFF818',
  actuacion:   '#9B6FD4',
  audiencia:   '#FFE66D',
  franquicia:  '#D4256A',
}
const PRIORITY_COLORS: Record<string, string> = {
  alta:  '#D4256A',
  media: '#F5A52A',
  baja:  '#88D8B0',
}

export interface NuppaGraphAnalysis {
  overall_score: number
  verdict?: string
  scores_snapshot?: Array<{
    key: string; label: string; score: number; strength?: string; weakness?: string
    findings?: Array<{ title: string; priority: string; scene_ref?: string; problem_description?: string; improvement_goal?: string; evidence?: string }>
  }>
  categories?: Array<{
    key: string; label: string; score: number; strength?: string; weakness?: string
    findings?: Array<{ title: string; priority: string; scene_ref?: string; problem_description?: string; improvement_goal?: string; evidence?: string }>
  }>
}

interface Props {
  analysis: NuppaGraphAnalysis
  episodeLabel?: string
}

interface PanelData {
  type: 'episode' | 'dimension' | 'finding'
  title: string
  color: string
  score?: number
  strength?: string
  weakness?: string
  scene_ref?: string
  evidence?: string
  problem?: string
  goal?: string
  priority?: string
  verdict?: string
}

export default function NuppaGraph({ analysis, episodeLabel }: Props) {
  const canvasRef  = useRef<HTMLCanvasElement>(null)
  const animRef    = useRef<number | undefined>(undefined)
  const rotRef     = useRef(0)
  const tRef       = useRef(0)
  const lastRef    = useRef<number | null>(null)
  const isDragging = useRef(false)
  const lastMouse  = useRef({ x: 0, y: 0 })
  const isHovering = useRef(false)
  const nodesRef   = useRef<GraphNode[]>([])
  const linksRef   = useRef<GraphLink[]>([])
  const hoveredRef = useRef<string | null>(null)

  const [panel, setPanel] = useState<PanelData | null>(null)

  // ── Build graph data ────────────────────────────────────────────────────
  useEffect(() => {
    const dims = analysis.scores_snapshot ?? analysis.categories ?? []
    const nodes: GraphNode[] = []
    const links: GraphLink[] = []

    nodes.push({
      id: 'episode', type: 'episode',
      label: episodeLabel ?? 'Episodio',
      sub: `${analysis.overall_score.toFixed(1)} / 5`,
      color: '#DFF818', r: 22, x: 0, y: 0, z: 0,
      data: { verdict: analysis.verdict, score: analysis.overall_score },
    })

    dims.forEach((dim, i) => {
      const angle = (i / dims.length) * Math.PI * 2 - Math.PI / 2
      const dist  = 130
      const color = DIM_COLORS[dim.key] ?? '#AAAAAA'
      const nid   = 'dim_' + dim.key
      nodes.push({
        id: nid, type: 'dimension',
        label: dim.label, sub: `${dim.score}/5`, color,
        r: 9 + (dim.score / 5) * 9,
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist * 0.45,
        z: Math.sin(angle) * dist,
        data: { score: dim.score, strength: dim.strength, weakness: dim.weakness, label: dim.label },
      })
      links.push({ s: 'episode', t: nid, color: color + '55', w: 1.5 })

      ;(dim.findings ?? []).forEach((f, fi) => {
        const count = dim.findings?.length ?? 1
        const fa  = angle + (fi - (count - 1) / 2) * 0.5
        const fd  = 220
        const fc  = PRIORITY_COLORS[f.priority] ?? '#AAAAAA'
        const fid = `f_${dim.key}_${fi}`
        nodes.push({
          id: fid, type: 'finding',
          label: f.title.length > 30 ? f.title.substring(0, 30) + '…' : f.title,
          sub: f.priority, color: fc, r: 5.5,
          x: Math.cos(fa) * fd,
          y: Math.sin(fa) * fd * 0.45 + (fi - 0.5) * 55,
          z: Math.sin(fa) * fd,
          data: { title: f.title, priority: f.priority, scene_ref: f.scene_ref, evidence: f.evidence, problem: f.problem_description, goal: f.improvement_goal, dimLabel: dim.label, color: fc },
        })
        links.push({ s: nid, t: fid, color: fc + '44', w: 1 })
      })
    })

    nodesRef.current = nodes
    linksRef.current = links
  }, [analysis, episodeLabel])

  // ── Canvas render ───────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
    if (!ctx) return

    const img = new Image()
    img.src = '/nuppita.png'

    const resize = () => {
      const c = canvasRef.current; if (!c) return
      const dpr = window.devicePixelRatio || 1
      c.width  = c.offsetWidth  * dpr
      c.height = c.offsetHeight * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    function project(x: number, y: number, z: number): [number, number, number] {
      const c = canvasRef.current!
      const rot = rotRef.current
      const cr = Math.cos(rot), sr = Math.sin(rot)
      const rx = x * cr + z * sr
      const ry = y
      const rz = -x * sr + z * cr
      const fov = 750
      const sc  = fov / (fov + rz)
      return [c.offsetWidth / 2 + rx * sc, c.offsetHeight / 2 + ry * sc, sc]
    }

    function draw(ts: number) {
      const c = canvasRef.current; if (!c) return
      if (!lastRef.current) lastRef.current = ts
      const dt = Math.min((ts - lastRef.current) / 1000, 0.05)
      lastRef.current = ts
      tRef.current += dt

      // Auto-rotate only when not hovering/dragging
      if (!isHovering.current && !isDragging.current) {
        rotRef.current += 0.0004
      }

      const t = tRef.current
      const W = c.offsetWidth
      const H = c.offsetHeight
      ctx.clearRect(0, 0, W, H)

      const nodes = nodesRef.current
      const links = linksRef.current

      const proj = nodes.map(n => {
        const [sx, sy, sc] = project(n.x, n.y, n.z)
        return { n, sx, sy, sc }
      }).sort((a, b) => a.sc - b.sc)

      // ── Hologram ────────────────────────────────────────────────────
      if (img.complete && img.naturalWidth > 0) {
        const flicker = 0.38 + Math.sin(t * 0.3) * 0.04 +
          (Math.sin(t * 17) > 0.96 ? -0.18 : 0)
        ctx.save()
        ctx.globalAlpha = Math.max(0, flicker)
        ctx.globalCompositeOperation = 'screen'

        const iw = Math.min(W * 0.35, 300)
        const ih = (img.naturalHeight / img.naturalWidth) * iw
        const ix = W / 2 - iw / 2
        const iy = H / 2 - ih * 0.52

        const tmp = document.createElement('canvas')
        const dpr = window.devicePixelRatio || 1
        tmp.width = c.width; tmp.height = c.height
        const tc = tmp.getContext('2d')!
        tc.scale(dpr, dpr)
        tc.filter = 'brightness(1.3) saturate(3) hue-rotate(175deg) brightness(1.8)'
        tc.drawImage(img, ix, iy, iw, ih)
        tc.globalCompositeOperation = 'destination-in'
        const g = tc.createRadialGradient(W/2, H/2 - ih * 0.05, 0, W/2, H/2 - ih * 0.05, iw * 0.52)
        g.addColorStop(0.3,  'rgba(0,0,0,1)')
        g.addColorStop(0.65, 'rgba(0,0,0,0.7)')
        g.addColorStop(0.85, 'rgba(0,0,0,0.15)')
        g.addColorStop(1,    'rgba(0,0,0,0)')
        tc.fillStyle = g; tc.fillRect(0, 0, W, H)
        ctx.filter = 'none'
        ctx.drawImage(tmp, 0, 0, c.width, c.height, 0, 0, W, H)
        ctx.restore()
      }

      // ── Links ────────────────────────────────────────────────────────
      links.forEach(lk => {
        const src = proj.find(p => p.n.id === lk.s)
        const tgt = proj.find(p => p.n.id === lk.t)
        if (!src || !tgt) return
        ctx.beginPath(); ctx.moveTo(src.sx, src.sy); ctx.lineTo(tgt.sx, tgt.sy)
        ctx.strokeStyle = lk.color; ctx.lineWidth = lk.w; ctx.stroke()
        const pct = (Math.sin(t * 1.5 + lk.s.charCodeAt(0) * 0.3) + 1) / 2
        const px = src.sx + (tgt.sx - src.sx) * pct
        const py = src.sy + (tgt.sy - src.sy) * pct
        ctx.shadowColor = lk.color.substring(0, 7); ctx.shadowBlur = 6
        ctx.beginPath(); ctx.arc(px, py, 2.5, 0, Math.PI * 2)
        ctx.fillStyle = lk.color.substring(0, 7) + 'EE'; ctx.fill()
        ctx.shadowBlur = 0
      })

      // ── Nodes ────────────────────────────────────────────────────────
      proj.forEach(({ n, sx, sy, sc }) => {
        const r      = n.r * sc
        const pulse  = n.type === 'episode' ? 1 + Math.sin(t * 2.5) * 0.07 : 1
        const hov    = hoveredRef.current === n.id
        const appear = Math.min(1, Math.max(0, (t - 0.8) / 0.8))
        ctx.globalAlpha = appear

        if (n.type === 'episode') {
          ctx.shadowColor = '#DFF818'; ctx.shadowBlur = hov ? 40 : 28
          ctx.beginPath(); ctx.arc(sx, sy, r * pulse * 1.4, 0, Math.PI * 2)
          ctx.strokeStyle = 'rgba(223,248,24,0.12)'; ctx.lineWidth = 1; ctx.stroke()
          ctx.shadowBlur = 0
          const g = ctx.createRadialGradient(sx - r*.3, sy - r*.3, 0, sx, sy, r * pulse)
          g.addColorStop(0, '#FFFFFF'); g.addColorStop(.5, '#DFF818'); g.addColorStop(1, 'rgba(223,248,24,.5)')
          ctx.shadowColor = '#DFF818'; ctx.shadowBlur = hov ? 35 : 22
          ctx.beginPath(); ctx.arc(sx, sy, r * pulse, 0, Math.PI * 2)
          ctx.fillStyle = g; ctx.fill(); ctx.shadowBlur = 0
          ctx.font = `700 ${10 * sc}px IBM Plex Sans, system-ui`
          ctx.fillStyle = '#060608'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
          ctx.fillText(n.label, sx, sy - 2 * sc)
          ctx.font = `400 ${8 * sc}px IBM Plex Sans, system-ui`
          ctx.fillText(n.sub, sx, sy + 8 * sc)

        } else if (n.type === 'dimension') {
          ctx.shadowColor = n.color; ctx.shadowBlur = hov ? 28 : 16
          ctx.beginPath(); ctx.arc(sx, sy, r * (hov ? 1.12 : 1), 0, Math.PI * 2)
          ctx.fillStyle = n.color + (hov ? 'EE' : 'CC'); ctx.fill(); ctx.shadowBlur = 0
          if (sc > 0.5) {
            ctx.font = `600 ${8.5 * sc}px IBM Plex Sans, system-ui`
            ctx.fillStyle = 'rgba(240,235,225,0.9)'; ctx.textAlign = 'center'; ctx.textBaseline = 'top'
            ctx.fillText(n.label, sx, sy + r + 5 * sc)
            ctx.font = `400 ${7 * sc}px IBM Plex Sans, system-ui`
            ctx.fillStyle = n.color; ctx.fillText(n.sub, sx, sy + r + 15 * sc)
          }

        } else {
          ctx.shadowColor = n.color; ctx.shadowBlur = hov ? 16 : 9
          ctx.beginPath(); ctx.arc(sx, sy, r * (hov ? 1.3 : 1), 0, Math.PI * 2)
          ctx.fillStyle = n.color + (hov ? 'EE' : 'BB'); ctx.fill(); ctx.shadowBlur = 0
          if (sc > 0.65) {
            ctx.font = `500 ${7 * sc}px IBM Plex Sans, system-ui`
            ctx.fillStyle = hov ? 'rgba(240,235,225,0.9)' : 'rgba(240,235,225,0.6)'
            ctx.textAlign = 'center'; ctx.textBaseline = 'top'
            ctx.fillText(n.label, sx, sy + r + 4 * sc)
          }
        }
        ctx.globalAlpha = 1
      })

      animRef.current = requestAnimationFrame(draw)
    }

    animRef.current = requestAnimationFrame(draw)
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current)
      ro.disconnect()
    }
  }, [analysis, episodeLabel])

  // ── Hit test ─────────────────────────────────────────────────────────────
  const hitTest = useCallback((mx: number, my: number): string | null => {
    const canvas = canvasRef.current; if (!canvas) return null
    const rot = rotRef.current
    let found: string | null = null
    for (const n of nodesRef.current) {
      const cr = Math.cos(rot), sr = Math.sin(rot)
      const rx = n.x * cr + n.z * sr
      const ry = n.y
      const rz = -n.x * sr + n.z * cr
      const fov = 750, sc = fov / (fov + rz)
      const sx = canvas.offsetWidth / 2 + rx * sc
      const sy = canvas.offsetHeight / 2 + ry * sc
      const r  = n.r * sc + 6
      if (Math.hypot(mx - sx, my - sy) < r) { found = n.id; break }
    }
    return found
  }, [])

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect()
    const mx = e.clientX - rect.left
    const my = e.clientY - rect.top
    if (isDragging.current) {
      const dx = e.clientX - lastMouse.current.x
      rotRef.current += dx * 0.005
      lastMouse.current = { x: e.clientX, y: e.clientY }
      return
    }
    hoveredRef.current = hitTest(mx, my)
    if (canvasRef.current) canvasRef.current.style.cursor = hoveredRef.current ? 'pointer' : 'default'
  }, [hitTest])

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    isDragging.current = true
    lastMouse.current  = { x: e.clientX, y: e.clientY }
  }, [])

  const handleMouseUp = useCallback(() => { isDragging.current = false }, [])

  const handleClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect()
    const hit  = hitTest(e.clientX - rect.left, e.clientY - rect.top)
    if (!hit) { setPanel(null); return }
    const node = nodesRef.current.find(n => n.id === hit)
    if (!node) return

    if (node.type === 'episode') {
      const d = node.data as { verdict?: string; score: number }
      setPanel({ type: 'episode', title: node.label, color: '#DFF818', score: d.score, verdict: d.verdict })
    } else if (node.type === 'dimension') {
      const d = node.data as { score: number; strength?: string; weakness?: string; label: string }
      setPanel({ type: 'dimension', title: d.label, color: node.color, score: d.score, strength: d.strength, weakness: d.weakness })
    } else {
      const d = node.data as { title: string; priority: string; scene_ref?: string; evidence?: string; problem?: string; goal?: string; color: string }
      setPanel({ type: 'finding', title: d.title, color: d.color, priority: d.priority, scene_ref: d.scene_ref, evidence: d.evidence, problem: d.problem, goal: d.goal })
    }
  }, [hitTest])

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <canvas
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => { isDragging.current = false; hoveredRef.current = null; isHovering.current = false }}
        onMouseEnter={() => { isHovering.current = true }}
        onClick={handleClick}
        style={{ width: '100%', height: '100%', display: 'block' }}
      />

      {/* ── Detail panel ─────────────────────────────────────────── */}
      {panel && (
        <div style={{
          position: 'absolute', top: 50, right: 16, width: 260,
          background: 'rgba(8,8,14,0.92)', border: `1px solid ${panel.color}30`,
          borderRadius: 6, padding: '14px 16px',
          backdropFilter: 'blur(12px)',
          boxShadow: `0 0 24px ${panel.color}20`,
          zIndex: 20,
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: panel.color, flexShrink: 0, boxShadow: `0 0 6px ${panel.color}` }} />
              <div style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.12em', color: panel.color, textTransform: 'uppercase' }}>
                {panel.type === 'episode' ? 'Episodio' : panel.type === 'dimension' ? 'Dimensión' : 'Hallazgo'}
              </div>
            </div>
            <button onClick={() => setPanel(null)} style={{ background: 'none', border: 'none', color: 'rgba(240,235,225,0.3)', cursor: 'pointer', fontSize: '1rem', lineHeight: 1, padding: 0 }}>×</button>
          </div>

          <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'rgba(240,235,225,0.9)', lineHeight: 1.3, marginBottom: 10 }}>
            {panel.title}
          </div>

          {panel.score !== undefined && (
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 10 }}>
              <span style={{ fontSize: '1.8rem', fontWeight: 900, fontFamily: 'Bebas Neue, Impact, sans-serif', color: panel.color, lineHeight: 1 }}>{panel.score.toFixed(1)}</span>
              <span style={{ fontSize: '0.65rem', color: 'rgba(240,235,225,0.3)' }}>/ 5</span>
            </div>
          )}

          {panel.priority && (
            <div style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.1em', color: panel.color, textTransform: 'uppercase', marginBottom: 8 }}>
              Prioridad {panel.priority}
            </div>
          )}

          {panel.scene_ref && (
            <div style={{ fontSize: '0.65rem', color: 'rgba(240,235,225,0.4)', marginBottom: 8 }}>Escena: {panel.scene_ref}</div>
          )}

          {panel.verdict && (
            <div style={{ fontSize: '0.68rem', color: 'rgba(240,235,225,0.55)', lineHeight: 1.6, marginBottom: 8 }}>{panel.verdict}</div>
          )}

          {panel.strength && (
            <div style={{ marginBottom: 8 }}>
              <div style={{ fontSize: '0.55rem', fontWeight: 700, letterSpacing: '0.12em', color: 'rgba(88,216,176,0.7)', textTransform: 'uppercase', marginBottom: 3 }}>Fortaleza</div>
              <div style={{ fontSize: '0.67rem', color: 'rgba(240,235,225,0.6)', lineHeight: 1.5 }}>{panel.strength}</div>
            </div>
          )}

          {panel.weakness && (
            <div style={{ marginBottom: 8 }}>
              <div style={{ fontSize: '0.55rem', fontWeight: 700, letterSpacing: '0.12em', color: 'rgba(212,37,106,0.7)', textTransform: 'uppercase', marginBottom: 3 }}>Problema</div>
              <div style={{ fontSize: '0.67rem', color: 'rgba(240,235,225,0.6)', lineHeight: 1.5 }}>{panel.weakness}</div>
            </div>
          )}

          {panel.evidence && (
            <div style={{ marginBottom: 8 }}>
              <div style={{ fontSize: '0.55rem', fontWeight: 700, letterSpacing: '0.12em', color: 'rgba(240,235,225,0.35)', textTransform: 'uppercase', marginBottom: 3 }}>Evidencia</div>
              <div style={{ fontSize: '0.65rem', color: 'rgba(240,235,225,0.5)', lineHeight: 1.5, fontStyle: 'italic' }}>{panel.evidence}</div>
            </div>
          )}

          {panel.problem && (
            <div style={{ marginBottom: 8 }}>
              <div style={{ fontSize: '0.55rem', fontWeight: 700, letterSpacing: '0.12em', color: 'rgba(212,37,106,0.7)', textTransform: 'uppercase', marginBottom: 3 }}>Problema</div>
              <div style={{ fontSize: '0.67rem', color: 'rgba(240,235,225,0.6)', lineHeight: 1.5 }}>{panel.problem}</div>
            </div>
          )}

          {panel.goal && (
            <div>
              <div style={{ fontSize: '0.55rem', fontWeight: 700, letterSpacing: '0.12em', color: 'rgba(223,248,24,0.6)', textTransform: 'uppercase', marginBottom: 3 }}>Objetivo de revisión</div>
              <div style={{ fontSize: '0.67rem', color: 'rgba(240,235,225,0.7)', lineHeight: 1.5 }}>{panel.goal}</div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
