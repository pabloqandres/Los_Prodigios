import { NextRequest, NextResponse } from 'next/server'

const RUNWAY_BASE = 'https://api.runwayml.com/v1'
const API_KEY = process.env.RUNWAY_API_KEY!

export async function GET(req: NextRequest) {
  const taskId = req.nextUrl.searchParams.get('taskId')

  if (!taskId) {
    return NextResponse.json({ error: 'taskId requerido' }, { status: 400 })
  }

  const res = await fetch(`${RUNWAY_BASE}/tasks/${taskId}`, {
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'X-Runway-Version': '2024-11-06',
    },
  })

  const data = await res.json()

  if (!res.ok) {
    return NextResponse.json({ error: data?.message ?? 'Error consultando task' }, { status: res.status })
  }

  // status: PENDING | RUNNING | SUCCEEDED | FAILED
  return NextResponse.json({
    status: data.status,
    progress: data.progress ?? null,
    output: data.output ?? null,   // array of video URLs when SUCCEEDED
    error: data.failure ?? null,
  })
}
