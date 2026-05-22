'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Search, X } from 'lucide-react'
import { getAllProcedures, updateProcedure } from '@/lib/procedures'
import type { Procedure } from '@/lib/types'
import { ProcedureCard } from '@/components/molecules/procedure-card'
import { useTranslation } from '@/components/organisms/language-provider'
import { toast } from 'sonner'

function normalize(s: string) {
  return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
}

function matchesProcedure(p: Procedure, query: string, language: string): boolean {
  const q = normalize(query)
  const fmt = (d: Date) => d.toLocaleDateString(language, { day: 'numeric', month: 'long', year: 'numeric' })
  const procedureDate = new Date(p.date)
  const dueDate = new Date(p.date.slice(0, 10) + 'T00:00:00')
  dueDate.setDate(dueDate.getDate() + p.reminderDays)
  return [
    p.name, p.patientName, p.payer, p.status, p.date,
    p.location, p.honoraryType,
    fmt(procedureDate), fmt(dueDate),
  ].some((field) => normalize(field ?? '').includes(q))
}

export function ProcedureList() {
  const { t, language } = useTranslation()
  const [procedures, setProcedures] = useState<Procedure[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [inputValue, setInputValue] = useState('')
  const [query, setQuery] = useState('')
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    getAllProcedures()
      .then((data) => setProcedures(data.sort((a, b) => b.date.localeCompare(a.date))))
      .catch(() => setError(t('loadError')))
      .finally(() => setLoading(false))
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  function handleSearchChange(value: string) {
    setInputValue(value)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => setQuery(value), 200)
  }

  function clearSearch() {
    setInputValue('')
    setQuery('')
  }

  async function toggleStatus(id: string) {
    const procedure = procedures.find((p) => p.id === id)
    if (!procedure) return
    const newStatus = procedure.status === 'pending' ? 'paid' : 'pending'
    try {
      await updateProcedure(id, { status: newStatus })
      setProcedures((prev) => prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p)))
      toast.success(t(newStatus === 'paid' ? 'toastMarkedPaid' : 'toastMarkedPending'), { duration: 2000 })
    } catch {
      toast.error(t('saveFailed'))
    }
  }

  const filtered = useMemo(
    () => (query.trim() ? procedures.filter((p) => matchesProcedure(p, query, language)) : procedures),
    [procedures, query, language]
  )

  if (error) return <p className="text-destructive text-sm">{error}</p>
  if (loading) return <p className="text-muted-foreground text-sm">{t('loading')}</p>

  return (
    <div>
      <div className="relative mb-5">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-soft pointer-events-none" />
        <input
          type="search"
          value={inputValue}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder={t('searchPlaceholder')}
          className="w-full rounded-xl border border-input bg-card pl-9 pr-9 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 focus:border-ring transition-colors"
        />
        {inputValue && (
          <button
            onClick={clearSearch}
            aria-label="Clear search"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-soft hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {procedures.length === 0 ? (
        <p className="text-muted-foreground text-sm text-center py-8">{t('empty')}</p>
      ) : filtered.length === 0 ? (
        <p className="text-muted-foreground text-sm text-center py-8">
          {t('searchNoResults').replace('{query}', query)}
        </p>
      ) : (
        <ul className="space-y-3">
          {filtered.map((p) => (
            <li key={p.id}>
              <ProcedureCard procedure={p} onToggleStatus={toggleStatus} />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
