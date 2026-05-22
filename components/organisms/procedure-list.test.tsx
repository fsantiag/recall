import { describe, it, expect, beforeEach } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '@/lib/test-utils'
import { addProcedure } from '@/lib/procedures'
import { resetDB } from '@/lib/db'
import { ProcedureList } from './procedure-list'

const BASE = {
  name: 'Appendectomy',
  patientName: 'João Silva',
  payer: 'Unimed',
  location: 'Hospital São Lucas',
  honoraryType: 'Surgeon',
  date: '2026-05-01T10:00',
  status: 'pending' as const,
  reminderDays: 7,
}

const PROC2 = {
  ...BASE,
  name: 'Consultation',
  patientName: 'Maria Costa',
  payer: 'Bradesco',
  location: 'Clínica Norte',
  honoraryType: 'Anesthesiologist',
}

beforeEach(async () => {
  resetDB()
  await addProcedure(BASE)
  await addProcedure(PROC2)
})

describe('ProcedureList search', () => {
  it('renders search input', async () => {
    renderWithProviders(<ProcedureList />)
    expect(await screen.findByPlaceholderText(/search procedures/i)).toBeInTheDocument()
  })

  it('filters by procedure name', async () => {
    renderWithProviders(<ProcedureList />)
    const input = await screen.findByPlaceholderText(/search procedures/i)
    await userEvent.type(input, 'append')
    await waitFor(() => {
      expect(screen.getByText('Appendectomy')).toBeInTheDocument()
      expect(screen.queryByText('Consultation')).not.toBeInTheDocument()
    })
  })

  it('filters by patient name', async () => {
    renderWithProviders(<ProcedureList />)
    const input = await screen.findByPlaceholderText(/search procedures/i)
    await userEvent.type(input, 'maria')
    await waitFor(() => {
      expect(screen.getByText('Maria Costa')).toBeInTheDocument()
      expect(screen.queryByText('João Silva')).not.toBeInTheDocument()
    })
  })

  it('filters by payer', async () => {
    renderWithProviders(<ProcedureList />)
    const input = await screen.findByPlaceholderText(/search procedures/i)
    await userEvent.type(input, 'bradesco')
    await waitFor(() => {
      expect(screen.getByText('Consultation')).toBeInTheDocument()
      expect(screen.queryByText('Appendectomy')).not.toBeInTheDocument()
    })
  })

  it('filters by localized month name', async () => {
    renderWithProviders(<ProcedureList />)
    const input = await screen.findByPlaceholderText(/search procedures/i)
    await userEvent.type(input, 'may')
    await waitFor(() => {
      expect(screen.getByText('Appendectomy')).toBeInTheDocument()
      expect(screen.getByText('Consultation')).toBeInTheDocument()
    })
  })

  it('shows no-results message when nothing matches', async () => {
    renderWithProviders(<ProcedureList />)
    const input = await screen.findByPlaceholderText(/search procedures/i)
    await userEvent.type(input, 'zzznomatch')
    await waitFor(() => {
      expect(screen.getByText(/no results for/i)).toBeInTheDocument()
    })
  })

  it('clears query when X button clicked', async () => {
    renderWithProviders(<ProcedureList />)
    const input = await screen.findByPlaceholderText(/search procedures/i)
    await userEvent.type(input, 'append')
    await waitFor(() => screen.getByRole('button', { name: /clear search/i }))
    await userEvent.click(screen.getByRole('button', { name: /clear search/i }))
    await waitFor(() => {
      expect(screen.getByText('Appendectomy')).toBeInTheDocument()
      expect(screen.getByText('Consultation')).toBeInTheDocument()
    })
  })
})
