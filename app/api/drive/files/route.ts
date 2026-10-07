import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { getDriveClient } from '@/lib/drive'

export async function GET(req: Request) {
  const session = await getServerSession(authOptions)
  const hasServiceAccount = !!process.env.GOOGLE_SERVICE_ACCOUNT_JSON

  if (!hasServiceAccount && !session?.accessToken) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const folderId = searchParams.get('folderId')
  if (!folderId) {
    return NextResponse.json({ error: 'folderId requerido' }, { status: 400 })
  }

  try {
    const drive = getDriveClient(session?.accessToken)

    const res = await drive.files.list({
      q: `'${folderId}' in parents and trashed = false`,
      fields: 'files(id, name, mimeType, thumbnailLink, webViewLink, webContentLink, createdTime, size)',
      orderBy: 'createdTime desc',
      pageSize: 100,
    })

    return NextResponse.json(res.data.files ?? [])
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error desconocido'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
