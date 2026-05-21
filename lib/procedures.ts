import { getDB } from './db'
import type { Procedure } from './types'

export async function getAllProcedures(): Promise<Procedure[]> {
  const db = await getDB()
  return db.getAll('procedures')
}

export async function getProcedure(id: string): Promise<Procedure | undefined> {
  const db = await getDB()
  return db.get('procedures', id)
}

export async function addProcedure(
  data: Omit<Procedure, 'id' | 'createdAt'>
): Promise<Procedure> {
  const db = await getDB()
  const procedure: Procedure = {
    ...data,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  }
  await db.add('procedures', procedure)
  return procedure
}

export async function updateProcedure(
  id: string,
  updates: Partial<Omit<Procedure, 'id' | 'createdAt'>>
): Promise<Procedure> {
  const db = await getDB()
  const existing = await db.get('procedures', id)
  if (!existing) throw new Error(`Procedure ${id} not found`)
  const updated: Procedure = { ...existing, ...updates }
  await db.put('procedures', updated)
  return updated
}

export async function deleteProcedure(id: string): Promise<void> {
  const db = await getDB()
  await db.delete('procedures', id)
}

export async function getOverdueProcedures(): Promise<Procedure[]> {
  const procedures = await getAllProcedures()
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return procedures.filter((p) => {
    if (p.status !== 'pending') return false
    const procedureDate = new Date(p.date.slice(0, 10) + 'T00:00:00')
    const dueDate = new Date(procedureDate)
    dueDate.setDate(dueDate.getDate() + p.reminderDays)
    return dueDate <= today
  })
}
