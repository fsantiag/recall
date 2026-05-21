'use client'

import { useEffect, useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { getOverdueProcedures } from '@/lib/procedures'
import type { Procedure } from '@/lib/types'
import { useTranslation } from '@/components/organisms/language-provider'

export function PendingAlert() {
  const { t } = useTranslation()
  const [overdue, setOverdue] = useState<Procedure[]>([])

  useEffect(() => {
    getOverdueProcedures().then(setOverdue).catch(() => {})
  }, [])

  if (overdue.length === 0) return null

  return (
    <Alert variant="destructive" className="mb-4">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>{t('alertTitle')}</AlertTitle>
      <AlertDescription>
        {overdue.length === 1
          ? t('alertSingular')
          : t('alertPlural', { count: overdue.length })}
      </AlertDescription>
    </Alert>
  )
}
