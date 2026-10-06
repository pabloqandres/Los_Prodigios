import type { Metadata } from 'next'
import './globals.css'
import { Providers } from '@/components/Providers'

export const metadata: Metadata = {
  title: 'NUPPA · Los Prodigios',
  description: 'Plataforma de producción NUPPA para la serie animada Los Prodigios',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
