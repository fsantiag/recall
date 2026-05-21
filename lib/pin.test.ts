import { describe, it, expect, beforeEach } from 'vitest'
import { hashPin, setPin, verifyPin, hasPinSet, clearPin } from '@/lib/pin'

describe('PIN auth', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('hashPin returns a 64-char hex string', async () => {
    const hash = await hashPin('1234')
    expect(hash).toHaveLength(64)
    expect(hash).toMatch(/^[0-9a-f]+$/)
  })

  it('same PIN always produces same hash', async () => {
    expect(await hashPin('1234')).toBe(await hashPin('1234'))
  })

  it('different PINs produce different hashes', async () => {
    expect(await hashPin('1234')).not.toBe(await hashPin('5678'))
  })

  it('hasPinSet returns false when no PIN stored', () => {
    expect(hasPinSet()).toBe(false)
  })

  it('hasPinSet returns true after setPin', async () => {
    await setPin('1234')
    expect(hasPinSet()).toBe(true)
  })

  it('verifyPin returns true for correct PIN', async () => {
    await setPin('1234')
    expect(await verifyPin('1234')).toBe(true)
  })

  it('verifyPin returns false for wrong PIN', async () => {
    await setPin('1234')
    expect(await verifyPin('9999')).toBe(false)
  })

  it('clearPin removes stored hash', async () => {
    await setPin('1234')
    clearPin()
    expect(hasPinSet()).toBe(false)
  })
})
