'use client'
import Link from 'next/link'
import { CheckCircle2, RotateCcw } from 'lucide-react'
import type { Procedure } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/components/organisms/language-provider'
import { procedureCache } from '@/lib/procedure-cache'

interface ProcedureCardProps {
  procedure: Procedure
  onToggleStatus: (id: string) => void
  dueTone?: 'danger' | 'brand' | 'sage' | 'neutral'
  dueLabel?: string
  showStatus?: boolean
}

const TONE_CLASSES: Record<string, string> = {
  danger:  'bg-danger-soft text-danger',
  brand:   'bg-brand-50 text-brand',
  sage:    'bg-sage-soft text-sage-deep',
  neutral: 'bg-surface-alt text-ink-muted',
}

export function ProcedureCard({
  procedure: p,
  onToggleStatus,
  dueTone = 'neutral',
  dueLabel,
  showStatus = true,
}: ProcedureCardProps) {
  const { t } = useTranslation()
  const dueDate = new Date(p.date.slice(0, 10) + 'T00:00:00')
  dueDate.setDate(dueDate.getDate() + p.reminderDays)
  const dueDateStr = dueDate.toLocaleDateString([], {
    month: 'short',
    day: 'numeric',
    year: dueDate.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined,
  })

  return (
    <div className="relative rounded-[14px] border bg-card p-3.5 flex flex-col gap-2.5">
      <Link href={`/procedures/${p.id}`} className="absolute inset-0 rounded-[14px]" aria-label={p.name} onClick={() => procedureCache.set(p)} />
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-[16px] tracking-tight leading-tight truncate">{p.name}</p>
          <p className="text-ink-muted text-[13px] mt-0.5">{p.patientName}</p>
        </div>
        {dueLabel && (
          <span className={`shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${TONE_CLASSES[dueTone]}`}>
            {dueLabel}
          </span>
        )}
      </div>
      <div className="flex items-center justify-between pt-2.5 border-t border-dashed">
        <p className="font-mono-rc text-[11.5px] text-ink-soft truncate">
          {p.payer} · {t('reminderOn')} {dueDateStr}
        </p>
        <div className="relative flex items-center gap-2 shrink-0">
          {showStatus && <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${
            p.status === 'paid'
              ? 'bg-sage-soft text-sage-deep'
              : 'bg-surface-alt text-ink-muted'
          }`}>
            {p.status === 'paid' ? t('statusPaid') : t('statusPending')}
          </span>}
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8"
            onClick={(e) => { e.preventDefault(); onToggleStatus(p.id) }}
            aria-label={p.status === 'pending' ? t('markPaid') : t('markPending')}
          >
            {p.status === 'pending'
              ? <CheckCircle2 className="h-4 w-4" />
              : <RotateCcw className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </div>
  )
}
