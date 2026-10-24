'use client'

import { useEffect, useRef } from 'react'

interface GraphNode {
  id: string
  type: 'episode' | 'dimension' | 'finding'
  label: string
  sub: string
  color: string
  r: number
  x: number; y: number; z: number
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
    key: string
    label: string
    score: number
    findings?: Array<{ title: string; priority: string; scene_ref?: string }>
  }>
  categories?: Array<{
    key: string
    label: string
    score: number
    findings?: Array<{ title: string; priority: string; scene_ref?: string }>
  }>
}

interface Props {
  analysis: NuppaGraphAnalysis
  episodeLabel?: string
}

export default function NuppaGraph({ analysis, episodeLabel }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef   = useRef<number | undefined>(undefined)
  const rotRef    = useRef(0)
  const tRef      = useRef(0)
  const lastRef   = useRef<number | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
    if (!ctx) return

    // Use scores_snapshot or fallback to categories
    const dims = analysis.scores_snapshot ?? analysis.categories ?? []

    // ── Build graph ──────────────────────────────────────────────────────
    const nodes: GraphNode[] = []
    const links: GraphLink[] = []

    nodes.push({
      id: 'episode', type: 'episode',
      label: episodeLabel ?? 'Episodio',
      sub: `${analysis.overall_score.toFixed(1)} / 5`,
      color: '#DFF818', r: 20, x: 0, y: 0, z: 0,
    })

    dims.forEach((dim, i) => {
      const angle = (i / dims.length) * Math.PI * 2 - Math.PI / 2
      const dist  = 105
      const color = DIM_COLORS[dim.key] ?? '#AAAAAA'
      const nid   = 'dim_' + dim.key
      nodes.push({
        id: nid, type: 'dimension',
        label: dim.label, sub: `${dim.score}/5`, color,
        r: 8 + (dim.score / 5) * 8,
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist * 0.45,
        z: Math.sin(angle) * dist,
      })
      links.push({ s: 'episode', t: nid, color: color + '55', w: 1.5 })

      ;(dim.findings ?? []).forEach((f, fi) => {
        const count = dim.findings?.length ?? 1
        const fa  = angle + (fi - (count - 1) / 2) * 0.5
        const fd  = 175
        const fc  = PRIORITY_COLORS[f.priority] ?? '#AAAAAA'
        const fid = `f_${dim.key}_${fi}`
        nodes.push({
          id: fid, type: 'finding',
          label: f.title.length > 32 ? f.title.substring(0, 32) + '…' : f.title,
          sub: f.priority, color: fc, r: 5,
          x: Math.cos(fa) * fd,
          y: Math.sin(fa) * fd * 0.45 + (fi - 0.5) * 50,
          z: Math.sin(fa) * fd,
        })
        links.push({ s: nid, t: fid, color: fc + '44', w: 1 })
      })
    })

    // ── Load hologram image ───────────────────────────────────────────────
    const img = new Image()
    img.src = '/nuppita.png'

    // ── Resize ───────────────────────────────────────────────────────────
    const resize = () => {
      const c = canvasRef.current
      if (!c) return
      const dpr = window.devicePixelRatio || 1
      c.width  = c.offsetWidth  * dpr
      c.height = c.offsetHeight * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    // ── Project 3D → 2D ──────────────────────────────────────────────────
    function project(x: number, y: number, z: number): [number, number, number] {
      const c = canvasRef.current!
      const rot = rotRef.current
      const cr = Math.cos(rot), sr = Math.sin(rot)
      const rx = x * cr + z * sr
      const ry = y
      const rz = -x * sr + z * cr
      const fov   = 700
      const scale = fov / (fov + rz)
      return [c.offsetWidth / 2 + rx * scale, c.offsetHeight / 2 + ry * scale, scale]
    }

    // ── Draw loop ─────────────────────────────────────────────────────────
    function draw(ts: number) {
      const c = canvasRef.current
      if (!c) return
      if (!lastRef.current) lastRef.current = ts
      const dt = Math.min((ts - lastRef.current) / 1000, 0.05)
      lastRef.current = ts
      rotRef.current += 0.0008
      tRef.current   += dt

      const t = tRef.current
      const W = c.offsetWidth
      const H = c.offsetHeight
      ctx.clearRect(0, 0, W, H)

      // Project nodes sorted by depth
      const proj = nodes.map(n => {
        const [sx, sy, sc] = project(n.x, n.y, n.z)
        return { n, sx, sy, sc }
      }).sort((a, b) => a.sc - b.sc)

      // ── Hologram ─────────────────────────────────────────────────────
      if (img.complete && img.naturalWidth > 0) {
        const flicker = 0.42 + Math.sin(t * 0.3) * 0.04 +
          (Math.sin(t * 17) > 0.96 ? -0.2 : 0)
        ctx.save()
        ctx.globalAlpha = Math.max(0, flicker)
        ctx.globalCompositeOperation = 'screen'
        ctx.filter = 'brightness(1.3) saturate(3) hue-rotate(175deg) brightness(1.8)'

        const iw = 260
        const ih = (img.naturalHeight / img.naturalWidth) * iw
        const ix = W / 2 - iw / 2
        const iy = H / 2 - ih * 0.52

        // Draw to temp canvas for masking
        const tmp = document.createElement('canvas')
        const dpr = window.devicePixelRatio || 1
        tmp.width  = c.width
        tmp.height = c.height
        const tc   = tmp.getContext('2d')!
        tc.scale(dpr, dpr)
        tc.filter = 'brightness(1.3) saturate(3) hue-rotate(175deg) brightness(1.8)'
        tc.drawImage(img, ix, iy, iw, ih)
        tc.globalCompositeOperation = 'destination-in'
        const grad = tc.createRadialGradient(W/2, H/2 - ih * 0.05, 0, W/2, H/2 - ih * 0.05, iw * 0.52)
        grad.addColorStop(0.3,  'rgba(0,0,0,1)')
        grad.addColorStop(0.65, 'rgba(0,0,0,0.7)')
        grad.addColorStop(0.85, 'rgba(0,0,0,0.15)')
        grad.addColorStop(1,    'rgba(0,0,0,0)')
        tc.fillStyle = grad
        tc.fillRect(0, 0, W, H)

        ctx.filter = 'none'
        ctx.drawImage(tmp, 0, 0, c.width, c.height, 0, 0, W, H)
        ctx.restore()
      }

      // ── Links ─────────────────────────────────────────────────────────
      links.forEach(lk => {
        const src = proj.find(p => p.n.id === lk.s)
        const tgt = proj.find(p => p.n.id === lk.t)
        if (!src || !tgt) return
        ctx.beginPath()
        ctx.moveTo(src.sx, src.sy)
        ctx.lineTo(tgt.sx, tgt.sy)
        ctx.strokeStyle = lk.color
        ctx.lineWidth   = lk.w
        ctx.stroke()
        // Particle
        const pct = (Math.sin(t * 1.5 + lk.s.charCodeAt(0) * 0.3) + 1) / 2
        const px  = src.sx + (tgt.sx - src.sx) * pct
        const py  = src.sy + (tgt.sy - src.sy) * pct
        ctx.shadowColor = lk.color.substring(0, 7)
        ctx.shadowBlur  = 6
        ctx.beginPath(); ctx.arc(px, py, 2.5, 0, Math.PI * 2)
        ctx.fillStyle = lk.color.substring(0, 7) + 'EE'
        ctx.fill()
        ctx.shadowBlur = 0
      })

      // ── Nodes ─────────────────────────────────────────────────────────
      proj.forEach(({ n, sx, sy, sc }) => {
        const r     = n.r * sc
        const pulse = n.type === 'episode' ? 1 + Math.sin(t * 2.5) * 0.07 : 1
        ctx.globalAlpha = Math.min(1, Math.max(0, (t - 0.8) / 0.8))

        if (n.type === 'episode') {
          ctx.shadowColor = '#DFF818'; ctx.shadowBlur = 28
          ctx.beginPath(); ctx.arc(sx, sy, r * pulse * 1.4, 0, Math.PI * 2)
          ctx.strokeStyle = 'rgba(223,248,24,0.12)'; ctx.lineWidth = 1; ctx.stroke()
          ctx.shadowBlur = 0
          const g = ctx.createRadialGradient(sx - r * 0.3, sy - r * 0.3, 0, sx, sy, r * pulse)
          g.addColorStop(0, '#FFFFFF'); g.addColorStop(0.5, '#DFF818'); g.addColorStop(1, 'rgba(223,248,24,0.5)')
          ctx.shadowColor = '#DFF818'; ctx.shadowBlur = 22
          ctx.beginPath(); ctx.arc(sx, sy, r * pulse, 0, Math.PI * 2)
          ctx.fillStyle = g; ctx.fill(); ctx.shadowBlur = 0
          ctx.font = `700 ${10 * sc}px IBM Plex Sans, system-ui`
          ctx.fillStyle = '#060608'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
          ctx.fillText(n.label, sx, sy - 2 * sc)
          ctx.font = `400 ${8 * sc}px IBM Plex Sans, system-ui`
          ctx.fillText(n.sub, sx, sy + 8 * sc)

        } else if (n.type === 'dimension') {
          ctx.shadowColor = n.color; ctx.shadowBlur = 16
          ctx.beginPath(); ctx.arc(sx, sy, r, 0, Math.PI * 2)
          ctx.fillStyle = n.color + 'CC'; ctx.fill(); ctx.shadowBlur = 0
          if (sc > 0.6) {
            ctx.font = `600 ${8 * sc}px IBM Plex Sans, system-ui`
            ctx.fillStyle = 'rgba(240,235,225,0.9)'; ctx.textAlign = 'center'; ctx.textBaseline = 'top'
            ctx.fillText(n.label, sx, sy + r + 4 * sc)
            ctx.font = `400 ${7 * sc}px IBM Plex Sans, system-ui`
            ctx.fillStyle = n.color; ctx.fillText(n.sub, sx, sy + r + 13 * sc)
          }

        } else {
          ctx.shadowColor = n.color; ctx.shadowBlur = 9
          ctx.beginPath(); ctx.arc(sx, sy, r, 0, Math.PI * 2)
          ctx.fillStyle = n.color + 'BB'; ctx.fill(); ctx.shadowBlur = 0
          if (sc > 0.72) {
            ctx.font = `500 ${7 * sc}px IBM Plex Sans, system-ui`
            ctx.fillStyle = 'rgba(240,235,225,0.65)'; ctx.textAlign = 'center'; ctx.textBaseline = 'top'
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

  return (
    <canvas
      ref={canvasRef}
      style={{ width: '100%', height: '100%', display: 'block' }}
    />
  )
}
