'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

const DISMISSED_KEY = 'recall_install_dismissed'

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  readonly userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

function detectIOS(): boolean {
  if (typeof navigator === 'undefined') return false
  const ua = navigator.userAgent
  const isIOSDevice = /iPhone|iPad|iPod/.test(ua)
  const isStandalone = 'standalone' in navigator && (navigator as { standalone?: boolean }).standalone === true
  return isIOSDevice && !isStandalone
}

export function useInstallPrompt() {
  const deferredRef = useRef<BeforeInstallPromptEvent | null>(null)
  const [isIOS] = useState(detectIOS)
  const [canInstall, setCanInstall] = useState(() => detectIOS())
  const [isDismissed, setIsDismissed] = useState(() =>
    typeof localStorage !== 'undefined' &&
    localStorage.getItem(DISMISSED_KEY) === 'true'
  )

  useEffect(() => {
    if (isIOS) return

    function handler(e: Event) {
      e.preventDefault()
      deferredRef.current = e as BeforeInstallPromptEvent
      setCanInstall(true)
    }

    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [isIOS])

  const prompt = useCallback(async () => {
    if (isIOS || !deferredRef.current) return
    await deferredRef.current.prompt()
    const { outcome } = await deferredRef.current.userChoice
    deferredRef.current = null
    if (outcome === 'accepted') {
      setIsDismissed(true)
      localStorage.setItem(DISMISSED_KEY, 'true')
    }
  }, [isIOS])

  const dismiss = useCallback(() => {
    setIsDismissed(true)
    localStorage.setItem(DISMISSED_KEY, 'true')
  }, [])

  const resetDismissed = useCallback(() => {
    setIsDismissed(false)
    localStorage.removeItem(DISMISSED_KEY)
  }, [])

  return { canInstall, isIOS, isDismissed, prompt, dismiss, resetDismissed }
}
