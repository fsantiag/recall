'use client'
import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'
import { getSummaryGroups, updateProcedure } from '@/lib/procedures'
import { ProcedureCard } from '@/components/molecules/procedure-card'
import { useTranslation } from '@/components/organisms/language-provider'
import { toast } from 'sonner'
import type { Procedure, ClaimStatus } from '@/lib/types'
import type { TranslationKey } from '@/lib/i18n'

type Category = 'full-denial' | 'partial-denial' | 'overdue' | 'paid'

type SummaryGroups = Awaited<ReturnType<typeof getSummaryGroups>>

const CATEGORY_CONFIG: Record<Category, {
  labelKey: TranslationKey
  emptyKey: TranslationKey
  extract: (g: SummaryGroups) => Procedure[]
}> = {
  'full-denial':    { labelKey: 'resumoFullDenial',    emptyKey: 'resumoEmptyFullDenial',    extract: g => g.fullDenial    },
  'partial-denial': { labelKey: 'resumoPartialDenial', emptyKey: 'resumoEmptyPartialDenial', extract: g => g.partialDenial },
  'overdue':        { labelKey: 'resumoOverdue',       emptyKey: 'resumoEmptyOverdue',       extract: g => g.overdue       },
  'paid':           { labelKey: 'resumoPaid',          emptyKey: 'resumoEmptyPaid',          extract: g => g.paid          },
}

interface Props { category: string }

export function ResumoDetailScreen({ category }: Props) {
  const { t } = useTranslation()
  const router = useRouter()
  const [procedures, setProcedures] = useState<Procedure[]>([])
  const [selectedPayer, setSelectedPayer] = useState<string | null>(null)

  const config = CATEGORY_CONFIG[category as Category]

  const load = useCallback(async () => {
    const groups = await getSummaryGroups()
    if (!config) return
    setProcedures(config.extract(groups))
    setSelectedPayer(null)
  }, [category, config])

  useEffect(() => {
    load().catch(() => toast.error(t('loadError')))
  }, [load, t])

  async function changeStatus(id: string, newStatus: ClaimStatus) {
    await updateProcedure(id, { status: newStatus })
    toast.success(t('toastStatusUpdated'), { duration: 2000 })
    load().catch(() => {})
  }

  if (!config) {
    router.replace('/')
    return null
  }

  const payers = Array.from(new Set(procedures.map(p => p.payer))).sort()
  const showFilter = payers.length > 0
  const visible = selectedPayer ? procedures.filter(p => p.payer === selectedPayer) : procedures

  return (
    <div className="min-h-screen pb-24">
      <div className="px-5 pt-14 pb-3 bg-background flex items-center gap-3">
        <button
          onClick={() => router.back()}
          aria-label="Back"
          className="flex items-center justify-center w-9 h-9 rounded-full bg-surface-alt"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <span className="font-semibold text-[18px] tracking-tight">
          {t(config.labelKey)}
        </span>
      </div>

      {showFilter && (
        <div className="flex gap-2 px-5 pb-3 overflow-x-auto">
          <button
            onClick={() => setSelectedPayer(null)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-[13px] font-medium border transition-colors
              ${selectedPayer === null
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-card text-ink-muted border-border'}`}
          >
            {t('resumoFilterAll')}
          </button>
          {payers.map(payer => (
            <button
              key={payer}
              onClick={() => setSelectedPayer(payer === selectedPayer ? null : payer)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-[13px] font-medium border transition-colors
                ${selectedPayer === payer
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-card text-ink-muted border-border'}`}
            >
              {payer}
            </button>
          ))}
        </div>
      )}

      {visible.length === 0 ? (
        <p className="px-5 pt-8 text-center text-ink-muted text-[15px]">
          {t(config.emptyKey)}
        </p>
      ) : (
        <div className="px-5 flex flex-col gap-2.5">
          {visible.map(p => (
            <ProcedureCard
              key={p.id}
              procedure={p}
              onChangeStatus={changeStatus}
              showStatus={true}
            />
          ))}
        </div>
      )}
    </div>
  )
}
