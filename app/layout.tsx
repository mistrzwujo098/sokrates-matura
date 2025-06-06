import './globals.css'
import type { Metadata } from 'next'
import { ThemeProvider } from '@/components/ThemeProvider'

export const metadata: Metadata = {
  title: 'SokratesMatura - Inteligentny Asystent Maturzysty',
  description: 'Ucz się matematyki metodą Sokratesa. Inteligentny asystent, który prowadzi Cię przez proces myślowy zamiast podawać gotowe odpowiedzi.',
  keywords: 'matura, matematyka, asystent, ai, nauka, sokrates',
  authors: [{ name: 'Paulina od Matematyki' }],
  openGraph: {
    title: 'SokratesMatura - Inteligentny Asystent Maturzysty',
    description: 'Ucz się matematyki metodą Sokratesa',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pl" suppressHydrationWarning>
      <body className="min-h-screen bg-white dark:bg-dark-950 transition-colors duration-300">
        <ThemeProvider>
          <div className="relative">
            {/* Background gradient effects */}
            <div className="fixed inset-0 -z-10 overflow-hidden">
              <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary-400 opacity-20 blur-3xl" />
              <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-cyan-400 opacity-20 blur-3xl" />
              <div className="absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-400 opacity-10 blur-3xl" />
            </div>
            
            {/* Grid pattern overlay */}
            <div className="fixed inset-0 -z-10 bg-[url('/grid.svg')] bg-center opacity-5 dark:opacity-10" />
            
            {/* Main content */}
            <main className="relative z-10">
              {children}
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
