'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { storageUrl } from '@/lib/supabase'

const PDFDownloadSection = dynamic(() => import('@/components/PDFDownloadSection'), { ssr: false })
const NuppaGraph = dynamic(() => import('@/components/NuppaGraph'), { ssr: false })

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
  hero_image_path: string | null
  status: EpisodeStatus
  acts: Act[]
  scenes: Scene[]
}

type WorkflowKey = 'write_script' | 'review_continuity' | 'improve_dialogue' | 'breakdown' | 'generate_scenes' | 'analyze_continuity' | null

type ExtractedScene = {
  title: string
  description: string
  location: string
  characters: string[]
  duration_est: number
  mood: string
  scene_ref: string
}

type ExtractedAct = {
  act_number: number
  title: string
  goal: string
  scenes: ExtractedScene[]
}

type ExtractionResult = {
  acts: ExtractedAct[]
  notes: string
  total_scenes: number
}

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

// ── Full Analysis Types ───────────────────────────────────────────────────────

type Finding = {
  id: string
  category: string
  title: string
  scene_ref: string
  evidence: string
  problem_description: string
  narrative_effect: string
  improvement_goal: string
  priority: 'alta' | 'media' | 'baja'
  status: 'pending' | 'in_review' | 'implemented' | 'verified' | 'discarded'
  source: 'scoring' | 'assistant'
  order_index: number
  discarded_reason?: string
}

type AnalysisCategory = {
  key: string
  label: string
  score: number
  strength: string
  weakness: string
  findings: Finding[]
}

type AnalysisScene = {
  scene_number: number
  title: string
  description: string
  original_text: string
  location: string
  characters: string[]
  duration_est: number
  mood: string
  scene_ref: string
}

type AnalysisAct = {
  act_number: number
  title: string
  goal: string
  scenes: AnalysisScene[]
}

type CurrentAnalysis = {
  analysis_id: string
  script_version_id: string
  overall_score: number
  verdict: string
  is_current: boolean
  created_at: string
  categories: AnalysisCategory[]
  scores_snapshot?: AnalysisCategory[]
  findings_count: number
  pending_count: number
  structure?: { acts: AnalysisAct[]; total_scenes: number; structure_notes: string }
  script_truncated?: boolean
  script_total_chars?: number
  script_analyzed_chars?: number
}

type ScriptProposal = {
  id: string
  finding_id: string
  episode_id: string
  original_text: string | null
  proposed_text: string | null
  final_text: string | null   // reused: first approver email in awaiting_second_approval state
  change_type: string | null  // 'awaiting_second_approval' after first approval
  location_hint: string | null
  status: 'draft' | 'pending' | 'approved' | 'discarded' | 'reverted' | null
  created_at: string
  updated_at: string
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
  const [aiPanelOpen, setAiPanelOpen] = useState(false)
  const [aiPanelWidth, setAiPanelWidth] = useState(420)
  const aiPanelDragging = useRef(false)
  const aiPanelDragStart = useRef({ x: 0, width: 420 })
  const [detectedProposals, setDetectedProposals] = useState<{ scene_ref: string; original_text: string; proposed_text: string }[]>([])
  const [savingProposal, setSavingProposal] = useState(false)
  const [episodeProposals, setEpisodeProposals] = useState<ScriptProposal[]>([])
  const [approvingProposal, setApprovingProposal] = useState<string | null>(null)
  const [nuppaHighlights, setNuppaHighlights] = useState<string[]>([])

  // Script mode vs structure mode
  const [mode, setMode] = useState<'overview' | 'script' | 'structure' | 'produccion' | 'motor'>('overview')

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
  const [scriptEditMode, setScriptEditMode] = useState(false)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const scriptFileRef = useRef<HTMLInputElement>(null)
  const [importingDoc, setImportingDoc] = useState(false)
  const heroFileRef = useRef<HTMLInputElement>(null)
  const [heroUploading, setHeroUploading] = useState(false)

  // Scene being expanded
  const [expandedScene, setExpandedScene] = useState<string | null>(null)

  // Generated scenes pending import
  type GeneratedScene = { title: string; description: string; characters: string[]; location: string; duration_est: number; mood: string }
  const [pendingScenes, setPendingScenes] = useState<GeneratedScene[] | null>(null)
  const [importing, setImporting] = useState(false)

  // Structure extraction from script
  const [extractingStructure, setExtractingStructure] = useState(false)
  const [extractStep, setExtractStep] = useState('')
  const [extractedStructure, setExtractedStructure] = useState<ExtractionResult | null>(null)
  const [applyingStructure, setApplyingStructure] = useState(false)
  const extractTimer = useRef<ReturnType<typeof setInterval> | null>(null)

  // Full analysis (replaces scoreScript + extractedStructure)
  const [currentAnalysis, setCurrentAnalysis] = useState<CurrentAnalysis | null>(null)
  const [analyzingFull, setAnalyzingFull] = useState(false)
  const [analyzeFullError, setAnalyzeFullError] = useState('')
  const [fullAnalyzeProgress, setFullAnalyzeProgress] = useState(0)
  const [fullAnalyzeStepLabel, setFullAnalyzeStepLabel] = useState('')
  const [expandedFinding, setExpandedFinding] = useState<string | null>(null)
  const [selectedFinding, setSelectedFinding] = useState<Finding | null>(null)
  const [updatingFinding, setUpdatingFinding] = useState<string | null>(null)

  // Script rewrite (full rewrite with plan)
  type RewriteChange = { scene_ref: string; finding_title: string; what_changes: string; why: string; dimensions: string[] }
  type RewritePlan = { summary: string; changes: RewriteChange[]; removals: string[]; additions: string[]; expected_improvement: string }
  const [rewriting, setRewriting] = useState(false)
  const [rewriteError, setRewriteError] = useState('')
  const [rewriteResult, setRewriteResult] = useState<{ plan: RewritePlan; rewritten_script: string; findings_addressed: number } | null>(null)
  const [applyingRewrite, setApplyingRewrite] = useState(false)

  async function runRewrite() {
    if (rewriting) return
    setRewriting(true)
    setRewriteError('')
    setRewriteResult(null)
    try {
      const res = await fetch(`/api/episodes/${id}/rewrite-script`, { method: 'POST' })
      const data = await res.json()
      if (res.ok) {
        setRewriteResult(data)
      } else {
        setRewriteError(data.error ?? 'Error en la reescritura')
      }
    } catch {
      setRewriteError('Error de conexión')
    } finally {
      setRewriting(false)
    }
  }

  async function applyRewrite() {
    if (!rewriteResult || applyingRewrite) return
    setApplyingRewrite(true)
    try {
      await fetch(`/api/episodes?id=${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ script: rewriteResult.rewritten_script }),
      })
      setScriptDraft(rewriteResult.rewritten_script)
      setEpisode(prev => prev ? { ...prev, script: rewriteResult!.rewritten_script } : prev)
      setRewriteResult(null)
      // Auto-run full analysis to get new score
      await runFullAnalysis()
    } finally {
      setApplyingRewrite(false)
    }
  }

  async function runFullAnalysis() {
    if (analyzingFull) return
    setAnalyzingFull(true)
    setAnalyzeFullError('')
    try {
      const res = await fetch(`/api/episodes/${id}/analyze-full`, { method: 'POST' })
      const data = await res.json()
      if (res.ok) {
        // Map the FullAnalysis response to CurrentAnalysis shape
        setCurrentAnalysis({
          analysis_id: data.analysis_id,
          script_version_id: data.script_version_id,
          overall_score: data.scoring.overall,
          verdict: data.scoring.verdict,
          is_current: true,
          created_at: new Date().toISOString(),
          categories: data.scoring.categories,
          findings_count: data.findings_count,
          pending_count: data.findings_count,
          structure: data.structure,
          script_truncated: data.script_truncated,
          script_total_chars: data.script_total_chars,
          script_analyzed_chars: data.script_analyzed_chars,
        })
        setMode('structure')
      } else {
        setAnalyzeFullError(data.error ?? 'Error en el análisis')
      }
    } catch {
      setAnalyzeFullError('Error de conexión')
    } finally {
      setAnalyzingFull(false)
    }
  }

  // Animated progress for full analysis
  useEffect(() => {
    if (!analyzingFull) {
      setFullAnalyzeProgress(0)
      setFullAnalyzeStepLabel('')
      return
    }
    const stages = [
      { pct: 8,  label: 'Leyendo el guión completo...' },
      { pct: 20, label: 'Identificando actos y escenas...' },
      { pct: 35, label: 'Evaluando narrativa y estructura...' },
      { pct: 50, label: 'Analizando personajes y diálogo...' },
      { pct: 63, label: 'Revisando ritmo y emoción...' },
      { pct: 75, label: 'Detectando hallazgos editoriales...' },
      { pct: 85, label: 'Calculando puntuaciones...' },
      { pct: 92, label: 'Preparando el reporte final...' },
      { pct: 96, label: 'Guardando análisis en la base de datos...' },
    ]
    let stageIndex = 0
    setFullAnalyzeProgress(stages[0].pct)
    setFullAnalyzeStepLabel(stages[0].label)
    const interval = setInterval(() => {
      stageIndex = Math.min(stageIndex + 1, stages.length - 1)
      setFullAnalyzeProgress(stages[stageIndex].pct)
      setFullAnalyzeStepLabel(stages[stageIndex].label)
    }, 8000)
    return () => clearInterval(interval)
  }, [analyzingFull])

  async function updateFindingStatus(finding: Finding, status: Finding['status'], reason?: string) {
    setUpdatingFinding(finding.id)
    try {
      await fetch(`/api/script-findings?id=${finding.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, discarded_reason: reason }),
      })
      setCurrentAnalysis(prev => {
        if (!prev) return prev
        return {
          ...prev,
          categories: prev.categories.map(cat => ({
            ...cat,
            findings: cat.findings.map(f =>
              f.id === finding.id ? { ...f, status, discarded_reason: reason } : f
            ),
          })),
        }
      })
    } finally {
      setUpdatingFinding(null)
    }
  }

  function improveWithNuppa(finding: Finding) {
    setSelectedFinding(finding)
    setActiveWorkflow('improve_dialogue')
    setAiPanelOpen(true)
    const categoryLabels: Record<string, string> = { narrativa: 'Narrativa', personajes: 'Personajes', dialogo: 'Diálogo', ritmo: 'Ritmo', emocion: 'Emoción' }
    const prompt = `[Hallazgo seleccionado para mejora]
Categoría: ${categoryLabels[finding.category] ?? finding.category}
Prioridad: ${finding.priority.toUpperCase()}
Hallazgo: ${finding.title}
Escena: ${finding.scene_ref}
Evidencia: "${finding.evidence}"
Problema: ${finding.problem_description}
Efecto narrativo: ${finding.narrative_effect}
Objetivo de la mejora: ${finding.improvement_goal}

Trabajemos este hallazgo específico. Propón una revisión concreta del fragmento afectado que resuelva el problema sin alterar la continuidad ni la información narrativa del episodio.

Al final de tu respuesta, incluye UN BLOQUE POR CADA cambio concreto que propongas. Si propones cambios en dos escenas distintas, incluye dos bloques:

<<<PROPUESTA_NUPPA>>>
{"scene_ref":"ESC XX","original_text":"texto EXACTO del guión que reemplazas (copia literal)","proposed_text":"texto nuevo completo"}
<<<FIN_PROPUESTA>>>

El original_text debe ser cita LITERAL del guión (para ubicarlo automáticamente). Un bloque por escena afectada.`
    setTimeout(() => sendToAI('improve_dialogue', prompt), 100)
  }

  // Continuity log entries saved to DB
  type ContinuityEntry = { id: string; type: string; entity: string; description: string; created_at: string }
  const [continuityLog, setContinuityLog] = useState<ContinuityEntry[]>([])
  type PendingChange = { type: string; entity: string; description: string }
  const [pendingChanges, setPendingChanges] = useState<PendingChange[] | null>(null)
  const [savingLog, setSavingLog] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    fetch(`/api/script-proposals?episode_id=${id}`)
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) {
          setEpisodeProposals(data)
          const approved = data
            .filter((p: ScriptProposal) => p.status === 'approved' && p.proposed_text)
            .map((p: ScriptProposal) => p.proposed_text as string)
          if (approved.length > 0) setNuppaHighlights(approved)
        }
      })
      .catch(() => {})

    Promise.all([
      fetch(`/api/episodes?id=${id}`).then(r => r.json()),
      fetch(`/api/episode-chat?episode_id=${id}`).then(r => r.json()),
      fetch(`/api/episode-continuity-log?episode_id=${id}`).then(r => r.json()),
      fetch(`/api/episodes/${id}/analyze-script`).then(r => r.json()),
      fetch(`/api/episodes/${id}/analyses`).then(r => r.json()),
    ])
      .then(([ep, chat, log, gaps, analysis]) => {
        if (ep.id) {
          setEpisode(ep)
          setScriptDraft(ep.script ?? '')
        }
        if (Array.isArray(chat) && chat.length > 0) {
          setAiMessages(chat.map((m: { role: 'user' | 'assistant'; content: string }) => ({ role: m.role, content: m.content })))
          const lastMsg = chat[chat.length - 1] as { workflow_key?: string }
          if (lastMsg?.workflow_key && lastMsg.workflow_key !== 'general') {
            setActiveWorkflow(lastMsg.workflow_key as WorkflowKey)
          }
        }
        if (Array.isArray(log)) setContinuityLog(log)
        if (Array.isArray(gaps)) setScriptGaps(gaps)
        if (analysis?.analysis) {
          setCurrentAnalysis(analysis.analysis)
          if (Array.isArray(analysis.analysis.canon_issues) && analysis.analysis.canon_issues.length > 0) {
            setCanonIssues(analysis.analysis.canon_issues)
          }
        }
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
        // Parse ALL NUPPA proposal blocks from isJson response
        {
          const allBlocks = [...assistantContent.matchAll(/<<<PROPUESTA_NUPPA>>>([\s\S]*?)<<<FIN_PROPUESTA>>>/g)]
          const parsed = allBlocks.map(m => { try { return JSON.parse(m[1].trim()) } catch { return null } }).filter(p => p?.original_text && p?.proposed_text)
          if (parsed.length > 0) setDetectedProposals(parsed)
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
        // Parse ALL NUPPA proposal blocks from streaming response
        {
          const allBlocks = [...assistantContent.matchAll(/<<<PROPUESTA_NUPPA>>>([\s\S]*?)<<<FIN_PROPUESTA>>>/g)]
          const parsed = allBlocks.map(m => { try { return JSON.parse(m[1].trim()) } catch { return null } }).filter(p => p?.original_text && p?.proposed_text)
          if (parsed.length > 0) setDetectedProposals(parsed)
        }
      }

      // Persist both messages to DB (use cleaned content without proposal block)
      const cleanContent = assistantContent.replace(/<<<PROPUESTA_NUPPA>>>[\s\S]*?<<<FIN_PROPUESTA>>>/g, '').trim()
      await fetch('/api/episode-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify([
          { episode_id: id, workflow_key: wfKey, role: 'user', content: newMsg.content },
          { episode_id: id, workflow_key: wfKey, role: 'assistant', content: cleanContent },
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

  async function saveDetectedProposal() {
    if (!detectedProposals.length || !selectedFinding) return
    setSavingProposal(true)
    try {
      const saved: ScriptProposal[] = []
      for (const dp of detectedProposals) {
        const res = await fetch('/api/script-proposals', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            finding_id: selectedFinding.id,
            episode_id: id,
            original_text: dp.original_text,
            proposed_text: dp.proposed_text,
            location_hint: dp.scene_ref,
          }),
        })
        const data = await res.json()
        if (res.ok) {
          saved.push(data)
        } else {
          alert(`Error al guardar propuesta ${dp.scene_ref}: ${data?.error ?? res.status}`)
        }
      }
      if (saved.length > 0) {
        setEpisodeProposals(prev => [...saved, ...prev])
        setDetectedProposals([])
        if (selectedFinding) updateFindingStatus(selectedFinding, 'in_review')
      }
    } finally {
      setSavingProposal(false)
    }
  }

  async function approveProposal(proposal: ScriptProposal) {
    if (!proposal.original_text || !proposal.proposed_text) return
    setApprovingProposal(proposal.id)
    try {
      const isAwaitingSecond = proposal.final_text?.startsWith('__approved_by__') ?? false

      if (!isAwaitingSecond) {
        // First approval: record approver, don't merge yet
        const res = await fetch(`/api/script-proposals?id=${proposal.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'first_approval' }),
        })
        const updated = await res.json()
        if (!res.ok) {
          alert(`Error al aprobar: ${updated?.error ?? res.status}`)
          return
        }
        setEpisodeProposals(prev => prev.map(p => p.id === proposal.id ? updated : p))
      } else {
        // Second approval: merge text into script (normalize whitespace to handle import differences)
        const mergeIntoScript = (script: string, orig: string, proposed: string): string | null => {
          if (script.includes(orig)) return script.replace(orig, proposed)
          const n = (s: string) => s.replace(/\r\n/g, '\n').replace(/\r/g, '\n')
          const ns = n(script), no = n(orig)
          if (ns.includes(no)) return ns.replace(no, proposed)
          const t = (s: string) => s.split('\n').map((l: string) => l.trimEnd()).join('\n')
          const ts = t(ns), to = t(no)
          if (ts.includes(to)) return ts.replace(to, proposed)
          return null
        }
        const merged = mergeIntoScript(scriptDraft, proposal.original_text, proposal.proposed_text)
        const newScript = merged ?? scriptDraft
        const applied = merged !== null
        if (applied) {
          await fetch(`/api/episodes?id=${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ script: newScript }),
          })
          setScriptDraft(newScript)
          setEpisode(prev => prev ? { ...prev, script: newScript } : prev)
        }
        await fetch(`/api/script-proposals?id=${proposal.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'approved', final_text: proposal.proposed_text }),
        })
        setEpisodeProposals(prev => prev.map(p => p.id === proposal.id ? { ...p, status: 'approved', change_type: null } : p))
        if (applied && proposal.proposed_text) {
          setNuppaHighlights(prev => [...prev, proposal.proposed_text as string])
        }
        if (!applied) alert('El texto original no se encontró exactamente — aplica el cambio manualmente.')
      }
    } finally {
      setApprovingProposal(null)
    }
  }

  async function rejectProposalItem(proposal: ScriptProposal) {
    await fetch(`/api/script-proposals?id=${proposal.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'discarded' }),
    })
    setEpisodeProposals(prev => prev.map(p => p.id === proposal.id ? { ...p, status: 'discarded' } : p))
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

  async function extractStructureFromScript() {
    if (!episode?.script || extractingStructure) return
    setExtractingStructure(true)
    setExtractedStructure(null)

    const steps = ['Leyendo guión...', 'Identificando actos...', 'Extrayendo escenas...', 'Analizando ritmo...']
    let stepIdx = 0
    setExtractStep(steps[0])
    extractTimer.current = setInterval(() => {
      stepIdx = Math.min(stepIdx + 1, steps.length - 1)
      setExtractStep(steps[stepIdx])
    }, 5000)

    try {
      const res = await fetch(`/api/episodes/${id}/extract-structure`, { method: 'POST' })
      const data = await res.json()
      if (data.error) { setExtractStep('Error: ' + data.error) }
      else { setExtractedStructure(data) }
    } catch { setExtractStep('Error al contactar el servidor') }
    finally {
      if (extractTimer.current) clearInterval(extractTimer.current)
      setExtractingStructure(false)
    }
  }

  async function applyExtractedStructure() {
    if (!episode || !extractedStructure || applyingStructure) return
    setApplyingStructure(true)

    const acts = [...episode.acts].sort((a, b) => a.act_number - b.act_number)
    const newScenes: Scene[] = []

    for (const extractedAct of extractedStructure.acts) {
      const dbAct = acts.find(a => a.act_number === extractedAct.act_number)
      if (!dbAct) continue

      // Patch act title + goal (only if empty or not set)
      if (!dbAct.title || !dbAct.goal) {
        await fetch(`/api/acts?id=${dbAct.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: extractedAct.title, goal: extractedAct.goal }),
        })
      }

      // Add only scenes not already present (match by title, case-insensitive)
      const existingTitles = new Set(
        episode.scenes
          .filter(s => s.act_id === dbAct.id)
          .map(s => (s.title ?? '').trim().toLowerCase())
      )
      for (const sc of extractedAct.scenes) {
        if (existingTitles.has(sc.title.trim().toLowerCase())) continue
        const res = await fetch('/api/scenes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ act_id: dbAct.id, episode_id: id, title: sc.title, description: sc.description }),
        })
        const scene = await res.json()
        if (scene.id) {
          await fetch(`/api/scenes?id=${scene.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ location_name: sc.location, duration_est: sc.duration_est, mood: sc.mood }),
          })
          newScenes.push({ ...scene, location_name: sc.location, duration_est: sc.duration_est, mood: sc.mood })
        }
      }
    }

    // Update local state — add to existing scenes
    setEpisode(prev => prev ? {
      ...prev,
      scenes: [...prev.scenes, ...newScenes],
      acts: prev.acts.map(a => {
        const ext = extractedStructure.acts.find(ea => ea.act_number === a.act_number)
        if (!ext) return a
        return { ...a, title: a.title || ext.title, goal: a.goal || ext.goal }
      }),
    } : prev)

    setExtractedStructure(null)
    setApplyingStructure(false)
    setMode('structure')
  }

  async function applyAnalysisStructure() {
    if (!episode || !currentAnalysis?.structure || applyingStructure) return
    setApplyingStructure(true)
    const structure = currentAnalysis.structure
    const acts = [...episode.acts].sort((a, b) => a.act_number - b.act_number)
    const newScenes: Scene[] = []

    for (const analysisAct of structure.acts) {
      const dbAct = acts.find(a => a.act_number === analysisAct.act_number)
      if (!dbAct) continue
      if (!dbAct.title || !dbAct.goal) {
        await fetch(`/api/acts?id=${dbAct.id}`, {
          method: 'PATCH', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: analysisAct.title, goal: analysisAct.goal }),
        })
      }
      const existingTitles = new Set(
        episode.scenes.filter(s => s.act_id === dbAct.id).map(s => (s.title ?? '').trim().toLowerCase())
      )
      for (const sc of analysisAct.scenes) {
        if (existingTitles.has(sc.title.trim().toLowerCase())) continue
        const res = await fetch('/api/scenes', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ act_id: dbAct.id, episode_id: id, title: sc.title, description: sc.description }),
        })
        const scene = await res.json()
        if (scene.id) {
          await fetch(`/api/scenes?id=${scene.id}`, {
            method: 'PATCH', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ location_name: sc.location, duration_est: sc.duration_est, mood: sc.mood }),
          })
          newScenes.push({ ...scene, location_name: sc.location, duration_est: sc.duration_est, mood: sc.mood })
        }
      }
    }
    setEpisode(prev => prev ? {
      ...prev,
      scenes: [...prev.scenes, ...newScenes],
      acts: prev.acts.map(a => {
        const ext = structure.acts.find(ea => ea.act_number === a.act_number)
        return ext ? { ...a, title: a.title || ext.title, goal: a.goal || ext.goal } : a
      }),
    } : prev)
    setApplyingStructure(false)
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
      // 1. Send file directly to parse-doc (no Storage upload needed)
      const formData = new FormData()
      formData.append('file', file)
      const parseRes = await fetch('/api/parse-doc', { method: 'POST', body: formData })
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

      // 4b. Extract metadata in background (logline, sinopsis, tema, cold open, tag)
      fetch(`/api/episodes/${id}/extract-metadata`, { method: 'POST' })
        .then(r => r.ok ? r.json() : null)
        .then(meta => {
          if (meta) {
            setEpisode(prev => prev ? {
              ...prev,
              logline: meta.logline ?? prev.logline,
              synopsis: meta.synopsis ?? prev.synopsis,
              theme: meta.theme ?? prev.theme,
              cold_open: meta.cold_open ?? prev.cold_open,
              tag: meta.tag ?? prev.tag,
            } : prev)
          }
        })
        .catch(() => {})

      // 5. Full editorial analysis (structure + scoring + findings) — show in Estructura tab
      setMode('structure')
      setAnalyzingFull(true)
      setAnalyzeFullError('')
      try {
        const res = await fetch(`/api/episodes/${id}/analyze-full`, { method: 'POST' })
        const data = await res.json()
        if (res.ok) {
          setCurrentAnalysis({
            analysis_id: data.analysis_id,
            script_version_id: data.script_version_id,
            overall_score: data.scoring.overall,
            verdict: data.scoring.verdict,
            is_current: true,
            created_at: new Date().toISOString(),
            categories: data.scoring.categories,
            findings_count: data.findings_count,
            pending_count: data.findings_count,
            structure: data.structure,
          })
        } else {
          setAnalyzeFullError(data.error ?? 'Error en el análisis')
        }
      } catch {
        setAnalyzeFullError('Error al conectar con el servidor')
      } finally {
        setAnalyzingFull(false)
      }

      // 6. Asset gap analysis in background (for Producción tab)
      fetch(`/api/episodes/${id}/analyze-script`, { method: 'POST' })
        .then(r => r.ok ? r.json() : null)
        .then(data => {
          if (data) {
            setScriptGaps(data.gaps ?? [])
            setCanonIssues(data.canon_issues ?? [])
            setAnalysisSummary(data.summary ?? '')
          }
        })
        .catch(() => {})
    } catch (e) {
      alert(`Error al importar: ${e instanceof Error ? e.message : String(e)}`)
    } finally {
      setImportingDoc(false)
      if (scriptFileRef.current) scriptFileRef.current.value = ''
    }
  }

  async function uploadHeroImage(file: File) {
    if (heroUploading) return
    setHeroUploading(true)
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = async () => {
      const MAX = 1920
      let { width, height } = img
      if (width > MAX || height > MAX) {
        const r = Math.min(MAX / width, MAX / height)
        width = Math.round(width * r); height = Math.round(height * r)
      }
      const canvas = document.createElement('canvas')
      canvas.width = width; canvas.height = height
      canvas.getContext('2d')!.drawImage(img, 0, 0, width, height)
      URL.revokeObjectURL(url)
      const b64 = canvas.toDataURL('image/jpeg', 0.88).split(',')[1]
      try {
        const res = await fetch(`/api/episodes/${id}/hero-image`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ b64, mimeType: 'image/jpeg' }),
        })
        const data = await res.json()
        if (data.hero_image_path) {
          setEpisode(prev => prev ? { ...prev, hero_image_path: data.hero_image_path } : prev)
        }
      } catch { /* ignore */ } finally { setHeroUploading(false) }
    }
    img.onerror = () => { URL.revokeObjectURL(url); setHeroUploading(false) }
    img.src = url
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

  async function resetGap(gap: AssetGap) {
    if (gap.id) {
      await fetch(`/api/episodes/${id}/analyze-script`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gap_id: gap.id, status: 'pending' }),
      }).catch(() => {})
    }
    setScriptGaps(prev => prev.map(g =>
      g.entity_name === gap.entity_name && g.view_type === gap.view_type
        ? { ...g, status: 'pending' }
        : g
    ))
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
    setAiPanelOpen(true)
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

  // Classify each line of the script for typography
  function classifyScriptLine(line: string): 'scene-header' | 'section-label' | 'meta-info' | 'dialogue' | 'stage-direction' | 'blank' | 'title' | 'action' {
    const t = line.trim()
    if (!t) return 'blank'
    if (/^(LOS PRODIGIOS|EPISODIO\s+\d+|GUION LITERARIO)/i.test(t)) return 'title'
    if (/^ESCENA\s+\d+/i.test(t)) return 'scene-header'
    if (/^(LOCACI[OÓ]N\s*\/\s*MOMENTO|DURACI[OÓ]N\s*[··]\s*PERSONAJES|ACCI[OÓ]N\s*\/\s*IMAGEN|DI[ÁA]LOGOS|SONIDO\s*\/\s*M[ÚU]SICA|CONTINUIDAD\s+POR\s+VALIDAR)/i.test(t)) return 'section-label'
    if (/^(INT\.|EXT\.)/i.test(t)) return 'meta-info'
    if (/^\d+:\d+\s*[··]/.test(t)) return 'meta-info'
    if (/^Convenciones\s+para\s+producci/i.test(t)) return 'section-label'
    if (/^\[.*\]$/.test(t)) return 'stage-direction'
    if (/^[A-ZÁÉÍÓÚÑÜ][A-ZÁÉÍÓÚÑÜ\s]{1,}:\s/.test(t)) return 'dialogue'
    return 'action'
  }

  // Extract scene list from script text for the index
  function extractSceneIndex(script: string): { id: string; label: string; lineIndex: number }[] {
    return script.split('\n').reduce((acc, line, i) => {
      if (/^ESCENA\s+\d+/i.test(line.trim())) {
        acc.push({ id: `script-line-${i}`, label: line.trim(), lineIndex: i })
      }
      return acc
    }, [] as { id: string; label: string; lineIndex: number }[])
  }

  // Render a block of script text with typography hierarchy
  function renderStyledScriptText(text: string, keyPrefix: string, highlights?: string[]) {
    const lines = text.split('\n')

    // Pre-compute set of trimmed lines that belong to a NUPPA highlight
    const highlightedLines = new Set<string>()
    if (highlights && highlights.length > 0) {
      for (const h of highlights) {
        h.split('\n').forEach(hl => {
          const t = hl.trim()
          if (t.length >= 15) highlightedLines.add(t)
        })
      }
    }

    return lines.map((line, i) => {
      const type = classifyScriptLine(line)
      const lineId = `${keyPrefix}-line-${i}`
      const trimmed = line.trim()
      const isNuppa = highlightedLines.has(trimmed)
      const nuppaStyle: React.CSSProperties = isNuppa
        ? { borderLeft: '2px solid rgba(78,205,196,0.5)', paddingLeft: '8px', marginLeft: '-10px', background: 'rgba(78,205,196,0.04)' }
        : {}

      if (type === 'blank') return <div key={lineId} id={lineId} style={{ height: '0.6em' }} />

      if (type === 'scene-header') return (
        <div key={lineId} id={lineId} style={{ fontFamily: 'Bebas Neue, Impact, sans-serif', fontSize: '1rem', letterSpacing: '0.12em', color: isNuppa ? '#4ECDC4' : '#F0EBE1', marginTop: '2em', marginBottom: '0.2em', paddingBottom: '0.3em', borderBottom: '1px solid rgba(240,235,225,0.1)', ...nuppaStyle }}>
          {trimmed}
        </div>
      )

      if (type === 'section-label') return (
        <div key={lineId} id={lineId} style={{ fontSize: '0.6rem', letterSpacing: '0.18em', color: isNuppa ? 'rgba(78,205,196,0.6)' : 'rgba(240,235,225,0.3)', fontWeight: 700, textTransform: 'uppercase' as const, marginTop: '0.8em', marginBottom: '0.1em', ...nuppaStyle }}>
          {trimmed}
        </div>
      )

      if (type === 'meta-info') return (
        <div key={lineId} id={lineId} style={{ fontSize: '0.78rem', color: isNuppa ? 'rgba(78,205,196,0.8)' : 'rgba(240,235,225,0.55)', fontStyle: 'italic', fontFamily: 'Courier New, monospace', lineHeight: 1.5, ...nuppaStyle }}>
          {trimmed}
        </div>
      )

      if (type === 'stage-direction') return (
        <div key={lineId} id={lineId} style={{ fontSize: '0.78rem', color: isNuppa ? 'rgba(78,205,196,0.7)' : 'rgba(240,235,225,0.35)', fontStyle: 'italic', fontFamily: 'Courier New, monospace', lineHeight: 1.6, paddingLeft: isNuppa ? '8px' : '1em', ...nuppaStyle }}>
          {trimmed}
        </div>
      )

      if (type === 'title') return (
        <div key={lineId} id={lineId} style={{ fontSize: '0.7rem', letterSpacing: '0.14em', color: isNuppa ? 'rgba(78,205,196,0.7)' : 'rgba(240,235,225,0.4)', fontWeight: 600, marginBottom: '0.2em', ...nuppaStyle }}>
          {trimmed}
        </div>
      )

      if (type === 'dialogue') {
        const colonIdx = trimmed.indexOf(':')
        const speaker = trimmed.slice(0, colonIdx)
        const speech = trimmed.slice(colonIdx + 1)
        return (
          <div key={lineId} id={lineId} style={{ fontSize: '0.82rem', fontFamily: 'Courier New, monospace', lineHeight: 1.7, color: isNuppa ? '#4ECDC4' : 'rgba(240,235,225,0.9)', ...nuppaStyle }}>
            <span style={{ color: isNuppa ? '#4ECDC4' : '#9B6FD4', fontWeight: 700, letterSpacing: '0.04em' }}>{speaker}</span>
            <span style={{ color: isNuppa ? 'rgba(78,205,196,0.5)' : 'rgba(240,235,225,0.5)' }}>:</span>
            <span>{speech}</span>
          </div>
        )
      }

      // action
      return (
        <div key={lineId} id={lineId} style={{ fontSize: '0.82rem', fontFamily: 'Courier New, monospace', color: isNuppa ? '#4ECDC4' : 'rgba(240,235,225,0.7)', lineHeight: 1.7, ...nuppaStyle }}>
          {line}
        </div>
      )
    })
  }

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
            { key: 'overview',   label: 'Datos',        tutorialAttr: 'episode-overview' },
            { key: 'script',     label: 'Guión',        tutorialAttr: 'episode-script-tab' },
            { key: 'structure',  label: 'Estructura',   tutorialAttr: 'episode-structure-tab' },
            { key: 'produccion', label: 'Producción',   tutorialAttr: 'episode-produccion-tab' },
            { key: 'motor',      label: 'Motor NUPPA',  tutorialAttr: 'episode-motor-tab' },
          ].map(tab => {
            const dot = tab.key === 'script' ? (scriptDraft.trim().length > 50 ? '#4ECDC4' : null)
              : tab.key === 'structure' ? (episode.scenes.length > 0 ? '#4ECDC4' : null)
              : tab.key === 'produccion' ? (scriptGaps.length > 0 || canonIssues.length > 0 ? (canonIssues.some(i => i.severity === 'error') ? '#D4256A' : '#F5A52A') : null)
              : tab.key === 'motor' ? (currentAnalysis ? '#DFF818' : null)
              : null
            return (
              <button
                key={tab.key}
                data-tutorial={tab.tutorialAttr}
                onClick={() => setMode(tab.key as typeof mode)}
                style={{ padding: '4px 10px', background: mode === tab.key ? 'rgba(212,37,106,0.2)' : 'transparent', border: 'none', borderRadius: '2px', color: mode === tab.key ? '#D4256A' : 'rgba(240,235,225,0.4)', fontSize: '0.75rem', cursor: 'pointer', fontFamily: 'IBM Plex Sans, sans-serif', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '5px' }}
              >
                {tab.label}
                {dot && <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: dot, flexShrink: 0 }} />}
              </button>
            )
          })}
        </div>

        {/* AI panel toggle */}
        <button
          onClick={() => setAiPanelOpen(o => !o)}
          style={{ padding: '4px 10px', background: aiPanelOpen ? 'rgba(78,205,196,0.15)' : 'rgba(255,255,255,0.04)', border: `1px solid ${aiPanelOpen ? 'rgba(78,205,196,0.4)' : 'rgba(255,255,255,0.08)'}`, borderRadius: '3px', color: aiPanelOpen ? '#4ECDC4' : 'rgba(240,235,225,0.35)', fontSize: '0.75rem', cursor: 'pointer', fontFamily: 'IBM Plex Sans, sans-serif', flexShrink: 0, display: 'flex', alignItems: 'center', gap: '5px' }}
        >
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.2"/><path d="M8 7v4M8 5.5v.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>
          AI
          {aiMessages.length > 0 && <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#4ECDC4', flexShrink: 0 }} />}
        </button>

        {savedMsg && <span style={{ fontSize: '0.7rem', color: '#4ECDC4', flexShrink: 0 }}>✓ Guardado</span>}
      </div>

      {/* ── MAIN BODY ──────────────────────────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>

        {/* ── LEFT PANEL ─────────────────────────────────────────────── */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', minWidth: 0 }}>

          {/* COMPACT HERO BANNER — shown in script / structure / produccion tabs */}
          {(mode === 'script' || mode === 'structure' || mode === 'produccion') && episode?.hero_image_path && (
            <div style={{ margin: '-1.5rem -1.5rem 1.5rem', height: 90, position: 'relative', overflow: 'hidden' }}>
              <img src={storageUrl(episode.hero_image_path) ?? ''} alt=""
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.55 }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(8,6,15,0.92) 0%, rgba(8,6,15,0.25) 100%)' }} />
              <div style={{ position: 'absolute', bottom: 12, left: 20, display: 'flex', alignItems: 'baseline', gap: 10 }}>
                <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.58rem', letterSpacing: '0.18em', color: 'rgba(240,235,225,0.42)', textTransform: 'uppercase' }}>
                  T{episode.season} · E{String(episode.episode_number).padStart(2, '0')}
                </span>
                <span style={{ fontFamily: 'Bebas Neue, Impact, sans-serif', fontSize: '1.5rem', color: 'rgba(240,235,225,0.88)', letterSpacing: '0.04em', lineHeight: 1 }}>
                  {episode.title || 'Sin título'}
                </span>
              </div>
            </div>
          )}

          {/* OVERVIEW MODE */}
          {mode === 'overview' && (() => {
            const scoreColor = (s: number) => s >= 4 ? '#4ECDC4' : s >= 3 ? '#F5A52A' : '#D4256A'
            const scoreBg = (s: number) => s >= 4 ? 'rgba(78,205,196,0.07)' : s >= 3 ? 'rgba(245,165,42,0.07)' : 'rgba(212,37,106,0.07)'
            const scoreBorder = (s: number) => s >= 4 ? 'rgba(78,205,196,0.22)' : s >= 3 ? 'rgba(245,165,42,0.2)' : 'rgba(212,37,106,0.2)'
            const C28 = 2 * Math.PI * 28

            const analysisActs = currentAnalysis?.structure?.acts ?? []
            const allScenes = analysisActs.flatMap(a => a.scenes)
            const totalScenes = currentAnalysis?.structure?.total_scenes ?? allScenes.length

            const charMap: Record<string, number> = {}
            allScenes.forEach(sc => (Array.isArray(sc.characters) ? sc.characters : []).forEach(ch => { if (ch) charMap[ch] = (charMap[ch] ?? 0) + 1 }))
            const chars = Object.entries(charMap).sort((a, b) => b[1] - a[1])

            const locMap: Record<string, number> = {}
            allScenes.forEach(sc => { if (sc.location) locMap[sc.location] = (locMap[sc.location] ?? 0) + 1 })
            const locs = Object.entries(locMap).sort((a, b) => b[1] - a[1])

            const totalDurMins = allScenes.reduce((sum, s) => sum + (s.duration_est ?? 0), 0)
              || Math.max(1, Math.round(scriptDraft.length / 1500))
            const scriptLines = scriptDraft.trim().length > 50 ? scriptDraft.split('\n').length : 0

            const CHAR_COLORS = ['#4ECDC4', '#9B6FD4', '#F5A52A', '#4A8FE8', '#D4256A', '#66BB6A', '#FF8A65', '#AB47BC']
            const contErrors = canonIssues.filter(i => i.severity === 'error')
            const contWarnings = canonIssues.filter(i => i.severity === 'warning')

            const secLabel = (text: string) => (
              <div style={{ fontFamily: 'Bebas Neue, Impact, sans-serif', fontSize: '1rem', letterSpacing: '0.16em', color: 'rgba(240,235,225,0.5)', display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1.25rem' }}>
                {text} <div style={{ flex: 1, height: 1, background: 'rgba(240,235,225,0.07)' }} />
              </div>
            )

            return (
              <div style={{ margin: '-1.5rem', paddingBottom: '2rem' }}>

                {/* ── HERO IMAGE ── */}
                <input ref={heroFileRef} type="file" accept="image/*" style={{ display: 'none' }}
                  onChange={e => { const f = e.target.files?.[0]; if (f) uploadHeroImage(f) }} />
                <div style={{ width: '100%', height: 200, background: episode.hero_image_path ? 'transparent' : '#0D0920', borderBottom: '1px solid rgba(240,235,225,0.05)', position: 'relative', overflow: 'hidden' }}>
                  {episode.hero_image_path && (
                    <img src={storageUrl(episode.hero_image_path) ?? ''} alt=""
                      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                  )}
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(8,6,15,0.85) 0%, rgba(8,6,15,0.3) 60%, transparent 100%)' }} />
                  {!episode.hero_image_path && (
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                      <div style={{ opacity: 0.07 }}>
                        <svg width="56" height="56" viewBox="0 0 64 64" fill="none"><rect x="4" y="12" width="56" height="40" rx="4" stroke="white" strokeWidth="2"/><circle cx="22" cy="26" r="5" stroke="white" strokeWidth="2"/><path d="M4 40l14-12 10 10 10-8 22 18" stroke="white" strokeWidth="2" strokeLinejoin="round"/></svg>
                      </div>
                    </div>
                  )}
                  <button onClick={() => heroFileRef.current?.click()} disabled={heroUploading}
                    style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(8,6,15,0.7)', border: '1px solid rgba(240,235,225,0.14)', borderRadius: 4, color: 'rgba(240,235,225,0.55)', cursor: heroUploading ? 'not-allowed' : 'pointer', padding: '5px 12px', display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.62rem', fontFamily: 'IBM Plex Sans, sans-serif', backdropFilter: 'blur(8px)', letterSpacing: '0.1em', fontWeight: 700, textTransform: 'uppercase' }}>
                    {heroUploading
                      ? <svg width="12" height="12" viewBox="0 0 32 32" style={{ animation: 'spin 1s linear infinite' }}><circle cx="16" cy="16" r="12" stroke="currentColor" strokeWidth="3" fill="none" opacity=".3"/><path d="M16 4 A12 12 0 0 1 28 16" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round"/></svg>
                      : <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M2 11v2a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/><path d="M8 3v7M5 6l3-3 3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    }
                    {episode.hero_image_path ? '↑ Cambiar imagen' : '↑ Subir imagen'}
                  </button>
                </div>

                {/* ── IDENTITY ── */}
                <div style={{ padding: '2.5rem 2rem 2rem', borderBottom: '1px solid rgba(240,235,225,0.05)', display: 'grid', gridTemplateColumns: '1fr auto', gap: '3rem', alignItems: 'end' }}>
                  <div>
                    <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.72rem', letterSpacing: '0.18em', color: 'rgba(240,235,225,0.48)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                      Temporada {episode.season} · Episodio {String(episode.episode_number).padStart(2, '0')}
                    </div>
                    <div style={{ fontFamily: 'Bebas Neue, Impact, sans-serif', fontSize: '5rem', letterSpacing: '0.03em', lineHeight: 0.88, color: '#F0EBE1', marginBottom: '1.5rem' }}>
                      {episode.title || <span style={{ opacity: 0.25 }}>Sin título</span>}
                    </div>
                    <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.58rem', letterSpacing: '0.22em', fontWeight: 600, color: 'rgba(212,37,106,0.65)', textTransform: 'uppercase', marginBottom: 6 }}>Logline</div>
                    {episode.logline ? (
                      <div style={{ fontSize: '1.15rem', fontWeight: 300, fontStyle: 'italic', color: 'rgba(240,235,225,0.82)', lineHeight: 1.6, maxWidth: 680, borderTop: '1px solid rgba(212,37,106,0.2)', paddingTop: '1rem' }}>
                        {episode.logline}
                      </div>
                    ) : (
                      <textarea
                        key={`${episode.id}-logline`}
                        defaultValue=""
                        placeholder="Una oración que resume el conflicto central..."
                        rows={2}
                        onBlur={e => saveField('logline', e.target.value)}
                        style={{ ...INPUT, fontSize: '1rem', fontStyle: 'italic', background: 'transparent', maxWidth: 680, lineHeight: 1.6, border: 'none', borderTop: '1px solid rgba(212,37,106,0.2)', borderRadius: 0, padding: '1rem 0 0' }}
                      />
                    )}
                  </div>
                  {currentAnalysis && (
                    <div style={{ textAlign: 'right', flexShrink: 0, cursor: 'pointer' }} onClick={() => setMode('structure')}>
                      <div style={{ fontSize: '0.58rem', letterSpacing: '0.2em', fontWeight: 700, color: 'rgba(212,37,106,0.6)', textTransform: 'uppercase', marginBottom: 6 }}>Score NUPPA</div>
                      <div style={{ fontFamily: 'Bebas Neue, Impact, sans-serif', fontSize: '7rem', lineHeight: 0.85, letterSpacing: '-0.02em', color: '#D4256A' }}>
                        {currentAnalysis.overall_score}
                      </div>
                      <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.72rem', color: 'rgba(212,37,106,0.55)', letterSpacing: '0.08em' }}>/ 5</div>
                      {currentAnalysis.verdict && (
                        <div style={{ fontSize: '0.74rem', color: 'rgba(240,235,225,0.58)', maxWidth: 180, textAlign: 'right', lineHeight: 1.55, marginTop: 8 }}>
                          {currentAnalysis.verdict}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* ── 3 STATS ── */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', borderBottom: '1px solid rgba(240,235,225,0.05)' }}>
                  <div style={{ padding: '1.75rem 2rem', borderRight: '1px solid rgba(240,235,225,0.05)', cursor: 'pointer' }}
                    onClick={() => setMode('script')}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(240,235,225,0.02)'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}>
                    <div style={{ fontFamily: 'Bebas Neue, Impact, sans-serif', fontSize: '4rem', lineHeight: 0.9, color: '#4ECDC4', marginBottom: 6 }}>{totalDurMins}</div>
                    <div style={{ fontSize: '0.72rem', letterSpacing: '0.12em', fontWeight: 700, color: 'rgba(240,235,225,0.52)', textTransform: 'uppercase' }}>Minutos estimados</div>
                    {scriptLines > 0 && <div style={{ fontSize: '0.74rem', color: 'rgba(240,235,225,0.48)', marginTop: 5 }}>{totalScenes > 0 ? `${totalScenes} escenas · ` : ''}{scriptLines} líneas</div>}
                    <div style={{ fontSize: '0.68rem', color: 'rgba(240,235,225,0.3)', marginTop: 10 }}>Ver guión completo →</div>
                  </div>
                  <div style={{ padding: '1.75rem 2rem', borderRight: '1px solid rgba(240,235,225,0.05)', cursor: 'pointer' }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(240,235,225,0.02)'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}>
                    <div style={{ fontFamily: 'Bebas Neue, Impact, sans-serif', fontSize: '4rem', lineHeight: 0.9, color: '#9B6FD4', marginBottom: 6 }}>{chars.length || '—'}</div>
                    <div style={{ fontSize: '0.72rem', letterSpacing: '0.12em', fontWeight: 700, color: 'rgba(240,235,225,0.52)', textTransform: 'uppercase' }}>Personajes</div>
                    {chars.length > 0 && <div style={{ fontSize: '0.74rem', color: 'rgba(240,235,225,0.48)', marginTop: 5 }}>{chars.slice(0, 3).map(([n]) => n).join(', ')}{chars.length > 3 ? ` +${chars.length - 3}` : ''}</div>}
                    <div style={{ fontSize: '0.68rem', color: 'rgba(240,235,225,0.3)', marginTop: 10 }}>Ver fichas de personajes →</div>
                  </div>
                  <div style={{ padding: '1.75rem 2rem', cursor: 'pointer' }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(240,235,225,0.02)'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}>
                    <div style={{ fontFamily: 'Bebas Neue, Impact, sans-serif', fontSize: '4rem', lineHeight: 0.9, color: '#F5A52A', marginBottom: 6 }}>{locs.length || '—'}</div>
                    <div style={{ fontSize: '0.72rem', letterSpacing: '0.12em', fontWeight: 700, color: 'rgba(240,235,225,0.52)', textTransform: 'uppercase' }}>Locaciones</div>
                    {locs.length > 0 && <div style={{ fontSize: '0.74rem', color: 'rgba(240,235,225,0.48)', marginTop: 5 }}>{locs.slice(0, 2).map(([n]) => n).join(', ')}{locs.length > 2 ? ` +${locs.length - 2}` : ''}</div>}
                    <div style={{ fontSize: '0.68rem', color: 'rgba(240,235,225,0.3)', marginTop: 10 }}>Ver assets de locaciones →</div>
                  </div>
                </div>

                {/* ── STORYBOARD STRIP ── */}
                {analysisActs.length > 0 && (
                  <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid rgba(240,235,225,0.05)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1rem' }}>
                      <span style={{ fontFamily: 'Bebas Neue, Impact, sans-serif', fontSize: '1rem', letterSpacing: '0.14em', color: 'rgba(240,235,225,0.55)' }}>Arco narrativo</span>
                      <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.65rem', color: 'rgba(240,235,225,0.38)' }}>{analysisActs.length} actos · {totalScenes} escenas</span>
                      <div style={{ flex: 1, height: 1, background: 'rgba(240,235,225,0.06)' }} />
                    </div>
                    <div style={{ display: 'flex', gap: 3, height: 76 }}>
                      {analysisActs.map((act, ai) => {
                        const bases = ['rgba(78,205,196,', 'rgba(155,111,212,', 'rgba(212,37,106,']
                        const base = bases[ai % 3]
                        return (
                          <React.Fragment key={act.act_number}>
                            <div style={{ writingMode: 'vertical-rl', fontFamily: 'Bebas Neue, Impact, sans-serif', fontSize: '0.58rem', letterSpacing: '0.14em', color: 'rgba(240,235,225,0.32)', padding: '0 7px', alignSelf: 'stretch', display: 'flex', alignItems: 'center', borderLeft: ai > 0 ? '1px solid rgba(240,235,225,0.06)' : 'none', flexShrink: 0 }}>
                              {act.title || `ACTO ${act.act_number}`}
                            </div>
                            {act.scenes.map((sc, si) => {
                              const opacity = Math.max(0.08, 0.22 - si * 0.02)
                              return (
                                <div key={sc.scene_number}
                                  style={{ flex: si === 0 ? 1.2 : 1, borderRadius: 3, background: `${base}${opacity})`, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '6px 7px', overflow: 'hidden', cursor: 'pointer', minWidth: 0, transition: 'flex 0.18s ease' }}
                                  onClick={() => setMode('script')}
                                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.flex = '2.5' }}
                                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.flex = si === 0 ? '1.2' : '1' }}>
                                  <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.46rem', color: 'rgba(255,255,255,0.52)', letterSpacing: '0.08em', marginBottom: 2 }}>ESC {sc.scene_number}</div>
                                  <div style={{ fontSize: '0.6rem', fontWeight: 600, color: 'rgba(255,255,255,0.85)', lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{sc.title}</div>
                                  <div style={{ fontSize: '0.48rem', color: 'rgba(255,255,255,0.48)', marginTop: 3 }}>Abrir →</div>
                                </div>
                              )
                            })}
                          </React.Fragment>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* ── LOWER 2 COLUMNS ── */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px' }}>

                  {/* LEFT COLUMN */}
                  <div style={{ padding: '2rem', borderRight: '1px solid rgba(240,235,225,0.05)', display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                    {/* Sinopsis */}
                    <div>
                      {secLabel('Sinopsis')}
                      {episode.synopsis ? (
                        <div style={{ fontSize: '0.92rem', color: 'rgba(240,235,225,0.72)', lineHeight: 1.85, cursor: 'text' }}
                          onClick={e => { const ta = e.currentTarget; const input = document.createElement('textarea'); input.value = episode.synopsis ?? ''; ta.replaceWith(input); input.focus() }}>
                          {episode.synopsis}
                        </div>
                      ) : (
                        <textarea key={`${episode.id}-synopsis`} defaultValue={episode.synopsis ?? ''} placeholder="Resumen narrativo del episodio..." rows={4} onBlur={e => saveField('synopsis', e.target.value)} style={{ ...INPUT, lineHeight: 1.85, fontSize: '0.92rem' }} />
                      )}
                    </div>

                    {/* Tema */}
                    <div>
                      {secLabel('Tema central')}
                      <div style={{ padding: '1.25rem', background: 'rgba(155,111,212,0.07)', border: '1px solid rgba(155,111,212,0.15)', borderRadius: 6 }}>
                        <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.56rem', letterSpacing: '0.2em', color: 'rgba(155,111,212,0.65)', textTransform: 'uppercase', fontWeight: 600, marginBottom: 6 }}>◈ Tema</div>
                        <textarea key={`${episode.id}-theme`} defaultValue={episode.theme ?? ''} placeholder="El tema que explora este episodio..." rows={2} onBlur={e => saveField('theme', e.target.value)} style={{ ...INPUT, background: 'transparent', border: 'none', padding: 0, fontSize: '1rem', fontStyle: 'italic', color: '#9B6FD4', lineHeight: 1.5, resize: 'none', borderRadius: 0 }} />
                      </div>
                    </div>

                    {/* Bookends */}
                    <div>
                      {secLabel('Estructura dramática')}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div style={{ padding: '1.25rem', borderRadius: 6, border: '1px solid rgba(78,205,196,0.12)', position: 'relative' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.58rem', letterSpacing: '0.18em', fontWeight: 600, textTransform: 'uppercase', marginBottom: 8 }}>
                            <svg width="11" height="11" viewBox="0 0 16 16" fill="none"><polygon points="3,3 13,8 3,13" stroke="#4ECDC4" strokeWidth="1.5" strokeLinejoin="round"/></svg>
                            <span style={{ color: 'rgba(78,205,196,0.72)' }}>Cold Open</span>
                          </div>
                          <textarea key={`${episode.id}-cold_open`} defaultValue={episode.cold_open ?? ''} placeholder="Lo que ocurre antes de los créditos..." rows={4} onBlur={e => saveField('cold_open', e.target.value)} style={{ ...INPUT, background: 'transparent', border: 'none', padding: 0, lineHeight: 1.65, fontSize: '0.82rem', resize: 'none', borderRadius: 0, color: episode.cold_open ? 'rgba(240,235,225,0.65)' : undefined }} />
                        </div>
                        <div style={{ padding: '1.25rem', borderRadius: 6, border: '1px solid rgba(212,37,106,0.1)', position: 'relative' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.58rem', letterSpacing: '0.18em', fontWeight: 600, textTransform: 'uppercase', marginBottom: 8 }}>
                            <svg width="11" height="11" viewBox="0 0 16 16" fill="none"><rect x="3" y="3" width="10" height="10" rx="1" stroke="#D4256A" strokeWidth="1.5"/></svg>
                            <span style={{ color: 'rgba(212,37,106,0.65)' }}>Gancho final</span>
                          </div>
                          <textarea key={`${episode.id}-tag`} defaultValue={episode.tag ?? ''} placeholder="El cierre o gancho post-créditos..." rows={4} onBlur={e => saveField('tag', e.target.value)} style={{ ...INPUT, background: 'transparent', border: 'none', padding: 0, lineHeight: 1.65, fontSize: '0.82rem', resize: 'none', borderRadius: 0, color: episode.tag ? 'rgba(240,235,225,0.65)' : undefined }} />
                        </div>
                      </div>
                    </div>

                    {/* Score cards */}
                    {currentAnalysis && currentAnalysis.categories.length > 0 && (
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1rem' }}>
                          <div style={{ fontFamily: 'Bebas Neue, Impact, sans-serif', fontSize: '1rem', letterSpacing: '0.16em', color: 'rgba(240,235,225,0.5)' }}>Score por dimensión</div>
                          <div style={{ flex: 1, height: 1, background: 'rgba(240,235,225,0.07)' }} />
                          <span onClick={() => setMode('structure')} style={{ fontSize: '0.68rem', color: 'rgba(240,235,225,0.28)', cursor: 'pointer' }}>Ver análisis completo →</span>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${currentAnalysis.categories.length}, 1fr)`, gap: 10 }}>
                          {currentAnalysis.categories.map(cat => {
                            const fill = (cat.score / 5) * C28
                            const color = scoreColor(cat.score)
                            const pendingCount = cat.findings.filter(f => f.status === 'pending' || f.status === 'in_review').length
                            return (
                              <div key={cat.key} onClick={() => setMode('structure')}
                                style={{ borderRadius: 10, padding: '1rem 0.75rem 0.875rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', position: 'relative', background: `linear-gradient(135deg, ${scoreBg(cat.score)}, rgba(10,7,25,0.4))`, border: `1px solid ${scoreBorder(cat.score)}`, backdropFilter: 'blur(8px)', transition: 'filter 0.12s' }}
                                onMouseEnter={e => (e.currentTarget as HTMLElement).style.filter = 'brightness(1.12)'}
                                onMouseLeave={e => (e.currentTarget as HTMLElement).style.filter = 'brightness(1)'}>
                                {pendingCount > 0 && (
                                  <div style={{ position: 'absolute', top: 8, right: 8, width: 16, height: 16, borderRadius: '50%', background: '#D4256A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.52rem', fontWeight: 700, color: '#fff' }}>{pendingCount}</div>
                                )}
                                <svg width="70" height="70" viewBox="0 0 70 70">
                                  <circle cx="35" cy="35" r="28" fill="none" stroke="rgba(240,235,225,0.05)" strokeWidth="5"/>
                                  <circle cx="35" cy="35" r="28" fill="none" stroke={color} strokeWidth="5"
                                    strokeDasharray={`${fill} ${C28}`}
                                    strokeDashoffset={C28 * 0.25}
                                    strokeLinecap="round"
                                    style={{ filter: `drop-shadow(0 0 5px ${color}66)` }}
                                  />
                                  <text x="35" y="32" textAnchor="middle" dominantBaseline="central" fill={color} fontSize="18" fontWeight="700" fontFamily="Bebas Neue, Impact, sans-serif">{cat.score}</text>
                                  <text x="35" y="44" textAnchor="middle" dominantBaseline="central" fill="rgba(240,235,225,0.22)" fontSize="8" fontFamily="IBM Plex Sans, sans-serif">/5</text>
                                </svg>
                                <div style={{ fontFamily: 'Bebas Neue, Impact, sans-serif', fontSize: '0.78rem', letterSpacing: '0.1em', color: '#F0EBE1', textAlign: 'center', lineHeight: 1.2 }}>{cat.label}</div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )}

                    {/* Continuidad + Locaciones */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>

                      {/* Continuidad */}
                      <div>
                        {secLabel('Continuidad')}
                        {canonIssues.length === 0 ? (
                          <div style={{ fontSize: '0.78rem', color: 'rgba(240,235,225,0.28)', fontStyle: 'italic' }}>Sin issues detectados.</div>
                        ) : (
                          <>
                            <div style={{ display: 'flex', gap: 8, marginBottom: '1rem' }}>
                              {contErrors.length > 0 && (
                                <div onClick={() => setMode('produccion')} style={{ flex: 1, borderRadius: 5, padding: 10, textAlign: 'center', background: 'rgba(212,37,106,0.09)', border: '1px solid rgba(212,37,106,0.18)', cursor: 'pointer' }}>
                                  <div style={{ fontFamily: 'Bebas Neue, Impact, sans-serif', fontSize: '2rem', lineHeight: 1, color: '#D4256A' }}>{contErrors.length}</div>
                                  <div style={{ fontSize: '0.58rem', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 700, marginTop: 3, color: 'rgba(212,37,106,0.6)' }}>Errores</div>
                                </div>
                              )}
                              {contWarnings.length > 0 && (
                                <div onClick={() => setMode('produccion')} style={{ flex: 1, borderRadius: 5, padding: 10, textAlign: 'center', background: 'rgba(245,165,42,0.07)', border: '1px solid rgba(245,165,42,0.15)', cursor: 'pointer' }}>
                                  <div style={{ fontFamily: 'Bebas Neue, Impact, sans-serif', fontSize: '2rem', lineHeight: 1, color: '#F5A52A' }}>{contWarnings.length}</div>
                                  <div style={{ fontSize: '0.58rem', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 700, marginTop: 3, color: 'rgba(245,165,42,0.6)' }}>Alertas</div>
                                </div>
                              )}
                            </div>
                            {canonIssues.slice(0, 4).map((issue, i) => (
                              <div key={i} onClick={() => setMode('produccion')} style={{ display: 'flex', gap: 8, padding: '8px 0', borderBottom: i < Math.min(3, canonIssues.length - 1) ? '1px solid rgba(240,235,225,0.05)' : 'none', cursor: 'pointer' }}>
                                <div style={{ width: 7, height: 7, borderRadius: '50%', flexShrink: 0, marginTop: 5, background: issue.severity === 'error' ? '#D4256A' : '#F5A52A', boxShadow: `0 0 5px ${issue.severity === 'error' ? 'rgba(212,37,106,0.5)' : 'rgba(245,165,42,0.4)'}` }} />
                                <div style={{ flex: 1 }}>
                                  <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'rgba(240,235,225,0.85)' }}>{issue.entity}</div>
                                  <div style={{ fontSize: '0.68rem', color: 'rgba(240,235,225,0.55)', marginTop: 2, lineHeight: 1.45 }}>{issue.issue}</div>
                                </div>
                              </div>
                            ))}
                          </>
                        )}
                      </div>

                      {/* Locaciones */}
                      <div>
                        {secLabel('Locaciones')}
                        {locs.length === 0 ? (
                          <div style={{ fontSize: '0.78rem', color: 'rgba(240,235,225,0.28)', fontStyle: 'italic' }}>Sin análisis disponible.</div>
                        ) : (
                          locs.map(([name, count], i) => (
                            <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px', borderRadius: 6, border: '1px solid transparent', cursor: 'pointer', transition: 'all 0.12s' }}
                              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(245,165,42,0.05)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(245,165,42,0.14)' }}
                              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.borderColor = 'transparent' }}>
                              <div style={{ width: 8, height: 8, borderRadius: 2, flexShrink: 0, background: `rgba(245,165,42,${Math.max(0.25, 1 - i * 0.2)})` }} />
                              <div style={{ flex: 1, fontSize: '0.85rem', fontWeight: 600, color: 'rgba(240,235,225,0.88)' }}>{name}</div>
                              <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.68rem', color: 'rgba(240,235,225,0.42)' }}>{count} esc.</div>
                              <div style={{ fontSize: '0.65rem', color: 'rgba(245,165,42,0.55)' }}>→</div>
                            </div>
                          ))
                        )}
                      </div>

                    </div>
                  </div>

                  {/* RIGHT COLUMN: PERSONAJES */}
                  <div style={{ background: '#0A0816', padding: '2rem' }}>
                    <div style={{ fontFamily: 'Bebas Neue, Impact, sans-serif', fontSize: '1rem', letterSpacing: '0.16em', color: 'rgba(240,235,225,0.5)', display: 'flex', alignItems: 'center', gap: 12, marginBottom: '0.75rem' }}>
                      Personajes <div style={{ flex: 1, height: 1, background: 'rgba(240,235,225,0.07)' }} />
                    </div>
                    {chars.length === 0 ? (
                      <div style={{ fontSize: '0.78rem', color: 'rgba(240,235,225,0.28)', fontStyle: 'italic', marginTop: 8 }}>Sin análisis de estructura disponible.</div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {chars.map(([name, sceneCount], i) => {
                          const color = CHAR_COLORS[i % CHAR_COLORS.length]
                          const initial = name.charAt(0).toUpperCase()
                          const onSegs = new Set<number>()
                          allScenes.forEach((sc, si) => { if (Array.isArray(sc.characters) && sc.characters.includes(name)) onSegs.add(si) })
                          const totalSegs = Math.min(Math.max(totalScenes, 14), 14)
                          return (
                            <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '11px 12px', borderRadius: 7, border: '1px solid transparent', cursor: 'pointer', transition: 'all 0.15s' }}
                              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(240,235,225,0.04)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(240,235,225,0.09)' }}
                              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.borderColor = 'transparent' }}>
                              <div style={{ width: 42, height: 42, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Bebas Neue, Impact, sans-serif', fontSize: '1.2rem', flexShrink: 0, background: `${color}18`, border: `1px solid ${color}28`, color }}>
                                {initial}
                              </div>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontSize: '0.92rem', fontWeight: 700, color: 'rgba(240,235,225,0.92)' }}>{name}</div>
                                <div style={{ display: 'flex', gap: 2, marginTop: 6 }}>
                                  {Array.from({ length: totalSegs }, (_, si) => (
                                    <div key={si} style={{ height: 3, borderRadius: 1, flex: 1, background: onSegs.has(si) ? color : 'rgba(240,235,225,0.08)', opacity: onSegs.has(si) ? 0.6 : 1 }} />
                                  ))}
                                </div>
                              </div>
                              <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.68rem', color: 'rgba(240,235,225,0.42)', flexShrink: 0 }}>{sceneCount} esc.</div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>

                </div>
              </div>
            )
          })()}

          {/* SCRIPT MODE */}
          {mode === 'script' && (
            <div>
              {/* STICKY CHIPS BAR */}
              {(() => {
                const pendingProposals = episodeProposals.filter(p => p.status === 'pending' || p.status === 'draft' || !p.status)
                if (pendingProposals.length === 0) return null
                return (
                  <div style={{ position: 'sticky', top: 0, zIndex: 20, background: 'rgba(12,8,26,0.92)', backdropFilter: 'blur(8px)', borderBottom: '1px solid rgba(155,111,212,0.15)', padding: '8px 0 8px', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{ fontFamily: 'Bebas Neue, Impact, sans-serif', fontSize: '0.75rem', letterSpacing: '0.12em', color: 'rgba(155,111,212,0.6)', flexShrink: 0 }}>
                      ✦ NUPPA
                    </span>
                    {pendingProposals.map((proposal, i) => {
                      const isAwaiting = proposal.final_text?.startsWith('__approved_by__')
                      const findingTitle = currentAnalysis?.categories?.flatMap(c => c.findings)?.find(f => f.id === proposal.finding_id)?.title
                      const label = [proposal.location_hint, findingTitle ? findingTitle.replace(/^[^:]+:\s*/, '').slice(0, 30) : null].filter(Boolean).join(' · ')
                      return (
                        <button
                          key={proposal.id}
                          onClick={() => document.getElementById(`proposal-${proposal.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
                          style={{ padding: '3px 10px', background: isAwaiting ? 'rgba(245,165,42,0.12)' : 'rgba(155,111,212,0.1)', border: `1px solid ${isAwaiting ? 'rgba(245,165,42,0.35)' : 'rgba(155,111,212,0.3)'}`, borderRadius: '20px', color: isAwaiting ? '#F5A52A' : '#9B6FD4', fontSize: '0.68rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'IBM Plex Sans, sans-serif', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '5px' }}
                        >
                          {isAwaiting && <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#F5A52A', flexShrink: 0 }} />}
                          {label || `Propuesta ${i + 1}`}
                          {isAwaiting && <span style={{ fontSize: '0.6rem', opacity: 0.7 }}>· 2ª aprobación</span>}
                        </button>
                      )
                    })}
                  </div>
                )
              })()}
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
                    onClick={() => setScriptEditMode(m => !m)}
                    style={{ padding: '4px 10px', background: scriptEditMode ? 'rgba(240,235,225,0.08)' : 'transparent', border: '1px solid rgba(240,235,225,0.12)', borderRadius: '3px', color: 'rgba(240,235,225,0.4)', fontSize: '0.7rem', cursor: 'pointer', fontFamily: 'IBM Plex Sans, sans-serif' }}
                  >
                    {scriptEditMode ? '✓ Vista' : '✎ Editar'}
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
              {(!scriptDraft || scriptDraft.trim().length < 100) && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem 2rem', gap: '1.5rem', textAlign: 'center' }}>
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" style={{ color: 'rgba(240,235,225,0.1)' }}><rect x="8" y="6" width="32" height="36" rx="3" stroke="currentColor" strokeWidth="2"/><path d="M16 16h16M16 22h16M16 28h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
                  <div>
                    <div style={{ fontFamily: 'Bebas Neue, Impact, sans-serif', fontSize: '1.25rem', letterSpacing: '0.08em', color: 'rgba(240,235,225,0.3)', marginBottom: '6px' }}>Sin guión aún</div>
                    <div style={{ fontSize: '0.8rem', color: 'rgba(240,235,225,0.2)', lineHeight: 1.6 }}>Importa un Word o empieza a escribir directamente</div>
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      onClick={() => scriptFileRef.current?.click()}
                      disabled={importingDoc}
                      style={{ padding: '10px 20px', background: 'rgba(78,205,196,0.12)', border: '1px solid rgba(78,205,196,0.35)', borderRadius: '4px', color: '#4ECDC4', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'IBM Plex Sans, sans-serif', display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M8 3v8M5 6l3-3 3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/><path d="M3 13h10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>
                      {importingDoc ? 'Importando...' : 'Importar Word'}
                    </button>
                    <button
                      onClick={() => document.querySelector<HTMLTextAreaElement>('textarea[spellcheck="false"]')?.focus()}
                      style={{ padding: '10px 20px', background: 'rgba(245,165,42,0.08)', border: '1px solid rgba(245,165,42,0.25)', borderRadius: '4px', color: 'rgba(245,165,42,0.7)', fontSize: '0.875rem', cursor: 'pointer', fontFamily: 'IBM Plex Sans, sans-serif' }}
                    >
                      Escribir desde cero
                    </button>
                  </div>
                </div>
              )}
              {(() => {
                const pendingProposals = episodeProposals.filter(p => p.status === 'pending' || p.status === 'draft' || !p.status)
                const sceneIndex = extractSceneIndex(scriptDraft)

                // Two-column layout: scene index (left) + script (right)
                return (
                  <div style={{ display: 'grid', gridTemplateColumns: '155px 1fr', gap: '1.5rem', alignItems: 'start' }}>
                    {/* SCENE INDEX SIDEBAR — LEFT */}
                    <div style={{ position: 'sticky', top: '60px', maxHeight: '85vh', overflowY: 'auto', borderRight: '1px solid rgba(240,235,225,0.06)', paddingRight: '1rem' }}>
                      <div style={{ fontSize: '0.58rem', letterSpacing: '0.14em', color: 'rgba(240,235,225,0.25)', fontWeight: 700, marginBottom: '8px', paddingBottom: '6px', borderBottom: '1px solid rgba(240,235,225,0.06)' }}>
                        ESCENAS · {sceneIndex.length}
                      </div>
                      {sceneIndex.length === 0 && (
                        <div style={{ fontSize: '0.65rem', color: 'rgba(240,235,225,0.2)', lineHeight: 1.5 }}>
                          No se detectaron escenas.<br/>Usa el formato ESCENA XX
                        </div>
                      )}
                      {sceneIndex.map((scene, i) => {
                        const sceneNum = scene.label.match(/\d+/)?.[0]
                        const sceneTitle = scene.label.replace(/^ESCENA\s+\d+\s*[·—\-]?\s*/i, '')
                        return (
                          <button
                            key={i}
                            onClick={() => {
                              const el = document.getElementById(scene.id)
                              if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
                              else {
                                const allDivs = document.querySelectorAll('[id^="part-"],[id^="main-"]')
                                allDivs.forEach(d => {
                                  if (d.textContent?.startsWith(`ESCENA ${sceneNum}`)) d.scrollIntoView({ behavior: 'smooth', block: 'start' })
                                })
                              }
                            }}
                            style={{ display: 'block', width: '100%', textAlign: 'left', background: 'transparent', border: 'none', padding: '4px 0', cursor: 'pointer', marginBottom: '2px' }}
                          >
                            <span style={{ fontSize: '0.62rem', color: 'rgba(155,111,212,0.7)', fontWeight: 700, fontFamily: 'Bebas Neue, Impact, sans-serif', letterSpacing: '0.08em', display: 'block' }}>ESC {sceneNum}</span>
                            {sceneTitle && <span style={{ fontSize: '0.6rem', color: 'rgba(240,235,225,0.3)', fontFamily: 'IBM Plex Sans, sans-serif', lineHeight: 1.3, display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{sceneTitle}</span>}
                          </button>
                        )
                      })}
                    </div>
                    {/* SCRIPT CONTENT */}
                    <div>
                      {scriptEditMode ? (
                        <textarea
                          value={scriptDraft}
                          onChange={e => handleScriptChange(e.target.value)}
                          placeholder={`INT. CASA PRODIGIO — SALA COMÚN — DÍA\n\nMateo entra por la puerta trasera con la mochila al hombro. Nadie lo nota.\n\n\t\t\t\t\tSOFÍA\n\t\t\t(sin mirarle)\n\t\tLlegaste tarde otra vez.\n\n`}
                          style={{ ...SCRIPT_INPUT, minHeight: '80vh' }}
                          spellCheck={false}
                          autoFocus
                        />
                      ) : (
                        <div style={{ ...SCRIPT_INPUT, height: 'auto', minHeight: '60vh', overflow: 'visible', padding: '20px 24px', cursor: 'text' }} onClick={() => {}}>
                          {pendingProposals.length === 0 ? (
                            renderStyledScriptText(scriptDraft, 'main', nuppaHighlights)
                          ) : (() => {
                            // Build parts with inline proposal cards
                            const findScenePos = (script: string, hint: string | null) => {
                              if (!hint) return { idx: -1, len: 0 }
                              const scriptLines = script.split('\n')
                              const hintUpper = hint.toUpperCase().trim()
                              // Exact / substring match first
                              for (let li = 0; li < scriptLines.length; li++) {
                                const lineUpper = scriptLines[li].toUpperCase()
                                if (lineUpper.includes(hintUpper) || lineUpper.replace(/\s+/g, ' ').includes(hintUpper.replace(/\s+/g, ' '))) {
                                  const charPos = scriptLines.slice(0, li).reduce((sum, l) => sum + l.length + 1, 0)
                                  return { idx: charPos, len: scriptLines[li].length }
                                }
                              }
                              // Fallback: extract scene number from hint ("ESC 06" → 6) and match any ESCENA XX line
                              const numMatch = hintUpper.match(/\d+/)
                              if (numMatch) {
                                const targetNum = parseInt(numMatch[0])
                                for (let li = 0; li < scriptLines.length; li++) {
                                  const lt = scriptLines[li].toUpperCase().trim()
                                  if (/^ESCENA\s+\d+/.test(lt)) {
                                    const lNum = lt.match(/\d+/)
                                    if (lNum && parseInt(lNum[0]) === targetNum) {
                                      const charPos = scriptLines.slice(0, li).reduce((sum, l) => sum + l.length + 1, 0)
                                      return { idx: charPos, len: scriptLines[li].length }
                                    }
                                  }
                                }
                              }
                              return { idx: -1, len: 0 }
                            }

                            const withPos = [...pendingProposals]
                              .map(p => ({ proposal: p, ...findScenePos(scriptDraft, p.location_hint) }))
                              .sort((a, b) => a.idx - b.idx)

                            type Part = { type: 'text'; content: string } | { type: 'proposal'; proposal: ScriptProposal }
                            const parts: Part[] = []
                            let cursor = scriptDraft

                            for (const { proposal } of withPos) {
                              const { idx: relIdx, len: relLen } = findScenePos(cursor, proposal.location_hint)
                              if (relIdx === -1) continue
                              if (relIdx > 0) parts.push({ type: 'text', content: cursor.slice(0, relIdx) })
                              parts.push({ type: 'proposal', proposal })
                              cursor = cursor.slice(relIdx + relLen)
                            }
                            if (cursor) parts.push({ type: 'text', content: cursor })
                            const foundIds = new Set(parts.filter(p => p.type === 'proposal').map(p => (p as { type: 'proposal'; proposal: ScriptProposal }).proposal.id))
                            for (const { proposal } of withPos) {
                              if (!foundIds.has(proposal.id)) parts.push({ type: 'proposal', proposal })
                            }

                            return parts.map((part, i) => {
                              if (part.type === 'text') {
                                return <div key={i}>{renderStyledScriptText(part.content, `part-${i}`, nuppaHighlights)}</div>
                              }
                              const { proposal } = part
                              const isAwaiting = proposal.final_text?.startsWith('__approved_by__')
                              const firstApprover = isAwaiting ? proposal.final_text?.replace('__approved_by__', '') : null
                              return (
                                <div id={`proposal-${proposal.id}`} key={proposal.id} style={{ margin: '4px 0', borderLeft: `3px solid ${isAwaiting ? 'rgba(245,165,42,0.5)' : 'rgba(155,111,212,0.4)'}`, background: isAwaiting ? 'rgba(245,165,42,0.04)' : 'rgba(155,111,212,0.04)', borderRadius: '0 6px 6px 0' }}>
                                  <div style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${isAwaiting ? 'rgba(245,165,42,0.12)' : 'rgba(155,111,212,0.12)'}` }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                      <span style={{ fontSize: '0.68rem', fontWeight: 700, color: isAwaiting ? '#F5A52A' : '#9B6FD4', background: isAwaiting ? 'rgba(245,165,42,0.12)' : 'rgba(155,111,212,0.12)', borderRadius: '20px', padding: '2px 8px' }}>
                                        {proposal.location_hint ?? 'NUPPA'}
                                      </span>
                                      {isAwaiting && (
                                        <span style={{ fontSize: '0.66rem', color: 'rgba(245,165,42,0.7)' }}>
                                          ✓ {firstApprover?.split('@')[0]} aprobó · esperando 2ª aprobación
                                        </span>
                                      )}
                                    </div>
                                    <div style={{ display: 'flex', gap: '6px' }}>
                                      {!isAwaiting ? (
                                        <button onClick={() => approveProposal(proposal)} disabled={approvingProposal === proposal.id} style={{ padding: '3px 12px', background: 'rgba(155,111,212,0.15)', border: '1px solid rgba(155,111,212,0.35)', borderRadius: '4px', color: '#9B6FD4', fontSize: '0.68rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'IBM Plex Sans, sans-serif' }}>
                                          {approvingProposal === proposal.id ? '...' : '✓ Aprobar'}
                                        </button>
                                      ) : (
                                        <button onClick={() => approveProposal(proposal)} disabled={approvingProposal === proposal.id} style={{ padding: '3px 12px', background: 'rgba(78,205,196,0.15)', border: '1px solid rgba(78,205,196,0.4)', borderRadius: '4px', color: '#4ECDC4', fontSize: '0.68rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'IBM Plex Sans, sans-serif' }}>
                                          {approvingProposal === proposal.id ? '...' : '✓ Confirmar e incorporar'}
                                        </button>
                                      )}
                                      <button onClick={() => rejectProposalItem(proposal)} style={{ padding: '3px 8px', background: 'transparent', border: '1px solid rgba(240,235,225,0.06)', borderRadius: '4px', color: 'rgba(240,235,225,0.25)', fontSize: '0.68rem', cursor: 'pointer', fontFamily: 'IBM Plex Sans, sans-serif' }}>
                                        Descartar
                                      </button>
                                    </div>
                                  </div>
                                  <div style={{ padding: '10px 16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                    <div>
                                      <div style={{ fontSize: '0.58rem', letterSpacing: '0.1em', color: 'rgba(212,37,106,0.5)', marginBottom: '4px', fontWeight: 700 }}>ORIGINAL</div>
                                      <pre style={{ margin: 0, fontSize: '0.75rem', fontFamily: 'Courier New, monospace', color: 'rgba(240,235,225,0.45)', lineHeight: 1.65, whiteSpace: 'pre-wrap', textDecoration: 'line-through', textDecorationColor: 'rgba(212,37,106,0.3)', textDecorationThickness: '1px' }}>
                                        {proposal.original_text}
                                      </pre>
                                    </div>
                                    <div>
                                      <div style={{ fontSize: '0.58rem', letterSpacing: '0.1em', color: 'rgba(78,205,196,0.6)', marginBottom: '4px', fontWeight: 700 }}>PROPUESTA</div>
                                      <pre style={{ margin: 0, fontSize: '0.75rem', fontFamily: 'Courier New, monospace', color: '#F0EBE1', lineHeight: 1.65, whiteSpace: 'pre-wrap' }}>
                                        {proposal.proposed_text}
                                      </pre>
                                    </div>
                                  </div>
                                </div>
                              )
                            })
                          })()}
                        </div>
                      )}
                    </div>

                  </div>
                )
              })()}
            </div>
          )}

          {/* STRUCTURE MODE */}
          {mode === 'structure' && (
            <div>

              {/* ── ANALYZING LOADER ──────────────────────────────────── */}
              {analyzingFull && (
                <div style={{ background: 'rgba(155,111,212,0.06)', border: '1px solid rgba(155,111,212,0.25)', borderRadius: '12px', padding: '2.5rem 2rem', marginBottom: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', textAlign: 'center' }}>
                  {/* Title */}
                  <div>
                    <div style={{ fontFamily: 'Bebas Neue, Impact, sans-serif', fontSize: '1.6rem', letterSpacing: '0.12em', color: '#9B6FD4', marginBottom: '6px' }}>NUPPA ESTÁ ANALIZANDO EL GUIÓN</div>
                    <div style={{ fontSize: '0.875rem', color: 'rgba(240,235,225,0.4)', lineHeight: 1.6 }}>Análisis editorial completo — estructura, personajes, diálogo, ritmo y emoción</div>
                  </div>
                  {/* Progress bar */}
                  <div style={{ width: '100%', maxWidth: '480px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <div style={{ fontSize: '0.8rem', color: 'rgba(240,235,225,0.55)', fontStyle: 'italic' }}>{fullAnalyzeStepLabel}</div>
                      <div style={{ fontFamily: 'Bebas Neue, Impact, sans-serif', fontSize: '1.1rem', color: '#9B6FD4', letterSpacing: '0.08em' }}>{fullAnalyzeProgress}%</div>
                    </div>
                    <div style={{ height: '6px', background: 'rgba(155,111,212,0.1)', borderRadius: '10px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${fullAnalyzeProgress}%`, background: 'linear-gradient(90deg, #D4256A, #9B6FD4, #4A8FE8, #4ECDC4)', borderRadius: '10px', transition: 'width 1.5s ease', boxShadow: '0 0 12px rgba(155,111,212,0.5)' }} />
                    </div>
                  </div>
                  {/* Stage dots */}
                  <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                    {[
                      { label: 'Guión',      pct: 20, color: '#D4256A' },
                      { label: 'Estructura', pct: 35, color: '#C44490' },
                      { label: 'Personajes', pct: 50, color: '#9B6FD4' },
                      { label: 'Diálogo',    pct: 63, color: '#7B9FE8' },
                      { label: 'Ritmo',      pct: 75, color: '#4A8FE8' },
                      { label: 'Hallazgos',  pct: 85, color: '#4ECDC4' },
                      { label: 'Guardando',  pct: 96, color: '#F5A52A' },
                    ].map(stage => {
                      const done = fullAnalyzeProgress >= stage.pct
                      const active = fullAnalyzeProgress >= stage.pct - 15 && fullAnalyzeProgress < stage.pct
                      return (
                        <div key={stage.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                          <div style={{
                            width: active ? '18px' : '14px',
                            height: active ? '18px' : '14px',
                            borderRadius: '50%',
                            background: done ? stage.color : active ? `${stage.color}60` : 'rgba(240,235,225,0.06)',
                            border: `2px solid ${done ? stage.color : active ? `${stage.color}80` : 'rgba(240,235,225,0.1)'}`,
                            transition: 'all 0.5s ease',
                            boxShadow: done ? `0 0 10px ${stage.color}70` : active ? `0 0 14px ${stage.color}50` : 'none',
                          }} />
                          <div style={{ fontSize: '0.65rem', fontWeight: done ? 600 : 400, color: done ? stage.color : active ? `${stage.color}90` : 'rgba(240,235,225,0.2)', letterSpacing: '0.06em', whiteSpace: 'nowrap', transition: 'color 0.5s ease' }}>{stage.label}</div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* ── EMPTY STATE — NO SCRIPT ──────────────────────────── */}
              {!analyzingFull && !currentAnalysis && (!episode.script || episode.script.trim().length < 100) && (
                <div style={{ padding: '3rem 2rem', textAlign: 'center' }}>
                  <div style={{ fontFamily: 'Bebas Neue, Impact, sans-serif', fontSize: '1.8rem', letterSpacing: '0.1em', color: 'rgba(240,235,225,0.15)', marginBottom: '2.5rem' }}>ANÁLISIS EDITORIAL</div>
                  <div style={{ display: 'flex', gap: '0', justifyContent: 'center', maxWidth: '600px', margin: '0 auto 2.5rem' }}>
                    {[
                      { n: '01', label: 'Importar guión', desc: 'Sube el .docx o pega el texto en la pestaña Guión', color: '#D4256A' },
                      { n: '02', label: 'Análisis automático', desc: 'NUPPA evalúa estructura, personajes, ritmo y emoción', color: '#9B6FD4' },
                      { n: '03', label: 'Mejorar con NUPPA', desc: 'Trabaja hallazgo por hallazgo con el asistente AI', color: '#4ECDC4' },
                    ].map((step, i) => (
                      <div key={step.n} style={{ flex: 1, padding: '1.5rem 1rem', position: 'relative' }}>
                        {i < 2 && <div style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)', width: '1px', height: '60%', background: 'rgba(240,235,225,0.06)' }} />}
                        <div style={{ fontFamily: 'Bebas Neue, Impact, sans-serif', fontSize: '2.5rem', color: step.color, opacity: 0.3, lineHeight: 1, marginBottom: '8px' }}>{step.n}</div>
                        <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#F0EBE1', marginBottom: '6px' }}>{step.label}</div>
                        <div style={{ fontSize: '0.75rem', color: 'rgba(240,235,225,0.35)', lineHeight: 1.6 }}>{step.desc}</div>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => setMode('script')}
                    style={{ padding: '12px 28px', background: 'rgba(212,37,106,0.15)', border: '1px solid rgba(212,37,106,0.4)', borderRadius: '6px', color: '#D4256A', fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'IBM Plex Sans, sans-serif' }}
                  >
                    → Ir a importar guión
                  </button>
                </div>
              )}

              {/* ── EMPTY STATE — SCRIPT EXISTS BUT NO ANALYSIS ──────── */}
              {!analyzingFull && !currentAnalysis && episode.script && episode.script.trim().length >= 100 && (
                <div style={{ marginBottom: '2rem' }}>
                  {/* Steps */}
                  <div style={{ display: 'flex', gap: '0', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', marginBottom: '1.5rem', overflow: 'hidden' }}>
                    {[
                      { n: '01', label: 'Guión importado', done: true, color: '#4ECDC4' },
                      { n: '02', label: 'Análisis editorial', done: false, color: '#9B6FD4' },
                      { n: '03', label: 'Mejoras con NUPPA', done: false, color: '#F5A52A' },
                    ].map((step, i) => (
                      <div key={step.n} style={{ flex: 1, padding: '1.25rem 1rem', display: 'flex', alignItems: 'center', gap: '10px', borderRight: i < 2 ? '1px solid rgba(255,255,255,0.05)' : 'none', background: step.done ? 'rgba(78,205,196,0.04)' : 'transparent' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: step.done ? 'rgba(78,205,196,0.15)' : 'rgba(255,255,255,0.04)', border: `1px solid ${step.done ? 'rgba(78,205,196,0.4)' : 'rgba(255,255,255,0.08)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          {step.done ? (
                            <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3 8l3.5 3.5L13 4" stroke="#4ECDC4" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                          ) : (
                            <span style={{ fontFamily: 'Bebas Neue, Impact, sans-serif', fontSize: '0.75rem', color: 'rgba(240,235,225,0.2)', letterSpacing: '0.05em' }}>{step.n}</span>
                          )}
                        </div>
                        <div>
                          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: step.done ? '#4ECDC4' : 'rgba(240,235,225,0.4)' }}>{step.label}</div>
                          {!step.done && <div style={{ fontSize: '0.65rem', color: 'rgba(240,235,225,0.2)' }}>Pendiente</div>}
                          {step.done && <div style={{ fontSize: '0.65rem', color: 'rgba(78,205,196,0.5)' }}>Listo</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* CTA */}
                  <div style={{ background: 'rgba(155,111,212,0.06)', border: '1px solid rgba(155,111,212,0.2)', borderRadius: '10px', padding: '2rem', textAlign: 'center' }}>
                    <div style={{ fontFamily: 'Bebas Neue, Impact, sans-serif', fontSize: '1.5rem', letterSpacing: '0.1em', color: '#9B6FD4', marginBottom: '8px' }}>PASO 2 — ANÁLISIS EDITORIAL</div>
                    <div style={{ fontSize: '0.875rem', color: 'rgba(240,235,225,0.45)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                      NUPPA analizará el guión completo: estructura dramática, evaluación por dimensiones<br/>e identificación de hallazgos concretos para mejorar.
                    </div>
                    {/* Script size info */}
                    {(() => {
                      const chars = episode.script?.length ?? 0
                      const LIMIT = 28000
                      const willTruncate = chars > LIMIT
                      const pct = Math.min(100, Math.round((chars / LIMIT) * 100))
                      return (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.25rem', padding: '10px 14px', background: willTruncate ? 'rgba(245,165,42,0.06)' : 'rgba(78,205,196,0.04)', border: `1px solid ${willTruncate ? 'rgba(245,165,42,0.25)' : 'rgba(78,205,196,0.15)'}`, borderRadius: '6px' }}>
                          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, color: willTruncate ? '#F5A52A' : '#4ECDC4' }}><path d="M3 4h10v1.5H3zM3 7.5h10V9H3zM3 11h6v1.5H3z" fill="currentColor" opacity=".8"/></svg>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ height: '4px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden', marginBottom: '4px' }}>
                              <div style={{ height: '100%', width: `${pct}%`, background: willTruncate ? '#F5A52A' : '#4ECDC4', borderRadius: '4px' }} />
                            </div>
                            <div style={{ fontSize: '0.7rem', color: willTruncate ? '#F5A52A' : 'rgba(78,205,196,0.7)' }}>
                              {willTruncate
                                ? `⚠️ Guión largo (${(chars/1000).toFixed(1)}k chars) — se analizarán los primeros 28,000 caracteres. Las escenas del final podrían no estar incluidas.`
                                : `✓ Guión completo (${(chars/1000).toFixed(1)}k chars) — todo el contenido será analizado.`
                              }
                            </div>
                          </div>
                        </div>
                      )
                    })()}
                    <button
                      onClick={runFullAnalysis}
                      style={{ padding: '14px 36px', background: 'linear-gradient(135deg, rgba(155,111,212,0.3), rgba(155,111,212,0.15))', border: '1px solid rgba(155,111,212,0.5)', borderRadius: '8px', color: '#B08FE8', fontSize: '1rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'IBM Plex Sans, sans-serif', letterSpacing: '0.05em', display: 'inline-flex', alignItems: 'center', gap: '10px' }}
                    >
                      <svg width="18" height="18" viewBox="0 0 16 16" fill="none"><path d="M8 2l1.8 3.6L14 6.3l-3 2.9.7 4.1L8 11.3l-3.7 1.9.7-4.1-3-2.9 4.2-.7z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/></svg>
                      Analizar guión con NUPPA
                    </button>
                    {analyzeFullError && <div style={{ marginTop: '1rem', fontSize: '0.75rem', color: '#D4256A' }}>{analyzeFullError}</div>}
                  </div>
                </div>
              )}

              {/* ── FULL ANALYSIS RESULTS ─────────────────────────────── */}
              {!analyzingFull && currentAnalysis && (() => {
                const C = 2 * Math.PI * 36
                const scoreColor = (s: number) => s >= 4 ? '#4ECDC4' : s === 3 ? '#F5A52A' : '#D4256A'
                const scoreBg = (s: number) => s >= 4 ? 'rgba(78,205,196,0.06)' : s === 3 ? 'rgba(245,165,42,0.06)' : 'rgba(212,37,106,0.06)'
                const scoreBorder = (s: number) => s >= 4 ? 'rgba(78,205,196,0.25)' : s === 3 ? 'rgba(245,165,42,0.25)' : 'rgba(212,37,106,0.25)'
                const overallColor = scoreColor(currentAnalysis.overall_score)
                const statusIcon = (s: string) => {
                  if (s === 'implemented' || s === 'verified') return <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3 8l3.5 3.5L13 4" stroke="#4ECDC4" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  if (s === 'discarded') return <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M4 4l8 8M12 4l-8 8" stroke="rgba(240,235,225,0.25)" strokeWidth="1.5" strokeLinecap="round"/></svg>
                  if (s === 'in_review') return <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="#F5A52A" strokeWidth="1.3"/><path d="M8 5v4M8 11v.5" stroke="#F5A52A" strokeWidth="1.4" strokeLinecap="round"/></svg>
                  return <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="rgba(240,235,225,0.2)" strokeWidth="1.3"/></svg>
                }
                const priorityBadge = (p: string) => {
                  const cfg = { alta: { bg: 'rgba(212,37,106,0.15)', border: 'rgba(212,37,106,0.3)', color: '#D4256A', label: 'ALTA' }, media: { bg: 'rgba(245,165,42,0.12)', border: 'rgba(245,165,42,0.3)', color: '#F5A52A', label: 'MEDIA' }, baja: { bg: 'rgba(240,235,225,0.05)', border: 'rgba(240,235,225,0.1)', color: 'rgba(240,235,225,0.35)', label: 'BAJA' } }[p] ?? { bg: 'rgba(240,235,225,0.05)', border: 'rgba(240,235,225,0.1)', color: 'rgba(240,235,225,0.35)', label: p.toUpperCase() }
                  return <span style={{ fontSize: '0.55rem', fontWeight: 700, letterSpacing: '0.1em', color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.border}`, borderRadius: '20px', padding: '2px 7px', flexShrink: 0 }}>{cfg.label}</span>
                }
                const overallFill = (currentAnalysis.overall_score / 5) * (2 * Math.PI * 52)
                const overallC = 2 * Math.PI * 52
                return (
                  <>
                    {/* ── HERO SCORE CARD ──────────────────────────────── */}
                    <div style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', marginBottom: '1.5rem', minHeight: '200px' }}>
                      {/* Background: hero image or gradient */}
                      {episode.hero_image_path ? (
                        <img src={episode.hero_image_path} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.25 }} />
                      ) : (
                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(155,111,212,0.15), rgba(212,37,106,0.1), rgba(78,205,196,0.08))' }} />
                      )}
                      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(10,7,25,0.4) 0%, rgba(10,7,25,0.85) 100%)' }} />
                      {/* Content */}
                      <div style={{ position: 'relative', padding: '1.75rem 2rem', display: 'flex', alignItems: 'center', gap: '2rem' }}>
                        {/* Overall circle */}
                        <div style={{ flexShrink: 0, position: 'relative' }}>
                          <svg width="130" height="130" viewBox="0 0 130 130">
                            <circle cx="65" cy="65" r="52" fill="none" stroke="rgba(240,235,225,0.06)" strokeWidth="8"/>
                            <circle cx="65" cy="65" r="52" fill="none" stroke={overallColor} strokeWidth="8"
                              strokeDasharray={`${overallFill} ${overallC}`}
                              strokeDashoffset={overallC * 0.25}
                              strokeLinecap="round"
                              style={{ transition: 'stroke-dasharray 0.8s ease', filter: `drop-shadow(0 0 8px ${overallColor}55)` }}
                            />
                            <text x="65" y="60" textAnchor="middle" dominantBaseline="central" fill={overallColor} fontSize="30" fontWeight="700" fontFamily="Bebas Neue, Impact, sans-serif">{currentAnalysis.overall_score.toFixed(1)}</text>
                            <text x="65" y="80" textAnchor="middle" dominantBaseline="central" fill="rgba(240,235,225,0.3)" fontSize="11" fontFamily="IBM Plex Sans, sans-serif">/5.0</text>
                          </svg>
                        </div>
                        {/* Info */}
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                            <div style={{ fontFamily: 'Bebas Neue, Impact, sans-serif', fontSize: '1.5rem', letterSpacing: '0.08em', color: '#F0EBE1' }}>Análisis editorial</div>
                            <div style={{ fontSize: '0.6rem', letterSpacing: '0.12em', color: overallColor, background: `${overallColor}15`, border: `1px solid ${overallColor}40`, borderRadius: '20px', padding: '2px 10px', fontWeight: 700 }}>
                              {currentAnalysis.overall_score >= 4 ? 'SÓLIDO' : currentAnalysis.overall_score >= 3 ? 'ACEPTABLE' : 'REVISAR'}
                            </div>
                          </div>
                          <div style={{ fontSize: '0.9rem', color: 'rgba(240,235,225,0.65)', lineHeight: 1.7, marginBottom: '1rem', maxWidth: '520px' }}>{currentAnalysis.verdict}</div>
                          <div style={{ display: 'flex', gap: '1.5rem' }}>
                            <div style={{ fontSize: '0.75rem', color: 'rgba(240,235,225,0.35)' }}>
                              <span style={{ color: '#F5A52A', fontWeight: 700, fontSize: '1.1rem', fontFamily: 'Bebas Neue, Impact, sans-serif' }}>{currentAnalysis.findings_count}</span> hallazgos
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'rgba(240,235,225,0.35)' }}>
                              <span style={{ color: '#4ECDC4', fontWeight: 700, fontSize: '1.1rem', fontFamily: 'Bebas Neue, Impact, sans-serif' }}>{currentAnalysis.structure?.total_scenes ?? 0}</span> escenas detectadas
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'rgba(240,235,225,0.35)' }}>
                              <span style={{ color: 'rgba(240,235,225,0.5)', fontWeight: 700, fontSize: '1.1rem', fontFamily: 'Bebas Neue, Impact, sans-serif' }}>{currentAnalysis.pending_count}</span> pendientes
                            </div>
                          </div>
                        </div>
                        {/* Reevaluar button */}
                        <button
                          onClick={runFullAnalysis}
                          style={{ flexShrink: 0, padding: '10px 18px', background: 'rgba(155,111,212,0.12)', border: '1px solid rgba(155,111,212,0.3)', borderRadius: '6px', color: '#9B6FD4', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'IBM Plex Sans, sans-serif', display: 'flex', alignItems: 'center', gap: '7px' }}
                        >
                          <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M2 8a6 6 0 1 1 1.5 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/><path d="M2 12V8h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
                          Reevaluar guión
                        </button>
                        {/* Reescritura completa */}
                        <button
                          onClick={runRewrite}
                          disabled={rewriting}
                          style={{ flexShrink: 0, padding: '10px 18px', background: rewriting ? 'rgba(212,37,106,0.06)' : 'rgba(212,37,106,0.1)', border: '1px solid rgba(212,37,106,0.3)', borderRadius: '6px', color: '#D4256A', fontSize: '0.8rem', fontWeight: 600, cursor: rewriting ? 'not-allowed' : 'pointer', fontFamily: 'IBM Plex Sans, sans-serif', display: 'flex', alignItems: 'center', gap: '7px', opacity: rewriting ? 0.7 : 1 }}
                        >
                          {rewriting
                            ? <svg width="14" height="14" viewBox="0 0 32 32" style={{ animation: 'spin 1s linear infinite' }}><circle cx="16" cy="16" r="12" stroke="currentColor" strokeWidth="3" fill="none" opacity=".3"/><path d="M16 4 A12 12 0 0 1 28 16" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round"/></svg>
                            : <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
                          }
                          {rewriting ? 'NUPPA reescribiendo...' : 'Reescritura completa'}
                        </button>
                      </div>
                    </div>

                    {/* ── TRUNCATION WARNING ───────────────────────────── */}
                    {currentAnalysis.script_truncated && (
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', background: 'rgba(245,165,42,0.07)', border: '1px solid rgba(245,165,42,0.3)', borderRadius: '8px', padding: '12px 16px', marginBottom: '1.25rem' }}>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginTop: '1px', color: '#F5A52A' }}><path d="M8 2L14.5 13H1.5L8 2z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/><path d="M8 6v3.5M8 11v.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>
                        <div>
                          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#F5A52A', marginBottom: '3px' }}>Análisis parcial — guión largo</div>
                          <div style={{ fontSize: '0.75rem', color: 'rgba(245,165,42,0.75)', lineHeight: 1.5 }}>
                            Se analizaron {((currentAnalysis.script_analyzed_chars ?? 0) / 1000).toFixed(1)}k de {((currentAnalysis.script_total_chars ?? 0) / 1000).toFixed(1)}k caracteres del guión. Las escenas de la segunda mitad pueden no estar reflejadas en los hallazgos. Considera dividir el guión o revisar manualmente las escenas finales.
                          </div>
                        </div>
                      </div>
                    )}

                    {/* ── SCORE CIRCLES ────────────────────────────────── */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.875rem', marginBottom: '2rem' }}>
                      {currentAnalysis.categories.map(cat => {
                        const fill = (cat.score / 5) * C
                        const color = scoreColor(cat.score)
                        const pendingCount = cat.findings.filter(f => f.status === 'pending' || f.status === 'in_review').length
                        return (
                          <div key={cat.key} style={{ background: `linear-gradient(135deg, ${scoreBg(cat.score)}, rgba(10,7,25,0.4))`, border: `1px solid ${scoreBorder(cat.score)}`, borderRadius: '10px', padding: '1.5rem 1rem 1.25rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', position: 'relative', backdropFilter: 'blur(8px)' }}>
                            {pendingCount > 0 && (
                              <div style={{ position: 'absolute', top: '10px', right: '10px', width: '18px', height: '18px', borderRadius: '50%', background: '#D4256A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', fontWeight: 700, color: '#fff' }}>{pendingCount}</div>
                            )}
                            <svg width="90" height="90" viewBox="0 0 90 90">
                              <circle cx="45" cy="45" r="36" fill="none" stroke="rgba(240,235,225,0.05)" strokeWidth="6"/>
                              <circle cx="45" cy="45" r="36" fill="none" stroke={color} strokeWidth="6"
                                strokeDasharray={`${fill} ${C}`}
                                strokeDashoffset={C * 0.25}
                                strokeLinecap="round"
                                style={{ transition: 'stroke-dasharray 0.7s ease', filter: `drop-shadow(0 0 6px ${color}44)` }}
                              />
                              <text x="45" y="42" textAnchor="middle" dominantBaseline="central" fill={color} fontSize="24" fontWeight="700" fontFamily="Bebas Neue, Impact, sans-serif">{cat.score}</text>
                              <text x="45" y="56" textAnchor="middle" dominantBaseline="central" fill="rgba(240,235,225,0.2)" fontSize="10" fontFamily="IBM Plex Sans, sans-serif">/5</text>
                            </svg>
                            <div style={{ fontFamily: 'Bebas Neue, Impact, sans-serif', fontSize: '0.9rem', letterSpacing: '0.12em', color: '#F0EBE1', textAlign: 'center' }}>{cat.label}</div>
                            <div style={{ fontSize: '0.7rem', color: 'rgba(240,235,225,0.4)', lineHeight: 1.5, textAlign: 'center', flexGrow: 1 }}>{cat.weakness}</div>
                          </div>
                        )
                      })}
                    </div>

                    {/* ── FINDINGS ACCORDION ───────────────────────────── */}
                    {currentAnalysis.categories.some(c => c.findings.length > 0) && (
                      <div style={{ marginBottom: '2rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                          <div style={{ fontFamily: 'Bebas Neue, Impact, sans-serif', fontSize: '1.1rem', letterSpacing: '0.08em', color: '#F0EBE1' }}>
                            HALLAZGOS EDITORIALES
                            <span style={{ fontSize: '0.65rem', fontFamily: 'IBM Plex Sans, sans-serif', color: 'rgba(240,235,225,0.25)', marginLeft: '10px', letterSpacing: '0.04em', fontWeight: 400 }}>{currentAnalysis.findings_count} total · {currentAnalysis.pending_count} pendientes</span>
                          </div>
                        </div>
                        {currentAnalysis.categories.filter(c => c.findings.length > 0).map(cat => {
                          const color = scoreColor(cat.score)
                          return (
                            <div key={cat.key} style={{ marginBottom: '1rem', background: 'rgba(255,255,255,0.015)', border: `1px solid ${scoreBorder(cat.score)}`, borderRadius: '8px', overflow: 'hidden' }}>
                              {/* Category header */}
                              <div style={{ padding: '0.875rem 1.25rem', background: scoreBg(cat.score), display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: `${color}15`, border: `2px solid ${color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                  <span style={{ fontFamily: 'Bebas Neue, Impact, sans-serif', fontSize: '1rem', color: color }}>{cat.score}</span>
                                </div>
                                <div>
                                  <div style={{ fontFamily: 'Bebas Neue, Impact, sans-serif', fontSize: '1rem', letterSpacing: '0.1em', color: '#F0EBE1' }}>{cat.label.toUpperCase()}</div>
                                  <div style={{ fontSize: '0.7rem', color: 'rgba(240,235,225,0.4)' }}>{cat.strength}</div>
                                </div>
                                <div style={{ marginLeft: 'auto', fontSize: '0.65rem', color: color, background: `${color}12`, border: `1px solid ${color}30`, borderRadius: '20px', padding: '2px 10px' }}>{cat.findings.length} hallazgo{cat.findings.length > 1 ? 's' : ''}</div>
                              </div>
                              {/* Findings list */}
                              <div style={{ padding: '0.75rem' }}>
                                {cat.findings.map(finding => {
                                  const isExpanded = expandedFinding === finding.id
                                  const isDone = finding.status === 'implemented' || finding.status === 'verified' || finding.status === 'discarded'
                                  return (
                                    <div key={finding.id} style={{ marginBottom: '6px', background: isDone ? 'rgba(240,235,225,0.02)' : 'rgba(10,7,25,0.5)', border: `1px solid ${isDone ? 'rgba(240,235,225,0.06)' : scoreBorder(cat.score)}`, borderRadius: '6px', overflow: 'hidden', opacity: isDone ? 0.6 : 1 }}>
                                      {/* Finding header */}
                                      <div
                                        style={{ padding: '0.875rem 1rem', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
                                        onClick={() => setExpandedFinding(isExpanded ? null : finding.id)}
                                      >
                                        <div style={{ flexShrink: 0 }}>{statusIcon(finding.status)}</div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                          <div style={{ fontSize: '0.875rem', fontWeight: 600, color: isDone ? 'rgba(240,235,225,0.4)' : '#F0EBE1', lineHeight: 1.4, marginBottom: '2px' }}>{finding.title}</div>
                                          <div style={{ fontSize: '0.7rem', color: 'rgba(240,235,225,0.3)', fontFamily: 'monospace' }}>{finding.scene_ref}</div>
                                        </div>
                                        {priorityBadge(finding.priority)}
                                        <div style={{ fontSize: '0.7rem', color: 'rgba(240,235,225,0.2)', flexShrink: 0 }}>{isExpanded ? '▲' : '▼'}</div>
                                      </div>
                                      {/* Finding detail */}
                                      {isExpanded && (
                                        <div style={{ padding: '0 1rem 1rem', borderTop: '1px solid rgba(240,235,225,0.04)' }}>
                                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem', marginTop: '0.875rem', marginBottom: '1rem' }}>
                                            <div>
                                              <div style={{ fontSize: '0.6rem', letterSpacing: '0.12em', color: 'rgba(240,235,225,0.25)', marginBottom: '4px', fontWeight: 600 }}>EVIDENCIA DEL GUIÓN</div>
                                              <div style={{ fontSize: '0.75rem', color: 'rgba(240,235,225,0.55)', lineHeight: 1.6, fontStyle: 'italic', background: 'rgba(255,255,255,0.03)', borderLeft: `2px solid ${color}40`, padding: '8px 10px', borderRadius: '0 4px 4px 0' }}>&ldquo;{finding.evidence}&rdquo;</div>
                                            </div>
                                            <div>
                                              <div style={{ fontSize: '0.6rem', letterSpacing: '0.12em', color: 'rgba(240,235,225,0.25)', marginBottom: '4px', fontWeight: 600 }}>PROBLEMA</div>
                                              <div style={{ fontSize: '0.75rem', color: 'rgba(240,235,225,0.55)', lineHeight: 1.6 }}>{finding.problem_description}</div>
                                            </div>
                                            <div>
                                              <div style={{ fontSize: '0.6rem', letterSpacing: '0.12em', color: 'rgba(240,235,225,0.25)', marginBottom: '4px', fontWeight: 600 }}>EFECTO NARRATIVO</div>
                                              <div style={{ fontSize: '0.75rem', color: 'rgba(240,235,225,0.55)', lineHeight: 1.6 }}>{finding.narrative_effect}</div>
                                            </div>
                                            <div>
                                              <div style={{ fontSize: '0.6rem', letterSpacing: '0.12em', color: 'rgba(240,235,225,0.25)', marginBottom: '4px', fontWeight: 600 }}>OBJETIVO DE MEJORA</div>
                                              <div style={{ fontSize: '0.75rem', color: '#4ECDC4', lineHeight: 1.6 }}>{finding.improvement_goal}</div>
                                            </div>
                                          </div>
                                          {/* Actions */}
                                          {!isDone && (
                                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                                              <button
                                                onClick={() => improveWithNuppa(finding)}
                                                style={{ padding: '8px 18px', background: 'linear-gradient(135deg, rgba(155,111,212,0.25), rgba(155,111,212,0.12))', border: '1px solid rgba(155,111,212,0.45)', borderRadius: '6px', color: '#B08FE8', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'IBM Plex Sans, sans-serif', display: 'flex', alignItems: 'center', gap: '7px' }}
                                              >
                                                <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M8 2l1.8 3.6L14 6.3l-3 2.9.7 4.1L8 11.3l-3.7 1.9.7-4.1-3-2.9 4.2-.7z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/></svg>
                                                Mejorar con NUPPA
                                              </button>
                                              <button
                                                disabled={updatingFinding === finding.id}
                                                onClick={() => updateFindingStatus(finding, 'implemented')}
                                                style={{ padding: '7px 14px', background: 'rgba(78,205,196,0.08)', border: '1px solid rgba(78,205,196,0.25)', borderRadius: '6px', color: '#4ECDC4', fontSize: '0.75rem', cursor: 'pointer', fontFamily: 'IBM Plex Sans, sans-serif' }}
                                              >
                                                ✓ Marcar resuelto
                                              </button>
                                              <button
                                                disabled={updatingFinding === finding.id}
                                                onClick={() => updateFindingStatus(finding, 'discarded')}
                                                style={{ padding: '7px 14px', background: 'transparent', border: '1px solid rgba(240,235,225,0.08)', borderRadius: '6px', color: 'rgba(240,235,225,0.3)', fontSize: '0.75rem', cursor: 'pointer', fontFamily: 'IBM Plex Sans, sans-serif' }}
                                              >
                                                Descartar
                                              </button>
                                            </div>
                                          )}
                                          {isDone && (
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                              <button
                                                onClick={() => updateFindingStatus(finding, 'pending')}
                                                style={{ padding: '6px 12px', background: 'transparent', border: '1px solid rgba(240,235,225,0.08)', borderRadius: '6px', color: 'rgba(240,235,225,0.3)', fontSize: '0.7rem', cursor: 'pointer', fontFamily: 'IBM Plex Sans, sans-serif' }}
                                              >
                                                ↩ Reabrir
                                              </button>
                                            </div>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  )
                                })}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}

                    {/* ── DETECTED STRUCTURE ───────────────────────────── */}
                    {currentAnalysis.structure && (
                      <div style={{ background: '#0A0719', border: '1px solid rgba(212,37,106,0.2)', borderRadius: '10px', marginBottom: '2rem', overflow: 'hidden' }}>
                        <div style={{ background: 'rgba(212,37,106,0.08)', padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div>
                            <div style={{ fontFamily: 'Bebas Neue, Impact, sans-serif', fontSize: '1.1rem', letterSpacing: '0.1em', color: '#D4256A' }}>
                              ESTRUCTURA DETECTADA — {currentAnalysis.structure.total_scenes} escenas
                            </div>
                            {currentAnalysis.structure.structure_notes && (
                              <div style={{ fontSize: '0.7rem', color: 'rgba(240,235,225,0.35)', marginTop: '3px', maxWidth: '520px', lineHeight: 1.5 }}>{currentAnalysis.structure.structure_notes}</div>
                            )}
                          </div>
                          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            {applyingStructure ? (
                              <div style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '0.75rem', color: '#D4256A' }}>
                                <svg width="14" height="14" viewBox="0 0 32 32" style={{ animation: 'spin 1.2s linear infinite' }}><circle cx="16" cy="16" r="13" stroke="rgba(212,37,106,0.15)" strokeWidth="2.5" fill="none"/><path d="M16 3 A13 13 0 0 1 29 16" stroke="#D4256A" strokeWidth="2.5" fill="none" strokeLinecap="round"/></svg>
                                Agregando...
                              </div>
                            ) : (
                              <button
                                onClick={applyAnalysisStructure}
                                style={{ padding: '8px 18px', background: '#D4256A', border: 'none', borderRadius: '6px', color: '#fff', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'IBM Plex Sans, sans-serif', display: 'flex', alignItems: 'center', gap: '7px' }}
                              >
                                <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
                                Agregar al episodio
                              </button>
                            )}
                          </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', borderTop: '1px solid rgba(212,37,106,0.08)' }}>
                          {currentAnalysis.structure.acts.map((act, ai) => (
                            <div key={act.act_number} style={{ borderRight: ai < 2 ? '1px solid rgba(212,37,106,0.08)' : 'none', padding: '1.25rem' }}>
                              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '8px' }}>
                                <span style={{ fontFamily: 'Bebas Neue, Impact, sans-serif', fontSize: '0.9rem', letterSpacing: '0.15em', color: '#D4256A' }}>ACTO {act.act_number}</span>
                                <span style={{ fontSize: '0.65rem', color: 'rgba(240,235,225,0.2)', fontFamily: 'monospace' }}>{act.scenes.length} esc</span>
                              </div>
                              <div style={{ fontSize: '0.95rem', color: '#F0EBE1', fontWeight: 700, marginBottom: '5px', lineHeight: 1.3 }}>{act.title}</div>
                              <div style={{ fontSize: '0.75rem', color: 'rgba(240,235,225,0.35)', fontStyle: 'italic', marginBottom: '14px', lineHeight: 1.5 }}>{act.goal}</div>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                                {act.scenes.map((sc, i) => (
                                  <div key={i} style={{ background: 'rgba(255,255,255,0.025)', borderRadius: '5px', padding: '10px 12px', borderLeft: '2px solid rgba(212,37,106,0.2)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '4px', marginBottom: '4px' }}>
                                      <span style={{ fontSize: '0.8rem', color: '#F0EBE1', fontWeight: 700, lineHeight: 1.3 }}>{sc.title}</span>
                                      <span style={{ fontSize: '0.6rem', color: 'rgba(240,235,225,0.2)', fontFamily: 'monospace', flexShrink: 0 }}>{sc.duration_est}s</span>
                                    </div>
                                    {sc.location && <div style={{ fontSize: '0.7rem', color: '#9B6FD4', marginBottom: '3px' }}>{sc.location}</div>}
                                    <div style={{ fontSize: '0.75rem', color: 'rgba(240,235,225,0.4)', lineHeight: 1.6 }}>{sc.description}</div>
                                    {sc.mood && <div style={{ fontSize: '0.6rem', color: 'rgba(240,235,225,0.2)', marginTop: '4px', fontStyle: 'italic' }}>{sc.mood}</div>}
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )
              })()}

              {/* ── ACTS & SCENES (DB editor) ─────────────────────────── */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', paddingTop: currentAnalysis ? '0.5rem' : '0', borderTop: currentAnalysis ? '1px solid rgba(240,235,225,0.05)' : 'none' }}>
                <div style={{ fontFamily: 'Bebas Neue, Impact, sans-serif', fontSize: '1rem', letterSpacing: '0.08em', color: currentAnalysis ? 'rgba(240,235,225,0.5)' : '#F0EBE1' }}>
                  Actos y escenas
                  <span style={{ fontSize: '0.6rem', fontFamily: 'IBM Plex Sans, sans-serif', color: 'rgba(240,235,225,0.2)', marginLeft: '10px', letterSpacing: '0.05em', fontWeight: 400 }}>
                    {episode.scenes.length} escenas · {episode.acts.length} actos
                  </span>
                </div>
                <button
                  onClick={() => activateWorkflow('generate_scenes')}
                  style={{ padding: '5px 12px', background: 'rgba(74,143,232,0.08)', border: '1px solid rgba(74,143,232,0.2)', borderRadius: '3px', color: '#4A8FE8', fontSize: '0.72rem', cursor: 'pointer', fontFamily: 'IBM Plex Sans, sans-serif', display: 'flex', alignItems: 'center', gap: '5px' }}
                >
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><rect x="2" y="3" width="12" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><path d="M6.5 6.5L10 8l-3.5 1.5V6.5z" fill="currentColor"/></svg>
                  Generar con AI
                </button>
              </div>

              {/* ── ACTS & SCENES ───────────────────────────────────────── */}
              {episode.acts.map(act => {
                const actScenes = episode.scenes.filter(s => s.act_id === act.id).sort((a, b) => a.scene_number - b.scene_number)
                const actPercent = [25, 50, 25][act.act_number - 1] ?? 33
                return (
                  <div key={act.id} style={{ marginBottom: '1.5rem', background: '#0A0719', border: '1px solid rgba(212,37,106,0.12)', borderRadius: '6px', overflow: 'hidden' }}>
                    {/* Act header */}
                    <div style={{ background: 'rgba(212,37,106,0.07)', padding: '0.875rem 1.125rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                        <span style={{ fontFamily: 'Bebas Neue, Impact, sans-serif', fontSize: '1.25rem', letterSpacing: '0.1em', color: '#D4256A', lineHeight: 1 }}>ACTO {act.act_number}</span>
                        <span style={{ fontSize: '0.55rem', color: 'rgba(212,37,106,0.5)', background: 'rgba(212,37,106,0.1)', borderRadius: '20px', padding: '2px 8px', fontWeight: 600 }}>{actPercent}%</span>
                      </div>
                      <input
                        defaultValue={act.title ?? ''}
                        placeholder="Título del acto..."
                        onBlur={async e => {
                          await fetch(`/api/acts?id=${act.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title: e.target.value }) })
                          setEpisode(prev => prev ? { ...prev, acts: prev.acts.map(a => a.id === act.id ? { ...a, title: e.target.value } : a) } : prev)
                        }}
                        style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#F0EBE1', fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '0.9rem', fontWeight: 700 }}
                      />
                      <span style={{ fontSize: '0.6rem', color: 'rgba(240,235,225,0.2)', fontFamily: 'monospace', flexShrink: 0 }}>{actScenes.length} esc</span>
                    </div>

                    {/* Act goal */}
                    <div style={{ padding: '0.625rem 1.125rem', borderBottom: '1px solid rgba(212,37,106,0.06)' }}>
                      <input
                        defaultValue={act.goal ?? ''}
                        placeholder="Objetivo narrativo del acto — ¿qué debe lograr esta parte de la historia?"
                        onBlur={async e => {
                          await fetch(`/api/acts?id=${act.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ goal: e.target.value }) })
                        }}
                        style={{ width: '100%', background: 'transparent', border: 'none', outline: 'none', color: 'rgba(240,235,225,0.4)', fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '0.75rem', fontStyle: 'italic', boxSizing: 'border-box' }}
                      />
                    </div>

                    {/* Scenes */}
                    <div style={{ padding: '0.75rem 1.125rem 1rem' }}>
                      {actScenes.map(scene => (
                        <div key={scene.id} style={{ background: '#120D28', border: '1px solid rgba(240,235,225,0.04)', borderLeft: '2px solid rgba(245,165,42,0.15)', borderRadius: '3px', marginBottom: '6px', overflow: 'hidden' }}>
                          {/* Scene header */}
                          <div
                            style={{ padding: '0.625rem 0.875rem', display: 'flex', alignItems: 'center', gap: '0.625rem', cursor: 'pointer' }}
                            onClick={() => setExpandedScene(expandedScene === scene.id ? null : scene.id)}
                          >
                            <span style={{ fontSize: '0.6rem', fontFamily: 'monospace', color: 'rgba(212,37,106,0.5)', flexShrink: 0, minWidth: '28px' }}>#{scene.scene_number}</span>
                            <input
                              defaultValue={scene.title ?? ''}
                              placeholder="Título de la escena..."
                              onClick={e => e.stopPropagation()}
                              onBlur={e => updateSceneField(scene.id, 'title', e.target.value)}
                              style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#F0EBE1', fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '0.8125rem', fontWeight: 600 }}
                            />
                            {scene.mood && <span style={{ fontSize: '0.55rem', color: 'rgba(240,235,225,0.25)', background: 'rgba(240,235,225,0.05)', borderRadius: '20px', padding: '1px 7px', flexShrink: 0 }}>{scene.mood}</span>}
                            {scene.location_name && <span style={{ fontSize: '0.6rem', color: 'rgba(155,111,212,0.7)', flexShrink: 0, display: 'flex', alignItems: 'center', gap: '3px' }}><svg width="9" height="9" viewBox="0 0 12 12" fill="none"><path d="M6 1a3.5 3.5 0 0 1 3.5 3.5c0 2.5-3.5 6.5-3.5 6.5S2.5 7 2.5 4.5A3.5 3.5 0 0 1 6 1z" stroke="currentColor" strokeWidth="1.1"/><circle cx="6" cy="4.5" r="1.2" fill="currentColor"/></svg>{scene.location_name}</span>}
                            {scene.duration_est && <span style={{ fontSize: '0.55rem', color: 'rgba(240,235,225,0.2)', flexShrink: 0, fontFamily: 'monospace' }}>{scene.duration_est}s</span>}
                            <span style={{ fontSize: '0.65rem', color: 'rgba(240,235,225,0.15)', flexShrink: 0 }}>{expandedScene === scene.id ? '▲' : '▼'}</span>
                            <button
                              onClick={e => { e.stopPropagation(); deleteScene(scene.id) }}
                              style={{ background: 'none', border: 'none', color: 'rgba(212,37,106,0.2)', cursor: 'pointer', fontSize: '0.9rem', padding: '0 2px', flexShrink: 0 }}
                              onMouseEnter={e => (e.currentTarget.style.color = '#D4256A')}
                              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(212,37,106,0.2)')}
                            >×</button>
                          </div>

                          {/* Scene detail (expanded) */}
                          {expandedScene === scene.id && (
                            <div style={{ padding: '0 0.875rem 0.875rem', borderTop: '1px solid rgba(240,235,225,0.04)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
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
                                <input defaultValue={scene.location_name ?? ''} placeholder="Nombre de la locación..." onBlur={e => updateSceneField(scene.id, 'location_name', e.target.value)} style={{ ...INPUT, marginBottom: '0.5rem' }} />
                                <div style={FIELD_LABEL}>Mood / Tono</div>
                                <input defaultValue={scene.mood ?? ''} placeholder="Ej: tenso, íntimo, cómico..." onBlur={e => updateSceneField(scene.id, 'mood', e.target.value)} style={{ ...INPUT, marginBottom: '0.5rem' }} />
                                <div style={FIELD_LABEL}>Duración estimada (seg)</div>
                                <input type="number" defaultValue={scene.duration_est ?? ''} placeholder="Ej: 45" min={0} onBlur={e => { if (e.target.value) updateSceneField(scene.id, 'duration_est', e.target.value) }} style={{ ...INPUT }} />
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

                      <button
                        onClick={() => addScene(act.id)}
                        style={{ width: '100%', padding: '7px', background: 'transparent', border: '1px dashed rgba(212,37,106,0.15)', borderRadius: '3px', color: 'rgba(212,37,106,0.4)', fontSize: '0.72rem', cursor: 'pointer', fontFamily: 'IBM Plex Sans, sans-serif', marginTop: '4px' }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(212,37,106,0.4)'; e.currentTarget.style.color = '#D4256A' }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(212,37,106,0.15)'; e.currentTarget.style.color = 'rgba(212,37,106,0.4)' }}
                      >
                        + Agregar escena al Acto {act.act_number}
                      </button>
                    </div>
                  </div>
                )
              })}

              {/* Continuity log */}
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
                        <button onClick={() => deleteLogEntry(entry.id)} style={{ background: 'none', border: 'none', color: 'rgba(212,37,106,0.25)', cursor: 'pointer', fontSize: '0.9rem', padding: '0 2px', flexShrink: 0 }} onMouseEnter={e => (e.currentTarget.style.color = '#D4256A')} onMouseLeave={e => (e.currentTarget.style.color = 'rgba(212,37,106,0.25)')}>×</button>
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
                            const isDone = gap.status !== 'pending'
                            const statusPill = gap.status === 'created'
                              ? { label: 'Slot creado · Sin imagen', color: '#F5A52A', bg: 'rgba(245,165,42,0.12)' }
                              : gap.status === 'linked'
                              ? { label: 'Vinculado', color: '#4ECDC4', bg: 'rgba(78,205,196,0.12)' }
                              : gap.status === 'skipped'
                              ? { label: 'Omitido', color: 'rgba(240,235,225,0.35)', bg: 'rgba(240,235,225,0.06)' }
                              : null
                            return (
                              <div key={gapKey} style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                padding: '10px 12px',
                                borderRadius: '3px',
                                background: isDone ? 'rgba(255,255,255,0.02)' : 'transparent',
                                marginBottom: '2px',
                                opacity: gap.status === 'skipped' ? 0.5 : 1,
                              }}>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px', flexWrap: 'wrap' }}>
                                    <span style={{ fontSize: '0.875rem', color: '#F0EBE1', fontWeight: 600 }}>{gap.view_type}</span>
                                    {gap.outfit && <span style={{ fontSize: '0.6rem', color: 'rgba(240,235,225,0.35)' }}>· {gap.outfit}</span>}
                                    {gap.age_version && <span style={{ fontSize: '0.6rem', color: 'rgba(240,235,225,0.35)' }}>· {gap.age_version}</span>}
                                    {statusPill && (
                                      <span style={{ fontSize: '0.6rem', color: statusPill.color, background: statusPill.bg, borderRadius: '20px', padding: '1px 8px', fontWeight: 600 }}>
                                        {statusPill.label}
                                      </span>
                                    )}
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
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                                  {(gap.status === 'created' || gap.status === 'linked') && (
                                    <a
                                      href="/approval"
                                      style={{
                                        fontSize: '0.7rem', color: '#9B6FD4',
                                        textDecoration: 'none', whiteSpace: 'nowrap',
                                        padding: '4px 8px',
                                        border: '1px solid rgba(155,111,212,0.25)',
                                        borderRadius: '3px',
                                        background: 'rgba(155,111,212,0.08)',
                                      }}
                                    >
                                      Ver en Biblia Visual →
                                    </a>
                                  )}
                                  {isDone ? (
                                    <button
                                      onClick={() => resetGap(gap)}
                                      style={{
                                        padding: '4px 8px',
                                        background: 'transparent',
                                        border: '1px solid rgba(240,235,225,0.1)',
                                        borderRadius: '3px',
                                        color: 'rgba(240,235,225,0.3)',
                                        fontSize: '0.7rem',
                                        cursor: 'pointer',
                                        fontFamily: 'IBM Plex Sans, sans-serif',
                                        whiteSpace: 'nowrap',
                                      }}
                                    >
                                      ↩ Restablecer
                                    </button>
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
                                        whiteSpace: 'nowrap',
                                      }}
                                    >
                                      {creatingGap === gapKey ? '...' : '+ Crear slots'}
                                    </button>
                                  )}
                                </div>
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

          {/* ── MOTOR NUPPA ──────────────────────────────────────────── */}
          {mode === 'motor' && (
            <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: '600px' }}>
              {currentAnalysis ? (
                <>
                  {/* Labels */}
                  <div style={{ position: 'absolute', top: 14, left: 16, zIndex: 10 }}>
                    <div style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.2em', color: 'rgba(223,248,24,0.55)', textTransform: 'uppercase' }}>Motor NUPPA</div>
                    <div style={{ fontSize: '0.6rem', color: 'rgba(240,235,225,0.3)', marginTop: 2 }}>
                      T{episode.season}E{String(episode.episode_number).padStart(2,'0')}{episode.title ? ` — ${episode.title}` : ''} · Análisis activo
                    </div>
                  </div>
                  {/* Score */}
                  <div style={{ position: 'absolute', top: 14, right: 16, zIndex: 10, textAlign: 'right' }}>
                    <div style={{ fontSize: '2.8rem', fontWeight: 900, fontFamily: 'Bebas Neue, Impact, sans-serif', color: '#DFF818', lineHeight: 1, textShadow: '0 0 24px rgba(223,248,24,0.4)' }}>
                      {currentAnalysis.overall_score.toFixed(1)}
                    </div>
                    <div style={{ fontSize: '0.55rem', letterSpacing: '0.15em', color: 'rgba(240,235,225,0.3)', textTransform: 'uppercase' }}>Score general / 5.0</div>
                  </div>
                  {/* Legend */}
                  <div style={{ position: 'absolute', bottom: 16, left: 16, zIndex: 10, display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <div style={{ fontSize: '0.55rem', fontWeight: 700, letterSpacing: '0.15em', color: 'rgba(223,248,24,0.45)', textTransform: 'uppercase', marginBottom: 2 }}>Dimensiones</div>
                    {(currentAnalysis.scores_snapshot ?? []).map((cat: { key: string; label: string; score: number }) => (
                      <div key={cat.key} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.6rem', color: 'rgba(240,235,225,0.4)' }}>
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: ({ narrativa:'#FF6B35', personajes:'#4ECDC4', visual:'#DFF818', actuacion:'#9B6FD4', audiencia:'#FFE66D', franquicia:'#D4256A' } as Record<string,string>)[cat.key] ?? '#AAA', flexShrink: 0 }} />
                        {cat.label} · {cat.score}/5
                      </div>
                    ))}
                    <div style={{ fontSize: '0.55rem', fontWeight: 700, letterSpacing: '0.15em', color: 'rgba(240,235,225,0.25)', textTransform: 'uppercase', marginTop: 6, marginBottom: 2 }}>Hallazgos</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.6rem', color: 'rgba(240,235,225,0.4)' }}><div style={{ width: 6, height: 6, borderRadius: '50%', background: '#D4256A', flexShrink: 0 }} /> Prioridad alta</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.6rem', color: 'rgba(240,235,225,0.4)' }}><div style={{ width: 6, height: 6, borderRadius: '50%', background: '#F5A52A', flexShrink: 0 }} /> Prioridad media</div>
                  </div>
                  <NuppaGraph
                    analysis={currentAnalysis as { overall_score: number; verdict?: string; scores_snapshot: Array<{ key: string; label: string; score: number; findings?: Array<{ title: string; priority: string; scene_ref?: string }> }> }}
                    episodeLabel={`T${episode.season}E${String(episode.episode_number).padStart(2,'0')}`}
                  />
                </>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 12, color: 'rgba(240,235,225,0.25)' }}>
                  <div style={{ fontSize: '2rem' }}>⚡</div>
                  <div style={{ fontSize: '0.8rem' }}>Analiza el guión primero para activar el Motor NUPPA</div>
                </div>
              )}
            </div>
          )}

        </div>

        {/* ── RIGHT PANEL — AI ASSISTANT ─────────────────────────────── */}
        {aiPanelOpen && (
        <div data-tutorial="episode-ai-panel" style={{ width: `${aiPanelWidth}px`, flexShrink: 0, borderLeft: '1px solid rgba(212,37,106,0.12)', display: 'flex', flexDirection: 'column', background: '#0A0719', position: 'relative' }}>
          {/* Drag handle */}
          <div
            style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '5px', cursor: 'ew-resize', zIndex: 10, background: 'transparent' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(212,37,106,0.2)')}
            onMouseLeave={e => { if (!aiPanelDragging.current) e.currentTarget.style.background = 'transparent' }}
            onMouseDown={e => {
              aiPanelDragging.current = true
              aiPanelDragStart.current = { x: e.clientX, width: aiPanelWidth }
              const onMove = (ev: MouseEvent) => {
                if (!aiPanelDragging.current) return
                const delta = aiPanelDragStart.current.x - ev.clientX
                const newWidth = Math.min(700, Math.max(320, aiPanelDragStart.current.width + delta))
                setAiPanelWidth(newWidth)
              }
              const onUp = () => {
                aiPanelDragging.current = false
                window.removeEventListener('mousemove', onMove)
                window.removeEventListener('mouseup', onUp)
              }
              window.addEventListener('mousemove', onMove)
              window.addEventListener('mouseup', onUp)
              e.preventDefault()
            }}
          />

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
                  {(msg.role === 'assistant' ? msg.content.replace(/<<<PROPUESTA_NUPPA>>>[\s\S]*?<<<FIN_PROPUESTA>>>/g, '').trim() : msg.content) || (aiStreaming && i === aiMessages.length - 1 ? <span style={{ opacity: 0.4 }}>●●●</span> : '')}
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

          {/* NUPPA proposals detected */}
          {detectedProposals.length > 0 && !aiStreaming && (
            <div style={{ flexShrink: 0, padding: '0.875rem 1rem', borderTop: '1px solid rgba(155,111,212,0.3)', background: 'rgba(155,111,212,0.08)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.625rem' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#9B6FD4', letterSpacing: '0.08em' }}>
                  ✦ NUPPA propone {detectedProposals.length} cambio{detectedProposals.length > 1 ? 's' : ''}
                </span>
                <button onClick={() => setDetectedProposals([])} style={{ background: 'none', border: 'none', color: 'rgba(240,235,225,0.3)', cursor: 'pointer', fontSize: '1rem', padding: 0 }}>×</button>
              </div>
              <div style={{ marginBottom: '0.625rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {detectedProposals.map((dp, i) => (
                  <div key={i} style={{ fontSize: '0.68rem', fontFamily: 'monospace', lineHeight: 1.5 }}>
                    <div style={{ fontSize: '0.6rem', color: '#9B6FD4', fontWeight: 700, marginBottom: '2px', fontFamily: 'IBM Plex Sans, sans-serif' }}>{dp.scene_ref}</div>
                    <div style={{ background: 'rgba(212,37,106,0.08)', borderLeft: '2px solid rgba(212,37,106,0.35)', padding: '4px 7px', color: 'rgba(240,235,225,0.4)', textDecoration: 'line-through', marginBottom: '2px' }}>
                      {dp.original_text.substring(0, 80)}{dp.original_text.length > 80 ? '...' : ''}
                    </div>
                    <div style={{ background: 'rgba(78,205,196,0.07)', borderLeft: '2px solid rgba(78,205,196,0.35)', padding: '4px 7px', color: 'rgba(240,235,225,0.8)' }}>
                      {dp.proposed_text.substring(0, 80)}{dp.proposed_text.length > 80 ? '...' : ''}
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button onClick={saveDetectedProposal} disabled={savingProposal} style={{ flex: 1, padding: '7px', background: 'rgba(155,111,212,0.2)', border: '1px solid rgba(155,111,212,0.4)', borderRadius: '4px', color: '#9B6FD4', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'IBM Plex Sans, sans-serif' }}>
                  {savingProposal ? 'Guardando...' : `✦ Guardar ${detectedProposals.length} propuesta${detectedProposals.length > 1 ? 's' : ''}`}
                </button>
                <button onClick={() => setDetectedProposals([])} style={{ padding: '7px 12px', background: 'transparent', border: '1px solid rgba(240,235,225,0.08)', borderRadius: '4px', color: 'rgba(240,235,225,0.3)', fontSize: '0.75rem', cursor: 'pointer', fontFamily: 'IBM Plex Sans, sans-serif' }}>
                  Ignorar
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
        )}
      </div>

      {/* ── REWRITE PLAN MODAL ─────────────────────────────────────────────── */}
      {(rewriteResult || rewriteError) && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(4,2,12,0.88)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
          <div style={{ width: '100%', maxWidth: 760, maxHeight: '88vh', background: '#0A0816', border: '1px solid rgba(212,37,106,0.25)', borderRadius: 14, display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 32px 80px rgba(0,0,0,0.7)' }}>

            {/* Header */}
            <div style={{ padding: '1.5rem 2rem 1.25rem', borderBottom: '1px solid rgba(240,235,225,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
              <div>
                <div style={{ fontFamily: 'Bebas Neue, Impact, sans-serif', fontSize: '1.4rem', letterSpacing: '0.1em', color: '#D4256A' }}>
                  PLAN DE REESCRITURA — NUPPA
                </div>
                {rewriteResult && (
                  <div style={{ fontSize: '0.75rem', color: 'rgba(240,235,225,0.45)', marginTop: 3 }}>
                    {rewriteResult.findings_addressed} hallazgos abordados · Revisa qué va a cambiar antes de aplicar
                  </div>
                )}
              </div>
              <button onClick={() => { setRewriteResult(null); setRewriteError('') }}
                style={{ background: 'none', border: '1px solid rgba(240,235,225,0.12)', borderRadius: 6, color: 'rgba(240,235,225,0.45)', cursor: 'pointer', padding: '6px 12px', fontSize: '0.75rem', fontFamily: 'IBM Plex Sans, sans-serif' }}>
                Cancelar
              </button>
            </div>

            {/* Error state */}
            {rewriteError && (
              <div style={{ padding: '2rem', color: '#D4256A', fontSize: '0.875rem' }}>
                {rewriteError}
              </div>
            )}

            {/* Plan content */}
            {rewriteResult && (
              <div style={{ flex: 1, overflowY: 'auto', padding: '1.75rem 2rem' }}>

                {/* Summary */}
                <div style={{ background: 'rgba(212,37,106,0.06)', border: '1px solid rgba(212,37,106,0.15)', borderRadius: 8, padding: '1rem 1.25rem', marginBottom: '1.5rem' }}>
                  <div style={{ fontSize: '0.6rem', fontFamily: 'IBM Plex Mono, monospace', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(212,37,106,0.6)', marginBottom: 6 }}>Resumen editorial</div>
                  <div style={{ fontSize: '0.875rem', color: 'rgba(240,235,225,0.82)', lineHeight: 1.6 }}>{rewriteResult.plan.summary}</div>
                  {rewriteResult.plan.expected_improvement && (
                    <div style={{ marginTop: 10, fontSize: '0.78rem', fontWeight: 700, color: '#4ECDC4' }}>{rewriteResult.plan.expected_improvement}</div>
                  )}
                </div>

                {/* Scene-level changes */}
                {rewriteResult.plan.changes.length > 0 && (
                  <div style={{ marginBottom: '1.5rem' }}>
                    <div style={{ fontFamily: 'Bebas Neue, Impact, sans-serif', fontSize: '0.85rem', letterSpacing: '0.14em', color: 'rgba(240,235,225,0.4)', marginBottom: '0.875rem' }}>
                      CAMBIOS POR ESCENA
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {rewriteResult.plan.changes.map((ch, i) => (
                        <div key={i} style={{ background: 'rgba(240,235,225,0.03)', border: '1px solid rgba(240,235,225,0.07)', borderRadius: 8, padding: '0.875rem 1rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                            <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.65rem', color: '#9B6FD4', background: 'rgba(155,111,212,0.12)', padding: '2px 7px', borderRadius: 3 }}>{ch.scene_ref}</span>
                            <span style={{ fontSize: '0.72rem', color: 'rgba(240,235,225,0.5)', flex: 1 }}>{ch.finding_title}</span>
                            {ch.dimensions?.map(d => (
                              <span key={d} style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.55rem', color: 'rgba(78,205,196,0.6)', background: 'rgba(78,205,196,0.06)', padding: '1px 5px', borderRadius: 2 }}>{d}</span>
                            ))}
                          </div>
                          <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'rgba(240,235,225,0.88)', marginBottom: 4 }}>{ch.what_changes}</div>
                          <div style={{ fontSize: '0.75rem', color: 'rgba(240,235,225,0.48)', lineHeight: 1.5 }}>{ch.why}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Removals */}
                {rewriteResult.plan.removals.length > 0 && (
                  <div style={{ marginBottom: '1.25rem' }}>
                    <div style={{ fontFamily: 'Bebas Neue, Impact, sans-serif', fontSize: '0.85rem', letterSpacing: '0.14em', color: 'rgba(240,235,225,0.4)', marginBottom: '0.75rem' }}>
                      SE ELIMINA
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {rewriteResult.plan.removals.map((r, i) => (
                        <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                          <span style={{ color: '#D4256A', marginTop: 2, flexShrink: 0, fontSize: '0.7rem' }}>−</span>
                          <span style={{ fontSize: '0.8rem', color: 'rgba(240,235,225,0.62)', lineHeight: 1.5 }}>{r}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Additions */}
                {rewriteResult.plan.additions.length > 0 && (
                  <div style={{ marginBottom: '1.25rem' }}>
                    <div style={{ fontFamily: 'Bebas Neue, Impact, sans-serif', fontSize: '0.85rem', letterSpacing: '0.14em', color: 'rgba(240,235,225,0.4)', marginBottom: '0.75rem' }}>
                      SE AGREGA
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {rewriteResult.plan.additions.map((a, i) => (
                        <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                          <span style={{ color: '#4ECDC4', marginTop: 2, flexShrink: 0, fontSize: '0.7rem' }}>+</span>
                          <span style={{ fontSize: '0.8rem', color: 'rgba(240,235,225,0.62)', lineHeight: 1.5 }}>{a}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Footer CTA */}
            {rewriteResult && (
              <div style={{ padding: '1.25rem 2rem', borderTop: '1px solid rgba(240,235,225,0.07)', display: 'flex', gap: 12, justifyContent: 'flex-end', flexShrink: 0 }}>
                <button onClick={() => { setRewriteResult(null); setRewriteError('') }}
                  style={{ padding: '10px 20px', background: 'transparent', border: '1px solid rgba(240,235,225,0.14)', borderRadius: 7, color: 'rgba(240,235,225,0.55)', cursor: 'pointer', fontSize: '0.82rem', fontFamily: 'IBM Plex Sans, sans-serif' }}>
                  Descartar
                </button>
                <button onClick={applyRewrite} disabled={applyingRewrite}
                  style={{ padding: '10px 24px', background: applyingRewrite ? 'rgba(212,37,106,0.3)' : '#D4256A', border: 'none', borderRadius: 7, color: '#fff', cursor: applyingRewrite ? 'not-allowed' : 'pointer', fontSize: '0.82rem', fontWeight: 700, fontFamily: 'IBM Plex Sans, sans-serif', display: 'flex', alignItems: 'center', gap: 8 }}>
                  {applyingRewrite
                    ? <><svg width="13" height="13" viewBox="0 0 32 32" style={{ animation: 'spin 1s linear infinite' }}><circle cx="16" cy="16" r="12" stroke="currentColor" strokeWidth="3" fill="none" opacity=".3"/><path d="M16 4 A12 12 0 0 1 28 16" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round"/></svg> Aplicando...</>
                    : 'Aplicar reescritura y reevaluar'
                  }
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  )
}
