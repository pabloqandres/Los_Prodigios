import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { createServerClient } from '@/lib/supabase'

export const runtime = 'nodejs'
export const maxDuration = 60

// POST /api/assets/upload-to-slot
// Body: { slot_id, b64, filename, mimeType? }

export async function POST(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { slot_id, b64, filename, mimeType = 'image/jpeg' } = await req.json()
  if (!slot_id || !b64) return NextResponse.json({ error: 'slot_id y b64 requeridos' }, { status: 400 })

  const supabase = createServerClient()

  const { data: slot, error: slotErr } = await supabase
    .from('asset_slots')
    .select('*')
    .eq('id', slot_id)
    .single()

  if (slotErr || !slot) return NextResponse.json({ error: 'Slot no encontrado' }, { status: 404 })

  // Upload to Supabase Storage
  const buffer = Buffer.from(b64, 'base64')
  const ext = mimeType === 'image/png' ? 'png' : 'jpg'
  // Sanitize: strip accents, replace spaces/special chars with underscores
  function sanitize(s: string) {
    return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9._-]/g, '_')
  }
  const rawName = filename ?? `${slot.entity_name}_${slot.view_type}_${slot.outfit ?? ''}_DRAFT_${Date.now()}.${ext}`
  const safeName = sanitize(rawName)
  const storagePath = `${sanitize(slot.category)}/${sanitize(slot.entity_name)}/pending/${safeName}`

  const { error: uploadErr } = await supabase.storage
    .from('assets')
    .upload(storagePath, buffer, {
      contentType: mimeType,
      upsert: true,
    })

  if (uploadErr) return NextResponse.json({ error: uploadErr.message }, { status: 500 })

  // Update slot
  const { error: updateErr } = await supabase
    .from('asset_slots')
    .update({
      status: 'in_review',
      pending_drive_file_id: storagePath,   // reusing column to store storage path
      pending_drive_folder_id: `${slot.category}/${slot.entity_name}/pending`,
      updated_at: new Date().toISOString(),
    })
    .eq('id', slot_id)

  if (updateErr) {
    console.error('[upload-to-slot] DB update failed:', updateErr)
    return NextResponse.json({
      error: `DB update falló: ${updateErr.message} | code: ${updateErr.code} | slot_id: ${slot_id} | status_actual: ${slot.status}`,
    }, { status: 500 })
  }

  const { data: updated } = await supabase
    .from('asset_slots')
    .select('*, asset_approvals(*)')
    .eq('id', slot_id)
    .single()

  return NextResponse.json({ slot: updated })
}
