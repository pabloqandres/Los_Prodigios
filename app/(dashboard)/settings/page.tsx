'use client'

import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { useState, useEffect, useCallback } from 'react'

type IntegrationStatus = 'connected' | 'disconnected' | 'partial'

interface SystemStatus {
  anthropic: { status: IntegrationStatus; label: string }
  drive:     { status: IntegrationStatus; label: string }
  supabase:  { status: IntegrationStatus; label: string }
}

interface UserRow {
  email: string
  role: 'admin' | 'member'
  created_at: string
}

const STATUS_COLOR: Record<IntegrationStatus, string> = {
  connected:    '#4ECDC4',
  disconnected: 'rgba(240,235,225,0.25)',
  partial:      '#F5A52A',
}

const STATUS_BG: Record<IntegrationStatus, string> = {
  connected:    'rgba(78,205,196,0.08)',
  disconnected: 'rgba(255,255,255,0.04)',
  partial:      'rgba(245,165,42,0.08)',
}

const INTEGRATIONS = [
  { key: 'anthropic' as const, name: 'Anthropic API',  description: 'Motor de IA para el asistente de producción' },
  { key: 'supabase'  as const, name: 'Supabase',        description: 'Base de datos para documentos, logs y usuarios' },
  { key: 'drive'     as const, name: 'Google Drive',    description: 'Biblioteca de assets de la producción' },
]

const label = {
  label: { fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '0.6875rem', letterSpacing: '0.16em', textTransform: 'uppercase' as const, color: 'rgba(240,235,225,0.28)', marginBottom: '1rem' },
  card:  { background: '#120D28', border: '1px solid rgba(245,165,42,0.07)', borderRadius: '2px' },
}

// ── Generate Llamado modal ────────────────────────────────────────────────────
function GenerarLlamadoModal({ onClose }: { onClose: () => void }) {
  const [nombre, setNombre]   = useState('')
  const [rol, setRol]         = useState('')
  const [email, setEmail]     = useState('')
  const [roleVal, setRoleVal] = useState<'admin' | 'member'>('member')
  const [link, setLink]       = useState('')
  const [copied, setCopied]   = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  async function copyLink() {
    await navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  async function generate() {
    if (!nombre.trim() || !email.trim()) return
    setLoading(true)
    setError('')
    const res = await fetch('/api/invitations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre: nombre.trim(), rol: rol.trim(), email: email.trim(), role: roleVal }),
    })
    const data = await res.json()
    if (!res.ok) { setError(data.error ?? 'Error'); setLoading(false); return }
    const base = typeof window !== 'undefined' ? window.location.origin : 'https://studioos-lake.vercel.app'
    setLink(`${base}/llamado?t=${data.token}`)
    setLoading(false)
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', boxSizing: 'border-box',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(198,149,42,0.15)',
    borderRadius: '2px', padding: '0.5625rem 0.75rem',
    color: '#F0EBE1', fontSize: '0.875rem',
    fontFamily: 'IBM Plex Sans, sans-serif', outline: 'none',
  }
  const labelStyle: React.CSSProperties = {
    fontSize: '0.6875rem', color: 'rgba(240,235,225,0.38)',
    marginBottom: '0.3rem', display: 'block',
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(4,6,15,0.88)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999 }}>
      <div style={{ background: '#080F1C', border: '1px solid rgba(198,149,42,0.18)', borderRadius: '4px', padding: '2rem', width: '400px', display: 'flex', flexDirection: 'column', gap: '1.125rem' }}>
        {/* Header */}
        <div>
          <div style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '0.5625rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(198,149,42,0.5)', marginBottom: '0.375rem' }}>
            Red Continental de Observación
          </div>
          <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.625rem', letterSpacing: '0.06em', color: '#F0EBE1' }}>
            Generar Llamado
          </div>
        </div>

        {/* Nombre */}
        <div>
          <label style={labelStyle}>Nombre del invitado *</label>
          <input value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Trinidad" style={inputStyle} />
        </div>

        {/* Rol */}
        <div>
          <label style={labelStyle}>Rol en la producción (opcional)</label>
          <input value={rol} onChange={e => setRol(e.target.value)} placeholder="Directora de Arte" style={inputStyle} />
          <div style={{ fontSize: '0.625rem', color: 'rgba(240,235,225,0.22)', marginTop: '0.25rem' }}>Aparece en la línea personal de la carta</div>
        </div>

        {/* Email + Role */}
        <div style={{ display: 'flex', gap: '0.625rem' }}>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Email de Google *</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="usuario@gmail.com" style={inputStyle} />
          </div>
          <div style={{ width: 100 }}>
            <label style={labelStyle}>Acceso</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              {(['admin', 'member'] as const).map(r => (
                <button key={r} onClick={() => setRoleVal(r)} style={{ padding: '0.35rem 0.5rem', borderRadius: '2px', border: roleVal === r ? '1px solid rgba(198,149,42,0.45)' : '1px solid rgba(255,255,255,0.07)', background: roleVal === r ? 'rgba(198,149,42,0.1)' : 'transparent', color: roleVal === r ? '#C6952A' : 'rgba(240,235,225,0.38)', fontSize: '0.75rem', cursor: 'pointer', fontFamily: 'IBM Plex Sans, sans-serif' }}>
                  {r === 'admin' ? 'Admin' : 'Miembro'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div style={{ fontSize: '0.75rem', color: '#D4256A', padding: '0.5rem 0.75rem', background: 'rgba(212,37,106,0.08)', borderRadius: '2px', border: '1px solid rgba(212,37,106,0.2)' }}>
            {error}
          </div>
        )}

        {/* Generated link */}
        {link && (
          <div style={{ background: 'rgba(198,149,42,0.05)', border: '1px solid rgba(198,149,42,0.15)', borderRadius: '2px', padding: '0.875rem' }}>
            <div style={{ fontSize: '0.625rem', color: 'rgba(198,149,42,0.6)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              Llamado generado — vinculado a {email}
            </div>
            <div style={{ fontFamily: 'monospace', fontSize: '0.6875rem', color: '#F0EBE1', wordBreak: 'break-all', lineHeight: 1.5 }}>
              {link}
            </div>
            <button onClick={copyLink} style={{ marginTop: '0.75rem', fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '0.75rem', color: copied ? '#4ECDC4' : '#C6952A', background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, letterSpacing: '0.06em' }}>
              {copied ? '✓ Copiado' : 'Copiar link'}
            </button>
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: '0.625rem' }}>
          <button onClick={onClose} style={{ flex: 1, padding: '0.5625rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '2px', color: 'rgba(240,235,225,0.4)', fontSize: '0.875rem', cursor: 'pointer', fontFamily: 'IBM Plex Sans, sans-serif' }}>
            Cerrar
          </button>
          <button
            onClick={generate}
            disabled={!nombre.trim() || !email.trim() || loading}
            style={{ flex: 2, padding: '0.5625rem', background: (!nombre.trim() || !email.trim()) ? 'rgba(198,149,42,0.08)' : 'rgba(198,149,42,0.15)', border: '1px solid rgba(198,149,42,0.3)', borderRadius: '2px', color: '#C6952A', fontSize: '0.875rem', cursor: (!nombre.trim() || !email.trim()) ? 'not-allowed' : 'pointer', fontFamily: 'IBM Plex Sans, sans-serif' }}
          >
            {loading ? 'Generando…' : link ? 'Regenerar' : 'Generar Llamado'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function SettingsPage() {
  const { data: session } = useSession()
  const [sysStatus, setSysStatus]     = useState<SystemStatus | null>(null)
  const [users, setUsers]             = useState<UserRow[]>([])
  const [myRole, setMyRole]           = useState<string | null>(null)
  const [showLlamadoModal, setShowLlamadoModal] = useState(false)
  const [togglingRole, setTogglingRole] = useState<string | null>(null)
  const [deletingEmail, setDeletingEmail] = useState<string | null>(null)

  const fetchUsers = useCallback(async () => {
    const res = await fetch('/api/admin/users')
    if (res.ok) setUsers(await res.json())
  }, [])

  useEffect(() => {
    fetch('/api/system/status').then(r => r.ok ? r.json() : null).then(d => d && setSysStatus(d))
    fetch('/api/me').then(r => r.ok ? r.json() : null).then(d => d && setMyRole(d.role))
    fetchUsers()
  }, [fetchUsers])

  const isAdmin = myRole === 'admin'

  async function toggleRole(user: UserRow) {
    if (!isAdmin) return
    const newRole = user.role === 'admin' ? 'member' : 'admin'
    setTogglingRole(user.email)
    await fetch('/api/admin/users', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: user.email, role: newRole }),
    })
    await fetchUsers()
    setTogglingRole(null)
  }

  async function removeUser(email: string) {
    if (!isAdmin) return
    setDeletingEmail(email)
    await fetch('/api/admin/users', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
    await fetchUsers()
    setDeletingEmail(null)
  }

  return (
    <div style={{ padding: '2.5rem 2.5rem 3rem', maxWidth: '820px', width: '100%' }}>
      {showLlamadoModal && <GenerarLlamadoModal onClose={() => setShowLlamadoModal(false)} />}

      {/* Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={label.label}>Sistema</div>
        <h1 style={{ fontFamily: 'Bebas Neue, Impact, sans-serif', fontSize: '2.75rem', letterSpacing: '0.04em', color: '#F0EBE1', lineHeight: 1 }}>
          Configuración
        </h1>
      </div>

      {/* User profile */}
      <section style={{ marginBottom: '2.5rem' }}>
        <div style={label.label}>Mi perfil</div>
        <div style={{ ...label.card, padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          {session?.user?.image ? (
            <Image src={session.user.image} alt={session.user.name ?? 'User'} width={56} height={56} style={{ borderRadius: '50%', flexShrink: 0 }} />
          ) : (
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(245,165,42,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', fontWeight: 600, color: '#F5A52A', flexShrink: 0, fontFamily: 'Bebas Neue, sans-serif', letterSpacing: '0.05em' }}>
              {(session?.user?.name ?? session?.user?.email ?? '?')[0].toUpperCase()}
            </div>
          )}
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '1rem', fontWeight: 500, color: '#F0EBE1', marginBottom: '0.25rem' }}>{session?.user?.name ?? '—'}</div>
            <div style={{ fontSize: '0.875rem', color: 'rgba(240,235,225,0.45)', marginBottom: '0.5rem' }}>{session?.user?.email ?? '—'}</div>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <span style={{ display: 'inline-block', fontSize: '0.6875rem', letterSpacing: '0.08em', color: myRole === 'admin' ? '#F5A52A' : '#4ECDC4', background: myRole === 'admin' ? 'rgba(245,165,42,0.1)' : 'rgba(78,205,196,0.08)', padding: '0.15rem 0.5rem', borderRadius: '2px' }}>
                {myRole === 'admin' ? 'Admin' : myRole === 'member' ? 'Miembro' : '—'}
              </span>
              <span style={{ fontSize: '0.75rem', color: 'rgba(240,235,225,0.25)' }}>via Google OAuth</span>
            </div>
          </div>
        </div>
      </section>

      {/* Integrations */}
      <section style={{ marginBottom: '2.5rem' }}>
        <div style={label.label}>Integraciones</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'rgba(245,165,42,0.07)', borderRadius: '2px', overflow: 'hidden' }}>
          {INTEGRATIONS.map(({ key, name, description }) => {
            const s = sysStatus?.[key]
            const status: IntegrationStatus = s?.status ?? 'disconnected'
            const statusLabel = s?.label ?? (sysStatus ? 'Verificando…' : '—')
            return (
              <div key={key} style={{ background: '#120D28', padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.9375rem', fontWeight: 500, color: '#F0EBE1', marginBottom: '0.25rem' }}>{name}</div>
                  <div style={{ fontSize: '0.8125rem', color: 'rgba(240,235,225,0.35)', lineHeight: 1.5 }}>{description}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: STATUS_COLOR[status] }} />
                  <span style={{ fontSize: '0.8125rem', color: STATUS_COLOR[status], background: STATUS_BG[status], padding: '0.2rem 0.625rem', borderRadius: '2px' }}>
                    {statusLabel}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Team */}
      <section>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div style={label.label}>Usuarios del equipo</div>
          {isAdmin && (
            <button onClick={() => setShowLlamadoModal(true)} style={{ fontSize: '0.75rem', letterSpacing: '0.08em', color: '#C6952A', background: 'rgba(198,149,42,0.06)', border: '1px solid rgba(198,149,42,0.22)', borderRadius: '2px', padding: '0.3rem 0.75rem', cursor: 'pointer', fontFamily: 'IBM Plex Sans, sans-serif' }}>
              Generar Llamado
            </button>
          )}
        </div>

        <div style={{ ...label.card, overflow: 'hidden' }}>
          {/* Header */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px 80px', gap: '1rem', padding: '0.625rem 1.5rem', borderBottom: '1px solid rgba(245,165,42,0.07)' }}>
            {['Email', 'Rol', ''].map((h, i) => (
              <div key={i} style={{ fontSize: '0.6875rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(240,235,225,0.22)' }}>{h}</div>
            ))}
          </div>

          {users.length === 0 ? (
            <div style={{ padding: '2rem 1.5rem', fontSize: '0.875rem', color: 'rgba(240,235,225,0.2)', fontStyle: 'italic' }}>
              {isAdmin ? 'No hay usuarios registrados.' : 'Solo admins pueden ver el equipo.'}
            </div>
          ) : (
            users.map((user, i) => {
              const isSelf = user.email === session?.user?.email
              return (
                <div key={user.email} style={{ display: 'grid', gridTemplateColumns: '1fr 120px 80px', gap: '1rem', padding: '0.875rem 1.5rem', borderBottom: i < users.length - 1 ? '1px solid rgba(245,165,42,0.05)' : 'none', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '0.875rem', color: '#F0EBE1' }}>{user.email}</div>
                    {isSelf && <div style={{ fontSize: '0.6875rem', color: 'rgba(240,235,225,0.3)', marginTop: '0.125rem' }}>Tú</div>}
                  </div>

                  {/* Role toggle */}
                  <button
                    onClick={() => !isSelf && isAdmin && toggleRole(user)}
                    disabled={isSelf || !isAdmin || togglingRole === user.email}
                    style={{ fontSize: '0.75rem', color: user.role === 'admin' ? '#F5A52A' : '#4ECDC4', background: user.role === 'admin' ? 'rgba(245,165,42,0.08)' : 'rgba(78,205,196,0.08)', padding: '0.2rem 0.625rem', borderRadius: '2px', border: 'none', cursor: isSelf || !isAdmin ? 'default' : 'pointer', opacity: togglingRole === user.email ? 0.5 : 1, textAlign: 'left' as const }}
                  >
                    {user.role === 'admin' ? 'Admin' : 'Miembro'}
                  </button>

                  {/* Delete */}
                  {isAdmin && !isSelf ? (
                    <button
                      onClick={() => removeUser(user.email)}
                      disabled={deletingEmail === user.email}
                      style={{ fontSize: '0.75rem', color: 'rgba(212,37,106,0.6)', background: 'transparent', border: 'none', cursor: 'pointer', opacity: deletingEmail === user.email ? 0.4 : 1, textAlign: 'left' as const, padding: '0.2rem 0' }}
                    >
                      {deletingEmail === user.email ? '…' : 'Eliminar'}
                    </button>
                  ) : <div />}
                </div>
              )
            })
          )}
        </div>
      </section>
    </div>
  )
}
