import { NextRequest, NextResponse } from 'next/server'
import { getDriveWriteClient, ROOT_FOLDER_ID } from '@/lib/drive'

// POST /api/drive/ensure-folder
// Body: { category, entity_name, subfolder }
// Returns: { folderId: string }
// Creates the folder hierarchy if it doesn't exist, returns existing ID if it does.

async function findOrCreateFolder(drive: ReturnType<typeof getDriveWriteClient>, name: string, parentId: string): Promise<string> {
  // Search for existing folder
  const res = await drive.files.list({
    q: `name='${name}' and '${parentId}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`,
    fields: 'files(id)',
    spaces: 'drive',
  })
  if (res.data.files && res.data.files.length > 0) {
    return res.data.files[0].id!
  }
  // Create it
  const created = await drive.files.create({
    requestBody: {
      name,
      mimeType: 'application/vnd.google-apps.folder',
      parents: [parentId],
    },
    fields: 'id',
  })
  return created.data.id!
}

export async function POST(req: NextRequest) {
  try {
    const { category, entity_name, subfolder } = await req.json()
    if (!category || !entity_name || !subfolder) {
      return NextResponse.json({ error: 'category, entity_name y subfolder son requeridos' }, { status: 400 })
    }

    const drive = getDriveWriteClient()

    // Ensure: ROOT / Assets / {category_label} / {entity_name} / {subfolder}
    const categoryLabel = category.charAt(0).toUpperCase() + category.slice(1)

    const assetsId     = await findOrCreateFolder(drive, 'Assets', ROOT_FOLDER_ID)
    const categoryId   = await findOrCreateFolder(drive, categoryLabel, assetsId)
    const entityId     = await findOrCreateFolder(drive, entity_name, categoryId)
    const subFolderId  = await findOrCreateFolder(drive, subfolder, entityId)

    return NextResponse.json({ folderId: subFolderId })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error desconocido'
    console.error('[ensure-folder]', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
