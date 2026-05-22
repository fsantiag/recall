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
  location: 'Hospital São Lucas',
  honoraryType: 'Surgeon',
  date: '2026-05-01T10:00',
  status: 'pending' as const,
  reminderDays: 7,
  createdAt: '2026-05-01T10:00:00Z',
}

describe('ProcedureCard', () => {
  it('renders patient name and payer', () => {
    renderWithProviders(
      <ProcedureCard procedure={PROC} onToggleStatus={vi.fn()} />
    )
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText(/Unimed/)).toBeInTheDocument()
  })

  it('calls onToggleStatus when check button clicked', async () => {
    const onToggle = vi.fn()
    renderWithProviders(
      <ProcedureCard procedure={PROC} onToggleStatus={onToggle} />
    )
    await userEvent.click(screen.getByRole('button', { name: /mark as paid/i }))
    expect(onToggle).toHaveBeenCalledWith('1')
  })

  it('renders location and honoraryType', () => {
    renderWithProviders(
      <ProcedureCard procedure={PROC} onToggleStatus={vi.fn()} />
    )
    expect(screen.getByText(/Hospital São Lucas/)).toBeInTheDocument()
    expect(screen.getByText(/Surgeon/)).toBeInTheDocument()
  })

  it('omits info row when location and honoraryType are empty', () => {
    const proc = { ...PROC, location: '', honoraryType: '' }
    renderWithProviders(
      <ProcedureCard procedure={proc} onToggleStatus={vi.fn()} />
    )
    expect(screen.queryByText(/Hospital São Lucas/)).not.toBeInTheDocument()
    expect(screen.queryByText(/Surgeon/)).not.toBeInTheDocument()
  })
})
