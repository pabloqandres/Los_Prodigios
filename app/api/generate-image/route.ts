import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import { toFile } from 'openai'

export const runtime = 'nodejs'
export const maxDuration = 60

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function POST(req: Request) {
  try {
    const { prompt, referenceB64 } = await req.json()
    if (!prompt?.trim()) {
      return NextResponse.json({ error: 'Prompt vacío' }, { status: 400 })
    }

    let imageData

    if (referenceB64) {
      // Image-to-image: use canonical reference to maintain visual consistency
      const buffer = Buffer.from(referenceB64, 'base64')
      const imageFile = await toFile(buffer, 'reference.png', { type: 'image/png' })

      const response = await openai.images.edit({
        model: 'gpt-image-1',
        image: imageFile,
        prompt: prompt.trim(),
        n: 1,
        size: '1024x1024',
      })
      imageData = response.data?.[0]
    } else {
      // Text-to-image: generate from scratch
      const response = await openai.images.generate({
        model: 'gpt-image-1',
        prompt: prompt.trim(),
        n: 1,
        size: '1024x1024',
        quality: 'high',
      })
      imageData = response.data?.[0]
    }

    if (!imageData) {
      return NextResponse.json({ error: 'Sin imagen en respuesta' }, { status: 500 })
    }

    if (imageData.b64_json) {
      return NextResponse.json({ b64: imageData.b64_json, usedReference: !!referenceB64 })
    }
    return NextResponse.json({ url: imageData.url, usedReference: !!referenceB64 })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error desconocido'
    console.error('[generate-image]', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
