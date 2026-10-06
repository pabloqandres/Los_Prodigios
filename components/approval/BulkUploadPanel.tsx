'use client'

import { useState, useRef, useCallback } from 'react'
import type { AssetSlotWithApprovals } from '@/lib/supabase'
import { SLOT_MATRIX } from '@/lib/approval-config'

interface Props {
  entity: { entity_name: string; entity_label: string }
  category: string
  slots: AssetSlotWithApprovals[]
  onSlotsUpdated: (updated: AssetSlotWithApprovals[]) => void
  onClose: () => void
}

interface QueueItem {
  slot: AssetSlotWithApprovals
  file: File | null
  preview: string | null
  status: 'waiting' | 'uploading' | 'uploaded' | 'error'
  uploadedSlot?: AssetSlotWithApprovals
  errorMsg?: string
}

// Resize image to max 2048px and return base64
function resizeAndEncode(file: File): Promise<{ b64: string; mimeType: string }> {
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
      canvas.width = width
      canvas.height = height
      canvas.getContext('2d')!.drawImage(img, 0, 0, width, height)
      URL.revokeObjectURL(url)
      const b64 = canvas.toDataURL('image/jpeg', 0.92).split(',')[1]
      resolve({ b64, mimeType: 'image/jpeg' })
    }
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Error leyendo imagen')) }
    img.src = url
  })
}

// Sort slots in SLOT_MATRIX order
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

export default function BulkUploadPanel({ entity, category, slots, onSlotsUpdated, onClose }: Props) {
  const pendingSlots = sortedPendingSlots(slots, category)

  const [queue, setQueue] = useState<QueueItem[]>(() =>
    pendingSlots.map(s => ({ slot: s, file: null, preview: null, status: 'waiting' }))
  )
  const [draggingOver, setDraggingOver] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [approving, setApproving] = useState(false)
  const [summary, setSummary] = useState<{ uploaded: number; approved: number; errors: number } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const uploadedCount = queue.filter(q => q.status === 'uploaded').length
  const withFileCount = queue.filter(q => q.file !== null).length
  const approvedCount = slots.filter(s => s.status === 'approved').length

  // Assign files to queue slots sequentially
  const assignFiles = useCallback((files: File[]) => {
    const imageFiles = files.filter(f => f.type.startsWith('image/'))
    setQueue(prev => {
      const next = [...prev]
      let fi = 0
      for (let i = 0; i < next.length && fi < imageFiles.length; i++) {
        if (next[i].file === null && next[i].status === 'waiting') {
          const file = imageFiles[fi++]
          const preview = URL.createObjectURL(file)
          next[i] = { ...next[i], file, preview }
        }
      }
      return next
    })
  }, [])

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDraggingOver(false)
    const files = Array.from(e.dataTransfer.files)
    assignFiles(files)
  }

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    assignFiles(files)
    e.target.value = ''
  }

  function removeFile(idx: number) {
    setQueue(prev => {
      const next = [...prev]
      if (next[idx].preview) URL.revokeObjectURL(next[idx].preview!)
      next[idx] = { ...next[idx], file: null, preview: null, status: 'waiting' }
      return next
    })
  }

  async function uploadAll() {
    const toUpload = queue.filter(q => q.file && q.status === 'waiting')
    if (toUpload.length === 0) return
    setUploading(true)

    // Upload concurrently in batches of 4
    const batchSize = 4
    for (let i = 0; i < toUpload.length; i += batchSize) {
      const batch = toUpload.slice(i, i + batchSize)
      await Promise.all(batch.map(async (item) => {
        const idx = queue.findIndex(q => q.slot.id === item.slot.id)

        setQueue(prev => {
          const next = [...prev]
          next[idx] = { ...next[idx], status: 'uploading' }
          return next
        })

        try {
          const { b64, mimeType } = await resizeAndEncode(item.file!)
          const res = await fetch('/api/assets/upload-to-slot', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              slot_id: item.slot.id,
              b64,
              filename: `${entity.entity_name}_${item.slot.view_type}_${item.slot.outfit ?? ''}_${item.slot.id}_DRAFT_${Date.now()}.jpg`,
              mimeType,
            }),
          })
          const data = await res.json()
          if (!res.ok) throw new Error(data.error ?? 'Error')
          setQueue(prev => {
            const next = [...prev]
            next[idx] = { ...next[idx], status: 'uploaded', uploadedSlot: data.slot }
            return next
          })
        } catch (err) {
          setQueue(prev => {
            const next = [...prev]
            next[idx] = { ...next[idx], status: 'error', errorMsg: String(err) }
            return next
          })
        }
      }))
    }

    setUploading(false)
  }

  async function approveAll() {
    const uploaded = queue.filter(q => q.status === 'uploaded' && q.uploadedSlot)
    if (uploaded.length === 0) return
    setApproving(true)

    const slot_ids = uploaded.map(q => q.uploadedSlot!.id)
    const res = await fetch('/api/assets/bulk-approve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slot_ids }),
    })
    const data = await res.json()

    if (res.ok && data.summary) {
      setSummary({
        uploaded: uploadedCount,
        approved: data.summary.voted + data.summary.fully_approved,
        errors: data.summary.errors,
      })
      // Notify parent of changes
      onSlotsUpdated(uploaded.map(q => q.uploadedSlot!))
    }
    setApproving(false)
  }

  const ACCENT = '#F5A52A'

  if (summary) {
    return (
      <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
        <div style={{ fontFamily: 'Bebas Neue, Impact, sans-serif', fontSize: '2rem', color: '#4ECDC4', letterSpacing: '0.06em' }}>
          ✓ Tu aprobación registrada
        </div>
        <div style={{ fontSize: '0.75rem', color: 'rgba(240,235,225,0.4)', textAlign: 'center', maxWidth: 300 }}>
          Los slots quedan en <strong style={{ color: ACCENT }}>En revisión</strong> hasta que Trinidad apruebe su parte.
        </div>
        <div style={{ display: 'flex', gap: '2rem', marginTop: '0.5rem' }}>
          {[
            { val: summary.uploaded, label: 'Subidas', color: ACCENT },
            { val: summary.approved, label: 'Votos registrados', color: '#4ECDC4' },
            { val: summary.errors, label: 'Errores', color: '#D4256A' },
          ].map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'Bebas Neue, Impact, sans-serif', fontSize: '2.5rem', color: s.color, lineHeight: 1 }}>{s.val}</div>
              <div style={{ fontSize: '0.625rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(240,235,225,0.35)' }}>{s.label}</div>
            </div>
          ))}
        </div>
        <button
          onClick={onClose}
          style={{ marginTop: '1rem', padding: '0.5rem 1.5rem', background: 'rgba(78,205,196,0.12)', border: '1px solid rgba(78,205,196,0.3)', borderRadius: 6, color: '#4ECDC4', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'IBM Plex Sans, sans-serif' }}
        >
          Cerrar y actualizar
        </button>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem', height: '100%', overflowY: 'auto' }}>

      {/* Stats bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 6 }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: 'Bebas Neue, Impact, sans-serif', fontSize: '1.5rem', color: ACCENT, lineHeight: 1 }}>{pendingSlots.length}</div>
          <div style={{ fontSize: '0.5rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(240,235,225,0.3)' }}>Pendientes</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: 'Bebas Neue, Impact, sans-serif', fontSize: '1.5rem', color: '#4ECDC4', lineHeight: 1 }}>{approvedCount}</div>
          <div style={{ fontSize: '0.5rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(240,235,225,0.3)' }}>Aprobados</div>
        </div>
        <div style={{ flex: 1 }} />
        <div style={{ fontSize: '0.6875rem', color: 'rgba(240,235,225,0.35)' }}>
          {withFileCount > 0 ? <span style={{ color: ACCENT }}>{withFileCount} imagen{withFileCount > 1 ? 'es' : ''} asignada{withFileCount > 1 ? 's' : ''}</span> : 'Arrastra imágenes abajo'}
        </div>
      </div>

      {/* Drop zone */}
      <div
        onDragOver={e => { e.preventDefault(); setDraggingOver(true) }}
        onDragLeave={() => setDraggingOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        style={{
          border: `2px dashed ${draggingOver ? ACCENT : 'rgba(245,165,42,0.2)'}`,
          borderRadius: 8,
          padding: '1.5rem',
          textAlign: 'center',
          cursor: 'pointer',
          background: draggingOver ? `rgba(245,165,42,0.06)` : 'rgba(255,255,255,0.01)',
          transition: 'all 0.15s',
          flexShrink: 0,
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          style={{ display: 'none' }}
          onChange={handleFileInput}
        />
        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📂</div>
        <div style={{ fontSize: '0.875rem', color: draggingOver ? ACCENT : 'rgba(240,235,225,0.4)', fontWeight: 600 }}>
          {draggingOver ? 'Suelta las imágenes aquí' : 'Arrastra todas las imágenes o haz clic para seleccionar'}
        </div>
        <div style={{ fontSize: '0.6875rem', color: 'rgba(240,235,225,0.25)', marginTop: '0.25rem' }}>
          Se asignan en orden al SLOT_MATRIX · Múltiples archivos soportados
        </div>
      </div>

      {/* Slot queue */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', flex: 1 }}>
        {queue.map((item, idx) => {
          const statusColor = item.status === 'uploaded' ? '#4ECDC4' : item.status === 'error' ? '#D4256A' : item.status === 'uploading' ? ACCENT : 'rgba(255,255,255,0.15)'
          return (
            <div
              key={item.slot.id}
              style={{
                display: 'grid',
                gridTemplateColumns: '60px 1fr auto',
                gap: 8,
                alignItems: 'center',
                padding: '6px 8px',
                background: item.status === 'uploaded' ? 'rgba(78,205,196,0.04)' : item.file ? 'rgba(245,165,42,0.03)' : 'rgba(255,255,255,0.01)',
                border: `1px solid ${statusColor}22`,
                borderRadius: 5,
              }}
            >
              {/* Thumbnail */}
              <div style={{ width: 60, height: 42, borderRadius: 3, overflow: 'hidden', background: '#080614', flexShrink: 0 }}>
                {item.preview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.preview} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: '0.5rem', color: 'rgba(255,255,255,0.1)', letterSpacing: '0.06em' }}>{idx + 1}</span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'rgba(240,235,225,0.8)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {item.slot.version_label}
                </div>
                {item.file && item.status === 'waiting' && (
                  <div style={{ fontSize: '0.5625rem', color: ACCENT, marginTop: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {item.file.name}
                  </div>
                )}
                {item.status === 'uploading' && (
                  <div style={{ fontSize: '0.5625rem', color: ACCENT, marginTop: 1 }}>Subiendo...</div>
                )}
                {item.status === 'uploaded' && (
                  <div style={{ fontSize: '0.5625rem', color: '#4ECDC4', marginTop: 1 }}>✓ Subido</div>
                )}
                {item.status === 'error' && (
                  <div style={{ fontSize: '0.5625rem', color: '#D4256A', marginTop: 1 }}>{item.errorMsg}</div>
                )}
              </div>

              {/* Remove */}
              {item.file && item.status === 'waiting' && (
                <button
                  onClick={() => removeFile(idx)}
                  style={{ background: 'none', border: 'none', color: 'rgba(212,37,106,0.4)', cursor: 'pointer', fontSize: '0.75rem', padding: '2px 4px', flexShrink: 0 }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = '#D4256A' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = 'rgba(212,37,106,0.4)' }}
                >
                  ✕
                </button>
              )}
              {(item.status === 'uploaded' || item.status === 'uploading') && (
                <div style={{ width: 20, height: 20, borderRadius: '50%', background: item.status === 'uploaded' ? 'rgba(78,205,196,0.15)' : 'rgba(245,165,42,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {item.status === 'uploaded'
                    ? <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#4ECDC4" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                    : <div style={{ width: 10, height: 10, border: '1.5px solid rgba(245,165,42,0.3)', borderTopColor: ACCENT, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                  }
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Action buttons */}
      <div style={{ display: 'flex', gap: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
        <button
          onClick={uploadAll}
          disabled={uploading || withFileCount === 0}
          style={{
            flex: 1, padding: '0.625rem 1rem',
            background: uploading || withFileCount === 0 ? 'rgba(245,165,42,0.05)' : 'rgba(245,165,42,0.12)',
            border: `1px solid ${uploading || withFileCount === 0 ? 'rgba(245,165,42,0.15)' : 'rgba(245,165,42,0.4)'}`,
            borderRadius: 6,
            color: uploading || withFileCount === 0 ? 'rgba(245,165,42,0.3)' : ACCENT,
            fontSize: '0.8125rem', fontWeight: 700, cursor: uploading || withFileCount === 0 ? 'not-allowed' : 'pointer',
            fontFamily: 'IBM Plex Sans, sans-serif', letterSpacing: '0.04em',
          }}
        >
          {uploading ? '↑ Subiendo...' : `↑ Subir ${withFileCount > 0 ? withFileCount : ''} imagen${withFileCount !== 1 ? 'es' : ''}`}
        </button>

        <button
          onClick={approveAll}
          disabled={approving || uploadedCount === 0}
          style={{
            flex: 1, padding: '0.625rem 1rem',
            background: approving || uploadedCount === 0 ? 'rgba(78,205,196,0.04)' : 'rgba(78,205,196,0.12)',
            border: `1px solid ${approving || uploadedCount === 0 ? 'rgba(78,205,196,0.12)' : 'rgba(78,205,196,0.4)'}`,
            borderRadius: 6,
            color: approving || uploadedCount === 0 ? 'rgba(78,205,196,0.3)' : '#4ECDC4',
            fontSize: '0.8125rem', fontWeight: 700, cursor: approving || uploadedCount === 0 ? 'not-allowed' : 'pointer',
            fontFamily: 'IBM Plex Sans, sans-serif', letterSpacing: '0.04em',
          }}
        >
          {approving ? '✓ Aprobando...' : `✓ Mi aprobación (${uploadedCount > 0 ? uploadedCount : '—'})`}
        </button>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
