import { Navbar } from '@/components/Navbar'
import { Toaster } from '@/components/ui/Toaster'
import { cn } from '@/lib/utils'
import { Inter } from 'next/font/google'
import { ReactNode } from 'react'

import '@/styles/globals.css'

export const metadata = {
   title: 'Breadit',
   description: 'A Reddit clone built with Next.js and TypeScript.',
}

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
   children,
   authModal,
}: {
   children: ReactNode
   authModal: ReactNode
}) {
   return (
      <html
         lang="pt-BR"
         className={cn('bg-white text-slate-900 antialiased', inter.className)}
      >
         <body className="min-h-screen bg-slate-50 pt-12 antialiased">
            {/* @ts-expect-error Server Component */}
            <Navbar />
            {authModal}
            <div className="container mx-auto h-full max-w-7xl pt-12">
               {children}
            </div>

            <Toaster />
         </body>
      </html>
   )
}
