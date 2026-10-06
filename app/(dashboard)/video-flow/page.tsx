'use client'
import dynamic from 'next/dynamic'

const VideoFlowCanvas = dynamic(() => import('./canvas'), {
  ssr: false,
  loading: () => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#08060F', color: 'rgba(240,235,225,0.25)', fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '0.875rem' }}>
      Cargando canvas...
    </div>
  ),
})

export default function VideoFlowPage() {
  return (
    <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
      <VideoFlowCanvas />
    </div>
  )
}
