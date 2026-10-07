'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { DocumentsList } from '@/components/DocumentsList'
import dynamic from 'next/dynamic'

const RunwayPanel = dynamic(() => import('@/components/RunwayPanel'), { ssr: false })

type TabKey = 'posts' | 'publicidad' | 'trailers' | 'merchandise' | 'licensing'

interface Tab {
  key: TabKey
  label: string
  context: string
  description: string
  emptyLabel: string
}

const TABS: Tab[] = [
  {
    key: 'posts',
    label: 'Posts de Redes',
    context: 'redes',
    description: 'Contenido para Instagram, TikTok, YouTube y X',
    emptyLabel: 'publicaciones',
  },
  {
    key: 'publicidad',
    label: 'Publicidad',
    context: 'publicidad',
    description: 'Campañas publicitarias y creatividades para paid media',
    emptyLabel: 'campañas',
  },
  {
    key: 'trailers',
    label: 'Trailers & Promos',
    context: 'trailers',
    description: 'Trailers, teasers y videos promocionales',
    emptyLabel: 'trailers o promos',
  },
  {
    key: 'merchandise',
    label: 'Merchandise',
    context: 'merchandise',
    description: 'Productos derivados y oportunidades de licensing',
    emptyLabel: 'productos',
  },
  {
    key: 'licensing',
    label: 'Licensing',
    context: 'licensing',
    description: 'Acuerdos de distribución y licencias internacionales',
    emptyLabel: 'acuerdos',
  },
]

interface ModalProps {
  tab: Tab
  onClose: () => void
  onSubmit: (description: string, context: string) => void
}

function CreateModal({ tab, onClose, onSubmit }: ModalProps) {
  const [description, setDescription] = useState('')

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(8,6,15,0.85)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
        padding: '1.5rem',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        style={{
          background: '#120D28',
          border: '1px solid rgba(245,165,42,0.15)',
          borderRadius: '2px',
          padding: '2rem',
          width: '100%',
          maxWidth: '480px',
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
          Crear nuevo
        </div>
        <h2
          style={{
            fontFamily: 'Bebas Neue, Impact, sans-serif',
            fontSize: '1.5rem',
            letterSpacing: '0.05em',
            color: '#F0EBE1',
            marginBottom: '1.5rem',
          }}
        >
          {tab.label}
        </h2>

        <label
          style={{
            display: 'block',
            fontSize: '0.8125rem',
            color: 'rgba(240,235,225,0.55)',
            marginBottom: '0.5rem',
          }}
        >
          Describe qué quieres crear
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={`Ej: ${
            tab.key === 'posts'
              ? 'Un carrusel de Instagram para anunciar el estreno de la T1'
              : tab.key === 'trailers'
              ? 'Un teaser de 30 segundos con los mejores momentos del piloto'
              : tab.key === 'merchandise'
              ? 'Una línea de figuras articuladas de los personajes principales'
              : tab.key === 'publicidad'
              ? 'Un anuncio de 15 segundos para YouTube pre-roll'
              : 'Una propuesta de licencia para broadcaster latinoamericano'
          }`}
          rows={4}
          style={{
            width: '100%',
            background: '#1A1235',
            border: '1px solid rgba(245,165,42,0.12)',
            borderRadius: '2px',
            color: '#F0EBE1',
            fontFamily: 'IBM Plex Sans, sans-serif',
            fontSize: '0.875rem',
            padding: '0.75rem',
            resize: 'vertical',
            outline: 'none',
            lineHeight: 1.5,
            marginBottom: '1.25rem',
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = 'rgba(245,165,42,0.3)'
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = 'rgba(245,165,42,0.12)'
          }}
        />

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
            style={{
              padding: '0.5rem 1rem',
              background: 'transparent',
              border: '1px solid rgba(245,165,42,0.1)',
              borderRadius: '2px',
              color: 'rgba(240,235,225,0.45)',
              fontSize: '0.875rem',
              cursor: 'pointer',
              fontFamily: 'IBM Plex Sans, sans-serif',
            }}
          >
            Cancelar
          </button>
          <button
            onClick={() => {
              if (description.trim()) onSubmit(description, tab.context)
            }}
            disabled={!description.trim()}
            style={{
              padding: '0.5rem 1.25rem',
              background: description.trim() ? '#F5A52A' : 'rgba(245,165,42,0.15)',
              border: 'none',
              borderRadius: '2px',
              color: description.trim() ? '#08060F' : 'rgba(245,165,42,0.4)',
              fontSize: '0.875rem',
              fontWeight: 600,
              cursor: description.trim() ? 'pointer' : 'not-allowed',
              fontFamily: 'IBM Plex Sans, sans-serif',
            }}
          >
            Abrir en Asistente →
          </button>
        </div>
      </div>
    </div>
  )
}

export default function MarketingPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('posts')
  const [showModal, setShowModal] = useState(false)
  const [showRunway, setShowRunway] = useState(false)
  const router = useRouter()

  const currentTab = TABS.find((t) => t.key === activeTab)!

  function handleCreate(description: string, context: string) {
    const params = new URLSearchParams({ context, prefill: description })
    router.push(`/studio?${params.toString()}`)
  }

  return (
    <div style={{ padding: '2.5rem 2.5rem 3rem', maxWidth: '1100px', width: '100%' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div
          style={{
            fontFamily: 'IBM Plex Sans, sans-serif',
            fontSize: '0.6875rem',
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: 'rgba(240,235,225,0.28)',
            marginBottom: '0.5rem',
          }}
        >
          Franquicia
        </div>
        <h1
          style={{
            fontFamily: 'Bebas Neue, Impact, sans-serif',
            fontSize: '2.75rem',
            letterSpacing: '0.04em',
            color: '#F0EBE1',
            lineHeight: 1,
            marginBottom: '0.5rem',
          }}
        >
          Marketing & Franquicia
        </h1>
        <p style={{ fontSize: '0.9375rem', color: 'rgba(240,235,225,0.45)' }}>
          Centro de contenido para la expansión comercial de Los Prodigios
        </p>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '0',
          borderBottom: '1px solid rgba(245,165,42,0.07)',
          marginBottom: '2rem',
        }}
      >
        {TABS.map((tab) => {
          const active = tab.key === activeTab
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                padding: '0.75rem 1.25rem',
                background: 'none',
                border: 'none',
                borderBottom: active ? '2px solid #F5A52A' : '2px solid transparent',
                color: active ? '#F5A52A' : 'rgba(240,235,225,0.4)',
                fontSize: '0.875rem',
                fontWeight: active ? 500 : 400,
                cursor: 'pointer',
                transition: 'color 0.12s ease',
                fontFamily: 'IBM Plex Sans, sans-serif',
                whiteSpace: 'nowrap',
              }}
            >
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Tab content */}
      <div>
        {/* Tab header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.5rem',
          }}
        >
          <div>
            <h2 style={{ fontSize: '1rem', fontWeight: 500, color: '#F0EBE1', marginBottom: '0.25rem' }}>
              {currentTab.label}
            </h2>
            <p style={{ fontSize: '0.8125rem', color: 'rgba(240,235,225,0.35)' }}>
              {currentTab.description}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            {activeTab === 'trailers' && (
              <button
                onClick={() => setShowRunway(v => !v)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.375rem',
                  padding: '0.5rem 1rem',
                  background: showRunway ? 'rgba(78,205,196,0.12)' : 'rgba(78,205,196,0.06)',
                  border: `1px solid ${showRunway ? 'rgba(78,205,196,0.4)' : 'rgba(78,205,196,0.2)'}`,
                  borderRadius: '2px', color: '#4ECDC4',
                  fontSize: '0.875rem', fontWeight: 600,
                  cursor: 'pointer', fontFamily: 'IBM Plex Sans, sans-serif', whiteSpace: 'nowrap',
                }}
              >
                🎬 Generar en Runway
              </button>
            )}
            <button
              onClick={() => setShowModal(true)}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.375rem',
                padding: '0.5rem 1rem', background: '#F5A52A',
                border: 'none', borderRadius: '2px', color: '#08060F',
                fontSize: '0.875rem', fontWeight: 600,
                cursor: 'pointer', fontFamily: 'IBM Plex Sans, sans-serif', whiteSpace: 'nowrap',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Crear nuevo →
            </button>
          </div>
        </div>

        {/* Runway panel — solo en Trailers */}
        {activeTab === 'trailers' && showRunway && (
          <div style={{
            background: '#0D0920', border: '1px solid rgba(78,205,196,0.18)',
            borderRadius: '4px', padding: '1.5rem', marginBottom: '2rem',
          }}>
            <RunwayPanel />
          </div>
        )}

        <DocumentsList
          area={currentTab.context}
          onCreateNew={() => setShowModal(true)}
          createLabel={`Crear primer ${currentTab.emptyLabel.replace('publicaciones', 'post').replace('campañas', 'campaña').replace('trailers o promos', 'trailer').replace('productos', 'producto').replace('acuerdos', 'acuerdo')}`}
          emptyLabel={currentTab.emptyLabel}
        />
      </div>

      {showModal && (
        <CreateModal
          tab={currentTab}
          onClose={() => setShowModal(false)}
          onSubmit={(desc, ctx) => {
            setShowModal(false)
            handleCreate(desc, ctx)
          }}
        />
      )}
    </div>
  )
}
