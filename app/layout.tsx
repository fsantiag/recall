import type { Metadata } from 'next'
import './globals.css'
import { PinGate } from '@/components/organisms/pin-gate'
import { SerwistRegister } from '@/components/organisms/serwist-register'
import { TabNav } from '@/components/organisms/tab-nav'
import { LanguageProvider } from '@/components/organisms/language-provider'
import { ThemeProvider } from '@/components/organisms/theme-provider'
import { InstallBanner } from '@/components/organisms/install-banner'
import { PageTransition } from '@/components/organisms/page-transition'

export const metadata: Metadata = {
  title: 'Recall',
  description: 'Medical billing tracker for doctors',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <ThemeProvider>
          <LanguageProvider>
            <SerwistRegister />
            <PinGate>
              <InstallBanner />
              <PageTransition>{children}</PageTransition>
              <TabNav />
            </PinGate>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
