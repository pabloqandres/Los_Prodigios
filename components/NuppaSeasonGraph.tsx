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
  color: string
  r: number
  x: number; y: number; z: number
  episodeId?: string   // for dimension nodes
  episodeRef?: string  // episode id for navigation
  score?: number
  dimKey?: string
}

const DIM_COLORS: Record<string, string> = {
  narrativa:   '#FF6B35',
  personajes:  '#4ECDC4',
  visual:      '#DFF818',
  actuacion:   '#9B6FD4',
  audiencia:   '#FFE66D',
  franquicia:  '#D4256A',
}

function scoreColor(score?: number): string {
  if (score === undefined) return '#555555'
  if (score >= 4.3) return '#88D8B0'
  if (score >= 3.5) return '#FFE66D'
  return '#D4256A'
}

function buildNodes(episodes: SeasonEpisode[]): Node3D[] {
  const nodes: Node3D[] = []

  // Center: season
  nodes.push({
    id: 'season',
    type: 'season',
    label: 'T01',
    color: '#F2EEEA',
    r: 16,
    x: 0, y: 0, z: 0,
  })

  const total = episodes.length
  const EP_DIST = 160

  episodes.forEach((ep, i) => {
    const angle = (i / total) * Math.PI * 2 - Math.PI / 2
    // Tilt slightly for 3D feel
    const tilt = 0.22
    const ex = Math.cos(angle) * EP_DIST
    const ey = Math.sin(angle) * EP_DIST * Math.cos(tilt)
    const ez = Math.sin(angle) * EP_DIST * Math.sin(tilt)

    const epId = `ep_${ep.id}`
    nodes.push({
      id: epId,
      type: 'episode',
      label: `E${String(ep.episode_number).padStart(2, '0')}`,
      color: scoreColor(ep.overall_score),
      r: ep.overall_score !== undefined ? 11 : 8,
      x: ex, y: ey, z: ez,
      episodeRef: ep.id,
      score: ep.overall_score,
    })

    // Weak dimension nodes — only for analyzed episodes with score < 4.0
    if (ep.overall_score !== undefined && ep.scores_snapshot) {
      const weak = ep.scores_snapshot
        .filter(d => d.score < 3.8)
        .sort((a, b) => a.score - b.score)
        .slice(0, 3)

      weak.forEach((dim, j) => {
        const dimAngle = angle + (j - (weak.length - 1) / 2) * 0.45
        const dimDist = EP_DIST + 70
        const dx = Math.cos(dimAngle) * dimDist
        const dy = Math.sin(dimAngle) * dimDist * Math.cos(tilt)
        const dz = Math.sin(dimAngle) * dimDist * Math.sin(tilt)
        nodes.push({
          id: `dim_${ep.id}_${dim.key}`,
          type: 'dimension',
          label: dim.label.slice(0, 3).toUpperCase(),
          color: DIM_COLORS[dim.key] ?? '#888',
          r: 5,
          x: dx, y: dy, z: dz,
          episodeId: epId,
          episodeRef: ep.id,
          score: dim.score,
          dimKey: dim.key,
        })
      })
    }
  })

  return nodes
}

function buildLinks(nodes: Node3D[]): Array<{ s: string; t: string; color: string }> {
  const links: Array<{ s: string; t: string; color: string }> = []
  const nodeMap = new Map(nodes.map(n => [n.id, n]))

  nodes.forEach(n => {
    if (n.type === 'episode') {
      links.push({ s: 'season', t: n.id, color: 'rgba(242,238,234,0.12)' })
    }
    if (n.type === 'dimension' && n.episodeId) {
      const epNode = nodeMap.get(n.episodeId)
      if (epNode) links.push({ s: n.episodeId, t: n.id, color: n.color + '44' })
    }
  })

  return links
}

function project(x: number, y: number, z: number, rx: number, ry: number, W: number, H: number) {
  // Rotate Y
  const cosY = Math.cos(ry), sinY = Math.sin(ry)
  const x1 = x * cosY - z * sinY
  const z1 = x * sinY + z * cosY
  // Rotate X
  const cosX = Math.cos(rx), sinX = Math.sin(rx)
  const y2 = y * cosX - z1 * sinX
  const z2 = y * sinX + z1 * cosX
  const fov = 600
  const scale = fov / (fov + z2)
  return { sx: W / 2 + x1 * scale, sy: H / 2 + y2 * scale, scale, z: z2 }
}

export default function NuppaSeasonGraph({ episodes, seasonLabel = 'T01' }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const router = useRouter()
  const rotRef = useRef({ x: 0.3, y: 0 })
  const isDragging = useRef(false)
  const lastMouse = useRef({ x: 0, y: 0 })
  const isHovering = useRef(false)
  const imgRef = useRef<HTMLImageElement | null>(null)
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const hoveredIdRef = useRef<string | null>(null)

  const nodesRef = useRef<Node3D[]>([])
  const linksRef = useRef<ReturnType<typeof buildLinks>>([])

  useEffect(() => {
    nodesRef.current = buildNodes(episodes)
    linksRef.current = buildLinks(nodesRef.current)
  }, [episodes])

  // Load hologram image
  useEffect(() => {
    const img = new Image()
    img.src = '/nuppita.png'
    img.onload = () => { imgRef.current = img }
  }, [])

  function hitTest(mx: number, my: number, W: number, H: number): Node3D | null {
    const { x: rx, y: ry } = rotRef.current
    let best: Node3D | null = null
    let bestDist = Infinity
    for (const node of nodesRef.current) {
      const p = project(node.x, node.y, node.z, rx, ry, W, H)
      const dist = Math.hypot(mx - p.sx, my - p.sy)
      const hitR = Math.max(node.r * p.scale, 14)
      if (dist < hitR && dist < bestDist) {
        bestDist = dist
        best = node
      }
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

    ctx.clearRect(0, 0, W, H)

    // Draw hologram (NUPPA head behind graph)
    if (imgRef.current) {
      const hSize = Math.min(W * 0.30, 240)
      const hx = W / 2 - hSize / 2
      const hy = H / 2 - hSize * 0.55

      // Step 1: render image to offscreen, screen-composite over black → removes white background
      const off = document.createElement('canvas')
      off.width = hSize; off.height = hSize
      const octx = off.getContext('2d') as CanvasRenderingContext2D
      octx.fillStyle = '#000'
      octx.fillRect(0, 0, hSize, hSize)
      octx.globalCompositeOperation = 'screen'
      octx.drawImage(imgRef.current, 0, 0, hSize, hSize)

      // Step 2: radial fade mask so edges dissolve
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

      // Step 3: draw to main canvas with cyan tint filter (no hue-rotate — just saturate to cyan)
      ctx.save()
      ctx.globalAlpha = 0.28
      ctx.globalCompositeOperation = 'screen'
      ctx.filter = 'saturate(0) sepia(1) hue-rotate(155deg) brightness(1.6) saturate(5)'
      ctx.drawImage(off, hx, hy)
      ctx.filter = 'none'
      ctx.globalCompositeOperation = 'source-over'
      ctx.globalAlpha = 1
      ctx.restore()
    }

    // Sort nodes by z for depth painting
    const sorted = [...nodesRef.current]
      .map(n => ({ n, p: project(n.x, n.y, n.z, rx, ry, W, H) }))
      .sort((a, b) => a.p.z - b.p.z)

    // Draw links first
    for (const link of linksRef.current) {
      const na = nodesRef.current.find(n => n.id === link.s)
      const nb = nodesRef.current.find(n => n.id === link.t)
      if (!na || !nb) continue
      const pa = project(na.x, na.y, na.z, rx, ry, W, H)
      const pb = project(nb.x, nb.y, nb.z, rx, ry, W, H)
      ctx.beginPath()
      ctx.moveTo(pa.sx, pa.sy)
      ctx.lineTo(pb.sx, pb.sy)
      ctx.strokeStyle = link.color
      ctx.lineWidth = 1
      ctx.stroke()
    }

    // Draw nodes
    for (const { n, p } of sorted) {
      const r = n.r * p.scale
      const isHov = hoveredIdRef.current === n.id

      // Glow for hovered or episode nodes
      if (isHov || n.type === 'episode') {
        ctx.beginPath()
        ctx.arc(p.sx, p.sy, r + 6, 0, Math.PI * 2)
        const g = ctx.createRadialGradient(p.sx, p.sy, r * 0.5, p.sx, p.sy, r + 6)
        g.addColorStop(0, n.color + '44')
        g.addColorStop(1, 'transparent')
        ctx.fillStyle = g
        ctx.fill()
      }

      // Node fill
      ctx.beginPath()
      ctx.arc(p.sx, p.sy, r, 0, Math.PI * 2)
      ctx.fillStyle = n.type === 'season' ? 'rgba(242,238,234,0.15)' : n.color + (isHov ? 'FF' : 'CC')
      ctx.fill()

      // Border
      ctx.strokeStyle = n.color
      ctx.lineWidth = n.type === 'season' ? 1.5 : (isHov ? 2 : 1)
      ctx.stroke()

      // Season cross/ring decoration
      if (n.type === 'season') {
        ctx.beginPath()
        ctx.arc(p.sx, p.sy, r + 4, 0, Math.PI * 2)
        ctx.strokeStyle = 'rgba(242,238,234,0.1)'
        ctx.lineWidth = 1
        ctx.stroke()
      }

      // Label
      if (n.type === 'episode' || n.type === 'season' || isHov) {
        ctx.font = `${n.type === 'season' ? 'bold ' : ''}${Math.max(9, 11 * p.scale)}px "IBM Plex Sans", sans-serif`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillStyle = n.type === 'season' ? '#F2EEEA' : '#131313'
        ctx.fillText(n.label, p.sx, p.sy)
      }

      // Score badge for episode nodes
      if (n.type === 'episode' && n.score !== undefined) {
        const bx = p.sx + r + 2
        const by = p.sy - r - 2
        ctx.font = `${Math.max(7, 8 * p.scale)}px "IBM Plex Sans", sans-serif`
        ctx.textAlign = 'left'
        ctx.textBaseline = 'bottom'
        ctx.fillStyle = n.color
        ctx.fillText(n.score.toFixed(1), bx, by)
      }

      // Dimension label on hover
      if (n.type === 'dimension' && isHov) {
        ctx.font = `8px "IBM Plex Sans", sans-serif`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'top'
        ctx.fillStyle = n.color
        ctx.fillText(n.label, p.sx, p.sy + r + 3)
      }
    }

    // Hover tooltip for episode
    if (hoveredIdRef.current) {
      const hovNode = nodesRef.current.find(n => n.id === hoveredIdRef.current)
      if (hovNode && hovNode.type === 'episode') {
        const ep = episodes.find(e => e.id === hovNode.episodeRef)
        if (ep) {
          const p = project(hovNode.x, hovNode.y, hovNode.z, rx, ry, W, H)
          const text = ep.title ? `E${String(ep.episode_number).padStart(2,'0')} — ${ep.title}` : `Episodio ${ep.episode_number}`
          const scoreText = ep.overall_score !== undefined ? `  ${ep.overall_score.toFixed(1)} / 5` : '  Sin análisis'
          const fullText = text + scoreText

          ctx.font = '11px "IBM Plex Sans", sans-serif'
          const tw = ctx.measureText(fullText).width
          const tx = Math.min(Math.max(p.sx - tw / 2 - 8, 4), W - tw - 20)
          const ty = p.sy - hovNode.r * p.scale - 30

          ctx.fillStyle = 'rgba(19,19,19,0.92)'
          ctx.beginPath()
          ctx.roundRect(tx, ty, tw + 16, 22, 4)
          ctx.fill()
          ctx.strokeStyle = hovNode.color + '88'
          ctx.lineWidth = 1
          ctx.stroke()

          ctx.fillStyle = '#F2EEEA'
          ctx.textAlign = 'left'
          ctx.textBaseline = 'middle'
          ctx.fillText(text, tx + 8, ty + 11)
          ctx.fillStyle = hovNode.color
          ctx.fillText(scoreText, tx + 8 + ctx.measureText(text).width, ty + 11)
        }
      }
    }
  }, [episodes])

  useEffect(() => {
    let animId: number
    let running = true

    function loop() {
      if (!running) return
      if (!isHovering.current && !isDragging.current) {
        rotRef.current.y += 0.0004
      }
      drawFrame()
      animId = requestAnimationFrame(loop)
    }
    loop()

    return () => {
      running = false
      cancelAnimationFrame(animId)
    }
  }, [drawFrame])

  // Resize observer
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

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const mx = e.clientX - rect.left
    const my = e.clientY - rect.top

    if (isDragging.current) {
      const dx = e.clientX - lastMouse.current.x
      const dy = e.clientY - lastMouse.current.y
      rotRef.current.y += dx * 0.007
      rotRef.current.x += dy * 0.007
      rotRef.current.x = Math.max(-0.8, Math.min(0.8, rotRef.current.x))
      lastMouse.current = { x: e.clientX, y: e.clientY }
      return
    }

    const hit = hitTest(mx, my, canvas.width, canvas.height)
    const newId = hit?.id ?? null
    if (newId !== hoveredIdRef.current) {
      hoveredIdRef.current = newId
      setHoveredId(newId)
      canvas.style.cursor = (hit && (hit.type === 'episode' || hit.type === 'dimension')) ? 'pointer' : 'grab'
    }
  }, [])

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    isDragging.current = true
    lastMouse.current = { x: e.clientX, y: e.clientY }
  }, [])

  const handleMouseUp = useCallback(() => {
    isDragging.current = false
  }, [])

  const handleMouseEnter = useCallback(() => { isHovering.current = true }, [])
  const handleMouseLeave = useCallback(() => {
    isHovering.current = false
    isDragging.current = false
    hoveredIdRef.current = null
    setHoveredId(null)
  }, [])

  const handleClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const mx = e.clientX - rect.left
    const my = e.clientY - rect.top
    const hit = hitTest(mx, my, canvas.width, canvas.height)
    if (hit?.episodeRef) {
      router.push(`/episodes/${hit.episodeRef}`)
    }
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
