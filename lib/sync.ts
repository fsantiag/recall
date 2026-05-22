import { getDB } from './db'
import type { Procedure } from './types'
import { syncProcedures as apiSyncProcedures } from './api'

type ProcedureDTO = Omit<Procedure, 'syncedAt'>

export async function getDirtyProcedures(): Promise<Procedure[]> {
  const db = await getDB()
  const all = await db.getAll('procedures')
  return all.filter(p => p.syncedAt === null || p.syncedAt < p.updatedAt)
}

// Stamps syncedAt only when updatedAt still matches the snapshot taken before the API call.
// Protects against a mutation racing in between apiSyncProcedures and markSynced.
export async function markSynced(snapshot: { id: string; updatedAt: string }[]): Promise<void> {
  const db = await getDB()
  for (const { id, updatedAt } of snapshot) {
    const current = await db.get('procedures', id)
    if (!current || current.updatedAt !== updatedAt) continue
    await db.put('procedures', { ...current, syncedAt: updatedAt })
  }
}

export async function applyServerProcedures(serverRecords: ProcedureDTO[]): Promise<void> {
  const db = await getDB()
  for (const serverRecord of serverRecords) {
    const local = await db.get('procedures', serverRecord.id)
    if (!local) {
      await db.put('procedures', { ...serverRecord, syncedAt: serverRecord.updatedAt })
      continue
    }
    if (serverRecord.updatedAt >= local.updatedAt) {
      await db.put('procedures', { ...serverRecord, syncedAt: serverRecord.updatedAt })
    }
    // local is newer — keep as-is, server will accept our version on next push
  }
}

// TODO Phase 3: add pull-on-open and pull-on-reconnect (window 'online' event)
export async function sync(): Promise<void> {
  const dirty = await getDirtyProcedures()
  if (dirty.length === 0) return
  // Snapshot updatedAt before the API call so markSynced can skip records
  // that mutated while the request was in-flight.
  const snapshot = dirty.map(({ id, updatedAt }) => ({ id, updatedAt }))
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const dtos: ProcedureDTO[] = dirty.map(({ syncedAt: _, ...rest }) => rest)
  const serverRecords = await apiSyncProcedures(dtos)
  await applyServerProcedures(serverRecords)
  await markSynced(snapshot)
}
