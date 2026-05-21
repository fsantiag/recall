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
  const todayStr = today.toISOString().split('T')[0]
  return procedures.filter((p) => {
    if (p.status !== 'pending') return false
    const dueDate = new Date(p.date.slice(0, 10) + 'T00:00:00')
    dueDate.setDate(dueDate.getDate() + p.reminderDays)
    return dueDate.toISOString().split('T')[0] < todayStr
  })
}

export type DueGroups = {
  overdue: Procedure[]
  dueToday: Procedure[]
  thisWeek: Procedure[]
  upcoming: Procedure[]
}

export async function getDueProceduresGrouped(): Promise<DueGroups> {
  const procedures = await getAllProcedures()
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayStr = today.toISOString().split('T')[0]
  const weekEnd = new Date(today)
  weekEnd.setDate(weekEnd.getDate() + 7)
  const weekEndStr = weekEnd.toISOString().split('T')[0]

  const result: DueGroups = { overdue: [], dueToday: [], thisWeek: [], upcoming: [] }

  for (const p of procedures) {
    if (p.status === 'paid') continue
    if (p.status === 'snoozed') {
      if (!p.snoozedUntil || p.snoozedUntil > todayStr) continue
    }
    const dueDate = new Date(p.date.slice(0, 10) + 'T00:00:00')
    dueDate.setDate(dueDate.getDate() + p.reminderDays)
    const dueDateStr = dueDate.toISOString().split('T')[0]

    if (dueDateStr < todayStr) result.overdue.push(p)
    else if (dueDateStr === todayStr) result.dueToday.push(p)
    else if (dueDateStr <= weekEndStr) result.thisWeek.push(p)
    else result.upcoming.push(p)
  }

  return result
}

export async function snoozeProcedure(id: string, days = 3): Promise<Procedure> {
  const until = new Date()
  until.setDate(until.getDate() + days)
  return updateProcedure(id, {
    status: 'snoozed',
    snoozedUntil: until.toISOString().split('T')[0],
  })
}
