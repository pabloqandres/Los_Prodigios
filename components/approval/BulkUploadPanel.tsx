'use client'

import { useState, useRef } from 'react'
import type { AssetSlotWithApprovals } from '@/lib/supabase'
import { SLOT_MATRIX } from '@/lib/approval-config'

interface Props {
  entity: { entity_name: string; entity_label: string }
  category: string
  slots: AssetSlotWithApprovals[]
  onSlotsUpdated: (updated: AssetSlotWithApprovals[]) => void
  onClose: () => void
}

interface SlotDrop {
  slot: AssetSlotWithApprovals
  file: File | null
  preview: string | null
  status: 'empty' | 'ready' | 'uploading' | 'uploaded' | 'error'
  uploadedSlot?: AssetSlotWithApprovals
  errorMsg?: string
}

function sortedPendingSlots(slots: AssetSlotWithApprovals[], category: string): AssetSlotWithApprovals[] {
  const matrix = SLOT_MATRIX[category] ?? []
  const ageIndex: Record<string, number> = {}
  matrix.forEach((row, ri) => {
    row.age_versions.forEach((av, ai) => {
      const key = `${row.view_type}|||${row.outfit ?? ''}|||${av}`
      if (ageIndex[key] === undefined) ageIndex[key] = ri * 100 + ai
    })
  })
  return slots
    .filter(s => s.status !== 'approved')
    .sort((a, b) => {
      const ka = `${a.view_type}|||${a.outfit ?? ''}|||${a.age_version ?? ''}`
      const kb = `${b.view_type}|||${b.outfit ?? ''}|||${b.age_version ?? ''}`
      return (ageIndex[ka] ?? 9999) - (ageIndex[kb] ?? 9999)
    })
}

function resizeAndEncode(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      const MAX = 2048
      let { width, height } = img
      if (width > MAX || height > MAX) {
        const ratio = Math.min(MAX / width, MAX / height)
        width = Math.round(width * ratio)
        height = Math.round(height * ratio)
      }
      const canvas = document.createElement('canvas')
      canvas.width = width; canvas.height = height
      canvas.getContext('2d')!.drawImage(img, 0, 0, width, height)
      URL.revokeObjectURL(url)
      resolve(canvas.toDataURL('image/jpeg', 0.92).split(',')[1])
    }
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Error leyendo imagen')) }
    img.src = url
  })
}

// ── Individual slot drop card ──────────────────────────────────────────────────
function SlotDropCard({
  item, index, onDrop, onClear,
}: {
  item: SlotDrop
  index: number
  onDrop: (idx: number, file: File) => void
  onClear: (idx: number) => void
}) {
  const [over, setOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const statusColor = item.status === 'uploaded' ? '#4ECDC4'
    : item.status === 'error' ? '#D4256A'
    : item.status === 'uploading' ? '#F5A52A'
    : item.status === 'ready' ? '#F5A52A'
    : 'rgba(255,255,255,0.08)'

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setOver(false)
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) onDrop(index, file)
  }

  return (
    <div
      onDragOver={e => { e.preventDefault(); setOver(true) }}
      onDragLeave={() => setOver(false)}
      onDrop={handleDrop}
      onClick={() => item.status === 'empty' && inputRef.current?.click()}
      style={{
        border: `1.5px ${item.status === 'empty' ? 'dashed' : 'solid'} ${over ? '#F5A52A' : statusColor}`,
        borderRadius: 6,
        background: over ? 'rgba(245,165,42,0.06)' : item.status === 'uploaded' ? 'rgba(78,205,196,0.04)' : 'rgba(255,255,255,0.01)',
        cursor: item.status === 'empty' ? 'pointer' : 'default',
        transition: 'all 0.12s',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={e => { const f = e.target.files?.[0]; if (f) { onDrop(index, f); e.target.value = '' } }}
      />

      {/* Label header — always visible */}
      <div style={{
        padding: '5px 7px 5px',
        background: 'rgba(0,0,0,0.35)',
        borderBottom: `1px solid ${statusColor}22`,
        display: 'flex', alignItems: 'flex-start', gap: 5,
      }}>
        {/* Number */}
        <span style={{
          fontSize: '0.45rem', fontWeight: 700,
          color: statusColor === 'rgba(255,255,255,0.08)' ? 'rgba(240,235,225,0.25)' : statusColor,
          fontFamily: 'monospace', flexShrink: 0, marginTop: 1,
        }}>{index + 1}</span>
        {/* Label parts */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 1, minWidth: 0 }}>
          <span style={{
            fontSize: '0.5625rem', fontWeight: 700, lineHeight: 1.2,
            color: item.status === 'uploaded' ? '#4ECDC4'
              : item.status === 'ready' ? '#F5A52A'
              : 'rgba(240,235,225,0.9)',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>
            {item.slot.view_type}
          </span>
          {item.slot.outfit && (
            <span style={{
              fontSize: '0.5rem', lineHeight: 1.2,
              color: item.status === 'uploaded' ? 'rgba(78,205,196,0.7)'
                : item.status === 'ready' ? 'rgba(245,165,42,0.7)'
                : 'rgba(240,235,225,0.45)',
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>
              {item.slot.outfit}
            </span>
          )}
          {item.slot.age_version && (
            <span style={{
              fontSize: '0.5rem', lineHeight: 1.2,
              color: item.status === 'uploaded' ? 'rgba(78,205,196,0.55)'
                : item.status === 'ready' ? 'rgba(245,165,42,0.55)'
                : 'rgba(240,235,225,0.35)',
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>
              {item.slot.age_version}
            </span>
          )}
        </div>
      </div>

      {/* Clear button */}
      {(item.status === 'ready' || item.status === 'error') && (
        <button
          onClick={e => { e.stopPropagation(); onClear(index) }}
          style={{
            position: 'absolute', top: 4, right: 4,
            width: 16, height: 16, borderRadius: 3, zIndex: 2,
            background: 'rgba(8,6,15,0.85)', border: '1px solid rgba(212,37,106,0.4)',
            color: '#D4256A', fontSize: '0.55rem', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0,
          }}
        >✕</button>
      )}

      {/* Image area */}
      <div style={{ height: 80, background: '#060410', flexShrink: 0, position: 'relative', overflow: 'hidden' }}>
        {item.preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.preview} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : item.status === 'uploading' ? (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: 20, height: 20, border: '2px solid rgba(245,165,42,0.2)', borderTopColor: '#F5A52A', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          </div>
        ) : item.status === 'uploaded' ? (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4ECDC4" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5">
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <path d="M3 15l5-5 4 4 3-3 6 6"/>
            </svg>
            {over && <div style={{ fontSize: '0.5rem', color: '#F5A52A', letterSpacing: '0.06em', fontWeight: 700 }}>SOLTAR</div>}
          </div>
        )}
      </div>

      {item.status === 'error' && (
        <div style={{ padding: '3px 7px', fontSize: '0.45rem', color: '#D4256A' }}>{item.errorMsg}</div>
      )}
    </div>
  )
}

// ── Main panel ─────────────────────────────────────────────────────────────────
export default function BulkUploadPanel({ entity, category, slots, onSlotsUpdated, onClose }: Props) {
  const pending = sortedPendingSlots(slots, category)

  const [drops, setDrops] = useState<SlotDrop[]>(() =>
    pending.map(s => ({ slot: s, file: null, preview: null, status: 'empty' }))
  )
  const [uploading, setUploading] = useState(false)
  const [approving, setApproving] = useState(false)
  const [done, setDone] = useState<{ uploaded: number; voted: number; errors: number } | null>(null)

  const readyCount    = drops.filter(d => d.status === 'ready').length
  const uploadedCount = drops.filter(d => d.status === 'uploaded').length
  const approvedAlready = slots.filter(s => s.status === 'approved').length

  function handleDrop(idx: number, file: File) {
    const preview = URL.createObjectURL(file)
    setDrops(prev => {
      const next = [...prev]
      if (next[idx].preview && next[idx].status === 'ready') URL.revokeObjectURL(next[idx].preview!)
      next[idx] = { ...next[idx], file, preview, status: 'ready', errorMsg: undefined }
      return next
    })
  }

  function handleClear(idx: number) {
    setDrops(prev => {
      const next = [...prev]
      if (next[idx].preview) URL.revokeObjectURL(next[idx].preview!)
      next[idx] = { ...next[idx], file: null, preview: null, status: 'empty', errorMsg: undefined }
      return next
    })
  }

  async function uploadAll() {
    const toUpload = drops.filter(d => d.status === 'ready')
    if (!toUpload.length) return
    setUploading(true)

    // Upload in batches of 4
    for (let i = 0; i < drops.length; i += 4) {
      const batch = drops.slice(i, i + 4).filter(d => d.status === 'ready')
      await Promise.all(batch.map(async item => {
        const idx = drops.findIndex(d => d.slot.id === item.slot.id)
        setDrops(prev => { const n = [...prev]; n[idx] = { ...n[idx], status: 'uploading' }; return n })
        try {
          const b64 = await resizeAndEncode(item.file!)
          const res = await fetch('/api/assets/upload-to-slot', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              slot_id: item.slot.id,
              b64,
              filename: `${entity.entity_name}_${item.slot.view_type}_${item.slot.outfit ?? ''}_${item.slot.id}_${Date.now()}.jpg`,
              mimeType: 'image/jpeg',
            }),
          })
          const data = await res.json()
          if (!res.ok) throw new Error(data.error ?? 'Error')
          setDrops(prev => { const n = [...prev]; n[idx] = { ...n[idx], status: 'uploaded', uploadedSlot: data.slot }; return n })
        } catch (err) {
          setDrops(prev => { const n = [...prev]; n[idx] = { ...n[idx], status: 'error', errorMsg: String(err) }; return n })
        }
      }))
    }
    setUploading(false)
  }

  async function approveAll() {
    const toApprove = drops.filter(d => d.status === 'uploaded' && d.uploadedSlot)
    if (!toApprove.length) return
    setApproving(true)
    const res = await fetch('/api/assets/bulk-approve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slot_ids: toApprove.map(d => d.uploadedSlot!.id) }),
    })
    const data = await res.json()
    if (res.ok) {
      setDone({ uploaded: uploadedCount, voted: data.summary.voted + data.summary.fully_approved, errors: data.summary.errors })
      onSlotsUpdated(toApprove.map(d => d.uploadedSlot!))
    }
    setApproving(false)
  }

  if (done) {
    return (
      <div style={{ padding: '3rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
        <div style={{ fontFamily: 'Bebas Neue, Impact, sans-serif', fontSize: '2rem', color: '#4ECDC4', letterSpacing: '0.06em' }}>
          ✓ Tu aprobación registrada
        </div>
        <div style={{ fontSize: '0.8125rem', color: 'rgba(240,235,225,0.4)', textAlign: 'center', maxWidth: 300, lineHeight: 1.6 }}>
          Los slots quedan en <strong style={{ color: '#F5A52A' }}>En revisión</strong> hasta que Trinidad apruebe su parte.
        </div>
        <div style={{ display: 'flex', gap: '2rem', marginTop: '0.5rem' }}>
          {[
            { val: done.uploaded, label: 'Subidas', color: '#F5A52A' },
            { val: done.voted, label: 'Votos', color: '#4ECDC4' },
            { val: done.errors, label: 'Errores', color: '#D4256A' },
          ].map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'Bebas Neue, Impact, sans-serif', fontSize: '2.5rem', color: s.color, lineHeight: 1 }}>{s.val}</div>
              <div style={{ fontSize: '0.5625rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(240,235,225,0.3)' }}>{s.label}</div>
            </div>
          ))}
        </div>
        <button
          onClick={onClose}
          style={{ marginTop: '1rem', padding: '0.5rem 1.5rem', background: 'rgba(78,205,196,0.12)', border: '1px solid rgba(78,205,196,0.3)', borderRadius: 6, color: '#4ECDC4', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'IBM Plex Sans, sans-serif' }}
        >
          Cerrar y ver resultados
        </button>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>

      {/* Top bar */}
      <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: '1rem', flexShrink: 0 }}>
        <div style={{ fontSize: '0.5625rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(240,235,225,0.3)', flex: 1 }}>
          Arrastra imágenes desde Finder a cada slot · {pending.length} pendientes · {approvedAlready} aprobados
        </div>
        {readyCount > 0 && (
          <div style={{ fontSize: '0.5625rem', color: '#F5A52A', fontWeight: 700 }}>
            {readyCount} lista{readyCount > 1 ? 's' : ''} para subir
          </div>
        )}
        {uploadedCount > 0 && (
          <div style={{ fontSize: '0.5625rem', color: '#4ECDC4', fontWeight: 700 }}>
            {uploadedCount} subida{uploadedCount > 1 ? 's' : ''}
          </div>
        )}
      </div>

      {/* Slot grid — scrollable */}
      <div style={{
        flex: 1, overflowY: 'auto', padding: '0.875rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
        gap: '0.625rem',
        alignContent: 'start',
      }}>
        {drops.map((item, idx) => (
          <SlotDropCard
            key={item.slot.id}
            item={item}
            index={idx}
            onDrop={handleDrop}
            onClear={handleClear}
          />
        ))}
      </div>

      {/* Action bar */}
      <div style={{ padding: '0.75rem 1rem', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: '0.625rem', flexShrink: 0 }}>
        <button
          onClick={uploadAll}
          disabled={uploading || readyCount === 0}
          style={{
            flex: 1, padding: '0.5rem',
            background: readyCount > 0 && !uploading ? 'rgba(245,165,42,0.12)' : 'rgba(245,165,42,0.04)',
            border: `1px solid ${readyCount > 0 && !uploading ? 'rgba(245,165,42,0.4)' : 'rgba(245,165,42,0.1)'}`,
            borderRadius: 5, color: readyCount > 0 && !uploading ? '#F5A52A' : 'rgba(245,165,42,0.3)',
            fontSize: '0.75rem', fontWeight: 700, cursor: readyCount > 0 && !uploading ? 'pointer' : 'not-allowed',
            fontFamily: 'IBM Plex Sans, sans-serif',
          }}
        >
          {uploading ? '↑ Subiendo...' : `↑ Subir ${readyCount > 0 ? readyCount : ''} imagen${readyCount !== 1 ? 'es' : ''}`}
        </button>
        <button
          onClick={approveAll}
          disabled={approving || uploadedCount === 0}
          style={{
            flex: 1, padding: '0.5rem',
            background: uploadedCount > 0 && !approving ? 'rgba(78,205,196,0.12)' : 'rgba(78,205,196,0.04)',
            border: `1px solid ${uploadedCount > 0 && !approving ? 'rgba(78,205,196,0.4)' : 'rgba(78,205,196,0.1)'}`,
            borderRadius: 5, color: uploadedCount > 0 && !approving ? '#4ECDC4' : 'rgba(78,205,196,0.3)',
            fontSize: '0.75rem', fontWeight: 700, cursor: uploadedCount > 0 && !approving ? 'pointer' : 'not-allowed',
            fontFamily: 'IBM Plex Sans, sans-serif',
          }}
        >
          {approving ? '✓ Aprobando...' : `✓ Mi aprobación (${uploadedCount || '—'})`}
        </button>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
