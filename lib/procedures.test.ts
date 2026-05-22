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
  getSummaryGroups,
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

  it('returns partial_denial procedures past their reminder threshold', async () => {
    const past = new Date()
    past.setDate(past.getDate() - 10)
    const p = await addProcedure({
      ...BASE,
      date: past.toISOString().split('T')[0],
      reminderDays: 1,
    })
    await updateProcedure(p.id, { status: 'partial_denial' })
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

describe('sync fields', () => {
  beforeEach(() => { resetDB() })

  it('addProcedure sets updatedAt', async () => {
    const p = await addProcedure({ ...BASE, date: '2026-01-01' })
    expect(p.updatedAt).toBeDefined()
  })

  it('addProcedure sets deletedAt to null', async () => {
    const p = await addProcedure({ ...BASE, date: '2026-01-01' })
    expect(p.deletedAt).toBeNull()
  })

  it('updateProcedure bumps updatedAt', async () => {
    const p = await addProcedure({ ...BASE, date: '2026-01-01' })
    await new Promise(r => setTimeout(r, 10))
    const updated = await updateProcedure(p.id, { status: 'paid' })
    expect(updated.updatedAt > p.updatedAt).toBe(true)
  })

  it('deleteProcedure soft-deletes: excluded from getAllProcedures', async () => {
    const p = await addProcedure({ ...BASE, date: '2026-01-01' })
    await deleteProcedure(p.id)
    expect(await getAllProcedures()).toHaveLength(0)
  })

  it('deleteProcedure soft-deletes: getProcedure returns undefined', async () => {
    const p = await addProcedure({ ...BASE, date: '2026-01-01' })
    await deleteProcedure(p.id)
    expect(await getProcedure(p.id)).toBeUndefined()
  })

  it('deleteProcedure sets deletedAt and bumps updatedAt (tombstone is dirty for sync)', async () => {
    const p = await addProcedure({ ...BASE, date: '2026-01-01' })
    await new Promise(r => setTimeout(r, 10))
    await deleteProcedure(p.id)
    // raw DB access to inspect the tombstone
    const { getDB } = await import('@/lib/db')
    const db = await getDB()
    const tombstone = await db.get('procedures', p.id)
    expect(tombstone?.deletedAt).not.toBeNull()
    expect(tombstone?.updatedAt).not.toBe(p.updatedAt)
    expect(tombstone?.syncedAt).toBeNull() // dirty — needs to be pushed
  })

  it('deleteProcedure is idempotent on already-deleted record', async () => {
    const p = await addProcedure({ ...BASE, date: '2026-01-01' })
    await deleteProcedure(p.id)
    const { getDB } = await import('@/lib/db')
    const db = await getDB()
    const first = await db.get('procedures', p.id)
    await deleteProcedure(p.id) // second call — should no-op
    const second = await db.get('procedures', p.id)
    expect(second?.deletedAt).toBe(first?.deletedAt) // timestamp unchanged
    expect(second?.updatedAt).toBe(first?.updatedAt)
  })
})

describe('getSummaryGroups', () => {
  beforeEach(() => { resetDB() })

  it('puts full_denial procedures in fullDenial bucket', async () => {
    await addProcedure({ ...BASE, date: '2025-01-01', status: 'full_denial' as const })
    const g = await getSummaryGroups()
    expect(g.fullDenial).toHaveLength(1)
    expect(g.fullDenial[0].status).toBe('full_denial')
    expect(g.partialDenial).toHaveLength(0)
    expect(g.overdue).toHaveLength(0)
    expect(g.paid).toHaveLength(0)
  })

  it('puts partial_denial procedures in partialDenial bucket', async () => {
    await addProcedure({ ...BASE, date: '2025-01-01', status: 'partial_denial' as const })
    const g = await getSummaryGroups()
    expect(g.partialDenial).toHaveLength(1)
    expect(g.fullDenial).toHaveLength(0)
  })

  it('puts pending + overdue reminder in overdue bucket', async () => {
    await addProcedure({ ...BASE, date: '2020-01-01', status: 'pending' as const, reminderDays: 1 })
    const g = await getSummaryGroups()
    expect(g.overdue).toHaveLength(1)
    expect(g.paid).toHaveLength(0)
  })

  it('puts pending-not-overdue in pending bucket', async () => {
    await addProcedure({ ...BASE, date: '2099-01-01', status: 'pending' as const, reminderDays: 1 })
    const g = await getSummaryGroups()
    expect(g.pending).toHaveLength(1)
    expect(g.overdue).toHaveLength(0)
    expect(g.fullDenial).toHaveLength(0)
    expect(g.partialDenial).toHaveLength(0)
    expect(g.paid).toHaveLength(0)
  })

  it('puts paid procedures in paid bucket sorted newest date first', async () => {
    const a = await addProcedure({ ...BASE, date: '2025-01-01', status: 'paid' as const })
    const b = await addProcedure({ ...BASE, date: '2025-06-01', status: 'paid' as const })
    const g = await getSummaryGroups()
    expect(g.paid).toHaveLength(2)
    expect(g.paid[0].id).toBe(b.id)
    expect(g.paid[1].id).toBe(a.id)
  })

  it('routes each status to its own bucket independently', async () => {
    await addProcedure({ ...BASE, date: '2020-01-01', status: 'pending' as const,         reminderDays: 1  })
    await addProcedure({ ...BASE, date: '2099-01-01', status: 'pending' as const,         reminderDays: 1  })
    await addProcedure({ ...BASE, date: '2025-01-01', status: 'partial_denial' as const                   })
    await addProcedure({ ...BASE, date: '2025-01-01', status: 'full_denial' as const                      })
    await addProcedure({ ...BASE, date: '2025-01-01', status: 'paid' as const                             })
    const g = await getSummaryGroups()
    expect(g.overdue).toHaveLength(1)
    expect(g.pending).toHaveLength(1)
    expect(g.partialDenial).toHaveLength(1)
    expect(g.fullDenial).toHaveLength(1)
    expect(g.paid).toHaveLength(1)
  })
})
