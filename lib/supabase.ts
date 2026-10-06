import { createClient as createSupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''

// Browser-side client (uses anon key)
export function createClient() {
  return createSupabaseClient(supabaseUrl, supabaseAnonKey)
}

// Server-side client (uses service role key — never expose to browser)
export function createServerClient() {
  return createSupabaseClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

export const supabase = createClient()

export type AssetSlot = {
  id: string
  category: 'personajes' | 'locaciones' | 'props' | 'criaturas' | 'secundarios' | 'mascotas' | 'simbolos' | 'rivales'
  entity_name: string
  entity_label: string
  view_type: string
  outfit: string | null
  age_version: string | null
  version_label: string
  notes: string | null
  generated_prompt: string | null
  status: 'pending' | 'in_review' | 'approved' | 'rejected'
  pending_drive_file_id: string | null
  pending_drive_folder_id: string | null
  approved_drive_file_id: string | null
  approved_drive_folder_id: string | null
  created_by: string
  created_at: string
  updated_at: string
}

export type AssetApproval = {
  id: string
  slot_id: string
  reviewer_email: string
  reviewer_name: string
  approved: boolean
  note: string | null
  drive_file_id: string | null
  created_at: string
}

export type AssetSlotWithApprovals = AssetSlot & {
  approvals: AssetApproval[]
}

export type CanonCheck = {
  id: string
  label: string
  status: 'ok' | 'warning' | 'error'
  severity: 'ok' | 'warning' | 'critical'
  detail: string
  canon_rule?: string
}

export type ValidationResult = {
  verdict: 'ok' | 'warning' | 'critical'
  score: number
  checks: CanonCheck[]
  suggestion?: string
  blocked: boolean
}

// Convert a Supabase Storage path to a public URL
export function storageUrl(path: string | null | undefined): string | null {
  if (!path) return null
  // If it's already a full URL, return as-is
  if (path.startsWith('http')) return path
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/assets/${path}`
}

export type Document = {
  id: string
  title: string
  content: string
  area: string
  context: string | null
  created_by: string
  created_at: string
  updated_at: string
  drive_url: string | null
  tags: string[]
}
