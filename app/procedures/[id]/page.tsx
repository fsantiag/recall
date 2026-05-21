'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { getProcedure, deleteProcedure } from '@/lib/procedures'
import type { Procedure } from '@/lib/types'
import { ProcedureForm } from '@/components/organisms/procedure-form'
import { Button } from '@/components/ui/button'

export default function EditProcedurePage() {
  const params = useParams()
  const router = useRouter()
  const [procedure, setProcedure] = useState<Procedure | null>(null)

  useEffect(() => {
    getProcedure(params.id as string)
      .then((p) => {
        if (!p) router.push('/')
        else setProcedure(p)
      })
      .catch(() => router.push('/'))
  }, [params.id, router])

  async function handleDelete() {
    if (!procedure || !confirm('Delete this procedure?')) return
    try {
      await deleteProcedure(procedure.id)
      router.push('/')
    } catch {
      alert('Failed to delete. Please try again.')
    }
  }

  if (!procedure) return null

  return (
    <main className="container mx-auto px-4 py-6 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Edit Procedure</h1>
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
      />
      <Button variant="destructive" className="w-full mt-4" onClick={handleDelete}>
        Delete Procedure
      </Button>
    </main>
  )
}
