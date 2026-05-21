'use client'

import { useState, useEffect } from 'react'
import { getAllProcedures } from './procedures'

export function useFieldSuggestions() {
  const [patientNames, setPatientNames] = useState<string[]>([])
  const [procedureNames, setProcedureNames] = useState<string[]>([])
  const [payers, setPayers] = useState<string[]>([])

  useEffect(() => {
    getAllProcedures().then((procedures) => {
      setPatientNames([...new Set(procedures.map(p => p.patientName))].sort())
      setProcedureNames([...new Set(procedures.map(p => p.name))].sort())
      setPayers([...new Set(procedures.map(p => p.payer))].sort())
    })
  }, [])

  return { patientNames, procedureNames, payers }
}
