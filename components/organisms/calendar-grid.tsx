'use client'
import { useEffect, useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { getAllProcedures, updateProcedure } from '@/lib/procedures'
import type { Procedure } from '@/lib/types'
import { ProcedureCard } from '@/components/molecules/procedure-card'

function getDueDateStr(p: Procedure): string {
  const d = new Date(p.date.slice(0, 10) + 'T00:00:00')
  d.setDate(d.getDate() + p.reminderDays)
  return d.toISOString().split('T')[0]
}

export function CalendarGrid() {
  const [procedures, setProcedures] = useState<Procedure[]>([])
  const [selectedDay, setSelectedDay] = useState<string | null>(null)
  const today = useMemo(() => new Date(), [])
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())

  useEffect(() => {
    getAllProcedures().then(setProcedures).catch(() => {})
  }, [])

  const dueMap = useMemo(() => {
    const map: Record<string, number> = {}
    for (const p of procedures) {
      if (p.status === 'paid') continue
      const key = getDueDateStr(p)
      map[key] = (map[key] ?? 0) + 1
    }
    return map
  }, [procedures])

  const firstDay = new Date(viewYear, viewMonth, 1)
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
  const startOffset = firstDay.getDay()
  const monthLabel = firstDay.toLocaleDateString('en', { month: 'long', year: 'numeric' })
  const todayStr = today.toISOString().split('T')[0]

  function prevMonth() {
    const d = new Date(viewYear, viewMonth - 1)
    setViewYear(d.getFullYear())
    setViewMonth(d.getMonth())
    setSelectedDay(null)
  }

  function nextMonth() {
    const d = new Date(viewYear, viewMonth + 1)
    setViewYear(d.getFullYear())
    setViewMonth(d.getMonth())
    setSelectedDay(null)
  }

  async function toggle(id: string) {
    const p = procedures.find((x) => x.id === id)
    if (!p) return
    await updateProcedure(id, { status: p.status === 'pending' ? 'paid' : 'pending' })
    getAllProcedures().then(setProcedures)
  }

  const selectedProcedures = selectedDay
    ? procedures.filter((p) => getDueDateStr(p) === selectedDay && p.status !== 'paid')
    : []

  return (
    <div>
      <div className="flex items-center justify-between px-5 py-3">
        <button
          onClick={prevMonth}
          className="w-9 h-9 flex items-center justify-center rounded-full border"
          aria-label="Previous month"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="font-semibold text-[16px] tracking-tight">{monthLabel}</span>
        <button
          onClick={nextMonth}
          className="w-9 h-9 flex items-center justify-center rounded-full border"
          aria-label="Next month"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="grid grid-cols-7 px-3 mb-1">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
          <div key={i} className="text-center text-[11px] font-medium text-ink-soft py-1">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 px-3">
        {Array.from({ length: startOffset }).map((_, i) => <div key={`e${i}`} />)}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const dayNum = i + 1
          const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`
          const count = dueMap[dateStr] ?? 0
          const isToday = dateStr === todayStr
          const isSelected = selectedDay === dateStr

          return (
            <button
              key={dateStr}
              onClick={() => setSelectedDay(isSelected ? null : dateStr)}
              className={`aspect-square flex flex-col items-center justify-center rounded-[10px]
                text-[14px] font-medium relative transition-colors
                ${isToday ? 'bg-primary text-primary-foreground' : ''}
                ${isSelected && !isToday ? 'bg-accent text-accent-foreground' : ''}
                ${!isToday && !isSelected ? 'hover:bg-surface-alt' : ''}`}
            >
              {dayNum}
              {count > 0 && (
                <span
                  className={`absolute bottom-1 w-1.5 h-1.5 rounded-full
                    ${isToday ? 'bg-primary-foreground' : 'bg-primary'}`}
                />
              )}
            </button>
          )
        })}
      </div>

      {selectedDay && selectedProcedures.length > 0 && (
        <div className="mt-4 px-5 space-y-2 pb-4">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-ink-soft pt-2">
            {new Date(selectedDay + 'T00:00:00').toLocaleDateString('en', {
              weekday: 'long', month: 'long', day: 'numeric',
            })}
          </p>
          {selectedProcedures.map((p) => (
            <ProcedureCard key={p.id} procedure={p} onToggleStatus={toggle} />
          ))}
        </div>
      )}

      {selectedDay && selectedProcedures.length === 0 && (
        <p className="text-[13px] text-ink-soft text-center mt-6 px-5">No reminders due on this day.</p>
      )}
    </div>
  )
}
