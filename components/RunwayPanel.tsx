'use client'

import { useState, useRef } from 'react'

type TaskStatus = 'idle' | 'generating' | 'polling' | 'done' | 'error'

const RATIOS = [
  { value: '1280:720', label: '16:9 — Landscape (YouTube, trailer)' },
  { value: '720:1280', label: '9:16 — Vertical (Reels, TikTok)' },
  { value: '1104:832', label: '4:3 — Cuadrado extendido' },
]

const DURATIONS = [
  { value: 5,  label: '5 seg' },
  { value: 10, label: '10 seg' },
]

interface Props {
  initialPrompt?: string
}

export default function RunwayPanel({ initialPrompt = '' }: Props) {
  const [prompt, setPrompt]       = useState(initialPrompt)
  const [ratio, setRatio]         = useState('1280:720')
  const [duration, setDuration]   = useState(5)
  const [status, setStatus]       = useState<TaskStatus>('idle')
  const [progress, setProgress]   = useState<number | null>(null)
  const [videoUrl, setVideoUrl]   = useState<string | null>(null)
  const [error, setError]         = useState<string | null>(null)
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)

  function stopPolling() {
    if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null }
  }

  async function pollStatus(taskId: string) {
    setStatus('polling')
    pollRef.current = setInterval(async () => {
      try {
        const res = await fetch(`/api/runway/status?taskId=${taskId}`)
        const data = await res.json()

        if (data.progress != null) setProgress(Math.round(data.progress * 100))

        if (data.status === 'SUCCEEDED') {
          stopPolling()
          setVideoUrl(data.output?.[0] ?? null)
          setStatus('done')
        } else if (data.status === 'FAILED') {
          stopPolling()
          setError(data.error ?? 'La generación falló en Runway.')
          setStatus('error')
        }
      } catch {
        stopPolling()
        setError('Error consultando el estado.')
        setStatus('error')
      }
    }, 4000)
  }

  async function handleGenerate() {
    if (!prompt.trim() || status === 'generating' || status === 'polling') return
    setError(null)
    setVideoUrl(null)
    setProgress(null)
    setStatus('generating')

    try {
      const res = await fetch('/api/runway/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: prompt.trim(), ratio, duration }),
      })
      const data = await res.json()

      if (!res.ok || !data.taskId) {
        setError(data.error ?? 'No se pudo iniciar la generación.')
        setStatus('error')
        return
      }

      pollStatus(data.taskId)
    } catch {
      setError('Error de conexión con la API.')
      setStatus('error')
    }
  }

  const busy = status === 'generating' || status === 'polling'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: busy ? '#4ECDC4' : '#F5A52A', animation: busy ? 'rw-pulse 1s ease-in-out infinite' : 'none' }} />
        <span style={{ fontFamily: 'Bebas Neue, Impact, sans-serif', fontSize: '1rem', letterSpacing: '0.08em', color: '#F0EBE1' }}>
          RUNWAY GEN-3
        </span>
        <span style={{ fontSize: '0.625rem', color: 'rgba(240,235,225,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase', marginLeft: 'auto' }}>
          Text → Video
        </span>
      </div>
      <style>{`@keyframes rw-pulse { 0%,100%{opacity:1} 50%{opacity:0.35} }`}</style>

      {/* Prompt */}
      <div>
        <label style={{ display: 'block', fontSize: '0.5625rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(240,235,225,0.3)', marginBottom: '4px' }}>
          Prompt de video
        </label>
        <textarea
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          disabled={busy}
          rows={5}
          placeholder="Describe la escena en inglés para mejores resultados. Máx. 1.000 caracteres."
          style={{
            width: '100%', boxSizing: 'border-box',
            background: '#0D0920', border: '1px solid rgba(245,165,42,0.12)',
            borderRadius: '3px', color: '#F0EBE1',
            fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '0.8125rem',
            padding: '8px 10px', resize: 'vertical', outline: 'none', lineHeight: 1.6,
            opacity: busy ? 0.6 : 1,
          }}
          onFocus={e => { e.currentTarget.style.borderColor = 'rgba(245,165,42,0.3)' }}
          onBlur={e => { e.currentTarget.style.borderColor = 'rgba(245,165,42,0.12)' }}
        />
        <div style={{ textAlign: 'right', fontSize: '0.625rem', color: prompt.length > 950 ? '#D4256A' : 'rgba(240,235,225,0.2)', marginTop: '2px' }}>
          {prompt.length}/1000
        </div>
      </div>

      {/* Settings row */}
      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', fontSize: '0.5625rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(240,235,225,0.3)', marginBottom: '4px' }}>
            Formato
          </label>
          <select
            value={ratio}
            onChange={e => setRatio(e.target.value)}
            disabled={busy}
            style={{ width: '100%', background: '#0D0920', border: '1px solid rgba(245,165,42,0.12)', borderRadius: '3px', color: '#F0EBE1', fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '0.75rem', padding: '6px 8px', outline: 'none', cursor: 'pointer' }}
          >
            {RATIOS.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
          </select>
        </div>
        <div style={{ width: '90px' }}>
          <label style={{ display: 'block', fontSize: '0.5625rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(240,235,225,0.3)', marginBottom: '4px' }}>
            Duración
          </label>
          <select
            value={duration}
            onChange={e => setDuration(Number(e.target.value))}
            disabled={busy}
            style={{ width: '100%', background: '#0D0920', border: '1px solid rgba(245,165,42,0.12)', borderRadius: '3px', color: '#F0EBE1', fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '0.75rem', padding: '6px 8px', outline: 'none', cursor: 'pointer' }}
          >
            {DURATIONS.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
          </select>
        </div>
      </div>

      {/* Generate button */}
      <button
        onClick={handleGenerate}
        disabled={busy || !prompt.trim()}
        style={{
          padding: '0.625rem 1.25rem',
          background: busy ? 'rgba(78,205,196,0.12)' : prompt.trim() ? '#F5A52A' : 'rgba(245,165,42,0.1)',
          border: busy ? '1px solid rgba(78,205,196,0.3)' : 'none',
          borderRadius: '3px',
          color: busy ? '#4ECDC4' : prompt.trim() ? '#08060F' : 'rgba(245,165,42,0.3)',
          fontSize: '0.875rem', fontWeight: 700,
          fontFamily: 'IBM Plex Sans, sans-serif',
          cursor: busy || !prompt.trim() ? 'not-allowed' : 'pointer',
          letterSpacing: '0.04em',
          transition: 'all 0.15s ease',
        }}
      >
        {status === 'generating' ? '⏳ Iniciando...'
         : status === 'polling'  ? `🎬 Generando${progress != null ? ` ${progress}%` : '...'}`
         : '▶ Generar en Runway'}
      </button>

      {/* Progress bar */}
      {busy && (
        <div style={{ height: '3px', background: 'rgba(78,205,196,0.12)', borderRadius: '2px', overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            width: progress != null ? `${progress}%` : '100%',
            background: 'linear-gradient(90deg, #4ECDC4, #9B6FD4)',
            borderRadius: '2px',
            transition: progress != null ? 'width 0.4s ease' : 'none',
            animation: progress == null ? 'rw-indeterminate 1.4s ease-in-out infinite' : 'none',
          }} />
          <style>{`@keyframes rw-indeterminate { 0%{transform:translateX(-100%)} 100%{transform:translateX(400%)} }`}</style>
        </div>
      )}

      {/* Error */}
      {status === 'error' && error && (
        <div style={{ padding: '0.625rem 0.875rem', background: 'rgba(212,37,106,0.08)', border: '1px solid rgba(212,37,106,0.2)', borderRadius: '3px', fontSize: '0.8125rem', color: '#D4256A', lineHeight: 1.5 }}>
          {error}
        </div>
      )}

      {/* Result */}
      {status === 'done' && videoUrl && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
          <video
            src={videoUrl}
            controls
            autoPlay
            loop
            style={{ width: '100%', borderRadius: '4px', border: '1px solid rgba(78,205,196,0.2)', background: '#000' }}
          />
          <a
            href={videoUrl}
            download
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'block', textAlign: 'center',
              padding: '0.5rem', background: 'rgba(78,205,196,0.08)',
              border: '1px solid rgba(78,205,196,0.2)', borderRadius: '3px',
              color: '#4ECDC4', fontSize: '0.8125rem',
              textDecoration: 'none', letterSpacing: '0.04em',
            }}
          >
            ↓ Descargar video
          </a>
        </div>
      )}
    </div>
  )
}
