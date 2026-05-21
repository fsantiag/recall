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

  it('step 1 shows patient name field', () => {
    renderWithProviders(<ProcedureForm onSuccess={vi.fn()} />)
    expect(screen.getByLabelText(/patient name/i)).toBeInTheDocument()
    expect(screen.queryByLabelText(/procedure name/i)).not.toBeInTheDocument()
  })

  it('shows validation error on step 1 when patient name empty', async () => {
    const user = userEvent.setup()
    renderWithProviders(<ProcedureForm onSuccess={vi.fn()} />)
    await user.click(screen.getByRole('button', { name: /save/i }))
    await screen.findByText(/patient name is required/i)
  })

  it('advances to step 2 after valid patient name', async () => {
    const user = userEvent.setup()
    renderWithProviders(<ProcedureForm onSuccess={vi.fn()} />)
    await user.type(screen.getByLabelText(/patient name/i), 'Jane Doe')
    await user.click(screen.getByRole('button', { name: /save/i }))
    await screen.findByLabelText(/procedure name/i)
  })

  it('calls onSuccess after completing all 3 steps', async () => {
    const user = userEvent.setup()
    const onSuccess = vi.fn()
    renderWithProviders(<ProcedureForm onSuccess={onSuccess} />)

    // Step 1: patient name
    await user.type(screen.getByLabelText(/patient name/i), 'Jane Doe')
    await user.click(screen.getByRole('button', { name: /save/i }))

    // Step 2: procedure details
    await screen.findByLabelText(/procedure name/i)
    await user.type(screen.getByLabelText(/procedure name/i), 'Consultation')
    await user.type(screen.getByLabelText(/payer/i), 'Unimed')
    fireEvent.change(screen.getByLabelText(/date/i), { target: { value: '2026-01-15T09:00' } })
    await user.click(screen.getByRole('button', { name: /save/i }))

    // Step 3: review — click final save
    await screen.findByText(/review/i)
    await user.click(screen.getByRole('button', { name: /^save$/i }))

    await waitFor(() => expect(onSuccess).toHaveBeenCalledOnce())
  })
})
