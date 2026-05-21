import { describe, it, expect, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PinGate } from '@/components/organisms/pin-gate'
import { renderWithProviders } from '@/lib/test-utils'

describe('PinGate', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('shows PIN setup form when no PIN is set', async () => {
    renderWithProviders(<PinGate><div>protected content</div></PinGate>)
    await screen.findByText(/set up your pin/i)
    expect(screen.queryByText('protected content')).not.toBeInTheDocument()
  })

  it('shows unlock form when PIN is already set', async () => {
    localStorage.setItem('recall_pin_hash', 'fakehash')
    renderWithProviders(<PinGate><div>protected content</div></PinGate>)
    await screen.findByText(/enter your pin/i)
    expect(screen.queryByText('protected content')).not.toBeInTheDocument()
  })

  it('unlocks and shows children after correct PIN setup', async () => {
    const user = userEvent.setup()
    renderWithProviders(<PinGate><div>protected content</div></PinGate>)
    await screen.findByText(/set up your pin/i)

    await user.type(screen.getByLabelText(/^pin$/i), '1234')
    await user.type(screen.getByLabelText(/confirm pin/i), '1234')
    await user.click(screen.getByRole('button', { name: /set pin/i }))

    await screen.findByText('protected content')
  })
})
