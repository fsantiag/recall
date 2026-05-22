'use client'
import Link from 'next/link'
import type { Procedure, ClaimStatus } from '@/lib/types'
import { useTranslation } from '@/components/organisms/language-provider'
import { procedureCache } from '@/lib/procedure-cache'
import { StatusPicker } from '@/components/molecules/status-picker'

interface ProcedureCardProps {
  procedure: Procedure
  onChangeStatus: (id: string, status: ClaimStatus) => void
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
  onChangeStatus,
  dueTone = 'neutral',
  dueLabel,
  showStatus = true,
}: ProcedureCardProps) {
  const { t, language } = useTranslation()
  const dueDate = new Date(p.date.slice(0, 10) + 'T00:00:00')
  dueDate.setDate(dueDate.getDate() + p.reminderDays)
  const dueDateStr = dueDate.toLocaleDateString(language, {
    month: 'short',
    day: 'numeric',
    year: dueDate.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined,
  })

  return (
    <div className="relative rounded-[14px] border bg-card p-3.5 flex flex-col gap-2.5 active:scale-[0.98] transition-transform duration-75">
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
      {(p.location || p.honoraryType) && (
        <p className="font-mono-rc text-[11.5px] text-ink-soft">
          {[p.location, p.honoraryType].filter(Boolean).join(' · ')}
        </p>
      )}
      <div className="flex items-center justify-between pt-2.5 border-t border-dashed">
        <p className="font-mono-rc text-[11.5px] text-ink-soft truncate">
          {p.payer} · {t('reminderOn')} {dueDateStr}
        </p>
        {showStatus && (
          <div className="relative shrink-0">
            <StatusPicker
              current={p.status}
              onChange={(status) => onChangeStatus(p.id, status)}
            />
          </div>
        )}
      </div>
    </div>
  )
}
