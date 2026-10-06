'use client'

import { useState, useEffect, useRef } from 'react'
import ApprovalSeal from './ApprovalSeal'
import SlotUploader from './SlotUploader'
import CanonValidatorModal from './CanonValidatorModal'
import BulkUploadPanel from './BulkUploadPanel'
import type { AssetSlotWithApprovals, ValidationResult } from '@/lib/supabase'
import { storageUrl } from '@/lib/supabase'
import { REVIEWERS, SLOT_MATRIX, makeApprovedFileName } from '@/lib/approval-config'

interface EntityDef {
  entity_name: string
  entity_label: string
}

interface Props {
  entity: EntityDef
  category: string
  slots: AssetSlotWithApprovals[]
  userEmail: string
  onClose: () => void
  onSlotUpdated: (updated: AssetSlotWithApprovals) => void
  onSlotDeleted: (id: string) => void
}


const PRIORITY_FIELDS = [
  'Nombre completo', 'Código', 'Edad', 'Género', 'Nacionalidad',
  'Estatura', 'Complexión', 'Rol en la serie', 'Pelo', 'Ojos',
  'Rasgos distintivos', 'Vestuario canónico',
]

// ── Generation order by view_type ─────────────────────────────────────────────
const VIEW_TYPE_ORDER: Record<string, number> = {
  'Vista general': 1,
  'Versión etaria': 2,
  '3/4': 3,
  'Expresión': 4,
  'Outfit deportivo': 5,
  'Acción': 6,
  'Outfit casual': 7,
  'Accesorio': 8,
  // locaciones
  'Exterior': 1, 'Interior': 2, 'Plano general': 3, 'Detalle ambiental': 4, 'POV personaje': 5,
  // props
  'Vista frontal': 1, 'Vista lateral': 2, 'Vista superior': 3, 'Detalle': 4, 'En contexto': 5,
  // criaturas / secundarios / mascotas
  'Frente': 1, 'Lateral': 2, 'Escala': 5,
}

// Which view_type serves as master reference for each other view_type
const REFERENCE_VIEW_TYPE: Record<string, string> = {
  '3/4':             'Vista general',
  'Expresión':       'Vista general',
  'Outfit casual':   'Vista general',
  'Outfit deportivo':'Vista general',
  'Accesorio':       'Vista general',
  'Acción':          'Vista general',
  'Versión etaria':  'Vista general',
  // locaciones
  'Interior':        'Exterior',
  'Plano general':   'Exterior',
  'Detalle ambiental':'Exterior',
  'POV personaje':   'Exterior',
  // props
  'Vista lateral':   'Vista frontal',
  'Vista superior':  'Vista frontal',
  'Detalle':         'Vista frontal',
  'En contexto':     'Vista frontal',
  // criaturas
  'Lateral':         'Frente',
  'Escala':          'Frente',
}

// Find the best approved reference image for a given slot
function getReferenceImage(slot: AssetSlotWithApprovals, allSlots: AssetSlotWithApprovals[]): {
  url: string | null
  label: string
  isReady: boolean
} | null {
  const refViewType = REFERENCE_VIEW_TYPE[slot.view_type]

  // If this IS the master view type, no reference indicator needed
  if (!refViewType) return null

  // Find approved slots of the reference view_type
  const refSlots = allSlots.filter(s =>
    s.view_type === refViewType && s.status === 'approved' && s.approved_drive_file_id
  )

  if (refSlots.length > 0) {
    const best = refSlots[0]
    return {
      url: storageUrl(best.approved_drive_file_id),
      label: `Ref: ${refViewType}`,
      isReady: true,
    }
  }

  // Reference not yet approved — return null so nothing is shown
  return null
}

// ── Group slots by view_type and sort by SLOT_MATRIX order ───────────────────
function groupByViewType(slots: AssetSlotWithApprovals[], category: string) {
  const groups: Record<string, AssetSlotWithApprovals[]> = {}
  for (const slot of slots) {
    if (!groups[slot.view_type]) groups[slot.view_type] = []
    groups[slot.view_type].push(slot)
  }

  // Build outfit + age_version index from SLOT_MATRIX for deterministic sort
  const matrix = SLOT_MATRIX[category] ?? []
  const outfitIndex: Record<string, number> = {}
  const ageIndex: Record<string, number> = {}
  matrix.forEach((row, ri) => {
    const outfitKey = `${row.view_type}|||${row.outfit ?? ''}`
    if (outfitIndex[outfitKey] === undefined) outfitIndex[outfitKey] = ri
    row.age_versions.forEach((av, ai) => {
      const ageKey = `${row.view_type}|||${row.outfit ?? ''}|||${av}`
      if (ageIndex[ageKey] === undefined) ageIndex[ageKey] = ri * 100 + ai
    })
  })

  for (const vt of Object.keys(groups)) {
    groups[vt].sort((a, b) => {
      const aKey = `${vt}|||${a.outfit ?? ''}|||${a.age_version ?? ''}`
      const bKey = `${vt}|||${b.outfit ?? ''}|||${b.age_version ?? ''}`
      return (ageIndex[aKey] ?? 9999) - (ageIndex[bKey] ?? 9999)
    })
  }

  return groups
}

// ── Slot row ───────────────────────────────────────────────────────────────────
function copyToClipboard(text: string, setCopied: (v: boolean) => void) {
  const fallback = () => {
    const ta = document.createElement('textarea')
    ta.value = text
    ta.style.cssText = 'position:fixed;opacity:0;pointer-events:none'
    document.body.appendChild(ta)
    ta.select()
    try { document.execCommand('copy') } catch { /* ignore */ }
    document.body.removeChild(ta)
  }
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).catch(fallback)
  } else {
    fallback()
  }
  setCopied(true)
  setTimeout(() => setCopied(false), 1400)
}

function SlotRow({
  slot, userEmail, onUpdated, onDeleted, promptData, refImage, genOrder, validationResult, onShowValidation,
}: {
  slot: AssetSlotWithApprovals
  userEmail: string
  onUpdated: (updated: AssetSlotWithApprovals) => void
  onDeleted: (id: string) => void
  promptData?: { filename: string; prompt: string }
  refImage?: { url: string | null; label: string; isReady: boolean } | null
  genOrder?: number
  validationResult?: ValidationResult | null
  onShowValidation?: () => void
}) {
  const [voting, setVoting] = useState(false)
  const [removing, setRemoving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [copiedFilename, setCopiedFilename] = useState(false)
  const [copiedPrompt, setCopiedPrompt] = useState(false)
  const isReviewer  = !!REVIEWERS[userEmail]
  const myApproval  = slot.approvals?.find(a => a.reviewer_email === userEmail)
  const reviewerNames = Object.values(REVIEWERS)

  const thumbUrl = storageUrl(slot.pending_drive_file_id) ?? storageUrl(slot.approved_drive_file_id)

  const isCanonBlocked = validationResult?.verdict === 'critical'

  const canVote = !!(
    slot.pending_drive_file_id &&
    slot.status !== 'approved' &&
    slot.status !== 'rejected' &&
    isReviewer &&
    !myApproval &&
    !isCanonBlocked
  )
  const showUploader = slot.status === 'pending' && !slot.pending_drive_file_id
  const canRemove = !!(slot.pending_drive_file_id && slot.status !== 'approved')

  const getBadgeStatus = (name: string): 'approved' | 'rejected' | 'pending' => {
    const email = Object.entries(REVIEWERS).find(([, n]) => n === name)?.[0]
    const a = slot.approvals?.find(ap => ap.reviewer_email === email)
    if (!a) return 'pending'
    return a.approved ? 'approved' : 'rejected'
  }
  const getNote = (name: string) => {
    const email = Object.entries(REVIEWERS).find(([, n]) => n === name)?.[0]
    return slot.approvals?.find(ap => ap.reviewer_email === email)?.note ?? null
  }

  async function vote(approved: boolean, note?: string) {
    if (voting) return
    setVoting(true)
    try {
      const res = await fetch(`/api/assets/slots/${slot.id}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approved, note: note ?? null }),
      })
      const data = await res.json()
      if (data.slot) onUpdated(data.slot)
    } finally {
      setVoting(false)
    }
  }

  async function removeImage(e: React.MouseEvent) {
    e.stopPropagation()
    if (removing) return
    if (!confirm('¿Eliminar imagen y resetear este slot a Pendiente?')) return
    setRemoving(true)
    try {
      const res = await fetch(`/api/assets/slots/${slot.id}/remove-image`, { method: 'POST' })
      const data = await res.json()
      if (data.slot) onUpdated(data.slot)
    } finally {
      setRemoving(false)
    }
  }

  async function deleteSlot(e: React.MouseEvent) {
    e.stopPropagation()
    if (deleting) return
    if (!confirm(`¿Eliminar el slot "${slot.version_label}" permanentemente? Esto no se puede deshacer.`)) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/assets/slots/${slot.id}/delete`, { method: 'POST' })
      if (res.ok) onDeleted(slot.id)
    } finally {
      setDeleting(false)
    }
  }

  const STATUS_COLORS: Record<string, string> = {
    pending: 'rgba(240,235,225,0.2)', in_review: '#F5A52A',
    approved: '#4ECDC4', rejected: '#D4256A',
  }
  const statusColor = STATUS_COLORS[slot.status] ?? 'rgba(240,235,225,0.2)'

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '120px 1fr auto',
      gap: '12px',
      alignItems: 'start',
      padding: '10px 12px',
      background: slot.status === 'approved' ? 'rgba(78,205,196,0.04)' : 'rgba(255,255,255,0.02)',
      border: `1px solid ${statusColor}22`,
      borderRadius: '6px',
      position: 'relative',
    }}>
      {/* Generation order badge */}
      {genOrder !== undefined && (
        <div style={{
          position: 'absolute', top: 6, left: 6,
          width: 18, height: 18, borderRadius: '50%',
          background: 'rgba(8,6,15,0.85)', border: '1px solid rgba(245,165,42,0.25)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '0.5rem', color: 'rgba(245,165,42,0.6)', fontWeight: 700,
          fontFamily: 'monospace', zIndex: 2,
        }}>
          {genOrder}
        </div>
      )}
      {/* Thumbnail / uploader + reference */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <div style={{ height: '80px', borderRadius: '4px', overflow: 'hidden', position: 'relative', background: '#06040F', flexShrink: 0 }}>
        {thumbUrl ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <a href={thumbUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'block', width: '100%', height: '100%' }} title="Ver imagen completa">
              <img src={thumbUrl} alt={slot.version_label} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', cursor: 'zoom-in' }} />
            </a>
            {canRemove && (
              <button
                onClick={removeImage}
                disabled={removing}
                style={{
                  position: 'absolute', top: 4, right: 4,
                  width: 20, height: 20, borderRadius: 3,
                  background: 'rgba(8,6,15,0.85)', border: '1px solid rgba(212,37,106,0.4)',
                  color: '#D4256A', fontSize: '0.65rem', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                {removing ? '…' : '✕'}
              </button>
            )}
          </>
        ) : showUploader ? (
          <SlotUploader slot={slot} onUploaded={onUpdated} />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '0.5625rem', color: 'rgba(240,235,225,0.2)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Sin imagen</span>
          </div>
        )}
      </div>

      {/* Reference image indicator */}
      {refImage && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {refImage.url ? (
            <a href={refImage.url.replace('sz=w200', 'sz=w800')} target="_blank" rel="noopener noreferrer" title="Ver referencia">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={refImage.url} alt="ref" style={{ width: 36, height: 36, objectFit: 'cover', borderRadius: 3, border: '1px solid rgba(78,205,196,0.3)', display: 'block' }} />
            </a>
          ) : (
            <div style={{ width: 36, height: 36, borderRadius: 3, border: '1px dashed rgba(245,165,42,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '0.5rem', color: 'rgba(245,165,42,0.3)' }}>?</span>
            </div>
          )}
          <span style={{ fontSize: '0.5rem', color: refImage.isReady ? 'rgba(78,205,196,0.5)' : 'rgba(245,165,42,0.4)', letterSpacing: '0.04em', lineHeight: 1.3 }}>
            {refImage.label}
          </span>
        </div>
      )}
      </div>

      {/* Info + Prompt */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0 }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'rgba(240,235,225,0.85)', lineHeight: 1.3 }}>
          {slot.version_label}
        </div>
        {slot.status === 'approved' && slot.approved_drive_file_id && (
          <a
            href={`https://drive.google.com/file/d/${slot.approved_drive_file_id}/view`}
            target="_blank" rel="noopener noreferrer"
            style={{ fontSize: '0.6rem', color: '#4ECDC4', textDecoration: 'none', opacity: 0.7 }}
          >
            Ver en Drive →
          </a>
        )}
        <div style={{
          display: 'inline-flex', alignItems: 'center',
          padding: '1px 7px', borderRadius: 20,
          background: `${statusColor}18`, border: `1px solid ${statusColor}44`,
          fontSize: '0.5625rem', color: statusColor, fontWeight: 600,
          letterSpacing: '0.08em', textTransform: 'uppercase', alignSelf: 'flex-start',
        }}>
          {{pending:'Pendiente',in_review:'En revisión',approved:'Aprobado',rejected:'Rechazado'}[slot.status] ?? slot.status}
        </div>

        {/* Prompt block */}
        {promptData && (
          <div style={{ marginTop: 4, display: 'flex', flexDirection: 'column', gap: 4 }}>
            {/* Filename */}
            <div style={{
              fontFamily: 'monospace', fontSize: '0.5rem',
              color: '#4ECDC4', letterSpacing: '0.06em',
              background: 'rgba(78,205,196,0.06)', border: '1px solid rgba(78,205,196,0.15)',
              borderRadius: 3, padding: '3px 4px 3px 7px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6,
            }}>
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>{promptData.filename}</span>
              <button
                onClick={() => copyToClipboard(promptData.filename, setCopiedFilename)}
                style={{
                  background: copiedFilename ? 'rgba(78,205,196,0.2)' : 'rgba(78,205,196,0.08)',
                  border: '1px solid rgba(78,205,196,0.3)',
                  borderRadius: 3, color: copiedFilename ? '#4ECDC4' : 'rgba(78,205,196,0.6)',
                  cursor: 'pointer', padding: '3px 8px', fontSize: '0.6rem', lineHeight: 1,
                  flexShrink: 0, fontFamily: 'IBM Plex Sans, sans-serif', fontWeight: 600,
                  minWidth: 36, textAlign: 'center',
                }}
                title="Copiar nombre de archivo"
              >{copiedFilename ? '✓' : 'Copiar'}</button>
            </div>
            {/* Prompt text */}
            <div style={{ position: 'relative' }}>
              <div style={{
                fontSize: '0.6rem', color: 'rgba(240,235,225,0.45)',
                lineHeight: 1.55, background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(245,165,42,0.1)',
                borderRadius: 3, padding: '6px 8px 6px 8px',
                maxHeight: 88, overflowY: 'auto',
                wordBreak: 'break-word', paddingRight: 8,
              }}>
                {promptData.prompt}
              </div>
              <button
                onClick={() => copyToClipboard(promptData.prompt, setCopiedPrompt)}
                style={{
                  display: 'block', width: '100%', marginTop: 3,
                  background: copiedPrompt ? 'rgba(245,165,42,0.18)' : 'rgba(245,165,42,0.08)',
                  border: '1px solid rgba(245,165,42,0.25)',
                  borderRadius: 3, color: copiedPrompt ? '#F5A52A' : 'rgba(245,165,42,0.6)',
                  cursor: 'pointer', padding: '5px 8px', fontSize: '0.6rem',
                  fontFamily: 'IBM Plex Sans, sans-serif', fontWeight: 600,
                  letterSpacing: '0.04em', textAlign: 'center',
                }}
                title="Copiar prompt"
              >{copiedPrompt ? '✓ Copiado' : 'Copiar prompt'}</button>
            </div>
          </div>
        )}
      </div>

      {/* Seals */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end' }}>
        {/* Canon validation badge — clickeable para ver detalle */}
        {validationResult && (
          <div
            onClick={onShowValidation}
            title="Ver reporte de canon"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              padding: '2px 8px', borderRadius: 20,
              background: validationResult.verdict === 'critical'
                ? 'rgba(212,37,106,0.12)'
                : validationResult.verdict === 'warning'
                ? 'rgba(245,165,42,0.12)'
                : 'rgba(78,205,196,0.12)',
              border: `1px solid ${validationResult.verdict === 'critical' ? 'rgba(212,37,106,0.3)' : validationResult.verdict === 'warning' ? 'rgba(245,165,42,0.3)' : 'rgba(78,205,196,0.3)'}`,
              fontSize: '0.5rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
              color: validationResult.verdict === 'critical' ? '#D4256A' : validationResult.verdict === 'warning' ? '#F5A52A' : '#4ECDC4',
              cursor: onShowValidation ? 'pointer' : 'default',
            }}
          >
            {validationResult.verdict === 'critical' ? '✕ Canon inválido' : validationResult.verdict === 'warning' ? '⚠ Advertencias' : '✓ Canon'}
          </div>
        )}
        <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
          {reviewerNames.map(name => (
            <ApprovalSeal
              key={name}
              name={name}
              status={getBadgeStatus(name)}
              note={getNote(name)}
              canVote={canVote && Object.entries(REVIEWERS).find(([, n]) => n === name)?.[0] === userEmail}
              voting={voting}
              onApprove={() => vote(true)}
              onReject={(note) => vote(false, note)}
            />
          ))}
        </div>
        {isReviewer && slot.status !== 'approved' && (
          <button
            onClick={deleteSlot}
            disabled={deleting}
            title="Eliminar slot"
            style={{
              background: 'none', border: 'none', cursor: deleting ? 'not-allowed' : 'pointer',
              color: 'rgba(212,37,106,0.35)', fontSize: '0.65rem', padding: '2px 4px',
              transition: 'color 0.15s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = '#D4256A' }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = 'rgba(212,37,106,0.35)' }}
          >
            {deleting ? '…' : '✕ eliminar slot'}
          </button>
        )}
      </div>
    </div>
  )
}

// ── Main EntitySheet ───────────────────────────────────────────────────────────
export default function EntitySheet({ entity, category, slots, userEmail, onClose, onSlotUpdated, onSlotDeleted }: Props) {
  const [canonFields, setCanonFields] = useState<Record<string, string>>({})
  const [docId, setDocId] = useState<string | null>(null)
  const [loadingDoc, setLoadingDoc] = useState(true)
  const [debugInfo, setDebugInfo] = useState<string | null>(null)
  const [prompts, setPrompts] = useState<Record<string, { filename: string; prompt: string }>>({})
  const [generatingGroup, setGeneratingGroup] = useState<string | null>(null)
  const [groupErrors, setGroupErrors] = useState<Record<string, string>>({})
  const [validatingSlot, setValidatingSlot] = useState<AssetSlotWithApprovals | null>(null)
  const [showingResult, setShowingResult] = useState<{ slot: AssetSlotWithApprovals; result: ValidationResult } | null>(null)
  const [validationResults, setValidationResults] = useState<Record<string, ValidationResult>>({})
  const [validationSlots, setValidationSlots] = useState<Record<string, AssetSlotWithApprovals>>({})
  const [bulkMode, setBulkMode] = useState(false)
  const overlayRef = useRef<HTMLDivElement>(null)

  // ── Load persisted prompts from fresh slot data ────────────────────────────
  useEffect(() => {
    fetch(`/api/assets/slots?entity_name=${encodeURIComponent(entity.entity_name)}`)
      .then(r => r.json())
      .then((freshSlots: Array<{ id: string; view_type: string; outfit: string | null; age_version: string | null; generated_prompt: string | null }>) => {
        if (!Array.isArray(freshSlots)) return
        const loaded: Record<string, { filename: string; prompt: string }> = {}
        freshSlots.forEach((s, i) => {
          if (s.generated_prompt) {
            loaded[s.id] = {
              prompt: s.generated_prompt,
              filename: makeApprovedFileName(entity.entity_name, s.view_type, s.outfit ?? null, s.age_version ?? '', i + 1),
            }
          }
        })
        if (Object.keys(loaded).length > 0) setPrompts(loaded)
      })
      .catch(() => {})
  }, [entity.entity_name])

  // ── Load canonical doc ──────────────────────────────────────────────────────
  useEffect(() => {
    async function load() {
      // Símbolos don't have character-style Bible docs — skip lookup
      if (category === 'simbolos') {
        setLoadingDoc(false)
        return
      }
      setLoadingDoc(true)
      setDebugInfo(null)
      try {
        const params = new URLSearchParams({
          entity_name:  entity.entity_name,
          entity_label: entity.entity_label,
        })
        const res = await fetch(`/api/assets/entity-doc?${params}`)
        if (!res.ok) {
          setDebugInfo(`API error: ${res.status}`)
          return
        }
        const data = await res.json()
        if (data.error) { setDebugInfo(`Error: ${data.error}`); return }
        if (data.match) {
          setDocId(data.match.id)
          if (data.fields && Object.keys(data.fields).length > 0) {
            setCanonFields(data.fields)
          } else {
            setDebugInfo(`Doc encontrado: "${data.match.title}" pero sin campos **Key**: Value`)
          }
        } else {
          const dbg = data.debug
          const titlesStr = dbg?.titles?.map((t: { id: string; norm: string }) => t.norm).join(', ') ?? '—'
          setDebugInfo(`Sin match. Keywords: [${dbg?.keywords?.join(', ')}]. Primeros títulos: ${titlesStr}`)
        }
      } catch (e) {
        setDebugInfo(`Fetch error: ${String(e)}`)
      } finally {
        setLoadingDoc(false)
      }
    }
    load()
  }, [entity])

  // ── Generate prompts for a specific view_type group ────────────────────────
  async function handleGenerateGroup(viewType: string, groupSlots: AssetSlotWithApprovals[]) {
    if (generatingGroup) return
    setGeneratingGroup(viewType)
    setGroupErrors(prev => { const n = { ...prev }; delete n[viewType]; return n })
    try {
      const slotPayload = groupSlots.map((s, i) => ({
        id: s.id,
        view_type: s.view_type,
        outfit: s.outfit ?? null,
        age_version: s.age_version,
        version_label: s.version_label,
        filename: makeApprovedFileName(entity.entity_name, s.view_type, s.outfit ?? null, s.age_version ?? '', i + 1),
      }))
      const res = await fetch('/api/assets/generate-prompts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          entity_name: entity.entity_name,
          entity_label: entity.entity_label,
          canonical_fields: canonFields,
          slots: slotPayload,
        }),
      })
      const data = await res.json()
      if (data.error) { setGroupErrors(prev => ({ ...prev, [viewType]: data.error })); return }
      if (data.prompts && Object.keys(data.prompts).length > 0) {
        setPrompts(prev => ({ ...prev, ...data.prompts }))
      } else {
        setGroupErrors(prev => ({ ...prev, [viewType]: 'Sin respuesta. Intenta de nuevo.' }))
      }
    } catch (e) {
      setGroupErrors(prev => ({ ...prev, [viewType]: String(e) }))
    } finally {
      setGeneratingGroup(null)
    }
  }

  // ── Close on overlay click ──────────────────────────────────────────────────
  function handleOverlayClick(e: React.MouseEvent) {
    if (e.target === overlayRef.current) onClose()
  }

  // ── Best thumbnail for portrait ─────────────────────────────────────────────
  // Priority: Vista general · Frente (edad actual) → any Vista general → any approved → any pending
  const portrait = (() => {
    const fileOf = (s: AssetSlotWithApprovals) =>
      s.status === 'approved' ? storageUrl(s.approved_drive_file_id) : storageUrl(s.pending_drive_file_id)

    const isVG   = (s: AssetSlotWithApprovals) => s.view_type === 'Vista general'
    const isFront = (s: AssetSlotWithApprovals) => /frente/i.test(s.version_label)
    const isCurrentAge = (s: AssetSlotWithApprovals) => !s.age_version

    const approved = slots.filter(s => s.status === 'approved' && s.approved_drive_file_id)

    const pick = (list: AssetSlotWithApprovals[]) =>
      list.find(s => isVG(s) && isFront(s) && isCurrentAge(s)) ??
      list.find(s => isVG(s) && isFront(s)) ??
      list.find(s => isVG(s)) ??
      list[0]

    if (approved.length) {
      const best = pick(approved)
      if (best) return fileOf(best)
    }
    const pending = slots.filter(s => s.pending_drive_file_id)
    if (pending.length) {
      const best = pick(pending)
      if (best) return fileOf(best)
    }
    return null
  })()

  const approvedCount = slots.filter(s => s.status === 'approved').length
  const totalCount = slots.length
  const pct = totalCount > 0 ? Math.round((approvedCount / totalCount) * 100) : 0

  // ── Group slots by view_type ────────────────────────────────────────────────
  const groups = groupByViewType(slots, category)
  const viewTypeOrder = (SLOT_MATRIX[category] ?? []).map(r => r.view_type).filter((v, i, a) => a.indexOf(v) === i)

  return (
    <>
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(8,6,15,0.88)',
        zIndex: 500,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '2rem',
        backdropFilter: 'blur(4px)',
      }}
    >
      <div style={{
        width: '100%', maxWidth: 1100, maxHeight: '90vh',
        background: '#0D0920',
        border: '1px solid rgba(245,165,42,0.15)',
        borderRadius: '8px',
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden',
        boxShadow: '0 24px 80px rgba(0,0,0,0.7)',
      }}>
        {/* Header */}
        <div style={{
          flexShrink: 0,
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid rgba(245,165,42,0.08)',
          display: 'flex', alignItems: 'center', gap: '1rem',
        }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.5625rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(240,235,225,0.3)', marginBottom: 4 }}>
              Ficha de asset canónico
            </div>
            <div style={{ fontFamily: 'Bebas Neue, Impact, sans-serif', fontSize: '2rem', letterSpacing: '0.05em', color: '#F0EBE1', lineHeight: 1 }}>
              {entity.entity_label}
            </div>
          </div>
          {Object.keys(prompts).length > 0 && (
            <div style={{ fontSize: '0.5625rem', color: '#4ECDC4', fontWeight: 600, letterSpacing: '0.06em', flexShrink: 0 }}>
              ✓ {Object.keys(prompts).length} prompts
            </div>
          )}
          {/* Bulk mode toggle */}
          <button
            onClick={() => setBulkMode(v => !v)}
            style={{
              padding: '0.375rem 0.875rem',
              background: bulkMode ? 'rgba(245,165,42,0.15)' : 'rgba(245,165,42,0.07)',
              border: `1px solid ${bulkMode ? 'rgba(245,165,42,0.5)' : 'rgba(245,165,42,0.2)'}`,
              borderRadius: 5,
              color: bulkMode ? '#F5A52A' : 'rgba(245,165,42,0.6)',
              fontSize: '0.6875rem', fontWeight: 700, cursor: 'pointer',
              fontFamily: 'IBM Plex Sans, sans-serif', letterSpacing: '0.06em',
              textTransform: 'uppercase', flexShrink: 0,
              transition: 'all 0.15s',
            }}
          >
            {bulkMode ? '← Vista normal' : '↑ Subida masiva'}
          </button>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

          {/* Progress */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
            <div style={{ fontSize: '0.6875rem', color: approvedCount === totalCount ? '#4ECDC4' : 'rgba(240,235,225,0.4)' }}>
              <span style={{ fontWeight: 700, color: approvedCount === totalCount ? '#4ECDC4' : '#F5A52A' }}>{approvedCount}</span>
              <span style={{ color: 'rgba(240,235,225,0.3)' }}>/{totalCount} aprobados</span>
            </div>
            <div style={{ width: 120, height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${pct}%`, background: pct === 100 ? '#4ECDC4' : 'linear-gradient(90deg,#F5A52A,#4ECDC4)', transition: 'width 0.4s' }} />
            </div>
          </div>
          {/* Close */}
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'rgba(240,235,225,0.35)', cursor: 'pointer', padding: '0.25rem', flexShrink: 0 }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, minHeight: 0, display: 'flex', overflow: 'hidden' }}>
          {/* Left: canonical data */}
          <div style={{
            width: 260, flexShrink: 0,
            borderRight: '1px solid rgba(245,165,42,0.08)',
            overflowY: 'auto',
            padding: '1.25rem',
            display: 'flex', flexDirection: 'column', gap: '1rem',
          }}>
            {/* Portrait */}
            <div style={{
              width: '100%', aspectRatio: category === 'simbolos' ? '1/1' : '3/4', maxHeight: 200,
              borderRadius: '6px', overflow: 'hidden',
              background: 'linear-gradient(135deg, rgba(245,165,42,0.08), rgba(78,205,196,0.06))',
              border: '1px solid rgba(245,165,42,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              {portrait ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={portrait} alt={entity.entity_label} style={{ width: '100%', height: '100%', objectFit: category === 'simbolos' ? 'contain' : 'cover' }} />
              ) : (
                <span style={{ fontFamily: 'Bebas Neue, Impact, sans-serif', fontSize: '3rem', color: 'rgba(245,165,42,0.15)', letterSpacing: '0.05em' }}>
                  {entity.entity_label.charAt(0)}
                </span>
              )}
            </div>

            {/* Fields */}
            {category === 'simbolos' ? (
              <div style={{ fontSize: '0.65rem', color: 'rgba(240,235,225,0.3)', lineHeight: 1.6 }}>
                <div style={{ fontSize: '0.5rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(240,235,225,0.2)', fontWeight: 700, marginBottom: 4 }}>Código</div>
                <div style={{ fontSize: '0.875rem', color: 'rgba(240,235,225,0.7)', fontFamily: 'IBM Plex Mono, monospace' }}>
                  {entity.entity_name.replace('LPS', 'LP-S').split('_')[0]}
                </div>
                <div style={{ marginTop: 12, fontSize: '0.65rem', color: 'rgba(240,235,225,0.25)', fontStyle: 'italic' }}>
                  Sube la ficha técnica oficial para aprobar este símbolo.
                </div>
              </div>
            ) : loadingDoc ? (
              <div style={{ fontSize: '0.75rem', color: 'rgba(240,235,225,0.2)', fontStyle: 'italic' }}>Cargando datos canónicos...</div>
            ) : Object.keys(canonFields).length === 0 ? (
              <div style={{ fontSize: '0.65rem', color: 'rgba(240,235,225,0.25)', fontStyle: 'italic', lineHeight: 1.5 }}>
                Sin doc canónico
                {debugInfo && <div style={{ marginTop: 6, color: '#F5A52A', opacity: 0.6, wordBreak: 'break-word' }}>{debugInfo}</div>}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {/* Priority fields first, then rest */}
                {[
                  ...PRIORITY_FIELDS.filter(k => canonFields[k]),
                  ...Object.keys(canonFields).filter(k => !PRIORITY_FIELDS.includes(k)),
                ].slice(0, 18).map(key => (
                  <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <div style={{ fontSize: '0.5rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(240,235,225,0.28)', fontWeight: 700 }}>
                      {key}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'rgba(240,235,225,0.75)', lineHeight: 1.4 }}>
                      {canonFields[key]}
                    </div>
                  </div>
                ))}
                {docId && (
                  <a
                    href={`/bible`}
                    style={{ fontSize: '0.6rem', color: 'rgba(78,205,196,0.5)', textDecoration: 'none', marginTop: 4 }}
                  >
                    Ver en Biblia →
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Right: slots or bulk upload */}
          {bulkMode ? (
            <div style={{ flex: 1, overflowY: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <BulkUploadPanel
                entity={entity}
                category={category}
                slots={slots}
                onSlotsUpdated={(updated) => {
                  updated.forEach(s => onSlotUpdated(s))
                }}
                onClose={() => setBulkMode(false)}
              />
            </div>
          ) : null}
          <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem', display: bulkMode ? 'none' : 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {(() => {
              let orderCounter = 0
              const orderedVTs = [
                ...viewTypeOrder.filter(vt => groups[vt]),
                ...Object.keys(groups).filter(vt => !viewTypeOrder.includes(vt)),
              ]
              return orderedVTs.map(viewType => (
                <div key={viewType}>
                  <div style={{
                    fontSize: '0.5625rem', letterSpacing: '0.18em', textTransform: 'uppercase',
                    color: 'rgba(240,235,225,0.3)', fontWeight: 700,
                    marginBottom: '0.625rem', paddingBottom: '0.375rem',
                    borderBottom: '1px solid rgba(245,165,42,0.06)',
                    display: 'flex', alignItems: 'center', gap: 8,
                  }}>
                    <span>{viewType}</span>
                    <span style={{ color: 'rgba(245,165,42,0.25)', fontSize: '0.5rem' }}>
                      {VIEW_TYPE_ORDER[viewType] !== undefined ? `paso ${VIEW_TYPE_ORDER[viewType]}` : ''}
                    </span>
                    <span style={{ flex: 1 }} />
                    {groupErrors[viewType] && (
                      <span style={{ fontSize: '0.5rem', color: '#D4256A', fontWeight: 600, letterSpacing: '0.02em', textTransform: 'none' }}>
                        Error — intenta de nuevo
                      </span>
                    )}
                    {category !== 'simbolos' && <button
                      onClick={() => handleGenerateGroup(viewType, groups[viewType])}
                      disabled={generatingGroup === viewType}
                      style={{
                        padding: '2px 8px',
                        background: generatingGroup === viewType ? 'rgba(245,165,42,0.04)' : 'rgba(245,165,42,0.08)',
                        border: '1px solid rgba(245,165,42,0.2)',
                        borderRadius: 3,
                        color: generatingGroup === viewType ? 'rgba(245,165,42,0.35)' : 'rgba(245,165,42,0.7)',
                        fontSize: '0.5rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
                        cursor: generatingGroup === viewType ? 'not-allowed' : 'pointer',
                        fontFamily: 'IBM Plex Sans, sans-serif',
                        display: 'flex', alignItems: 'center', gap: 4,
                      }}
                    >
                      {generatingGroup === viewType ? (
                        <>
                          <span style={{ display: 'inline-block', width: 8, height: 8, border: '1.5px solid rgba(245,165,42,0.2)', borderTopColor: 'rgba(245,165,42,0.6)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                          Generando
                        </>
                      ) : (
                        groups[viewType].some(s => prompts[s.id]) ? '↺ Regenerar' : '✦ Generar'
                      )}
                    </button>}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {groups[viewType].map(slot => {
                      orderCounter++
                      return (
                        <SlotRow
                          key={slot.id}
                          slot={slot}
                          userEmail={userEmail}
                          onUpdated={(updated) => {
                            onSlotUpdated(updated)
                            // Trigger canon validation when image is freshly uploaded
                            if (updated.status === 'in_review' && updated.pending_drive_file_id) {
                              setValidatingSlot(updated)
                            }
                          }}
                          onDeleted={onSlotDeleted}
                          promptData={prompts[slot.id]}
                          refImage={getReferenceImage(slot, slots)}
                          genOrder={orderCounter}
                          validationResult={validationResults[slot.id] ?? null}
                          onShowValidation={validationResults[slot.id] && validationSlots[slot.id] ? () => setShowingResult({ slot: validationSlots[slot.id], result: validationResults[slot.id] }) : undefined}
                        />
                      )
                    })}
                  </div>
                </div>
              ))
            })()}
          </div>
        </div>
      </div>
    </div>

    {/* Canon Validator Modal — scanning mode (post-upload) */}
    {validatingSlot && (
      <CanonValidatorModal
        slot={validatingSlot}
        canonicalFields={canonFields}
        onClose={() => setValidatingSlot(null)}
        onResult={(result) => {
          setValidationResults(prev => ({ ...prev, [validatingSlot.id]: result }))
          setValidationSlots(prev => ({ ...prev, [validatingSlot.id]: validatingSlot }))
        }}
      />
    )}

    {/* Canon Validator Modal — read-only result view */}
    {showingResult && !validatingSlot && (
      <CanonValidatorModal
        slot={showingResult.slot}
        canonicalFields={canonFields}
        initialResult={showingResult.result}
        onClose={() => setShowingResult(null)}
        onResult={() => {}}
      />
    )}
    </>
  )
}
