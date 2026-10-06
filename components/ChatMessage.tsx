'use client'

import { useState } from 'react'

interface ChatMessageProps {
  role: 'user' | 'assistant'
  content: string
  timestamp?: Date
}

function renderContent(text: string): React.ReactNode[] {
  const lines = text.split('\n')
  const result: React.ReactNode[] = []

  lines.forEach((line, lineIndex) => {
    if (line === '') {
      result.push(<br key={`br-${lineIndex}`} />)
      return
    }

    const parts = line.split(/(\*\*[^*]+\*\*)/)
    const rendered = parts.map((part, partIndex) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={`strong-${lineIndex}-${partIndex}`} style={{ fontWeight: 600, color: 'inherit' }}>
            {part.slice(2, -2)}
          </strong>
        )
      }
      return part
    })

    result.push(
      <span key={`line-${lineIndex}`}>
        {rendered}
        {lineIndex < lines.length - 1 && '\n'}
      </span>
    )
  })

  return result
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
}

export function ChatMessage({ role, content, timestamp }: ChatMessageProps) {
  const isUser = role === 'user'
  const [copied, setCopied] = useState(false)
  const [hovered, setHovered] = useState(false)

  function handleCopy() {
    navigator.clipboard.writeText(content).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: isUser ? 'row-reverse' : 'row',
        alignItems: 'flex-start',
        gap: '0.625rem',
        maxWidth: '100%',
      }}
    >
      {/* Avatar */}
      <div
        style={{
          width: '28px',
          height: '28px',
          borderRadius: '50%',
          background: isUser ? 'rgba(245,165,42,0.2)' : 'rgba(78,205,196,0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.625rem',
          fontWeight: 600,
          color: isUser ? '#F5A52A' : '#4ECDC4',
          flexShrink: 0,
          marginTop: '2px',
          letterSpacing: '0.05em',
          fontFamily: 'IBM Plex Sans, sans-serif',
        }}
      >
        {isUser ? 'TU' : 'AI'}
      </div>

      {/* Bubble + copy */}
      <div
        style={{
          maxWidth: '80%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: isUser ? 'flex-end' : 'flex-start',
          gap: '0.25rem',
        }}
      >
        <div
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{ position: 'relative' }}
        >
          <div
            style={{
              background: isUser ? 'rgba(245,165,42,0.12)' : 'rgba(255,255,255,0.04)',
              border: isUser ? '1px solid rgba(245,165,42,0.2)' : '1px solid rgba(255,255,255,0.06)',
              borderRadius: '2px',
              padding: '0.75rem 1rem',
              fontSize: '0.9rem',
              lineHeight: 1.65,
              color: isUser ? '#F0EBE1' : 'rgba(240,235,225,0.88)',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
            }}
          >
            {renderContent(content)}
          </div>

          {/* Copy button — appears on hover */}
          {(hovered || copied) && content && (
            <button
              onClick={handleCopy}
              title="Copiar mensaje"
              style={{
                position: 'absolute',
                top: '6px',
                right: isUser ? 'auto' : '6px',
                left: isUser ? '6px' : 'auto',
                background: copied ? 'rgba(78,205,196,0.15)' : 'rgba(8,6,15,0.85)',
                border: `1px solid ${copied ? 'rgba(78,205,196,0.4)' : 'rgba(240,235,225,0.12)'}`,
                borderRadius: '3px',
                color: copied ? '#4ECDC4' : 'rgba(240,235,225,0.5)',
                cursor: 'pointer',
                padding: '3px 7px',
                fontSize: '0.6rem',
                letterSpacing: '0.08em',
                fontFamily: 'IBM Plex Sans, sans-serif',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                transition: 'all 0.15s',
                backdropFilter: 'blur(4px)',
              }}
            >
              {copied ? (
                <>
                  <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
                    <polyline points="1,5 4,8 9,2" stroke="#4ECDC4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Copiado
                </>
              ) : (
                <>
                  <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
                    <rect x="3" y="1" width="6" height="7" rx="1" stroke="currentColor" strokeWidth="1.2"/>
                    <path d="M1 3h2M1 9h6V3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                  </svg>
                  Copiar
                </>
              )}
            </button>
          )}
        </div>

        {timestamp && (
          <div style={{ fontSize: '0.625rem', color: 'rgba(240,235,225,0.2)', letterSpacing: '0.04em' }}>
            {formatTime(timestamp)}
          </div>
        )}
      </div>
    </div>
  )
}
