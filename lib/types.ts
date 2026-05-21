export type ClaimStatus = 'pending' | 'paid' | 'snoozed'

export interface Procedure {
  id: string
  name: string
  date: string        // datetime-local YYYY-MM-DDTHH:MM
  patientName: string
  payer: string
  status: ClaimStatus
  reminderDays: number
  createdAt: string     // ISO datetime
  snoozedUntil?: string // YYYY-MM-DD, only set when status === 'snoozed'
}
