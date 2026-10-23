#!/usr/bin/env node
/**
 * Seed NUPPA craft knowledge into reference_docs
 * Run from the platform/ directory:
 *   node supabase/seed-knowledge.js
 */

const fs = require('fs')
const path = require('path')
const { createClient } = require('@supabase/supabase-js')

// ── Load env vars from .env.local ──────────────────────────────────────────
const envPath = path.join(__dirname, '..', '.env.local')
const envVars = {}
for (const line of fs.readFileSync(envPath, 'utf-8').split('\n')) {
  const [key, ...rest] = line.split('=')
  if (key && rest.length) envVars[key.trim()] = rest.join('=').trim()
}

const supabaseUrl = envVars['NEXT_PUBLIC_SUPABASE_URL']
const supabaseKey = envVars['SUPABASE_SERVICE_ROLE_KEY']
if (!supabaseUrl || !supabaseKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

// ── Knowledge base root ────────────────────────────────────────────────────
const STUDIO_ROOT = path.join(__dirname, '..', '..', 'StudioOS')
const KNOWLEDGE_ROOT = path.join(STUDIO_ROOT, 'Knowledge')

// ── Category config ────────────────────────────────────────────────────────
const ACCENT_COLORS = {
  meta:          '#DFF818',
  animation:     '#FF6B35',
  branding:      '#9B6FD4',
  characters:    '#4ECDC4',
  cinematography:'#FFE66D',
  sound:         '#A8E6CF',
  storytelling:  '#FF8B94',
  visual:        '#88D8B0',
  worldbuilding: '#C7B3FF',
}

// Map folder names → category key + accent color
const FOLDER_MAP = {
  'Animation':     { key: 'animation',     label: 'Animación' },
  'Branding':      { key: 'branding',      label: 'Branding' },
  'Characters':    { key: 'characters',    label: 'Personajes' },
  'Cinematography':{ key: 'cinematography',label: 'Cinematografía' },
  'Sound':         { key: 'sound',         label: 'Sonido' },
  'Storytelling':  { key: 'storytelling',  label: 'Narrativa' },
  'Visual':        { key: 'visual',        label: 'Visual' },
  'Worldbuilding': { key: 'worldbuilding', label: 'Worldbuilding' },
}

// Friendly titles from filenames
function titleFromFilename(filename) {
  return filename
    .replace(/\.md$/, '')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase())
}

// ── Collect all documents ──────────────────────────────────────────────────
const docs = []

// Root docs: CONSTITUTION.md + REVIEW_SYSTEM.md
for (const [filename, title] of [
  ['CONSTITUTION.md', 'Constitución del Estudio — Filosofía e identidad'],
  ['REVIEW_SYSTEM.md', 'Sistema de Evaluación — 6 dimensiones editoriales'],
]) {
  const filepath = path.join(STUDIO_ROOT, filename)
  if (!fs.existsSync(filepath)) { console.warn(`Skipping missing: ${filepath}`); continue }
  const content = fs.readFileSync(filepath, 'utf-8').trim()
  docs.push({
    title,
    filename,
    categories: ['craft:meta'],
    accent_color: ACCENT_COLORS.meta,
    doc_type: 'craft',
    content,
    created_by: 'seed-script',
  })
}

// Knowledge subfolder docs
for (const folder of Object.keys(FOLDER_MAP)) {
  const { key, label } = FOLDER_MAP[folder]
  const folderPath = path.join(KNOWLEDGE_ROOT, folder)
  if (!fs.existsSync(folderPath)) { console.warn(`Skipping missing folder: ${folderPath}`); continue }

  for (const filename of fs.readdirSync(folderPath).sort()) {
    if (!filename.endsWith('.md') || filename.startsWith('.')) continue
    const filepath = path.join(folderPath, filename)
    const content = fs.readFileSync(filepath, 'utf-8').trim()
    if (content.length < 50) continue

    const baseName = filename.replace(/\.md$/, '')
    const humanTitle = titleFromFilename(filename)

    docs.push({
      title: `${label} — ${humanTitle}`,
      filename,
      categories: [`craft:${key}`],
      accent_color: ACCENT_COLORS[key] || '#9B6FD4',
      doc_type: 'craft',
      content,
      created_by: 'seed-script',
    })
  }
}

// ── Insert docs (skip if title already exists) ─────────────────────────────
async function main() {
  console.log(`Found ${docs.length} craft documents to seed.\n`)

  // Fetch existing titles to avoid duplicates
  const { data: existing } = await supabase
    .from('reference_docs')
    .select('title')
    .eq('doc_type', 'craft')

  const existingTitles = new Set((existing ?? []).map(d => d.title))
  const toInsert = docs.filter(d => !existingTitles.has(d.title))
  const skipped = docs.length - toInsert.length

  if (skipped > 0) {
    console.log(`Skipping ${skipped} already-seeded documents.`)
  }

  if (toInsert.length === 0) {
    console.log('Nothing to insert — all documents already seeded.')
    return
  }

  console.log(`Inserting ${toInsert.length} documents...`)

  let inserted = 0
  let errors = 0

  for (const doc of toInsert) {
    const { error } = await supabase.from('reference_docs').insert(doc)
    if (error) {
      console.error(`  ✗ ${doc.title}: ${error.message}`)
      errors++
    } else {
      console.log(`  ✓ ${doc.title}`)
      inserted++
    }
  }

  console.log(`\nDone. ${inserted} inserted, ${errors} errors, ${skipped} skipped.`)
}

main().catch(e => { console.error(e); process.exit(1) })
