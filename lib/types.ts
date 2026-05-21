export type ClaimStatus = 'pending' | 'paid'

export interface Procedure {
  id: string
  name: string
  date: string        // ISO date YYYY-MM-DD
  patientName: string
  payer: string
  status: ClaimStatus
  reminderDays: number
  createdAt: string   // ISO datetime
}
