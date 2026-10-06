'use client'

import { useState, useRef, useCallback, useEffect, type ReactNode } from 'react'

// ── Types ─────────────────────────────────────────────────────────────────────

type NodeKind = 'artworkType' | 'style' | 'entity' | 'output'
type NodeData = {
  artworkType?: string
  canonImageUrl?: string   // Drive URL de imagen canon aprobada seleccionada
  style?: string
  docId?: string
  docTitle?: string
  focus?: string
  generatedPrompt?: string
  isGenerating?: boolean
  selectedView?: string   // Vista predefinida para Vista Individual
  renderer?: string       // Renderer para Vista Individual
}
type CanvasNode = { id: string; type: NodeKind; position: { x: number; y: number }; data: NodeData }
type CanvasEdge = { id: string; source: string; target: string }
type DocOption   = { id: string; title: string }
type FlowSummary = { id: string; title: string; created_by: string; updated_at: string }
type ChatMsg     = { role: 'user' | 'assistant'; content: string }

// ── Constants ─────────────────────────────────────────────────────────────────

const ARTWORK_TYPES = ['Ficha técnica de personaje','Concept Art','Artwork escenográfico','Diseño de interior','Prop Sheet','Creature Sheet','Reference Sheet — Personaje','Reference Sheet — Locación','Vista Individual — Personaje','Vista Individual — Locación','Escena cinematográfica']
const STYLES = ['Cel-shading','Dibujo a mano alzada','Render digital limpio','Boceto de producción','Estilo flat color','Técnica mixta']

const VIEW_PRESETS_PERSONAJE = [
  // ── 10 años ──
  { id: 'frente_casual_10',          label: 'Frente casual',       age: '10 años',           desc: 'Cuerpo completo, frontal' },
  { id: 'perfil_casual_10',          label: 'Perfil casual',       age: '10 años',           desc: 'Vista lateral izquierda' },
  { id: 'tres_cuartos_casual_10',    label: '3/4 casual',          age: '10 años',           desc: 'Ángulo 3/4' },
  { id: 'expresion_alegria_10',      label: 'Expresión: Alegría',  age: '10 años',           desc: 'Busto, primer plano' },
  { id: 'expresion_enojo_10',        label: 'Expresión: Enojo',    age: '10 años',           desc: 'Busto, primer plano' },
  { id: 'expresion_tristeza_10',     label: 'Expresión: Tristeza', age: '10 años',           desc: 'Busto, primer plano' },
  // ── Edad actual ──
  { id: 'frente_casual_15',          label: 'Frente casual',       age: 'Edad actual',       desc: 'Vista principal canónica' },
  { id: 'frente_uniforme_15',        label: 'Frente uniforme',     age: 'Edad actual',       desc: 'Con equipación' },
  { id: 'perfil_casual_15',          label: 'Perfil casual',       age: 'Edad actual',       desc: 'Vista lateral izquierda' },
  { id: 'tres_cuartos_casual_15',    label: '3/4 casual',          age: 'Edad actual',       desc: 'Ángulo canónico' },
  { id: 'tres_cuartos_uniforme_15',  label: '3/4 uniforme',        age: 'Edad actual',       desc: 'Ángulo + equipación' },
  { id: 'expresion_alegria_15',      label: 'Expresión: Alegría',  age: 'Edad actual',       desc: 'Busto, primer plano' },
  { id: 'expresion_enojo_15',        label: 'Expresión: Enojo',    age: 'Edad actual',       desc: 'Busto, primer plano' },
  { id: 'expresion_tristeza_15',     label: 'Expresión: Tristeza', age: 'Edad actual',       desc: 'Busto, primer plano' },
  // ── Proyección futura ──
  { id: 'frente_casual_16',          label: 'Frente casual',       age: 'Proyección +1 año', desc: 'Un año mayor' },
  { id: 'frente_uniforme_16',        label: 'Frente uniforme',     age: 'Proyección +1 año', desc: 'Con equipación' },
  { id: 'perfil_casual_16',          label: 'Perfil casual',       age: 'Proyección +1 año', desc: 'Vista lateral' },
  { id: 'tres_cuartos_casual_16',    label: '3/4 casual',          age: 'Proyección +1 año', desc: 'Ángulo canónico' },
]

const VIEW_PRESETS_LOCACION = [
  { id: 'exterior_dia',   label: 'Exterior día',    desc: 'Establishing shot diurno' },
  { id: 'exterior_noche', label: 'Exterior noche',  desc: 'Establishing shot nocturno' },
  { id: 'interior_dia',   label: 'Interior día',    desc: 'Interior con luz natural' },
  { id: 'interior_noche', label: 'Interior noche',  desc: 'Interior con luz artificial' },
]

const RENDERER_OPTIONS = [
  { id: 'cel-shading', label: 'Cel-shading',   desc: 'Sombras duras, outlines limpios' },
  { id: 'flat-color',  label: 'Flat color',    desc: 'Sin sombras, plano puro' },
  { id: 'sketch',      label: 'Boceto limpio', desc: 'Línea sin relleno' },
]

// Visual previews for each style (CSS background + short description)
const STYLE_VISUALS: Record<string, { bg: string; desc: string }> = {
  'Cel-shading': {
    bg: `linear-gradient(105deg, #4ECDC4 0%, #4ECDC4 38%, #1a6b66 38%, #1a6b66 42%, #0d3b38 42%, #0d3b38 100%)`,
    desc: 'Sombras duras, outlines limpios',
  },
  'Dibujo a mano alzada': {
    bg: `repeating-linear-gradient(-45deg, rgba(240,235,225,0.12) 0px, rgba(240,235,225,0.12) 1px, transparent 1px, transparent 7px), #1a1333`,
    desc: 'Lápiz, línea orgánica',
  },
  'Render digital limpio': {
    bg: `linear-gradient(135deg, #0e0a2a 0%, #3b1f6b 50%, #9B6FD4 100%)`,
    desc: 'Digital pulido, sin textura',
  },
  'Boceto de producción': {
    bg: `repeating-linear-gradient(0deg, rgba(240,235,225,0.08) 0px, rgba(240,235,225,0.08) 1px, transparent 1px, transparent 10px), repeating-linear-gradient(90deg, rgba(240,235,225,0.08) 0px, rgba(240,235,225,0.08) 1px, transparent 1px, transparent 10px), #15102a`,
    desc: 'Rough, para producción',
  },
  'Estilo flat color': {
    bg: `linear-gradient(180deg, #9B6FD4 0%, #9B6FD4 33%, #F5A52A 33%, #F5A52A 66%, #4ECDC4 66%, #4ECDC4 100%)`,
    desc: 'Sin gradiente, colores planos',
  },
  'Técnica mixta': {
    bg: `repeating-linear-gradient(-30deg, rgba(155,111,212,0.15) 0px, rgba(155,111,212,0.15) 2px, transparent 2px, transparent 14px), linear-gradient(135deg, #12092a, #2a1245, #12092a)`,
    desc: 'Digital + texturas manuales',
  },
}

// Visual previews for each artwork type
const ARTWORK_TYPE_VISUALS: Record<string, { preview: ReactNode; desc: string }> = {
  'Ficha técnica de personaje': {
    preview: (
      <svg viewBox="0 0 80 44" style={{ width: '100%', height: '100%' }}>
        <rect x="2" y="2" width="36" height="40" rx="2" fill="none" stroke="rgba(245,165,42,0.5)" strokeWidth="1"/>
        <rect x="42" y="2" width="16" height="19" rx="1" fill="none" stroke="rgba(245,165,42,0.3)" strokeWidth="1"/>
        <rect x="62" y="2" width="16" height="19" rx="1" fill="none" stroke="rgba(245,165,42,0.3)" strokeWidth="1"/>
        <rect x="42" y="25" width="36" height="17" rx="1" fill="rgba(245,165,42,0.08)" stroke="rgba(245,165,42,0.3)" strokeWidth="1"/>
        <line x1="8" y1="38" x2="32" y2="38" stroke="rgba(245,165,42,0.4)" strokeWidth="0.5"/>
        <circle cx="20" cy="12" r="6" fill="rgba(245,165,42,0.2)" stroke="rgba(245,165,42,0.4)" strokeWidth="0.8"/>
      </svg>
    ),
    desc: 'Vistas ortogonales + paleta',
  },
  'Concept Art': {
    preview: (
      <svg viewBox="0 0 80 44" style={{ width: '100%', height: '100%' }}>
        <rect x="2" y="2" width="76" height="40" rx="2" fill="rgba(245,165,42,0.05)" stroke="rgba(245,165,42,0.4)" strokeWidth="1"/>
        <ellipse cx="40" cy="22" rx="18" ry="14" fill="rgba(245,165,42,0.12)" stroke="rgba(245,165,42,0.3)" strokeWidth="0.8"/>
        <line x1="2" y1="30" x2="78" y2="30" stroke="rgba(245,165,42,0.2)" strokeWidth="0.5"/>
      </svg>
    ),
    desc: 'Ilustración principal + variantes',
  },
  'Artwork escenográfico': {
    preview: (
      <svg viewBox="0 0 80 44" style={{ width: '100%', height: '100%' }}>
        <rect x="2" y="2" width="76" height="28" rx="2" fill="none" stroke="rgba(245,165,42,0.5)" strokeWidth="1"/>
        <rect x="2" y="34" width="36" height="8" rx="1" fill="none" stroke="rgba(245,165,42,0.3)" strokeWidth="1"/>
        <rect x="42" y="34" width="36" height="8" rx="1" fill="none" stroke="rgba(245,165,42,0.3)" strokeWidth="1"/>
        <line x1="2" y1="20" x2="78" y2="20" stroke="rgba(245,165,42,0.2)" strokeWidth="0.5"/>
      </svg>
    ),
    desc: 'Establishing shot + vistas',
  },
  'Diseño de interior': {
    preview: (
      <svg viewBox="0 0 80 44" style={{ width: '100%', height: '100%' }}>
        <polygon points="10,42 70,42 60,6 20,6" fill="none" stroke="rgba(245,165,42,0.4)" strokeWidth="1"/>
        <line x1="20" y1="6" x2="10" y2="42" stroke="rgba(245,165,42,0.3)" strokeWidth="0.5"/>
        <line x1="60" y1="6" x2="70" y2="42" stroke="rgba(245,165,42,0.3)" strokeWidth="0.5"/>
        <rect x="28" y="26" width="12" height="16" rx="1" fill="rgba(245,165,42,0.15)" stroke="rgba(245,165,42,0.4)" strokeWidth="0.8"/>
        <line x1="10" y1="32" x2="70" y2="32" stroke="rgba(245,165,42,0.2)" strokeWidth="0.5"/>
      </svg>
    ),
    desc: 'Perspectiva 3/4 + elevaciones',
  },
  'Prop Sheet': {
    preview: (
      <svg viewBox="0 0 80 44" style={{ width: '100%', height: '100%' }}>
        <rect x="20" y="8" width="40" height="28" rx="2" fill="none" stroke="rgba(245,165,42,0.4)" strokeWidth="1"/>
        <rect x="22" y="10" width="18" height="24" rx="1" fill="rgba(245,165,42,0.1)" stroke="rgba(245,165,42,0.3)" strokeWidth="0.7"/>
        <rect x="42" y="10" width="16" height="11" rx="1" fill="rgba(245,165,42,0.05)" stroke="rgba(245,165,42,0.25)" strokeWidth="0.7"/>
        <rect x="42" y="23" width="16" height="11" rx="1" fill="rgba(245,165,42,0.05)" stroke="rgba(245,165,42,0.25)" strokeWidth="0.7"/>
        <line x1="24" y1="38" x2="56" y2="38" stroke="rgba(245,165,42,0.3)" strokeWidth="0.5"/>
      </svg>
    ),
    desc: 'Vistas ortogonales de objeto',
  },
  'Creature Sheet': {
    preview: (
      <svg viewBox="0 0 80 44" style={{ width: '100%', height: '100%' }}>
        <ellipse cx="40" cy="16" rx="10" ry="10" fill="rgba(245,165,42,0.12)" stroke="rgba(245,165,42,0.4)" strokeWidth="1"/>
        <line x1="32" y1="26" x2="22" y2="38" stroke="rgba(245,165,42,0.4)" strokeWidth="1.2"/>
        <line x1="48" y1="26" x2="58" y2="38" stroke="rgba(245,165,42,0.4)" strokeWidth="1.2"/>
        <line x1="40" y1="26" x2="40" y2="40" stroke="rgba(245,165,42,0.4)" strokeWidth="1.2"/>
        <circle cx="36" cy="14" r="1.5" fill="rgba(245,165,42,0.6)"/>
        <circle cx="44" cy="14" r="1.5" fill="rgba(245,165,42,0.6)"/>
      </svg>
    ),
    desc: 'Anatomía + estados + locomotión',
  },
  'Reference Sheet — Personaje': {
    preview: (
      <svg viewBox="0 0 80 44" style={{ width: '100%', height: '100%' }}>
        {/* Fila 1: 3 siluetas frontales (casual) */}
        <rect x="2"  y="2" width="12" height="18" rx="1" fill="rgba(78,205,196,0.15)" stroke="rgba(78,205,196,0.5)" strokeWidth="0.8"/>
        <rect x="16" y="2" width="12" height="18" rx="1" fill="rgba(78,205,196,0.15)" stroke="rgba(78,205,196,0.5)" strokeWidth="0.8"/>
        <rect x="30" y="2" width="12" height="18" rx="1" fill="rgba(78,205,196,0.15)" stroke="rgba(78,205,196,0.5)" strokeWidth="0.8"/>
        {/* Fila 1: 2 siluetas uniforme + 1 perfil */}
        <rect x="46" y="2" width="12" height="18" rx="1" fill="rgba(245,165,42,0.12)" stroke="rgba(245,165,42,0.45)" strokeWidth="0.8"/>
        <rect x="60" y="2" width="12" height="18" rx="1" fill="rgba(245,165,42,0.12)" stroke="rgba(245,165,42,0.45)" strokeWidth="0.8"/>
        {/* Fila 2: 3/4 + expresiones */}
        <rect x="2"  y="24" width="12" height="18" rx="1" fill="rgba(78,205,196,0.08)" stroke="rgba(78,205,196,0.3)" strokeWidth="0.8"/>
        <rect x="16" y="24" width="12" height="18" rx="1" fill="rgba(245,165,42,0.08)" stroke="rgba(245,165,42,0.3)" strokeWidth="0.8"/>
        {/* Expresiones — bustos pequeños */}
        <rect x="32" y="24" width="9" height="9"  rx="1" fill="rgba(78,205,196,0.12)" stroke="rgba(78,205,196,0.4)" strokeWidth="0.7"/>
        <rect x="43" y="24" width="9" height="9"  rx="1" fill="rgba(212,37,106,0.12)" stroke="rgba(212,37,106,0.4)" strokeWidth="0.7"/>
        <rect x="54" y="24" width="9" height="9"  rx="1" fill="rgba(155,111,212,0.12)" stroke="rgba(155,111,212,0.4)" strokeWidth="0.7"/>
        {/* Línea de separación */}
        <line x1="0" y1="22" x2="80" y2="22" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5"/>
        {/* Título */}
        <line x1="2" y1="43" x2="40" y2="43" stroke="rgba(78,205,196,0.3)" strokeWidth="0.5"/>
      </svg>
    ),
    desc: '11 vistas en una imagen — recortar en Photoshop',
  },
  'Reference Sheet — Locación': {
    preview: (
      <svg viewBox="0 0 80 44" style={{ width: '100%', height: '100%' }}>
        {/* Exterior día */}
        <rect x="2"  y="2"  width="36" height="18" rx="1" fill="rgba(245,165,42,0.12)" stroke="rgba(245,165,42,0.5)" strokeWidth="0.8"/>
        {/* Sol */}
        <circle cx="32" cy="8" r="3" fill="rgba(245,165,42,0.4)" stroke="none"/>
        {/* Exterior noche */}
        <rect x="42" y="2"  width="36" height="18" rx="1" fill="rgba(78,205,196,0.08)" stroke="rgba(78,205,196,0.4)" strokeWidth="0.8"/>
        {/* Luna */}
        <path d="M72 6 A4 4 0 1 1 72 14 A3 3 0 1 0 72 6Z" fill="rgba(78,205,196,0.5)" stroke="none"/>
        {/* Interior día */}
        <rect x="2"  y="24" width="36" height="18" rx="1" fill="rgba(245,165,42,0.08)" stroke="rgba(245,165,42,0.4)" strokeWidth="0.8"/>
        {/* Ventana interior día */}
        <rect x="8"  y="28" width="10" height="10" rx="1" fill="rgba(245,165,42,0.2)" stroke="rgba(245,165,42,0.3)" strokeWidth="0.5"/>
        {/* Interior noche */}
        <rect x="42" y="24" width="36" height="18" rx="1" fill="rgba(155,111,212,0.08)" stroke="rgba(155,111,212,0.35)" strokeWidth="0.8"/>
        {/* Lámpara interior noche */}
        <circle cx="60" cy="30" r="3" fill="rgba(245,165,42,0.3)" stroke="rgba(245,165,42,0.4)" strokeWidth="0.5"/>
        {/* Separador */}
        <line x1="0" y1="22" x2="80" y2="22" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5"/>
        <line x1="40" y1="0"  x2="40" y2="44" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5"/>
        {/* Labels */}
        <line x1="3"  y1="42" x2="14" y2="42" stroke="rgba(245,165,42,0.3)" strokeWidth="0.4"/>
        <line x1="43" y1="42" x2="54" y2="42" stroke="rgba(78,205,196,0.3)"  strokeWidth="0.4"/>
      </svg>
    ),
    desc: 'Exterior + interior × día/noche en una imagen',
  },
  'Vista Individual — Personaje': {
    preview: (
      <svg viewBox="0 0 80 44" style={{ width: '100%', height: '100%' }}>
        {/* Figura única centrada */}
        <rect x="28" y="2" width="24" height="40" rx="2" fill="rgba(78,205,196,0.1)" stroke="rgba(78,205,196,0.6)" strokeWidth="1"/>
        {/* Cabeza */}
        <circle cx="40" cy="10" r="6" fill="rgba(78,205,196,0.2)" stroke="rgba(78,205,196,0.5)" strokeWidth="0.8"/>
        {/* Línea de suelo */}
        <line x1="24" y1="42" x2="56" y2="42" stroke="rgba(78,205,196,0.3)" strokeWidth="0.5"/>
        {/* Indicador de calidad */}
        <circle cx="68" cy="8" r="4" fill="rgba(245,165,42,0.2)" stroke="rgba(245,165,42,0.6)" strokeWidth="0.8"/>
        <line x1="66" y1="8" x2="70" y2="8" stroke="rgba(245,165,42,0.8)" strokeWidth="1"/>
        <line x1="68" y1="6" x2="68" y2="10" stroke="rgba(245,165,42,0.8)" strokeWidth="1"/>
      </svg>
    ),
    desc: 'Una vista, máxima calidad — para aprobación',
  },
  'Vista Individual — Locación': {
    preview: (
      <svg viewBox="0 0 80 44" style={{ width: '100%', height: '100%' }}>
        {/* Escena única centrada */}
        <rect x="8" y="4" width="64" height="36" rx="2" fill="rgba(155,111,212,0.08)" stroke="rgba(155,111,212,0.5)" strokeWidth="1"/>
        {/* Horizonte */}
        <line x1="8" y1="28" x2="72" y2="28" stroke="rgba(155,111,212,0.3)" strokeWidth="0.5"/>
        {/* Sol/luna */}
        <circle cx="60" cy="14" r="5" fill="rgba(245,165,42,0.25)" stroke="rgba(245,165,42,0.5)" strokeWidth="0.7"/>
        {/* Edificio simple */}
        <rect x="20" y="16" width="24" height="12" rx="1" fill="rgba(155,111,212,0.15)" stroke="rgba(155,111,212,0.4)" strokeWidth="0.7"/>
        <rect x="28" y="22" width="8" height="6" rx="0" fill="rgba(245,165,42,0.15)" stroke="rgba(245,165,42,0.3)" strokeWidth="0.5"/>
      </svg>
    ),
    desc: 'Una vista de locación — máxima calidad',
  },
  'Escena cinematográfica': {
    preview: (
      <svg viewBox="0 0 80 44" style={{ width: '100%', height: '100%' }}>
        {/* Frame cinematográfico 16:9 */}
        <rect x="2" y="6" width="76" height="32" rx="1" fill="rgba(245,165,42,0.04)" stroke="rgba(245,165,42,0.5)" strokeWidth="1"/>
        {/* Barras negras letterbox */}
        <rect x="2" y="6"  width="76" height="4"  rx="0" fill="rgba(0,0,0,0.5)"/>
        <rect x="2" y="34" width="76" height="4"  rx="0" fill="rgba(0,0,0,0.5)"/>
        {/* Fondo — cielo y suelo */}
        <rect x="3" y="10" width="74" height="14" fill="rgba(245,165,42,0.08)"/>
        <rect x="3" y="24" width="74" height="10" fill="rgba(155,111,212,0.1)"/>
        {/* Luz dorada — sol lateral */}
        <circle cx="70" cy="14" r="6" fill="rgba(245,165,42,0.25)" stroke="none"/>
        {/* Silueta personaje primer plano */}
        <rect x="28" y="14" width="10" height="20" rx="1" fill="rgba(78,205,196,0.25)" stroke="rgba(78,205,196,0.6)" strokeWidth="0.8"/>
        <circle cx="33" cy="12" r="4" fill="rgba(78,205,196,0.3)" stroke="rgba(78,205,196,0.5)" strokeWidth="0.8"/>
        {/* Fondo difuminado — siluetas */}
        <rect x="10" y="20" width="6" height="14" rx="1" fill="rgba(245,165,42,0.08)" stroke="rgba(245,165,42,0.2)" strokeWidth="0.5"/>
        <rect x="60" y="18" width="8" height="16" rx="1" fill="rgba(245,165,42,0.08)" stroke="rgba(245,165,42,0.2)" strokeWidth="0.5"/>
        {/* Línea de tierra */}
        <line x1="3" y1="34" x2="77" y2="34" stroke="rgba(245,165,42,0.15)" strokeWidth="0.5"/>
      </svg>
    ),
    desc: 'Escena narrativa con encuadre y luz cinematográfica',
  },
}

const CARD_W    = 240   // card width px (world space)
const OUTPUT_W  = 420   // output card width
const PORT_Y    = 56    // port vertical offset within card
const PORT_R    = 6     // port circle radius

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

// ── Port circle component ─────────────────────────────────────────────────────

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

// ── Node card components ───────────────────────────────────────────────────────

function ArtworkTypeCard({ node, selected, onDragStart, onUpdate, onPortDown }: {
  node: CanvasNode; selected: boolean
  onDragStart: (e: React.MouseEvent) => void
  onUpdate: (patch: NodeData) => void
  onPortDown: (e: React.MouseEvent, nodeId: string) => void
}) {
  const current = node.data.artworkType ?? ARTWORK_TYPES[0]
  return (
    <div
      onMouseDown={onDragStart}
      style={{ ...CARD_BASE, width: 260, left: node.position.x, top: node.position.y, border: `1px solid ${selected ? 'rgba(245,165,42,0.8)' : 'rgba(245,165,42,0.3)'}`, cursor: 'grab' }}
    >
      <div style={{ ...LABEL, color: 'rgba(245,165,42,0.5)' }}>Tipo de Artwork</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
        {ARTWORK_TYPES.map((t) => {
          const viz = ARTWORK_TYPE_VISUALS[t]
          const isSelected = t === current
          return (
            <div
              key={t}
              onMouseDown={(e) => { e.stopPropagation(); onUpdate({ artworkType: t }) }}
              style={{
                borderRadius: '4px',
                border: `1px solid ${isSelected ? 'rgba(245,165,42,0.8)' : 'rgba(245,165,42,0.2)'}`,
                background: isSelected ? 'rgba(245,165,42,0.08)' : 'rgba(245,165,42,0.02)',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'border-color 0.15s',
              }}
            >
              <div style={{ height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px', background: '#0c0920' }}>
                {viz?.preview}
              </div>
              <div style={{ padding: '4px 6px' }}>
                <div style={{ fontSize: '0.65rem', fontWeight: 600, color: isSelected ? '#F5A52A' : 'rgba(240,235,225,0.7)', lineHeight: 1.2, marginBottom: '1px' }}>{t}</div>
                <div style={{ fontSize: '0.55rem', color: 'rgba(240,235,225,0.3)', lineHeight: 1.2 }}>{viz?.desc}</div>
              </div>
            </div>
          )
        })}
      </div>
      {/* Sub-panel para Vista Individual */}
      {(current === 'Vista Individual — Personaje' || current === 'Vista Individual — Locación') && (() => {
        const presets = current === 'Vista Individual — Personaje' ? VIEW_PRESETS_PERSONAJE : VIEW_PRESETS_LOCACION
        const currentView = node.data.selectedView ?? presets[0].id
        const currentRenderer = node.data.renderer ?? 'cel-shading'
        return (
          <div style={{ marginTop: '10px', borderTop: '1px solid rgba(78,205,196,0.15)', paddingTop: '10px' }}>
            <div style={{ fontSize: '0.5625rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(78,205,196,0.5)', marginBottom: '6px', fontWeight: 600 }}>
              Vista a generar
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {(() => {
                const items: React.ReactNode[] = []
                let lastAge = ''
                presets.forEach(p => {
                  const age = (p as any).age
                  if (age && age !== lastAge) {
                    lastAge = age
                    items.push(
                      <div key={`grp-${age}`} style={{ fontSize: '0.5rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(78,205,196,0.35)', fontWeight: 700, padding: '5px 0 2px', borderTop: items.length > 0 ? '1px solid rgba(78,205,196,0.08)' : 'none', marginTop: items.length > 0 ? '4px' : '0' }}>
                        {age}
                      </div>
                    )
                  }
                  const isActive = p.id === currentView
                  items.push(
                    <div
                      key={p.id}
                      onMouseDown={e => { e.stopPropagation(); onUpdate({ selectedView: p.id }) }}
                      style={{
                        padding: '5px 8px', borderRadius: '3px', cursor: 'pointer',
                        border: `1px solid ${isActive ? 'rgba(78,205,196,0.6)' : 'rgba(78,205,196,0.12)'}`,
                        background: isActive ? 'rgba(78,205,196,0.08)' : 'transparent',
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      }}
                    >
                      <span style={{ fontSize: '0.7rem', color: isActive ? '#4ECDC4' : 'rgba(240,235,225,0.7)', fontWeight: isActive ? 600 : 400 }}>{p.label}</span>
                      <span style={{ fontSize: '0.55rem', color: 'rgba(240,235,225,0.3)' }}>{p.desc}</span>
                    </div>
                  )
                })
                return items
              })()}
            </div>
            <div style={{ fontSize: '0.5625rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(245,165,42,0.5)', margin: '8px 0 5px', fontWeight: 600 }}>
              Renderer
            </div>
            <div style={{ display: 'flex', gap: '4px' }}>
              {RENDERER_OPTIONS.map(r => {
                const isActive = r.id === currentRenderer
                return (
                  <div
                    key={r.id}
                    onMouseDown={e => { e.stopPropagation(); onUpdate({ renderer: r.id }) }}
                    style={{
                      flex: 1, padding: '5px 4px', borderRadius: '3px', cursor: 'pointer', textAlign: 'center',
                      border: `1px solid ${isActive ? 'rgba(245,165,42,0.6)' : 'rgba(245,165,42,0.15)'}`,
                      background: isActive ? 'rgba(245,165,42,0.1)' : 'transparent',
                    }}
                  >
                    <div style={{ fontSize: '0.625rem', fontWeight: isActive ? 700 : 400, color: isActive ? '#F5A52A' : 'rgba(240,235,225,0.6)', lineHeight: 1.2 }}>{r.label}</div>
                    <div style={{ fontSize: '0.5rem', color: 'rgba(240,235,225,0.25)', lineHeight: 1.2, marginTop: '1px' }}>{r.desc}</div>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })()}
      <Port side="right" color="#F5A52A" onMouseDown={(e) => { e.stopPropagation(); onPortDown(e, node.id) }} />
    </div>
  )
}

function StyleCard({ node, selected, onDragStart, onUpdate, onPortDown, onPortUp }: {
  node: CanvasNode; selected: boolean
  onDragStart: (e: React.MouseEvent) => void
  onUpdate: (patch: NodeData) => void
  onPortDown: (e: React.MouseEvent, nodeId: string) => void
  onPortUp: (e: React.MouseEvent, nodeId: string) => void
}) {
  const current = node.data.style ?? STYLES[0]
  return (
    <div
      onMouseDown={onDragStart}
      style={{ ...CARD_BASE, width: 260, left: node.position.x, top: node.position.y, border: `1px solid ${selected ? 'rgba(78,205,196,0.8)' : 'rgba(78,205,196,0.3)'}`, cursor: 'grab' }}
    >
      <Port side="left" color="#4ECDC4" onMouseUp={(e) => { e.stopPropagation(); onPortUp(e, node.id) }} />
      <div style={{ ...LABEL, color: 'rgba(78,205,196,0.5)' }}>Estilo Visual</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
        {STYLES.map((s) => {
          const viz = STYLE_VISUALS[s]
          const isSelected = s === current
          return (
            <div
              key={s}
              onMouseDown={(e) => { e.stopPropagation(); onUpdate({ style: s }) }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                borderRadius: '4px',
                border: `1px solid ${isSelected ? 'rgba(78,205,196,0.7)' : 'rgba(78,205,196,0.15)'}`,
                background: isSelected ? 'rgba(78,205,196,0.06)' : 'transparent',
                padding: '0',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'border-color 0.15s',
              }}
            >
              <div style={{ width: '52px', height: '32px', flexShrink: 0, background: viz?.bg ?? '#1A1235' }} />
              <div>
                <div style={{ fontSize: '0.7rem', fontWeight: 600, color: isSelected ? '#4ECDC4' : 'rgba(240,235,225,0.8)' }}>{s}</div>
                <div style={{ fontSize: '0.575rem', color: 'rgba(240,235,225,0.35)' }}>{viz?.desc}</div>
              </div>
            </div>
          )
        })}
      </div>
      <Port side="right" color="#4ECDC4" onMouseDown={(e) => { e.stopPropagation(); onPortDown(e, node.id) }} />
    </div>
  )
}

// Patterns that indicate document metadata/boilerplate, not generatable sections
const SECTION_NOISE = /^(LOS PRODIGIOS|LP-[A-Z0-9]+|VERSIÓN|ESTADO|OFICIAL|CONFIDENCIAL|BIBLIOTECA OFICIAL|CONTROL DOCUMENTAL|FIN DEL DOCUMENTO|ÍNDICE$|CIERRE EDITORIAL|ANEXO [ABC][\.\s]|BIBLIOTECA|VOLUMEN DE|PROPIETARIO|PROPÓSITO|REGLA EDITORIAL|USO AUTORIZADO|FECHA DE|CÓDIGO$|TÍTULO$|COLECCIÓN$)/i

function parseDocSections(content: string): string[] {
  const candidates: string[] = []
  // Canonical key: lowercased, used for dedup
  const seenLower = new Set<string>()

  const add = (raw: string) => {
    const text = raw.replace(/\*+/g, '').replace(/[—:\-]+$/, '').trim()
    if (text.length < 3 || text.length > 100) return
    if (SECTION_NOISE.test(text)) return
    const lower = text.toLowerCase()
    if (seenLower.has(lower)) return
    seenLower.add(lower)
    candidates.push(text)
  }

  for (const raw of content.split('\n')) {
    const line = raw.trim()
    if (!line) continue

    // 1. Markdown headers: ## Title
    const mdHeader = line.match(/^#{1,4}\s+(.+)/)
    if (mdHeader) { add(mdHeader[1]); continue }

    // 2. Bold headers: **TÍTULO** or **Sección 1: Algo**
    const boldHeader = line.match(/^\*{1,2}([^*]{3,80})\*{1,2}\s*[:：]?\s*$/)
    if (boldHeader) { add(boldHeader[1]); continue }

    // 3. Numbered sections: "1. Título", "1.1 Algo", "SECCIÓN 01:"
    const numbered = line.match(/^(?:\d+[\.\d]*\.?\s+|SECCIÓN\s+\d+\s*[:\-]?\s*)([A-ZÁÉÍÓÚÑ][^.!?]{2,70})/)
    if (numbered && line.split(' ').length <= 8) { add(numbered[1]); continue }

    // 4. ZONA/PANEL/INTERIOR/EXTERIOR labels
    if (/^(ZONA|PANEL|INTERIOR|EXTERIOR|AREA|ÁREA|ZONE)\s+/i.test(line) && line.length < 90) {
      add(line.replace(/\s*[—:\-].*$/, '')); continue
    }

    // 5. Short ALL-CAPS lines (section titles in plain .docx exports)
    if (
      line === line.toUpperCase() &&
      line.length >= 4 && line.length <= 80 &&
      /[A-ZÁÉÍÓÚÑ]{3,}/.test(line) &&
      line.split(' ').length <= 7 &&
      !/^[\d\s\-—•]+$/.test(line)
    ) {
      add(line); continue
    }
  }
  return candidates
}

function EntityCard({ node, selected, onDragStart, onUpdate, onPortDown, onPortUp, docs }: {
  node: CanvasNode; selected: boolean
  onDragStart: (e: React.MouseEvent) => void
  onUpdate: (patch: NodeData) => void
  onPortDown: (e: React.MouseEvent, nodeId: string) => void
  onPortUp: (e: React.MouseEvent, nodeId: string) => void
  docs: DocOption[]
}) {
  const [sections, setSections] = useState<string[]>([])
  const [loadingSections, setLoadingSections] = useState(false)
  const [noContent, setNoContent] = useState(false)
  const [canonImg, setCanonImg] = useState<string | null>(null)
  const [approvedAssets, setApprovedAssets] = useState<any[]>([])
  const [showCanonPicker, setShowCanonPicker] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const docId = node.data.docId
    if (!docId) { setSections([]); setNoContent(false); setCanonImg(null); setApprovedAssets([]); return }
    // Load canonical reference from localStorage
    setCanonImg(localStorage.getItem(`canon_img_${docId}`))
    // Fetch approved assets for this entity (match by title similarity)
    fetch('/api/assets/approved')
      .then(r => r.json())
      .then((all: any[]) => {
        if (!Array.isArray(all)) return
        const docTitle = (node.data.docTitle ?? '').toLowerCase()
        const matched = all.filter(a =>
          docTitle.includes(a.entity_label.toLowerCase()) ||
          a.entity_label.toLowerCase().split(' ').some((w: string) => w.length > 3 && docTitle.includes(w))
        )
        setApprovedAssets(matched.length > 0 ? matched : all)
      })
      .catch(() => {})
    setLoadingSections(true)
    setNoContent(false)
    fetch(`/api/reference-docs?id=${docId}`)
      .then(r => r.json())
      .then(doc => {
        if (doc?.content) {
          const parsed = parseDocSections(doc.content)
          setSections(parsed)
          setNoContent(parsed.length === 0)
        } else {
          setSections([])
          setNoContent(true)
        }
      })
      .catch(() => { setSections([]); setNoContent(false) })
      .finally(() => setLoadingSections(false))
  }, [node.data.docId])

  function handleCanonUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !node.data.docId) return

    // Resize to max 512px before storing — avoids localStorage QuotaExceededError
    // (a 2MB PNG becomes ~40-80KB as JPEG 85%, well within the 5MB localStorage limit)
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
      try {
        localStorage.setItem(`canon_img_${node.data.docId}`, b64)
        setCanonImg(b64)
      } catch {
        alert('No se pudo guardar la referencia: el almacenamiento local está lleno. Borra otras referencias o usa una imagen más pequeña.')
      }
    }
    img.onerror = () => { URL.revokeObjectURL(url); alert('No se pudo leer la imagen.') }
    img.src = url
  }

  function clearCanon() {
    if (!node.data.docId) return
    localStorage.removeItem(`canon_img_${node.data.docId}`)
    setCanonImg(null)
  }

  return (
    <div
      onMouseDown={onDragStart}
      style={{ ...CARD_BASE, left: node.position.x, top: node.position.y, border: `1px solid ${selected ? 'rgba(155,111,212,0.8)' : 'rgba(155,111,212,0.3)'}`, cursor: 'grab' }}
    >
      <Port side="left" color="#9B6FD4" onMouseUp={(e) => { e.stopPropagation(); onPortUp(e, node.id) }} />
      <div style={{ ...LABEL, color: 'rgba(155,111,212,0.5)' }}>Entidad / Personaje</div>
      {docs.length === 0 ? (
        <div style={{ fontSize: '0.75rem', color: 'rgba(212,37,106,0.5)', padding: '4px 0' }}>Sin docs en Biblia</div>
      ) : (
        <select
          value={node.data.docId ?? ''}
          onMouseDown={(e) => e.stopPropagation()}
          onChange={(e) => {
            const doc = docs.find((d) => d.id === e.target.value)
            if (doc) onUpdate({ docId: doc.id, docTitle: doc.title, focus: '' })
          }}
          style={{ ...SELECT, border: '1px solid rgba(155,111,212,0.15)' }}
        >
          {!node.data.docId && <option value="">— seleccionar —</option>}
          {docs.map((d) => <option key={d.id} value={d.id}>{d.title}</option>)}
        </select>
      )}
      {node.data.docId && (
        <>
          <div style={{ fontSize: '0.5625rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(155,111,212,0.4)', marginTop: '8px', marginBottom: '3px', fontFamily: 'IBM Plex Sans, sans-serif' }}>
            {loadingSections ? 'Analizando documento...' : `Elemento a generar`}
          </div>
          {noContent ? (
            <div style={{ fontSize: '0.7rem', color: 'rgba(212,37,106,0.6)', padding: '4px 0', lineHeight: 1.4 }}>
              Sin contenido extraíble — sube el documento nuevamente desde Biblia para habilitar secciones.
            </div>
          ) : (
            <>
              <select
                value={node.data.focus ?? ''}
                onMouseDown={(e) => e.stopPropagation()}
                onChange={(e) => onUpdate({ focus: e.target.value })}
                disabled={loadingSections}
                style={{ ...SELECT, border: '1px solid rgba(155,111,212,0.15)', opacity: loadingSections ? 0.5 : 1 }}
              >
                <option value="">Documento completo</option>
                {sections.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <div style={{ marginTop: '6px' }}>
                <div style={{ fontSize: '0.5rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(155,111,212,0.35)', marginBottom: '3px', fontWeight: 600 }}>
                  O describe el momento
                </div>
                <textarea
                  value={typeof node.data.focus === 'string' && !sections.includes(node.data.focus) && node.data.focus !== '' ? node.data.focus : ''}
                  onMouseDown={(e) => e.stopPropagation()}
                  onChange={(e) => onUpdate({ focus: e.target.value })}
                  placeholder='ej: Mateo atrapando la pelota al atardecer, cancha del barrio...'
                  rows={2}
                  style={{ ...SELECT, border: '1px solid rgba(155,111,212,0.12)', resize: 'none', lineHeight: 1.4, fontSize: '0.75rem', color: 'rgba(240,235,225,0.6)', fontStyle: 'italic' }}
                />
              </div>
            </>
          )}
        </>
      )}
      {/* Referencia visual canónica */}
      {node.data.docId && (
        <div style={{ marginTop: '10px' }}>
          <div style={{ fontSize: '0.5625rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(155,111,212,0.4)', marginBottom: '5px' }}>
            Referencia visual
          </div>

          {/* Imagen seleccionada */}
          {(node.data.canonImageUrl || canonImg) && (
            <div style={{ marginBottom: '6px' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={node.data.canonImageUrl
                  ? node.data.canonImageUrl.replace('/uc?', '/thumbnail?sz=w300&').replace('id=', 'id=')
                  : `data:image/jpeg;base64,${canonImg}`}
                alt="Referencia canon"
                style={{ width: '100%', borderRadius: '3px', border: '1px solid rgba(155,111,212,0.4)', display: 'block', objectFit: 'cover', maxHeight: '120px' }}
              />
              <div style={{ marginTop: '4px', fontSize: '0.6rem', color: 'rgba(78,205,196,0.8)', lineHeight: 1.4 }}>
                ✓ {node.data.canonImageUrl ? 'Canon aprobado — incluido en el prompt' : 'Referencia local — adjunta en ChatGPT junto al prompt'}
              </div>
              <button
                onMouseDown={e => e.stopPropagation()}
                onClick={() => { clearCanon(); onUpdate({ canonImageUrl: undefined }) }}
                style={{ marginTop: '3px', background: 'none', border: 'none', color: 'rgba(212,37,106,0.5)', fontSize: '0.6rem', cursor: 'pointer', padding: 0, fontFamily: 'IBM Plex Sans, sans-serif' }}
              >
                × Quitar referencia
              </button>
            </div>
          )}

          {/* Botones para agregar referencia */}
          {!node.data.canonImageUrl && !canonImg && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {/* Desde Canon Aprobado */}
              {approvedAssets.length > 0 && (
                <button
                  onMouseDown={e => e.stopPropagation()}
                  onClick={() => setShowCanonPicker(p => !p)}
                  style={{ width: '100%', padding: '6px', background: 'rgba(78,205,196,0.08)', border: '1px solid rgba(78,205,196,0.25)', borderRadius: '3px', color: '#4ECDC4', fontSize: '0.7rem', cursor: 'pointer', fontFamily: 'IBM Plex Sans, sans-serif', textAlign: 'left' }}
                >
                  ✓ Usar imagen del canon aprobado ({approvedAssets.length})
                </button>
              )}
              {/* Subir local */}
              <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleCanonUpload} />
              <button
                onMouseDown={e => e.stopPropagation()}
                onClick={() => fileRef.current?.click()}
                style={{ width: '100%', padding: '6px', background: 'rgba(155,111,212,0.06)', border: '1px dashed rgba(155,111,212,0.3)', borderRadius: '3px', color: 'rgba(155,111,212,0.6)', fontSize: '0.7rem', cursor: 'pointer', fontFamily: 'IBM Plex Sans, sans-serif', textAlign: 'left' }}
              >
                + Subir imagen local
              </button>
            </div>
          )}

          {/* Picker de canon aprobado */}
          {showCanonPicker && approvedAssets.length > 0 && (
            <div
              onMouseDown={e => e.stopPropagation()}
              style={{ marginTop: '6px', maxHeight: '200px', overflowY: 'auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}
            >
              {approvedAssets.map((asset: any) => (
                <div
                  key={asset.id}
                  onClick={() => {
                    onUpdate({ canonImageUrl: asset.direct_url })
                    setShowCanonPicker(false)
                  }}
                  style={{ cursor: 'pointer', borderRadius: '3px', overflow: 'hidden', border: '1px solid rgba(78,205,196,0.2)' }}
                  title={`${asset.entity_label} — ${asset.version_label}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={asset.thumbnail_url} alt={asset.version_label} style={{ width: '100%', height: '60px', objectFit: 'cover', display: 'block' }} />
                  <div style={{ padding: '2px 4px', fontSize: '0.5rem', color: 'rgba(240,235,225,0.4)', lineHeight: 1.2, background: '#08060F' }}>
                    {asset.version_label}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      <Port side="right" color="#9B6FD4" onMouseDown={(e) => { e.stopPropagation(); onPortDown(e, node.id) }} />
    </div>
  )
}

function OutputCard({ node, selected, onDragStart, onPortUp, onGenerate, entityDocId }: {
  node: CanvasNode; selected: boolean
  onDragStart: (e: React.MouseEvent) => void
  onPortUp: (e: React.MouseEvent, nodeId: string) => void
  onGenerate: (nodeId: string) => void
  entityDocId?: string
}) {
  const [copied, setCopied] = useState(false)
  const [generatingImage, setGeneratingImage] = useState(false)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [imageB64, setImageB64] = useState<string | null>(null)
  const [imageError, setImageError] = useState<string | null>(null)
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([])
  const [selectedFolder, setSelectedFolder] = useState('')
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState<string | null>(null)
  const prompt = node.data.generatedPrompt ?? ''
  const generating = node.data.isGenerating ?? false

  // Load Drive categories when image is ready
  useEffect(() => {
    if (!imageUrl && !imageB64) return
    fetch('/api/drive/categories')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) setCategories(data)
      })
      .catch(() => {})
  }, [imageUrl, imageB64])

  async function handleGenerateImage() {
    if (!prompt || generatingImage) return
    setGeneratingImage(true)
    setImageError(null)
    setImageUrl(null)
    try {
      const res = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      })
      const data = await res.json()
      if (data.error) { setImageError(data.error); return }
      if (data.b64) {
        setImageB64(data.b64)
        setImageUrl(`data:image/png;base64,${data.b64}`)
      } else if (data.url) {
        setImageUrl(data.url)
      }
    } catch {
      setImageError('Error al conectar con la API')
    } finally {
      setGeneratingImage(false)
    }
  }

  async function handleSaveToDrive() {
    if (!selectedFolder || saving) return
    setSaving(true)
    setSaveMsg(null)
    try {
      const res = await fetch('/api/drive/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          b64: imageB64 ?? undefined,
          url: imageB64 ? undefined : imageUrl,
          folderId: selectedFolder,
          filename: `artwork_${Date.now()}.png`,
        }),
      })
      const data = await res.json()
      if (data.error) { setSaveMsg(`Error: ${data.error}`); return }
      setSaveMsg('✓ Guardado en Assets')
    } catch {
      setSaveMsg('Error al guardar')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div
      data-tutorial="artwork-output"
      onMouseDown={onDragStart}
      style={{ ...CARD_BASE, width: OUTPUT_W, left: node.position.x, top: node.position.y, border: `1px solid ${selected ? 'rgba(212,37,106,0.8)' : 'rgba(212,37,106,0.3)'}`, cursor: 'grab' }}
    >
      <Port side="left" color="#D4256A" onMouseUp={(e) => { e.stopPropagation(); onPortUp(e, node.id) }} />
      <div style={{ ...LABEL, color: 'rgba(212,37,106,0.5)' }}>Prompt Generado</div>
      <button
        onMouseDown={(e) => e.stopPropagation()}
        onClick={() => onGenerate(node.id)}
        disabled={generating}
        style={{ width: '100%', padding: '7px', marginBottom: '10px', background: generating ? 'rgba(245,165,42,0.2)' : '#F5A52A', border: 'none', borderRadius: '3px', color: generating ? 'rgba(245,165,42,0.5)' : '#08060F', fontSize: '0.8125rem', fontWeight: 700, cursor: generating ? 'not-allowed' : 'pointer', fontFamily: 'IBM Plex Sans, sans-serif' }}
      >
        {generating ? 'Generando...' : 'Generar Prompt'}
      </button>
      {prompt ? (
        <>
          <textarea
            readOnly value={prompt}
            onMouseDown={(e) => e.stopPropagation()}
            style={{ width: '100%', height: '200px', boxSizing: 'border-box', background: '#0D0920', border: '1px solid rgba(212,37,106,0.15)', borderRadius: '3px', color: 'rgba(240,235,225,0.75)', fontFamily: 'monospace', fontSize: '0.6875rem', lineHeight: 1.6, padding: '8px', resize: 'vertical', outline: 'none' }}
          />
          <div style={{ marginTop: '6px', display: 'flex', gap: '6px' }}>
            <button
              onMouseDown={(e) => e.stopPropagation()}
              onClick={() => { navigator.clipboard.writeText(prompt).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000) }) }}
              style={{ flex: 1, padding: '5px', background: copied ? 'rgba(78,205,196,0.15)' : 'transparent', border: `1px solid ${copied ? 'rgba(78,205,196,0.4)' : 'rgba(245,165,42,0.12)'}`, borderRadius: '3px', color: copied ? '#4ECDC4' : 'rgba(240,235,225,0.35)', fontSize: '0.75rem', cursor: 'pointer', fontFamily: 'IBM Plex Sans, sans-serif' }}
            >
              {copied ? '✓ Copiado' : 'Copiar'}
            </button>
            <button
              onMouseDown={(e) => e.stopPropagation()}
              onClick={handleGenerateImage}
              disabled={generatingImage}
              style={{ flex: 2, padding: '5px 8px', background: generatingImage ? 'rgba(155,111,212,0.15)' : 'rgba(155,111,212,0.2)', border: '1px solid rgba(155,111,212,0.5)', borderRadius: '3px', color: generatingImage ? 'rgba(155,111,212,0.5)' : '#9B6FD4', fontSize: '0.75rem', fontWeight: 700, cursor: generatingImage ? 'not-allowed' : 'pointer', fontFamily: 'IBM Plex Sans, sans-serif' }}
            >
              {generatingImage ? '⏳ Generando imagen...' : '✦ Generar Imagen'}
            </button>
          </div>

          {/* Generated image */}
          {generatingImage && (
            <div style={{ marginTop: '10px', padding: '24px', background: 'rgba(155,111,212,0.06)', border: '1px solid rgba(155,111,212,0.15)', borderRadius: '3px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', color: 'rgba(155,111,212,0.7)', fontFamily: 'IBM Plex Sans, sans-serif' }}>
                GPT-Image-1 procesando...
              </div>
              <div style={{ fontSize: '0.6875rem', color: 'rgba(240,235,225,0.25)', marginTop: '4px', fontFamily: 'IBM Plex Sans, sans-serif' }}>
                Puede tomar 30–60 segundos
              </div>
            </div>
          )}
          {imageUrl && !generatingImage && (
            <div style={{ marginTop: '10px' }} onMouseDown={(e) => e.stopPropagation()}>
              <img
                src={imageUrl}
                alt="Imagen generada"
                style={{ width: '100%', borderRadius: '3px', border: '1px solid rgba(155,111,212,0.3)', display: 'block' }}
              />
              {/* Save to Drive */}
              <div style={{ marginTop: '8px', background: 'rgba(78,205,196,0.06)', border: '1px solid rgba(78,205,196,0.15)', borderRadius: '3px', padding: '8px' }}>
                <div style={{ fontSize: '0.625rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(78,205,196,0.5)', marginBottom: '6px', fontFamily: 'IBM Plex Sans, sans-serif' }}>
                  Guardar en Assets
                </div>
                <select
                  value={selectedFolder}
                  onChange={e => { setSelectedFolder(e.target.value); setSaveMsg(null) }}
                  onMouseDown={e => e.stopPropagation()}
                  style={{ width: '100%', background: '#0D0920', border: '1px solid rgba(78,205,196,0.2)', borderRadius: '3px', color: selectedFolder ? '#F0EBE1' : 'rgba(240,235,225,0.35)', fontSize: '0.75rem', padding: '5px 8px', outline: 'none', marginBottom: '6px', fontFamily: 'IBM Plex Sans, sans-serif', cursor: 'pointer' }}
                >
                  <option value="">Selecciona carpeta...</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    onMouseDown={e => e.stopPropagation()}
                    onClick={handleSaveToDrive}
                    disabled={!selectedFolder || saving}
                    style={{ flex: 1, padding: '5px', background: saving ? 'rgba(78,205,196,0.1)' : selectedFolder ? 'rgba(78,205,196,0.2)' : 'rgba(78,205,196,0.05)', border: `1px solid ${selectedFolder ? 'rgba(78,205,196,0.5)' : 'rgba(78,205,196,0.15)'}`, borderRadius: '3px', color: selectedFolder ? '#4ECDC4' : 'rgba(78,205,196,0.3)', fontSize: '0.75rem', fontWeight: 700, cursor: selectedFolder && !saving ? 'pointer' : 'not-allowed', fontFamily: 'IBM Plex Sans, sans-serif' }}
                  >
                    {saving ? 'Guardando...' : '↑ Subir a Drive'}
                  </button>
                  <a
                    href={imageUrl}
                    download="artwork.png"
                    style={{ flex: 1, padding: '5px', background: 'rgba(155,111,212,0.1)', border: '1px solid rgba(155,111,212,0.3)', borderRadius: '3px', color: '#9B6FD4', fontSize: '0.75rem', textAlign: 'center', textDecoration: 'none', fontFamily: 'IBM Plex Sans, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    onMouseDown={e => e.stopPropagation()}
                  >
                    ↓ Descargar
                  </a>
                </div>
                {saveMsg && (
                  <div style={{ marginTop: '6px', fontSize: '0.6875rem', color: saveMsg.startsWith('✓') ? '#4ECDC4' : 'rgba(212,37,106,0.8)', fontFamily: 'IBM Plex Sans, sans-serif' }}>
                    {saveMsg}
                  </div>
                )}
              </div>
              {/* Set as canonical reference */}
              {entityDocId && (imageB64 || imageUrl) && (
                <button
                  onMouseDown={e => e.stopPropagation()}
                  onClick={() => {
                    const b64 = imageB64 ?? null
                    if (!b64) return
                    localStorage.setItem(`canon_img_${entityDocId}`, b64)
                    alert('✓ Imagen fijada como referencia canónica. Aparecerá en el nodo de entidad para incluirla en ChatGPT.')
                  }}
                  style={{ marginTop: '8px', width: '100%', padding: '6px', background: 'rgba(245,165,42,0.08)', border: '1px solid rgba(245,165,42,0.3)', borderRadius: '3px', color: '#F5A52A', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'IBM Plex Sans, sans-serif' }}
                >
                  ✦ Fijar como referencia canónica
                </button>
              )}
            </div>
          )}
          {imageError && (
            <div style={{ marginTop: '8px', padding: '8px', background: 'rgba(212,37,106,0.08)', border: '1px solid rgba(212,37,106,0.2)', borderRadius: '3px', fontSize: '0.6875rem', color: 'rgba(212,37,106,0.8)', fontFamily: 'IBM Plex Sans, sans-serif' }}>
              Error: {imageError}
            </div>
          )}
        </>
      ) : (
        <div style={{ padding: '12px 0', textAlign: 'center', fontSize: '0.75rem', color: 'rgba(240,235,225,0.2)', fontStyle: 'italic' }}>
          Conecta los nodos y genera el prompt
        </div>
      )}
    </div>
  )
}

// ── Graph helpers ─────────────────────────────────────────────────────────────

function resolveChain(outputId: string, nodes: CanvasNode[], edges: CanvasEdge[]) {
  const srcOf = (tgt: string) => edges.find((e) => e.target === tgt)?.source
  const entityId  = srcOf(outputId)
  const styleId   = entityId ? srcOf(entityId)  : undefined
  const artworkId = styleId  ? srcOf(styleId)   : undefined
  return {
    artworkNode: nodes.find((n) => n.id === artworkId),
    styleNode:   nodes.find((n) => n.id === styleId),
    entityNode:  nodes.find((n) => n.id === entityId),
  }
}

function buildSummary(nodes: CanvasNode[], edges: CanvasEdge[]) {
  return `[CANVAS ACTUAL — Artwork Flow]
Tipos de arte: ${nodes.filter(n=>n.type==='artworkType').map(n=>n.data.artworkType).filter(Boolean).join(', ')||'ninguno'}
Estilos: ${nodes.filter(n=>n.type==='style').map(n=>n.data.style).filter(Boolean).join(', ')||'ninguno'}
Entidades: ${nodes.filter(n=>n.type==='entity').map(n=>n.data.docTitle).filter(Boolean).join(', ')||'ninguno'}
Outputs: ${nodes.filter(n=>n.type==='output').length} · Conexiones: ${edges.length}`
}

let counter = 1
const mkId = () => `n${Date.now()}${counter++}`

// ── Main canvas component ─────────────────────────────────────────────────────

export default function ArtworkCanvasPage() {
  const [nodes, setNodes] = useState<CanvasNode[]>([])
  const [edges, setEdges] = useState<CanvasEdge[]>([])
  const [selected, setSelected] = useState<string | null>(null)
  const [docs, setDocs] = useState<DocOption[]>([])

  // All interaction state stored in refs — never stale in native event handlers
  const [pan, setPan] = useState({ x: 40, y: 40 })
  const [zoom, setZoom] = useState(1)
  const zoomRef = useRef(1)
  const panRef = useRef({ x: 40, y: 40 })           // current pan value (sync)
  const panDragRef = useRef<{ startMouse: { x: number; y: number }; startPan: { x: number; y: number } } | null>(null)
  const dragRef = useRef<{ nodeId: string; ox: number; oy: number } | null>(null)
  const [pendingEdge, setPendingEdge] = useState<{ sourceId: string; mx: number; my: number } | null>(null)
  const pendingEdgeRef = useRef<{ sourceId: string; mx: number; my: number } | null>(null)
  const canvasRef = useRef<HTMLDivElement>(null)

  // Flow persistence
  const [flows, setFlows] = useState<FlowSummary[]>([])
  const [isAdminCanvas, setIsAdminCanvas] = useState(false)
  const [currentFlowId, setCurrentFlowId] = useState<string | null>(null)
  const [flowTitle, setFlowTitle] = useState('Nuevo flow')
  const [saving, setSaving] = useState(false)
  const [savedMsg, setSavedMsg] = useState(false)
  const [showFlowMenu, setShowFlowMenu] = useState(false)

  // AI chat
  const [chatOpen, setChatOpen] = useState(false)
  const [chatMsgs, setChatMsgs] = useState<ChatMsg[]>([])
  const [chatInput, setChatInput] = useState('')
  const [chatStreaming, setChatStreaming] = useState(false)
  const chatBottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch('/api/reference-docs').then(r => r.json()).then((list: DocOption[]) => {
      if (Array.isArray(list)) setDocs(list)
    }).catch(() => {})
    fetch('/api/artwork-flows').then(r => r.json()).then((data) => {
      if (data?.flows) { setFlows(data.flows); setIsAdminCanvas(!!data.isAdmin) }
      else if (Array.isArray(data)) setFlows(data)
    }).catch(() => {})
  }, [])

  useEffect(() => { chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [chatMsgs])

  // Close flow menu on outside click
  useEffect(() => {
    if (!showFlowMenu) return
    const handler = () => setShowFlowMenu(false)
    window.addEventListener('mousedown', handler)
    return () => window.removeEventListener('mousedown', handler)
  }, [showFlowMenu])

  // ── Update node data ──────────────────────────────────────────────────────

  const updateNode = useCallback((id: string, patch: NodeData) => {
    setNodes(nds => nds.map(n => n.id === id ? { ...n, data: { ...n.data, ...patch } } : n))
  }, [])

  // ── Generate prompt ───────────────────────────────────────────────────────

  const handleGenerate = useCallback(async (outputId: string) => {
    setNodes(nds => nds.map(n => n.id === outputId ? { ...n, data: { ...n.data, isGenerating: true, generatedPrompt: '' } } : n))

    const snap = { nodes, edges }
    const { artworkNode, styleNode, entityNode } = resolveChain(outputId, snap.nodes, snap.edges)

    if (!artworkNode || !styleNode || !entityNode) {
      setNodes(nds => nds.map(n => n.id === outputId ? { ...n, data: { ...n.data, isGenerating: false, generatedPrompt: 'Error: conecta Tipo → Estilo → Entidad → Output.' } } : n))
      return
    }

    try {
      const res = await fetch('/api/generate-prompt', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ artworkType: artworkNode.data.artworkType, style: styleNode.data.style, entityDocId: entityNode.data.docId, entityTitle: entityNode.data.docTitle || '', entityFocus: entityNode.data.focus || '', canonImageUrl: entityNode.data.canonImageUrl || null, selectedView: artworkNode.data.selectedView || null, renderer: artworkNode.data.renderer || null }),
      })
      const reader = res.body?.getReader()
      if (!reader) throw new Error('no stream')
      const dec = new TextDecoder()
      let acc = ''
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        acc += dec.decode(value, { stream: true })
        const snap2 = acc
        setNodes(nds => nds.map(n => n.id === outputId ? { ...n, data: { ...n.data, generatedPrompt: snap2 } } : n))
      }
    } catch {
      setNodes(nds => nds.map(n => n.id === outputId ? { ...n, data: { ...n.data, generatedPrompt: 'Error al generar.' } } : n))
    } finally {
      setNodes(nds => nds.map(n => n.id === outputId ? { ...n, data: { ...n.data, isGenerating: false } } : n))
      window.dispatchEvent(new Event('tutorial:prompt_generated'))
    }
  }, [nodes, edges])

  // ── Add node ──────────────────────────────────────────────────────────────

  function addNode(type: NodeKind) {
    const id = mkId()

    // Fixed columns per node type (world space, pan-independent)
    const COL_X: Record<NodeKind, number> = { artworkType: 40, style: 340, entity: 640, output: 920 }
    const ROW_H: Record<NodeKind, number> = { artworkType: 360, style: 280, entity: 260, output: 200 }

    // Stack vertically: new node goes below the last node of the same type
    const sameType = nodes.filter(n => n.type === type)
    const y = 40 + sameType.length * ROW_H[type]
    const position = { x: COL_X[type], y }

    const data: NodeData = type === 'artworkType' ? { artworkType: ARTWORK_TYPES[0] }
      : type === 'style'  ? { style: STYLES[0] }
      : type === 'entity' ? { docId: docs[0]?.id ?? '', docTitle: docs[0]?.title ?? '' }
      : { generatedPrompt: '', isGenerating: false }

    // Auto-connect to the nearest free predecessor
    let autoEdge: CanvasEdge | null = null
    const freeSource = (srcType: NodeKind) =>
      nodes.find(n => n.type === srcType && !edges.some(e => e.source === n.id))

    if (type === 'style') {
      const src = freeSource('artworkType')
      if (src) autoEdge = { id: `e${mkId()}`, source: src.id, target: id }
    } else if (type === 'entity') {
      const src = freeSource('style')
      if (src) autoEdge = { id: `e${mkId()}`, source: src.id, target: id }
    } else if (type === 'output') {
      const src = freeSource('entity')
      if (src) autoEdge = { id: `e${mkId()}`, source: src.id, target: id }
    }

    setNodes(nds => [...nds, { id, type, position, data }])
    if (autoEdge) setEdges(eds => [...eds, autoEdge!])
  }

  // ── World-space mouse helper ──────────────────────────────────────────────

  function toWorld(clientX: number, clientY: number) {
    const rect = canvasRef.current!.getBoundingClientRect()
    const p = panRef.current
    const z = zoomRef.current
    return { x: (clientX - rect.left - p.x) / z, y: (clientY - rect.top - p.y) / z }
  }

  // ── Wheel: scroll to pan, Ctrl+scroll to zoom ─────────────────────────────

  useEffect(() => {
    const el = canvasRef.current
    if (!el) return
    function onWheel(e: WheelEvent) {
      e.preventDefault()
      if (e.ctrlKey || e.metaKey) {
        // Zoom toward cursor
        const rect = el!.getBoundingClientRect()
        const mx = e.clientX - rect.left
        const my = e.clientY - rect.top
        const oldZ = zoomRef.current
        const delta = e.deltaY < 0 ? 1.08 : 0.92
        const newZ = Math.min(2, Math.max(0.25, oldZ * delta))
        // Adjust pan so zoom is centered on cursor
        const p = panRef.current
        const newPan = {
          x: mx - (mx - p.x) * (newZ / oldZ),
          y: my - (my - p.y) * (newZ / oldZ),
        }
        zoomRef.current = newZ
        panRef.current = newPan
        setZoom(newZ)
        setPan({ ...newPan })
      } else {
        // Pan
        const next = {
          x: panRef.current.x - e.deltaX,
          y: panRef.current.y - e.deltaY,
        }
        panRef.current = next
        setPan({ ...next })
      }
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [])

  // ── All mouse tracking on window (native events, never stale) ────────────

  useEffect(() => {
    function onMove(e: MouseEvent) {
      // Node drag
      if (dragRef.current) {
        const { nodeId, ox, oy } = dragRef.current
        const wm = toWorld(e.clientX, e.clientY)
        setNodes(nds => nds.map(n =>
          n.id === nodeId ? { ...n, position: { x: wm.x - ox, y: wm.y - oy } } : n
        ))
        return
      }
      // Canvas pan
      if (panDragRef.current) {
        const { startMouse, startPan } = panDragRef.current
        const next = {
          x: startPan.x + (e.clientX - startMouse.x),
          y: startPan.y + (e.clientY - startMouse.y),
        }
        panRef.current = next
        setPan({ ...next })
        return
      }
      // Pending edge trail
      if (pendingEdgeRef.current) {
        const wm = toWorld(e.clientX, e.clientY)
        pendingEdgeRef.current = { ...pendingEdgeRef.current, mx: wm.x, my: wm.y }
        setPendingEdge({ ...pendingEdgeRef.current })
      }
    }

    function onUp() {
      dragRef.current = null
      panDragRef.current = null
      if (pendingEdgeRef.current) {
        pendingEdgeRef.current = null
        setPendingEdge(null)
      }
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── Node mousedown ────────────────────────────────────────────────────────

  function onNodeMouseDown(e: React.MouseEvent, nodeId: string) {
    e.stopPropagation()
    setSelected(nodeId)
    const node = nodes.find(n => n.id === nodeId)!
    const wm = toWorld(e.clientX, e.clientY)
    dragRef.current = { nodeId, ox: wm.x - node.position.x, oy: wm.y - node.position.y }
  }

  // ── Port events ────────────────────────────────────────────────────────────

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
    if (!pe || pe.sourceId === targetId) {
      pendingEdgeRef.current = null; setPendingEdge(null); return
    }
    const exists = edges.some(ed => ed.source === pe.sourceId && ed.target === targetId)
    if (!exists) setEdges(eds => [...eds, { id: `e${mkId()}`, source: pe.sourceId, target: targetId }])
    pendingEdgeRef.current = null
    setPendingEdge(null)
  }

  // ── Canvas pan start ──────────────────────────────────────────────────────

  function onCanvasMouseDown(e: React.MouseEvent) {
    if (e.button !== 0) return
    setSelected(null)
    panDragRef.current = { startMouse: { x: e.clientX, y: e.clientY }, startPan: { ...panRef.current } }
  }

  // ── SVG edge helpers (world-space coords, transform applied by container) ──

  function portPos(nodeId: string, side: 'left' | 'right') {
    const n = nodes.find(nd => nd.id === nodeId)
    if (!n) return { x: 0, y: 0 }
    const w = n.type === 'output' ? OUTPUT_W : CARD_W
    return { x: n.position.x + (side === 'right' ? w : 0), y: n.position.y + PORT_Y }
  }

  function edgePath(x1: number, y1: number, x2: number, y2: number) {
    const cx = Math.abs(x2 - x1) * 0.5
    return `M${x1},${y1} C${x1 + cx},${y1} ${x2 - cx},${y2} ${x2},${y2}`
  }

  // ── Save / Load ───────────────────────────────────────────────────────────

  async function handleSave() {
    setSaving(true)
    try {
      const payload = { title: flowTitle, nodes_json: nodes, edges_json: edges }
      let res
      if (currentFlowId) {
        res = await fetch(`/api/artwork-flows?id=${currentFlowId}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      } else {
        res = await fetch('/api/artwork-flows', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
        if (res.ok) { const d = await res.json(); setCurrentFlowId(d.id) }
      }
      if (res?.ok) {
        setSavedMsg(true); setTimeout(() => setSavedMsg(false), 2500)
        const lr = await fetch('/api/artwork-flows')
        if (lr.ok) { const d = await lr.json(); if (d?.flows) setFlows(d.flows); else if (Array.isArray(d)) setFlows(d) }
      }
    } finally { setSaving(false) }
  }

  async function handleLoad(id: string) {
    const res = await fetch(`/api/artwork-flows?id=${id}`)
    if (!res.ok) return
    const flow = await res.json()
    setFlowTitle(flow.title); setCurrentFlowId(flow.id)
    setNodes(flow.nodes_json as CanvasNode[]); setEdges(flow.edges_json as CanvasEdge[])
    setShowFlowMenu(false)
  }

  async function handleDeleteFlow(id: string, title: string) {
    if (!confirm(`¿Eliminar el flow "${title}"? Esta acción no se puede deshacer.`)) return
    const res = await fetch(`/api/artwork-flows?id=${id}`, { method: 'DELETE' })
    if (!res.ok) return
    setFlows(prev => prev.filter(f => f.id !== id))
    if (currentFlowId === id) {
      setCurrentFlowId(null)
      setFlowTitle('Nuevo flow')
      setNodes([]); setEdges([])
    }
  }

  // ── AI chat ───────────────────────────────────────────────────────────────

  function injectIntoPrompt(addition: string) {
    // Find the first output node with a generated prompt and append
    setNodes(nds => nds.map(n => {
      if (n.type !== 'output' || !n.data.generatedPrompt) return n
      const current = n.data.generatedPrompt
      // Insert before Negative prompt if present, otherwise append
      const negIdx = current.lastIndexOf('Negative prompt:')
      const updated = negIdx > -1
        ? current.slice(0, negIdx).trimEnd() + '\n\n' + addition.trim() + '\n\n' + current.slice(negIdx)
        : current.trimEnd() + '\n\n' + addition.trim()
      return { ...n, data: { ...n.data, generatedPrompt: updated } }
    }))
  }

  async function sendChat() {
    const text = chatInput.trim()
    if (!text || chatStreaming) return
    setChatInput('')

    // Build context: canvas summary + current generated prompt if exists
    const outputNode = nodes.find(n => n.type === 'output' && n.data.generatedPrompt)
    const promptContext = outputNode?.data.generatedPrompt
      ? `\n\nPROMPT ACTUALMENTE GENERADO EN EL CANVAS:\n"""\n${outputNode.data.generatedPrompt.substring(0, 3000)}\n"""\n`
      : ''

    const canvasSummary = chatMsgs.length === 0
      ? `${buildSummary(nodes, edges)}${promptContext}\n\nINSTRUCCIÓN ESPECIAL: Si el usuario pide agregar, modificar o combinar elementos del prompt (props, personajes, animales, accesorios, etc.), busca la información canónica en los documentos de referencia disponibles y genera el bloque de texto exacto que debe añadirse al prompt. Encierra ese bloque con los marcadores:\n[PROMPT_INJECTION]\n...texto a inyectar...\n[/PROMPT_INJECTION]\n\n`
      : ''

    const userMsg: ChatMsg = { role: 'user', content: canvasSummary + text }
    const updated = [...chatMsgs, userMsg]
    setChatMsgs([...updated, { role: 'assistant', content: '' }])
    setChatStreaming(true)
    try {
      const res = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: updated, context: 'arte' }) })
      const reader = res.body?.getReader()
      if (!reader) return
      const dec = new TextDecoder()
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = dec.decode(value, { stream: true })
        setChatMsgs(prev => { const m = [...prev]; m[m.length-1] = { role: 'assistant', content: m[m.length-1].content + chunk }; return m })
      }
    } catch { /* ignore */ } finally { setChatStreaming(false) }
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

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', background: '#08060F', fontFamily: 'IBM Plex Sans, sans-serif', overflow: 'hidden' }}>

      {/* Toolbar */}
      <div data-tutorial="artwork-controls" style={{ flexShrink: 0, padding: '0.625rem 1rem', background: '#1A1235', borderBottom: '2px solid rgba(245,165,42,0.2)', display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
        <input value={flowTitle} onChange={e => setFlowTitle(e.target.value)} style={{ background: '#0D0920', border: '1px solid rgba(245,165,42,0.3)', borderRadius: '3px', color: '#F0EBE1', fontFamily: 'Bebas Neue, Impact, sans-serif', fontSize: '1rem', letterSpacing: '0.06em', padding: '5px 10px', outline: 'none', width: 200 }} />
        <button onClick={handleSave} disabled={saving} style={{ padding: '5px 14px', background: savedMsg ? '#4ECDC4' : 'rgba(245,165,42,0.2)', border: `1px solid ${savedMsg ? '#4ECDC4' : '#F5A52A'}`, borderRadius: '3px', color: savedMsg ? '#08060F' : '#F5A52A', fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'IBM Plex Sans, sans-serif' }}>
          {saving ? 'Guardando...' : savedMsg ? '✓ Guardado' : 'Guardar'}
        </button>
        {flows.length > 0 && (
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowFlowMenu(v => !v)}
              style={{ background: '#0D0920', border: '1px solid rgba(245,165,42,0.3)', borderRadius: '3px', color: '#F0EBE1', fontSize: '0.8125rem', padding: '5px 10px', outline: 'none', cursor: 'pointer', fontFamily: 'IBM Plex Sans, sans-serif', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              Flows guardados <span style={{ fontSize: '0.65rem', opacity: 0.6 }}>▾</span>
            </button>
            {showFlowMenu && (
              <div onMouseDown={e => e.stopPropagation()} style={{ position: 'absolute', top: '100%', left: 0, marginTop: '4px', background: '#1A1235', border: '1px solid rgba(245,165,42,0.3)', borderRadius: '4px', minWidth: '220px', zIndex: 200, boxShadow: '0 8px 24px rgba(0,0,0,0.6)', overflow: 'hidden' }}>
                {flows.map(f => (
                  <div key={f.id} style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid rgba(245,165,42,0.08)' }}>
                    <button
                      onClick={() => handleLoad(f.id)}
                      style={{ flex: 1, background: 'none', border: 'none', color: currentFlowId === f.id ? '#F5A52A' : '#F0EBE1', fontSize: '0.8rem', padding: '8px 12px', textAlign: 'left', cursor: 'pointer', fontFamily: 'IBM Plex Sans, sans-serif', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                    >
                      {f.title}
                      {isAdminCanvas && f.created_by && (
                        <span style={{ marginLeft: '6px', fontSize: '0.6rem', color: 'rgba(240,235,225,0.3)' }}>{f.created_by.split('@')[0]}</span>
                      )}
                    </button>
                    <button
                      onClick={() => handleDeleteFlow(f.id, f.title)}
                      title="Eliminar flow"
                      style={{ background: 'none', border: 'none', color: 'rgba(212,37,106,0.5)', fontSize: '1rem', padding: '8px 10px', cursor: 'pointer', flexShrink: 0, lineHeight: 1 }}
                      onMouseEnter={e => (e.currentTarget.style.color = 'rgba(212,37,106,1)')}
                      onMouseLeave={e => (e.currentTarget.style.color = 'rgba(212,37,106,0.5)')}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        <div style={{ width: 1, height: 24, background: 'rgba(245,165,42,0.25)', margin: '0 4px' }} />
        <span style={{ fontSize: '0.6875rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(240,235,225,0.4)', marginRight: 4 }}>Añadir:</span>
        {([
          { type: 'artworkType' as NodeKind, label: 'Tipo',    color: '#F5A52A' },
          { type: 'style'       as NodeKind, label: 'Estilo',  color: '#4ECDC4' },
          { type: 'entity'      as NodeKind, label: 'Entidad', color: '#9B6FD4' },
          { type: 'output'      as NodeKind, label: 'Output',  color: '#D4256A' },
        ]).map(({ type, label, color }) => (
          <button key={type} onClick={() => addNode(type)} style={{ padding: '5px 14px', background: '#0D0920', border: `2px solid ${color}`, borderRadius: '3px', color, fontSize: '0.8125rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'IBM Plex Sans, sans-serif', letterSpacing: '0.03em' }}>
            + {label}
          </button>
        ))}
        {selected && <span style={{ marginLeft: 8, fontSize: '0.75rem', color: 'rgba(240,235,225,0.45)', background: 'rgba(212,37,106,0.1)', border: '1px solid rgba(212,37,106,0.2)', borderRadius: 3, padding: '2px 8px' }}>Del → eliminar</span>}
        <div style={{ marginLeft: 'auto', fontFamily: 'Bebas Neue, Impact, sans-serif', fontSize: '0.875rem', letterSpacing: '0.12em', color: 'rgba(245,165,42,0.4)' }}>ARTWORK FLOW</div>
      </div>

      {/* Canvas area — only needs mousedown; move/up handled globally on window */}
      <div
        ref={canvasRef}
        onMouseDown={onCanvasMouseDown}
        style={{ flex: 1, position: 'relative', overflow: 'hidden', background: '#08060F', backgroundImage: 'radial-gradient(rgba(245,165,42,0.04) 1px, transparent 1px)', backgroundSize: '24px 24px', cursor: 'default' }}
      >
        {nodes.length === 0 && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
            <div style={{ fontSize: '0.6875rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(245,165,42,0.35)', marginBottom: 14 }}>Canvas vacío</div>
            <div style={{ fontSize: '0.9rem', color: 'rgba(240,235,225,0.45)', textAlign: 'center', lineHeight: 1.8 }}>Usa los botones de la barra superior para agregar nodos<br/>Conecta los puertos para construir el flujo</div>
            <div style={{ marginTop: 24, display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
              {(['Tipo → Estilo → Entidad → Output'] as const).map(s => (
                <div key={s} style={{ fontSize: '0.75rem', color: 'rgba(245,165,42,0.4)', background: 'rgba(245,165,42,0.05)', border: '1px solid rgba(245,165,42,0.12)', borderRadius: 4, padding: '6px 14px', letterSpacing: '0.04em' }}>{s}</div>
              ))}
            </div>
          </div>
        )}

        {/* Reset view button — fixed to canvas, bottom left */}
        <button
          onClick={() => { const next = { x: 40, y: 40 }; panRef.current = next; setPan(next); zoomRef.current = 1; setZoom(1) }}
          style={{ position: 'absolute', bottom: 16, left: 16, zIndex: 10, padding: '8px 14px', background: '#1A1235', border: '1px solid rgba(245,165,42,0.25)', borderRadius: '4px', color: 'rgba(245,165,42,0.7)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '0.75rem', letterSpacing: '0.04em', boxShadow: '0 4px 16px rgba(0,0,0,0.5)' }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(245,165,42,0.6)'; e.currentTarget.style.color = '#F5A52A' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(245,165,42,0.25)'; e.currentTarget.style.color = 'rgba(245,165,42,0.7)' }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
          Resetear vista
        </button>

        {/* World container — pan applied here via CSS transform */}
        <div style={{ position: 'absolute', inset: 0, transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`, transformOrigin: '0 0' }}>
          {/* SVG edges (world-space coords, inside transformed container) */}
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', overflow: 'visible' }}>
            {edges.map(ed => {
              const src = portPos(ed.source, 'right')
              const tgt = portPos(ed.target, 'left')
              return <path key={ed.id} d={edgePath(src.x, src.y, tgt.x, tgt.y)} fill="none" stroke="rgba(245,165,42,0.5)" strokeWidth={2} />
            })}
            {pendingEdge && (() => {
              const src = portPos(pendingEdge.sourceId, 'right')
              return <path d={edgePath(src.x, src.y, pendingEdge.mx, pendingEdge.my)} fill="none" stroke="#F5A52A" strokeWidth={2} strokeDasharray="6,4" />
            })()}
          </svg>

          {/* Nodes */}
          {nodes.map(node => {
            const sel = node.id === selected
            if (node.type === 'artworkType') return (
              <ArtworkTypeCard key={node.id} node={node} selected={sel}
                onDragStart={e => onNodeMouseDown(e, node.id)}
                onUpdate={patch => updateNode(node.id, patch)}
                onPortDown={onPortDown}
              />
            )
            if (node.type === 'style') return (
              <StyleCard key={node.id} node={node} selected={sel}
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
            if (node.type === 'output') {
              // Resolve connected entity docId for canonical reference
              const { entityNode: connectedEntity } = resolveChain(node.id, nodes, edges)
              return (
                <OutputCard key={node.id} node={node} selected={sel}
                  onDragStart={e => onNodeMouseDown(e, node.id)}
                  onPortUp={onPortUp}
                  onGenerate={handleGenerate}
                  entityDocId={connectedEntity?.data.docId}
                />
              )
            }
            return null
          })}
        </div>
      </div>

      {/* AI assistant */}
      <div style={{ flexShrink: 0, background: '#1A1235', borderTop: '2px solid rgba(245,165,42,0.2)', height: chatOpen ? 260 : 44, overflow: 'hidden', display: 'flex', flexDirection: 'column', transition: 'height 0.2s ease' }}>
        <button onClick={() => setChatOpen(o => !o)} style={{ flexShrink: 0, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 1rem', background: 'none', border: 'none', cursor: 'pointer', width: '100%', borderBottom: chatOpen ? '1px solid rgba(245,165,42,0.15)' : 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(78,205,196,0.5)" strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
            <span style={{ fontSize: '0.6875rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(240,235,225,0.6)', fontWeight: 600 }}>Asistente de Canvas</span>
          </div>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(240,235,225,0.25)" strokeWidth="2" style={{ transform: chatOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }}><polyline points="18 15 12 9 6 15"/></svg>
        </button>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ flex: 1, overflowY: 'auto', padding: '0.5rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {chatMsgs.length === 0 && <div style={{ fontSize: '0.75rem', color: 'rgba(240,235,225,0.45)', fontStyle: 'italic', textAlign: 'center', marginTop: 12 }}>Pregunta sobre el canon o pide agregar elementos al prompt (ej: "agrégale la mochila de Mateo").</div>}
            {chatMsgs.map((msg, i) => {
              const raw = msg.content || (chatStreaming && i === chatMsgs.length - 1 ? '...' : '')
              // Extract injectable block if present
              const injMatch = raw.match(/\[PROMPT_INJECTION\]([\s\S]*?)\[\/PROMPT_INJECTION\]/)
              const injectBlock = injMatch ? injMatch[1].trim() : null
              const displayText = injectBlock
                ? raw.replace(/\[PROMPT_INJECTION\][\s\S]*?\[\/PROMPT_INJECTION\]/, '').trim()
                : raw
              const hasOutputWithPrompt = nodes.some(n => n.type === 'output' && n.data.generatedPrompt)
              return (
                <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                  <div style={{ maxWidth: '82%' }}>
                    <div style={{ padding: '0.375rem 0.625rem', borderRadius: 3, fontSize: '0.8125rem', lineHeight: 1.55, background: msg.role === 'user' ? 'rgba(245,165,42,0.08)' : 'rgba(78,205,196,0.06)', border: `1px solid ${msg.role === 'user' ? 'rgba(245,165,42,0.12)' : 'rgba(78,205,196,0.1)'}`, color: 'rgba(240,235,225,0.7)', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                      {displayText}
                    </div>
                    {injectBlock && (
                      <div style={{ marginTop: '4px', padding: '6px 8px', borderRadius: 3, background: 'rgba(245,165,42,0.04)', border: '1px dashed rgba(245,165,42,0.25)' }}>
                        <div style={{ fontSize: '0.55rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(245,165,42,0.4)', marginBottom: '4px', fontWeight: 700 }}>Bloque a inyectar</div>
                        <div style={{ fontSize: '0.7rem', color: 'rgba(240,235,225,0.5)', whiteSpace: 'pre-wrap', wordBreak: 'break-word', lineHeight: 1.4, maxHeight: '80px', overflowY: 'auto' }}>{injectBlock}</div>
                        {hasOutputWithPrompt ? (
                          <button
                            onClick={() => injectIntoPrompt(injectBlock)}
                            style={{ marginTop: '6px', width: '100%', padding: '5px', background: 'rgba(245,165,42,0.12)', border: '1px solid rgba(245,165,42,0.4)', borderRadius: 3, color: '#F5A52A', fontSize: '0.7rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'IBM Plex Sans, sans-serif' }}
                          >
                            ✦ Agregar al prompt
                          </button>
                        ) : (
                          <div style={{ marginTop: '5px', fontSize: '0.6rem', color: 'rgba(240,235,225,0.25)', fontStyle: 'italic' }}>Genera un prompt primero para poder inyectar.</div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
            <div ref={chatBottomRef} />
          </div>
          <div style={{ flexShrink: 0, padding: '0.375rem 1rem', borderTop: '1px solid rgba(245,165,42,0.05)', display: 'flex', gap: '0.5rem' }}>
            <input type="text" value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') sendChat() }} placeholder="Pregunta al asistente... (Enter)" style={{ flex: 1, background: '#1A1235', border: '1px solid rgba(245,165,42,0.1)', borderRadius: 3, color: '#F0EBE1', fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '0.8125rem', padding: '5px 10px', outline: 'none' }} />
            <button onClick={sendChat} disabled={!chatInput.trim() || chatStreaming} style={{ padding: '5px 14px', background: 'transparent', border: '1px solid rgba(78,205,196,0.2)', borderRadius: 3, color: '#4ECDC4', cursor: 'pointer', fontSize: '0.8125rem', fontFamily: 'IBM Plex Sans, sans-serif' }}>Enviar</button>
          </div>
        </div>
      </div>
    </div>
  )
}
