'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'

const PDFDownloadSection = dynamic(() => import('@/components/PDFDownloadSection'), { ssr: false })

// ── Types ─────────────────────────────────────────────────────────────────────

type EpisodeStatus = 'draft' | 'outline' | 'script' | 'in_production' | 'completed'

type Scene = {
  id: string
  act_id: string
  scene_number: number
  title: string | null
  description: string | null
  script_text: string | null
  location_name: string | null
  duration_est: number | null
  mood: string | null
}

type Act = {
  id: string
  act_number: number
  title: string | null
  summary: string | null
  goal: string | null
}

type Episode = {
  id: string
  season: number
  episode_number: number
  title: string | null
  logline: string | null
  synopsis: string | null
  theme: string | null
  cold_open: string | null
  tag: string | null
  script: string | null
  script_version: number
  script_finalized: boolean
  script_pdf_url: string | null
  status: EpisodeStatus
  acts: Act[]
  scenes: Scene[]
}

type WorkflowKey = 'write_script' | 'review_continuity' | 'improve_dialogue' | 'breakdown' | 'generate_scenes' | 'analyze_continuity' | null

type AssetGap = {
  id?: string
  scene_ref: string
  category: string
  entity_name: string
  entity_label: string
  matrix_key: string
  view_type: string
  outfit: string | null
  age_version: string | null
  reason: string
  status: string
}

type CanonIssue = {
  scene_ref: string
  entity: string
  issue: string
  severity: 'error' | 'warning'
}

// ── Constants ─────────────────────────────────────────────────────────────────

const STATUS_LABELS: Record<EpisodeStatus, string> = {
  draft: 'Borrador',
  outline: 'Outline',
  script: 'Guión',
  in_production: 'En producción',
  completed: 'Completado',
}

const STATUS_COLORS: Record<EpisodeStatus, string> = {
  draft: 'rgba(240,235,225,0.3)',
  outline: '#F5A52A',
  script: '#9B6FD4',
  in_production: '#4ECDC4',
  completed: '#D4256A',
}

const WORKFLOWS: { key: WorkflowKey; icon: React.ReactNode; label: string; desc: string; accent: string }[] = [
  { key: 'write_script',        icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 13L10.5 3.5a1.5 1.5 0 0 1 2.121 2.121L5 13H3v-2z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M9 5l2 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>, label: 'Escribir guión',         desc: 'El AI te asiste con el workflow oficial de guión — estructura, diálogos, formato estándar.',    accent: '#F5A52A' },
  { key: 'review_continuity',   icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.2"/><path d="M10.5 10.5L13 13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>, label: 'Revisar continuidad',    desc: 'Cruza el episodio contra el canon establecido. Detecta inconsistencias antes de producir.',  accent: '#D4256A' },
  { key: 'improve_dialogue',    icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 4h10a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H5l-3 2V5a1 1 0 0 1 1-1z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/></svg>, label: 'Mejorar diálogos',       desc: 'Analiza la voz de cada personaje. Asegura que hablen como en sus fichas canónicas.',         accent: '#9B6FD4' },
  { key: 'breakdown',           icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 4h8M4 8h6M4 12h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>, label: 'Breakdown de producción', desc: 'Extrae personajes, locaciones y props escena por escena. Listo para el equipo de arte.',     accent: '#4ECDC4' },
  { key: 'generate_scenes',     icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="2" y="3" width="12" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><path d="M6.5 6.5L10 8l-3.5 1.5V6.5z" fill="currentColor"/></svg>, label: 'Generar estructura',     desc: 'El AI propone una estructura de actos y escenas desde el logline o sinopsis del episodio.',   accent: '#4A8FE8' },
  { key: 'analyze_continuity',  icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 4h10v1.5H3zM3 7.5h10V9H3zM3 11h6v1.5H3z" fill="currentColor" opacity=".7"/></svg>, label: 'Log de continuidad',     desc: 'Genera el log de cambios canónicos del episodio para actualizar el sistema de continuidad.', accent: '#E87A4A' },
]

// ── Shared styles ─────────────────────────────────────────────────────────────

const BASE: React.CSSProperties = { fontFamily: 'IBM Plex Sans, sans-serif' }

const FIELD_LABEL: React.CSSProperties = {
  fontSize: '0.5625rem',
  letterSpacing: '0.14em',
  textTransform: 'uppercase' as const,
  color: 'rgba(240,235,225,0.3)',
  fontWeight: 600,
  marginBottom: '4px',
}

const INPUT: React.CSSProperties = {
  width: '100%',
  background: '#0D0920',
  border: '1px solid rgba(245,165,42,0.12)',
  borderRadius: '3px',
  color: '#F0EBE1',
  fontFamily: 'IBM Plex Sans, sans-serif',
  fontSize: '0.8125rem',
  padding: '7px 10px',
  outline: 'none',
  boxSizing: 'border-box' as const,
  resize: 'vertical' as const,
}

const SCRIPT_INPUT: React.CSSProperties = {
  width: '100%',
  background: '#06040F',
  border: '1px solid rgba(245,165,42,0.08)',
  borderRadius: '3px',
  color: '#F0EBE1',
  fontFamily: 'Courier New, Courier, monospace',
  fontSize: '0.8125rem',
  lineHeight: 1.7,
  padding: '16px',
  outline: 'none',
  boxSizing: 'border-box' as const,
  resize: 'none' as const,
  minHeight: '60vh',
  tabSize: 4,
}

const SECTION_HEADER: React.CSSProperties = {
  fontSize: '0.625rem',
  letterSpacing: '0.18em',
  textTransform: 'uppercase' as const,
  color: 'rgba(240,235,225,0.3)',
  fontWeight: 600,
  marginBottom: '0.75rem',
  paddingBottom: '0.5rem',
  borderBottom: '1px solid rgba(245,165,42,0.07)',
}

// ── Main component ─────────────────────────────────────────────────────────────

export default function EpisodeBuilderPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()

  const [episode, setEpisode] = useState<Episode | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [savedMsg, setSavedMsg] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Active workflow
  const [activeWorkflow, setActiveWorkflow] = useState<WorkflowKey>(null)

  // Script mode vs structure mode
  const [mode, setMode] = useState<'overview' | 'script' | 'structure' | 'produccion'>('overview')

  // Script analysis
  const [analyzingScript, setAnalyzingScript] = useState(false)
  const [analyzeProgress, setAnalyzeProgress] = useState(0)
  const [analyzeStep, setAnalyzeStep] = useState('')
  const [scriptGaps, setScriptGaps] = useState<AssetGap[]>([])
  const [canonIssues, setCanonIssues] = useState<CanonIssue[]>([])
  const [analysisSummary, setAnalysisSummary] = useState('')
  const [analysisError, setAnalysisError] = useState('')
  const [creatingGap, setCreatingGap] = useState<string | null>(null)
  const progressTimer = useRef<ReturnType<typeof setInterval> | null>(null)

  // AI panel
  const [aiMessages, setAiMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([])
  const [aiInput, setAiInput] = useState('')
  const [aiStreaming, setAiStreaming] = useState(false)
  const aiBottomRef = useRef<HTMLDivElement>(null)

  // Local draft of script
  const [scriptDraft, setScriptDraft] = useState('')
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const scriptFileRef = useRef<HTMLInputElement>(null)
  const [importingDoc, setImportingDoc] = useState(false)

  // Scene being expanded
  const [expandedScene, setExpandedScene] = useState<string | null>(null)

  // Generated scenes pending import
  type GeneratedScene = { title: string; description: string; characters: string[]; location: string; duration_est: number; mood: string }
  const [pendingScenes, setPendingScenes] = useState<GeneratedScene[] | null>(null)
  const [importing, setImporting] = useState(false)

  // Continuity log entries saved to DB
  type ContinuityEntry = { id: string; type: string; entity: string; description: string; created_at: string }
  const [continuityLog, setContinuityLog] = useState<ContinuityEntry[]>([])
  type PendingChange = { type: string; entity: string; description: string }
  const [pendingChanges, setPendingChanges] = useState<PendingChange[] | null>(null)
  const [savingLog, setSavingLog] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    Promise.all([
      fetch(`/api/episodes?id=${id}`).then(r => r.json()),
      fetch(`/api/episode-chat?episode_id=${id}`).then(r => r.json()),
      fetch(`/api/episode-continuity-log?episode_id=${id}`).then(r => r.json()),
      fetch(`/api/episodes/${id}/analyze-script`).then(r => r.json()),
    ])
      .then(([ep, chat, log, gaps]) => {
        if (ep.id) {
          setEpisode(ep)
          setScriptDraft(ep.script ?? '')
        }
        if (Array.isArray(chat) && chat.length > 0) {
          setAiMessages(chat.map((m: { role: 'user' | 'assistant'; content: string }) => ({ role: m.role, content: m.content })))
          // Restore last active workflow from most recent message
          const lastMsg = chat[chat.length - 1] as { workflow_key?: string }
          if (lastMsg?.workflow_key && lastMsg.workflow_key !== 'general') {
            setActiveWorkflow(lastMsg.workflow_key as WorkflowKey)
          }
        }
        if (Array.isArray(log)) setContinuityLog(log)
        if (Array.isArray(gaps)) setScriptGaps(gaps)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [id])

  useEffect(() => {
    aiBottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [aiMessages])

  // Auto-save script with debounce
  const autoSaveScript = useCallback((text: string) => {
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(async () => {
      await fetch(`/api/episodes?id=${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ script: text }),
      })
    }, 1500)
  }, [id])

  function handleScriptChange(text: string) {
    setScriptDraft(text)
    autoSaveScript(text)
  }

  async function saveField(field: string, value: string) {
    if (!episode) return
    setSaving(true)
    const res = await fetch(`/api/episodes?id=${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ [field]: value }),
    })
    const data = await res.json()
    if (data.id) {
      setEpisode(prev => prev ? { ...prev, [field]: value } : prev)
      setSavedMsg(true)
      setTimeout(() => setSavedMsg(false), 2000)
    }
    setSaving(false)
  }

  async function saveStatus(status: EpisodeStatus) {
    await fetch(`/api/episodes?id=${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    setEpisode(prev => prev ? { ...prev, status } : prev)
  }

  async function addScene(actId: string) {
    if (!episode) return
    const res = await fetch('/api/scenes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ act_id: actId, episode_id: id }),
    })
    const scene = await res.json()
    if (scene.id) {
      setEpisode(prev => prev ? { ...prev, scenes: [...prev.scenes, scene] } : prev)
    }
  }

  async function deleteScene(sceneId: string) {
    if (!confirm('¿Eliminar esta escena?')) return
    await fetch(`/api/scenes?id=${sceneId}`, { method: 'DELETE' })
    setEpisode(prev => prev ? { ...prev, scenes: prev.scenes.filter(s => s.id !== sceneId) } : prev)
  }

  async function updateSceneField(sceneId: string, field: string, value: string) {
    await fetch(`/api/scenes?id=${sceneId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ [field]: value }),
    })
    setEpisode(prev => prev ? {
      ...prev,
      scenes: prev.scenes.map(s => s.id === sceneId ? { ...s, [field]: value } : s)
    } : prev)
  }

  async function sendToAI(workflowKey: WorkflowKey, userMsg?: string) {
    if (!episode || aiStreaming) return
    const msg = userMsg ?? aiInput.trim()
    if (!msg && aiMessages.length === 0) return

    const newMsg = { role: 'user' as const, content: msg || `Usa el workflow "${workflowKey}" para este episodio.` }
    setAiMessages(prev => [...prev, newMsg, { role: 'assistant', content: '' }])
    setAiInput('')
    setAiStreaming(true)
    setPendingScenes(null)
    setPendingChanges(null)

    // generate_scenes and analyze_continuity return JSON — use non-streaming path
    const isJson = workflowKey === 'generate_scenes' || workflowKey === 'analyze_continuity'
    const wfKey = workflowKey ?? 'general'

    try {
      const res = await fetch('/api/episode-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: workflowKey, episodeId: id, prompt: newMsg.content, stream: !isJson }),
      })

      let assistantContent = ''

      if (isJson) {
        const data = await res.json()
        assistantContent = data.raw ?? ''
        setAiMessages(prev => {
          const m = [...prev]
          m[m.length - 1] = { role: 'assistant', content: assistantContent }
          return m
        })
        if (workflowKey === 'generate_scenes' && data.result?.scenes) {
          setPendingScenes(data.result.scenes)
        }
        if (workflowKey === 'analyze_continuity' && data.result?.changes) {
          setPendingChanges(data.result.changes)
        }
      } else {
        const reader = res.body?.getReader()
        if (!reader) return
        const dec = new TextDecoder()
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          const chunk = dec.decode(value, { stream: true })
          assistantContent += chunk
          setAiMessages(prev => {
            const m = [...prev]
            m[m.length - 1] = { role: 'assistant', content: m[m.length - 1].content + chunk }
            return m
          })
        }
      }

      // Persist both messages to DB
      await fetch('/api/episode-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify([
          { episode_id: id, workflow_key: wfKey, role: 'user', content: newMsg.content },
          { episode_id: id, workflow_key: wfKey, role: 'assistant', content: assistantContent },
        ]),
      })
    } catch { /* ignore */ } finally { setAiStreaming(false) }
  }

  async function approveAndSaveLog(changes: PendingChange[]) {
    setSavingLog(true)
    try {
      const res = await fetch('/api/episode-continuity-log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ episode_id: id, changes }),
      })
      const data = await res.json()
      if (data.ok) {
        // Reload log
        const updated = await fetch(`/api/episode-continuity-log?episode_id=${id}`).then(r => r.json())
        if (Array.isArray(updated)) setContinuityLog(updated)
        setPendingChanges(null)
      }
    } catch { /* ignore */ } finally { setSavingLog(false) }
  }

  async function deleteLogEntry(entryId: string) {
    await fetch(`/api/episode-continuity-log?id=${entryId}`, { method: 'DELETE' })
    setContinuityLog(prev => prev.filter(e => e.id !== entryId))
  }

  async function importGeneratedScenes(scenes: { title: string; description: string; characters: string[]; location: string; duration_est: number; mood: string }[]) {
    if (!episode || importing) return
    setImporting(true)
    // Distribute scenes across acts as evenly as possible
    const acts = [...episode.acts].sort((a, b) => a.act_number - b.act_number)
    const perAct = Math.ceil(scenes.length / acts.length)
    const created: Scene[] = []
    for (let i = 0; i < acts.length; i++) {
      const actScenes = scenes.slice(i * perAct, (i + 1) * perAct)
      for (const sc of actScenes) {
        const res = await fetch('/api/scenes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            act_id: acts[i].id,
            episode_id: id,
            title: sc.title,
            description: sc.description,
          }),
        })
        const scene = await res.json()
        if (scene.id) {
          // patch extra fields
          await fetch(`/api/scenes?id=${scene.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ location_name: sc.location, duration_est: sc.duration_est, mood: sc.mood }),
          })
          created.push({ ...scene, location_name: sc.location, duration_est: sc.duration_est, mood: sc.mood })
        }
      }
    }
    setEpisode(prev => prev ? { ...prev, scenes: [...prev.scenes, ...created] } : prev)
    setPendingScenes(null)
    setMode('structure')
    setImporting(false)
  }

  function scriptCode() {
    if (!episode) return ''
    const base = `T${episode.season}E${String(episode.episode_number).padStart(2, '0')}`
    if (episode.script_finalized) return `${base}-FINAL`
    return `${base}-G${String(episode.script_version).padStart(2, '0')}`
  }

  async function bumpVersion() {
    if (!episode) return
    if (!confirm(`¿Guardar versión ${scriptCode()} y crear la siguiente?`)) return
    const nextVersion = episode.script_version + 1
    const res = await fetch(`/api/episodes?id=${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ script_version: nextVersion, script_finalized: false }),
    })
    const data = await res.json()
    if (data.id) setEpisode(prev => prev ? { ...prev, script_version: nextVersion, script_finalized: false } : prev)
  }

  async function finalizeScript() {
    if (!episode) return
    if (!confirm(`¿Aprobar este guión como FINAL? El código será T${episode.season}E${String(episode.episode_number).padStart(2, '0')}-FINAL.`)) return
    const res = await fetch(`/api/episodes?id=${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ script_finalized: true }),
    })
    const data = await res.json()
    if (data.id) setEpisode(prev => prev ? { ...prev, script_finalized: true } : prev)
  }

  async function importScriptFromDoc(file: File) {
    if (importingDoc) return
    setImportingDoc(true)
    try {
      // 1. Get signed upload URL (server sanitizes the path automatically)
      const pathRes = await fetch('/api/assets/upload-signed-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: `scripts/${id}/${file.name}` }),
      })
      const { signed_url, path } = await pathRes.json()
      if (!signed_url) throw new Error('No se pudo obtener URL de subida')

      // 2. Upload file
      await fetch(signed_url, { method: 'PUT', body: file, headers: { 'Content-Type': file.type || 'application/octet-stream' } })

      // 3. Parse text
      const parseRes = await fetch('/api/parse-doc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ storage_path: path, filename: file.name }),
      })
      const { text, error } = await parseRes.json()
      if (error || !text) throw new Error(error ?? 'No se pudo extraer texto')

      // 4. Set and save
      setScriptDraft(text)
      await fetch(`/api/episodes?id=${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ script: text }),
      })
      setSavedMsg(true)
      setTimeout(() => setSavedMsg(false), 2000)

      // 5. Auto-analyze — switch to produccion tab first so user sees progress
      setMode('produccion')
      setAnalyzingScript(true)
      setAnalysisError('')
      setAnalysisSummary('')
      setCanonIssues([])
      startProgressAnimation()
      try {
        const res = await fetch(`/api/episodes/${id}/analyze-script`, { method: 'POST' })
        const data = await res.json()
        if (res.ok) {
          setScriptGaps(data.gaps ?? [])
          setCanonIssues(data.canon_issues ?? [])
          setAnalysisSummary(data.summary ?? '')
          stopProgressAnimation(true)
        } else {
          setAnalysisError(data.error ?? 'Error en el análisis')
          stopProgressAnimation(false)
        }
      } catch {
        setAnalysisError('Error al conectar con el servidor')
        stopProgressAnimation(false)
      }
    } catch (e) {
      alert(`Error al importar: ${e instanceof Error ? e.message : String(e)}`)
    } finally {
      setImportingDoc(false)
      if (scriptFileRef.current) scriptFileRef.current.value = ''
    }
  }

  function startProgressAnimation() {
    const STEPS = [
      { pct: 8,  label: 'Leyendo guión...' },
      { pct: 22, label: 'Cargando biblia canónica...' },
      { pct: 38, label: 'Validando continuidad...' },
      { pct: 55, label: 'Identificando personajes y locaciones...' },
      { pct: 70, label: 'Detectando gaps de assets...' },
      { pct: 83, label: 'Generando reporte...' },
      { pct: 92, label: 'Casi listo...' },
    ]
    let stepIdx = 0
    setAnalyzeProgress(0)
    setAnalyzeStep(STEPS[0].label)

    progressTimer.current = setInterval(() => {
      if (stepIdx < STEPS.length - 1) {
        stepIdx++
        setAnalyzeProgress(STEPS[stepIdx].pct)
        setAnalyzeStep(STEPS[stepIdx].label)
      }
    }, 5000)
  }

  function stopProgressAnimation(success: boolean) {
    if (progressTimer.current) clearInterval(progressTimer.current)
    progressTimer.current = null
    if (success) {
      setAnalyzeProgress(100)
      setAnalyzeStep('Análisis completado')
    }
    setTimeout(() => {
      setAnalyzeProgress(0)
      setAnalyzeStep('')
      setAnalyzingScript(false)
    }, success ? 800 : 0)
  }

  async function analyzeScript() {
    if (!episode || analyzingScript) return
    setAnalyzingScript(true)
    setAnalysisError('')
    setAnalysisSummary('')
    setCanonIssues([])
    startProgressAnimation()
    try {
      const res = await fetch(`/api/episodes/${id}/analyze-script`, { method: 'POST' })
      const data = await res.json()
      if (!res.ok) {
        setAnalysisError(data.error ?? 'Error en el análisis')
        stopProgressAnimation(false)
        return
      }
      setScriptGaps(data.gaps ?? [])
      setCanonIssues(data.canon_issues ?? [])
      setAnalysisSummary(data.summary ?? '')
      stopProgressAnimation(true)
    } catch {
      setAnalysisError('Error al conectar con el servidor')
      stopProgressAnimation(false)
    }
  }

  async function createGapSlot(gap: AssetGap, gapIndex: string) {
    if (creatingGap) return
    setCreatingGap(gapIndex)
    try {
      const res = await fetch('/api/assets/create-entity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: gap.category,
          entity_name: gap.entity_name,
          entity_label: gap.entity_label,
          matrix_key: gap.matrix_key,
        }),
      })
      if (res.ok) {
        // Mark gap as created in DB if it has an id
        if (gap.id) {
          await fetch(`/api/episodes/${id}/analyze-script`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ gap_id: gap.id, status: 'created' }),
          }).catch(() => {})
        }
        setScriptGaps(prev => prev.map(g =>
          g.entity_name === gap.entity_name && g.view_type === gap.view_type
            ? { ...g, status: 'created' }
            : g
        ))
      }
    } catch { /* ignore */ } finally {
      setCreatingGap(null)
    }
  }

  function activateWorkflow(key: WorkflowKey) {
    setActiveWorkflow(key)
    setAiMessages([])
    setAiInput('')
    if (key === 'write_script') setMode('script')
    else setMode('structure')
    // Auto-trigger workflow intro
    sendToAI(key, `Iniciando workflow: ${key}. Tengo el episodio cargado. ¿Por dónde empezamos?`)
  }

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#08060F', color: 'rgba(240,235,225,0.2)', fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '0.875rem' }}>
      Cargando episodio...
    </div>
  )

  if (!episode) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#08060F', color: 'rgba(212,37,106,0.6)', fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '0.875rem' }}>
      Episodio no encontrado.
    </div>
  )

  const code = `T${episode.season}E${String(episode.episode_number).padStart(2, '0')}`
  const statusColor = STATUS_COLORS[episode.status]

  return (
    <div style={{ ...BASE, display: 'flex', flexDirection: 'column', height: '100vh', background: '#08060F', overflow: 'hidden' }}>

      {/* ── TOPBAR ─────────────────────────────────────────────────────── */}
      <div style={{ flexShrink: 0, background: '#0D0920', borderBottom: '1px solid rgba(212,37,106,0.15)', padding: '0 1.5rem', height: '52px', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {/* Back */}
        <button onClick={() => router.push('/episodes')} style={{ background: 'none', border: 'none', color: 'rgba(240,235,225,0.35)', cursor: 'pointer', fontSize: '0.8125rem', padding: '4px 8px 4px 0', display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
          ← Episodios
        </button>
        <div style={{ width: '1px', height: '20px', background: 'rgba(212,37,106,0.2)', flexShrink: 0 }} />

        {/* Code */}
        <span style={{ fontFamily: 'monospace', fontSize: '0.75rem', letterSpacing: '0.14em', color: statusColor, flexShrink: 0 }}>{code}</span>

        {/* Title editable */}
        <input
          defaultValue={episode.title ?? ''}
          placeholder="Sin título"
          onBlur={e => saveField('title', e.target.value)}
          style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontFamily: 'Bebas Neue, Impact, sans-serif', fontSize: '1.25rem', letterSpacing: '0.06em', color: '#F0EBE1', minWidth: 0 }}
        />

        {/* Status dropdown */}
        <select
          value={episode.status}
          onChange={e => saveStatus(e.target.value as EpisodeStatus)}
          style={{ background: '#120D28', border: `1px solid ${statusColor}`, borderRadius: '3px', color: statusColor, fontSize: '0.75rem', padding: '4px 8px', outline: 'none', cursor: 'pointer', fontFamily: 'IBM Plex Sans, sans-serif', flexShrink: 0 }}
        >
          {Object.entries(STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>

        {/* Mode tabs */}
        <div data-tutorial="episode-tabs" style={{ display: 'flex', gap: '2px', background: '#120D28', borderRadius: '3px', padding: '2px', flexShrink: 0 }}>
          {[
            { key: 'overview',   label: 'Vista general', tutorialAttr: 'episode-overview' },
            { key: 'script',     label: 'Guión',         tutorialAttr: 'episode-script-tab' },
            { key: 'structure',  label: 'Estructura',    tutorialAttr: 'episode-structure-tab' },
            { key: 'produccion', label: 'Producción',    tutorialAttr: 'episode-produccion-tab' },
          ].map(tab => (
            <button
              key={tab.key}
              data-tutorial={tab.tutorialAttr}
              onClick={() => setMode(tab.key as typeof mode)}
              style={{ padding: '4px 10px', background: mode === tab.key ? 'rgba(212,37,106,0.2)' : 'transparent', border: 'none', borderRadius: '2px', color: mode === tab.key ? '#D4256A' : 'rgba(240,235,225,0.4)', fontSize: '0.75rem', cursor: 'pointer', fontFamily: 'IBM Plex Sans, sans-serif', whiteSpace: 'nowrap' }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {savedMsg && <span style={{ fontSize: '0.7rem', color: '#4ECDC4', flexShrink: 0 }}>✓ Guardado</span>}
      </div>

      {/* ── MAIN BODY ──────────────────────────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>

        {/* ── LEFT PANEL ─────────────────────────────────────────────── */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', minWidth: 0 }}>

          {/* OVERVIEW MODE */}
          {mode === 'overview' && (
            <div>
              {/* Workflow cards */}
              <div style={{ ...SECTION_HEADER }}>Workflows del episodio</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.75rem', marginBottom: '2rem' }}>
                {WORKFLOWS.map(wf => (
                  <div
                    key={wf.key}
                    onClick={() => activateWorkflow(wf.key)}
                    style={{
                      background: activeWorkflow === wf.key ? `${wf.accent}14` : '#0D0920',
                      border: `1px solid ${activeWorkflow === wf.key ? wf.accent : 'rgba(245,165,42,0.08)'}`,
                      borderRadius: '4px',
                      padding: '1rem',
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                    }}
                    onMouseEnter={e => { if (activeWorkflow !== wf.key) { e.currentTarget.style.borderColor = wf.accent; e.currentTarget.style.background = `${wf.accent}08` } }}
                    onMouseLeave={e => { if (activeWorkflow !== wf.key) { e.currentTarget.style.borderColor = 'rgba(245,165,42,0.08)'; e.currentTarget.style.background = '#0D0920' } }}
                  >
                    <div style={{ width: '28px', height: '28px', marginBottom: '0.5rem', color: wf.accent, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{wf.icon}</div>
                    <div style={{ fontFamily: 'Bebas Neue, Impact, sans-serif', fontSize: '0.9rem', letterSpacing: '0.06em', color: activeWorkflow === wf.key ? wf.accent : '#F0EBE1', marginBottom: '0.375rem' }}>{wf.label}</div>
                    <div style={{ fontSize: '0.6875rem', color: 'rgba(240,235,225,0.4)', lineHeight: 1.5 }}>{wf.desc}</div>
                  </div>
                ))}
              </div>

              {/* Episode metadata */}
              <div style={{ ...SECTION_HEADER }}>Datos del episodio</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                {[
                  { field: 'logline', label: 'Logline', placeholder: 'Una oración que resume el conflicto central del episodio...', rows: 2 },
                  { field: 'theme', label: 'Tema central', placeholder: 'El tema que explora este episodio...', rows: 2 },
                  { field: 'cold_open', label: 'Cold Open', placeholder: 'Lo que ocurre antes de los créditos...', rows: 3 },
                  { field: 'tag', label: 'Tag / Gancho final', placeholder: 'El cierre o gancho post-créditos...', rows: 3 },
                ].map(({ field, label, placeholder, rows }) => (
                  <div key={field}>
                    <div style={FIELD_LABEL}>{label}</div>
                    <textarea
                      key={`${episode.id}-${field}`}
                      defaultValue={(episode as Record<string, unknown>)[field] as string ?? ''}
                      placeholder={placeholder}
                      rows={rows}
                      onBlur={e => saveField(field, e.target.value)}
                      style={{ ...INPUT, lineHeight: 1.5 }}
                    />
                  </div>
                ))}
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={FIELD_LABEL}>Sinopsis</div>
                <textarea
                  key={`${episode.id}-synopsis`}
                  defaultValue={episode.synopsis ?? ''}
                  placeholder="Resumen narrativo del episodio (2–3 párrafos)..."
                  rows={5}
                  onBlur={e => saveField('synopsis', e.target.value)}
                  style={{ ...INPUT, lineHeight: 1.6 }}
                />
              </div>
            </div>
          )}

          {/* SCRIPT MODE */}
          {mode === 'script' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ ...SECTION_HEADER, marginBottom: 0 }}>Guión</div>
                  {/* Version badge */}
                  <span style={{
                    fontFamily: 'monospace',
                    fontSize: '0.7rem',
                    letterSpacing: '0.12em',
                    padding: '2px 8px',
                    borderRadius: '3px',
                    background: episode.script_finalized ? 'rgba(78,205,196,0.12)' : 'rgba(245,165,42,0.10)',
                    border: `1px solid ${episode.script_finalized ? 'rgba(78,205,196,0.4)' : 'rgba(245,165,42,0.3)'}`,
                    color: episode.script_finalized ? '#4ECDC4' : '#F5A52A',
                    fontWeight: 700,
                  }}>
                    {scriptCode()}
                  </span>
                  <span style={{ fontSize: '0.6rem', color: 'rgba(240,235,225,0.2)', fontFamily: 'monospace' }}>
                    {scriptDraft.split('\n').length} líneas · {Math.round(scriptDraft.length / 1500)} min
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <input
                    ref={scriptFileRef}
                    type="file"
                    accept=".docx,.txt,.md"
                    style={{ display: 'none' }}
                    onChange={e => { const f = e.target.files?.[0]; if (f) importScriptFromDoc(f) }}
                  />
                  <button
                    onClick={() => scriptFileRef.current?.click()}
                    disabled={importingDoc}
                    style={{ padding: '4px 10px', background: 'rgba(78,205,196,0.10)', border: '1px solid rgba(78,205,196,0.3)', borderRadius: '3px', color: '#4ECDC4', fontSize: '0.7rem', cursor: importingDoc ? 'not-allowed' : 'pointer', fontFamily: 'IBM Plex Sans, sans-serif' }}
                  >
                    {importingDoc ? '...' : '↑ Importar Word'}
                  </button>
                  <button
                    onClick={() => activateWorkflow('write_script')}
                    style={{ padding: '4px 10px', background: 'rgba(245,165,42,0.12)', border: '1px solid rgba(245,165,42,0.3)', borderRadius: '3px', color: '#F5A52A', fontSize: '0.7rem', cursor: 'pointer', fontFamily: 'IBM Plex Sans, sans-serif' }}
                  >
                    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" style={{ marginRight: '4px', verticalAlign: 'middle' }}><path d="M3 13L10.5 3.5a1.5 1.5 0 0 1 2.121 2.121L5 13H3v-2z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M9 5l2 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
                    Asistente
                  </button>
                  {!episode.script_finalized && (
                    <button
                      onClick={bumpVersion}
                      style={{ padding: '4px 10px', background: 'rgba(155,111,212,0.12)', border: '1px solid rgba(155,111,212,0.3)', borderRadius: '3px', color: '#9B6FD4', fontSize: '0.7rem', cursor: 'pointer', fontFamily: 'IBM Plex Sans, sans-serif' }}
                    >
                      + Nueva versión
                    </button>
                  )}
                  {!episode.script_finalized && scriptDraft.trim().length > 100 && (
                    <button
                      onClick={finalizeScript}
                      style={{ padding: '4px 10px', background: 'rgba(78,205,196,0.12)', border: '1px solid rgba(78,205,196,0.3)', borderRadius: '3px', color: '#4ECDC4', fontSize: '0.7rem', cursor: 'pointer', fontFamily: 'IBM Plex Sans, sans-serif' }}
                    >
                      ✓ Aprobar FINAL
                    </button>
                  )}
                  {/* PDF Export */}
                  {mounted && (
                    <PDFDownloadSection
                      season={episode.season}
                      episodeNumber={episode.episode_number}
                      title={episode.title}
                      logline={episode.logline}
                      synopsis={episode.synopsis}
                      theme={episode.theme}
                      coldOpen={episode.cold_open}
                      tag={episode.tag}
                      script={scriptDraft}
                      status={episode.status}
                      fileName={`${scriptCode()} — ${episode.title ?? 'Sin título'}.pdf`}
                      renderButton={(loading, onClick) => (
                        <button
                          onClick={onClick}
                          disabled={loading}
                          style={{ padding: '4px 10px', background: loading ? 'rgba(212,37,106,0.08)' : 'rgba(212,37,106,0.15)', border: '1px solid rgba(212,37,106,0.3)', borderRadius: '3px', color: '#D4256A', fontSize: '0.7rem', cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'IBM Plex Sans, sans-serif', fontWeight: 600 }}
                        >
                          {loading ? '...' : '↓ PDF'}
                        </button>
                      )}
                    />
                  )}
                </div>
              </div>
              {/* Script format guide */}
              <div style={{ background: 'rgba(245,165,42,0.04)', border: '1px solid rgba(245,165,42,0.08)', borderRadius: '3px', padding: '8px 12px', marginBottom: '0.75rem', fontSize: '0.6rem', color: 'rgba(240,235,225,0.3)', lineHeight: 1.6, fontFamily: 'Courier New, monospace' }}>
                INT./EXT. LOCACIÓN — DÍA/NOCHE &nbsp;·&nbsp; PERSONAJE (centrado) &nbsp;·&nbsp; diálogo indentado &nbsp;·&nbsp; (acotación) bajo nombre
              </div>
              <textarea
                value={scriptDraft}
                onChange={e => handleScriptChange(e.target.value)}
                placeholder={`INT. CASA PRODIGIO — SALA COMÚN — DÍA\n\nMateo entra por la puerta trasera con la mochila al hombro. Nadie lo nota.\n\n\t\t\t\t\tSOFÍA\n\t\t\t(sin mirarle)\n\t\tLlegaste tarde otra vez.\n\n`}
                style={SCRIPT_INPUT}
                spellCheck={false}
              />
            </div>
          )}

          {/* STRUCTURE MODE */}
          {mode === 'structure' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div style={{ ...SECTION_HEADER, marginBottom: 0 }}>Estructura del episodio</div>
                <button
                  onClick={() => activateWorkflow('generate_scenes')}
                  style={{ padding: '5px 12px', background: 'rgba(74,143,232,0.15)', border: '1px solid rgba(74,143,232,0.4)', borderRadius: '3px', color: '#4A8FE8', fontSize: '0.75rem', cursor: 'pointer', fontFamily: 'IBM Plex Sans, sans-serif' }}
                >
                  <svg width="13" height="13" viewBox="0 0 16 16" fill="none" style={{ marginRight: '4px', verticalAlign: 'middle' }}><rect x="2" y="3" width="12" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><path d="M6.5 6.5L10 8l-3.5 1.5V6.5z" fill="currentColor"/></svg>
                  Generar estructura con AI
                </button>
              </div>

              {episode.acts.map(act => {
                const actScenes = episode.scenes.filter(s => s.act_id === act.id).sort((a, b) => a.scene_number - b.scene_number)
                return (
                  <div key={act.id} style={{ marginBottom: '1.5rem', background: '#0D0920', border: '1px solid rgba(212,37,106,0.12)', borderRadius: '4px', overflow: 'hidden' }}>
                    {/* Act header */}
                    <div style={{ background: 'rgba(212,37,106,0.06)', padding: '0.875rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{ fontFamily: 'Bebas Neue, Impact, sans-serif', fontSize: '1rem', letterSpacing: '0.1em', color: '#D4256A', flexShrink: 0 }}>ACTO {act.act_number}</span>
                      <input
                        defaultValue={act.title ?? ''}
                        placeholder="Título del acto..."
                        onBlur={async e => {
                          await fetch(`/api/acts?id=${act.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title: e.target.value }) })
                          setEpisode(prev => prev ? { ...prev, acts: prev.acts.map(a => a.id === act.id ? { ...a, title: e.target.value } : a) } : prev)
                        }}
                        style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#F0EBE1', fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '0.875rem', fontWeight: 600 }}
                      />
                      <span style={{ fontSize: '0.6rem', color: 'rgba(240,235,225,0.25)', fontFamily: 'monospace', flexShrink: 0 }}>{actScenes.length} escena{actScenes.length !== 1 ? 's' : ''}</span>
                    </div>

                    {/* Act goal */}
                    <div style={{ padding: '0.75rem 1rem 0' }}>
                      <div style={FIELD_LABEL}>Objetivo narrativo del acto</div>
                      <input
                        defaultValue={act.goal ?? ''}
                        placeholder="¿Qué debe lograr este acto en la historia?"
                        onBlur={async e => {
                          await fetch(`/api/acts?id=${act.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ goal: e.target.value }) })
                        }}
                        style={{ ...INPUT, marginBottom: '0.75rem' }}
                      />
                    </div>

                    {/* Scenes */}
                    <div style={{ padding: '0 1rem 1rem' }}>
                      {actScenes.map(scene => (
                        <div key={scene.id} style={{ background: '#120D28', border: '1px solid rgba(245,165,42,0.06)', borderRadius: '3px', marginBottom: '0.5rem', overflow: 'hidden' }}>
                          {/* Scene header */}
                          <div
                            style={{ padding: '0.625rem 0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}
                            onClick={() => setExpandedScene(expandedScene === scene.id ? null : scene.id)}
                          >
                            <span style={{ fontSize: '0.55rem', fontFamily: 'monospace', color: 'rgba(240,235,225,0.25)', flexShrink: 0 }}>ESC {scene.scene_number}</span>
                            <input
                              defaultValue={scene.title ?? ''}
                              placeholder="Título de la escena..."
                              onClick={e => e.stopPropagation()}
                              onBlur={e => updateSceneField(scene.id, 'title', e.target.value)}
                              style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#F0EBE1', fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '0.8125rem' }}
                            />
                            {scene.location_name && <span style={{ fontSize: '0.6rem', color: 'rgba(240,235,225,0.3)', flexShrink: 0, display: 'flex', alignItems: 'center', gap: '3px' }}><svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M6 1a3.5 3.5 0 0 1 3.5 3.5c0 2.5-3.5 6.5-3.5 6.5S2.5 7 2.5 4.5A3.5 3.5 0 0 1 6 1z" stroke="currentColor" strokeWidth="1.1"/><circle cx="6" cy="4.5" r="1.2" fill="currentColor"/></svg>{scene.location_name}</span>}
                            {scene.duration_est && <span style={{ fontSize: '0.6rem', color: 'rgba(240,235,225,0.3)', flexShrink: 0, display: 'flex', alignItems: 'center', gap: '3px' }}><svg width="10" height="10" viewBox="0 0 12 12" fill="none"><circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.1"/><path d="M6 3.5V6l1.5 1.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/></svg>{scene.duration_est}s</span>}
                            <span style={{ fontSize: '0.7rem', color: 'rgba(240,235,225,0.2)', flexShrink: 0 }}>{expandedScene === scene.id ? '▲' : '▼'}</span>
                            <button
                              onClick={e => { e.stopPropagation(); deleteScene(scene.id) }}
                              style={{ background: 'none', border: 'none', color: 'rgba(212,37,106,0.3)', cursor: 'pointer', fontSize: '0.9rem', padding: '0 2px', flexShrink: 0 }}
                              onMouseEnter={e => (e.currentTarget.style.color = '#D4256A')}
                              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(212,37,106,0.3)')}
                            >×</button>
                          </div>

                          {/* Scene detail (expanded) */}
                          {expandedScene === scene.id && (
                            <div style={{ padding: '0 0.875rem 0.875rem', borderTop: '1px solid rgba(245,165,42,0.05)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                              <div>
                                <div style={FIELD_LABEL}>Descripción / Acción</div>
                                <textarea
                                  defaultValue={scene.description ?? ''}
                                  placeholder="Qué ocurre en esta escena..."
                                  rows={3}
                                  onBlur={e => updateSceneField(scene.id, 'description', e.target.value)}
                                  style={{ ...INPUT, lineHeight: 1.5 }}
                                />
                              </div>
                              <div>
                                <div style={FIELD_LABEL}>Locación</div>
                                <input
                                  defaultValue={scene.location_name ?? ''}
                                  placeholder="Nombre de la locación..."
                                  onBlur={e => updateSceneField(scene.id, 'location_name', e.target.value)}
                                  style={{ ...INPUT, marginBottom: '0.5rem' }}
                                />
                                <div style={FIELD_LABEL}>Mood / Tono</div>
                                <input
                                  defaultValue={scene.mood ?? ''}
                                  placeholder="Ej: tenso, íntimo, cómico..."
                                  onBlur={e => updateSceneField(scene.id, 'mood', e.target.value)}
                                  style={{ ...INPUT, marginBottom: '0.5rem' }}
                                />
                                <div style={FIELD_LABEL}>Duración estimada (seg)</div>
                                <input
                                  type="number"
                                  defaultValue={scene.duration_est ?? ''}
                                  placeholder="Ej: 45"
                                  min={0}
                                  onBlur={e => { if (e.target.value) updateSceneField(scene.id, 'duration_est', e.target.value) }}
                                  style={{ ...INPUT }}
                                />
                              </div>
                              <div style={{ gridColumn: '1 / -1' }}>
                                <div style={FIELD_LABEL}>Guión de la escena</div>
                                <textarea
                                  defaultValue={scene.script_text ?? ''}
                                  placeholder="INT. LOCACIÓN — DÍA\n\nAcción...\n\n\t\t\tPERSONAJE\n\t\tDiálogo..."
                                  rows={6}
                                  onBlur={e => updateSceneField(scene.id, 'script_text', e.target.value)}
                                  style={{ ...INPUT, fontFamily: 'Courier New, monospace', lineHeight: 1.7, fontSize: '0.75rem' }}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      ))}

                      {/* Add scene button */}
                      <button
                        onClick={() => addScene(act.id)}
                        style={{ width: '100%', padding: '7px', background: 'transparent', border: '1px dashed rgba(212,37,106,0.2)', borderRadius: '3px', color: 'rgba(212,37,106,0.5)', fontSize: '0.75rem', cursor: 'pointer', fontFamily: 'IBM Plex Sans, sans-serif', transition: 'all 0.15s' }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(212,37,106,0.5)'; e.currentTarget.style.color = '#D4256A' }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(212,37,106,0.2)'; e.currentTarget.style.color = 'rgba(212,37,106,0.5)' }}
                      >
                        + Agregar escena al Acto {act.act_number}
                      </button>
                    </div>
                  </div>
                )
              })}

              {/* Continuity log saved entries */}
              {continuityLog.length > 0 && (
                <div style={{ marginTop: '2rem' }}>
                  <div style={{ ...SECTION_HEADER }}>Log de continuidad guardado</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {continuityLog.map(entry => (
                      <div key={entry.id} style={{ background: '#0D0920', border: '1px solid rgba(232,122,74,0.12)', borderLeft: '3px solid #E87A4A', borderRadius: '3px', padding: '0.625rem 0.875rem', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                        <span style={{ fontSize: '0.55rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#E87A4A', fontWeight: 600, flexShrink: 0, marginTop: '2px', minWidth: '80px' }}>{entry.type.replace('_', ' ')}</span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: '0.75rem', color: '#F0EBE1', fontWeight: 600, marginBottom: '2px' }}>{entry.entity}</div>
                          <div style={{ fontSize: '0.75rem', color: 'rgba(240,235,225,0.55)', lineHeight: 1.5 }}>{entry.description}</div>
                        </div>
                        <button
                          onClick={() => deleteLogEntry(entry.id)}
                          style={{ background: 'none', border: 'none', color: 'rgba(212,37,106,0.25)', cursor: 'pointer', fontSize: '0.9rem', padding: '0 2px', flexShrink: 0 }}
                          onMouseEnter={e => (e.currentTarget.style.color = '#D4256A')}
                          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(212,37,106,0.25)')}
                        >×</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          {/* PRODUCCIÓN MODE */}
          {mode === 'produccion' && (
            <div>
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <div>
                  <div style={{ ...SECTION_HEADER, marginBottom: '4px' }}>Análisis de producción</div>
                  <div style={{ fontSize: '0.6875rem', color: 'rgba(240,235,225,0.3)', lineHeight: 1.5 }}>
                    Claude analiza el guión, cruza con la biblia y detecta qué assets visuales faltan por crear.
                  </div>
                </div>
                <button
                  onClick={analyzeScript}
                  disabled={analyzingScript || !scriptDraft || scriptDraft.trim().length < 50}
                  style={{
                    padding: '10px 20px',
                    background: analyzingScript ? 'rgba(155,111,212,0.15)' : 'rgba(155,111,212,0.2)',
                    border: '1px solid rgba(155,111,212,0.5)',
                    borderRadius: '4px',
                    color: analyzingScript ? 'rgba(155,111,212,0.5)' : '#9B6FD4',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    cursor: analyzingScript || !scriptDraft || scriptDraft.trim().length < 50 ? 'not-allowed' : 'pointer',
                    fontFamily: 'IBM Plex Sans, sans-serif',
                    flexShrink: 0,
                    whiteSpace: 'nowrap',
                    height: 'auto',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '7px',
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M12 7A5 5 0 1 1 7 2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/><path d="M7 2l2-2M7 2l2 2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  {analyzingScript ? 'Analizando...' : 'Analizar guión'}
                </button>
              </div>

              {/* Progress bar */}
              {analyzingScript && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.75rem', color: '#9B6FD4', fontWeight: 600 }}>{analyzeStep}</span>
                    <span style={{ fontSize: '0.7rem', color: 'rgba(155,111,212,0.5)', fontFamily: 'monospace' }}>{analyzeProgress}%</span>
                  </div>
                  <div style={{ height: '3px', background: 'rgba(155,111,212,0.12)', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%',
                      width: `${analyzeProgress}%`,
                      background: 'linear-gradient(90deg, #9B6FD4, #4A8FE8)',
                      borderRadius: '2px',
                      transition: 'width 4.5s cubic-bezier(0.4, 0, 0.2, 1)',
                      boxShadow: '0 0 8px rgba(155,111,212,0.6)',
                    }} />
                  </div>
                  <div style={{ display: 'flex', gap: '6px', marginTop: '12px', flexWrap: 'wrap' }}>
                    {['Leyendo guión', 'Validando canon', 'Detectando gaps', 'Generando reporte'].map((step, i) => {
                      const stepPct = [8, 38, 70, 92][i]
                      const done = analyzeProgress >= stepPct
                      return (
                        <div key={step} style={{
                          display: 'flex', alignItems: 'center', gap: '5px',
                          padding: '4px 10px',
                          background: done ? 'rgba(155,111,212,0.12)' : 'rgba(255,255,255,0.03)',
                          border: `1px solid ${done ? 'rgba(155,111,212,0.3)' : 'rgba(255,255,255,0.06)'}`,
                          borderRadius: '20px',
                          transition: 'all 0.4s ease',
                        }}>
                          {done ? (
                            <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><polyline points="1.5 5 4 7.5 8.5 2.5" stroke="#9B6FD4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                          ) : (
                            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'rgba(255,255,255,0.15)' }} />
                          )}
                          <span style={{ fontSize: '0.6rem', color: done ? '#9B6FD4' : 'rgba(240,235,225,0.25)', letterSpacing: '0.06em' }}>{step}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* No script warning */}
              {(!scriptDraft || scriptDraft.trim().length < 50) && (
                <div style={{ background: 'rgba(245,165,42,0.06)', border: '1px solid rgba(245,165,42,0.15)', borderRadius: '4px', padding: '1.25rem 1.5rem', fontSize: '0.875rem', color: 'rgba(240,235,225,0.4)', marginBottom: '1.5rem' }}>
                  El episodio necesita un guión cargado para poder analizarlo. Ve a la pestaña Guión y escribe o pega el texto.
                </div>
              )}

              {/* Error */}
              {analysisError && (
                <div style={{ background: 'rgba(212,37,106,0.08)', border: '1px solid rgba(212,37,106,0.2)', borderRadius: '4px', padding: '0.875rem 1rem', fontSize: '0.875rem', color: '#D4256A', marginBottom: '1.5rem' }}>
                  {analysisError}
                </div>
              )}

              {/* Summary */}
              {analysisSummary && (
                <div style={{ background: 'rgba(155,111,212,0.07)', border: '1px solid rgba(155,111,212,0.15)', borderRadius: '4px', padding: '1rem 1.25rem', fontSize: '0.875rem', color: 'rgba(240,235,225,0.7)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                  {analysisSummary}
                </div>
              )}

              {/* Canon issues */}
              {canonIssues.length > 0 && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <div style={{ ...SECTION_HEADER }}>Issues de canon ({canonIssues.length})</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {canonIssues.map((issue, i) => (
                      <div key={i} style={{
                        background: issue.severity === 'error' ? 'rgba(212,37,106,0.07)' : 'rgba(245,165,42,0.06)',
                        border: `1px solid ${issue.severity === 'error' ? 'rgba(212,37,106,0.2)' : 'rgba(245,165,42,0.15)'}`,
                        borderLeft: `3px solid ${issue.severity === 'error' ? '#D4256A' : '#F5A52A'}`,
                        borderRadius: '3px',
                        padding: '1rem',
                        display: 'flex',
                        gap: '0.75rem',
                        alignItems: 'flex-start',
                      }}>
                        <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'flex-start' }}>
                          <span style={{
                            fontSize: '0.55rem', letterSpacing: '0.12em', textTransform: 'uppercase',
                            color: issue.severity === 'error' ? '#D4256A' : '#F5A52A',
                            background: issue.severity === 'error' ? 'rgba(212,37,106,0.15)' : 'rgba(245,165,42,0.15)',
                            borderRadius: '20px', padding: '2px 10px', fontWeight: 700,
                          }}>{issue.severity}</span>
                          <div style={{ fontSize: '0.6rem', color: 'rgba(240,235,225,0.3)' }}>{issue.scene_ref}</div>
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: '0.9rem', color: '#F0EBE1', fontWeight: 700, marginBottom: '4px' }}>{issue.entity}</div>
                          <div style={{ fontSize: '0.8125rem', color: 'rgba(240,235,225,0.55)', lineHeight: 1.6 }}>{issue.issue}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Asset gaps */}
              {scriptGaps.length > 0 && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                    <div style={{ ...SECTION_HEADER, marginBottom: 0 }}>Assets faltantes ({scriptGaps.filter(g => g.status === 'pending').length} pendientes)</div>
                  </div>
                  {/* Group by entity */}
                  {(() => {
                    const byEntity: Record<string, AssetGap[]> = {}
                    for (const g of scriptGaps) {
                      if (!byEntity[g.entity_name]) byEntity[g.entity_name] = []
                      byEntity[g.entity_name].push(g)
                    }
                    return Object.entries(byEntity).map(([entityName, gaps]) => (
                      <div key={entityName} style={{ marginBottom: '1rem', background: '#0D0920', border: '1px solid rgba(245,165,42,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                        {/* Entity header */}
                        <div style={{ padding: '0.75rem 0.875rem', background: 'rgba(245,165,42,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontFamily: 'Bebas Neue, Impact, sans-serif', fontSize: '1.1rem', letterSpacing: '0.06em', color: '#F0EBE1' }}>{gaps[0].entity_label}</span>
                            <span style={{
                              fontSize: '0.55rem', textTransform: 'uppercase', letterSpacing: '0.1em',
                              color: '#F5A52A', background: 'rgba(245,165,42,0.15)',
                              borderRadius: '20px', padding: '2px 8px', fontWeight: 600,
                            }}>{gaps[0].category}</span>
                          </div>
                          <span style={{ fontSize: '0.6rem', color: 'rgba(240,235,225,0.25)', fontFamily: 'monospace' }}>{gaps.filter(g => g.status === 'pending').length} faltantes</span>
                        </div>
                        {/* Gaps list */}
                        <div style={{ padding: '0.5rem' }}>
                          {gaps.map((gap, gi) => {
                            const gapKey = `${gap.entity_name}-${gap.view_type}-${gi}`
                            const isDone = gap.status === 'created' || gap.status === 'linked' || gap.status === 'skipped'
                            return (
                              <div key={gapKey} style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                padding: '10px 12px',
                                borderRadius: '3px',
                                background: isDone ? 'rgba(78,205,196,0.05)' : 'transparent',
                                marginBottom: '2px',
                                opacity: isDone ? 0.6 : 1,
                              }}>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                                    <span style={{ fontSize: '0.875rem', color: isDone ? '#4ECDC4' : '#F0EBE1', fontWeight: 600 }}>{gap.view_type}</span>
                                    {gap.outfit && <span style={{ fontSize: '0.6rem', color: 'rgba(240,235,225,0.35)' }}>· {gap.outfit}</span>}
                                    {gap.age_version && <span style={{ fontSize: '0.6rem', color: 'rgba(240,235,225,0.35)' }}>· {gap.age_version}</span>}
                                  </div>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                                    <span style={{
                                      fontSize: '0.6rem', color: '#9B6FD4',
                                      background: 'rgba(155,111,212,0.15)',
                                      borderRadius: '20px', padding: '1px 8px',
                                      flexShrink: 0,
                                    }}>{gap.scene_ref}</span>
                                    <span style={{ fontSize: '0.75rem', color: 'rgba(240,235,225,0.45)', lineHeight: 1.5 }}>{gap.reason}</span>
                                  </div>
                                </div>
                                {isDone ? (
                                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.7rem', color: '#4ECDC4', flexShrink: 0 }}>
                                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><polyline points="2 6 5 9 10 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                    creado
                                  </span>
                                ) : (
                                  <button
                                    onClick={() => createGapSlot(gap, gapKey)}
                                    disabled={creatingGap === gapKey}
                                    style={{
                                      padding: '6px 12px',
                                      background: 'rgba(78,205,196,0.12)',
                                      border: '1px solid rgba(78,205,196,0.3)',
                                      borderRadius: '3px',
                                      color: '#4ECDC4',
                                      fontSize: '0.75rem',
                                      fontWeight: 600,
                                      cursor: creatingGap === gapKey ? 'not-allowed' : 'pointer',
                                      fontFamily: 'IBM Plex Sans, sans-serif',
                                      flexShrink: 0,
                                      whiteSpace: 'nowrap',
                                    }}
                                  >
                                    {creatingGap === gapKey ? '...' : '+ Crear slots'}
                                  </button>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    ))
                  })()}
                </div>
              )}

              {/* Empty state */}
              {!analyzingScript && !analysisError && scriptGaps.length === 0 && canonIssues.length === 0 && scriptDraft && scriptDraft.trim().length >= 50 && (
                <div style={{ color: 'rgba(240,235,225,0.2)', fontSize: '0.875rem', textAlign: 'center', marginTop: '4rem', lineHeight: 1.8 }}>
                  Presiona "Analizar guión" para detectar<br />assets faltantes y validar el canon.
                </div>
              )}
            </div>
          )}

        </div>

        {/* ── RIGHT PANEL — AI ASSISTANT ─────────────────────────────── */}
        <div data-tutorial="episode-ai-panel" style={{ width: '380px', flexShrink: 0, borderLeft: '1px solid rgba(212,37,106,0.12)', display: 'flex', flexDirection: 'column', background: '#0A0719' }}>

          {/* AI panel header */}
          <div style={{ flexShrink: 0, padding: '0.875rem 1rem', borderBottom: '1px solid rgba(212,37,106,0.10)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: activeWorkflow ? '#4ECDC4' : 'rgba(240,235,225,0.15)' }} />
            <span style={{ fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(240,235,225,0.4)' }}>
              {activeWorkflow ? WORKFLOWS.find(w => w.key === activeWorkflow)?.label : 'Asistente de episodio'}
            </span>
            {activeWorkflow && (
              <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px', alignItems: 'center' }}>
                <button
                  onClick={async () => {
                    if (!confirm('¿Borrar historial de este workflow?')) return
                    await fetch(`/api/episode-chat?episode_id=${id}&workflow_key=${activeWorkflow}`, { method: 'DELETE' })
                    setAiMessages([])
                  }}
                  style={{ background: 'none', border: 'none', color: 'rgba(240,235,225,0.2)', cursor: 'pointer', fontSize: '0.7rem', fontFamily: 'IBM Plex Sans, sans-serif' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'rgba(240,235,225,0.45)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(240,235,225,0.2)')}
                >
                  limpiar
                </button>
                <button
                  onClick={() => { setActiveWorkflow(null) }}
                  style={{ background: 'none', border: 'none', color: 'rgba(240,235,225,0.25)', cursor: 'pointer', fontSize: '0.75rem' }}
                >
                  × cerrar
                </button>
              </div>
            )}
          </div>

          {/* Workflow quick-launch (when no active workflow) */}
          {!activeWorkflow && (
            <div style={{ padding: '1rem', borderBottom: '1px solid rgba(212,37,106,0.08)' }}>
              <div style={{ fontSize: '0.6rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(240,235,225,0.25)', marginBottom: '0.5rem' }}>Iniciar workflow</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {WORKFLOWS.map(wf => (
                  <button
                    key={wf.key}
                    onClick={() => activateWorkflow(wf.key)}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '7px 10px', background: 'transparent', border: `1px solid rgba(240,235,225,0.06)`, borderRadius: '3px', color: 'rgba(240,235,225,0.55)', fontSize: '0.8rem', cursor: 'pointer', textAlign: 'left', fontFamily: 'IBM Plex Sans, sans-serif', transition: 'all 0.12s' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = wf.accent; e.currentTarget.style.color = wf.accent; e.currentTarget.style.background = `${wf.accent}08` }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(240,235,225,0.06)'; e.currentTarget.style.color = 'rgba(240,235,225,0.55)'; e.currentTarget.style.background = 'transparent' }}
                  >
                    <span>{wf.icon}</span>
                    <span>{wf.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
            {aiMessages.length === 0 && (
              <div style={{ color: 'rgba(240,235,225,0.2)', fontSize: '0.8125rem', textAlign: 'center', marginTop: '2rem', lineHeight: 1.6 }}>
                Selecciona un workflow o escribe directamente para conversar sobre este episodio.
              </div>
            )}
            {aiMessages.map((msg, i) => (
              <div key={i} style={{ marginBottom: '1rem' }}>
                <div style={{ fontSize: '0.55rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: msg.role === 'user' ? 'rgba(212,37,106,0.6)' : 'rgba(78,205,196,0.6)', marginBottom: '3px' }}>
                  {msg.role === 'user' ? 'Tú' : 'Asistente'}
                </div>
                <div style={{ fontSize: '0.8125rem', color: msg.role === 'user' ? 'rgba(240,235,225,0.7)' : '#F0EBE1', lineHeight: 1.6, whiteSpace: 'pre-wrap', background: msg.role === 'user' ? 'transparent' : 'rgba(78,205,196,0.04)', borderRadius: '3px', padding: msg.role === 'assistant' ? '8px 10px' : '0', border: msg.role === 'assistant' ? '1px solid rgba(78,205,196,0.08)' : 'none' }}>
                  {msg.content || (aiStreaming && i === aiMessages.length - 1 ? <span style={{ opacity: 0.4 }}>●●●</span> : '')}
                </div>
              </div>
            ))}
            <div ref={aiBottomRef} />
          </div>

          {/* Approve continuity log banner */}
          {pendingChanges && pendingChanges.length > 0 && (
            <div style={{ flexShrink: 0, padding: '0.75rem 1rem', borderTop: '1px solid rgba(232,122,74,0.25)', background: 'rgba(232,122,74,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.75rem', color: 'rgba(240,235,225,0.6)', lineHeight: 1.4 }}>
                <span style={{ color: '#E87A4A', fontWeight: 600 }}>{pendingChanges.length} cambios</span> de continuidad detectados
              </span>
              <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                <button
                  onClick={() => setPendingChanges(null)}
                  style={{ padding: '4px 8px', background: 'transparent', border: '1px solid rgba(240,235,225,0.1)', borderRadius: '3px', color: 'rgba(240,235,225,0.35)', fontSize: '0.7rem', cursor: 'pointer', fontFamily: 'IBM Plex Sans, sans-serif' }}
                >
                  Descartar
                </button>
                <button
                  onClick={() => approveAndSaveLog(pendingChanges)}
                  disabled={savingLog}
                  style={{ padding: '4px 12px', background: savingLog ? 'rgba(232,122,74,0.3)' : '#E87A4A', border: 'none', borderRadius: '3px', color: '#F0EBE1', fontSize: '0.7rem', fontWeight: 600, cursor: savingLog ? 'not-allowed' : 'pointer', fontFamily: 'IBM Plex Sans, sans-serif' }}
                >
                  {savingLog ? 'Guardando...' : '✓ Aprobar y guardar log'}
                </button>
              </div>
            </div>
          )}

          {/* Import generated scenes banner */}
          {pendingScenes && pendingScenes.length > 0 && (
            <div style={{ flexShrink: 0, padding: '0.75rem 1rem', borderTop: '1px solid rgba(74,143,232,0.2)', background: 'rgba(74,143,232,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.75rem', color: 'rgba(240,235,225,0.6)', lineHeight: 1.4 }}>
                <span style={{ color: '#4A8FE8', fontWeight: 600 }}>{pendingScenes.length} escenas</span> listas para importar
              </span>
              <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                <button
                  onClick={() => setPendingScenes(null)}
                  style={{ padding: '4px 8px', background: 'transparent', border: '1px solid rgba(240,235,225,0.1)', borderRadius: '3px', color: 'rgba(240,235,225,0.35)', fontSize: '0.7rem', cursor: 'pointer', fontFamily: 'IBM Plex Sans, sans-serif' }}
                >
                  Descartar
                </button>
                <button
                  onClick={() => importGeneratedScenes(pendingScenes)}
                  disabled={importing}
                  style={{ padding: '4px 12px', background: importing ? 'rgba(74,143,232,0.3)' : '#4A8FE8', border: 'none', borderRadius: '3px', color: '#F0EBE1', fontSize: '0.7rem', fontWeight: 600, cursor: importing ? 'not-allowed' : 'pointer', fontFamily: 'IBM Plex Sans, sans-serif' }}
                >
                  {importing ? 'Importando...' : '→ Importar a estructura'}
                </button>
              </div>
            </div>
          )}

          {/* Input */}
          <div style={{ flexShrink: 0, padding: '0.75rem', borderTop: '1px solid rgba(212,37,106,0.10)', display: 'flex', gap: '6px' }}>
            <textarea
              value={aiInput}
              onChange={e => setAiInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendToAI(activeWorkflow ?? 'write_script') } }}
              placeholder={activeWorkflow ? 'Responde o pregunta algo...' : 'Escribe algo sobre este episodio...'}
              rows={2}
              disabled={aiStreaming}
              style={{ flex: 1, background: '#0D0920', border: '1px solid rgba(212,37,106,0.15)', borderRadius: '3px', color: '#F0EBE1', fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '0.8125rem', padding: '7px 10px', outline: 'none', resize: 'none', lineHeight: 1.5, opacity: aiStreaming ? 0.5 : 1 }}
            />
            <button
              onClick={() => sendToAI(activeWorkflow ?? 'write_script')}
              disabled={aiStreaming || !aiInput.trim()}
              style={{ padding: '0 12px', background: aiStreaming ? 'rgba(212,37,106,0.1)' : 'rgba(212,37,106,0.8)', border: 'none', borderRadius: '3px', color: '#F0EBE1', fontSize: '0.8125rem', cursor: aiStreaming || !aiInput.trim() ? 'not-allowed' : 'pointer', fontFamily: 'IBM Plex Sans, sans-serif', fontWeight: 700 }}
            >
              {aiStreaming ? '...' : '→'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
