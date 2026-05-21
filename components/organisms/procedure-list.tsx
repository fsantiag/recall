'use client'

import { useEffect, useState } from 'react'
import { getAllProcedures, updateProcedure } from '@/lib/procedures'
import type { Procedure } from '@/lib/types'
import { ProcedureCard } from '@/components/molecules/procedure-card'

export function ProcedureList() {
  const [procedures, setProcedures] = useState<Procedure[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getAllProcedures()
      .then((data) => setProcedures(data.sort((a, b) => b.date.localeCompare(a.date))))
      .catch(() => setError('Could not load procedures.'))
      .finally(() => setLoading(false))
  }, [])

  async function markAsPaid(id: string) {
    try {
      await updateProcedure(id, { status: 'paid' })
      setProcedures((prev) => prev.map((p) => (p.id === id ? { ...p, status: 'paid' } : p)))
    } catch (err) {
      console.error('Failed to mark procedure as paid:', err)
    }
  }

  if (error) return <p className="text-destructive text-sm">{error}</p>

  if (loading) return <p className="text-muted-foreground text-sm">Loading...</p>

  if (procedures.length === 0)
    return (
      <p className="text-muted-foreground text-sm text-center py-8">
        No procedures yet. Press + to add one.
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
