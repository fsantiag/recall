import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '@/lib/test-utils'
import { InstallBanner } from './install-banner'
import * as hook from '@/lib/use-install-prompt'

vi.mock('@/lib/use-install-prompt')

const base = {
  prompt: vi.fn(),
  dismiss: vi.fn(),
  resetDismissed: vi.fn(),
}

describe('InstallBanner', () => {
  beforeEach(() => { vi.clearAllMocks() })

  it('renders nothing when canInstall=false', () => {
    vi.mocked(hook.useInstallPrompt).mockReturnValue({ ...base, canInstall: false, isIOS: false, isDismissed: false })
    const { container } = renderWithProviders(<InstallBanner />)
    expect(container).toBeEmptyDOMElement()
  })

  it('renders nothing when isDismissed=true', () => {
    vi.mocked(hook.useInstallPrompt).mockReturnValue({ ...base, canInstall: true, isIOS: false, isDismissed: true })
    const { container } = renderWithProviders(<InstallBanner />)
    expect(container).toBeEmptyDOMElement()
  })

  it('shows Install button on Android when canInstall=true', () => {
    vi.mocked(hook.useInstallPrompt).mockReturnValue({ ...base, canInstall: true, isIOS: false, isDismissed: false })
    renderWithProviders(<InstallBanner />)
    expect(screen.getByRole('button', { name: 'Install' })).toBeInTheDocument()
  })

  it('calls prompt() when Install button is clicked', async () => {
    const prompt = vi.fn()
    vi.mocked(hook.useInstallPrompt).mockReturnValue({ ...base, prompt, canInstall: true, isIOS: false, isDismissed: false })
    renderWithProviders(<InstallBanner />)
    await userEvent.click(screen.getByRole('button', { name: 'Install' }))
    expect(prompt).toHaveBeenCalledOnce()
  })

  it('shows iOS instructions and no Install button on iOS', () => {
    vi.mocked(hook.useInstallPrompt).mockReturnValue({ ...base, canInstall: true, isIOS: true, isDismissed: false })
    renderWithProviders(<InstallBanner />)
    expect(screen.queryByRole('button', { name: 'Install' })).not.toBeInTheDocument()
    expect(screen.getByText(/Add to Home Screen/i)).toBeInTheDocument()
  })

  it('calls dismiss() when dismiss button is clicked', async () => {
    const dismiss = vi.fn()
    vi.mocked(hook.useInstallPrompt).mockReturnValue({ ...base, dismiss, canInstall: true, isIOS: false, isDismissed: false })
    renderWithProviders(<InstallBanner />)
    await userEvent.click(screen.getByRole('button', { name: /dismiss/i }))
    expect(dismiss).toHaveBeenCalledOnce()
  })
})
