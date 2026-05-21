'use client'

import { useState, useEffect, type ReactNode } from 'react'
import { hasPinSet, setPin, verifyPin } from '@/lib/pin'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

type State = 'loading' | 'setup' | 'locked' | 'unlocked'

export function PinGate({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>('loading')
  const [pin, setInputPin] = useState('')
  const [confirmPin, setConfirmPin] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    setState(hasPinSet() ? 'locked' : 'setup')
  }, [])

  async function handleSetup(e: React.FormEvent) {
    e.preventDefault()
    if (pin.length < 4) { setError('PIN must be at least 4 characters'); return }
    if (pin !== confirmPin) { setError('PINs do not match'); return }
    await setPin(pin)
    setState('unlocked')
  }

  async function handleUnlock(e: React.FormEvent) {
    e.preventDefault()
    if (await verifyPin(pin)) {
      setState('unlocked')
    } else {
      setError('Incorrect PIN')
      setInputPin('')
    }
  }

  if (state === 'loading') return null
  if (state === 'unlocked') return <>{children}</>

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>{state === 'setup' ? 'Set up your PIN' : 'Enter your PIN'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={state === 'setup' ? handleSetup : handleUnlock} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="pin">PIN</Label>
              <Input
                id="pin"
                type="password"
                inputMode="numeric"
                value={pin}
                onChange={(e) => { setInputPin(e.target.value); setError('') }}
                placeholder="Enter PIN"
                autoFocus
              />
            </div>
            {state === 'setup' && (
              <div className="space-y-2">
                <Label htmlFor="confirm-pin">Confirm PIN</Label>
                <Input
                  id="confirm-pin"
                  type="password"
                  inputMode="numeric"
                  value={confirmPin}
                  onChange={(e) => { setConfirmPin(e.target.value); setError('') }}
                  placeholder="Confirm PIN"
                />
              </div>
            )}
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full">
              {state === 'setup' ? 'Set PIN' : 'Unlock'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
