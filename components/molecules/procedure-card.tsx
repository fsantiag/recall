'use client'
import { useState } from 'react'
import Link from 'next/link'
import { StickyNote } from 'lucide-react'
import type { Procedure, ClaimStatus, Note } from '@/lib/types'
import { useTranslation } from '@/components/organisms/language-provider'
import { procedureCache } from '@/lib/procedure-cache'
import { StatusPicker } from '@/components/molecules/status-picker'
import { NotesPanel } from '@/components/molecules/notes-panel'

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
  const [notes, setNotes] = useState<Note[]>(p.notes ?? [])
  const [panelOpen, setPanelOpen] = useState(false)

  const dueDate = new Date(p.date.slice(0, 10) + 'T00:00:00')
  dueDate.setDate(dueDate.getDate() + p.reminderDays)
  const dueDateStr = dueDate.toLocaleDateString(language, {
    month: 'short',
    day: 'numeric',
    year: dueDate.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined,
  })

  const hasNotes = notes.length > 0

  return (
    <>
      <div className="relative rounded-[14px] border bg-card p-3.5 flex flex-col gap-2.5 active:scale-[0.98] transition-transform duration-75">
        <Link href={`/procedures/${p.id}`} className="absolute inset-0 rounded-[14px]" aria-label={p.name} onClick={() => procedureCache.set({ ...p, notes })} />

        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-[16px] tracking-tight leading-tight truncate">{p.name}</p>
            <p className="text-ink-muted text-[13px] mt-0.5">{p.patientName}</p>
          </div>
          <div className="relative shrink-0 flex items-center gap-1.5">
            <button
              onClick={() => setPanelOpen(true)}
              aria-label={t('notesTitle')}
              className={`relative flex items-center justify-center w-7 h-7 rounded-full transition-colors active:scale-95
                ${hasNotes
                  ? 'bg-brand-50 text-brand'
                  : 'bg-surface-alt text-ink-muted hover:text-foreground'}`}
            >
              <StickyNote className="h-3.5 w-3.5" />
              {hasNotes && (
                <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[14px] h-3.5 px-0.5 rounded-full bg-primary text-primary-foreground text-[8px] font-bold leading-none">
                  {notes.length > 9 ? '9+' : notes.length}
                </span>
              )}
            </button>
            {dueLabel && (
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${TONE_CLASSES[dueTone]}`}>
                {dueLabel}
              </span>
            )}
          </div>
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

      <NotesPanel
        open={panelOpen}
        onOpenChange={setPanelOpen}
        procedureId={p.id}
        patientName={p.patientName}
        notes={notes}
        onNotesChange={setNotes}
      />
    </>
  )
}
