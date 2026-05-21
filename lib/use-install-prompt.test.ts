import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useInstallPrompt } from './use-install-prompt'

function fireInstallPrompt() {
  const event = Object.assign(new Event('beforeinstallprompt'), {
    prompt: vi.fn().mockResolvedValue(undefined),
    userChoice: Promise.resolve({ outcome: 'dismissed' as const }),
  })
  window.dispatchEvent(event)
  return event
}

describe('useInstallPrompt', () => {
  beforeEach(() => {
    localStorage.clear()
    Object.defineProperty(navigator, 'userAgent', {
      value: 'Mozilla/5.0 (Linux; Android 10)',
      writable: true,
      configurable: true,
    })
  })

  it('starts with canInstall=false and isDismissed=false', () => {
    const { result } = renderHook(() => useInstallPrompt())
    expect(result.current.canInstall).toBe(false)
    expect(result.current.isDismissed).toBe(false)
    expect(result.current.isIOS).toBe(false)
  })

  it('sets canInstall=true when beforeinstallprompt fires', () => {
    const { result } = renderHook(() => useInstallPrompt())
    act(() => { fireInstallPrompt() })
    expect(result.current.canInstall).toBe(true)
  })

  it('dismiss sets isDismissed=true and persists to localStorage', () => {
    const { result } = renderHook(() => useInstallPrompt())
    act(() => { result.current.dismiss() })
    expect(result.current.isDismissed).toBe(true)
    expect(localStorage.getItem('recall_install_dismissed')).toBe('true')
  })

  it('reads isDismissed=true from localStorage on mount', () => {
    localStorage.setItem('recall_install_dismissed', 'true')
    const { result } = renderHook(() => useInstallPrompt())
    expect(result.current.isDismissed).toBe(true)
  })

  it('resetDismissed clears isDismissed and localStorage', () => {
    localStorage.setItem('recall_install_dismissed', 'true')
    const { result } = renderHook(() => useInstallPrompt())
    act(() => { result.current.resetDismissed() })
    expect(result.current.isDismissed).toBe(false)
    expect(localStorage.getItem('recall_install_dismissed')).toBeNull()
  })

  it('detects iOS and sets canInstall=true without waiting for event', () => {
    Object.defineProperty(navigator, 'userAgent', {
      value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0)',
      writable: true,
      configurable: true,
    })
    const { result } = renderHook(() => useInstallPrompt())
    expect(result.current.isIOS).toBe(true)
    expect(result.current.canInstall).toBe(true)
  })
})
