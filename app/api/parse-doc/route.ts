import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { createServerClient } from '@/lib/supabase'
import mammoth from 'mammoth'

export const runtime = 'nodejs'
export const maxDuration = 30

export async function POST(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await request.json()
    const { storage_path, filename } = body as { storage_path: string; filename: string }

    if (!storage_path) return NextResponse.json({ error: 'storage_path requerido' }, { status: 400 })

    // Download from Supabase Storage (server-to-server, no body size limit)
    const supabase = createServerClient()
    const { data, error } = await supabase.storage.from('assets').download(storage_path)
    if (error || !data) return NextResponse.json({ error: `Error descargando archivo: ${error?.message}` }, { status: 500 })

    const buffer = Buffer.from(await data.arrayBuffer())
    const name = (filename ?? storage_path).toLowerCase()

    let text = ''
    if (name.endsWith('.docx')) {
      const result = await mammoth.extractRawText({ buffer })
      text = result.value
    } else if (name.endsWith('.txt') || name.endsWith('.md')) {
      text = buffer.toString('utf-8')
    } else {
      return NextResponse.json({ error: 'Formato no soportado. Usa .docx, .txt o .md' }, { status: 400 })
    }

    if (text.length > 100000) {
      text = text.substring(0, 100000) + '\n\n[... documento truncado por tamaño ...]'
    }

    return NextResponse.json({ filename, text: text.trim(), chars: text.length })
  } catch (e) {
    return NextResponse.json({ error: `Error al procesar el archivo: ${String(e)}` }, { status: 500 })
  }
}
