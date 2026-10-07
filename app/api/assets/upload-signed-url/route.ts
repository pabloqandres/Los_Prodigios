import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { createServerClient } from '@/lib/supabase'

export const runtime = 'nodejs'

// POST /api/assets/upload-signed-url
// body: { path: string }  — e.g. "docs/filename.docx"
// Returns a signed upload URL the client can PUT to directly (bypasses RLS + body size limits)
export async function POST(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { path } = await req.json()
  if (!path) return NextResponse.json({ error: 'path requerido' }, { status: 400 })

  const supabase = createServerClient()
  const { data, error } = await supabase.storage
    .from('assets')
    .createSignedUploadUrl(path)

  if (error || !data) {
    return NextResponse.json({ error: error?.message ?? 'Error generando URL' }, { status: 500 })
  }

  return NextResponse.json({ signed_url: data.signedUrl, path: data.path, token: data.token })
}
