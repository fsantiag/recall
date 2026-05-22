import { describe, it, expect, beforeEach } from 'vitest'
import { resetDB } from '@/lib/db'
import {
  addProcedure,
  getAllProcedures,
  getProcedure,
  updateProcedure,
  deleteProcedure,
  getOverdueProcedures,
  getDueProceduresGrouped,
} from '@/lib/procedures'

const BASE = {
  name: 'Consultation',
  patientName: 'John Doe',
  payer: 'Unimed',
  location: 'Hospital A',
  honoraryType: 'Cirurgião',
  status: 'pending' as const,
  reminderDays: 30,
}

describe('procedure CRUD', () => {
  beforeEach(() => {
    resetDB()
  })

  it('adds a procedure and retrieves it', async () => {
    const p = await addProcedure({ ...BASE, date: '2026-01-01' })
    expect(p.id).toBeDefined()
    expect(p.createdAt).toBeDefined()
    expect(p.name).toBe('Consultation')
    expect(await getProcedure(p.id)).toEqual(p)
  })

  it('getAllProcedures returns all added procedures', async () => {
    await addProcedure({ ...BASE, date: '2026-01-01' })
    await addProcedure({ ...BASE, date: '2026-02-01', name: 'Surgery' })
    expect(await getAllProcedures()).toHaveLength(2)
  })

  it('updateProcedure changes status to paid', async () => {
    const p = await addProcedure({ ...BASE, date: '2026-01-01' })
    const updated = await updateProcedure(p.id, { status: 'paid' })
    expect(updated.status).toBe('paid')
    expect(updated.id).toBe(p.id)
  })

  it('deleteProcedure removes it', async () => {
    const p = await addProcedure({ ...BASE, date: '2026-01-01' })
    await deleteProcedure(p.id)
    expect(await getProcedure(p.id)).toBeUndefined()
  })

  it('updateProcedure throws if id not found', async () => {
    await expect(updateProcedure('nonexistent', { status: 'paid' })).rejects.toThrow(
      'Procedure nonexistent not found'
    )
  })
})

describe('getOverdueProcedures', () => {
  beforeEach(() => {
    resetDB()
  })

  it('returns pending procedures past their reminder threshold', async () => {
    const past = new Date()
    past.setDate(past.getDate() - 10)
    await addProcedure({
      ...BASE,
      date: past.toISOString().split('T')[0],
      reminderDays: 1,
    })
    expect(await getOverdueProcedures()).toHaveLength(1)
  })

  it('does not return paid procedures', async () => {
    const past = new Date()
    past.setDate(past.getDate() - 10)
    const p = await addProcedure({
      ...BASE,
      date: past.toISOString().split('T')[0],
      reminderDays: 1,
    })
    await updateProcedure(p.id, { status: 'paid' })
    expect(await getOverdueProcedures()).toHaveLength(0)
  })

  it('does not return pending procedures not yet past threshold', async () => {
    const today = new Date().toISOString().split('T')[0]
    await addProcedure({ ...BASE, date: today, reminderDays: 30 })
    expect(await getOverdueProcedures()).toHaveLength(0)
  })

  it('returns partially_paid procedures past their reminder threshold', async () => {
    const past = new Date()
    past.setDate(past.getDate() - 10)
    const p = await addProcedure({
      ...BASE,
      date: past.toISOString().split('T')[0],
      reminderDays: 1,
    })
    await updateProcedure(p.id, { status: 'partially_paid' })
    expect(await getOverdueProcedures()).toHaveLength(1)
  })

  it('returns full_denial procedures past their reminder threshold', async () => {
    const past = new Date()
    past.setDate(past.getDate() - 10)
    const p = await addProcedure({
      ...BASE,
      date: past.toISOString().split('T')[0],
      reminderDays: 1,
    })
    await updateProcedure(p.id, { status: 'full_denial' })
    expect(await getOverdueProcedures()).toHaveLength(1)
  })
})

describe('getDueProceduresGrouped', () => {
  beforeEach(() => { resetDB() })

  it('groups overdue procedures', async () => {
    const past = new Date()
    past.setDate(past.getDate() - 5)
    await addProcedure({ ...BASE, date: past.toISOString().slice(0, 16), reminderDays: 1 })
    const groups = await getDueProceduresGrouped()
    expect(groups.overdue).toHaveLength(1)
    expect(groups.dueToday).toHaveLength(0)
  })

  it('groups due-today procedures', async () => {
    const now = new Date()
    const localNow = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16)
    await addProcedure({ ...BASE, date: localNow, reminderDays: 0 })
    const groups = await getDueProceduresGrouped()
    expect(groups.dueToday).toHaveLength(1)
  })

  it('excludes paid procedures', async () => {
    const past = new Date()
    past.setDate(past.getDate() - 5)
    const p = await addProcedure({ ...BASE, date: past.toISOString().slice(0, 16), reminderDays: 1 })
    await updateProcedure(p.id, { status: 'paid' })
    const groups = await getDueProceduresGrouped()
    expect(groups.overdue).toHaveLength(0)
  })

  it('includes partial_denial procedures in overdue group', async () => {
    const past = new Date()
    past.setDate(past.getDate() - 5)
    const p = await addProcedure({ ...BASE, date: past.toISOString().slice(0, 16), reminderDays: 1 })
    await updateProcedure(p.id, { status: 'partial_denial' })
    const groups = await getDueProceduresGrouped()
    expect(groups.overdue).toHaveLength(1)
  })

})
