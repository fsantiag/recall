'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Bell, List, CalendarDays, Settings } from 'lucide-react'

const TABS = [
  { href: '/',           label: 'Today',    icon: Bell },
  { href: '/procedures', label: 'All',      icon: List },
  { href: '/calendar',   label: 'Calendar', icon: CalendarDays },
  { href: '/settings',   label: 'Settings', icon: Settings },
]

export function TabNav() {
  const pathname = usePathname()
  return (
    <nav
      aria-label="Main navigation"
      className="fixed bottom-0 left-0 right-0 z-30 flex justify-around
                 border-t bg-card pt-2 pb-[env(safe-area-inset-bottom,8px)]"
    >
      {TABS.map(({ href, label, icon: Icon }) => {
        const active = href === '/' ? pathname === '/' : pathname.startsWith(href)
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? 'page' : undefined}
            className={`flex flex-col items-center gap-0.5 px-4 py-1 text-[10.5px] font-medium
              ${active ? 'text-primary' : 'text-ink-soft'}`}
          >
            <Icon className="h-[22px] w-[22px]" />
            {label}
          </Link>
        )
      })}
    </nav>
  )
}
