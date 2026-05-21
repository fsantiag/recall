'use client'

import { useState } from 'react'
import { type Language } from '@/lib/i18n'
import { type Theme } from '@/lib/theme'
import { useTranslation } from '@/components/organisms/language-provider'
import { useTheme } from '@/components/organisms/theme-provider'
import {
  notificationsEnabled,
  setNotificationsEnabled,
  requestNotificationPermission,
} from '@/lib/notifications'
import { useInstallPrompt } from '@/lib/use-install-prompt'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function SettingsPage() {
  const { t, language, setLanguage } = useTranslation()
  const { theme, setTheme } = useTheme()
  const { canInstall, isIOS, isDismissed: installDismissed, prompt: installPrompt, resetDismissed } = useInstallPrompt()
  const [notifsOn, setNotifsOn] = useState(() => notificationsEnabled())

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

      {/* Install App */}
      {canInstall && (
        <Card>
          <CardHeader><CardTitle>{t('installSettingsTitle')}</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {isIOS ? (
              <p className="text-sm text-muted-foreground">{t('installSettingsIosHint')}</p>
            ) : (
              <button
                onClick={installPrompt}
                className="w-full rounded-md border px-4 py-2 text-sm bg-background text-foreground hover:bg-muted transition-colors"
              >
                {t('installButton')}
              </button>
            )}
            {installDismissed && (
              <button
                onClick={resetDismissed}
                className="w-full rounded-md border px-4 py-2 text-sm bg-background text-foreground hover:bg-muted transition-colors"
              >
                {t('installShowAgain')}
              </button>
            )}
          </CardContent>
        </Card>
      )}

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

    </main>
  )
}
