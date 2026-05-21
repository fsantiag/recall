'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { getProcedure, deleteProcedure } from '@/lib/procedures'
import type { Procedure } from '@/lib/types'
import { ProcedureForm } from '@/components/organisms/procedure-form'
import { useTranslation } from '@/components/organisms/language-provider'
import { toast } from 'sonner'
import { procedureCache } from '@/lib/procedure-cache'

export default function EditProcedurePage() {
  const params = useParams()
  const router = useRouter()
  const { t, language } = useTranslation()
  const id = params.id as string
  const [procedure, setProcedure] = useState<Procedure | null>(
    () => procedureCache.get(id) ?? null
  )

  useEffect(() => {
    getProcedure(id)
      .then((p) => {
        if (!p) router.push('/')
        else setProcedure(p)
      })
      .catch(() => router.push('/'))
  }, [id, router])

  async function handleDelete() {
    if (!procedure || !confirm(t('deleteConfirm'))) return
    try {
      await deleteProcedure(procedure.id)
      toast.success(t('toastProcedureDeleted'))
      router.push('/')
    } catch {
      toast.error(t('deleteFailed'))
    }
  }

  if (!procedure) return null

  const dueDate = new Date(procedure.date.slice(0, 10) + 'T00:00:00')
  dueDate.setDate(dueDate.getDate() + procedure.reminderDays)
  const dueDateStr = dueDate.toLocaleDateString(language, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <main className="container mx-auto px-4 py-6 max-w-2xl">
      <h1 className="text-2xl font-bold mb-1">{t('editProcedureTitle')}</h1>
      <p className="text-[13px] text-ink-muted mb-6">
        {t('reminderDateLabel')}: <span className="font-mono-rc font-medium text-foreground">{dueDateStr}</span>
      </p>
      <ProcedureForm
        procedureId={procedure.id}
        defaultValues={{
          name: procedure.name,
          patientName: procedure.patientName,
          payer: procedure.payer,
          date: procedure.date,
          reminderDays: procedure.reminderDays,
        }}
        onSuccess={() => router.push('/')}
        onDelete={handleDelete}
      />
    </main>
  )
}
