'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

// PDFDownloadSection loads PDFDownloadLink + EpisodePDF together as plain imports.
// This avoids the "ie is not a function" error caused by passing a Next.js dynamic
// wrapper to PDFDownloadLink instead of the real component.
const PDFDownloadSection = dynamic(() => import('@/components/PDFDownloadSection'), { ssr: false })

const FAKE = {
  season: 1,
  episodeNumber: 1,
  title: 'El Primer Entrenamiento',
  logline: 'Mateo llega tarde por tercera vez y el Profe Casas no dice nada — lo que resulta más devastador que cualquier castigo.',
  synopsis: 'Mateo ha estado llegando tarde a los entrenamientos desde hace una semana. Hoy el Profe Casas no lo reta frente al grupo: lo ignora. Para un chico que siempre buscó atención a través del conflicto, el silencio es una forma de castigo que no sabe cómo procesar.',
  theme: 'La diferencia entre buscar atención y merecer respeto.',
  coldOpen: 'Flashback: Mateo en su barrio, corriendo solo con una pelota desgastada bajo la lluvia. Nadie lo mira. Él sonríe igual.',
  tag: 'En la oscuridad de su cuarto, Mateo abre una carta de La Fundación: "Lo hemos estado viendo. Desde mucho antes de El Llamado."',
  script: `INT. CASA PRODIGIO — COMEDOR — MAÑANA

La mesa del desayuno está puesta pero casi vacía. MATEO entra arrastrando los pies. SOFÍA ya está sentada, leyendo en su tablet.

\t\t\t\tSOFÍA
\t\t(sin levantar la vista)
\t\tLlegaste tarde otra vez al entrenamiento.

Mateo se sirve cereal sin responder. El silencio es incómodo.

\t\t\t\tMATEO
\t\t¿Y tú cómo sabes?

\t\t\t\tSOFÍA
\t\tEl Profe Casas mandó lista.

Mateo deja la cuchara. Mira a Sofía por primera vez.

\t\t\t\tMATEO
\t\t(bajito)
\t\tNo fue culpa mía.

INT. CANCHA DE ENTRENAMIENTO — DÍA

El PROFE CASAS observa desde la línea lateral. KAEL hace jueguito, luciendo demasiado cómodo. El Profe no dice nada. Solo mira.

\t\t\t\tPROFE CASAS
\t\t(al asistente, sin apartar la vista)
\t\tCuando un jugador llega tarde tres veces... ¿qué le está diciendo al equipo?

El asistente no responde. No era una pregunta para él.

EXT. TERRAZA CASA PRODIGIO — ATARDECER

Mateo está solo. Desde acá se ve toda Nueva Corona.

\t\t\t\tMATEO (V.O.)
\t\tSiempre pensé que llegar era lo difícil.
\t\tNunca pensé que quedarme iba a ser peor.

FADE OUT.`,
  status: 'script',
}

// ── HTML mockup of the PDF ────────────────────────────────────────────────────

const CAMERA_PREFIXES_RE = /^(CLOSE ON|CLOSE-UP|CLOSEUP|ANGLE ON|ANGLE:|INSERT:|BACK TO SCENE|POV|POINT OF VIEW|WIDER|WIDER SHOT|ESTABLISHING|OVER THE SHOULDER|INTERCUT|STOCK SHOT|AERIAL|TILT|PAN|SMASH CUT|MATCH CUT|JUMP CUT)/i

function ScriptLine({ line }: { line: string }) {
  const trimmed = line.trim()
  if (!trimmed) return <div style={{ height: '0.6em' }} />

  // Scene heading — amber left bar
  if (/^(INT\.|EXT\.|INT\.\/EXT\.|EXT\.\/INT\.)/i.test(trimmed)) {
    return (
      <div style={{ display: 'flex', alignItems: 'stretch', marginTop: '1.5em', marginBottom: '0.5em' }}>
        <div style={{ width: 3, background: '#F5A52A', borderRadius: 1, marginRight: 8, flexShrink: 0 }} />
        <div style={{ fontWeight: 700, textTransform: 'uppercase', flex: 1 }}>{trimmed}</div>
      </div>
    )
  }
  // Transition — right-aligned, gray
  if (/^(FADE|CUT TO|DISSOLVE|SMASH CUT|MATCH CUT)/i.test(trimmed) || /TO:$/.test(trimmed)) {
    return <div style={{ textAlign: 'right', marginTop: '0.75em', marginBottom: '0.75em', color: '#666' }}>{trimmed.toUpperCase()}</div>
  }
  // Parenthetical — indented, italic, gray
  if (/^\s{2,}\(.*\)\s*$/.test(line) || /^\(.*\)\s*$/.test(trimmed)) {
    return <div style={{ paddingLeft: '5em', paddingRight: '7em', color: '#666', fontStyle: 'italic', fontSize: '0.95em' }}>{trimmed}</div>
  }
  // Character name — gold, bold, centered indent
  if ((line.startsWith('\t\t\t') || line.startsWith('         ')) && trimmed === trimmed.toUpperCase() && trimmed.length < 40 && !trimmed.includes('.')) {
    return <div style={{ paddingLeft: '8em', marginTop: '1em', fontWeight: 700, color: '#C07800' }}>{trimmed}</div>
  }
  // Dialogue — moderate indent
  if (line.startsWith('\t\t') || line.startsWith('      ')) {
    return <div style={{ paddingLeft: '4em', paddingRight: '6em', color: '#111', lineHeight: 1.55 }}>{trimmed}</div>
  }
  // Camera / technical direction — italic, dark gray
  if (CAMERA_PREFIXES_RE.test(trimmed)) {
    return <div style={{ fontStyle: 'italic', color: '#555', marginBottom: '0.25em' }}>{trimmed}</div>
  }
  // Action / description
  return <div style={{ marginBottom: '0.25em', color: '#000', lineHeight: 1.55 }}>{trimmed}</div>
}

export default function PDFPreviewPage() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const code = `T${FAKE.season}E${String(FAKE.episodeNumber).padStart(2, '0')}`
  const scriptCode = `${code}-G01`
  const dateStr = new Date().toLocaleDateString('es-CL', { year: 'numeric', month: 'long', day: 'numeric' })
  const lines = FAKE.script.split('\n')

  return (
    <div style={{ minHeight: '100vh', background: '#08060F', fontFamily: 'IBM Plex Sans, sans-serif' }}>

      {/* Topbar */}
      <div style={{ position: 'sticky', top: 0, zIndex: 10, background: '#0D0920', borderBottom: '1px solid rgba(212,37,106,0.15)', padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <span style={{ fontFamily: 'monospace', fontSize: '0.7rem', letterSpacing: '0.14em', color: '#F5A52A' }}>{scriptCode}</span>
        <span style={{ color: '#F0EBE1', fontSize: '0.875rem', fontWeight: 600 }}>Preview PDF — {FAKE.title}</span>
        <span style={{ fontSize: '0.65rem', color: 'rgba(240,235,225,0.3)', background: 'rgba(245,165,42,0.08)', border: '1px solid rgba(245,165,42,0.15)', borderRadius: '3px', padding: '2px 8px' }}>Datos de ejemplo</span>
        <div style={{ flex: 1 }} />
        {mounted ? (
          <PDFDownloadSection
            {...FAKE}
            fileName={`${scriptCode} — ${FAKE.title}.pdf`}
          />
        ) : (
          <button disabled style={{ padding: '6px 16px', background: 'rgba(245,165,42,0.3)', border: 'none', borderRadius: '3px', color: '#F0EBE1', fontSize: '0.8rem', fontWeight: 700, cursor: 'not-allowed', fontFamily: 'IBM Plex Sans, sans-serif' }}>
            Cargando...
          </button>
        )}
      </div>

      {/* Pages */}
      <div style={{ maxWidth: '720px', margin: '2rem auto', display: 'flex', flexDirection: 'column', gap: '2rem', padding: '0 1rem 4rem' }}>

        {/* PAGE 1 — Cover */}
        <div style={{ background: '#fff', boxShadow: '0 4px 40px rgba(0,0,0,0.4)', borderRadius: '2px', overflow: 'hidden' }}>
          <div style={{ height: '14px', background: '#08060F' }} />
          <div style={{ padding: '80px 64px 60px', minHeight: '500px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '9px', letterSpacing: '3px', color: '#999', textTransform: 'uppercase', marginBottom: '16px' }}>
                Los Prodigios · Serie Animada · GUIÓN
              </div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#F5A52A', letterSpacing: '2px', marginBottom: '8px' }}>{code}</div>
              <div style={{ fontSize: '32px', fontWeight: 700, color: '#000', lineHeight: 1.1, marginBottom: '32px', fontFamily: 'Georgia, serif' }}>
                {FAKE.title}
              </div>
              <div style={{ height: '1px', background: '#e0e0e0', marginBottom: '24px' }} />
              <div style={{ fontSize: '13px', color: '#333', lineHeight: 1.7, fontStyle: 'italic', maxWidth: '420px' }}>
                {FAKE.logline}
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <div style={{ fontSize: '9px', color: '#aaa', letterSpacing: '2px', textTransform: 'uppercase' }}>StudioOS · Los Prodigios</div>
              <div style={{ fontSize: '9px', color: '#aaa' }}>{dateStr}</div>
            </div>
          </div>
          <div style={{ height: '4px', background: '#08060F' }} />
        </div>

        {/* PAGE 2 — Metadata */}
        <div style={{ background: '#fff', boxShadow: '0 4px 40px rgba(0,0,0,0.4)', borderRadius: '2px', overflow: 'hidden' }}>
          <div style={{ padding: '60px 64px' }}>
            <div style={{ fontSize: '8px', letterSpacing: '2px', color: '#F5A52A', fontWeight: 700, textTransform: 'uppercase', marginBottom: '24px' }}>
              Datos del episodio
            </div>
            {[
              { label: 'Tema central', value: FAKE.theme },
              { label: 'Sinopsis', value: FAKE.synopsis },
              { label: 'Cold Open', value: FAKE.coldOpen },
              { label: 'Tag / Gancho final', value: FAKE.tag },
            ].map(({ label, value }) => (
              <div key={label} style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '8px', letterSpacing: '2px', color: '#F5A52A', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>{label}</div>
                <div style={{ fontSize: '12px', color: '#333', lineHeight: 1.7 }}>{value}</div>
                <div style={{ height: '1px', background: '#f0f0f0', marginTop: '16px' }} />
              </div>
            ))}
          </div>
          <div style={{ height: '4px', background: '#08060F' }} />
        </div>

        {/* PAGE 3+ — Script */}
        <div style={{ background: '#fff', boxShadow: '0 4px 40px rgba(0,0,0,0.4)', borderRadius: '2px', overflow: 'hidden' }}>
          <div style={{ padding: '60px 72px 60px 96px', fontFamily: 'Courier New, Courier, monospace', fontSize: '12px', lineHeight: 1.6, color: '#000' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '32px', fontFamily: 'sans-serif', fontSize: '9px', color: '#aaa' }}>
              <span>{code} — {FAKE.title}</span>
              <span>1</span>
            </div>
            {lines.map((line, i) => <ScriptLine key={i} line={line} />)}
          </div>
          <div style={{ height: '4px', background: '#08060F' }} />
        </div>

      </div>
    </div>
  )
}
