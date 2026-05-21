'use client'

import Image from 'next/image'
import { X, Share } from 'lucide-react'
import { useInstallPrompt } from '@/lib/use-install-prompt'
import { useTranslation } from '@/components/organisms/language-provider'

export function InstallBanner() {
  const { canInstall, isIOS, isDismissed, prompt, dismiss } = useInstallPrompt()
  const { t } = useTranslation()

  if (!canInstall || isDismissed) return null

  return (
    <div className="flex items-center gap-3 border-b bg-card px-4 py-3">
      <Image
        src="/icon-192x192.png"
        alt="Recall"
        width={32}
        height={32}
        className="rounded-lg shrink-0"
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium leading-tight">{t('installBannerTitle')}</p>
        {isIOS && (
          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
            {t('installBannerBody')}
            <Share className="h-3 w-3 shrink-0" />
          </p>
        )}
      </div>
      {!isIOS && (
        <button
          onClick={prompt}
          aria-label={t('installButton')}
          className="shrink-0 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground"
        >
          {t('installButton')}
        </button>
      )}
      <button
        onClick={dismiss}
        aria-label={t('installDismiss')}
        className="shrink-0 text-muted-foreground hover:text-foreground"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}
