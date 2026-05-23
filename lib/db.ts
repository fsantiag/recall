import { openDB, type DBSchema, type IDBPDatabase } from 'idb'
import type { Procedure } from './types'

interface RecallDBSchema extends DBSchema {
  procedures: {
    key: string
    value: Procedure
    indexes: { 'by-date': string; 'by-status': string }
  }
}

const DB_NAME = 'recall-db'
const DB_VERSION = 4

let dbPromise: Promise<IDBPDatabase<RecallDBSchema>> | null = null

export function getDB(): Promise<IDBPDatabase<RecallDBSchema>> {
  if (!dbPromise) {
    dbPromise = openDB<RecallDBSchema>(DB_NAME, DB_VERSION, {
      upgrade(db, oldVersion, _newVersion, tx) {
        if (oldVersion < 1) {
          const store = db.createObjectStore('procedures', { keyPath: 'id' })
          store.createIndex('by-date', 'date')
          store.createIndex('by-status', 'status')
        }
        if (oldVersion >= 1 && oldVersion < 2) {
          type V1Procedure = Omit<Procedure, 'updatedAt' | 'deletedAt' | 'syncedAt'>
          ;(async () => {
            let cursor = await tx.objectStore('procedures').openCursor()
            while (cursor) {
              const v1 = cursor.value as unknown as V1Procedure
              await cursor.update({ ...v1, updatedAt: v1.createdAt, deletedAt: null, syncedAt: null } as Procedure)
              cursor = await cursor.continue()
            }
          })()
        }
        if (oldVersion >= 2 && oldVersion < 3) {
          type V2Procedure = Omit<Procedure, 'syncedAt'>
          ;(async () => {
            let cursor = await tx.objectStore('procedures').openCursor()
            while (cursor) {
              const v2 = cursor.value as unknown as V2Procedure
              await cursor.update({ ...v2, syncedAt: null } as Procedure)
              cursor = await cursor.continue()
            }
          })()
        }
        if (oldVersion >= 3 && oldVersion < 4) {
          type V3Procedure = Omit<Procedure, 'notes'>
          ;(async () => {
            let cursor = await tx.objectStore('procedures').openCursor()
            while (cursor) {
              const v3 = cursor.value as unknown as V3Procedure
              await cursor.update({ ...v3, notes: [] } as Procedure)
              cursor = await cursor.continue()
            }
          })()
        }
      },
    })
  }
  return dbPromise
}

export function resetDB(): void {
  dbPromise = null
}
