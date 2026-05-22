'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import {
  getAllProcedures,
  getDueProceduresGrouped,
  updateProcedure,
  type DueGroups,
} from '@/lib/procedures'
import type { Procedure, ClaimStatus } from '@/lib/types'
import { ProcedureCard } from '@/components/molecules/procedure-card'
import { RecallMark } from '@/components/brand/RecallMark'
import { useTranslation } from '@/components/organisms/language-provider'
import { fireSummaryNotification } from '@/lib/notifications'
import { toast } from 'sonner'
import type { TranslationKey } from '@/lib/i18n'

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-5 pt-4 pb-2 text-[11px] font-semibold uppercase tracking-widest text-ink-soft">
      {children}
    </div>
  )
}

function StatChip({ n, label, tone }: { n: number; label: string; tone: 'danger' | 'brand' | 'neutral' }) {
  const cls = {
    danger:  'bg-danger-soft text-danger',
    brand:   'bg-brand-50 text-brand',
    neutral: 'bg-surface-alt text-foreground',
  }[tone]
  return (
    <div className={`flex-1 rounded-[10px] px-3 py-2.5 ${cls}`}>
      <div className="font-mono-rc text-[22px] font-medium leading-none">{n}</div>
      <div className="text-[11.5px] mt-1">{label}</div>
    </div>
  )
}

function Onboarding({ t }: { t: (k: TranslationKey) => string }) {
  return (
    <div className="flex flex-col items-center px-7 pt-16 pb-10">
      <div className="relative flex items-center justify-center w-[132px] h-[132px] rounded-full bg-brand-50 mb-8">
        <RecallMark size={86} />
        <span className="absolute rounded-full border"
          style={{ inset: -10, borderColor: 'var(--rc-brand-100)' }} />
        <span className="absolute rounded-full border"
          style={{ inset: -22, borderColor: 'var(--rc-brand-50)' }} />
      </div>
      <h1 className="text-[30px] font-semibold tracking-tight text-center leading-tight">
        {t('onboardingHeadline')}
      </h1>
      <p className="text-[15px] text-ink-muted text-center mt-3 leading-relaxed">
        {t('onboardingSubtitle')}
      </p>
      <div className="w-full mt-9 space-y-4">
        {([
          ['onboardingF1Title', 'onboardingF1Body'],
          ['onboardingF2Title', 'onboardingF2Body'],
          ['onboardingF3Title', 'onboardingF3Body'],
        ] as [TranslationKey, TranslationKey][]).map(([titleKey, bodyKey]) => (
          <div key={titleKey} className="flex gap-3">
            <div className="w-9 h-9 rounded-[10px] bg-brand-50 shrink-0 flex items-center justify-center">
              <span className="w-2 h-2 rounded-full bg-primary" />
            </div>
            <div>
              <p className="font-semibold text-[15px] tracking-tight">{t(titleKey)}</p>
              <p className="text-[13.5px] text-ink-muted mt-0.5 leading-snug">{t(bodyKey)}</p>
            </div>
          </div>
        ))}
      </div>
      <Link
        href="/procedures/new"
        className="mt-10 w-full flex items-center justify-center gap-2 h-[52px]
                   rounded-[10px] bg-primary text-primary-foreground font-medium text-[16px]"
      >
        {t('onboardingCta')}
      </Link>
    </div>
  )
}

function CardGroup({
  procedures, tone, dueLabel, onToggle,
}: {
  procedures: Procedure[]
  tone: 'danger' | 'brand' | 'sage' | 'neutral'
  dueLabel: string
  onToggle: (id: string, status: ClaimStatus) => void
}) {
  if (procedures.length === 0) return null
  return (
    <div className="px-5 flex flex-col gap-2.5">
      {procedures.map((p) => (
        <ProcedureCard
          key={p.id}
          procedure={p}
          dueTone={tone}
          dueLabel={dueLabel}
          onChangeStatus={onToggle}
          showStatus={true}
        />
      ))}
    </div>
  )
}

export function TodayScreen() {
  const { t, language } = useTranslation()
  const tRef = useRef(t)
  useEffect(() => { tRef.current = t })
  const [groups, setGroups] = useState<DueGroups | null>(null)
  const [noProcedures, setNoProcedures] = useState(false)

  const load = useCallback(async () => {
    const [g, all] = await Promise.all([getDueProceduresGrouped(), getAllProcedures()])
    setGroups(g)
    setNoProcedures(all.length === 0)
    const ct = tRef.current
    const total = g.overdue.length + g.dueToday.length
    const body = g.overdue.length > 0
      ? `${g.overdue.length} ${ct('overdueLabel')} · ${g.dueToday.length} ${ct('dueTodayLabel')}`
      : `${g.dueToday.length} ${ct('dueTodayLabel')}`
    fireSummaryNotification(total, body)
  }, [])

  useEffect(() => {
    load().catch(() => toast.error(tRef.current('loadError'))) // eslint-disable-line react-hooks/set-state-in-effect
  }, [load])

  async function changeStatus(id: string, newStatus: ClaimStatus) {
    await updateProcedure(id, { status: newStatus })
    toast.success(t('toastStatusUpdated'), { duration: 2000 })
    load().catch(() => {})
  }

  const today = new Date().toLocaleDateString(language, {
    weekday: 'short', month: 'short', day: 'numeric',
  })
  const dueCount = (groups?.overdue.length ?? 0) + (groups?.dueToday.length ?? 0)

  if (noProcedures) return <Onboarding t={t} />

  return (
    <div className="min-h-screen pb-24">
      <div className="px-5 pt-14 pb-3 bg-background">
        <div className="flex items-center gap-2.5">
          <RecallMark size={28} />
          <span className="font-semibold text-[18px] tracking-tight">Recall</span>
        </div>
        <p className="text-[14px] text-ink-muted mt-1 tracking-tight">
          {today}{dueCount > 0 ? ` · ${dueCount} due` : ''}
        </p>
      </div>

      {groups && (
        <div className="flex gap-2 px-5 pb-4">
          <StatChip n={groups.overdue.length}  label={t('overdueLabel')}  tone="danger"  />
          <StatChip n={groups.dueToday.length} label={t('dueTodayLabel')} tone="brand"   />
          <StatChip n={groups.thisWeek.length} label={t('thisWeekLabel')} tone="neutral" />
        </div>
      )}

      {groups && (
        <>
          {groups.overdue.length > 0 && (
            <>
              <SectionLabel>{t('sectionOverdue')}</SectionLabel>
              <CardGroup procedures={groups.overdue} tone="danger" dueLabel={t('overdueLabel')} onToggle={changeStatus} />
            </>
          )}
          {groups.dueToday.length > 0 && (
            <>
              <SectionLabel>{t('sectionToday')}</SectionLabel>
              <CardGroup procedures={groups.dueToday} tone="brand" dueLabel={t('dueTodayLabel')} onToggle={changeStatus} />
            </>
          )}
          {groups.thisWeek.length > 0 && (
            <>
              <SectionLabel>{t('sectionThisWeek')}</SectionLabel>
              <CardGroup procedures={groups.thisWeek} tone="sage" dueLabel={t('thisWeekLabel')} onToggle={changeStatus} />
            </>
          )}
          {groups.upcoming.length > 0 && (
            <>
              <SectionLabel>{t('sectionUpcoming')}</SectionLabel>
              <CardGroup procedures={groups.upcoming} tone="neutral" dueLabel="" onToggle={changeStatus} />
            </>
          )}
        </>
      )}

      <Link
        href="/procedures/new"
        aria-label={t('navAdd')}
        className="fixed right-5 bottom-[88px] z-25 w-14 h-14 rounded-full
                   bg-primary text-primary-foreground flex items-center justify-center
                   shadow-[0_8px_24px_oklch(0.42_0.075_205_/_0.30)]"
      >
        <Plus className="h-6 w-6" />
      </Link>
    </div>
  )
}
