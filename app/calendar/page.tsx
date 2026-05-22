'use client'

import { CalendarGrid } from '@/components/organisms/calendar-grid'
import { useTranslation } from '@/components/organisms/language-provider'

export default function CalendarPage() {
  const { t } = useTranslation()
  return (
    <main className="max-w-2xl mx-auto pb-24">
      <div className="px-5 pt-[max(3.5rem,env(safe-area-inset-top))] pb-2">
        <h1 className="text-[28px] font-semibold tracking-tight">{t('calendarTitle')}</h1>
      </div>
      <CalendarGrid />
    </main>
  )
}
