'use client'

// Uses pdf() from @react-pdf/renderer to generate the PDF blob directly,
// avoiding PDFDownloadLink which conflicts with React 19's internal reconciler.
// This component is loaded via dynamic(ssr:false) — never runs server-side.

import { useState } from 'react'
import { pdf } from '@react-pdf/renderer'
import EpisodePDF from './EpisodePDF'

interface PDFDownloadSectionProps {
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
  fileName: string
  /** Optional custom button render — receives loading state. */
  renderButton?: (loading: boolean, onClick: () => void) => React.ReactNode
}

export default function PDFDownloadSection({ fileName, renderButton, ...props }: PDFDownloadSectionProps) {
  const [loading, setLoading] = useState(false)

  async function handleDownload() {
    if (loading) return
    setLoading(true)
    try {
      const blob = await pdf(<EpisodePDF {...props} />).toBlob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = fileName
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } finally {
      setLoading(false)
    }
  }

  if (renderButton) {
    return <>{renderButton(loading, handleDownload)}</>
  }

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      style={{
        padding: '6px 16px',
        background: '#F5A52A',
        border: 'none',
        borderRadius: '3px',
        color: '#F0EBE1',
        fontSize: '0.8rem',
        fontWeight: 700,
        cursor: loading ? 'not-allowed' : 'pointer',
        fontFamily: 'IBM Plex Sans, sans-serif',
        opacity: loading ? 0.6 : 1,
      }}
    >
      {loading ? 'Generando...' : '↓ Descargar PDF'}
    </button>
  )
}
