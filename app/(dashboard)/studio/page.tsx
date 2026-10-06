'use client'

import { useState, useRef, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { AnimatePresence } from 'framer-motion'
import { ChatMessage } from '@/components/ChatMessage'
import { ContextSelector } from '@/components/ContextSelector'
import { CONTEXT_LABELS } from '@/lib/contexts'
import CanonVerificationOverlay from '@/components/CanonVerificationOverlay'
import PromptTargetModal, { type PromptTarget } from '@/components/PromptTargetModal'

function IconAttach() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" />
    </svg>
  )
}

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

function IconSend() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  )
}

function IconStop() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <rect x="4" y="4" width="16" height="16" rx="2" />
    </svg>
  )
}

const CONTEXT_DESCRIPTIONS: Record<string, string> = {
  general: 'Asistencia general para la producción de Los Prodigios.',
  personajes: 'Desarrollo de personajes, diseño, psicología y arcos narrativos.',
  arte: 'Dirección de arte, paleta de colores, prompts y consistencia visual.',
  marketing: 'Estrategia de marketing, pitch y posicionamiento de la serie.',
  merchandise: 'Desarrollo de productos derivados y oportunidades de licensing.',
  guion: 'Escritura de guiones, escaletas, diálogos y estructura narrativa.',
  continuidad: 'Supervisión de continuidad visual y narrativa entre episodios.',
  redes: 'Estrategia y contenido para redes sociales.',
  publicidad: 'Planificación y creatividad para campañas publicitarias pagadas.',
  trailers: 'Desarrollo de trailers, teasers y promos de episodios.',
  licensing: 'Distribución internacional y negociación de licencias.',
}

const WELCOME_SUGGESTIONS: Record<string, string[]> = {
  general: [
    '¿Qué aspectos de la serie necesitan más desarrollo?',
    'Dame un resumen del estado actual de la producción',
    '¿Cómo puedo estructurar la biblia de la serie?',
  ],
  personajes: [
    'Describe el arco de Mateo González a lo largo de las 5 temporadas',
    'Ayúdame a desarrollar un personaje antagonista para la T1',
    'Revisar la consistencia del diseño de un personaje',
  ],
  arte: [
    'Genera un prompt para el concept art de una locación',
    'Define la paleta de color de una nueva escena',
    'Crea una descripción visual detallada para un personaje',
  ],
  guion: [
    'Estructura un episodio de 12 minutos en actos',
    'Ayúdame a escribir la cold open del episodio piloto',
    'Revisar la coherencia narrativa del arco de una temporada',
  ],
}

export default function StudioPage() {
  const { data: session } = useSession()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [selectedContext, setSelectedContext] = useState('general')
  const [abortController, setAbortController] = useState<AbortController | null>(null)
  const [saving, setSaving] = useState(false)
  const [saveModal, setSaveModal] = useState(false)
  const [saveTitle, setSaveTitle] = useState('')
  const [savedOk, setSavedOk] = useState(false)
  const [uploadedDoc, setUploadedDoc] = useState<{ filename: string; text: string } | null>(null)
  const [uploading, setUploading] = useState(false)
  const [savedSessions, setSavedSessions] = useState<{ id: string; title: string; area: string; created_at: string; content: string }[]>([])
  const [viewSession, setViewSession] = useState<{ title: string; content: string; area: string; created_at: string } | null>(null)

  const [showCanonCheck, setShowCanonCheck]         = useState(false)
  const [canonQuery, setCanonQuery]                 = useState('')
  const [pendingMessage, setPendingMessage]         = useState('')
  const [showPromptTarget, setShowPromptTarget]     = useState(false)
  const [promptTarget, setPromptTarget]             = useState<PromptTarget | null>(null)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Apply URL params from marketing page redirect (context + prefill)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const ctx = params.get('context')
    const prefill = params.get('prefill')
    if (ctx && CONTEXT_LABELS[ctx]) setSelectedContext(ctx)
    if (prefill) setInput(prefill)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const form = new FormData()
      form.append('file', file)
      const res = await fetch('/api/parse-doc', { method: 'POST', body: form })
      const data = await res.json()
      if (res.ok) {
        setUploadedDoc({ filename: data.filename, text: data.text })
      }
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  async function handleSave() {
    if (!saveTitle.trim() || saving) return
    setSaving(true)
    try {
      const content = messages
        .map((m) => `**${m.role === 'user' ? 'Tú' : 'Asistente'}:** ${m.content}`)
        .join('\n\n---\n\n')
      const res = await fetch('/api/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: saveTitle.trim(),
          content,
          area: selectedContext,
          context: selectedContext,
        }),
      })
      if (res.ok) {
        setSaveModal(false)
        setSaveTitle('')
        setSavedOk(true)
        setTimeout(() => setSavedOk(false), 3000)
        fetchSavedSessions()
      }
    } finally {
      setSaving(false)
    }
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function fetchSavedSessions() {
    try {
      const res = await fetch('/api/documents')
      if (res.ok) {
        const data = await res.json()
        setSavedSessions(data)
      }
    } catch { /* ignore */ }
  }

  useEffect(() => {
    fetchSavedSessions()
  }, [])

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`
    }
  }, [input])

  // Detect if this is a visual generation request
  function isVisualRequest(content: string): boolean {
    const visual = ['prompt', 'genera', 'video', 'imagen', 'clip', 'trailer', 'teaser', 'promo', 'create', 'generate', 'film', 'shot', 'scene', 'foto', 'photo']
    const lower = content.toLowerCase()
    const isVisualCtx = ['arte', 'trailers', 'publicidad', 'redes'].includes(selectedContext)
    return isVisualCtx || visual.some(w => lower.includes(w))
  }

  // Intercept send: show prompt target modal first for visual requests
  function handleSendIntent(content: string) {
    if (!content.trim() || loading) return
    if (isVisualRequest(content)) {
      setPendingMessage(content)
      setShowPromptTarget(true)
    } else {
      sendMessage(content)
    }
  }

  function handlePromptTargetSelected(target: PromptTarget) {
    setPromptTarget(target)
    setShowPromptTarget(false)
    // Inject target into message and run canon check
    const targetLabel: Record<PromptTarget, string> = {
      chatgpt: 'ChatGPT/Claude (sin límite, detallado)',
      artlist: 'Artlist/Kling (máx. 1.800 chars)',
      runway: 'Runway (máx. 1.000 chars)',
      midjourney: 'Midjourney/Sora (máx. 2.000 chars)',
      sora: 'Midjourney/Sora (máx. 2.000 chars)',
    }
    const enriched = `[Motor de destino: ${targetLabel[target]}]\n\n${pendingMessage}`
    setCanonQuery(pendingMessage)
    setShowCanonCheck(true)
    setPendingMessage(enriched)
  }

  function handleCanonComplete(canonContext: string) {
    setShowCanonCheck(false)
    // Inject canonical context into the message
    const finalMsg = canonContext
      ? `${pendingMessage}\n\n---\n[CONTEXTO CANÓNICO VERIFICADO]\n${canonContext}`
      : pendingMessage
    setPendingMessage('')
    sendMessage(finalMsg)
  }

  async function sendMessage(content: string) {
    if (!content.trim() || loading) return

    const userMessage: Message = {
      role: 'user',
      content: content.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setLoading(true)
    window.dispatchEvent(new Event('tutorial:message_sent'))

    // If a doc is attached, prepend its content to the first user message
    const allMessages = [...messages, userMessage].map((m, i, arr) => {
      if (uploadedDoc && i === arr.length - 1 && m.role === 'user') {
        return {
          role: m.role,
          content: `[DOCUMENTO ADJUNTO: "${uploadedDoc.filename}"]\n\n${uploadedDoc.text}\n\n---\n\n${m.content}`,
        }
      }
      return { role: m.role, content: m.content }
    })
    // Clear uploaded doc after sending
    setUploadedDoc(null)

    const controller = new AbortController()
    setAbortController(controller)

    const assistantMessage: Message = {
      role: 'assistant',
      content: '',
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, assistantMessage])

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: allMessages,
          context: selectedContext,
          userEmail: session?.user?.email,
        }),
        signal: controller.signal,
      })

      if (!response.ok) {
        throw new Error(`Error ${response.status}`)
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (!reader) throw new Error('No response body')

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        setMessages((prev) => {
          const updated = [...prev]
          const last = updated[updated.length - 1]
          if (last && last.role === 'assistant') {
            updated[updated.length - 1] = {
              ...last,
              content: last.content + chunk,
            }
          }
          return updated
        })
      }
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        setMessages((prev) => {
          const updated = [...prev]
          const last = updated[updated.length - 1]
          if (last && last.role === 'assistant' && last.content === '') {
            updated[updated.length - 1] = {
              ...last,
              content: 'Error al conectar con el asistente. Verifica que la API esté configurada.',
            }
          }
          return updated
        })
      }
    } finally {
      setLoading(false)
      setAbortController(null)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendIntent(input)
    }
  }

  function handleStop() {
    abortController?.abort()
  }

  function handleSuggestion(suggestion: string) {
    setInput(suggestion)
    textareaRef.current?.focus()
  }

  const suggestions = WELCOME_SUGGESTIONS[selectedContext] ?? WELCOME_SUGGESTIONS.general

  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        overflow: 'hidden',
      }}
    >
      {/* ── Canon Verification Overlay ──────────────────────────────────── */}
      <AnimatePresence>
        {showCanonCheck && (
          <CanonVerificationOverlay
            query={canonQuery}
            onComplete={handleCanonComplete}
            onSkip={() => { setShowCanonCheck(false); sendMessage(pendingMessage); setPendingMessage('') }}
          />
        )}
      </AnimatePresence>

      {/* ── Prompt Target Modal ─────────────────────────────────────────── */}
      <PromptTargetModal
        open={showPromptTarget}
        onSelect={handlePromptTargetSelected}
        onClose={() => { setShowPromptTarget(false); setPendingMessage('') }}
      />
      {/* Chat panel */}
      <div
        style={{
          flex: '1 1 60%',
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          borderRight: '1px solid rgba(245,165,42,0.07)',
        }}
      >
        {/* Chat header */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid rgba(245,165,42,0.07)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexShrink: 0,
          }}
        >
          <div>
            <div
              style={{
                fontFamily: 'IBM Plex Sans, sans-serif',
                fontSize: '0.5625rem',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: 'rgba(240,235,225,0.28)',
                marginBottom: '0.25rem',
              }}
            >
              Asistente de Producción
            </div>
            <h1
              style={{
                fontFamily: 'Bebas Neue, Impact, sans-serif',
                fontSize: '1.375rem',
                letterSpacing: '0.05em',
                color: '#F0EBE1',
              }}
            >
              Studio AI
            </h1>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.75rem',
              color: 'rgba(240,235,225,0.35)',
            }}
          >
            <div
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: loading ? '#F5A52A' : '#4ECDC4',
                animation: loading ? 'pulse 1s ease-in-out infinite' : 'none',
              }}
            />
            <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }`}</style>
            {loading ? 'Generando...' : 'Listo'}
          </div>
        </div>

        {/* Messages */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
          }}
        >
          {messages.length === 0 && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                gap: '1.5rem',
                textAlign: 'center',
              }}
            >
              <div>
                <div
                  style={{
                    fontFamily: 'Bebas Neue, Impact, sans-serif',
                    fontSize: '2rem',
                    letterSpacing: '0.06em',
                    color: 'rgba(240,235,225,0.15)',
                    marginBottom: '0.5rem',
                  }}
                >
                  LOS PRODIGIOS
                </div>
                <p
                  style={{
                    fontSize: '0.875rem',
                    color: 'rgba(240,235,225,0.28)',
                  }}
                >
                  {CONTEXT_DESCRIPTIONS[selectedContext]}
                </p>
              </div>

              {/* Suggestions */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                  width: '100%',
                  maxWidth: '480px',
                }}
              >
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => handleSuggestion(s)}
                    style={{
                      background: 'rgba(245,165,42,0.05)',
                      border: '1px solid rgba(245,165,42,0.1)',
                      borderRadius: '2px',
                      padding: '0.625rem 0.875rem',
                      color: 'rgba(240,235,225,0.55)',
                      fontSize: '0.8125rem',
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'all 0.12s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(245,165,42,0.2)'
                      e.currentTarget.style.color = 'rgba(240,235,225,0.85)'
                      e.currentTarget.style.background = 'rgba(245,165,42,0.08)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(245,165,42,0.1)'
                      e.currentTarget.style.color = 'rgba(240,235,225,0.55)'
                      e.currentTarget.style.background = 'rgba(245,165,42,0.05)'
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <ChatMessage
              key={i}
              role={msg.role}
              content={msg.content}
              timestamp={msg.timestamp}
            />
          ))}

          {loading && messages[messages.length - 1]?.content === '' && (
            <div style={{ display: 'flex', gap: '0.625rem', alignItems: 'center' }}>
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: 'rgba(78,205,196,0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.625rem',
                  fontWeight: 600,
                  color: '#4ECDC4',
                  flexShrink: 0,
                }}
              >
                AI
              </div>
              <div
                style={{
                  display: 'flex',
                  gap: '4px',
                  padding: '0.75rem 1rem',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '2px',
                }}
              >
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: 'rgba(240,235,225,0.3)',
                      animation: 'bounce 1.2s ease-in-out infinite',
                      animationDelay: `${i * 0.2}s`,
                    }}
                  />
                ))}
                <style>{`@keyframes bounce { 0%, 60%, 100% { transform: translateY(0); } 30% { transform: translateY(-6px); } }`}</style>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div
          style={{
            padding: '1rem 1.5rem 1.25rem',
            borderTop: '1px solid rgba(245,165,42,0.07)',
            flexShrink: 0,
          }}
        >
          {/* Uploaded doc badge */}
          {uploadedDoc && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.625rem' }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '0.375rem',
                background: 'rgba(78,205,196,0.08)', border: '1px solid rgba(78,205,196,0.2)',
                borderRadius: '2px', padding: '0.25rem 0.625rem',
                fontSize: '0.75rem', color: '#4ECDC4',
              }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                </svg>
                {uploadedDoc.filename}
              </div>
              <button onClick={() => setUploadedDoc(null)} style={{ background: 'none', border: 'none', color: 'rgba(240,235,225,0.3)', cursor: 'pointer', fontSize: '0.75rem', padding: 0 }}>✕</button>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept=".docx,.txt,.md"
            onChange={handleFileUpload}
            style={{ display: 'none' }}
          />

          <div
            style={{
              display: 'flex',
              gap: '0.625rem',
              alignItems: 'flex-end',
            }}
          >
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              title="Adjuntar documento (.docx, .txt, .md)"
              style={{
                width: '42px', height: '42px', flexShrink: 0,
                background: uploadedDoc ? 'rgba(78,205,196,0.12)' : 'rgba(245,165,42,0.06)',
                border: `1px solid ${uploadedDoc ? 'rgba(78,205,196,0.25)' : 'rgba(245,165,42,0.1)'}`,
                borderRadius: '2px',
                color: uploadedDoc ? '#4ECDC4' : 'rgba(240,235,225,0.35)',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.12s ease',
              }}
            >
              {uploading
                ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 1s linear infinite' }}><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
                : <IconAttach />
              }
            </button>
            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>

            <textarea
              data-tutorial="studio-input"
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Escribe tu mensaje... (Enter para enviar, Shift+Enter para nueva línea)"
              rows={1}
              style={{
                flex: 1,
                background: '#1A1235',
                border: '1px solid rgba(245,165,42,0.12)',
                borderRadius: '2px',
                color: '#F0EBE1',
                fontFamily: 'IBM Plex Sans, sans-serif',
                fontSize: '0.9rem',
                padding: '0.625rem 0.875rem',
                resize: 'none',
                outline: 'none',
                lineHeight: 1.5,
                transition: 'border-color 0.15s ease',
                maxHeight: '160px',
                minHeight: '42px',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'rgba(245,165,42,0.3)'
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'rgba(245,165,42,0.12)'
              }}
            />
            <button
              onClick={loading ? handleStop : () => handleSendIntent(input)}
              disabled={!loading && !input.trim()}
              style={{
                width: '42px',
                height: '42px',
                background: loading
                  ? 'rgba(212,37,106,0.15)'
                  : input.trim()
                  ? '#F5A52A'
                  : 'rgba(245,165,42,0.1)',
                border: loading
                  ? '1px solid rgba(212,37,106,0.3)'
                  : '1px solid transparent',
                borderRadius: '2px',
                color: loading
                  ? '#D4256A'
                  : input.trim()
                  ? '#08060F'
                  : 'rgba(245,165,42,0.3)',
                cursor: !loading && !input.trim() ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                transition: 'all 0.15s ease',
              }}
            >
              {loading ? <IconStop /> : <IconSend />}
            </button>
          </div>
          <div
            style={{
              marginTop: '0.5rem',
              fontSize: '0.6875rem',
              color: 'rgba(240,235,225,0.18)',
              textAlign: 'right',
            }}
          >
            Shift+Enter para nueva línea
          </div>
        </div>
      </div>

      {/* Context panel */}
      <div
        style={{
          width: '320px',
          flexShrink: 0,
          background: '#0D0920',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Panel header */}
        <div
          style={{
            padding: '1.25rem 1.25rem 1rem',
            borderBottom: '1px solid rgba(245,165,42,0.07)',
          }}
        >
          <div
            style={{
              fontFamily: 'IBM Plex Sans, sans-serif',
              fontSize: '0.5625rem',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: 'rgba(240,235,225,0.28)',
              marginBottom: '0.5rem',
            }}
          >
            Área de trabajo
          </div>
          <ContextSelector
            value={selectedContext}
            onChange={(ctx) => {
              setSelectedContext(ctx)
              setMessages([])
            }}
          />
        </div>

        {/* Context info */}
        <div style={{ padding: '1.25rem', flex: 1, overflowY: 'auto' }}>
          <div
            style={{
              background: 'rgba(245,165,42,0.05)',
              border: '1px solid rgba(245,165,42,0.08)',
              borderRadius: '2px',
              padding: '1rem',
              marginBottom: '1.25rem',
            }}
          >
            <div
              style={{
                fontFamily: 'Bebas Neue, Impact, sans-serif',
                fontSize: '1rem',
                letterSpacing: '0.06em',
                color: '#F5A52A',
                marginBottom: '0.5rem',
              }}
            >
              {CONTEXT_LABELS[selectedContext]}
            </div>
            <p
              style={{
                fontSize: '0.8125rem',
                color: 'rgba(240,235,225,0.5)',
                lineHeight: 1.55,
              }}
            >
              {CONTEXT_DESCRIPTIONS[selectedContext]}
            </p>
          </div>

          {/* Session info */}
          <div
            style={{
              fontFamily: 'IBM Plex Sans, sans-serif',
              fontSize: '0.5625rem',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: 'rgba(240,235,225,0.22)',
              marginBottom: '0.75rem',
            }}
          >
            Sesión actual
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {[
              { label: 'Mensajes', value: messages.length.toString() },
              {
                label: 'Modelo',
                value: 'Claude Sonnet',
              },
              {
                label: 'Usuario',
                value: session?.user?.name?.split(' ')[0] ?? '—',
              },
            ].map((item) => (
              <div
                key={item.label}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.5rem 0',
                  borderBottom: '1px solid rgba(245,165,42,0.05)',
                }}
              >
                <span
                  style={{
                    fontSize: '0.8125rem',
                    color: 'rgba(240,235,225,0.35)',
                  }}
                >
                  {item.label}
                </span>
                <span
                  style={{
                    fontSize: '0.8125rem',
                    color: 'rgba(240,235,225,0.65)',
                    fontWeight: 500,
                  }}
                >
                  {item.value}
                </span>
              </div>
            ))}
          </div>

          {/* Save / Clear session */}
          {messages.length > 0 && (
            <div style={{ marginTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <button
                onClick={() => { setSaveTitle(''); setSaveModal(true) }}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  background: savedOk ? 'rgba(78,205,196,0.12)' : 'rgba(245,165,42,0.08)',
                  border: `1px solid ${savedOk ? 'rgba(78,205,196,0.3)' : 'rgba(245,165,42,0.2)'}`,
                  borderRadius: '2px',
                  color: savedOk ? '#4ECDC4' : '#F5A52A',
                  fontSize: '0.8125rem',
                  cursor: 'pointer',
                  fontFamily: 'IBM Plex Sans, sans-serif',
                  transition: 'all 0.15s ease',
                }}
              >
                {savedOk ? '✓ Guardado' : 'Guardar sesión'}
              </button>
              <button
                onClick={() => setMessages([])}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  background: 'transparent',
                  border: '1px solid rgba(212,37,106,0.15)',
                  borderRadius: '2px',
                  color: 'rgba(212,37,106,0.6)',
                  fontSize: '0.8125rem',
                  cursor: 'pointer',
                  fontFamily: 'IBM Plex Sans, sans-serif',
                }}
              >
                Limpiar conversación
              </button>
            </div>
          )}
        </div>

        {/* Save modal */}
        {saveModal && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(8,6,15,0.85)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 200,
              padding: '1.5rem',
            }}
            onClick={(e) => { if (e.target === e.currentTarget) setSaveModal(false) }}
          >
            <div
              style={{
                background: '#120D28',
                border: '1px solid rgba(245,165,42,0.15)',
                borderRadius: '2px',
                padding: '2rem',
                width: '100%',
                maxWidth: '420px',
              }}
            >
              <div style={{ fontFamily: 'Bebas Neue, Impact, sans-serif', fontSize: '1.375rem', letterSpacing: '0.05em', color: '#F0EBE1', marginBottom: '1.25rem' }}>
                Guardar sesión
              </div>
              <label style={{ display: 'block', fontSize: '0.8125rem', color: 'rgba(240,235,225,0.5)', marginBottom: '0.5rem' }}>
                Título del documento
              </label>
              <input
                type="text"
                value={saveTitle}
                onChange={(e) => setSaveTitle(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleSave() }}
                placeholder="Ej: Brief trailer T1, Post lanzamiento Instagram..."
                autoFocus
                style={{
                  width: '100%',
                  background: '#1A1235',
                  border: '1px solid rgba(245,165,42,0.15)',
                  borderRadius: '2px',
                  color: '#F0EBE1',
                  fontFamily: 'IBM Plex Sans, sans-serif',
                  fontSize: '0.875rem',
                  padding: '0.625rem 0.75rem',
                  outline: 'none',
                  marginBottom: '1.25rem',
                  boxSizing: 'border-box',
                }}
              />
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => setSaveModal(false)}
                  style={{ padding: '0.5rem 1rem', background: 'transparent', border: '1px solid rgba(245,165,42,0.1)', borderRadius: '2px', color: 'rgba(240,235,225,0.45)', fontSize: '0.875rem', cursor: 'pointer', fontFamily: 'IBM Plex Sans, sans-serif' }}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  disabled={!saveTitle.trim() || saving}
                  style={{
                    padding: '0.5rem 1.25rem',
                    background: saveTitle.trim() ? '#F5A52A' : 'rgba(245,165,42,0.15)',
                    border: 'none',
                    borderRadius: '2px',
                    color: saveTitle.trim() ? '#08060F' : 'rgba(245,165,42,0.4)',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    cursor: saveTitle.trim() ? 'pointer' : 'not-allowed',
                    fontFamily: 'IBM Plex Sans, sans-serif',
                  }}
                >
                  {saving ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Saved sessions */}
        {savedSessions.length > 0 && (
          <div style={{ borderTop: '1px solid rgba(245,165,42,0.07)', padding: '1rem 1.25rem', maxHeight: '240px', overflowY: 'auto' }}>
            <div style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '0.5625rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(240,235,225,0.22)', marginBottom: '0.625rem' }}>
              Sesiones guardadas
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
              {savedSessions.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setViewSession(s)}
                  style={{
                    display: 'flex', flexDirection: 'column', gap: '0.125rem',
                    padding: '0.5rem 0.625rem',
                    background: 'rgba(245,165,42,0.04)',
                    border: '1px solid rgba(245,165,42,0.08)',
                    borderRadius: '2px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.12s ease',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(245,165,42,0.09)'; e.currentTarget.style.borderColor = 'rgba(245,165,42,0.2)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(245,165,42,0.04)'; e.currentTarget.style.borderColor = 'rgba(245,165,42,0.08)' }}
                >
                  <span style={{ fontSize: '0.8125rem', color: 'rgba(240,235,225,0.75)', fontWeight: 500, lineHeight: 1.3 }}>{s.title}</span>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.625rem', color: '#F5A52A', opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{s.area}</span>
                    <span style={{ fontSize: '0.625rem', color: 'rgba(240,235,225,0.25)' }}>
                      {new Date(s.created_at).toLocaleDateString('es-CL', { day: '2-digit', month: 'short' })}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* View session modal */}
        {viewSession && (
          <div
            style={{ position: 'fixed', inset: 0, background: 'rgba(8,6,15,0.88)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: '1.5rem' }}
            onClick={(e) => { if (e.target === e.currentTarget) setViewSession(null) }}
          >
            <div style={{ background: '#120D28', border: '1px solid rgba(245,165,42,0.15)', borderRadius: '2px', width: '100%', maxWidth: '640px', maxHeight: '80vh', display: 'flex', flexDirection: 'column' }}>
              <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid rgba(245,165,42,0.08)', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
                <div>
                  <div style={{ fontFamily: 'Bebas Neue, Impact, sans-serif', fontSize: '1.25rem', letterSpacing: '0.05em', color: '#F0EBE1' }}>{viewSession.title}</div>
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                    <span style={{ fontSize: '0.625rem', color: '#F5A52A', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{viewSession.area}</span>
                    <span style={{ fontSize: '0.625rem', color: 'rgba(240,235,225,0.3)' }}>{new Date(viewSession.created_at).toLocaleDateString('es-CL', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
                  </div>
                </div>
                <button onClick={() => setViewSession(null)} style={{ background: 'none', border: 'none', color: 'rgba(240,235,225,0.35)', cursor: 'pointer', fontSize: '1.125rem', padding: 0, lineHeight: 1 }}>✕</button>
              </div>
              <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem 1.5rem' }}>
                <pre style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '0.8125rem', color: 'rgba(240,235,225,0.65)', lineHeight: 1.65, whiteSpace: 'pre-wrap', wordBreak: 'break-word', margin: 0 }}>
                  {viewSession.content}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* All contexts list */}
        <div
          style={{
            padding: '1rem 1.25rem',
            borderTop: '1px solid rgba(245,165,42,0.07)',
          }}
        >
          <div
            style={{
              fontFamily: 'IBM Plex Sans, sans-serif',
              fontSize: '0.5625rem',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: 'rgba(240,235,225,0.22)',
              marginBottom: '0.625rem',
            }}
          >
            Cambiar contexto
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
            {Object.entries(CONTEXT_LABELS).map(([key, label]) => (
              <button
                key={key}
                onClick={() => {
                  setSelectedContext(key)
                  setMessages([])
                }}
                style={{
                  padding: '0.25rem 0.5rem',
                  background:
                    selectedContext === key
                      ? 'rgba(245,165,42,0.12)'
                      : 'transparent',
                  border: `1px solid ${
                    selectedContext === key
                      ? 'rgba(245,165,42,0.25)'
                      : 'rgba(245,165,42,0.07)'
                  }`,
                  borderRadius: '2px',
                  color:
                    selectedContext === key
                      ? '#F5A52A'
                      : 'rgba(240,235,225,0.35)',
                  fontSize: '0.6875rem',
                  cursor: 'pointer',
                  transition: 'all 0.12s ease',
                  fontFamily: 'IBM Plex Sans, sans-serif',
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
