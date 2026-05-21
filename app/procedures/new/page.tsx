'use client'

import { useRouter } from 'next/navigation'
import { ProcedureForm } from '@/components/organisms/procedure-form'
import { useTranslation } from '@/components/organisms/language-provider'

export default function NewProcedurePage() {
  const router = useRouter()
  const { t } = useTranslation()
  return (
    <main className="container mx-auto px-4 py-6 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">{t('addProcedureTitle')}</h1>
      <ProcedureForm onSuccess={() => router.push('/')} />
    </main>
  )
}
