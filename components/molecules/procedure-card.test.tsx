import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '@/lib/test-utils'
import { ProcedureCard } from './procedure-card'

const PROC = {
  id: '1',
  name: 'Consultation',
  patientName: 'John Doe',
  payer: 'Unimed',
  date: '2026-05-01T10:00',
  status: 'pending' as const,
  reminderDays: 7,
  createdAt: '2026-05-01T10:00:00Z',
}

describe('ProcedureCard', () => {
  it('renders patient name and payer', () => {
    renderWithProviders(
      <ProcedureCard procedure={PROC} onToggleStatus={vi.fn()} onSnooze={vi.fn()} />
    )
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText(/Unimed/)).toBeInTheDocument()
  })

  it('calls onSnooze when snooze button clicked', async () => {
    const onSnooze = vi.fn()
    renderWithProviders(
      <ProcedureCard procedure={PROC} onToggleStatus={vi.fn()} onSnooze={onSnooze} />
    )
    await userEvent.click(screen.getByRole('button', { name: /snooze/i }))
    expect(onSnooze).toHaveBeenCalledWith('1')
  })

  it('calls onToggleStatus when check button clicked', async () => {
    const onToggle = vi.fn()
    renderWithProviders(
      <ProcedureCard procedure={PROC} onToggleStatus={onToggle} onSnooze={vi.fn()} />
    )
    await userEvent.click(screen.getByRole('button', { name: /mark as paid/i }))
    expect(onToggle).toHaveBeenCalledWith('1')
  })
})
