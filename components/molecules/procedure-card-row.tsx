'use client'
import { useState } from 'react'
import { StickyNote } from 'lucide-react'
import { ProcedureCard } from '@/components/molecules/procedure-card'
import { NotesPanel } from '@/components/molecules/notes-panel'
import type { Note, Procedure, ClaimStatus } from '@/lib/types'
import { useTranslation } from '@/components/organisms/language-provider'

interface ProcedureCardRowProps {
  procedure: Procedure
  onChangeStatus: (id: string, status: ClaimStatus) => void
  dueTone?: 'danger' | 'brand' | 'sage' | 'neutral'
  dueLabel?: string
  showStatus?: boolean
}

export function ProcedureCardRow({
  procedure,
  onChangeStatus,
  dueTone,
  dueLabel,
  showStatus,
}: ProcedureCardRowProps) {
  const { t } = useTranslation()
  const [notes, setNotes] = useState<Note[]>(procedure.notes ?? [])
  const [panelOpen, setPanelOpen] = useState(false)

  const hasNotes = notes.length > 0

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 min-w-0">
        <ProcedureCard
          procedure={{ ...procedure, notes }}
          onChangeStatus={onChangeStatus}
          dueTone={dueTone}
          dueLabel={dueLabel}
          showStatus={showStatus}
        />
      </div>

      <button
        onClick={() => setPanelOpen(true)}
        aria-label={t('notesTitle')}
        className={`relative shrink-0 flex items-center justify-center w-9 h-9 rounded-full transition-colors active:scale-95
          ${hasNotes
            ? 'bg-brand-50 text-brand'
            : 'bg-surface-alt text-ink-muted hover:text-foreground'}`}
      >
        <StickyNote className="h-4 w-4" />
        {hasNotes && (
          <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[16px] h-4 px-0.5 rounded-full bg-primary text-primary-foreground text-[9px] font-bold leading-none">
            {notes.length > 9 ? '9+' : notes.length}
          </span>
        )}
      </button>

      <NotesPanel
        open={panelOpen}
        onOpenChange={setPanelOpen}
        procedureId={procedure.id}
        patientName={procedure.patientName}
        notes={notes}
        onNotesChange={setNotes}
      />
    </div>
  )
}
