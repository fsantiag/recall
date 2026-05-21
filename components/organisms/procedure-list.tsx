'use client'

import { useEffect, useState } from 'react'
import { getAllProcedures, updateProcedure } from '@/lib/procedures'
import type { Procedure } from '@/lib/types'
import { ProcedureCard } from '@/components/molecules/procedure-card'

export function ProcedureList() {
  const [procedures, setProcedures] = useState<Procedure[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAllProcedures()
      .then((data) => setProcedures(data.sort((a, b) => b.date.localeCompare(a.date))))
      .finally(() => setLoading(false))
  }, [])

  async function markAsPaid(id: string) {
    await updateProcedure(id, { status: 'paid' })
    setProcedures((prev) => prev.map((p) => (p.id === id ? { ...p, status: 'paid' } : p)))
  }

  if (loading) return <p className="text-muted-foreground text-sm">Loading...</p>

  if (procedures.length === 0)
    return (
      <p className="text-muted-foreground text-sm text-center py-8">
        No procedures yet. Tap + to add one.
      </p>
    )

  return (
    <ul className="space-y-3">
      {procedures.map((p) => (
        <li key={p.id}>
          <ProcedureCard procedure={p} onMarkPaid={markAsPaid} />
        </li>
      ))}
    </ul>
  )
}
