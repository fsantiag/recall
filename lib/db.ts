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
const DB_VERSION = 1

let dbPromise: Promise<IDBPDatabase<RecallDBSchema>> | null = null

export function getDB(): Promise<IDBPDatabase<RecallDBSchema>> {
  if (!dbPromise) {
    dbPromise = openDB<RecallDBSchema>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        const store = db.createObjectStore('procedures', { keyPath: 'id' })
        store.createIndex('by-date', 'date')
        store.createIndex('by-status', 'status')
      },
    })
  }
  return dbPromise
}

export function resetDB(): void {
  dbPromise = null
}
