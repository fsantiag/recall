'use client'

import { useEffect, useState } from 'react'
import { getAllProcedures, updateProcedure } from '@/lib/procedures'
import type { Procedure } from '@/lib/types'
import { ProcedureCard } from '@/components/molecules/procedure-card'
import { useTranslation } from '@/components/organisms/language-provider'
import { toast } from 'sonner'

export function ProcedureList() {
  const { t } = useTranslation()
  const [procedures, setProcedures] = useState<Procedure[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getAllProcedures()
      .then((data) => setProcedures(data.sort((a, b) => b.date.localeCompare(a.date))))
      .catch(() => setError(t('loadError')))
      .finally(() => setLoading(false))
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  async function toggleStatus(id: string) {
    const procedure = procedures.find((p) => p.id === id)
    if (!procedure) return
    const newStatus = procedure.status === 'pending' ? 'paid' : 'pending'
    try {
      await updateProcedure(id, { status: newStatus })
      setProcedures((prev) => prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p)))
      toast.success(t(newStatus === 'paid' ? 'toastMarkedPaid' : 'toastMarkedPending'), { duration: 2000 })
    } catch {
      toast.error(t('saveFailed'))
    }
  }

  if (error) return <p className="text-destructive text-sm">{error}</p>
  if (loading) return <p className="text-muted-foreground text-sm">{t('loading')}</p>
  if (procedures.length === 0)
    return (
      <p className="text-muted-foreground text-sm text-center py-8">{t('empty')}</p>
    )

  return (
    <ul className="space-y-3">
      {procedures.map((p) => (
        <li key={p.id}>
          <ProcedureCard procedure={p} onToggleStatus={toggleStatus} />
        </li>
      ))}
    </ul>
  )
}
