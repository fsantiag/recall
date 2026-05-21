import { describe, it, expect, beforeEach } from 'vitest'
import { getDB, resetDB } from '@/lib/db'

describe('getDB', () => {
  beforeEach(() => {
    resetDB()
  })

  it('opens the database', async () => {
    const db = await getDB()
    expect(db).toBeDefined()
    expect(db.name).toBe('recall-db')
  })

  it('creates procedures object store', async () => {
    const db = await getDB()
    expect(db.objectStoreNames.contains('procedures')).toBe(true)
  })

  it('returns same instance on subsequent calls', async () => {
    const db1 = await getDB()
    const db2 = await getDB()
    expect(db1).toBe(db2)
  })
})
