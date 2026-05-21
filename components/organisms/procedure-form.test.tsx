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

  describe('reminder days — custom mode', () => {
    async function advanceToStep2(user: ReturnType<typeof userEvent.setup>) {
      await user.type(screen.getByLabelText(/patient name/i), 'Jane Doe')
      await user.click(screen.getByRole('button', { name: /save/i }))
      await screen.findByLabelText(/procedure name/i)
    }

    it('shows a Custom chip on step 2', async () => {
      const user = userEvent.setup()
      renderWithProviders(<ProcedureForm onSuccess={vi.fn()} />)
      await advanceToStep2(user)
      expect(screen.getByRole('button', { name: /custom/i })).toBeInTheDocument()
    })

    it('clicking Custom chip reveals a date input', async () => {
      const user = userEvent.setup()
      renderWithProviders(<ProcedureForm onSuccess={vi.fn()} />)
      await advanceToStep2(user)
      await user.click(screen.getByRole('button', { name: /custom/i }))
      expect(screen.getByLabelText(/reminder date/i)).toBeInTheDocument()
    })

    it('clicking a preset chip after Custom hides the date input', async () => {
      const user = userEvent.setup()
      renderWithProviders(<ProcedureForm onSuccess={vi.fn()} />)
      await advanceToStep2(user)
      await user.click(screen.getByRole('button', { name: /custom/i }))
      expect(screen.getByLabelText(/reminder date/i)).toBeInTheDocument()
      await user.click(screen.getByRole('button', { name: /^7d$/i }))
      expect(screen.queryByLabelText(/reminder date/i)).not.toBeInTheDocument()
    })

    it('opens in custom mode automatically when reminderDays is not a preset', async () => {
      const user = userEvent.setup()
      renderWithProviders(
        <ProcedureForm
          onSuccess={vi.fn()}
          defaultValues={{ patientName: 'Jane', date: '2026-01-01T09:00', reminderDays: 45 }}
        />
      )
      await user.click(screen.getByRole('button', { name: /save/i }))
      await screen.findByLabelText(/procedure name/i)
      expect(screen.getByLabelText(/reminder date/i)).toBeInTheDocument()
    })
  })

  describe('autocomplete datalists', () => {
    it('renders patientName datalist on step 1', () => {
      renderWithProviders(<ProcedureForm onSuccess={vi.fn()} />)
      expect(document.getElementById('datalist-patient-names')).toBeInTheDocument()
    })

    it('wires list attribute on patientName input after 3 chars', async () => {
      const user = userEvent.setup()
      renderWithProviders(<ProcedureForm onSuccess={vi.fn()} />)
      const input = screen.getByLabelText(/patient name/i)
      expect(input).not.toHaveAttribute('list')
      await user.type(input, 'Ana')
      expect(input).toHaveAttribute('list', 'datalist-patient-names')
    })

    it('does not wire list attribute with fewer than 3 chars', async () => {
      const user = userEvent.setup()
      renderWithProviders(<ProcedureForm onSuccess={vi.fn()} />)
      const input = screen.getByLabelText(/patient name/i)
      await user.type(input, 'An')
      expect(input).not.toHaveAttribute('list')
    })

    it('renders procedureName and payer datalists on step 2', async () => {
      const user = userEvent.setup()
      renderWithProviders(<ProcedureForm onSuccess={vi.fn()} />)
      await user.type(screen.getByLabelText(/patient name/i), 'Jane')
      await user.click(screen.getByRole('button', { name: /save/i }))
      await screen.findByLabelText(/procedure name/i)
      expect(document.getElementById('datalist-procedure-names')).toBeInTheDocument()
      expect(document.getElementById('datalist-payers')).toBeInTheDocument()
    })
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
