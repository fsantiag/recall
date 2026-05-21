'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, PlusCircle, Settings } from 'lucide-react'

const links = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/procedures/new', label: 'Add', icon: PlusCircle },
  { href: '/settings', label: 'Settings', icon: Settings },
]

export function Nav() {
  const pathname = usePathname()
  return (
    <nav aria-label="Main navigation" className="fixed bottom-0 left-0 right-0 border-t bg-background flex justify-around py-2">
      {links.map(({ href, label, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          aria-current={pathname === href ? 'page' : undefined}
          className={`flex flex-col items-center gap-1 px-4 py-1 text-xs ${
            pathname === href ? 'text-primary' : 'text-muted-foreground'
          }`}
        >
          <Icon className="h-5 w-5" />
          {label}
        </Link>
      ))}
    </nav>
  )
}
