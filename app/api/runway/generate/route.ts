import { NextRequest, NextResponse } from 'next/server'

const RUNWAY_BASE = 'https://api.runwayml.com/v1'
const API_KEY = process.env.RUNWAY_API_KEY!

export async function POST(req: NextRequest) {
  const { prompt, ratio = '1280:720', duration = 5 } = await req.json()

  if (!prompt?.trim()) {
    return NextResponse.json({ error: 'Prompt requerido' }, { status: 400 })
  }

  const res = await fetch(`${RUNWAY_BASE}/text_to_video`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
      'X-Runway-Version': '2024-11-06',
    },
    body: JSON.stringify({
      promptText: prompt,
      model: 'gen3a_turbo',
      ratio,
      duration,
    }),
  })

  const data = await res.json()

  if (!res.ok) {
    return NextResponse.json({ error: data?.message ?? 'Error en Runway' }, { status: res.status })
  }

  return NextResponse.json({ taskId: data.id })
}
