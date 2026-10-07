import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { createServerClient } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const results: Record<string, { status: 'connected' | 'disconnected' | 'partial'; label: string }> = {}

  // Anthropic
  results.anthropic = process.env.ANTHROPIC_API_KEY
    ? { status: 'connected', label: 'Activo' }
    : { status: 'disconnected', label: 'Sin configurar' }

  // Google Drive
  results.drive = process.env.GOOGLE_DRIVE_FOLDER_ID && process.env.GOOGLE_CLIENT_ID
    ? { status: 'connected', label: 'Conectado' }
    : { status: 'disconnected', label: 'Sin configurar' }

  // Supabase — intentar query real
  try {
    const supabase = createServerClient()
    const { error } = await supabase.from('user_roles').select('email').limit(1)
    results.supabase = error
      ? { status: 'partial', label: 'Error de conexión' }
      : { status: 'connected', label: 'Conectado' }
  } catch {
    results.supabase = { status: 'disconnected', label: 'Sin configurar' }
  }

  return NextResponse.json(results)
}
