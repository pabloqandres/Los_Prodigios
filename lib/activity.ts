import { createServerClient } from '@/lib/supabase'

export type ActivityAction =
  | 'doc.upload' | 'doc.delete' | 'doc.edit'
  | 'asset.upload' | 'asset.approve' | 'asset.reject' | 'asset.delete' | 'asset.bulk_approve'
  | 'entity.create' | 'entity.delete'
  | 'episode.create' | 'episode.edit' | 'episode.analyze_script'
  | 'artwork.create' | 'artwork.edit'

export type ActivityEntityType =
  | 'document' | 'asset_slot' | 'entity' | 'episode' | 'artwork_flow'

export async function logActivity({
  action,
  entity_type,
  entity_id,
  entity_label,
  detail,
  user_email,
}: {
  action: ActivityAction
  entity_type: ActivityEntityType
  entity_id?: string
  entity_label: string
  detail?: string
  user_email: string
}) {
  try {
    const supabase = createServerClient()
    await supabase.from('activity_log').insert({
      action,
      entity_type,
      entity_id: entity_id ?? null,
      entity_label,
      detail: detail ?? null,
      user_email,
    })
  } catch {
    // No bloquear la operación principal si el log falla
  }
}
