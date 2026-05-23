'use client'
import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { addNote, deleteNote } from '@/lib/procedures'
import type { Note } from '@/lib/types'
import { useTranslation } from '@/components/organisms/language-provider'
import { toast } from 'sonner'

interface NotesPanelProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  procedureId: string
  patientName: string
  notes: Note[]
  onNotesChange: (notes: Note[]) => void
}

export function NotesPanel({
  open,
  onOpenChange,
  procedureId,
  patientName,
  notes,
  onNotesChange,
}: NotesPanelProps) {
  const { t, language } = useTranslation()
  const [text, setText] = useState('')
  const [saving, setSaving] = useState(false)

  const sorted = [...notes].sort((a, b) => b.createdAt.localeCompare(a.createdAt))

  function formatDate(iso: string) {
    return new Date(iso).toLocaleString(language, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  async function handleAdd() {
    if (!text.trim()) return
    setSaving(true)
    try {
      const note = await addNote(procedureId, text)
      onNotesChange([...notes, note])
      setText('')
      toast.success(t('toastNoteAdded'))
    } catch {
      toast.error(t('saveFailed'))
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(noteId: string) {
    if (!confirm(t('notesDeleteConfirm'))) return
    try {
      await deleteNote(procedureId, noteId)
      onNotesChange(notes.filter(n => n.id !== noteId))
      toast.success(t('toastNoteDeleted'))
    } catch {
      toast.error(t('saveFailed'))
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        showCloseButton
        className="max-h-[72vh] rounded-t-[20px] gap-0 p-0 flex flex-col"
      >
        <div className="flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-8 h-1 rounded-full bg-border" />
        </div>

        <SheetHeader className="px-5 pt-1 pb-3 shrink-0">
          <SheetTitle>
            {t('notesTitle')} — {patientName}
          </SheetTitle>
        </SheetHeader>

        <div className="px-5 pb-4 border-b shrink-0">
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder={t('notesAddPlaceholder')}
            rows={3}
            className="w-full rounded-[12px] border bg-surface-alt px-3 py-2.5 text-[14px] text-foreground placeholder:text-ink-muted resize-none focus:outline-none focus:ring-2 focus:ring-ring/50 transition-shadow"
          />
          <Button
            className="w-full mt-2"
            onClick={handleAdd}
            disabled={!text.trim() || saving}
          >
            {saving ? t('saving') : t('notesAdd')}
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-3 space-y-2.5 pb-6">
          {sorted.length === 0 ? (
            <p className="text-center text-ink-muted text-[14px] py-6">{t('notesEmpty')}</p>
          ) : (
            sorted.map(note => (
              <div key={note.id} className="rounded-[12px] border bg-card p-3 flex gap-2.5">
                <div className="flex-1 min-w-0">
                  <p className="font-mono-rc text-[11px] text-ink-muted mb-1">{formatDate(note.createdAt)}</p>
                  <p className="text-[14px] text-foreground leading-snug whitespace-pre-wrap">{note.text}</p>
                </div>
                <button
                  onClick={() => handleDelete(note.id)}
                  className="shrink-0 mt-0.5 p-1 text-ink-muted hover:text-destructive transition-colors"
                  aria-label="Delete note"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
