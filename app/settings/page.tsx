'use client'

import { useState } from 'react'
import { verifyPin, setPin } from '@/lib/pin'
import { type Language } from '@/lib/i18n'
import { type Theme } from '@/lib/theme'
import { useTranslation } from '@/components/organisms/language-provider'
import { useTheme } from '@/components/organisms/theme-provider'
import {
  notificationsEnabled,
  setNotificationsEnabled,
  requestNotificationPermission,
} from '@/lib/notifications'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function SettingsPage() {
  const { t, language, setLanguage } = useTranslation()
  const { theme, setTheme } = useTheme()
  const [notifsOn, setNotifsOn] = useState(() => notificationsEnabled())
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
      if (!(await verifyPin(currentPin))) { setError(t('currentPinIncorrect')); return }
      if (newPin.length < 4) { setError(t('newPinTooShort')); return }
      if (newPin !== confirmPin) { setError(t('newPinMismatch')); return }
      await setPin(newPin)
      setCurrentPin('')
      setNewPin('')
      setConfirmPin('')
      setSuccess(true)
    } catch {
      setError(t('changePinFailed'))
    }
  }

  async function handleNotifToggle() {
    if (notifsOn) {
      setNotificationsEnabled(false)
      setNotifsOn(false)
    } else {
      const granted = await requestNotificationPermission()
      if (granted) {
        setNotificationsEnabled(true)
        setNotifsOn(true)
      }
    }
  }

  const themeOptions: { value: Theme; label: string }[] = [
    { value: 'system', label: t('themeSystem') },
    { value: 'light',  label: t('themeLight') },
    { value: 'dark',   label: t('themeDark') },
  ]

  return (
    <main className="container mx-auto px-4 pt-14 pb-6 max-w-2xl space-y-6">
      <h1 className="text-[28px] font-semibold tracking-tight">{t('settingsTitle')}</h1>

      {/* Appearance */}
      <Card>
        <CardHeader><CardTitle>{t('themeLabel')}</CardTitle></CardHeader>
        <CardContent>
          <div className="flex gap-2">
            {themeOptions.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setTheme(value)}
                className={`flex-1 rounded-md border px-3 py-2 text-sm transition-colors
                  ${theme === value
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-background text-foreground hover:bg-muted'}`}
              >
                {label}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader><CardTitle>{t('notificationsLabel')}</CardTitle></CardHeader>
        <CardContent>
          <button
            onClick={handleNotifToggle}
            className={`w-full rounded-md border px-4 py-2 text-sm transition-colors
              ${notifsOn
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-background text-foreground hover:bg-muted'}`}
          >
            {notifsOn ? t('notificationsGranted') : t('notificationsEnable')}
          </button>
        </CardContent>
      </Card>

      {/* Language */}
      <Card>
        <CardHeader><CardTitle>{t('languageLabel')}</CardTitle></CardHeader>
        <CardContent>
          <div className="flex gap-2">
            {(['pt-BR', 'en'] as Language[]).map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`flex-1 rounded-md border px-4 py-2 text-sm transition-colors
                  ${language === lang
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-background text-foreground hover:bg-muted'}`}
              >
                {lang === 'pt-BR' ? t('languagePtBR') : t('languageEn')}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Change PIN */}
      <Card>
        <CardHeader><CardTitle>{t('changePinTitle')}</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleChangePin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-pin">{t('currentPin')}</Label>
              <Input
                id="current-pin"
                type="password"
                inputMode="numeric"
                value={currentPin}
                onChange={(e) => setCurrentPin(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-pin">{t('newPin')}</Label>
              <Input
                id="new-pin"
                type="password"
                inputMode="numeric"
                value={newPin}
                onChange={(e) => setNewPin(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-new-pin">{t('confirmNewPin')}</Label>
              <Input
                id="confirm-new-pin"
                type="password"
                inputMode="numeric"
                value={confirmPin}
                onChange={(e) => setConfirmPin(e.target.value)}
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            {success && <p className="text-sm text-green-600">{t('pinChanged')}</p>}
            <Button type="submit" className="w-full">{t('changePinButton')}</Button>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}
