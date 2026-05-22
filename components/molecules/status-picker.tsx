'use client'
import { useState } from 'react'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import type { ClaimStatus } from '@/lib/types'
import { useTranslation } from '@/components/organisms/language-provider'
import type { TranslationKey } from '@/lib/i18n'
import { haptic } from '@/lib/haptics'

const STATUSES: ClaimStatus[] = ['pending', 'partial_denial', 'full_denial', 'paid']

export const STATUS_BADGE_CLASSES: Record<ClaimStatus, string> = {
  pending:        'bg-surface-alt text-ink-muted',
  partial_denial: 'bg-orange-100 text-orange-700',
  full_denial:    'bg-danger-soft text-danger',
  paid:           'bg-sage-soft text-sage-deep',
}

export const STATUS_LABEL_KEYS: Record<ClaimStatus, TranslationKey> = {
  pending:        'statusPending',
  partial_denial: 'statusPartialDenial',
  full_denial:    'statusFullDenial',
  paid:           'statusPaid',
}

interface StatusPickerProps {
  current: ClaimStatus
  onChange: (status: ClaimStatus) => void
}

export function StatusPicker({ current, onChange }: StatusPickerProps) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); haptic('light'); setOpen(true) }}
        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${STATUS_BADGE_CLASSES[current]}`}
        aria-label={t('changeStatus')}
      >
        {t(STATUS_LABEL_KEYS[current])}
      </button>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="bottom">
          <SheetHeader>
            <SheetTitle>{t('changeStatus')}</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col gap-2 pt-4 pb-8">
            {STATUSES.map((s) => (
              <button
                key={s}
                onClick={() => { haptic('medium'); onChange(s); setOpen(false) }}
                className={`flex items-center w-full rounded-[12px] px-4 py-3 text-left text-[15px] font-medium transition-opacity ${STATUS_BADGE_CLASSES[s]} ${s === current ? 'ring-2 ring-current/40' : 'opacity-80 hover:opacity-100'}`}
              >
                {t(STATUS_LABEL_KEYS[s])}
              </button>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
