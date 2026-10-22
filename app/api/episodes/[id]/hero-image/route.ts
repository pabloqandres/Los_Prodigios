import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { createServerClient } from '@/lib/supabase'

export const runtime = 'nodejs'
export const maxDuration = 30

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
  if (!token?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id: episodeId } = await params
  const { b64, mimeType = 'image/jpeg' } = await request.json()
  if (!b64) return NextResponse.json({ error: 'b64 requerido' }, { status: 400 })

  const supabase = createServerClient()

  const buffer = Buffer.from(b64, 'base64')
  const ext = mimeType === 'image/png' ? 'png' : 'jpg'
  const storagePath = `episodes/hero/${episodeId}.${ext}`

  const { error: uploadErr } = await supabase.storage
    .from('assets')
    .upload(storagePath, buffer, { contentType: mimeType, upsert: true })

  if (uploadErr) return NextResponse.json({ error: uploadErr.message }, { status: 500 })

  const { error: updateErr } = await supabase
    .from('episodes')
    .update({ hero_image_path: storagePath })
    .eq('id', episodeId)

  if (updateErr) return NextResponse.json({ error: updateErr.message }, { status: 500 })

  return NextResponse.json({ hero_image_path: storagePath })
}
