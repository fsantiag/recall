'use client'

import { useEffect, useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { getOverdueProcedures } from '@/lib/procedures'
import type { Procedure } from '@/lib/types'

export function PendingAlert() {
  const [overdue, setOverdue] = useState<Procedure[]>([])

  useEffect(() => {
    getOverdueProcedures().then(setOverdue).catch(() => {})
  }, [])

  if (overdue.length === 0) return null

  return (
    <Alert variant="destructive" className="mb-4">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Payment Reminder</AlertTitle>
      <AlertDescription>
        {overdue.length === 1
          ? '1 procedure is past its claim deadline.'
          : `${overdue.length} procedures are past their claim deadline.`}
      </AlertDescription>
    </Alert>
  )
}
