'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { WORKFLOWS, PHASES, type Workflow } from '@/lib/workflows-data'
import { AGENTS, WORKFLOW_AGENTS, type Agent } from '@/lib/agents-data'

const PHASE_NAMES: Record<string, string> = {
  '00_Concepto': 'Concepto',
  '01_Desarrollo': 'Desarrollo',
  '02_PreProduccion': 'Pre-Producción',
  '03_Produccion': 'Producción',
  '04_PostProduccion': 'Post-Producción',
  '05_Revision': 'Revisión',
  '06_Lanzamiento': 'Lanzamiento',
  '07_Expansion': 'Expansión',
  '08_Iteracion': 'Iteración',
  '09_Sistema': 'Sistema',
}

const DEPT_ORDER = ['Dirección', 'Narrativa', 'Arte Visual', 'Animación', 'Audio', 'Post-Producción']

// ── Agent Modal ──────────────────────────────────────────────────────────────
function AgentModal({ agent, onClose }: { agent: Agent; onClose: () => void }) {
  const router = useRouter()

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      style={{ background: 'rgba(0,0,0,0.78)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className="flex flex-col w-full rounded-sm overflow-hidden"
        style={{
          maxWidth: 680,
          maxHeight: '84vh',
          background: 'var(--color-bg-deep)',
          border: '1px solid var(--border-hover)',
          boxShadow: '0 28px 80px rgba(0,0,0,0.85)',
        }}
      >
        {/* Top dept stripe */}
        <div style={{ height: 3, background: agent.deptColor, flexShrink: 0 }} />

        {/* Header */}
        <div
          className="flex items-start gap-4 flex-shrink-0"
          style={{ padding: '20px 24px 16px', borderBottom: '1px solid var(--border-subtle)' }}
        >
          <div className="flex-1 min-w-0">
            <div style={{
              fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em',
              color: agent.deptColor, marginBottom: 6,
            }}>
              {agent.department}
            </div>
            <div style={{
              fontFamily: 'var(--font-display)', fontSize: 20, letterSpacing: '0.06em',
              lineHeight: 1, marginBottom: 6, color: 'var(--color-text-primary)',
            }}>
              {agent.name.toUpperCase()}
            </div>
            {agent.tagline && (
              <div style={{ fontSize: 12, color: 'var(--color-text-muted)', fontStyle: 'italic', lineHeight: 1.5 }}>
                {agent.tagline}
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none', border: '1px solid var(--border-subtle)',
              color: 'var(--color-text-muted)', fontSize: 13, cursor: 'pointer',
              padding: '6px 12px', borderRadius: 2, fontFamily: 'var(--font-body)',
              flexShrink: 0,
            }}
            onMouseEnter={e => { (e.target as HTMLElement).style.borderColor = 'var(--border-hover)'; (e.target as HTMLElement).style.color = 'var(--color-text-primary)' }}
            onMouseLeave={e => { (e.target as HTMLElement).style.borderColor = 'var(--border-subtle)'; (e.target as HTMLElement).style.color = 'var(--color-text-muted)' }}
          >
            ✕ Cerrar
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto" style={{ padding: '20px 24px' }}>
          {agent.mission && (
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', color: agent.deptColor, marginBottom: 8 }}>
                Misión
              </div>
              <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
                {agent.mission}
              </div>
            </div>
          )}

          {agent.specialization && agent.specialization !== agent.mission && (
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', color: agent.deptColor, marginBottom: 8 }}>
                Especialización
              </div>
              <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
                {agent.specialization}
              </div>
            </div>
          )}

          {(agent.collaboration.works_with.length > 0 || agent.collaboration.receives_from.length > 0 || agent.collaboration.delivers_to.length > 0) && (
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', color: agent.deptColor, marginBottom: 8 }}>
                Colaboración
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {agent.collaboration.works_with.length > 0 && (
                  <div style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>
                    <span style={{ color: 'var(--color-text-muted)', fontWeight: 600 }}>Trabaja con: </span>
                    {agent.collaboration.works_with.join(', ')}
                  </div>
                )}
                {agent.collaboration.receives_from.length > 0 && (
                  <div style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>
                    <span style={{ color: 'var(--color-text-muted)', fontWeight: 600 }}>Recibe de: </span>
                    {agent.collaboration.receives_from.join(', ')}
                  </div>
                )}
                {agent.collaboration.delivers_to.length > 0 && (
                  <div style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>
                    <span style={{ color: 'var(--color-text-muted)', fontWeight: 600 }}>Entrega a: </span>
                    {agent.collaboration.delivers_to.join(', ')}
                  </div>
                )}
              </div>
            </div>
          )}

          {agent.neverDoes.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', color: '#E74C3C', marginBottom: 8 }}>
                Lo que NUNCA hace
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {agent.neverDoes.map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: 8, fontSize: 12, color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
                    <span style={{ color: '#E74C3C', flexShrink: 0, marginTop: 1 }}>—</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {agent.referenceFiles.length > 0 && (
            <div>
              <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--color-text-faint)', marginBottom: 8 }}>
                Archivos de Referencia
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {agent.referenceFiles.map((f, i) => (
                  <div key={i} style={{
                    fontSize: 10, color: 'var(--color-text-faint)', fontFamily: 'monospace',
                    background: 'var(--color-bg-black)', padding: '3px 8px', borderRadius: 2,
                  }}>
                    {f}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className="flex items-center gap-3 flex-shrink-0"
          style={{ padding: '14px 24px', borderTop: '1px solid var(--border-subtle)' }}
        >
          <button
            onClick={() => router.push(`/studio?context=${agent.studioContext}`)}
            style={{
              padding: '10px 22px',
              background: 'var(--color-gold)', color: '#000',
              border: 'none', borderRadius: 2,
              fontSize: 10, fontWeight: 700, cursor: 'pointer',
              fontFamily: 'var(--font-body)', textTransform: 'uppercase', letterSpacing: '0.1em',
            }}
          >
            Activar en Asistente →
          </button>
          <span style={{ fontSize: 11, color: 'var(--color-text-faint)' }}>
            El asistente se abre con el modo {agent.studioContext} activado
          </span>
        </div>

        {/* Bottom dept accent */}
        <div style={{ height: 2, background: agent.deptColor, flexShrink: 0 }} />
      </div>
    </div>
  )
}

// ── Agent Card ────────────────────────────────────────────────────────────────
function AgentCard({
  agent, onViewProfile, isFirst,
}: {
  agent: Agent
  onViewProfile: (a: Agent) => void
  isFirst?: boolean
}) {
  const router = useRouter()
  const [hovered, setHovered] = useState(false)

  return (
    <div
      data-tutorial={isFirst ? 'agent-card' : undefined}
      style={{
        background: hovered ? 'var(--color-bg-dark)' : 'var(--color-bg-black)',
        border: '1px solid var(--border-subtle)',
        overflow: 'hidden',
        transition: 'background .15s',
        display: 'flex',
        flexDirection: 'column',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Dept color stripe */}
      <div style={{ height: 3, background: agent.deptColor, flexShrink: 0 }} />

      {/* Body */}
      <div style={{ padding: '18px 20px 16px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div style={{
          fontSize: 9, fontWeight: 700, textTransform: 'uppercase',
          letterSpacing: '0.2em', color: agent.deptColor, marginBottom: 10,
        }}>
          {agent.department}
        </div>
        <div style={{
          fontSize: 13, fontWeight: 600, marginBottom: 6, lineHeight: 1.3,
          color: 'var(--color-text-primary)', flex: 1,
        }}>
          {agent.name}
        </div>
        {agent.tagline && (
          <div style={{
            fontSize: 11, color: 'var(--color-text-muted)', lineHeight: 1.5,
            fontStyle: 'italic', marginBottom: 12,
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          } as React.CSSProperties}>
            {agent.tagline}
          </div>
        )}
        {agent.collaboration.works_with.length > 0 && (
          <div style={{ fontSize: 10, color: 'var(--color-text-faint)', marginBottom: 14, lineHeight: 1.5 }}>
            <span style={{ fontWeight: 600 }}>Trabaja con: </span>
            {agent.collaboration.works_with.slice(0, 3).join(', ')}
            {agent.collaboration.works_with.length > 3 ? '…' : ''}
          </div>
        )}

        {/* Buttons */}
        <div style={{ display: 'flex', gap: 7 }}>
          <button
            onClick={() => onViewProfile(agent)}
            style={{
              flex: 1, padding: '7px 10px',
              background: 'transparent',
              border: '1px solid var(--border-hover)', borderRadius: 2,
              color: 'var(--color-text-muted)',
              fontSize: 10, fontWeight: 600, cursor: 'pointer',
              fontFamily: 'var(--font-body)', textTransform: 'uppercase', letterSpacing: '0.07em',
              transition: 'all .15s',
            }}
            onMouseEnter={e => { (e.target as HTMLElement).style.color = 'var(--color-text-primary)'; (e.target as HTMLElement).style.borderColor = 'var(--color-text-muted)' }}
            onMouseLeave={e => { (e.target as HTMLElement).style.color = 'var(--color-text-muted)'; (e.target as HTMLElement).style.borderColor = 'var(--border-hover)' }}
          >
            Ver perfil
          </button>
          <button
            onClick={() => router.push(`/studio?context=${agent.studioContext}`)}
            style={{
              flex: 1, padding: '7px 10px',
              background: 'transparent',
              border: `1px solid ${agent.deptColor}60`, borderRadius: 2,
              color: agent.deptColor,
              fontSize: 10, fontWeight: 700, cursor: 'pointer',
              fontFamily: 'var(--font-body)', textTransform: 'uppercase', letterSpacing: '0.07em',
              transition: 'all .15s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = `${agent.deptColor}15`; (e.currentTarget as HTMLElement).style.borderColor = agent.deptColor }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.borderColor = `${agent.deptColor}60` }}
          >
            Activar →
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Agents Tab ────────────────────────────────────────────────────────────────
function AgentsTab() {
  const [activeAgent, setActiveAgent] = useState<Agent | null>(null)
  const [activeDept, setActiveDept] = useState<string | null>(null)

  const depts = DEPT_ORDER.filter(d => AGENTS.some(a => a.department === d))

  const filtered = useMemo(() => {
    if (!activeDept) return AGENTS
    return AGENTS.filter(a => a.department === activeDept)
  }, [activeDept])

  const grouped = useMemo(() => {
    if (activeDept) return null
    const map: Record<string, Agent[]> = {}
    for (const a of AGENTS) {
      if (!map[a.department]) map[a.department] = []
      map[a.department].push(a)
    }
    return map
  }, [activeDept])

  return (
    <>
      {activeAgent && (
        <AgentModal agent={activeAgent} onClose={() => setActiveAgent(null)} />
      )}

      {/* Dept filter pills */}
      <div style={{ padding: '0 36px 28px', display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        <button
          onClick={() => setActiveDept(null)}
          style={{
            padding: '7px 14px', borderRadius: 2, fontSize: 10, fontWeight: 700,
            cursor: 'pointer', fontFamily: 'var(--font-body)', textTransform: 'uppercase', letterSpacing: '0.08em',
            border: activeDept === null ? '1px solid var(--color-gold)' : '1px solid var(--border-subtle)',
            background: activeDept === null ? 'rgba(245,165,42,0.1)' : 'transparent',
            color: activeDept === null ? 'var(--color-gold)' : 'var(--color-text-muted)',
            transition: 'all .15s',
          }}
        >
          Todos
        </button>
        {depts.map(dept => {
          const sample = AGENTS.find(a => a.department === dept)!
          const active = activeDept === dept
          return (
            <button
              key={dept}
              onClick={() => setActiveDept(dept)}
              style={{
                padding: '7px 14px', borderRadius: 2, fontSize: 10, fontWeight: 700,
                cursor: 'pointer', fontFamily: 'var(--font-body)', textTransform: 'uppercase', letterSpacing: '0.08em',
                border: active ? `1px solid ${sample.deptColor}` : '1px solid var(--border-subtle)',
                background: active ? `${sample.deptColor}18` : 'transparent',
                color: active ? sample.deptColor : 'var(--color-text-muted)',
                transition: 'all .15s',
              }}
            >
              {dept}
            </button>
          )
        })}
      </div>

      {/* Content */}
      <div style={{ padding: '0 36px 60px' }}>
        {/* Filtered (single dept) */}
        {activeDept && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 1, background: 'var(--border-subtle)' }}>
            {filtered.map(a => (
              <AgentCard key={a.id} agent={a} onViewProfile={setActiveAgent} />
            ))}
          </div>
        )}

        {/* Grouped by dept (default) */}
        {grouped && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>
            {DEPT_ORDER.filter(d => grouped[d]?.length).map((dept, deptIdx) => {
              const deptAgents = grouped[dept]
              const color = deptAgents[0].deptColor
              return (
                <div key={dept}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                    <div>
                      <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, letterSpacing: '0.06em', color: 'var(--color-text-primary)', lineHeight: 1 }}>
                        {dept.toUpperCase()}
                      </div>
                      <div style={{ fontSize: 10, color: 'var(--color-text-faint)', marginTop: 3, textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 700 }}>
                        {deptAgents.length} agentes
                      </div>
                    </div>
                    <div style={{ flex: 1, height: 1, background: `linear-gradient(to right, ${color}40, transparent)`, marginLeft: 8 }} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 1, background: 'var(--border-subtle)' }}>
                    {deptAgents.map((a, i) => (
                      <AgentCard
                        key={a.id}
                        agent={a}
                        onViewProfile={setActiveAgent}
                        isFirst={deptIdx === 0 && i === 0}
                      />
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </>
  )
}

// ── Workflow Modal ────────────────────────────────────────────────────────────
function WorkflowModal({ workflow, onClose }: { workflow: Workflow; onClose: () => void }) {
  const [copied, setCopied] = useState(false)
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null)

  const relatedAgents = useMemo(() => {
    const ids = WORKFLOW_AGENTS[workflow.id] ?? []
    return ids.map(id => AGENTS.find(a => a.id === id)).filter(Boolean) as Agent[]
  }, [workflow.id])

  const prompt = useMemo(() => {
    const agentBlock = selectedAgent
      ? `# Agente Activo: ${selectedAgent.name}
> ${selectedAgent.tagline}

## Misión
${selectedAgent.mission.trim()}

## Especialización
${selectedAgent.specialization.trim()}
${selectedAgent.neverDoes.length > 0 ? `
## Lo que NUNCA hace este agente
${selectedAgent.neverDoes.map(d => `- ${d}`).join('\n')}
` : ''}
---

`
      : ''

    const refsBlock = workflow.knowledgeRefs.length
      ? `\n## Archivos de Knowledge a leer antes de empezar:\n${workflow.knowledgeRefs.map(r => `- \`${r}\``).join('\n')}\n`
      : ''

    return `${agentBlock}# Ejecutar Workflow: ${workflow.title}
## Fase de producción: ${workflow.phaseName}
${refsBlock}
## Contexto del sistema (consultar antes de empezar):
- Estilo maestro: \`Productions/Serie_01/Memory/Style/master_style.md\`
- Estado de personajes: \`Productions/Serie_01/Memory/Continuity/states/character_states.md\`
- Estado de locaciones: \`Productions/Serie_01/Memory/Continuity/states/location_states.md\`
- Biblia viva: \`Productions/Serie_01/Bible/BIBLIA_VIVA.md\`

---

${workflow.content}`
  }, [workflow, selectedAgent])

  function copy() {
    navigator.clipboard.writeText(prompt).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2200)
      window.dispatchEvent(new CustomEvent('tutorial:workflow_copied'))
    })
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      style={{ background: 'rgba(0,0,0,0.78)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className="flex flex-col w-full rounded-sm overflow-hidden"
        style={{
          maxWidth: 760,
          maxHeight: '84vh',
          background: 'var(--color-bg-deep)',
          border: '1px solid var(--border-hover)',
          boxShadow: '0 28px 80px rgba(0,0,0,0.85)',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center gap-4 flex-shrink-0"
          style={{ padding: '20px 24px 16px', borderBottom: '1px solid var(--border-subtle)' }}
        >
          <div style={{ fontSize: 32, lineHeight: 1 }}>{workflow.phaseIcon}</div>
          <div className="flex-1 min-w-0">
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, letterSpacing: '0.06em', lineHeight: 1, marginBottom: 5, color: 'var(--color-text-primary)' }}>
              {workflow.title.toUpperCase()}
            </div>
            <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', color: workflow.phaseColor }}>
              {workflow.phaseName}
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none', border: '1px solid var(--border-subtle)',
              color: 'var(--color-text-muted)', fontSize: 13, cursor: 'pointer',
              padding: '6px 12px', borderRadius: 2, fontFamily: 'var(--font-body)',
              transition: 'all .15s',
            }}
            onMouseEnter={e => { (e.target as HTMLElement).style.borderColor = 'var(--border-hover)'; (e.target as HTMLElement).style.color = 'var(--color-text-primary)' }}
            onMouseLeave={e => { (e.target as HTMLElement).style.borderColor = 'var(--border-subtle)'; (e.target as HTMLElement).style.color = 'var(--color-text-muted)' }}
          >
            ✕ Cerrar
          </button>
        </div>

        {/* Agent chips */}
        {relatedAgents.length > 0 && (
          <div style={{ padding: '12px 24px', borderBottom: '1px solid var(--border-subtle)', background: 'rgba(255,255,255,0.01)', flexShrink: 0 }}>
            <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--color-text-faint)', marginBottom: 8 }}>
              Ejecutar con agente (opcional)
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {relatedAgents.map(agent => {
                const active = selectedAgent?.id === agent.id
                return (
                  <button
                    key={agent.id}
                    onClick={() => setSelectedAgent(active ? null : agent)}
                    style={{
                      padding: '5px 12px', borderRadius: 2,
                      fontSize: 10, fontWeight: 600, cursor: 'pointer',
                      fontFamily: 'var(--font-body)', letterSpacing: '0.05em',
                      border: active ? `1px solid ${agent.deptColor}` : '1px solid var(--border-subtle)',
                      background: active ? `${agent.deptColor}18` : 'transparent',
                      color: active ? agent.deptColor : 'var(--color-text-muted)',
                      transition: 'all .15s',
                    }}
                  >
                    {active ? '✓ ' : ''}{agent.name}
                  </button>
                )
              })}
            </div>
            {selectedAgent && (
              <div style={{ marginTop: 6, fontSize: 10, color: 'var(--color-text-faint)', fontStyle: 'italic' }}>
                El prompt incluirá el perfil de {selectedAgent.name} como contexto de agente.
              </div>
            )}
          </div>
        )}

        {/* Body */}
        <div className="flex-1 overflow-y-auto" style={{ padding: '20px 24px' }}>
          <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--color-gold)', marginBottom: 10 }}>
            Prompt listo para ejecutar
          </div>
          <p style={{ fontSize: 11, color: 'var(--color-text-muted)', marginBottom: 14, lineHeight: 1.6 }}>
            {selectedAgent
              ? <>Incluye el perfil de <strong style={{ color: selectedAgent.deptColor }}>{selectedAgent.name}</strong> + workflow completo + contexto del estudio.</>
              : <>Incluye el workflow completo + archivos de contexto del estudio ya referenciados.</>
            }<br />
            Cópialo y pégalo en el asistente.
          </p>
          <pre style={{
            background: 'var(--color-bg-black)', border: '1px solid var(--border-subtle)',
            borderRadius: 2, padding: 16, fontSize: 11.5, color: 'var(--color-text-secondary)',
            lineHeight: 1.7, whiteSpace: 'pre-wrap', fontFamily: 'monospace',
            maxHeight: 320, overflowY: 'auto', marginBottom: 4,
          }}>
            {prompt}
          </pre>
        </div>

        {/* Footer */}
        <div
          className="flex items-center gap-3 flex-shrink-0"
          style={{ padding: '14px 24px', borderTop: '1px solid var(--border-subtle)' }}
        >
          <button
            onClick={copy}
            style={{
              padding: '10px 22px',
              background: copied ? 'var(--color-bg-surface)' : 'var(--color-gold)',
              color: copied ? 'var(--color-text-muted)' : '#000',
              border: 'none', borderRadius: 2,
              fontSize: 10, fontWeight: 700, cursor: 'pointer',
              fontFamily: 'var(--font-body)', textTransform: 'uppercase', letterSpacing: '0.1em',
              transition: 'all .2s',
            }}
          >
            {copied ? '✓ Copiado' : 'Copiar para el asistente'}
          </button>
          <span style={{ fontSize: 11, color: 'var(--color-text-faint)' }}>
            {selectedAgent
              ? `${selectedAgent.name} + ${workflow.title} — listo para pegar`
              : 'Pega esto en el chat — el workflow se ejecuta con todo el contexto del estudio cargado'
            }
          </span>
        </div>
      </div>
    </div>
  )
}

// ── Workflow Card ────────────────────────────────────────────────────────────
function WorkflowCard({ workflow, onUse, isFirst }: { workflow: Workflow; onUse: (w: Workflow) => void; isFirst?: boolean }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      data-tutorial={isFirst ? 'workflow-card' : undefined}
      style={{
        background: hovered ? 'var(--color-bg-dark)' : 'var(--color-bg-black)',
        border: '1px solid var(--border-subtle)',
        overflow: 'hidden',
        transition: 'background .15s',
        display: 'flex',
        flexDirection: 'column',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Color stripe */}
      <div style={{ height: 3, background: workflow.phaseColor, flexShrink: 0 }} />

      {/* Body */}
      <div style={{ padding: '18px 20px 16px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', color: workflow.phaseColor, marginBottom: 12 }}>
          {workflow.phaseIcon} {workflow.phaseName}
        </div>
        <div style={{ fontSize: 26, lineHeight: 1, marginBottom: 10 }}>{workflow.phaseIcon}</div>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 7, lineHeight: 1.3, color: 'var(--color-text-primary)', flex: 1 }}>
          {workflow.title}
        </div>
        <div style={{
          fontSize: 11, color: 'var(--color-text-secondary)', lineHeight: 1.5,
          display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical',
          overflow: 'hidden', marginBottom: 14,
        } as React.CSSProperties}>
          {workflow.description || 'Sin descripción'}
        </div>

        {/* Button */}
        <div style={{ display: 'flex', gap: 7 }}>
          <button
            data-tutorial={isFirst ? 'workflow-use-btn' : undefined}
            onClick={() => {
              onUse(workflow)
              window.dispatchEvent(new CustomEvent('tutorial:workflow_opened'))
            }}
            style={{
              flex: 1, padding: '8px 10px',
              background: 'var(--color-gold)', color: '#000',
              border: 'none', borderRadius: 2,
              fontSize: 10, fontWeight: 700, cursor: 'pointer',
              fontFamily: 'var(--font-body)', textTransform: 'uppercase', letterSpacing: '0.07em',
              transition: 'opacity .15s',
            }}
            onMouseEnter={e => { (e.target as HTMLElement).style.opacity = '0.85' }}
            onMouseLeave={e => { (e.target as HTMLElement).style.opacity = '1' }}
          >
            ⚡ Usar Workflow
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Featured actions ──────────────────────────────────────────────────────────
const FEATURED_ACTIONS = [
  {
    id: 'disenar_protagonista',
    label: 'Crear un personaje',
    desc: 'Diseñar un personaje nuevo con perfil narrativo y visual completo.',
    agents: ['Director Narrativo', 'Diseñador de Personajes'],
  },
  {
    id: 'guion_de_episodio',
    label: 'Escribir un guión',
    desc: 'Crear el guión de un episodio desde la escaleta hasta el guión final.',
    agents: ['Director Narrativo', 'Escritor Principal'],
  },
  {
    id: 'disenar_escenarios',
    label: 'Diseñar un escenario',
    desc: 'Crear una nueva locación con perfil visual, paleta y canon gráfico.',
    agents: ['Director de Arte', 'Diseñador de Fondos'],
  },
  {
    id: 'hoja_de_expresiones',
    label: 'Generar concept art',
    desc: 'Crear una pieza gráfica usando la memoria visual de la serie.',
    agents: ['Director de Arte', 'Colorista'],
  },
  {
    id: 'revision_episodio',
    label: 'Revisar algo',
    desc: 'Evaluar cualquier entregable con el sistema de revisión en 6 dimensiones.',
    agents: ['Review Board', 'Director Creativo'],
  },
]

function FeaturedSection({ onUse }: { onUse: (w: Workflow) => void }) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)

  function handleClick(actionId: string) {
    const workflow = WORKFLOWS.find(w => w.id === actionId)
    if (workflow) onUse(workflow)
  }

  return (
    <div style={{ padding: '48px 36px 0' }}>
      <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.3em', color: 'var(--color-gold)', marginBottom: 12 }}>
        Studio de Animación — Serie 01
      </div>
      <div style={{
        fontFamily: 'var(--font-display)',
        fontSize: 'clamp(52px, 8vw, 88px)',
        lineHeight: 0.88,
        letterSpacing: '0.01em',
        color: 'var(--color-text-primary)',
        marginBottom: 20,
      }}>
        QUÉ QUIERES<br />CREAR HOY
      </div>
      <div style={{ height: 2, background: 'var(--color-gold)', maxWidth: 160, marginBottom: 40 }} />

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {FEATURED_ACTIONS.map((action, idx) => {
          const hovered = hoveredIdx === idx
          return (
            <button
              key={action.id}
              onClick={() => handleClick(action.id)}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 28,
                padding: '22px 0',
                background: 'none',
                borderTop: '1px solid var(--border-subtle)',
                borderLeft: 'none',
                borderRight: 'none',
                borderBottom: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                width: '100%',
                transition: 'background .12s',
              }}
            >
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(18px, 2vw, 24px)',
                color: hovered ? 'var(--color-text-faint)' : 'rgba(255,255,255,0.12)',
                letterSpacing: '0.04em',
                minWidth: 48,
                lineHeight: 1,
                transition: 'color .12s',
              }}>
                {String(idx + 1).padStart(2, '0')}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(20px, 2.5vw, 28px)',
                  letterSpacing: '0.05em',
                  color: hovered ? 'var(--color-gold)' : 'var(--color-text-primary)',
                  lineHeight: 1,
                  marginBottom: 5,
                  transition: 'color .12s',
                }}>
                  {action.label.toUpperCase()}
                </div>
                <div style={{ fontSize: 12, color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
                  {action.desc}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                {action.agents.map(agent => (
                  <span key={agent} style={{
                    fontSize: 10, fontWeight: 600,
                    color: 'var(--color-text-faint)',
                    border: '1px solid var(--border-subtle)',
                    padding: '4px 8px',
                    letterSpacing: '0.05em',
                    whiteSpace: 'nowrap',
                    transition: 'border-color .12s, color .12s',
                    borderColor: hovered ? 'var(--border-hover)' : undefined,
                  }}>
                    {agent}
                  </span>
                ))}
              </div>
            </button>
          )
        })}
        <div style={{ borderTop: '1px solid var(--border-subtle)' }} />
      </div>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function WorkflowsPage() {
  const [activeTab, setActiveTab] = useState<'workflows' | 'agents'>('workflows')
  const [activePhase, setActivePhase] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [activeWorkflow, setActiveWorkflow] = useState<Workflow | null>(null)

  const phases = PHASES
  const filtered = useMemo(() => {
    let result = activePhase ? WORKFLOWS.filter(w => w.phase === activePhase) : WORKFLOWS
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(w =>
        w.title.toLowerCase().includes(q) ||
        w.description.toLowerCase().includes(q) ||
        w.phaseName.toLowerCase().includes(q)
      )
    }
    return result
  }, [activePhase, search])

  const grouped = useMemo(() => {
    if (activePhase || search.trim()) return null
    const map: Record<string, Workflow[]> = {}
    for (const w of WORKFLOWS) {
      if (!map[w.phase]) map[w.phase] = []
      map[w.phase].push(w)
    }
    return map
  }, [activePhase, search])

  return (
    <div style={{ height: '100%', overflowY: 'auto', background: 'var(--color-bg-black)' }}>
      {/* Workflow Modal */}
      {activeWorkflow && (
        <WorkflowModal
          key={activeWorkflow.id}
          workflow={activeWorkflow}
          onClose={() => setActiveWorkflow(null)}
        />
      )}

      {activeTab === 'workflows' && (
        <>
          {/* Featured — Qué quieres crear hoy */}
          <FeaturedSection onUse={setActiveWorkflow} />

          {/* Divider */}
          <div style={{ margin: '48px 36px 0', borderTop: '1px solid var(--border-subtle)', paddingTop: 48 }} />

          {/* Header + tabs */}
          <div style={{ padding: '0 36px 0' }}>
            <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.25em', color: 'var(--color-gold)', marginBottom: 10 }}>
              Sistema de Producción
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(40px, 6vw, 64px)', lineHeight: 0.92, letterSpacing: '0.02em', color: 'var(--color-text-primary)', marginBottom: 16 }}>
              WORKFLOWS
            </div>
            <div style={{ height: 2, background: 'linear-gradient(to right, var(--color-gold), transparent)', maxWidth: 280, marginBottom: 28 }} />
            <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginBottom: 28, maxWidth: 520, lineHeight: 1.6 }}>
              {WORKFLOWS.length} procesos de producción en {phases.length} fases. Selecciona un workflow y copia el prompt pre-cargado con el contexto del estudio.
            </p>

            {/* Tab switcher */}
            <div style={{ display: 'flex', gap: 0, marginBottom: 28, borderBottom: '1px solid var(--border-subtle)', width: 'fit-content' }}>
              <button
                onClick={() => setActiveTab('workflows')}
                style={{
                  padding: '8px 20px', background: 'none', border: 'none',
                  cursor: 'pointer', fontFamily: 'var(--font-body)',
                  fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
                  color: 'var(--color-gold)',
                  borderBottom: '2px solid var(--color-gold)',
                  marginBottom: -1,
                }}
              >
                ⚡ Workflows
              </button>
              <button
                data-tutorial="agents-tab"
                onClick={() => setActiveTab('agents')}
                style={{
                  padding: '8px 20px', background: 'none', border: 'none',
                  cursor: 'pointer', fontFamily: 'var(--font-body)',
                  fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
                  color: 'var(--color-text-muted)',
                  borderBottom: '2px solid transparent',
                  marginBottom: -1,
                  transition: 'color .15s',
                }}
                onMouseEnter={e => { (e.target as HTMLElement).style.color = 'var(--color-text-primary)' }}
                onMouseLeave={e => { (e.target as HTMLElement).style.color = 'var(--color-text-muted)' }}
              >
                👥 Equipo
              </button>
            </div>

            {/* Controls */}
            <div data-tutorial="workflow-phases" style={{ display: 'flex', gap: 10, marginBottom: 28, flexWrap: 'wrap' }}>
              <input
                type="text"
                placeholder="Buscar workflow..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{
                  padding: '8px 16px', background: 'transparent',
                  border: '1px solid var(--border-hover)', borderRadius: 2,
                  color: 'var(--color-text-primary)', fontSize: 12, outline: 'none',
                  fontFamily: 'var(--font-body)', width: 240,
                }}
              />
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                <button
                  onClick={() => { setActivePhase(null); setSearch('') }}
                  style={{
                    padding: '7px 14px', borderRadius: 2, fontSize: 10, fontWeight: 700,
                    cursor: 'pointer', fontFamily: 'var(--font-body)', textTransform: 'uppercase', letterSpacing: '0.08em',
                    border: activePhase === null && !search ? '1px solid var(--color-gold)' : '1px solid var(--border-subtle)',
                    background: activePhase === null && !search ? 'rgba(245,165,42,0.1)' : 'transparent',
                    color: activePhase === null && !search ? 'var(--color-gold)' : 'var(--color-text-muted)',
                    transition: 'all .15s',
                  }}
                >
                  Todos
                </button>
                {phases.map(p => {
                  const w = WORKFLOWS.find(w => w.phase === p)!
                  return (
                    <button
                      key={p}
                      onClick={() => { setActivePhase(p); setSearch('') }}
                      style={{
                        padding: '7px 14px', borderRadius: 2, fontSize: 10, fontWeight: 700,
                        cursor: 'pointer', fontFamily: 'var(--font-body)', textTransform: 'uppercase', letterSpacing: '0.08em',
                        border: activePhase === p ? `1px solid ${w.phaseColor}` : '1px solid var(--border-subtle)',
                        background: activePhase === p ? `${w.phaseColor}18` : 'transparent',
                        color: activePhase === p ? w.phaseColor : 'var(--color-text-muted)',
                        transition: 'all .15s',
                      }}
                    >
                      {w.phaseIcon} {PHASE_NAMES[p] || p}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Workflow content */}
          <div style={{ padding: '0 36px 60px' }}>
            {(activePhase || search.trim()) && (
              <div>
                {filtered.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--color-text-faint)', fontSize: 13 }}>
                    No hay resultados para tu búsqueda.
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 1, background: 'var(--border-subtle)' }}>
                    {filtered.map(w => (
                      <WorkflowCard key={w.id} workflow={w} onUse={setActiveWorkflow} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {grouped && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>
                {phases.map(phase => {
                  const phaseWorkflows = grouped[phase] || []
                  const sample = phaseWorkflows[0]
                  if (!sample) return null
                  return (
                    <div key={phase}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                        <div style={{ fontSize: 22 }}>{sample.phaseIcon}</div>
                        <div>
                          <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, letterSpacing: '0.06em', color: 'var(--color-text-primary)', lineHeight: 1 }}>
                            {sample.phaseName.toUpperCase()}
                          </div>
                          <div style={{ fontSize: 10, color: 'var(--color-text-faint)', marginTop: 3, textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 700 }}>
                            {phaseWorkflows.length} workflows
                          </div>
                        </div>
                        <div style={{ flex: 1, height: 1, background: `linear-gradient(to right, ${sample.phaseColor}40, transparent)`, marginLeft: 8 }} />
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 1, background: 'var(--border-subtle)' }}>
                        {phaseWorkflows.map((w, i) => (
                          <WorkflowCard key={w.id} workflow={w} onUse={setActiveWorkflow} isFirst={phase === phases[0] && i === 0} />
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </>
      )}

      {activeTab === 'agents' && (
        <>
          {/* Agents header */}
          <div style={{ padding: '48px 36px 0' }}>
            <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.25em', color: 'var(--color-gold)', marginBottom: 10 }}>
              Equipo del Estudio
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(40px, 6vw, 64px)', lineHeight: 0.92, letterSpacing: '0.02em', color: 'var(--color-text-primary)', marginBottom: 16 }}>
              AGENTES
            </div>
            <div style={{ height: 2, background: 'linear-gradient(to right, var(--color-gold), transparent)', maxWidth: 280, marginBottom: 28 }} />
            <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginBottom: 28, maxWidth: 520, lineHeight: 1.6 }}>
              {AGENTS.length} agentes especializados en 6 departamentos. Ver perfil completo o activar directamente en el Asistente.
            </p>

            {/* Tab switcher */}
            <div style={{ display: 'flex', gap: 0, marginBottom: 32, borderBottom: '1px solid var(--border-subtle)', width: 'fit-content' }}>
              <button
                onClick={() => setActiveTab('workflows')}
                style={{
                  padding: '8px 20px', background: 'none', border: 'none',
                  cursor: 'pointer', fontFamily: 'var(--font-body)',
                  fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
                  color: 'var(--color-text-muted)',
                  borderBottom: '2px solid transparent',
                  marginBottom: -1,
                  transition: 'color .15s',
                }}
                onMouseEnter={e => { (e.target as HTMLElement).style.color = 'var(--color-text-primary)' }}
                onMouseLeave={e => { (e.target as HTMLElement).style.color = 'var(--color-text-muted)' }}
              >
                ⚡ Workflows
              </button>
              <button
                data-tutorial="agents-tab"
                onClick={() => setActiveTab('agents')}
                style={{
                  padding: '8px 20px', background: 'none', border: 'none',
                  cursor: 'pointer', fontFamily: 'var(--font-body)',
                  fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
                  color: 'var(--color-gold)',
                  borderBottom: '2px solid var(--color-gold)',
                  marginBottom: -1,
                }}
              >
                👥 Equipo
              </button>
            </div>
          </div>

          <AgentsTab />
        </>
      )}
    </div>
  )
}
