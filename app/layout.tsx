import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { PinGate } from '@/components/organisms/pin-gate'
import { SerwistRegister } from '@/components/organisms/serwist-register'
import { Nav } from '@/components/organisms/nav'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Recall',
  description: 'Medical billing tracker for doctors',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SerwistRegister />
        <PinGate>
          <div className="pb-16">{children}</div>
          <Nav />
        </PinGate>
      </body>
    </html>
  )
}
