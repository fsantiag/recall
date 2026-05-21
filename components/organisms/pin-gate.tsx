'use client'

import { useState, useEffect, type ReactNode } from 'react'
import { hasPinSet, setPin, verifyPin } from '@/lib/pin'
import { useTranslation } from '@/components/organisms/language-provider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

type State = 'loading' | 'setup' | 'locked' | 'unlocked'

export function PinGate({ children }: { children: ReactNode }) {
  const { t } = useTranslation()
  const [state, setState] = useState<State>('loading')
  const [pin, setInputPin] = useState('')
  const [confirmPin, setConfirmPin] = useState('')
  const [error, setError] = useState('')

  // Read localStorage only on the client after mount to avoid SSR issues.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState(hasPinSet() ? 'locked' : 'setup')
  }, [])

  async function handleSetup(e: React.FormEvent) {
    e.preventDefault()
    if (pin.length < 4) { setError(t('pinTooShort')); return }
    if (pin !== confirmPin) { setError(t('pinMismatch')); return }
    await setPin(pin)
    setState('unlocked')
  }

  async function handleUnlock(e: React.FormEvent) {
    e.preventDefault()
    if (await verifyPin(pin)) {
      setState('unlocked')
    } else {
      setError(t('pinIncorrect'))
      setInputPin('')
    }
  }

  if (state === 'loading') return null
  if (state === 'unlocked') return <>{children}</>

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>{state === 'setup' ? t('pinSetupTitle') : t('pinLockTitle')}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={state === 'setup' ? handleSetup : handleUnlock} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="pin">{t('pinLabel')}</Label>
              <Input
                id="pin"
                type="password"
                inputMode="numeric"
                value={pin}
                onChange={(e) => { setInputPin(e.target.value); setError('') }}
                placeholder={t('pinPlaceholder')}
                autoFocus
              />
            </div>
            {state === 'setup' && (
              <div className="space-y-2">
                <Label htmlFor="confirm-pin">{t('pinConfirmLabel')}</Label>
                <Input
                  id="confirm-pin"
                  type="password"
                  inputMode="numeric"
                  value={confirmPin}
                  onChange={(e) => { setConfirmPin(e.target.value); setError('') }}
                  placeholder={t('pinConfirmPlaceholder')}
                />
              </div>
            )}
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full">
              {state === 'setup' ? t('pinSetButton') : t('pinUnlockButton')}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
