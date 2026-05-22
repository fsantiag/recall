export type ClaimStatus = 'pending' | 'paid'

export interface Procedure {
  id: string
  name: string
  date: string        // datetime-local YYYY-MM-DDTHH:MM
  patientName: string
  payer: string
  location: string
  honoraryType: string
  status: ClaimStatus
  reminderDays: number
  createdAt: string   // ISO datetime
}
