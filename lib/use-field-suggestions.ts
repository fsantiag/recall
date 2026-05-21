'use client'

import { useState, useEffect } from 'react'
import { getAllProcedures } from './procedures'

type SuggestionsCache = {
  patientNames: string[]
  procedureNames: string[]
  payers: string[]
}

let cache: SuggestionsCache | null = null
let generation = 0

export function useFieldSuggestions() {
  const [patientNames, setPatientNames] = useState<string[]>([])
  const [procedureNames, setProcedureNames] = useState<string[]>([])
  const [payers, setPayers] = useState<string[]>([])

  useEffect(() => {
    const gen = generation
    if (cache) {
      setPatientNames(cache.patientNames) // eslint-disable-line react-hooks/set-state-in-effect
      setProcedureNames(cache.procedureNames)
      setPayers(cache.payers)
      return
    }
    getAllProcedures().then((procedures) => {
      if (gen !== generation) return
      const next: SuggestionsCache = {
        patientNames:   [...new Set(procedures.map(p => p.patientName))].sort(),
        procedureNames: [...new Set(procedures.map(p => p.name))].sort(),
        payers:         [...new Set(procedures.map(p => p.payer))].sort(),
      }
      cache = next
      setPatientNames(next.patientNames)
      setProcedureNames(next.procedureNames)
      setPayers(next.payers)
    })
  }, [])

  return { patientNames, procedureNames, payers }
}

export function invalidateSuggestionsCache() {
  cache = null
  generation++
}
