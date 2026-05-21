'use client'

import { useRouter } from 'next/navigation'
import { ProcedureForm } from '@/components/organisms/procedure-form'

export default function NewProcedurePage() {
  const router = useRouter()
  return (
    <main className="container mx-auto px-4 py-6 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Add Procedure</h1>
      <ProcedureForm onSuccess={() => router.push('/')} />
    </main>
  )
}
