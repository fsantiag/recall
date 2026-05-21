# Recall — Domain Context

## Core Purpose

Track medical procedures, their dates, and which health insurance/payer is responsible for payment. Alert the doctor to claim pending payments when the reminder threshold is reached.

## Glossary

| Term | Definition |
|------|------------|
| **Procedure** | A medical act performed by the doctor, with a date, patient, payer, and claim state |
| **Payer** | The health insurance company or entity responsible for paying a procedure |
| **Pending** | A procedure whose payment has not yet been claimed |
| **Paid** | A procedure whose payment has been confirmed by the doctor |
| **Reminder threshold** | The number of days after a procedure date at which an alert fires (`reminderDays` field) |

## Data Model

### Procedure

| Field | Type | Notes |
|-------|------|-------|
| `id` | string | auto-generated |
| `name` | string | procedure description |
| `date` | date | when performed |
| `patientName` | string | patient reference |
| `payer` | string | insurance / entity name |
| `status` | `pending` \| `paid` | claim state |
| `reminderDays` | number | days after `date` to trigger alert |
| `createdAt` | date | record creation timestamp |

### Alert Logic

Fire an in-app alert on launch when: `status === 'pending'` AND `date + reminderDays ≤ today`.

## Architecture Decisions

| Decision | Choice | Reason |
|----------|--------|--------|
| Framework | Next.js (App Router) + React | Current standard, Vercel-native |
| Language | TypeScript | Type safety for medical/financial data |
| Styling | Tailwind CSS v4 + shadcn/ui | Covers tables, forms, dialogs, badges out of the box |
| Package manager | pnpm | Fastest, Vercel auto-detects |
| Data persistence | IndexedDB (local-first) | Single device, offline-first, no backend needed |
| Offline support | Serwist | Official Next.js recommendation for offline PWA |
| Auth | Local PIN (Web Crypto API, hashed) | Medical data sensitivity, no server needed |
| Notifications | In-app alerts on launch only | No server needed, sufficient for MVP |
| Deployment | Vercel Hobby (free tier) | Personal, non-commercial use |
| Users | Single user | MVP scope |
| Claim states | `pending` → `paid` | Doctor marks paid on receipt of payment |
| Reminder config | Per-procedure (`reminderDays` field) | Different payers have different deadlines |
