'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { getSummaryGroups, getAllProcedures, type SummaryGroups } from '@/lib/procedures'
import { SummaryCard } from '@/components/molecules/summary-card'
import { RecallMark } from '@/components/brand/RecallMark'
import { useTranslation } from '@/components/organisms/language-provider'
import { fireSummaryNotification } from '@/lib/notifications'
import { toast } from 'sonner'
import type { TranslationKey } from '@/lib/i18n'

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

export function ResumoScreen() {
  const { t } = useTranslation()
  const tRef = useRef(t)
  useEffect(() => { tRef.current = t })
  const router = useRouter()
  const [groups, setGroups] = useState<SummaryGroups | null>(null)
  const [noProcedures, setNoProcedures] = useState(false)

  const load = useCallback(async () => {
    const [g, all] = await Promise.all([getSummaryGroups(), getAllProcedures()])
    setGroups(g)
    setNoProcedures(all.length === 0)
    const ct = tRef.current
    fireSummaryNotification(
      g.overdue.length,
      `${g.overdue.length} ${ct('resumoOverdue')}`,
    )
  }, [])

  useEffect(() => {
    load().catch(() => toast.error(tRef.current('loadError'))) // eslint-disable-line react-hooks/set-state-in-effect
  }, [load])

  if (noProcedures) return <Onboarding t={t} />

  return (
    <div className="min-h-screen pb-24">
      <div className="px-5 pt-14 pb-3 bg-background">
        <div className="flex items-center gap-2.5">
          <RecallMark size={28} />
          <span className="font-semibold text-[18px] tracking-tight">Recall</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 px-5 py-4">
        <SummaryCard
          count={groups?.fullDenial.length ?? 0}
          label={t('resumoFullDenial')}
          tone="red"
          onClick={() => router.push('/resumo/full-denial')}
        />
        <SummaryCard
          count={groups?.partialDenial.length ?? 0}
          label={t('resumoPartialDenial')}
          tone="amber"
          onClick={() => router.push('/resumo/partial-denial')}
        />
        <SummaryCard
          count={groups?.overdue.length ?? 0}
          label={t('resumoOverdue')}
          tone="orange"
          onClick={() => router.push('/resumo/overdue')}
        />
        <SummaryCard
          count={groups?.paid.length ?? 0}
          label={t('resumoPaid')}
          tone="green"
          onClick={() => router.push('/resumo/paid')}
        />
      </div>

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
