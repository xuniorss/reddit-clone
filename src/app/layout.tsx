import { ReactNode } from 'react'

import '@/styles/globals.css'

export const metadata = {
   title: 'Breadit',
   description: 'A Reddit clone built with Next.js and TypeScript.',
}

export default function RootLayout({ children }: { children: ReactNode }) {
   return (
      <html lang="pt-BR">
         <body>{children}</body>
      </html>
   )
}
