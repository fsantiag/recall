import type { Metadata } from 'next'
import './globals.css'
import { SerwistRegister } from '@/components/organisms/serwist-register'
import { TabNav } from '@/components/organisms/tab-nav'
import { LanguageProvider } from '@/components/organisms/language-provider'
import { ThemeProvider } from '@/components/organisms/theme-provider'
import { InstallBanner } from '@/components/organisms/install-banner'
import { Toaster } from 'sonner'

export const metadata: Metadata = {
  title: 'Recall',
  description: 'Medical billing tracker for doctors',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <Toaster position="bottom-center" offset={80} richColors />
        <ThemeProvider>
          <LanguageProvider>
            <SerwistRegister />
            <InstallBanner />
            <div className="pb-20">{children}</div>
            <TabNav />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
