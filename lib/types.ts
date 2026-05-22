export type ClaimStatus = 'pending' | 'paid' | 'partial_denial' | 'full_denial'

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
  updatedAt: string   // ISO datetime — last-write-wins sync key
  deletedAt: string | null  // soft-delete tombstone; null = active
  syncedAt: string | null   // null = dirty (needs push); matches updatedAt when clean
}
