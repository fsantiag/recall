import type { Metadata, Viewport } from 'next'
import './globals.css'
import { SerwistRegister } from '@/components/organisms/serwist-register'
import { TabNav } from '@/components/organisms/tab-nav'
import { LanguageProvider } from '@/components/organisms/language-provider'
import { ThemeProvider } from '@/components/organisms/theme-provider'
import { InstallBanner } from '@/components/organisms/install-banner'
import { Toaster } from 'sonner'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#005860',
}

export const metadata: Metadata = {
  title: 'Recall',
  description: 'Medical billing tracker for doctors',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
  },
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
