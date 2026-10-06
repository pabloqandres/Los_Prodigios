'use client'

import { useState, useRef, useCallback, useEffect } from 'react'

// ── Types ─────────────────────────────────────────────────────────────────────

type VideoNodeKind = 'scene' | 'reference' | 'direction' | 'entity' | 'output'

type VideoNodeData = {
  sceneType?: string
  referenceImageUrl?: string
  referenceImageB64?: string
  shotType?: string
  cameraMovement?: string
  lightingTime?: string
  lightingType?: string
  lightingTemp?: string
  visualStyle?: string
  extras?: string
  extrasType?: string
  bgDetail?: string
  duration?: string
  speed?: string
  mood?: string
  entityDocId?: string
  entityTitle?: string
  sceneDescription?: string
  klingPrompt?: string
  runwayPrompt?: string
  soraPrompt?: string
  artlistPrompt?: string
  selectedPlatform?: string
  isGenerating?: boolean
}

type CanvasNode = { id: string; type: VideoNodeKind; position: { x: number; y: number }; data: VideoNodeData }
type CanvasEdge = { id: string; source: string; target: string }
type DocOption  = { id: string; title: string }
type ChatMsg    = { role: 'user' | 'assistant'; content: string }

// ── Constants ─────────────────────────────────────────────────────────────────

const SCENE_TYPES = [
  { id: 'narrativa',    label: 'Escena narrativa',         desc: 'Diálogo o acción dramática' },
  { id: 'travelling',   label: 'Travelling de locación',   desc: 'Establece el espacio' },
  { id: 'reaccion',     label: 'Reacción de personaje',    desc: 'Primer plano emocional' },
  { id: 'accion',       label: 'Acción deportiva',         desc: 'Movimiento y energía' },
  { id: 'atmosferica',  label: 'Transición atmosférica',   desc: 'Ambiente y tiempo' },
  { id: 'intro',        label: 'Intro · Title card',       desc: 'Apertura de episodio' },
]

const SHOT_TYPES = ['Primer plano', 'Plano medio', 'Plano entero', 'Plano americano', 'Plano general', 'Detalle']
const CAMERA_MOVEMENTS = ['Estática', 'Pan', 'Tilt', 'Zoom in', 'Zoom out', 'Tracking', 'Dolly', 'Drone', 'Handheld']
const LIGHTING_TIMES = ['Amanecer', 'Mañana', 'Mediodía', 'Tarde dorada', 'Atardecer', 'Noche']
const LIGHTING_TYPES = ['Natural', 'Artificial', 'Mixta', 'Contraluz', 'Nublado']
const LIGHTING_TEMPS = ['Cálida', 'Neutra', 'Fría', 'Neón']
const VISUAL_STYLES = [
  { id: 'cel-shading',    label: 'Cel-shading cinematográfico', desc: 'Sombras duras, outlines limpios' },
  { id: 'hyper-realista', label: 'Hyper-realista',              desc: 'Máximo detalle fotográfico' },
  { id: 'painterly',      label: 'Painterly animated',          desc: 'Pinceladas visibles, textura' },
  { id: 'high-contrast',  label: 'High contrast graphic',       desc: 'Alto contraste, siluetas' },
]
const EXTRAS_COUNTS = ['Sin extras', '1-2 difusos', 'Grupo (3-6)', 'Multitud']
const EXTRAS_TYPES  = ['Vecinos', 'Jugadores', 'Espectadores', 'Transeúntes', 'Familia']
const BG_DETAILS    = ['Bokeh', 'Semi-detallado', 'Narrativo completo']
const DURATIONS     = ['3s', '5s', '8s', '10s']
const SPEEDS        = ['Cámara lenta', 'Normal', 'Acelerada']
const MOODS         = ['Épico', 'Íntimo', 'Tenso', 'Melancólico', 'Alegre', 'Urgente']

const CARD_W   = 260
const OUTPUT_W = 820
const PORT_Y   = 56
const PORT_R   = 6

// ── Shared styles ─────────────────────────────────────────────────────────────

const CARD_BASE: React.CSSProperties = {
  position: 'absolute',
  width: CARD_W,
  background: '#120D28',
  borderRadius: '6px',
  padding: '12px 14px',
  fontFamily: 'IBM Plex Sans, sans-serif',
  fontSize: '0.8125rem',
  color: '#F0EBE1',
  boxShadow: '0 4px 24px rgba(0,0,0,0.5)',
  userSelect: 'none',
  boxSizing: 'border-box',
}

const LABEL: React.CSSProperties = {
  fontSize: '0.5625rem',
  letterSpacing: '0.15em',
  textTransform: 'uppercase',
  color: 'rgba(240,235,225,0.3)',
  marginBottom: '8px',
  fontWeight: 600,
}

const SUB_LABEL: React.CSSProperties = {
  fontSize: '0.5rem',
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  color: 'rgba(240,235,225,0.25)',
  marginBottom: '4px',
  marginTop: '8px',
  fontWeight: 700,
}

const SELECT: React.CSSProperties = {
  width: '100%',
  background: '#1A1235',
  border: '1px solid rgba(245,165,42,0.15)',
  borderRadius: '3px',
  color: '#F0EBE1',
  fontSize: '0.8125rem',
  padding: '6px 8px',
  outline: 'none',
  cursor: 'pointer',
  fontFamily: 'IBM Plex Sans, sans-serif',
  boxSizing: 'border-box',
}

// ── Port component ─────────────────────────────────────────────────────────────

function Port({ side, color, onMouseDown, onMouseUp }: {
  side: 'left' | 'right'
  color: string
  onMouseDown?: (e: React.MouseEvent) => void
  onMouseUp?: (e: React.MouseEvent) => void
}) {
  return (
    <div
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      style={{
        position: 'absolute',
        top: PORT_Y - PORT_R,
        [side]: -PORT_R - 1,
        width: PORT_R * 2,
        height: PORT_R * 2,
        borderRadius: '50%',
        background: color,
        border: '2px solid #08060F',
        cursor: side === 'right' ? 'crosshair' : 'default',
        zIndex: 2,
      }}
    />
  )
}

// ── Pill button helper ────────────────────────────────────────────────────────

function Pill({ label, active, color, onClick }: { label: string; active: boolean; color: string; onClick: () => void }) {
  return (
    <div
      onMouseDown={e => { e.stopPropagation(); onClick() }}
      style={{
        padding: '3px 8px',
        borderRadius: '12px',
        border: `1px solid ${active ? color : 'rgba(240,235,225,0.1)'}`,
        background: active ? `${color}22` : 'transparent',
        color: active ? color : 'rgba(240,235,225,0.5)',
        fontSize: '0.65rem',
        fontWeight: active ? 700 : 400,
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        transition: 'all 0.1s',
      }}
    >
      {label}
    </div>
  )
}

// ── Node: SceneCard ───────────────────────────────────────────────────────────

function SceneCard({ node, selected, onDragStart, onUpdate, onPortDown }: {
  node: CanvasNode; selected: boolean
  onDragStart: (e: React.MouseEvent) => void
  onUpdate: (patch: VideoNodeData) => void
  onPortDown: (e: React.MouseEvent, nodeId: string) => void
}) {
  return (
    <div
      onMouseDown={onDragStart}
      style={{ ...CARD_BASE, left: node.position.x, top: node.position.y, border: `1px solid ${selected ? '#4ECDC4' : 'rgba(78,205,196,0.3)'}`, cursor: 'grab' }}
    >
      <div style={{ ...LABEL, color: 'rgba(78,205,196,0.5)' }}>Tipo de Escena</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px' }}>
        {SCENE_TYPES.map(st => {
          const active = node.data.sceneType === st.id
          return (
            <div
              key={st.id}
              onMouseDown={e => { e.stopPropagation(); onUpdate({ sceneType: st.id }) }}
              style={{
                borderRadius: '4px',
                border: `1px solid ${active ? '#4ECDC4' : 'rgba(78,205,196,0.15)'}`,
                background: active ? 'rgba(78,205,196,0.08)' : 'rgba(78,205,196,0.02)',
                padding: '6px 8px',
                cursor: 'pointer',
              }}
            >
              <div style={{ fontSize: '0.65rem', fontWeight: 600, color: active ? '#4ECDC4' : 'rgba(240,235,225,0.7)', marginBottom: '1px', lineHeight: 1.2 }}>{st.label}</div>
              <div style={{ fontSize: '0.55rem', color: 'rgba(240,235,225,0.3)', lineHeight: 1.2 }}>{st.desc}</div>
            </div>
          )
        })}
      </div>
      <div style={SUB_LABEL}>Descripción de la escena</div>
      <textarea
        value={node.data.sceneDescription ?? ''}
        onMouseDown={e => e.stopPropagation()}
        onChange={e => onUpdate({ sceneDescription: e.target.value })}
        placeholder="Describe qué ocurre en este clip..."
        rows={3}
        style={{ ...SELECT, border: '1px solid rgba(78,205,196,0.12)', resize: 'none', lineHeight: 1.4, fontSize: '0.75rem', color: 'rgba(240,235,225,0.6)', fontStyle: 'italic' }}
      />
      <Port side="right" color="#4ECDC4" onMouseDown={e => { e.stopPropagation(); onPortDown(e, node.id) }} />
    </div>
  )
}

// ── Node: ReferenceCard ───────────────────────────────────────────────────────

function ReferenceCard({ node, selected, onDragStart, onUpdate, onPortDown, onPortUp }: {
  node: CanvasNode; selected: boolean
  onDragStart: (e: React.MouseEvent) => void
  onUpdate: (patch: VideoNodeData) => void
  onPortDown: (e: React.MouseEvent, nodeId: string) => void
  onPortUp: (e: React.MouseEvent, nodeId: string) => void
}) {
  const [approvedAssets, setApprovedAssets] = useState<any[]>([])
  const [showPicker, setShowPicker] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetch('/api/assets/approved')
      .then(r => r.json())
      .then((all: any[]) => { if (Array.isArray(all)) setApprovedAssets(all) })
      .catch(() => {})
  }, [])

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      const MAX = 512
      let { width, height } = img
      if (width > MAX || height > MAX) {
        const ratio = Math.min(MAX / width, MAX / height)
        width  = Math.round(width  * ratio)
        height = Math.round(height * ratio)
      }
      const canvas = document.createElement('canvas')
      canvas.width  = width
      canvas.height = height
      canvas.getContext('2d')!.drawImage(img, 0, 0, width, height)
      URL.revokeObjectURL(url)
      const b64 = canvas.toDataURL('image/jpeg', 0.85).split(',')[1]
      onUpdate({ referenceImageB64: b64, referenceImageUrl: undefined })
    }
    img.onerror = () => { URL.revokeObjectURL(url); alert('No se pudo leer la imagen.') }
    img.src = url
  }

  const hasImage = !!(node.data.referenceImageUrl || node.data.referenceImageB64)

  return (
    <div
      onMouseDown={onDragStart}
      style={{ ...CARD_BASE, left: node.position.x, top: node.position.y, border: `1px solid ${selected ? '#F5A52A' : 'rgba(245,165,42,0.3)'}`, cursor: 'grab' }}
    >
      <Port side="left" color="#F5A52A" onMouseUp={e => { e.stopPropagation(); onPortUp(e, node.id) }} />
      <div style={{ ...LABEL, color: 'rgba(245,165,42,0.5)' }}>Referencia Visual</div>

      {hasImage ? (
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={node.data.referenceImageUrl ?? `data:image/jpeg;base64,${node.data.referenceImageB64}`}
            alt="Referencia visual"
            style={{ width: '100%', borderRadius: '3px', border: '1px solid rgba(245,165,42,0.3)', display: 'block', objectFit: 'cover', maxHeight: '120px' }}
          />
          <div style={{ marginTop: '4px', fontSize: '0.6rem', color: 'rgba(78,205,196,0.8)' }}>
            ✓ Referencia seleccionada
          </div>
          <button
            onMouseDown={e => e.stopPropagation()}
            onClick={() => onUpdate({ referenceImageUrl: undefined, referenceImageB64: undefined })}
            style={{ marginTop: '3px', background: 'none', border: 'none', color: 'rgba(212,37,106,0.5)', fontSize: '0.6rem', cursor: 'pointer', padding: 0, fontFamily: 'IBM Plex Sans, sans-serif' }}
          >
            × Quitar referencia
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          {approvedAssets.length > 0 && (
            <button
              onMouseDown={e => e.stopPropagation()}
              onClick={() => setShowPicker(p => !p)}
              style={{ width: '100%', padding: '7px', background: 'rgba(78,205,196,0.06)', border: '1px solid rgba(78,205,196,0.25)', borderRadius: '3px', color: '#4ECDC4', fontSize: '0.7rem', cursor: 'pointer', fontFamily: 'IBM Plex Sans, sans-serif', textAlign: 'left' }}
            >
              ✓ Usar del canon aprobado ({approvedAssets.length})
            </button>
          )}
          <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileUpload} />
          <button
            onMouseDown={e => e.stopPropagation()}
            onClick={() => fileRef.current?.click()}
            style={{ width: '100%', padding: '7px', background: 'rgba(245,165,42,0.04)', border: '1px dashed rgba(245,165,42,0.25)', borderRadius: '3px', color: 'rgba(245,165,42,0.5)', fontSize: '0.7rem', cursor: 'pointer', fontFamily: 'IBM Plex Sans, sans-serif', textAlign: 'left' }}
          >
            + Subir imagen local
          </button>
        </div>
      )}

      {showPicker && approvedAssets.length > 0 && (
        <div
          onMouseDown={e => e.stopPropagation()}
          style={{ marginTop: '6px', maxHeight: '180px', overflowY: 'auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}
        >
          {approvedAssets.map((asset: any) => (
            <div
              key={asset.id}
              onClick={() => { onUpdate({ referenceImageUrl: asset.direct_url, referenceImageB64: undefined }); setShowPicker(false) }}
              style={{ cursor: 'pointer', borderRadius: '3px', overflow: 'hidden', border: '1px solid rgba(245,165,42,0.2)' }}
              title={`${asset.entity_label} — ${asset.version_label}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={asset.thumbnail_url} alt={asset.version_label} style={{ width: '100%', height: '55px', objectFit: 'cover', display: 'block' }} />
              <div style={{ padding: '2px 4px', fontSize: '0.5rem', color: 'rgba(240,235,225,0.4)', lineHeight: 1.2, background: '#08060F' }}>
                {asset.version_label}
              </div>
            </div>
          ))}
        </div>
      )}

      <Port side="right" color="#F5A52A" onMouseDown={e => { e.stopPropagation(); onPortDown(e, node.id) }} />
    </div>
  )
}

// ── Node: DirectionCard ───────────────────────────────────────────────────────

function DirectionCard({ node, selected, onDragStart, onUpdate, onPortDown, onPortUp }: {
  node: CanvasNode; selected: boolean
  onDragStart: (e: React.MouseEvent) => void
  onUpdate: (patch: VideoNodeData) => void
  onPortDown: (e: React.MouseEvent, nodeId: string) => void
  onPortUp: (e: React.MouseEvent, nodeId: string) => void
}) {
  const COLOR = '#D4256A'

  return (
    <div
      onMouseDown={onDragStart}
      style={{ ...CARD_BASE, width: 280, left: node.position.x, top: node.position.y, border: `1px solid ${selected ? COLOR : 'rgba(212,37,106,0.3)'}`, cursor: 'grab' }}
    >
      <Port side="left" color={COLOR} onMouseUp={e => { e.stopPropagation(); onPortUp(e, node.id) }} />
      <div style={{ ...LABEL, color: 'rgba(212,37,106,0.5)' }}>Dirección Cinematográfica</div>

      {/* A) PLANO */}
      <div style={SUB_LABEL}>Plano</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
        {SHOT_TYPES.map(s => <Pill key={s} label={s} active={node.data.shotType === s} color={COLOR} onClick={() => onUpdate({ shotType: s })} />)}
      </div>

      {/* B) CÁMARA */}
      <div style={SUB_LABEL}>Cámara</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
        {CAMERA_MOVEMENTS.map(c => <Pill key={c} label={c} active={node.data.cameraMovement === c} color={COLOR} onClick={() => onUpdate({ cameraMovement: c })} />)}
      </div>

      {/* C) ILUMINACIÓN */}
      <div style={SUB_LABEL}>Iluminación — hora</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
        {LIGHTING_TIMES.map(t => <Pill key={t} label={t} active={node.data.lightingTime === t} color={COLOR} onClick={() => onUpdate({ lightingTime: t })} />)}
      </div>
      <div style={SUB_LABEL}>Iluminación — tipo</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
        {LIGHTING_TYPES.map(t => <Pill key={t} label={t} active={node.data.lightingType === t} color={COLOR} onClick={() => onUpdate({ lightingType: t })} />)}
      </div>
      <div style={SUB_LABEL}>Iluminación — temperatura</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
        {LIGHTING_TEMPS.map(t => <Pill key={t} label={t} active={node.data.lightingTemp === t} color={COLOR} onClick={() => onUpdate({ lightingTemp: t })} />)}
      </div>

      {/* D) ESTILO VISUAL */}
      <div style={SUB_LABEL}>Estilo Visual</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
        {VISUAL_STYLES.map(vs => {
          const active = node.data.visualStyle === vs.id
          return (
            <div
              key={vs.id}
              onMouseDown={e => { e.stopPropagation(); onUpdate({ visualStyle: vs.id }) }}
              style={{
                padding: '5px 6px',
                borderRadius: '3px',
                border: `1px solid ${active ? COLOR : 'rgba(212,37,106,0.15)'}`,
                background: active ? 'rgba(212,37,106,0.08)' : 'transparent',
                cursor: 'pointer',
              }}
            >
              <div style={{ fontSize: '0.6rem', fontWeight: active ? 700 : 400, color: active ? COLOR : 'rgba(240,235,225,0.6)', lineHeight: 1.2 }}>{vs.label}</div>
              <div style={{ fontSize: '0.5rem', color: 'rgba(240,235,225,0.3)', lineHeight: 1.2, marginTop: '1px' }}>{vs.desc}</div>
            </div>
          )
        })}
      </div>

      {/* E) EXTRAS */}
      <div style={SUB_LABEL}>Extras — cantidad</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
        {EXTRAS_COUNTS.map(x => <Pill key={x} label={x} active={node.data.extras === x} color={COLOR} onClick={() => onUpdate({ extras: x })} />)}
      </div>
      {node.data.extras && node.data.extras !== 'Sin extras' && (
        <>
          <div style={SUB_LABEL}>Extras — tipo</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
            {EXTRAS_TYPES.map(x => <Pill key={x} label={x} active={node.data.extrasType === x} color={COLOR} onClick={() => onUpdate({ extrasType: x })} />)}
          </div>
        </>
      )}
      <div style={SUB_LABEL}>Fondo</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
        {BG_DETAILS.map(b => <Pill key={b} label={b} active={node.data.bgDetail === b} color={COLOR} onClick={() => onUpdate({ bgDetail: b })} />)}
      </div>

      {/* F) DURACIÓN Y RITMO */}
      <div style={SUB_LABEL}>Duración</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
        {DURATIONS.map(d => <Pill key={d} label={d} active={node.data.duration === d} color={COLOR} onClick={() => onUpdate({ duration: d })} />)}
      </div>
      <div style={SUB_LABEL}>Velocidad</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
        {SPEEDS.map(s => <Pill key={s} label={s} active={node.data.speed === s} color={COLOR} onClick={() => onUpdate({ speed: s })} />)}
      </div>
      <div style={SUB_LABEL}>Mood</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
        {MOODS.map(m => <Pill key={m} label={m} active={node.data.mood === m} color={COLOR} onClick={() => onUpdate({ mood: m })} />)}
      </div>

      <Port side="right" color={COLOR} onMouseDown={e => { e.stopPropagation(); onPortDown(e, node.id) }} />
    </div>
  )
}

// ── Node: EntityCard ──────────────────────────────────────────────────────────

function EntityCard({ node, selected, onDragStart, onUpdate, onPortDown, onPortUp, docs }: {
  node: CanvasNode; selected: boolean
  onDragStart: (e: React.MouseEvent) => void
  onUpdate: (patch: VideoNodeData) => void
  onPortDown: (e: React.MouseEvent, nodeId: string) => void
  onPortUp: (e: React.MouseEvent, nodeId: string) => void
  docs: DocOption[]
}) {
  return (
    <div
      onMouseDown={onDragStart}
      style={{ ...CARD_BASE, left: node.position.x, top: node.position.y, border: `1px solid ${selected ? '#9B6FD4' : 'rgba(155,111,212,0.3)'}`, cursor: 'grab' }}
    >
      <Port side="left" color="#9B6FD4" onMouseUp={e => { e.stopPropagation(); onPortUp(e, node.id) }} />
      <div style={{ ...LABEL, color: 'rgba(155,111,212,0.5)' }}>Personaje / Entidad</div>
      {docs.length === 0 ? (
        <div style={{ fontSize: '0.75rem', color: 'rgba(212,37,106,0.5)', padding: '4px 0' }}>Sin docs en Biblia</div>
      ) : (
        <select
          value={node.data.entityDocId ?? ''}
          onMouseDown={e => e.stopPropagation()}
          onChange={e => {
            const doc = docs.find(d => d.id === e.target.value)
            if (doc) onUpdate({ entityDocId: doc.id, entityTitle: doc.title })
          }}
          style={{ ...SELECT, border: '1px solid rgba(155,111,212,0.15)' }}
        >
          {!node.data.entityDocId && <option value="">— seleccionar —</option>}
          {docs.map(d => <option key={d.id} value={d.id}>{d.title}</option>)}
        </select>
      )}
      <Port side="right" color="#9B6FD4" onMouseDown={e => { e.stopPropagation(); onPortDown(e, node.id) }} />
    </div>
  )
}

// ── Node: OutputCard ──────────────────────────────────────────────────────────

const PLATFORMS = [
  { id: 'kling',    label: 'Kling AI',          color: '#4ECDC4', limit: 500 },
  { id: 'runway',   label: 'Runway Gen-4',       color: '#9B6FD4', limit: 300 },
  { id: 'sora',     label: 'Sora',               color: '#F5A52A', limit: 800 },
  { id: 'artlist',  label: 'Artlist MinMaxH3',   color: '#D4256A', limit: 2000 },
]

function OutputCard({ node, selected, onDragStart, onPortUp, onGenerate, onUpdate }: {
  node: CanvasNode; selected: boolean
  onDragStart: (e: React.MouseEvent) => void
  onPortUp: (e: React.MouseEvent, nodeId: string) => void
  onGenerate: (nodeId: string) => void
  onUpdate: (patch: VideoNodeData) => void
}) {
  const [copied, setCopied] = useState(false)

  const generating = node.data.isGenerating ?? false
  const platform   = node.data.selectedPlatform ?? ''
  const kling      = node.data.klingPrompt   ?? ''
  const runway     = node.data.runwayPrompt  ?? ''
  const sora       = node.data.soraPrompt    ?? ''
  const artlist    = node.data.artlistPrompt ?? ''

  const promptMap: Record<string, string> = { kling, runway, sora, artlist }
  const activePrompt = platform ? promptMap[platform] ?? '' : ''
  const activeMeta   = PLATFORMS.find(p => p.id === platform)

  function copy(text: string) {
    navigator.clipboard.writeText(text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000) })
  }

  const counterColor = (len: number, limit: number) =>
    len > limit ? 'rgba(212,37,106,0.9)' : 'rgba(240,235,225,0.3)'

  return (
    <div
      onMouseDown={onDragStart}
      style={{ ...CARD_BASE, width: OUTPUT_W, left: node.position.x, top: node.position.y, border: `1px solid ${selected ? 'rgba(245,165,42,0.8)' : 'rgba(245,165,42,0.3)'}`, cursor: 'grab' }}
    >
      <Port side="left" color="#F5A52A" onMouseUp={e => { e.stopPropagation(); onPortUp(e, node.id) }} />
      <div style={{ ...LABEL, color: 'rgba(245,165,42,0.5)' }}>Output — Prompt de Video</div>

      {/* Platform selector */}
      <div style={{ marginBottom: '10px' }}>
        <div style={SUB_LABEL}>Plataforma</div>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {PLATFORMS.map(p => {
            const active = platform === p.id
            return (
              <div
                key={p.id}
                onMouseDown={e => { e.stopPropagation(); onUpdate({ selectedPlatform: p.id, klingPrompt: '', runwayPrompt: '', soraPrompt: '', artlistPrompt: '' }) }}
                style={{
                  padding: '4px 12px',
                  borderRadius: '12px',
                  border: `1px solid ${active ? p.color : 'rgba(240,235,225,0.1)'}`,
                  background: active ? `${p.color}22` : 'transparent',
                  color: active ? p.color : 'rgba(240,235,225,0.4)',
                  fontSize: '0.7rem',
                  fontWeight: active ? 700 : 400,
                  cursor: 'pointer',
                  transition: 'all 0.1s',
                }}
              >
                {p.label}
              </div>
            )
          })}
        </div>
      </div>

      <button
        onMouseDown={e => e.stopPropagation()}
        onClick={() => onGenerate(node.id)}
        disabled={generating || !platform}
        style={{ width: '100%', padding: '7px', marginBottom: '12px', background: generating || !platform ? 'rgba(245,165,42,0.12)' : '#F5A52A', border: 'none', borderRadius: '3px', color: generating || !platform ? 'rgba(245,165,42,0.35)' : '#08060F', fontSize: '0.8125rem', fontWeight: 700, cursor: generating || !platform ? 'not-allowed' : 'pointer', fontFamily: 'IBM Plex Sans, sans-serif' }}
      >
        {generating ? 'Generando...' : platform ? `Generar para ${activeMeta?.label}` : 'Selecciona una plataforma'}
      </button>

      {!activePrompt && !generating && (
        <div style={{ padding: '12px 0', textAlign: 'center', fontSize: '0.75rem', color: 'rgba(240,235,225,0.2)', fontStyle: 'italic' }}>
          {platform ? 'Conecta los nodos y genera el prompt' : 'Selecciona la plataforma de destino'}
        </div>
      )}

      {(activePrompt || generating) && activeMeta && (
        <div style={{ background: '#0D0920', border: `1px solid ${activeMeta.color}33`, borderRadius: '4px', padding: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.5625rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: activeMeta.color, fontWeight: 700 }}>{activeMeta.label}</span>
            <span style={{ fontSize: '0.5rem', color: counterColor(activePrompt.length, activeMeta.limit) }}>{activePrompt.length}/{activeMeta.limit}</span>
          </div>
          <textarea
            readOnly
            value={activePrompt}
            onMouseDown={e => e.stopPropagation()}
            style={{ minHeight: '120px', background: 'transparent', border: 'none', color: 'rgba(240,235,225,0.8)', fontFamily: 'monospace', fontSize: '0.6875rem', lineHeight: 1.6, padding: 0, resize: 'vertical', outline: 'none', width: '100%', boxSizing: 'border-box' }}
          />
          {activePrompt && (
            <button
              onMouseDown={e => e.stopPropagation()}
              onClick={() => copy(activePrompt)}
              style={{ alignSelf: 'flex-end', padding: '5px 14px', background: copied ? `${activeMeta.color}22` : 'transparent', border: `1px solid ${copied ? activeMeta.color : `${activeMeta.color}44`}`, borderRadius: '3px', color: copied ? activeMeta.color : `${activeMeta.color}88`, fontSize: '0.7rem', cursor: 'pointer', fontFamily: 'IBM Plex Sans, sans-serif', fontWeight: 600 }}
            >
              {copied ? '✓ Copiado' : 'Copiar'}
            </button>
          )}
        </div>
      )}
    </div>
  )
}

// ── Graph helpers ─────────────────────────────────────────────────────────────


let counter = 1
const mkId = () => `v${Date.now()}${counter++}`

// ── Main canvas component ─────────────────────────────────────────────────────

export default function VideoFlowCanvas() {
  const [nodes, setNodes]       = useState<CanvasNode[]>([])
  const [edges, setEdges]       = useState<CanvasEdge[]>([])
  const [selected, setSelected] = useState<string | null>(null)
  const [docs, setDocs]         = useState<DocOption[]>([])

  const [pan, setPan]   = useState({ x: 40, y: 40 })
  const [zoom, setZoom] = useState(1)
  const zoomRef     = useRef(1)
  const panRef      = useRef({ x: 40, y: 40 })
  const panDragRef  = useRef<{ startMouse: { x: number; y: number }; startPan: { x: number; y: number } } | null>(null)
  const dragRef     = useRef<{ nodeId: string; ox: number; oy: number } | null>(null)
  const [pendingEdge, setPendingEdge] = useState<{ sourceId: string; mx: number; my: number } | null>(null)
  const pendingEdgeRef = useRef<{ sourceId: string; mx: number; my: number } | null>(null)
  const canvasRef   = useRef<HTMLDivElement>(null)

  // AI chat
  const [chatOpen, setChatOpen]       = useState(false)
  const [chatMsgs, setChatMsgs]       = useState<ChatMsg[]>([])
  const [chatInput, setChatInput]     = useState('')
  const [chatStreaming, setChatStreaming] = useState(false)
  const chatBottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch('/api/reference-docs').then(r => r.json()).then((list: DocOption[]) => {
      if (Array.isArray(list)) setDocs(list)
    }).catch(() => {})
  }, [])

  useEffect(() => { chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [chatMsgs])

  // ── Update node data ──────────────────────────────────────────────────────

  const updateNode = useCallback((id: string, patch: VideoNodeData) => {
    setNodes(nds => nds.map(n => n.id === id ? { ...n, data: { ...n.data, ...patch } } : n))
  }, [])

  // ── Gather all data for generation ───────────────────────────────────────

  function gatherVideoData(outputId: string): VideoNodeData {
    const collected: VideoNodeData = {}
    // Walk edges backwards from output to collect from all connected nodes
    const visited = new Set<string>()
    const queue   = [outputId]
    while (queue.length) {
      const id = queue.shift()!
      if (visited.has(id)) continue
      visited.add(id)
      const node = nodes.find(n => n.id === id)
      if (node) Object.assign(collected, node.data)
      edges.filter(e => e.target === id).forEach(e => queue.push(e.source))
    }
    return collected
  }

  // ── Generate prompts ──────────────────────────────────────────────────────

  const handleGenerate = useCallback(async (outputId: string) => {
    const outputNode = nodes.find(n => n.id === outputId)
    const platform = outputNode?.data.selectedPlatform
    if (!platform) return

    setNodes(nds => nds.map(n => n.id === outputId
      ? { ...n, data: { ...n.data, isGenerating: true, klingPrompt: '', runwayPrompt: '', soraPrompt: '', artlistPrompt: '' } }
      : n
    ))

    const data = gatherVideoData(outputId)
    const promptKey = `${platform}Prompt` as 'klingPrompt' | 'runwayPrompt' | 'soraPrompt' | 'artlistPrompt'

    try {
      const res = await fetch('/api/generate-video-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform,
          sceneType:         data.sceneType,
          referenceImageUrl: data.referenceImageUrl,
          referenceImageB64: data.referenceImageB64,
          shotType:          data.shotType,
          cameraMovement:    data.cameraMovement,
          lightingTime:      data.lightingTime,
          lightingType:      data.lightingType,
          lightingTemp:      data.lightingTemp,
          visualStyle:       data.visualStyle,
          extras:            data.extras,
          extrasType:        data.extrasType,
          bgDetail:          data.bgDetail,
          duration:          data.duration,
          speed:             data.speed,
          mood:              data.mood,
          entityDocId:       data.entityDocId,
          entityTitle:       data.entityTitle,
          sceneDescription:  data.sceneDescription,
        }),
      })
      const reader = res.body?.getReader()
      if (!reader) throw new Error('no stream')
      const dec = new TextDecoder()
      let acc = ''
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        acc += dec.decode(value, { stream: true })
        setNodes(nds => nds.map(n => n.id === outputId
          ? { ...n, data: { ...n.data, [promptKey]: acc } }
          : n
        ))
      }
    } catch {
      setNodes(nds => nds.map(n => n.id === outputId
        ? { ...n, data: { ...n.data, [promptKey]: 'Error al generar.' } }
        : n
      ))
    } finally {
      setNodes(nds => nds.map(n => n.id === outputId ? { ...n, data: { ...n.data, isGenerating: false } } : n))
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodes, edges])

  // ── Add node ──────────────────────────────────────────────────────────────

  function addNode(type: VideoNodeKind) {
    const id = mkId()
    const COL_X: Record<VideoNodeKind, number> = { scene: 40, reference: 40, direction: 40, entity: 340, output: 640 }
    const ROW_H: Record<VideoNodeKind, number> = { scene: 220, reference: 200, direction: 680, entity: 180, output: 400 }
    const sameType = nodes.filter(n => n.type === type)
    const y        = 40 + sameType.length * ROW_H[type]
    const position = { x: COL_X[type], y }
    const data: VideoNodeData = {}

    setNodes(nds => [...nds, { id, type, position, data }])
  }

  // ── World-space mouse helper ──────────────────────────────────────────────

  function toWorld(clientX: number, clientY: number) {
    const rect = canvasRef.current!.getBoundingClientRect()
    const p = panRef.current
    const z = zoomRef.current
    return { x: (clientX - rect.left - p.x) / z, y: (clientY - rect.top - p.y) / z }
  }

  // ── Wheel ─────────────────────────────────────────────────────────────────

  useEffect(() => {
    const el = canvasRef.current
    if (!el) return
    function onWheel(e: WheelEvent) {
      e.preventDefault()
      if (e.ctrlKey || e.metaKey) {
        const rect = el!.getBoundingClientRect()
        const mx = e.clientX - rect.left
        const my = e.clientY - rect.top
        const oldZ = zoomRef.current
        const delta = e.deltaY < 0 ? 1.08 : 0.92
        const newZ = Math.min(2, Math.max(0.25, oldZ * delta))
        const p = panRef.current
        const newPan = { x: mx - (mx - p.x) * (newZ / oldZ), y: my - (my - p.y) * (newZ / oldZ) }
        zoomRef.current = newZ
        panRef.current  = newPan
        setZoom(newZ)
        setPan({ ...newPan })
      } else {
        const next = { x: panRef.current.x - e.deltaX, y: panRef.current.y - e.deltaY }
        panRef.current = next
        setPan({ ...next })
      }
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [])

  // ── Mouse tracking ────────────────────────────────────────────────────────

  useEffect(() => {
    function onMove(e: MouseEvent) {
      if (dragRef.current) {
        const { nodeId, ox, oy } = dragRef.current
        const wm = toWorld(e.clientX, e.clientY)
        setNodes(nds => nds.map(n => n.id === nodeId ? { ...n, position: { x: wm.x - ox, y: wm.y - oy } } : n))
        return
      }
      if (panDragRef.current) {
        const { startMouse, startPan } = panDragRef.current
        const next = { x: startPan.x + (e.clientX - startMouse.x), y: startPan.y + (e.clientY - startMouse.y) }
        panRef.current = next
        setPan({ ...next })
        return
      }
      if (pendingEdgeRef.current) {
        const wm = toWorld(e.clientX, e.clientY)
        pendingEdgeRef.current = { ...pendingEdgeRef.current, mx: wm.x, my: wm.y }
        setPendingEdge({ ...pendingEdgeRef.current })
      }
    }
    function onUp() {
      dragRef.current    = null
      panDragRef.current = null
      if (pendingEdgeRef.current) { pendingEdgeRef.current = null; setPendingEdge(null) }
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp) }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function onNodeMouseDown(e: React.MouseEvent, nodeId: string) {
    e.stopPropagation()
    setSelected(nodeId)
    const node = nodes.find(n => n.id === nodeId)!
    const wm   = toWorld(e.clientX, e.clientY)
    dragRef.current = { nodeId, ox: wm.x - node.position.x, oy: wm.y - node.position.y }
  }

  function onPortDown(e: React.MouseEvent, nodeId: string) {
    e.stopPropagation()
    const wm = toWorld(e.clientX, e.clientY)
    const pe = { sourceId: nodeId, mx: wm.x, my: wm.y }
    pendingEdgeRef.current = pe
    setPendingEdge(pe)
  }

  function onPortUp(e: React.MouseEvent, targetId: string) {
    e.stopPropagation()
    const pe = pendingEdgeRef.current
    if (!pe || pe.sourceId === targetId) { pendingEdgeRef.current = null; setPendingEdge(null); return }
    const exists = edges.some(ed => ed.source === pe.sourceId && ed.target === targetId)
    if (!exists) setEdges(eds => [...eds, { id: `e${mkId()}`, source: pe.sourceId, target: targetId }])
    pendingEdgeRef.current = null
    setPendingEdge(null)
  }

  function onCanvasMouseDown(e: React.MouseEvent) {
    if (e.button !== 0) return
    setSelected(null)
    panDragRef.current = { startMouse: { x: e.clientX, y: e.clientY }, startPan: { ...panRef.current } }
  }

  // ── SVG edge helpers ──────────────────────────────────────────────────────

  function portPos(nodeId: string, side: 'left' | 'right') {
    const n = nodes.find(nd => nd.id === nodeId)
    if (!n) return { x: 0, y: 0 }
    const w = n.type === 'output' ? OUTPUT_W : (n.type === 'direction' ? 280 : CARD_W)
    return { x: n.position.x + (side === 'right' ? w : 0), y: n.position.y + PORT_Y }
  }

  function edgePath(x1: number, y1: number, x2: number, y2: number) {
    const cx = Math.abs(x2 - x1) * 0.5
    return `M${x1},${y1} C${x1 + cx},${y1} ${x2 - cx},${y2} ${x2},${y2}`
  }

  // ── Delete selected node ──────────────────────────────────────────────────

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.key === 'Delete' || e.key === 'Backspace') && selected) {
        const tag = (e.target as HTMLElement).tagName
        if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return
        setNodes(nds => nds.filter(n => n.id !== selected))
        setEdges(eds => eds.filter(ed => ed.source !== selected && ed.target !== selected))
        setSelected(null)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [selected])

  // ── AI chat ───────────────────────────────────────────────────────────────

  async function sendChat() {
    const text = chatInput.trim()
    if (!text || chatStreaming) return
    setChatInput('')
    const userMsg: ChatMsg = { role: 'user', content: text }
    const updated = [...chatMsgs, userMsg]
    setChatMsgs([...updated, { role: 'assistant', content: '' }])
    setChatStreaming(true)
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updated, context: 'arte' }),
      })
      const reader = res.body?.getReader()
      if (!reader) return
      const dec = new TextDecoder()
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = dec.decode(value, { stream: true })
        setChatMsgs(prev => { const m = [...prev]; m[m.length - 1] = { role: 'assistant', content: m[m.length - 1].content + chunk }; return m })
      }
    } catch { /* ignore */ } finally { setChatStreaming(false) }
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', background: '#08060F', fontFamily: 'IBM Plex Sans, sans-serif', overflow: 'hidden' }}>

      {/* Toolbar */}
      <div style={{ flexShrink: 0, padding: '0.625rem 1rem', background: '#1A1235', borderBottom: '2px solid rgba(78,205,196,0.2)', display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
        <div style={{ fontFamily: 'Bebas Neue, Impact, sans-serif', fontSize: '1rem', letterSpacing: '0.06em', color: '#4ECDC4', marginRight: '4px' }}>VIDEO FLOW</div>
        <div style={{ width: 1, height: 24, background: 'rgba(78,205,196,0.25)', margin: '0 4px' }} />
        <span style={{ fontSize: '0.6875rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(240,235,225,0.4)', marginRight: 4 }}>Añadir:</span>
        {([
          { type: 'scene'     as VideoNodeKind, label: 'Escena',    color: '#4ECDC4' },
          { type: 'reference' as VideoNodeKind, label: 'Referencia', color: '#F5A52A' },
          { type: 'direction' as VideoNodeKind, label: 'Dirección',  color: '#D4256A' },
          { type: 'entity'    as VideoNodeKind, label: 'Personaje',  color: '#9B6FD4' },
          { type: 'output'    as VideoNodeKind, label: 'Output',     color: '#F5A52A' },
        ]).map(({ type, label, color }) => (
          <button key={type} onClick={() => addNode(type)} style={{ padding: '5px 14px', background: '#0D0920', border: `2px solid ${color}`, borderRadius: '3px', color, fontSize: '0.8125rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'IBM Plex Sans, sans-serif', letterSpacing: '0.03em' }}>
            + {label}
          </button>
        ))}
        {selected && <span style={{ marginLeft: 8, fontSize: '0.75rem', color: 'rgba(240,235,225,0.45)', background: 'rgba(212,37,106,0.1)', border: '1px solid rgba(212,37,106,0.2)', borderRadius: 3, padding: '2px 8px' }}>Del → eliminar</span>}
        <div style={{ marginLeft: 'auto', fontSize: '0.6875rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(78,205,196,0.4)' }}>
          Kling · Runway · Sora
        </div>
      </div>

      {/* Canvas area */}
      <div
        ref={canvasRef}
        onMouseDown={onCanvasMouseDown}
        style={{ flex: 1, position: 'relative', overflow: 'hidden', background: '#08060F', backgroundImage: 'radial-gradient(rgba(78,205,196,0.03) 1px, transparent 1px)', backgroundSize: '24px 24px', cursor: 'default' }}
      >
        {nodes.length === 0 && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
            <div style={{ fontSize: '0.6875rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(78,205,196,0.35)', marginBottom: 14 }}>Canvas vacío</div>
            <div style={{ fontSize: '0.9rem', color: 'rgba(240,235,225,0.45)', textAlign: 'center', lineHeight: 1.8 }}>Usa los botones de la barra superior para agregar nodos<br/>Conecta los puertos para construir el flujo</div>
            <div style={{ marginTop: 24, display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
              <div style={{ fontSize: '0.75rem', color: 'rgba(78,205,196,0.4)', background: 'rgba(78,205,196,0.05)', border: '1px solid rgba(78,205,196,0.12)', borderRadius: 4, padding: '6px 14px', letterSpacing: '0.04em' }}>Escena + Referencia + Dirección → Output</div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(155,111,212,0.4)', background: 'rgba(155,111,212,0.05)', border: '1px solid rgba(155,111,212,0.12)', borderRadius: 4, padding: '6px 14px', letterSpacing: '0.04em' }}>Personaje opcional</div>
            </div>
          </div>
        )}

        {/* Reset view */}
        <button
          onClick={() => { const next = { x: 40, y: 40 }; panRef.current = next; setPan(next); zoomRef.current = 1; setZoom(1) }}
          style={{ position: 'absolute', bottom: 16, left: 16, zIndex: 10, padding: '8px 14px', background: '#1A1235', border: '1px solid rgba(78,205,196,0.25)', borderRadius: '4px', color: 'rgba(78,205,196,0.7)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '0.75rem', letterSpacing: '0.04em', boxShadow: '0 4px 16px rgba(0,0,0,0.5)' }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(78,205,196,0.6)'; e.currentTarget.style.color = '#4ECDC4' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(78,205,196,0.25)'; e.currentTarget.style.color = 'rgba(78,205,196,0.7)' }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
          Resetear vista
        </button>

        {/* World container */}
        <div style={{ position: 'absolute', inset: 0, transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`, transformOrigin: '0 0' }}>
          {/* SVG edges */}
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', overflow: 'visible' }}>
            {edges.map(ed => {
              const src = portPos(ed.source, 'right')
              const tgt = portPos(ed.target, 'left')
              return <path key={ed.id} d={edgePath(src.x, src.y, tgt.x, tgt.y)} fill="none" stroke="rgba(78,205,196,0.4)" strokeWidth={2} />
            })}
            {pendingEdge && (() => {
              const src = portPos(pendingEdge.sourceId, 'right')
              return <path d={edgePath(src.x, src.y, pendingEdge.mx, pendingEdge.my)} fill="none" stroke="#4ECDC4" strokeWidth={2} strokeDasharray="6,4" />
            })()}
          </svg>

          {/* Nodes */}
          {nodes.map(node => {
            const sel = node.id === selected
            if (node.type === 'scene') return (
              <SceneCard key={node.id} node={node} selected={sel}
                onDragStart={e => onNodeMouseDown(e, node.id)}
                onUpdate={patch => updateNode(node.id, patch)}
                onPortDown={onPortDown}
              />
            )
            if (node.type === 'reference') return (
              <ReferenceCard key={node.id} node={node} selected={sel}
                onDragStart={e => onNodeMouseDown(e, node.id)}
                onUpdate={patch => updateNode(node.id, patch)}
                onPortDown={onPortDown} onPortUp={onPortUp}
              />
            )
            if (node.type === 'direction') return (
              <DirectionCard key={node.id} node={node} selected={sel}
                onDragStart={e => onNodeMouseDown(e, node.id)}
                onUpdate={patch => updateNode(node.id, patch)}
                onPortDown={onPortDown} onPortUp={onPortUp}
              />
            )
            if (node.type === 'entity') return (
              <EntityCard key={node.id} node={node} selected={sel}
                onDragStart={e => onNodeMouseDown(e, node.id)}
                onUpdate={patch => updateNode(node.id, patch)}
                onPortDown={onPortDown} onPortUp={onPortUp}
                docs={docs}
              />
            )
            if (node.type === 'output') return (
              <OutputCard key={node.id} node={node} selected={sel}
                onDragStart={e => onNodeMouseDown(e, node.id)}
                onPortUp={onPortUp}
                onGenerate={handleGenerate}
                onUpdate={patch => updateNode(node.id, patch)}
              />
            )
            return null
          })}
        </div>
      </div>

      {/* AI assistant */}
      <div style={{ flexShrink: 0, background: '#1A1235', borderTop: '2px solid rgba(78,205,196,0.2)', height: chatOpen ? 260 : 44, overflow: 'hidden', display: 'flex', flexDirection: 'column', transition: 'height 0.2s ease' }}>
        <button onClick={() => setChatOpen(o => !o)} style={{ flexShrink: 0, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 1rem', background: 'none', border: 'none', cursor: 'pointer', width: '100%', borderBottom: chatOpen ? '1px solid rgba(78,205,196,0.15)' : 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(78,205,196,0.5)" strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
            <span style={{ fontSize: '0.6875rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(240,235,225,0.6)', fontWeight: 600 }}>Asistente de Canvas</span>
          </div>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(240,235,225,0.25)" strokeWidth="2" style={{ transform: chatOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }}><polyline points="18 15 12 9 6 15"/></svg>
        </button>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ flex: 1, overflowY: 'auto', padding: '0.5rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {chatMsgs.length === 0 && (
              <div style={{ fontSize: '0.75rem', color: 'rgba(240,235,225,0.45)', fontStyle: 'italic', textAlign: 'center', marginTop: 12 }}>
                Pregunta sobre vocabulario cinematográfico, estilo visual o intención narrativa del clip.
              </div>
            )}
            {chatMsgs.map((msg, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{ maxWidth: '82%', padding: '0.375rem 0.625rem', borderRadius: 3, fontSize: '0.8125rem', lineHeight: 1.55, background: msg.role === 'user' ? 'rgba(245,165,42,0.08)' : 'rgba(78,205,196,0.06)', border: `1px solid ${msg.role === 'user' ? 'rgba(245,165,42,0.12)' : 'rgba(78,205,196,0.1)'}`, color: 'rgba(240,235,225,0.7)', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                  {msg.content || (chatStreaming && i === chatMsgs.length - 1 ? '...' : '')}
                </div>
              </div>
            ))}
            <div ref={chatBottomRef} />
          </div>
          <div style={{ flexShrink: 0, padding: '0.375rem 1rem', borderTop: '1px solid rgba(78,205,196,0.05)', display: 'flex', gap: '0.5rem' }}>
            <input
              type="text"
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') sendChat() }}
              placeholder="Pregunta al asistente... (Enter)"
              style={{ flex: 1, background: '#1A1235', border: '1px solid rgba(78,205,196,0.1)', borderRadius: 3, color: '#F0EBE1', fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '0.8125rem', padding: '5px 10px', outline: 'none' }}
            />
            <button
              onClick={sendChat}
              disabled={!chatInput.trim() || chatStreaming}
              style={{ padding: '5px 14px', background: 'transparent', border: '1px solid rgba(78,205,196,0.2)', borderRadius: 3, color: '#4ECDC4', cursor: 'pointer', fontSize: '0.8125rem', fontFamily: 'IBM Plex Sans, sans-serif' }}
            >
              Enviar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
