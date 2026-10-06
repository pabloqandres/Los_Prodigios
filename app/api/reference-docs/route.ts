import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { createServerClient } from '@/lib/supabase'
import mammoth from 'mammoth'

export const runtime = 'nodejs'
export const maxDuration = 30

// GET /api/reference-docs          → lista sin content
// GET /api/reference-docs?id=xxx   → doc completo con content
export async function GET(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const id = request.nextUrl.searchParams.get('id')
  const supabase = createServerClient()

  if (id) {
    const { data, error } = await supabase
      .from('reference_docs')
      .select('*')
      .eq('id', id)
      .single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data)
  }

  const { data, error } = await supabase
    .from('reference_docs')
    .select('id, title, description, categories, accent_color, filename, created_by, created_at, updated_at')
    .order('title', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// POST /api/reference-docs — save doc (file already uploaded to Storage by client)
export async function POST(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await request.json()
    const { storage_path, filename, title, description, categories = [], accent_color = '#9B6FD4' } = body

    if (!storage_path) return NextResponse.json({ error: 'storage_path requerido' }, { status: 400 })

    const supabase = createServerClient()

    // Download from Storage and parse content
    const { data: fileData, error: dlErr } = await supabase.storage.from('assets').download(storage_path)
    if (dlErr || !fileData) return NextResponse.json({ error: `Error descargando archivo: ${dlErr?.message}` }, { status: 500 })

    const buffer = Buffer.from(await fileData.arrayBuffer())
    const name = (filename ?? storage_path).toLowerCase()

    let content = ''
    if (name.endsWith('.docx')) {
      const result = await mammoth.extractRawText({ buffer })
      content = result.value
    } else if (name.endsWith('.txt') || name.endsWith('.md')) {
      content = buffer.toString('utf-8')
    } else {
      return NextResponse.json({ error: 'Formato no soportado. Usa .docx, .txt o .md' }, { status: 400 })
    }

    if (content.length > 200000) {
      content = content.substring(0, 200000) + '\n\n[... documento truncado ...]'
    }

    const { data, error } = await supabase
      .from('reference_docs')
      .insert({
        title: title || (filename ?? '').replace(/\.[^/.]+$/, ''),
        description: description || null,
        categories,
        accent_color,
        content: content.trim(),
        filename: filename ?? storage_path,
        created_by: token.email as string,
      })
      .select('id, title, description, categories, accent_color, filename, created_by, created_at, updated_at')
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    // Clean up temp file from storage (content is now in DB)
    await supabase.storage.from('assets').remove([storage_path])

    return NextResponse.json(data, { status: 201 })
  } catch (e) {
    return NextResponse.json({ error: `Error al procesar el archivo: ${String(e)}` }, { status: 500 })
  }
}

// PATCH /api/reference-docs?id=xxx — update metadata (and optionally content for admins)
export async function PATCH(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const id = request.nextUrl.searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'id requerido' }, { status: 400 })

  const body = await request.json()
  const { title, description, categories, accent_color, content } = body

  const supabase = createServerClient()

  const updateData: Record<string, unknown> = {
    title,
    description,
    categories,
    updated_at: new Date().toISOString(),
  }

  if (accent_color) updateData.accent_color = accent_color

  // Content update requires admin role
  if (typeof content === 'string') {
    const { data: roleData } = await supabase
      .from('user_roles')
      .select('role')
      .eq('email', token.email as string)
      .single()

    if (!roleData || roleData.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden: se requiere rol admin para modificar el contenido' }, { status: 403 })
    }

    updateData.content = content
  }

  const { data, error } = await supabase
    .from('reference_docs')
    .update(updateData)
    .eq('id', id)
    .select('id, title, description, categories, accent_color, filename, created_by, created_at, updated_at')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// DELETE /api/reference-docs?id=xxx
export async function DELETE(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const id = request.nextUrl.searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'id requerido' }, { status: 400 })

  const supabase = createServerClient()
  const { error } = await supabase.from('reference_docs').delete().eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
