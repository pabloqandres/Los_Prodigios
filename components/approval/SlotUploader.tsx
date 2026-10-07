'use client'

import { useState, useRef } from 'react'
import type { AssetSlotWithApprovals } from '@/lib/supabase'

interface Props {
  slot: AssetSlotWithApprovals
  onUploaded: (updated: AssetSlotWithApprovals) => void
}

export default function SlotUploader({ slot, onUploaded }: Props) {
  const [dragging, setDragging]   = useState(false)
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview]     = useState<string | null>(null)
  const [error, setError]         = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFile(file: File) {
    if (!file.type.startsWith('image/')) {
      setError('Solo se aceptan imágenes')
      return
    }
    setError(null)
    setUploading(true)

    // Resize to max 2048px before upload (keep quality for canon)
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = async () => {
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

      const b64 = canvas.toDataURL('image/jpeg', 0.92).split(',')[1]
      setPreview(`data:image/jpeg;base64,${b64}`)

      try {
        const res = await fetch('/api/assets/upload-to-slot', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            slot_id: slot.id,
            b64,
            filename: `${slot.entity_name}_${slot.view_type}_${slot.outfit ?? ''}_${slot.id}_DRAFT_${Date.now()}.jpg`,
            mimeType: 'image/jpeg',
          }),
        })
        const data = await res.json()
        if (!res.ok) { setError(data.error ?? 'Error subiendo'); return }
        onUploaded(data.slot)
      } catch {
        setError('Error de conexión')
      } finally {
        setUploading(false)
      }
    }
    img.onerror = () => { URL.revokeObjectURL(url); setError('Error leyendo imagen'); setUploading(false) }
    img.src = url
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <input
        ref={inputRef} type="file" accept="image/*"
        style={{ display: 'none' }}
        onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
      />

      <div
        onClick={() => !uploading && inputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        style={{
          border: `2px dashed ${dragging ? '#F5A52A' : 'rgba(245,165,42,0.2)'}`,
          borderRadius: '6px',
          padding: preview ? '0' : '2rem',
          textAlign: 'center',
          cursor: uploading ? 'not-allowed' : 'pointer',
          background: dragging ? 'rgba(245,165,42,0.06)' : 'rgba(255,255,255,0.02)',
          transition: 'all 0.15s',
          overflow: 'hidden',
          minHeight: preview ? 'auto' : '100px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        {preview ? (
          <img src={preview} alt="preview" style={{ width: '100%', display: 'block', borderRadius: '4px' }} />
        ) : uploading ? (
          <div style={{ fontSize: '0.8125rem', color: '#F5A52A' }}>Subiendo...</div>
        ) : (
          <div>
            <div style={{ fontSize: '1.5rem', marginBottom: '4px' }}>📁</div>
            <div style={{ fontSize: '0.75rem', color: 'rgba(240,235,225,0.4)' }}>
              Arrastra una imagen o haz clic
            </div>
          </div>
        )}
      </div>

      {error && (
        <div style={{ fontSize: '0.75rem', color: '#D4256A' }}>{error}</div>
      )}
    </div>
  )
}
