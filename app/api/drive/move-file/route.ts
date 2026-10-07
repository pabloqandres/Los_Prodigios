import { NextRequest, NextResponse } from 'next/server'
import { getDriveWriteClient } from '@/lib/drive'

// POST /api/drive/move-file
// Body: { fileId, fromFolderId, toFolderId, newName? }
// Returns: { id, name, webViewLink }

export async function POST(req: NextRequest) {
  try {
    const { fileId, fromFolderId, toFolderId, newName } = await req.json()
    if (!fileId || !fromFolderId || !toFolderId) {
      return NextResponse.json({ error: 'fileId, fromFolderId y toFolderId son requeridos' }, { status: 400 })
    }

    const drive = getDriveWriteClient()

    const res = await drive.files.update({
      fileId,
      addParents: toFolderId,
      removeParents: fromFolderId,
      fields: 'id, name, webViewLink',
      requestBody: newName ? { name: newName } : {},
    })

    return NextResponse.json({
      id: res.data.id,
      name: res.data.name,
      webViewLink: res.data.webViewLink,
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error desconocido'
    console.error('[move-file]', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
