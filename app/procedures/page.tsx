'use client'

import { ProcedureList } from '@/components/organisms/procedure-list'
import { useTranslation } from '@/components/organisms/language-provider'

export default function AllProceduresPage() {
  const { t } = useTranslation()
  return (
    <main className="container mx-auto px-4 pt-[max(3.5rem,env(safe-area-inset-top))] pb-6 max-w-2xl">
      <h1 className="text-[28px] font-semibold tracking-tight mb-6">{t('allProceduresTitle')}</h1>
      <ProcedureList />
    </main>
  )
}
