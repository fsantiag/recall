'use client'

import Link from 'next/link'
import { CheckCircle2, RotateCcw } from 'lucide-react'
import type { Procedure } from '@/lib/types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useTranslation } from '@/components/organisms/language-provider'

interface ProcedureCardProps {
  procedure: Procedure
  onToggleStatus: (id: string) => void
}

export function ProcedureCard({ procedure: p, onToggleStatus }: ProcedureCardProps) {
  const { t } = useTranslation()
  return (
    <Card className="relative">
      <Link href={`/procedures/${p.id}`} className="absolute inset-0" aria-label={p.name} />
      <CardContent className="pt-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{p.name}</p>
            <p className="text-sm text-muted-foreground">{p.patientName}</p>
            <p className="text-sm text-muted-foreground">
              {p.payer} · {new Date(p.date).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
            </p>
          </div>
          <div className="relative flex items-center gap-2 shrink-0">
            <Badge variant={p.status === 'paid' ? 'secondary' : 'destructive'}>
              {p.status === 'paid' ? t('statusPaid') : t('statusPending')}
            </Badge>
            <Button
              size="icon"
              variant="ghost"
              onClick={(e) => { e.preventDefault(); onToggleStatus(p.id) }}
              aria-label={p.status === 'pending' ? t('markPaid') : t('markPending')}
            >
              {p.status === 'pending'
                ? <CheckCircle2 className="h-4 w-4" />
                : <RotateCcw className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
