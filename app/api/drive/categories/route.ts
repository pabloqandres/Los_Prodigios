import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { getDriveClient, ROOT_FOLDER_ID } from '@/lib/drive'

export async function GET() {
  const session = await getServerSession(authOptions)
  const hasServiceAccount = !!process.env.GOOGLE_SERVICE_ACCOUNT_JSON

  if (!hasServiceAccount && !session?.accessToken) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  }

  try {
    const drive = getDriveClient(session?.accessToken)

    // Get all subfolders of the root Prodigios folder
    const foldersRes = await drive.files.list({
      q: `'${ROOT_FOLDER_ID}' in parents and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
      fields: 'files(id, name)',
      orderBy: 'name',
    })

    const folders = foldersRes.data.files ?? []

    // Count files in each folder in parallel
    const categories = await Promise.all(
      folders.map(async (folder) => {
        try {
          const filesRes = await drive.files.list({
            q: `'${folder.id}' in parents and trashed = false`,
            fields: 'files(id)',
            pageSize: 1000,
          })
          return {
            id:    folder.id,
            name:  folder.name,
            count: filesRes.data.files?.length ?? 0,
          }
        } catch {
          return { id: folder.id, name: folder.name, count: 0 }
        }
      })
    )

    return NextResponse.json(categories)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error desconocido'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
