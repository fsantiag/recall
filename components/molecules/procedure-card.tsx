'use client'
import Link from 'next/link'
import { CheckCircle2, RotateCcw } from 'lucide-react'
import type { Procedure } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/components/organisms/language-provider'

interface ProcedureCardProps {
  procedure: Procedure
  onToggleStatus: (id: string) => void
  dueTone?: 'danger' | 'brand' | 'sage' | 'neutral'
  dueLabel?: string
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
}: ProcedureCardProps) {
  const { t } = useTranslation()
  const dateStr = new Date(p.date).toLocaleDateString([], {
    month: 'short', day: 'numeric', year: 'numeric',
  })

  return (
    <div className="relative rounded-[14px] border bg-card p-3.5 flex flex-col gap-2.5">
      <Link href={`/procedures/${p.id}`} className="absolute inset-0 rounded-[14px]" aria-label={p.name} />
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
        <p className="font-mono-rc text-[11.5px] text-ink-soft truncate">{p.payer} · {dateStr}</p>
        <div className="relative flex items-center gap-1 shrink-0">
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
