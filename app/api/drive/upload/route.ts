import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { getDriveWriteClient } from '@/lib/drive'
import { Readable } from 'stream'

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  const hasServiceAccount = !!process.env.GOOGLE_SERVICE_ACCOUNT_JSON

  if (!hasServiceAccount && !session?.accessToken) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  }

  try {
    const { b64, url, folderId, filename } = await req.json()

    if (!folderId) {
      return NextResponse.json({ error: 'folderId requerido' }, { status: 400 })
    }

    // Get image buffer from base64 or URL
    let buffer: Buffer
    if (b64) {
      buffer = Buffer.from(b64, 'base64')
    } else if (url) {
      const res = await fetch(url)
      buffer = Buffer.from(await res.arrayBuffer())
    } else {
      return NextResponse.json({ error: 'Se requiere b64 o url' }, { status: 400 })
    }

    const drive = getDriveWriteClient(session?.accessToken)

    const name = filename ?? `artwork_${Date.now()}.png`

    const file = await drive.files.create({
      requestBody: {
        name,
        parents: [folderId],
        mimeType: 'image/png',
      },
      media: {
        mimeType: 'image/png',
        body: Readable.from(buffer),
      },
      fields: 'id, name, webViewLink',
    })

    return NextResponse.json({
      id: file.data.id,
      name: file.data.name,
      webViewLink: file.data.webViewLink,
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error desconocido'
    console.error('[drive/upload]', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
