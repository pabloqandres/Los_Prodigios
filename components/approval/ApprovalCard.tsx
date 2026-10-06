'use client'

import { useState } from 'react'
import ApprovalBadge from './ApprovalBadge'
import SlotUploader from './SlotUploader'
import type { AssetSlotWithApprovals } from '@/lib/supabase'
import { storageUrl } from '@/lib/supabase'
import { REVIEWERS } from '@/lib/approval-config'

interface Props {
  slot: AssetSlotWithApprovals
  userEmail: string
  onUpdated: (updated: AssetSlotWithApprovals) => void
  onClick?: () => void
}

const STATUS_COLORS: Record<string, string> = {
  pending:   'rgba(240,235,225,0.25)',
  in_review: '#F5A52A',
  approved:  '#4ECDC4',
  rejected:  '#D4256A',
}

const STATUS_LABELS: Record<string, string> = {
  pending:   'Pendiente',
  in_review: 'En revisión',
  approved:  'Aprobado',
  rejected:  'Rechazado',
}

export default function ApprovalCard({ slot, userEmail, onUpdated, onClick }: Props) {
  const [voting, setVoting]         = useState(false)
  const [removing, setRemoving]     = useState(false)
  const [note, setNote]             = useState('')
  const [showNote, setShowNote]     = useState(false)
  const [voteError, setVoteError]   = useState<string | null>(null)

  const statusColor = STATUS_COLORS[slot.status] ?? 'rgba(240,235,225,0.25)'

  const myApproval  = slot.approvals?.find(a => a.reviewer_email === userEmail)
  const isReviewer  = !!REVIEWERS[userEmail]

  const reviewerNames = Object.values(REVIEWERS)
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

  async function vote(approved: boolean) {
    if (voting) return
    if (!approved && !note.trim()) { setShowNote(true); return }
    setVoting(true)
    setVoteError(null)
    try {
      const res = await fetch(`/api/assets/slots/${slot.id}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approved, note: note.trim() || null }),
      })
      const data = await res.json()
      if (!res.ok) { setVoteError(data.error ?? 'Error al votar'); return }
      if (data.slot) { onUpdated(data.slot); setNote(''); setShowNote(false) }
    } catch {
      setVoteError('Error de conexión')
    } finally {
      setVoting(false)
    }
  }

  async function removeImage(e: React.MouseEvent) {
    e.stopPropagation()
    if (removing) return
    if (!confirm('¿Eliminar la imagen y resetear este slot a Pendiente? Se borrarán los votos existentes.')) return
    setRemoving(true)
    try {
      const res = await fetch(`/api/assets/slots/${slot.id}/remove-image`, { method: 'POST' })
      const data = await res.json()
      if (data.slot) onUpdated(data.slot)
    } catch {
      // Ignorar error silencioso
    } finally {
      setRemoving(false)
    }
  }

  // Pending images live in Supabase Storage; approved images are Google Drive file IDs
  const thumbUrl = slot.pending_drive_file_id
    ? storageUrl(slot.pending_drive_file_id)
    : slot.approved_drive_file_id
    ? `https://drive.google.com/thumbnail?id=${slot.approved_drive_file_id}&sz=w400`
    : null

  // Mostrar botones de votación si hay imagen y el slot no está aprobado/rechazado definitivamente
  const canVote = !!(
    slot.pending_drive_file_id &&
    slot.status !== 'approved' &&
    slot.status !== 'rejected' &&
    isReviewer &&
    !myApproval
  )

  // Mostrar uploader solo si NO hay imagen todavía
  const showUploader = slot.status === 'pending' && !slot.pending_drive_file_id

  // Mostrar botón eliminar si hay imagen y no está aprobado
  const canRemove = !!(slot.pending_drive_file_id && slot.status !== 'approved')

  return (
    <div
      onClick={onClick}
      style={{
        background: '#0D0920', border: `1px solid ${statusColor}33`,
        borderRadius: '6px', overflow: 'hidden',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'border-color 0.15s',
        display: 'flex', flexDirection: 'column',
      }}
      onMouseEnter={e => onClick && (e.currentTarget.style.borderColor = `${statusColor}66`)}
      onMouseLeave={e => onClick && (e.currentTarget.style.borderColor = `${statusColor}33`)}
    >
      {/* Image area */}
      <div style={{ height: '160px', background: '#080614', position: 'relative', overflow: 'hidden', flexShrink: 0 }}>
        {thumbUrl ? (
          <img src={thumbUrl} alt={slot.version_label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '4px' }}>
            <div style={{ fontSize: '2rem', opacity: 0.2 }}>🖼</div>
            <div style={{ fontSize: '0.625rem', color: 'rgba(240,235,225,0.2)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Sin imagen</div>
          </div>
        )}

        {/* Status pill */}
        <div style={{
          position: 'absolute', top: '8px', right: '8px',
          padding: '2px 7px', borderRadius: '20px',
          background: '#08060F', border: `1px solid ${statusColor}`,
          fontSize: '0.5625rem', color: statusColor, fontWeight: 600,
          letterSpacing: '0.08em', textTransform: 'uppercase',
        }}>
          {STATUS_LABELS[slot.status]}
        </div>

        {/* Delete button */}
        {canRemove && (
          <button
            onClick={removeImage}
            disabled={removing}
            title="Eliminar imagen y resetear slot"
            style={{
              position: 'absolute', top: '8px', left: '8px',
              width: '24px', height: '24px', borderRadius: '4px',
              background: 'rgba(8,6,15,0.85)', border: '1px solid rgba(212,37,106,0.4)',
              color: '#D4256A', fontSize: '0.75rem', cursor: removing ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              lineHeight: 1,
            }}
          >
            {removing ? '…' : '✕'}
          </button>
        )}
      </div>

      {/* Info */}
      <div style={{ padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
        <div>
          <div style={{ fontSize: '0.6875rem', color: '#F5A52A', fontWeight: 600, letterSpacing: '0.04em' }}>
            {slot.entity_label}
          </div>
          <div style={{ fontSize: '0.8125rem', color: 'rgba(240,235,225,0.85)', lineHeight: 1.3 }}>
            {slot.version_label}
          </div>
        </div>

        {/* Reviewer badges */}
        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
          {reviewerNames.map(name => (
            <ApprovalBadge
              key={name}
              name={name}
              status={getBadgeStatus(name)}
              note={getNote(name)}
            />
          ))}
        </div>

        {/* Uploader — solo si no hay imagen */}
        {showUploader && (
          <div onClick={e => e.stopPropagation()}>
            <SlotUploader slot={slot} onUploaded={onUpdated} />
          </div>
        )}

        {/* Vote buttons */}
        {canVote && (
          <div onClick={e => e.stopPropagation()} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {showNote && (
              <textarea
                value={note}
                onChange={e => setNote(e.target.value)}
                placeholder="Nota de rechazo (obligatoria)"
                rows={2}
                style={{
                  width: '100%', boxSizing: 'border-box',
                  background: '#06040F', border: '1px solid rgba(212,37,106,0.3)',
                  borderRadius: '3px', color: '#F0EBE1',
                  fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '0.75rem',
                  padding: '6px 8px', resize: 'vertical', outline: 'none',
                }}
              />
            )}
            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                onClick={() => vote(true)}
                disabled={voting}
                style={{
                  flex: 1, padding: '5px', background: 'rgba(78,205,196,0.1)',
                  border: '1px solid rgba(78,205,196,0.3)', borderRadius: '3px',
                  color: '#4ECDC4', fontSize: '0.75rem', fontWeight: 600,
                  cursor: voting ? 'not-allowed' : 'pointer', fontFamily: 'IBM Plex Sans, sans-serif',
                }}
              >
                {voting ? '…' : '✓ Aprobar'}
              </button>
              <button
                onClick={() => { setShowNote(true); if (showNote && note.trim()) vote(false) }}
                disabled={voting}
                style={{
                  flex: 1, padding: '5px', background: 'rgba(212,37,106,0.08)',
                  border: '1px solid rgba(212,37,106,0.25)', borderRadius: '3px',
                  color: '#D4256A', fontSize: '0.75rem', fontWeight: 600,
                  cursor: voting ? 'not-allowed' : 'pointer', fontFamily: 'IBM Plex Sans, sans-serif',
                }}
              >
                ✕ Rechazar
              </button>
            </div>
            {voteError && (
              <div style={{ fontSize: '0.6875rem', color: '#D4256A' }}>{voteError}</div>
            )}
          </div>
        )}

        {/* Mi voto ya emitido */}
        {myApproval && slot.status !== 'approved' && (
          <div style={{ fontSize: '0.6875rem', color: myApproval.approved ? '#4ECDC4' : '#D4256A', opacity: 0.7 }}>
            {myApproval.approved ? '✓ Tu aprobación registrada' : '✕ Rechazaste este asset'}
          </div>
        )}

        {/* Link a Drive si aprobado */}
        {slot.status === 'approved' && slot.approved_drive_file_id && (
          <a
            href={`https://drive.google.com/file/d/${slot.approved_drive_file_id}/view`}
            target="_blank" rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            style={{ fontSize: '0.6875rem', color: '#4ECDC4', textDecoration: 'none', opacity: 0.7 }}
          >
            Ver en Drive →
          </a>
        )}
      </div>
    </div>
  )
}
