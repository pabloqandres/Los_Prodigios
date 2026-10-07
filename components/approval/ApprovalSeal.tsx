'use client'

import { useState } from 'react'
import { REVIEWER_COLORS } from '@/lib/approval-config'

interface Props {
  name: string
  status: 'approved' | 'rejected' | 'pending'
  note?: string | null
  canVote: boolean
  voting: boolean
  onApprove: () => void
  onReject: (note: string) => void
}

export default function ApprovalSeal({ name, status, note, canVote, voting, onApprove, onReject }: Props) {
  const color    = REVIEWER_COLORS[name] ?? '#F0EBE1'
  const initial  = name.charAt(0).toUpperCase()
  const [showNote, setShowNote] = useState(false)
  const [noteText, setNoteText] = useState('')

  if (status === 'approved') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
        <div style={{
          width: 52, height: 52, borderRadius: '50%',
          background: `radial-gradient(circle at 35% 35%, ${color}, ${color}cc)`,
          border: `3px solid ${color}`,
          transform: 'rotate(-9deg)',
          boxShadow: `0 0 18px ${color}55, 0 2px 8px rgba(0,0,0,0.5)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexDirection: 'column', gap: 0,
          position: 'relative',
        }}>
          {/* Inner ring */}
          <div style={{
            position: 'absolute', inset: 4, borderRadius: '50%',
            border: `1px solid rgba(8,6,15,0.25)`,
          }} />
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#08060F" strokeWidth="3" strokeLinecap="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <span style={{
          fontSize: '0.5rem', letterSpacing: '0.12em', textTransform: 'uppercase',
          color, fontWeight: 700, fontFamily: 'IBM Plex Sans, sans-serif',
        }}>{name}</span>
      </div>
    )
  }

  if (status === 'rejected') {
    return (
      <div
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, cursor: note ? 'help' : 'default' }}
        title={note ?? undefined}
      >
        <div style={{
          width: 52, height: 52, borderRadius: '50%',
          background: 'rgba(212,37,106,0.12)',
          border: '3px solid rgba(212,37,106,0.5)',
          transform: 'rotate(7deg)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexDirection: 'column',
          position: 'relative',
        }}>
          <div style={{
            position: 'absolute', inset: 4, borderRadius: '50%',
            border: '1px solid rgba(212,37,106,0.2)',
          }} />
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D4256A" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </div>
        <span style={{
          fontSize: '0.5rem', letterSpacing: '0.12em', textTransform: 'uppercase',
          color: 'rgba(212,37,106,0.7)', fontWeight: 700, fontFamily: 'IBM Plex Sans, sans-serif',
        }}>{name}</span>
      </div>
    )
  }

  // Pending
  if (canVote) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
        <div style={{
          width: 52, height: 52, borderRadius: '50%',
          border: `2px dashed ${color}44`,
          background: `${color}08`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexDirection: 'column',
        }}>
          <span style={{ fontSize: '1rem', color: `${color}66`, fontWeight: 800, fontFamily: 'Bebas Neue, Impact, sans-serif', letterSpacing: '0.05em' }}>
            {initial}
          </span>
        </div>
        <span style={{
          fontSize: '0.5rem', letterSpacing: '0.12em', textTransform: 'uppercase',
          color: `${color}55`, fontWeight: 700, fontFamily: 'IBM Plex Sans, sans-serif',
        }}>{name}</span>

        {showNote ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 3, width: 120 }}>
            <textarea
              value={noteText}
              onChange={e => setNoteText(e.target.value)}
              placeholder="Nota de rechazo..."
              rows={2}
              autoFocus
              style={{
                width: '100%', boxSizing: 'border-box',
                background: '#06040F', border: '1px solid rgba(212,37,106,0.3)',
                borderRadius: 3, color: '#F0EBE1',
                fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '0.65rem',
                padding: '4px 6px', resize: 'none', outline: 'none',
              }}
            />
            <div style={{ display: 'flex', gap: 3 }}>
              <button
                onClick={() => { onReject(noteText); setShowNote(false); setNoteText('') }}
                disabled={voting || !noteText.trim()}
                style={{ flex: 1, padding: '3px', fontSize: '0.6rem', fontWeight: 700, background: 'rgba(212,37,106,0.15)', border: '1px solid rgba(212,37,106,0.4)', borderRadius: 2, color: '#D4256A', cursor: 'pointer', fontFamily: 'IBM Plex Sans, sans-serif' }}
              >
                Confirmar
              </button>
              <button
                onClick={() => { setShowNote(false); setNoteText('') }}
                style={{ padding: '3px 6px', fontSize: '0.6rem', background: 'transparent', border: '1px solid rgba(240,235,225,0.1)', borderRadius: 2, color: 'rgba(240,235,225,0.3)', cursor: 'pointer', fontFamily: 'IBM Plex Sans, sans-serif' }}
              >
                ×
              </button>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: 3 }}>
            <button
              onClick={onApprove}
              disabled={voting}
              style={{
                padding: '3px 8px', fontSize: '0.6rem', fontWeight: 700,
                background: `${color}18`, border: `1px solid ${color}44`,
                borderRadius: 3, color, cursor: voting ? 'not-allowed' : 'pointer',
                fontFamily: 'IBM Plex Sans, sans-serif', letterSpacing: '0.02em',
              }}
            >
              ✓
            </button>
            <button
              onClick={() => setShowNote(true)}
              disabled={voting}
              style={{
                padding: '3px 8px', fontSize: '0.6rem', fontWeight: 700,
                background: 'rgba(212,37,106,0.08)', border: '1px solid rgba(212,37,106,0.25)',
                borderRadius: 3, color: '#D4256A', cursor: voting ? 'not-allowed' : 'pointer',
                fontFamily: 'IBM Plex Sans, sans-serif',
              }}
            >
              ✕
            </button>
          </div>
        )}
      </div>
    )
  }

  // Pending, no vote rights
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
      <div style={{
        width: 52, height: 52, borderRadius: '50%',
        border: `2px dashed ${color}1a`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <span style={{ fontSize: '1rem', color: `${color}22`, fontWeight: 800, fontFamily: 'Bebas Neue, Impact, sans-serif' }}>
          {initial}
        </span>
      </div>
      <span style={{
        fontSize: '0.5rem', letterSpacing: '0.12em', textTransform: 'uppercase',
        color: `${color}33`, fontWeight: 700, fontFamily: 'IBM Plex Sans, sans-serif',
      }}>{name}</span>
    </div>
  )
}
