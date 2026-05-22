'use client'
import { usePathname } from 'next/navigation'

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  return (
    <div
      key={pathname}
      style={{ animation: 'page-enter 0.22s cubic-bezier(0.25,0.46,0.45,0.94) both' }}
      className="pb-20"
    >
      {children}
    </div>
  )
}
