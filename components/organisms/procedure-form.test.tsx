import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, waitFor, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ProcedureForm } from '@/components/organisms/procedure-form'
import { resetDB } from '@/lib/db'
import { renderWithProviders } from '@/lib/test-utils'

describe('ProcedureForm', () => {
  beforeEach(() => {
    resetDB()
  })

  it('renders all required fields', () => {
    renderWithProviders(<ProcedureForm onSuccess={vi.fn()} />)
    expect(screen.getByLabelText(/procedure name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/patient name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/payer/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/date/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/reminder days/i)).toBeInTheDocument()
  })

  it('shows validation error when submitted empty', async () => {
    const user = userEvent.setup()
    renderWithProviders(<ProcedureForm onSuccess={vi.fn()} />)
    await user.click(screen.getByRole('button', { name: /save/i }))
    await screen.findByText(/procedure name is required/i)
  })

  it('calls onSuccess after valid submission', async () => {
    const user = userEvent.setup()
    const onSuccess = vi.fn()
    renderWithProviders(<ProcedureForm onSuccess={onSuccess} />)

    await user.type(screen.getByLabelText(/procedure name/i), 'Consultation')
    await user.type(screen.getByLabelText(/patient name/i), 'Jane Doe')
    await user.type(screen.getByLabelText(/payer/i), 'Unimed')
    fireEvent.change(screen.getByLabelText(/date/i), { target: { value: '2026-01-15T09:00' } })
    await user.clear(screen.getByLabelText(/reminder days/i))
    await user.type(screen.getByLabelText(/reminder days/i), '30')
    await user.click(screen.getByRole('button', { name: /save/i }))

    await waitFor(() => expect(onSuccess).toHaveBeenCalledOnce())
  })
})
