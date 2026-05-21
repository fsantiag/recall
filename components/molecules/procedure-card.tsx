'use client'

import Link from 'next/link'
import { CheckCircle2 } from 'lucide-react'
import type { Procedure } from '@/lib/types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

interface ProcedureCardProps {
  procedure: Procedure
  onMarkPaid: (id: string) => void
}

export function ProcedureCard({ procedure: p, onMarkPaid }: ProcedureCardProps) {
  return (
    <Card>
      <CardContent className="pt-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <Link
              href={`/procedures/${p.id}`}
              className="font-medium hover:underline truncate block"
            >
              {p.name}
            </Link>
            <p className="text-sm text-muted-foreground">{p.patientName}</p>
            <p className="text-sm text-muted-foreground">
              {p.payer} · {new Date(p.date + 'T00:00:00').toLocaleDateString()}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Badge variant={p.status === 'paid' ? 'secondary' : 'destructive'}>
              {p.status === 'paid' ? 'Paid' : 'Pending'}
            </Badge>
            {p.status === 'pending' && (
              <Button
                size="icon"
                variant="ghost"
                onClick={() => onMarkPaid(p.id)}
                aria-label="Mark as paid"
              >
                <CheckCircle2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
