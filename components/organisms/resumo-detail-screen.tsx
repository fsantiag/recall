'use client'
import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, FileDown } from 'lucide-react'
import { getSummaryGroups, updateProcedure } from '@/lib/procedures'
import { ProcedureCard } from '@/components/molecules/procedure-card'
import { useTranslation } from '@/components/organisms/language-provider'
import { generateProceduresPDF } from '@/lib/pdf'
import { toast } from 'sonner'
import type { Procedure, ClaimStatus } from '@/lib/types'
import type { TranslationKey } from '@/lib/i18n'

type Category = 'full-denial' | 'partial-denial' | 'overdue' | 'paid' | 'pending'

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
  'pending':        { labelKey: 'resumoPending',       emptyKey: 'resumoEmptyPending',       extract: g => g.pending       },
}

interface Props { category: string; initialPayer: string | null }

export function ResumoDetailScreen({ category, initialPayer }: Props) {
  const { t, language } = useTranslation()
  const router = useRouter()
  const [procedures, setProcedures] = useState<Procedure[]>([])

  const config = CATEGORY_CONFIG[category as Category]

  const load = useCallback(async () => {
    const groups = await getSummaryGroups()
    if (!config) return
    setProcedures(config.extract(groups))
  }, [category, config])

  useEffect(() => {
    load().catch(() => toast.error(t('loadError')))
  }, [load, t])

  async function exportPDF() {
    await generateProceduresPDF(visible, initialPayer, language, {
      title: t(config.labelKey),
      generatedOnLabel: t('pdfGeneratedOn'),
      payerLabel: t('pdfColPayer'),
      allPayersLabel: t('pdfAllPayers'),
      colPatient: t('pdfColPatient'),
      colProcedure: t('pdfColProcedure'),
      colLocation: t('pdfColLocation'),
      colFeeType: t('pdfColFeeType'),
      colPayer: t('pdfColPayer'),
      colDate: t('pdfColDate'),
      colStatus: t('pdfColStatus'),
      statusLabels: {
        pending:         t('statusPending'),
        paid:            t('statusPaid'),
        partial_denial:  t('statusPartialDenial'),
        full_denial:     t('statusFullDenial'),
      },
    })
  }

  async function changeStatus(id: string, newStatus: ClaimStatus) {
    await updateProcedure(id, { status: newStatus })
    toast.success(t('toastStatusUpdated'), { duration: 2000 })
    load().catch(() => {})
  }

  if (!config) {
    router.replace('/')
    return null
  }

  const visible = initialPayer ? procedures.filter(p => p.payer === initialPayer) : procedures

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
        <div className="ml-auto flex items-center gap-2">
          {initialPayer && (
            <span className="text-[12px] font-medium px-2.5 py-1 rounded-full bg-surface-alt text-ink-muted">
              {initialPayer}
            </span>
          )}
          {visible.length > 0 && (
            <button
              onClick={exportPDF}
              aria-label={t('pdfDownload')}
              title={t('pdfDownload')}
              className="flex items-center justify-center w-9 h-9 rounded-full bg-surface-alt text-ink-muted active:scale-95 transition-transform"
            >
              <FileDown className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

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
