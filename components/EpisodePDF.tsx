'use client'

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from '@react-pdf/renderer'

// Uses only built-in PDF fonts: Helvetica, Courier, Times-Roman
// No Font.register needed — avoids external URL failures

const S = StyleSheet.create({
  page: {
    fontFamily: 'Courier',
    fontSize: 12,
    lineHeight: 1.5,
    paddingTop: 72,
    paddingBottom: 72,
    paddingLeft: 108, // ~1.5 inch left margin (screenplay standard)
    paddingRight: 72,
    backgroundColor: '#FFFFFF',
    color: '#000000',
  },

  // Cover page
  coverPage: {
    fontFamily: 'Helvetica',
    backgroundColor: '#FFFFFF',
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    paddingRight: 0,
    display: 'flex',
    flexDirection: 'column',
  },
  coverStripe: {
    backgroundColor: '#08060F',
    height: 14,
    width: '100%',
  },
  coverContent: {
    flex: 1,
    paddingTop: 120,
    paddingLeft: 72,
    paddingRight: 72,
    paddingBottom: 60,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  coverTop: {
    display: 'flex',
    flexDirection: 'column',
    gap: 0,
  },
  coverSerie: {
    fontSize: 9,
    letterSpacing: 3,
    color: '#999999',
    textTransform: 'uppercase',
    marginBottom: 16,
  },
  coverCode: {
    fontSize: 16,
    fontFamily: 'Helvetica',
    color: '#F5A52A',
    letterSpacing: 2,
    marginBottom: 8,
  },
  coverTitle: {
    fontSize: 36,
    fontFamily: 'Helvetica',
    color: '#000000',
    lineHeight: 1.1,
    marginBottom: 32,
  },
  coverMeta: {
    fontSize: 11,
    color: '#555555',
    lineHeight: 1.6,
  },
  coverDivider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 32,
  },
  coverLogline: {
    fontSize: 12,
    color: '#333333',
    lineHeight: 1.6,
    fontStyle: 'italic',
    maxWidth: 400,
  },
  coverBottom: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  coverStudio: {
    fontSize: 9,
    color: '#AAAAAA',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  coverDate: {
    fontSize: 9,
    color: '#AAAAAA',
  },

  // Script page elements
  pageHeader: {
    position: 'absolute',
    top: 36,
    left: 108,
    right: 72,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 9,
    color: '#AAAAAA',
    fontFamily: 'Courier',
  },
  pageNumber: {
    position: 'absolute',
    top: 36,
    right: 72,
    fontSize: 9,
    color: '#AAAAAA',
    fontFamily: 'Courier',
  },

  // Scene heading row wrapper (for left accent bar)
  sceneHeadingRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    marginTop: 24,
    marginBottom: 8,
  },
  sceneHeadingBar: {
    width: 3,
    backgroundColor: '#F5A52A',
    marginRight: 8,
    borderRadius: 1,
  },
  // Scene heading: INT./EXT. LOCATION — TIME
  sceneHeading: {
    fontFamily: 'Courier',
    fontSize: 12,
    fontWeight: 700,
    textTransform: 'uppercase',
    flex: 1,
  },

  // Action / description
  action: {
    fontFamily: 'Courier',
    fontSize: 12,
    lineHeight: 1.5,
    marginBottom: 10,
    color: '#000000',
  },

  // Camera / technical direction (CLOSE ON:, ANGLE ON:, POV, etc.) — italicized
  camera: {
    fontFamily: 'Courier',
    fontSize: 12,
    lineHeight: 1.5,
    marginBottom: 8,
    color: '#444444',
    fontStyle: 'italic',
  },

  // Character name (centered, uppercase, gold)
  character: {
    fontFamily: 'Courier',
    fontSize: 12,
    fontWeight: 700,
    textTransform: 'uppercase',
    marginTop: 14,
    marginBottom: 0,
    marginLeft: 140, // ~2 inch indent from left margin
    color: '#C07800', // amber — readable on white, standard-safe
  },

  // Dialogue
  dialogue: {
    fontFamily: 'Courier',
    fontSize: 12,
    lineHeight: 1.5,
    marginLeft: 72,   // ~1 inch indent
    marginRight: 108, // ~1.5 inch from right
    marginBottom: 8,
    color: '#111111',
  },

  // Parenthetical
  parenthetical: {
    fontFamily: 'Courier',
    fontSize: 11,
    marginLeft: 100,
    marginRight: 120,
    marginBottom: 0,
    color: '#555555',
    fontStyle: 'italic',
  },

  // Transition
  transition: {
    fontFamily: 'Courier',
    fontSize: 12,
    textAlign: 'right',
    marginTop: 12,
    marginBottom: 12,
    color: '#555555',
  },

  // Synopsis / metadata page
  metaSection: {
    marginBottom: 20,
  },
  metaLabel: {
    fontSize: 8,
    letterSpacing: 2,
    color: '#F5A52A',
    textTransform: 'uppercase',
    fontFamily: 'Helvetica',
    marginBottom: 4,
  },
  metaText: {
    fontSize: 11,
    color: '#333333',
    lineHeight: 1.6,
    fontFamily: 'Helvetica',
  },
  metaDivider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginVertical: 16,
  },
  bottomStripe: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: '#08060F',
  },
})

// ── Parse screenplay text into typed lines ────────────────────────────────────

type ScriptLine =
  | { type: 'scene'; text: string }
  | { type: 'character'; text: string }
  | { type: 'dialogue'; text: string }
  | { type: 'parenthetical'; text: string }
  | { type: 'transition'; text: string }
  | { type: 'camera'; text: string }
  | { type: 'action'; text: string }
  | { type: 'blank' }

// Camera / technical direction keywords
const CAMERA_PREFIXES = /^(CLOSE ON|CLOSE-UP|CLOSEUP|ANGLE ON|ANGLE:|INSERT:|BACK TO SCENE|POV|POINT OF VIEW|WIDER|WIDER SHOT|ESTABLISHING|OVER THE SHOULDER|INTERCUT|STOCK SHOT|AERIAL|TILT|PAN|SMASH CUT|MATCH CUT|JUMP CUT)/i

function parseScript(script: string): ScriptLine[] {
  const lines = script.split('\n')
  const result: ScriptLine[] = []

  for (const raw of lines) {
    const line = raw.trimEnd()

    if (!line.trim()) {
      result.push({ type: 'blank' })
      continue
    }

    // Scene heading: starts with INT. or EXT.
    if (/^(INT\.|EXT\.|INT\.\/EXT\.|EXT\.\/INT\.)/i.test(line.trim())) {
      result.push({ type: 'scene', text: line.trim().toUpperCase() })
      continue
    }

    // Transition: ends with TO: or is FADE OUT / CUT TO etc.
    if (/^(FADE (IN|OUT|TO)|CUT TO|SMASH CUT|DISSOLVE TO)/i.test(line.trim()) || /TO:$/.test(line.trim())) {
      result.push({ type: 'transition', text: line.trim().toUpperCase() })
      continue
    }

    // Parenthetical: (text)
    if (/^\s{2,}\(.*\)\s*$/.test(raw) || /^\(.*\)\s*$/.test(line.trim())) {
      result.push({ type: 'parenthetical', text: line.trim() })
      continue
    }

    // Character name: heavily indented OR all caps short line (not scene heading)
    const trimmed = line.trim()
    if (
      (raw.startsWith('\t\t\t') || raw.startsWith('         ')) &&
      trimmed === trimmed.toUpperCase() &&
      trimmed.length > 0 &&
      trimmed.length < 40 &&
      !trimmed.includes('.')
    ) {
      result.push({ type: 'character', text: trimmed })
      continue
    }

    // Dialogue: moderately indented
    if (raw.startsWith('\t\t') || raw.startsWith('      ')) {
      result.push({ type: 'dialogue', text: trimmed })
      continue
    }

    // Camera / technical direction
    if (CAMERA_PREFIXES.test(line.trim())) {
      result.push({ type: 'camera', text: line.trim() })
      continue
    }

    // Action / description
    result.push({ type: 'action', text: line.trim() })
  }

  return result
}

// ── Render script lines as PDF elements ──────────────────────────────────────

function renderLines(lines: ScriptLine[]) {
  return lines.map((line, i) => {
    switch (line.type) {
      case 'scene':
        return (
          <View key={i} style={S.sceneHeadingRow}>
            <View style={S.sceneHeadingBar} />
            <Text style={S.sceneHeading}>{line.text}</Text>
          </View>
        )
      case 'character':
        return <Text key={i} style={S.character}>{line.text}</Text>
      case 'dialogue':
        return <Text key={i} style={S.dialogue}>{line.text}</Text>
      case 'parenthetical':
        return <Text key={i} style={S.parenthetical}>{line.text}</Text>
      case 'transition':
        return <Text key={i} style={S.transition}>{line.text}</Text>
      case 'camera':
        return <Text key={i} style={S.camera}>{line.text}</Text>
      case 'action':
        return <Text key={i} style={S.action}>{line.text}</Text>
      case 'blank':
        return <Text key={i} style={{ fontSize: 6, lineHeight: 1 }}>{' '}</Text>
    }
  })
}

// ── Main PDF component ────────────────────────────────────────────────────────

interface EpisodePDFProps {
  season: number
  episodeNumber: number
  title: string | null
  logline: string | null
  synopsis: string | null
  theme: string | null
  coldOpen: string | null
  tag: string | null
  script: string
  status: string
}

const STATUS_LABELS: Record<string, string> = {
  draft: 'BORRADOR',
  outline: 'OUTLINE',
  script: 'GUIÓN',
  in_production: 'EN PRODUCCIÓN',
  completed: 'COMPLETADO',
}

export default function EpisodePDF({
  season,
  episodeNumber,
  title,
  logline,
  synopsis,
  theme,
  coldOpen,
  tag,
  script,
  status,
}: EpisodePDFProps) {
  const code = `T${season}E${String(episodeNumber).padStart(2, '0')}`
  const dateStr = new Date().toLocaleDateString('es-CL', { year: 'numeric', month: 'long', day: 'numeric' })
  const parsedLines = parseScript(script)
  const hasMetadata = logline || synopsis || theme || coldOpen || tag

  return (
    <Document
      title={`${code} — ${title ?? 'Sin título'}`}
      author="Los Prodigios — StudioOS"
      subject={logline ?? ''}
    >
      {/* ── COVER PAGE ─────────────────────────────────────────────────── */}
      <Page size="LETTER" style={S.coverPage}>
        <View style={S.coverStripe} />
        <View style={S.coverContent}>
          <View style={S.coverTop}>
            <Text style={S.coverSerie}>Los Prodigios · Serie Animada · {STATUS_LABELS[status] ?? status}</Text>
            <Text style={S.coverCode}>{code}</Text>
            <Text style={S.coverTitle}>{title ?? 'Sin título'}</Text>
            {logline && (
              <>
                <View style={S.coverDivider} />
                <Text style={S.coverLogline}>{logline}</Text>
              </>
            )}
          </View>
          <View style={S.coverBottom}>
            <Text style={S.coverStudio}>StudioOS · Los Prodigios</Text>
            <Text style={S.coverDate}>{dateStr}</Text>
          </View>
        </View>
        <View style={S.bottomStripe} />
      </Page>

      {/* ── METADATA PAGE (if any metadata exists) ─────────────────────── */}
      {hasMetadata && (
        <Page size="LETTER" style={{ ...S.page, fontFamily: 'Helvetica', paddingLeft: 72, paddingRight: 72 }}>
          <Text fixed style={S.pageHeader}>{`${code} — ${title ?? 'Sin título'}`}</Text>
          <Text render={({ pageNumber }) => `${pageNumber}`} fixed style={S.pageNumber} />

          <Text style={{ fontSize: 9, letterSpacing: 2, color: '#F5A52A', fontFamily: 'Helvetica', marginBottom: 24, textTransform: 'uppercase' }}>
            Datos del episodio
          </Text>

          {theme && (
            <View style={S.metaSection}>
              <Text style={S.metaLabel}>Tema central</Text>
              <Text style={S.metaText}>{theme}</Text>
              <View style={S.metaDivider} />
            </View>
          )}
          {synopsis && (
            <View style={S.metaSection}>
              <Text style={S.metaLabel}>Sinopsis</Text>
              <Text style={S.metaText}>{synopsis}</Text>
              <View style={S.metaDivider} />
            </View>
          )}
          {coldOpen && (
            <View style={S.metaSection}>
              <Text style={S.metaLabel}>Cold Open</Text>
              <Text style={S.metaText}>{coldOpen}</Text>
              <View style={S.metaDivider} />
            </View>
          )}
          {tag && (
            <View style={S.metaSection}>
              <Text style={S.metaLabel}>Tag / Gancho final</Text>
              <Text style={S.metaText}>{tag}</Text>
            </View>
          )}
          <View style={S.bottomStripe} />
        </Page>
      )}

      {/* ── SCRIPT PAGE(S) ─────────────────────────────────────────────── */}
      <Page size="LETTER" style={S.page} wrap>
        <Text fixed style={S.pageHeader}>{`${code} — ${title ?? 'Sin título'}`}</Text>
        <Text render={({ pageNumber }) => `${pageNumber}`} fixed style={S.pageNumber} />

        {script.trim() ? (
          renderLines(parsedLines)
        ) : (
          <Text style={{ ...S.action, color: '#999999', fontStyle: 'italic' }}>
            El guión aún no ha sido escrito.
          </Text>
        )}

        <View style={S.bottomStripe} />
      </Page>
    </Document>
  )
}
