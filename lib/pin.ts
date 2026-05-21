const PIN_KEY = 'recall_pin_hash'

export async function hashPin(pin: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(pin)
  const buffer = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

export async function setPin(pin: string): Promise<void> {
  const hash = await hashPin(pin)
  localStorage.setItem(PIN_KEY, hash)
}

export async function verifyPin(pin: string): Promise<boolean> {
  const stored = localStorage.getItem(PIN_KEY)
  if (!stored) return false
  return (await hashPin(pin)) === stored
}

export function hasPinSet(): boolean {
  return localStorage.getItem(PIN_KEY) !== null
}

export function clearPin(): void {
  localStorage.removeItem(PIN_KEY)
}
