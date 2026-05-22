import { describe, it, expect, beforeEach, vi } from 'vitest'
import { resetDB } from '@/lib/db'
import { addProcedure, getProcedure, updateProcedure } from '@/lib/procedures'
import {
  getDirtyProcedures,
  markSynced,
  applyServerProcedures,
  sync,
} from '@/lib/sync'

vi.mock('@/lib/api', () => ({
  syncProcedures: vi.fn(),
}))

import * as api from '@/lib/api'

const BASE = {
  name: 'Consultation',
  patientName: 'John Doe',
  payer: 'Unimed',
  location: 'Hospital A',
  honoraryType: 'Cirurgião',
  status: 'pending' as const,
  reminderDays: 30,
  date: '2026-01-01',
}

describe('getDirtyProcedures', () => {
  beforeEach(() => { resetDB() })

  it('newly added procedure is dirty', async () => {
    await addProcedure(BASE)
    expect(await getDirtyProcedures()).toHaveLength(1)
  })

  it('procedure marked synced is not dirty', async () => {
    const p = await addProcedure(BASE)
    await markSynced([{ id: p.id, updatedAt: p.updatedAt }])
    expect(await getDirtyProcedures()).toHaveLength(0)
  })

  it('updating a synced procedure makes it dirty again', async () => {
    const p = await addProcedure(BASE)
    await markSynced([{ id: p.id, updatedAt: p.updatedAt }])
    await new Promise(r => setTimeout(r, 10))
    await updateProcedure(p.id, { status: 'paid' })
    expect(await getDirtyProcedures()).toHaveLength(1)
  })

  it('markSynced does not stamp a record mutated after the snapshot', async () => {
    const p = await addProcedure(BASE)
    const snapshot = { id: p.id, updatedAt: p.updatedAt }
    await new Promise(r => setTimeout(r, 10))
    await updateProcedure(p.id, { status: 'paid' }) // mutates updatedAt
    await markSynced([snapshot]) // snapshot is stale — should be skipped
    expect(await getDirtyProcedures()).toHaveLength(1)
  })
})

describe('applyServerProcedures', () => {
  beforeEach(() => { resetDB() })

  it('adds a server record not present locally', async () => {
    const serverRecord = {
      ...BASE,
      id: 'server-only-id',
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
      deletedAt: null,
    }
    await applyServerProcedures([serverRecord])
    expect(await getProcedure('server-only-id')).toBeDefined()
  })

  it('replaces local record when server updatedAt is newer', async () => {
    const p = await addProcedure(BASE)
    const newerFromServer = {
      ...p,
      status: 'paid' as const,
      updatedAt: new Date(Date.now() + 10000).toISOString(),
    }
    await applyServerProcedures([newerFromServer])
    expect((await getProcedure(p.id))?.status).toBe('paid')
  })

  it('keeps local record when local updatedAt is newer', async () => {
    const p = await addProcedure(BASE)
    const olderFromServer = {
      ...p,
      status: 'paid' as const,
      updatedAt: new Date(Date.parse(p.updatedAt) - 10000).toISOString(),
    }
    await applyServerProcedures([olderFromServer])
    expect((await getProcedure(p.id))?.status).toBe('pending')
  })

  it('applies soft-delete from server when server is newer', async () => {
    const p = await addProcedure(BASE)
    const deletedOnServer = {
      ...p,
      deletedAt: new Date(Date.now() + 10000).toISOString(),
      updatedAt: new Date(Date.now() + 10000).toISOString(),
    }
    await applyServerProcedures([deletedOnServer])
    expect(await getProcedure(p.id)).toBeUndefined()
  })
})

describe('sync', () => {
  beforeEach(() => { resetDB(); vi.clearAllMocks() })

  it('calls api.syncProcedures with dirty records and marks them synced', async () => {
    const p = await addProcedure(BASE)
    vi.mocked(api.syncProcedures).mockResolvedValueOnce([{ ...p }])

    await sync()

    expect(api.syncProcedures).toHaveBeenCalledWith([expect.objectContaining({ id: p.id })])
    expect(await getDirtyProcedures()).toHaveLength(0)
  })

  it('does nothing when no dirty records', async () => {
    const p = await addProcedure(BASE)
    await markSynced([{ id: p.id, updatedAt: p.updatedAt }])

    await sync()

    expect(api.syncProcedures).not.toHaveBeenCalled()
  })

  it('leaves dirty records dirty when api call throws', async () => {
    await addProcedure(BASE)
    vi.mocked(api.syncProcedures).mockRejectedValueOnce(new Error('network error'))

    try { await sync() } catch (_) { /* error propagates to caller */ }
    expect(await getDirtyProcedures()).toHaveLength(1)
  })
})
