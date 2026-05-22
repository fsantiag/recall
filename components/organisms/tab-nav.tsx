'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, List, CalendarDays, Settings } from 'lucide-react'
import { useTranslation } from '@/components/organisms/language-provider'
import type { TranslationKey } from '@/lib/i18n'

const TABS: { href: string; labelKey: TranslationKey; icon: React.ElementType }[] = [
  { href: '/',           labelKey: 'navResume',   icon: LayoutDashboard },
  { href: '/procedures', labelKey: 'navAll',      icon: List },
  { href: '/calendar',   labelKey: 'navCalendar', icon: CalendarDays },
  { href: '/settings',   labelKey: 'navSettings', icon: Settings },
]

export function TabNav() {
  const pathname = usePathname()
  const { t } = useTranslation()
  return (
    <nav
      aria-label={t('navAriaLabel')}
      className="fixed bottom-0 left-0 right-0 z-30 flex
                 border-t bg-card pt-2 pb-[env(safe-area-inset-bottom,8px)]"
    >
      {TABS.map(({ href, labelKey, icon: Icon }) => {
        const active = href === '/' ? pathname === '/' : pathname.startsWith(href)
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? 'page' : undefined}
            className={`flex-1 flex flex-col items-center gap-0.5 py-1 text-[10.5px] font-medium
              ${active ? 'text-primary' : 'text-ink-soft'}`}
          >
            <Icon className="h-[22px] w-[22px]" />
            {t(labelKey)}
          </Link>
        )
      })}
    </nav>
  )
}
