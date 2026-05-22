import { getDB } from './db'
import type { Procedure } from './types'

function localDateStr(d: Date): string {
  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, '0'),
    String(d.getDate()).padStart(2, '0'),
  ].join('-')
}

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
    if (p.status === 'paid') return false
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
  const todayStr = localDateStr(today)
  const weekEnd = new Date(today)
  weekEnd.setDate(weekEnd.getDate() + 7)
  const weekEndStr = localDateStr(weekEnd)

  const result: DueGroups = { overdue: [], dueToday: [], thisWeek: [], upcoming: [] }

  for (const p of procedures) {
    if (p.status === 'paid') continue
    const dueDate = new Date(p.date.slice(0, 10) + 'T00:00:00')
    dueDate.setDate(dueDate.getDate() + p.reminderDays)
    const dueDateStr = localDateStr(dueDate)

    if (dueDateStr < todayStr) result.overdue.push(p)
    else if (dueDateStr === todayStr) result.dueToday.push(p)
    else if (dueDateStr <= weekEndStr) result.thisWeek.push(p)
    else result.upcoming.push(p)
  }

  return result
}

export type SummaryGroups = {
  fullDenial: Procedure[]
  partialDenial: Procedure[]
  overdue: Procedure[]
  paid: Procedure[]
}

export async function getSummaryGroups(): Promise<SummaryGroups> {
  const procedures = await getAllProcedures()
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayStr = localDateStr(today)

  const result: SummaryGroups = { fullDenial: [], partialDenial: [], overdue: [], paid: [] }

  for (const p of procedures) {
    if (p.status === 'full_denial') {
      result.fullDenial.push(p)
    } else if (p.status === 'partial_denial') {
      result.partialDenial.push(p)
    } else if (p.status === 'paid') {
      result.paid.push(p)
    } else if (p.status === 'pending') {
      const dueDate = new Date(p.date.slice(0, 10) + 'T00:00:00')
      dueDate.setDate(dueDate.getDate() + p.reminderDays)
      if (localDateStr(dueDate) < todayStr) result.overdue.push(p)
    }
  }

  result.paid.sort((a, b) => b.date.localeCompare(a.date))
  return result
}

