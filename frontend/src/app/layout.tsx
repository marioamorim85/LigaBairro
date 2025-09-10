import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ApolloWrapper } from '@/lib/apollo-wrapper'
import { AuthProvider } from '@/components/auth/auth-provider'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as SonnerToaster } from 'sonner'
import { ToastContainer } from '@/components/ui/toast-delight'
import { EasterEggDetector, SecretPanel } from '@/components/ui/easter-egg'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'PorPerto - Ajuda perto de ti em Mozelos',
  description: 'Plataforma que liga requerentes de pequenas tarefas a ajudantes locais em Mozelos, Santa Maria da Feira',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt">
      <body className={inter.className} suppressHydrationWarning={true}>
        <ApolloWrapper>
          <AuthProvider>
            {children}
            <Toaster />
            <SonnerToaster />
            <ToastContainer />
            <EasterEggDetector />
            <SecretPanel />
          </AuthProvider>
        </ApolloWrapper>
      </body>
    </html>
  )
}