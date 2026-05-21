import { renderHook, waitFor } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import { useFieldSuggestions, invalidateSuggestionsCache } from './use-field-suggestions'
import { addProcedure } from './procedures'
import { resetDB } from './db'

const BASE = { date: '2026-01-01T09:00', reminderDays: 7, status: 'pending' as const }

describe('useFieldSuggestions', () => {
  beforeEach(() => { resetDB(); invalidateSuggestionsCache() })

  it('returns empty arrays when no procedures exist', async () => {
    const { result } = renderHook(() => useFieldSuggestions())
    await waitFor(() => {
      expect(result.current.patientNames).toEqual([])
      expect(result.current.procedureNames).toEqual([])
      expect(result.current.payers).toEqual([])
    })
  })

  it('returns deduplicated sorted patientNames', async () => {
    await addProcedure({ ...BASE, name: 'Consultation', patientName: 'Zara', payer: 'Unimed' })
    await addProcedure({ ...BASE, name: 'X-Ray',        patientName: 'Ana',  payer: 'Unimed' })
    await addProcedure({ ...BASE, name: 'Consultation', patientName: 'Zara', payer: 'Bradesco' })

    const { result } = renderHook(() => useFieldSuggestions())
    await waitFor(() => {
      expect(result.current.patientNames).toEqual(['Ana', 'Zara'])
    })
  })

  it('returns deduplicated sorted procedureNames', async () => {
    await addProcedure({ ...BASE, name: 'X-Ray',        patientName: 'Ana', payer: 'Unimed' })
    await addProcedure({ ...BASE, name: 'Consultation', patientName: 'Ana', payer: 'Unimed' })
    await addProcedure({ ...BASE, name: 'X-Ray',        patientName: 'Ana', payer: 'Unimed' })

    const { result } = renderHook(() => useFieldSuggestions())
    await waitFor(() => {
      expect(result.current.procedureNames).toEqual(['Consultation', 'X-Ray'])
    })
  })

  it('returns deduplicated sorted payers', async () => {
    await addProcedure({ ...BASE, name: 'Consultation', patientName: 'Ana', payer: 'Unimed'   })
    await addProcedure({ ...BASE, name: 'Consultation', patientName: 'Ana', payer: 'Bradesco' })
    await addProcedure({ ...BASE, name: 'Consultation', patientName: 'Ana', payer: 'Unimed'   })

    const { result } = renderHook(() => useFieldSuggestions())
    await waitFor(() => {
      expect(result.current.payers).toEqual(['Bradesco', 'Unimed'])
    })
  })
})
