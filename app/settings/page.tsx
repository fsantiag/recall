'use client'

import { useState } from 'react'
import { verifyPin, setPin } from '@/lib/pin'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function SettingsPage() {
  const [currentPin, setCurrentPin] = useState('')
  const [newPin, setNewPin] = useState('')
  const [confirmPin, setConfirmPin] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  async function handleChangePin(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSuccess(false)

    try {
      if (!(await verifyPin(currentPin))) { setError('Current PIN is incorrect'); return }
      if (newPin.length < 4) { setError('New PIN must be at least 4 characters'); return }
      if (newPin !== confirmPin) { setError('New PINs do not match'); return }

      await setPin(newPin)
      setCurrentPin('')
      setNewPin('')
      setConfirmPin('')
      setSuccess(true)
    } catch {
      setError('Failed to change PIN. Please try again.')
    }
  }

  return (
    <main className="container mx-auto px-4 py-6 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      <Card>
        <CardHeader><CardTitle>Change PIN</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleChangePin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-pin">Current PIN</Label>
              <Input
                id="current-pin"
                type="password"
                inputMode="numeric"
                value={currentPin}
                onChange={(e) => setCurrentPin(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-pin">New PIN</Label>
              <Input
                id="new-pin"
                type="password"
                inputMode="numeric"
                value={newPin}
                onChange={(e) => setNewPin(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-new-pin">Confirm New PIN</Label>
              <Input
                id="confirm-new-pin"
                type="password"
                inputMode="numeric"
                value={confirmPin}
                onChange={(e) => setConfirmPin(e.target.value)}
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            {success && <p className="text-sm text-green-600">PIN changed successfully.</p>}
            <Button type="submit" className="w-full">Change PIN</Button>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}
