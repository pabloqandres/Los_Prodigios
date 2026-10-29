'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'

export interface SeasonEpisode {
  id: string
  season: number
  episode_number: number
  title: string | null
  status: string
  overall_score?: number
  scores_snapshot?: Array<{ key: string; label: string; score: number }>
}

interface Props {
  episodes: SeasonEpisode[]
  seasonLabel?: string
}

interface Node3D {
  id: string
  type: 'season' | 'episode' | 'dimension'
  label: string
  shortLabel: string
  color: string
  r: number
  x: number; y: number; z: number
  episodeId?: string
  episodeRef?: string
  score?: number
  dimKey?: string
}

// ─── Palette (GitNexus-style saturated) ─────────────────────────────────────
const DIM_COLORS: Record<string, string> = {
  narrativa:   '#FF6B35',
  personajes:  '#4ECDC4',
  visual:      '#DFF818',
  actuacion:   '#9B6FD4',
  audiencia:   '#FFE66D',
  franquicia:  '#D4256A',
}

// Fallback colors for unlabeled dims, cycling through the palette
const PALETTE = ['#4A8FE8', '#FF6B35', '#4ECDC4', '#DFF818', '#9B6FD4', '#FFE66D', '#D4256A', '#F5A52A', '#88D8B0']

function dimColor(key: string, idx: number): string {
  return DIM_COLORS[key] ?? PALETTE[idx % PALETTE.length]
}

function scoreColor(score?: number): string {
  if (score === undefined) return 'rgba(200,195,188,0.4)'
  if (score >= 4.3) return '#88D8B0'
  if (score >= 3.5) return '#FFE66D'
  return '#D4256A'
}

// ─── Graph builder ───────────────────────────────────────────────────────────
function buildNodes(episodes: SeasonEpisode[]): Node3D[] {
  const nodes: Node3D[] = []

  nodes.push({
    id: 'season', type: 'season',
    label: 'T01', shortLabel: 'T01',
    color: '#F2EEEA',
    r: 22, x: 0, y: 0, z: 0,
  })

  const total = episodes.length
  const EP_DIST = 210
  const TILT = 0.2

  episodes.forEach((ep, i) => {
    const angle = (i / total) * Math.PI * 2 - Math.PI / 2
    const ex = Math.cos(angle) * EP_DIST
    const ey = Math.sin(angle) * EP_DIST * Math.cos(TILT)
    const ez = Math.sin(angle) * EP_DIST * Math.sin(TILT)

    const epId = `ep_${ep.id}`
    nodes.push({
      id: epId, type: 'episode',
      label: `E${String(ep.episode_number).padStart(2, '0')}`,
      shortLabel: `E${String(ep.episode_number).padStart(2, '0')}`,
      color: scoreColor(ep.overall_score),
      r: ep.overall_score !== undefined ? 20 : 15,
      x: ex, y: ey, z: ez,
      episodeRef: ep.id,
      score: ep.overall_score,
    })

    // Show ALL dimension nodes (not just weak ones)
    const dims = ep.scores_snapshot ?? []
    dims.forEach((dim, j) => {
      const spread = dims.length > 1 ? 0.42 : 0
      const dimAngle = angle + (j - (dims.length - 1) / 2) * spread
      const dimDist = EP_DIST + 72
      const dx = Math.cos(dimAngle) * dimDist
      const dy = Math.sin(dimAngle) * dimDist * Math.cos(TILT)
      const dz = Math.sin(dimAngle) * dimDist * Math.sin(TILT)
      nodes.push({
        id: `dim_${ep.id}_${dim.key}`,
        type: 'dimension',
        label: dim.label,
        shortLabel: dim.label.slice(0, 8),
        color: dimColor(dim.key, j),
        r: dim.score < 3.5 ? 10 : 7,
        x: dx, y: dy, z: dz,
        episodeId: epId,
        episodeRef: ep.id,
        score: dim.score,
        dimKey: dim.key,
      })
    })
  })

  return nodes
}

function buildLinks(nodes: Node3D[], episodes: SeasonEpisode[]): Array<{ s: string; t: string; color: string; width: number }> {
  const links: Array<{ s: string; t: string; color: string; width: number }> = []

  // Episode → season
  nodes.filter(n => n.type === 'episode').forEach(n => {
    links.push({ s: 'season', t: n.id, color: 'rgba(242,238,234,0.1)', width: 1 })
  })

  // Dimension → episode
  nodes.filter(n => n.type === 'dimension').forEach(n => {
    if (n.episodeId) {
      const isWeak = (n.score ?? 5) < 3.5
      links.push({ s: n.episodeId, t: n.id, color: n.color + (isWeak ? '66' : '33'), width: isWeak ? 1.5 : 0.8 })
    }
  })

  // Cross-episode links: episodes sharing the same weak dimension key
  const weakByKey: Record<string, string[]> = {}  // dimKey → [epId, ...]
  for (const ep of episodes) {
    for (const dim of ep.scores_snapshot ?? []) {
      if (dim.score < 3.8) {
        if (!weakByKey[dim.key]) weakByKey[dim.key] = []
        weakByKey[dim.key].push(`ep_${ep.id}`)
      }
    }
  }
  for (const [key, epIds] of Object.entries(weakByKey)) {
    // Connect pairs (max 3 links per key to avoid clutter)
    const color = (DIM_COLORS[key] ?? '#888') + '28'
    for (let i = 0; i < Math.min(epIds.length - 1, 3); i++) {
      links.push({ s: epIds[i], t: epIds[i + 1], color, width: 0.6 })
    }
  }

  return links
}

// ─── 3D projection ───────────────────────────────────────────────────────────
function project(x: number, y: number, z: number, rx: number, ry: number, W: number, H: number, ws: number) {
  const cosY = Math.cos(ry), sinY = Math.sin(ry)
  const x1 = x * cosY - z * sinY
  const z1 = x * sinY + z * cosY
  const cosX = Math.cos(rx), sinX = Math.sin(rx)
  const y2 = y * cosX - z1 * sinX
  const z2 = y * sinX + z1 * cosX
  const fov = 600
  const scale = fov / (fov + z2) * ws
  return { sx: W / 2 + x1 * scale, sy: H / 2 + y2 * scale, scale, z: z2 }
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function NuppaSeasonGraph({ episodes, seasonLabel = 'T01' }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const router = useRouter()
  const rotRef = useRef({ x: 0.28, y: 0 })
  const isDragging = useRef(false)
  const lastMouse = useRef({ x: 0, y: 0 })
  const isHovering = useRef(false)
  const imgRef = useRef<HTMLImageElement | null>(null)
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const hoveredIdRef = useRef<string | null>(null)
  const timeRef = useRef(0)

  const nodesRef = useRef<Node3D[]>([])
  const linksRef = useRef<ReturnType<typeof buildLinks>>([])
  const wsRef = useRef(1)

  useEffect(() => {
    nodesRef.current = buildNodes(episodes)
    linksRef.current = buildLinks(nodesRef.current, episodes)
  }, [episodes])

  useEffect(() => {
    const img = new Image()
    img.src = '/nuppita.png'
    img.onload = () => { imgRef.current = img }
  }, [])

  function hitTest(mx: number, my: number, W: number, H: number): Node3D | null {
    const { x: rx, y: ry } = rotRef.current
    const ws = wsRef.current
    let best: Node3D | null = null
    let bestDist = Infinity
    for (const node of nodesRef.current) {
      const p = project(node.x, node.y, node.z, rx, ry, W, H, ws)
      const dist = Math.hypot(mx - p.sx, my - p.sy)
      const hitR = Math.max(node.r * p.scale + 4, 14)
      if (dist < hitR && dist < bestDist) { bestDist = dist; best = node }
    }
    return best
  }

  const drawFrame = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
    const W = canvas.width
    const H = canvas.height
    const { x: rx, y: ry } = rotRef.current
    const ws = Math.min(W, H) / 720
    wsRef.current = ws
    timeRef.current += 0.012

    ctx.clearRect(0, 0, W, H)

    // ── Background: dot grid ───────────────────────────────────────────────
    ctx.fillStyle = 'rgba(245,165,42,0.06)'
    const gridStep = 28
    for (let gx = gridStep / 2; gx < W; gx += gridStep) {
      for (let gy = gridStep / 2; gy < H; gy += gridStep) {
        ctx.beginPath()
        ctx.arc(gx, gy, 1, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    // ── NUPPA hologram ─────────────────────────────────────────────────────
    if (imgRef.current) {
      const hSize = Math.min(W * 0.30, 230)
      const hx = W / 2 - hSize / 2
      const hy = H / 2 - hSize * 0.55
      const off = document.createElement('canvas')
      off.width = hSize; off.height = hSize
      const octx = off.getContext('2d') as CanvasRenderingContext2D
      octx.fillStyle = '#000'
      octx.fillRect(0, 0, hSize, hSize)
      octx.globalCompositeOperation = 'screen'
      octx.drawImage(imgRef.current, 0, 0, hSize, hSize)
      const mask = document.createElement('canvas')
      mask.width = hSize; mask.height = hSize
      const mctx = mask.getContext('2d') as CanvasRenderingContext2D
      const grad = mctx.createRadialGradient(hSize / 2, hSize * 0.4, hSize * 0.05, hSize / 2, hSize * 0.4, hSize * 0.52)
      grad.addColorStop(0, 'rgba(0,0,0,1)')
      grad.addColorStop(0.55, 'rgba(0,0,0,0.7)')
      grad.addColorStop(0.85, 'rgba(0,0,0,0.2)')
      grad.addColorStop(1, 'rgba(0,0,0,0)')
      mctx.fillStyle = grad
      mctx.fillRect(0, 0, hSize, hSize)
      octx.globalCompositeOperation = 'destination-in'
      octx.drawImage(mask, 0, 0)
      ctx.save()
      ctx.globalAlpha = 0.26
      ctx.globalCompositeOperation = 'screen'
      ctx.filter = 'saturate(0) sepia(1) hue-rotate(155deg) brightness(1.6) saturate(5)'
      ctx.drawImage(off, hx, hy)
      ctx.filter = 'none'
      ctx.globalCompositeOperation = 'source-over'
      ctx.globalAlpha = 1
      ctx.restore()
    }

    // ── Empty state ────────────────────────────────────────────────────────
    if (episodes.length === 0) {
      ctx.font = '13px "IBM Plex Sans", sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillStyle = 'rgba(240,235,225,0.15)'
      ctx.fillText('No hay episodios analizados en esta temporada', W / 2, H / 2 + 60)
      ctx.font = '11px "IBM Plex Sans", sans-serif'
      ctx.fillStyle = 'rgba(240,235,225,0.07)'
      ctx.fillText('Analiza un episodio para ver el grafo de producción', W / 2, H / 2 + 82)
      return
    }

    // ── Sort by z depth ────────────────────────────────────────────────────
    const sorted = [...nodesRef.current]
      .map(n => ({ n, p: project(n.x, n.y, n.z, rx, ry, W, H, ws) }))
      .sort((a, b) => a.p.z - b.p.z)

    // ── Links ──────────────────────────────────────────────────────────────
    for (const link of linksRef.current) {
      const na = nodesRef.current.find(n => n.id === link.s)
      const nb = nodesRef.current.find(n => n.id === link.t)
      if (!na || !nb) continue
      const pa = project(na.x, na.y, na.z, rx, ry, W, H, ws)
      const pb = project(nb.x, nb.y, nb.z, rx, ry, W, H, ws)
      ctx.beginPath()
      ctx.moveTo(pa.sx, pa.sy)
      ctx.lineTo(pb.sx, pb.sy)
      ctx.strokeStyle = link.color
      ctx.lineWidth = link.width
      ctx.stroke()
    }

    // ── Nodes ──────────────────────────────────────────────────────────────
    for (const { n, p } of sorted) {
      const r = n.r * p.scale
      const isHov = hoveredIdRef.current === n.id
      const pulse = Math.sin(timeRef.current + n.x * 0.01 + n.y * 0.01) * 0.5 + 0.5  // 0–1

      // ── Outer ambient glow (always on, pulses) ──────────────────────────
      if (n.type !== 'season') {
        const glowR = r + 8 + pulse * 5
        const g = ctx.createRadialGradient(p.sx, p.sy, r * 0.3, p.sx, p.sy, glowR)
        g.addColorStop(0, n.color + '55')
        g.addColorStop(0.4, n.color + '22')
        g.addColorStop(1, 'transparent')
        ctx.beginPath()
        ctx.arc(p.sx, p.sy, glowR, 0, Math.PI * 2)
        ctx.fillStyle = g
        ctx.fill()
      }

      // ── Hover extra glow ────────────────────────────────────────────────
      if (isHov) {
        const hg = ctx.createRadialGradient(p.sx, p.sy, r, p.sx, p.sy, r + 18)
        hg.addColorStop(0, n.color + '66')
        hg.addColorStop(1, 'transparent')
        ctx.beginPath()
        ctx.arc(p.sx, p.sy, r + 18, 0, Math.PI * 2)
        ctx.fillStyle = hg
        ctx.fill()
      }

      // ── Node fill ───────────────────────────────────────────────────────
      ctx.beginPath()
      ctx.arc(p.sx, p.sy, r, 0, Math.PI * 2)

      if (n.type === 'season') {
        ctx.fillStyle = 'rgba(242,238,234,0.12)'
      } else if (n.type === 'episode') {
        // Radial fill for episode nodes
        const fg = ctx.createRadialGradient(p.sx - r * 0.25, p.sy - r * 0.25, r * 0.05, p.sx, p.sy, r)
        fg.addColorStop(0, n.color + 'FF')
        fg.addColorStop(0.65, n.color + 'CC')
        fg.addColorStop(1, n.color + '55')
        ctx.fillStyle = n.score !== undefined ? fg : n.color + '40'
      } else {
        // dimension
        const isWeak = (n.score ?? 5) < 3.5
        ctx.fillStyle = isWeak ? n.color + 'CC' : n.color + '55'
      }
      ctx.fill()

      // ── Border / stroke ─────────────────────────────────────────────────
      ctx.strokeStyle = n.color + (isHov ? 'FF' : 'AA')
      ctx.lineWidth = n.type === 'season' ? 1.5 : isHov ? 2.5 : 1.2
      ctx.stroke()

      // Season outer ring
      if (n.type === 'season') {
        ctx.beginPath()
        ctx.arc(p.sx, p.sy, r + 5 + pulse * 3, 0, Math.PI * 2)
        ctx.strokeStyle = 'rgba(242,238,234,0.08)'
        ctx.lineWidth = 1
        ctx.stroke()
        ctx.beginPath()
        ctx.arc(p.sx, p.sy, r + 12 + pulse * 2, 0, Math.PI * 2)
        ctx.strokeStyle = 'rgba(242,238,234,0.04)'
        ctx.lineWidth = 0.8
        ctx.stroke()
      }

      // ── Labels ──────────────────────────────────────────────────────────
      if (n.type === 'episode' || n.type === 'season') {
        // Text halo (readability)
        ctx.font = `bold ${Math.max(10, 13 * p.scale)}px "IBM Plex Sans", sans-serif`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillStyle = '#131313'
        ctx.fillText(n.label, p.sx, p.sy)
        ctx.fillStyle = n.type === 'season' ? '#F2EEEA' : '#131313'
        ctx.fillText(n.label, p.sx, p.sy)
      }

      // Score badge for episodes
      if (n.type === 'episode' && n.score !== undefined) {
        const bx = p.sx + r + 3
        const by = p.sy - r - 1
        ctx.font = `bold ${Math.max(9, 10 * p.scale)}px "IBM Plex Sans", sans-serif`
        ctx.textAlign = 'left'
        ctx.textBaseline = 'bottom'
        ctx.fillStyle = n.color
        ctx.shadowColor = n.color
        ctx.shadowBlur = 4
        ctx.fillText(n.score.toFixed(1), bx, by)
        ctx.shadowBlur = 0
      }

      // Dimension label + score
      if (n.type === 'dimension') {
        const dimFontSize = Math.max(8, 9.5 * p.scale)
        const isWeak = (n.score ?? 5) < 3.5
        ctx.font = `${isWeak ? 'bold ' : ''}${dimFontSize}px "IBM Plex Sans", sans-serif`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'top'
        // Glow text for weak dims
        if (isWeak) {
          ctx.shadowColor = n.color
          ctx.shadowBlur = 6
        }
        ctx.fillStyle = n.color + (isHov || isWeak ? 'FF' : 'BB')
        ctx.fillText(n.shortLabel, p.sx, p.sy + r + 2)
        if (n.score !== undefined) {
          ctx.font = `bold ${dimFontSize}px "IBM Plex Sans", sans-serif`
          ctx.fillStyle = n.color + (isHov ? 'FF' : '88')
          ctx.fillText(n.score.toFixed(1), p.sx, p.sy + r + 2 + dimFontSize + 1)
        }
        ctx.shadowBlur = 0
      }
    }

    // ── Hover tooltip ──────────────────────────────────────────────────────
    if (hoveredIdRef.current) {
      const hovNode = nodesRef.current.find(n => n.id === hoveredIdRef.current)
      if (hovNode?.type === 'episode') {
        const ep = episodes.find(e => e.id === hovNode.episodeRef)
        if (ep) {
          const p = project(hovNode.x, hovNode.y, hovNode.z, rx, ry, W, H, ws)
          const titleText = ep.title ? `E${String(ep.episode_number).padStart(2,'0')} — ${ep.title}` : `Episodio ${ep.episode_number}`
          const scoreText = ep.overall_score !== undefined ? `  ★ ${ep.overall_score.toFixed(1)} / 5` : '  Sin análisis'
          ctx.font = '11px "IBM Plex Sans", sans-serif'
          const tw = ctx.measureText(titleText + scoreText).width
          const tx = Math.min(Math.max(p.sx - tw / 2 - 10, 4), W - tw - 24)
          const ty = Math.max(p.sy - hovNode.r * p.scale - 36, 6)
          ctx.fillStyle = 'rgba(13,9,32,0.94)'
          ctx.strokeStyle = hovNode.color + '66'
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.roundRect(tx, ty, tw + 20, 24, 4)
          ctx.fill(); ctx.stroke()
          ctx.fillStyle = '#F0EBE1'
          ctx.textAlign = 'left'; ctx.textBaseline = 'middle'
          ctx.fillText(titleText, tx + 10, ty + 12)
          ctx.fillStyle = hovNode.color
          ctx.fillText(scoreText, tx + 10 + ctx.measureText(titleText).width, ty + 12)
        }
      } else if (hovNode?.type === 'dimension') {
        const ep = episodes.find(e => e.id === hovNode.episodeRef)
        if (ep) {
          const p = project(hovNode.x, hovNode.y, hovNode.z, rx, ry, W, H, ws)
          const line1 = `${hovNode.label}  ${hovNode.score !== undefined ? hovNode.score.toFixed(1) + ' / 5' : ''}`
          const line2 = ep.title ? `E${String(ep.episode_number).padStart(2,'0')} ${ep.title} · Click para abrir` : `Episodio ${ep.episode_number} · Click para abrir`
          ctx.font = 'bold 11px "IBM Plex Sans", sans-serif'
          const tw = Math.max(ctx.measureText(line1).width, ctx.measureText(line2).width)
          const tx = Math.min(Math.max(p.sx - tw / 2 - 12, 4), W - tw - 28)
          const ty = Math.max(p.sy - hovNode.r * p.scale - 56, 6)
          ctx.fillStyle = 'rgba(13,9,32,0.96)'
          ctx.strokeStyle = hovNode.color + 'AA'
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.roundRect(tx, ty, tw + 24, 42, 4)
          ctx.fill(); ctx.stroke()
          ctx.shadowColor = hovNode.color; ctx.shadowBlur = 4
          ctx.fillStyle = hovNode.color
          ctx.textAlign = 'left'; ctx.textBaseline = 'middle'
          ctx.fillText(line1, tx + 12, ty + 13)
          ctx.shadowBlur = 0
          ctx.font = '10px "IBM Plex Sans", sans-serif'
          ctx.fillStyle = 'rgba(240,235,225,0.45)'
          ctx.fillText(line2, tx + 12, ty + 29)
        }
      }
    }
  }, [episodes])

  // ── Animation loop ─────────────────────────────────────────────────────────
  useEffect(() => {
    let animId: number
    let running = true
    function loop() {
      if (!running) return
      if (!isHovering.current && !isDragging.current) rotRef.current.y += 0.0004
      drawFrame()
      animId = requestAnimationFrame(loop)
    }
    loop()
    return () => { running = false; cancelAnimationFrame(animId) }
  }, [drawFrame])

  // ── Resize observer ────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const obs = new ResizeObserver(() => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    })
    obs.observe(canvas)
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight
    return () => obs.disconnect()
  }, [])

  // ── Interaction ────────────────────────────────────────────────────────────
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const mx = e.clientX - rect.left
    const my = e.clientY - rect.top
    if (isDragging.current) {
      rotRef.current.y += (e.clientX - lastMouse.current.x) * 0.007
      rotRef.current.x += (e.clientY - lastMouse.current.y) * 0.007
      rotRef.current.x = Math.max(-0.8, Math.min(0.8, rotRef.current.x))
      lastMouse.current = { x: e.clientX, y: e.clientY }
      return
    }
    const hit = hitTest(mx, my, canvas.width, canvas.height)
    const newId = hit?.id ?? null
    if (newId !== hoveredIdRef.current) {
      hoveredIdRef.current = newId
      setHoveredId(newId)
      canvas.style.cursor = hit && (hit.type === 'episode' || hit.type === 'dimension') ? 'pointer' : 'grab'
    }
  }, [])

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    isDragging.current = true
    lastMouse.current = { x: e.clientX, y: e.clientY }
  }, [])

  const handleMouseUp = useCallback(() => { isDragging.current = false }, [])
  const handleMouseEnter = useCallback(() => { isHovering.current = true }, [])
  const handleMouseLeave = useCallback(() => {
    isHovering.current = false; isDragging.current = false
    hoveredIdRef.current = null; setHoveredId(null)
  }, [])

  const handleClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const hit = hitTest(e.clientX - rect.left, e.clientY - rect.top, canvas.width, canvas.height)
    if (hit?.episodeRef) router.push(`/episodes/${hit.episodeRef}`)
  }, [router])

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block', cursor: 'grab' }}
      onMouseMove={handleMouseMove}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    />
  )
}
