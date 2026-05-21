# Recall PWA Setup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Scaffold a Next.js 15 TypeScript PWA with local-first IndexedDB storage, offline support via Serwist, and local PIN auth — deployable to Vercel Hobby.

**Architecture:** All data lives in IndexedDB on the user's device — no backend. Serwist provides offline caching via a service worker. A local PIN (hashed with Web Crypto API) gates access. Alerts fire on app-open when pending procedures exceed their per-procedure reminder threshold.

**Tech Stack:** Next.js 15 App Router, TypeScript, Tailwind v4, shadcn/ui, idb, Serwist, Vitest + Testing Library, zod + react-hook-form, pnpm, Vercel Hobby.

---

## Component Architecture: Atomic Design

```
components/
  ui/           ← atoms — shadcn primitives (auto-managed by CLI)
  molecules/    ← small composites built from atoms
  organisms/    ← complex sections with state/logic
```

Tests are co-located next to source files (`foo.test.ts` next to `foo.ts`).
Pages (`app/`) contain no components — only Next.js page exports.

---

## File Map

### Completed (Tasks 1–3)
| File | Status |
|------|--------|
| `lib/types.ts` | ✅ done |
| `lib/db.ts` + `lib/db.test.ts` | ✅ done |
| `lib/procedures.ts` + `lib/procedures.test.ts` | ✅ done |
| `vitest.config.ts`, `vitest.setup.ts` | ✅ done |

### Remaining
| File | Responsibility |
|------|----------------|
| `lib/pin.ts` | PIN hash/verify/store (Web Crypto + localStorage) |
| `lib/pin.test.ts` | PIN logic tests |
| `components/organisms/pin-gate.tsx` | Lock screen — PIN setup or unlock |
| `components/organisms/pin-gate.test.tsx` | PIN gate component tests |
| `components/organisms/serwist-register.tsx` | Registers service worker on mount |
| `components/organisms/nav.tsx` | Fixed bottom navigation bar |
| `components/organisms/pending-alert.tsx` | Alert banner for overdue procedures |
| `components/organisms/procedure-list.tsx` | Procedure list with status badges and mark-paid |
| `components/organisms/procedure-form.tsx` | Add/edit form — react-hook-form + zod |
| `components/organisms/procedure-form.test.tsx` | Form validation + submission tests |
| `components/molecules/procedure-card.tsx` | Single procedure row — card + badge + action |
| `app/manifest.ts` | PWA web app manifest |
| `app/sw.ts` | Serwist service worker source |
| `app/layout.tsx` | Root layout — PinGate + SerwistRegister + Nav |
| `app/page.tsx` | Dashboard — PendingAlert + ProcedureList |
| `app/procedures/new/page.tsx` | Add procedure route |
| `app/procedures/[id]/page.tsx` | Edit/delete procedure route |
| `app/settings/page.tsx` | Change PIN |
| `next.config.ts` | Serwist plugin + security headers |

---

### Task 4: PIN authentication

**Files:**
- Create: `lib/pin.ts`
- Create: `lib/pin.test.ts`
- Create: `components/organisms/pin-gate.tsx`
- Create: `components/organisms/pin-gate.test.tsx`

- [ ] **Step 1: Write failing tests for PIN logic**

Create `lib/pin.test.ts`:

```typescript
import { describe, it, expect, beforeEach } from 'vitest'
import { hashPin, setPin, verifyPin, hasPinSet, clearPin } from '@/lib/pin'

describe('PIN auth', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('hashPin returns a 64-char hex string', async () => {
    const hash = await hashPin('1234')
    expect(hash).toHaveLength(64)
    expect(hash).toMatch(/^[0-9a-f]+$/)
  })

  it('same PIN always produces same hash', async () => {
    expect(await hashPin('1234')).toBe(await hashPin('1234'))
  })

  it('different PINs produce different hashes', async () => {
    expect(await hashPin('1234')).not.toBe(await hashPin('5678'))
  })

  it('hasPinSet returns false when no PIN stored', () => {
    expect(hasPinSet()).toBe(false)
  })

  it('hasPinSet returns true after setPin', async () => {
    await setPin('1234')
    expect(hasPinSet()).toBe(true)
  })

  it('verifyPin returns true for correct PIN', async () => {
    await setPin('1234')
    expect(await verifyPin('1234')).toBe(true)
  })

  it('verifyPin returns false for wrong PIN', async () => {
    await setPin('1234')
    expect(await verifyPin('9999')).toBe(false)
  })

  it('clearPin removes stored hash', async () => {
    await setPin('1234')
    clearPin()
    expect(hasPinSet()).toBe(false)
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
pnpm test:run lib/pin.test.ts
```

Expected: FAIL — `Cannot find module '@/lib/pin'`

- [ ] **Step 3: Create lib/pin.ts**

```typescript
const PIN_KEY = 'recall_pin_hash'

export async function hashPin(pin: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(pin)
  const buffer = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

export async function setPin(pin: string): Promise<void> {
  const hash = await hashPin(pin)
  localStorage.setItem(PIN_KEY, hash)
}

export async function verifyPin(pin: string): Promise<boolean> {
  const stored = localStorage.getItem(PIN_KEY)
  if (!stored) return false
  return (await hashPin(pin)) === stored
}

export function hasPinSet(): boolean {
  return localStorage.getItem(PIN_KEY) !== null
}

export function clearPin(): void {
  localStorage.removeItem(PIN_KEY)
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
pnpm test:run lib/pin.test.ts
```

Expected: PASS — 8 tests passing

- [ ] **Step 5: Write failing tests for PinGate component**

Create `components/organisms/pin-gate.test.tsx`:

```typescript
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PinGate } from '@/components/organisms/pin-gate'

describe('PinGate', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('shows PIN setup form when no PIN is set', async () => {
    render(<PinGate><div>protected content</div></PinGate>)
    await screen.findByText(/set up your pin/i)
    expect(screen.queryByText('protected content')).not.toBeInTheDocument()
  })

  it('shows unlock form when PIN is already set', async () => {
    localStorage.setItem('recall_pin_hash', 'fakehash')
    render(<PinGate><div>protected content</div></PinGate>)
    await screen.findByText(/enter your pin/i)
    expect(screen.queryByText('protected content')).not.toBeInTheDocument()
  })

  it('unlocks and shows children after correct PIN setup', async () => {
    const user = userEvent.setup()
    render(<PinGate><div>protected content</div></PinGate>)
    await screen.findByText(/set up your pin/i)

    await user.type(screen.getByLabelText(/^pin$/i), '1234')
    await user.type(screen.getByLabelText(/confirm pin/i), '1234')
    await user.click(screen.getByRole('button', { name: /set pin/i }))

    await screen.findByText('protected content')
  })
})
```

- [ ] **Step 6: Run tests to verify they fail**

```bash
pnpm test:run components/organisms/pin-gate.test.tsx
```

Expected: FAIL — `Cannot find module '@/components/organisms/pin-gate'`

- [ ] **Step 7: Create components/organisms/pin-gate.tsx**

```typescript
'use client'

import { useState, useEffect, type ReactNode } from 'react'
import { hasPinSet, setPin, verifyPin } from '@/lib/pin'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

type State = 'loading' | 'setup' | 'locked' | 'unlocked'

export function PinGate({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>('loading')
  const [pin, setInputPin] = useState('')
  const [confirmPin, setConfirmPin] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    setState(hasPinSet() ? 'locked' : 'setup')
  }, [])

  async function handleSetup(e: React.FormEvent) {
    e.preventDefault()
    if (pin.length < 4) { setError('PIN must be at least 4 digits'); return }
    if (pin !== confirmPin) { setError('PINs do not match'); return }
    await setPin(pin)
    setState('unlocked')
  }

  async function handleUnlock(e: React.FormEvent) {
    e.preventDefault()
    if (await verifyPin(pin)) {
      setState('unlocked')
    } else {
      setError('Incorrect PIN')
      setInputPin('')
    }
  }

  if (state === 'loading') return null
  if (state === 'unlocked') return <>{children}</>

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>{state === 'setup' ? 'Set up your PIN' : 'Enter your PIN'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={state === 'setup' ? handleSetup : handleUnlock} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="pin">PIN</Label>
              <Input
                id="pin"
                type="password"
                inputMode="numeric"
                value={pin}
                onChange={(e) => { setInputPin(e.target.value); setError('') }}
                placeholder="Enter PIN"
                autoFocus
              />
            </div>
            {state === 'setup' && (
              <div className="space-y-2">
                <Label htmlFor="confirm-pin">Confirm PIN</Label>
                <Input
                  id="confirm-pin"
                  type="password"
                  inputMode="numeric"
                  value={confirmPin}
                  onChange={(e) => { setConfirmPin(e.target.value); setError('') }}
                  placeholder="Confirm PIN"
                />
              </div>
            )}
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full">
              {state === 'setup' ? 'Set PIN' : 'Unlock'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
```

- [ ] **Step 8: Run tests to verify they pass**

```bash
pnpm test:run components/organisms/pin-gate.test.tsx
```

Expected: PASS — 3 tests passing

- [ ] **Step 9: Run all tests to confirm nothing broken**

```bash
pnpm test:run
```

Expected: 11 tests passing (8 lib + 3 pin-gate)

- [ ] **Step 10: Commit**

```bash
git add lib/pin.ts lib/pin.test.ts components/organisms/pin-gate.tsx components/organisms/pin-gate.test.tsx
git commit -m "feat: add PIN authentication with Web Crypto and PinGate organism"
```

---

### Task 5: PWA manifest and Serwist offline support

**Files:**
- Create: `app/manifest.ts`
- Create: `app/sw.ts`
- Create: `components/organisms/serwist-register.tsx`
- Modify: `next.config.ts`
- Add: `public/icon-192x192.png`, `public/icon-512x512.png` (placeholder)

- [ ] **Step 1: Create app/manifest.ts**

```typescript
import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Recall — Medical Billing Tracker',
    short_name: 'Recall',
    description: 'Track medical procedures and pending insurance claims',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#0f172a',
    icons: [
      { src: '/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
  }
}
```

- [ ] **Step 2: Create app/sw.ts (Serwist service worker source)**

```typescript
import { defaultCache } from '@serwist/next/worker'
import type { PrecacheEntry, SerwistGlobalConfig } from 'serwist'
import { Serwist } from 'serwist'

declare global {
  interface ServiceWorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined
  }
}

declare const self: ServiceWorkerGlobalScope

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: defaultCache,
})

serwist.addEventListeners()
```

- [ ] **Step 3: Replace next.config.ts**

```typescript
import type { NextConfig } from 'next'
import withSerwistInit from '@serwist/next'

const withSerwist = withSerwistInit({
  swSrc: 'app/sw.ts',
  swDest: 'public/sw.js',
  disable: process.env.NODE_ENV === 'development',
})

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
      {
        source: '/sw.js',
        headers: [
          { key: 'Content-Type', value: 'application/javascript; charset=utf-8' },
          { key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate' },
          { key: 'Content-Security-Policy', value: "default-src 'self'; script-src 'self'" },
        ],
      },
    ]
  },
}

export default withSerwist(nextConfig)
```

- [ ] **Step 4: Create components/organisms/serwist-register.tsx**

```typescript
'use client'

import { useEffect } from 'react'

export function SerwistRegister() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js', { scope: '/', updateViaCache: 'none' })
        .catch(console.error)
    }
  }, [])
  return null
}
```

- [ ] **Step 5: Create placeholder icons**

```bash
node -e "
const fs = require('fs');
const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'base64');
fs.writeFileSync('public/icon-192x192.png', png);
fs.writeFileSync('public/icon-512x512.png', png);
console.log('Placeholder icons created. Replace before deploying.');
"
```

- [ ] **Step 6: Verify production build generates sw.js**

```bash
pnpm build
```

Expected: `public/sw.js` generated. Build completes with no errors.

- [ ] **Step 7: Commit**

```bash
git add app/manifest.ts app/sw.ts components/organisms/serwist-register.tsx next.config.ts public/
git commit -m "feat: add PWA manifest and Serwist offline service worker"
```

---

### Task 6: Root layout and bottom navigation

**Files:**
- Modify: `app/layout.tsx`
- Create: `components/organisms/nav.tsx`

- [ ] **Step 1: Create components/organisms/nav.tsx**

```typescript
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, PlusCircle, Settings } from 'lucide-react'

const links = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/procedures/new', label: 'Add', icon: PlusCircle },
  { href: '/settings', label: 'Settings', icon: Settings },
]

export function Nav() {
  const pathname = usePathname()
  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t bg-background flex justify-around py-2">
      {links.map(({ href, label, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          className={`flex flex-col items-center gap-1 px-4 py-1 text-xs ${
            pathname === href ? 'text-primary' : 'text-muted-foreground'
          }`}
        >
          <Icon className="h-5 w-5" />
          {label}
        </Link>
      ))}
    </nav>
  )
}
```

- [ ] **Step 2: Replace app/layout.tsx**

```typescript
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { PinGate } from '@/components/organisms/pin-gate'
import { SerwistRegister } from '@/components/organisms/serwist-register'
import { Nav } from '@/components/organisms/nav'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Recall',
  description: 'Medical billing tracker for doctors',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SerwistRegister />
        <PinGate>
          <div className="pb-16">{children}</div>
          <Nav />
        </PinGate>
      </body>
    </html>
  )
}
```

- [ ] **Step 3: Verify dev server renders**

```bash
pnpm dev
```

Open http://localhost:3000. Expected: PIN setup screen renders, no console errors.

- [ ] **Step 4: Commit**

```bash
git add app/layout.tsx components/organisms/nav.tsx
git commit -m "feat: add root layout with PIN gate and bottom navigation"
```

---

### Task 7: Dashboard — pending alert, procedure card, procedure list

**Files:**
- Modify: `app/page.tsx`
- Create: `components/molecules/procedure-card.tsx`
- Create: `components/organisms/pending-alert.tsx`
- Create: `components/organisms/procedure-list.tsx`

Note: `ProcedureCard` (molecule) is extracted from `ProcedureList` to keep the organism composable and testable.

- [ ] **Step 1: Create components/molecules/procedure-card.tsx**

```typescript
'use client'

import Link from 'next/link'
import { CheckCircle2 } from 'lucide-react'
import type { Procedure } from '@/lib/types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

interface ProcedureCardProps {
  procedure: Procedure
  onMarkPaid: (id: string) => void
}

export function ProcedureCard({ procedure: p, onMarkPaid }: ProcedureCardProps) {
  return (
    <Card>
      <CardContent className="pt-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <Link
              href={`/procedures/${p.id}`}
              className="font-medium hover:underline truncate block"
            >
              {p.name}
            </Link>
            <p className="text-sm text-muted-foreground">{p.patientName}</p>
            <p className="text-sm text-muted-foreground">
              {p.payer} · {p.date}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Badge variant={p.status === 'paid' ? 'secondary' : 'destructive'}>
              {p.status}
            </Badge>
            {p.status === 'pending' && (
              <Button
                size="icon"
                variant="ghost"
                onClick={() => onMarkPaid(p.id)}
                aria-label="Mark as paid"
              >
                <CheckCircle2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
```

- [ ] **Step 2: Create components/organisms/pending-alert.tsx**

```typescript
'use client'

import { useEffect, useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { getOverdueProcedures } from '@/lib/procedures'
import type { Procedure } from '@/lib/types'

export function PendingAlert() {
  const [overdue, setOverdue] = useState<Procedure[]>([])

  useEffect(() => {
    getOverdueProcedures().then(setOverdue)
  }, [])

  if (overdue.length === 0) return null

  return (
    <Alert variant="destructive" className="mb-4">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Payment Reminder</AlertTitle>
      <AlertDescription>
        {overdue.length === 1
          ? '1 procedure is past its claim deadline.'
          : `${overdue.length} procedures are past their claim deadline.`}
      </AlertDescription>
    </Alert>
  )
}
```

- [ ] **Step 3: Create components/organisms/procedure-list.tsx**

```typescript
'use client'

import { useEffect, useState } from 'react'
import { getAllProcedures, updateProcedure } from '@/lib/procedures'
import type { Procedure } from '@/lib/types'
import { ProcedureCard } from '@/components/molecules/procedure-card'

export function ProcedureList() {
  const [procedures, setProcedures] = useState<Procedure[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAllProcedures()
      .then((data) => setProcedures(data.sort((a, b) => b.date.localeCompare(a.date))))
      .finally(() => setLoading(false))
  }, [])

  async function markAsPaid(id: string) {
    await updateProcedure(id, { status: 'paid' })
    setProcedures((prev) => prev.map((p) => (p.id === id ? { ...p, status: 'paid' } : p)))
  }

  if (loading) return <p className="text-muted-foreground text-sm">Loading...</p>

  if (procedures.length === 0)
    return (
      <p className="text-muted-foreground text-sm text-center py-8">
        No procedures yet. Tap + to add one.
      </p>
    )

  return (
    <ul className="space-y-3">
      {procedures.map((p) => (
        <li key={p.id}>
          <ProcedureCard procedure={p} onMarkPaid={markAsPaid} />
        </li>
      ))}
    </ul>
  )
}
```

- [ ] **Step 4: Replace app/page.tsx**

```typescript
import { PendingAlert } from '@/components/organisms/pending-alert'
import { ProcedureList } from '@/components/organisms/procedure-list'

export default function DashboardPage() {
  return (
    <main className="container mx-auto px-4 py-6 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Recall</h1>
      <PendingAlert />
      <ProcedureList />
    </main>
  )
}
```

- [ ] **Step 5: Verify in browser**

```bash
pnpm dev
```

Open http://localhost:3000, complete PIN setup. Expected: empty list with "No procedures yet" message.

- [ ] **Step 6: Commit**

```bash
git add app/page.tsx components/molecules/procedure-card.tsx components/organisms/pending-alert.tsx components/organisms/procedure-list.tsx
git commit -m "feat: add dashboard with pending alert, procedure card, and procedure list"
```

---

### Task 8: Add and edit procedure

**Files:**
- Create: `components/organisms/procedure-form.tsx`
- Create: `components/organisms/procedure-form.test.tsx`
- Create: `app/procedures/new/page.tsx`
- Create: `app/procedures/[id]/page.tsx`

- [ ] **Step 1: Write failing tests for ProcedureForm**

Create `components/organisms/procedure-form.test.tsx`:

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ProcedureForm } from '@/components/organisms/procedure-form'
import { resetDB } from '@/lib/db'

describe('ProcedureForm', () => {
  beforeEach(() => {
    resetDB()
  })

  it('renders all required fields', () => {
    render(<ProcedureForm onSuccess={vi.fn()} />)
    expect(screen.getByLabelText(/procedure name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/patient name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/payer/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/date/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/reminder days/i)).toBeInTheDocument()
  })

  it('shows validation error when submitted empty', async () => {
    const user = userEvent.setup()
    render(<ProcedureForm onSuccess={vi.fn()} />)
    await user.click(screen.getByRole('button', { name: /save/i }))
    await screen.findByText(/procedure name is required/i)
  })

  it('calls onSuccess after valid submission', async () => {
    const user = userEvent.setup()
    const onSuccess = vi.fn()
    render(<ProcedureForm onSuccess={onSuccess} />)

    await user.type(screen.getByLabelText(/procedure name/i), 'Consultation')
    await user.type(screen.getByLabelText(/patient name/i), 'Jane Doe')
    await user.type(screen.getByLabelText(/payer/i), 'Unimed')
    await user.type(screen.getByLabelText(/date/i), '2026-01-15')
    await user.clear(screen.getByLabelText(/reminder days/i))
    await user.type(screen.getByLabelText(/reminder days/i), '30')
    await user.click(screen.getByRole('button', { name: /save/i }))

    await waitFor(() => expect(onSuccess).toHaveBeenCalledOnce())
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
pnpm test:run components/organisms/procedure-form.test.tsx
```

Expected: FAIL — `Cannot find module '@/components/organisms/procedure-form'`

- [ ] **Step 3: Create components/organisms/procedure-form.tsx**

```typescript
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { addProcedure, updateProcedure } from '@/lib/procedures'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

const schema = z.object({
  name: z.string().min(1, 'Procedure name is required'),
  patientName: z.string().min(1, 'Patient name is required'),
  payer: z.string().min(1, 'Payer is required'),
  date: z.string().min(1, 'Date is required'),
  reminderDays: z.coerce.number().int().min(1, 'Must be at least 1 day'),
})

type FormValues = z.infer<typeof schema>

interface ProcedureFormProps {
  defaultValues?: Partial<FormValues>
  procedureId?: string
  onSuccess: () => void
}

export function ProcedureForm({ defaultValues, procedureId, onSuccess }: ProcedureFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', patientName: '', payer: '', date: '', reminderDays: 30, ...defaultValues },
  })

  async function onSubmit(values: FormValues) {
    if (procedureId) {
      await updateProcedure(procedureId, values)
    } else {
      await addProcedure({ ...values, status: 'pending' })
    }
    onSuccess()
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Procedure Name</FormLabel>
              <FormControl><Input placeholder="e.g. Consultation" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="patientName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Patient Name</FormLabel>
              <FormControl><Input placeholder="e.g. John Doe" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="payer"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Payer</FormLabel>
              <FormControl><Input placeholder="e.g. Unimed" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date</FormLabel>
              <FormControl><Input type="date" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="reminderDays"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reminder Days</FormLabel>
              <FormControl><Input type="number" min={1} {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? 'Saving...' : 'Save'}
        </Button>
      </form>
    </Form>
  )
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
pnpm test:run components/organisms/procedure-form.test.tsx
```

Expected: PASS — 3 tests passing

- [ ] **Step 5: Create app/procedures/new/page.tsx**

```typescript
'use client'

import { useRouter } from 'next/navigation'
import { ProcedureForm } from '@/components/organisms/procedure-form'

export default function NewProcedurePage() {
  const router = useRouter()
  return (
    <main className="container mx-auto px-4 py-6 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Add Procedure</h1>
      <ProcedureForm onSuccess={() => router.push('/')} />
    </main>
  )
}
```

- [ ] **Step 6: Create app/procedures/[id]/page.tsx**

```typescript
'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { getProcedure, deleteProcedure } from '@/lib/procedures'
import type { Procedure } from '@/lib/types'
import { ProcedureForm } from '@/components/organisms/procedure-form'
import { Button } from '@/components/ui/button'

export default function EditProcedurePage() {
  const params = useParams()
  const router = useRouter()
  const [procedure, setProcedure] = useState<Procedure | null>(null)

  useEffect(() => {
    getProcedure(params.id as string).then((p) => {
      if (!p) router.push('/')
      else setProcedure(p)
    })
  }, [params.id, router])

  async function handleDelete() {
    if (!procedure || !confirm('Delete this procedure?')) return
    await deleteProcedure(procedure.id)
    router.push('/')
  }

  if (!procedure) return null

  return (
    <main className="container mx-auto px-4 py-6 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Edit Procedure</h1>
      <ProcedureForm
        procedureId={procedure.id}
        defaultValues={{
          name: procedure.name,
          patientName: procedure.patientName,
          payer: procedure.payer,
          date: procedure.date,
          reminderDays: procedure.reminderDays,
        }}
        onSuccess={() => router.push('/')}
      />
      <Button variant="destructive" className="w-full mt-4" onClick={handleDelete}>
        Delete Procedure
      </Button>
    </main>
  )
}
```

- [ ] **Step 7: Verify full add/edit/delete flow in browser**

```bash
pnpm dev
```

Check: add procedure → appears in list → mark paid → edit → delete.

- [ ] **Step 8: Commit**

```bash
git add components/organisms/procedure-form.tsx components/organisms/procedure-form.test.tsx app/procedures/
git commit -m "feat: add procedure add/edit/delete form and routes"
```

---

### Task 9: Settings page (change PIN)

**Files:**
- Create: `app/settings/page.tsx`

- [ ] **Step 1: Create app/settings/page.tsx**

```typescript
'use client'

import { useState } from 'react'
import { verifyPin, setPin } from '@/lib/pin'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function SettingsPage() {
  const [currentPin, setCurrentPin] = useState('')
  const [newPin, setNewPin] = useState('')
  const [confirmPin, setConfirmPin] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  async function handleChangePin(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSuccess(false)

    if (!(await verifyPin(currentPin))) { setError('Current PIN is incorrect'); return }
    if (newPin.length < 4) { setError('New PIN must be at least 4 digits'); return }
    if (newPin !== confirmPin) { setError('New PINs do not match'); return }

    await setPin(newPin)
    setCurrentPin('')
    setNewPin('')
    setConfirmPin('')
    setSuccess(true)
  }

  return (
    <main className="container mx-auto px-4 py-6 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      <Card>
        <CardHeader><CardTitle>Change PIN</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleChangePin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-pin">Current PIN</Label>
              <Input
                id="current-pin"
                type="password"
                inputMode="numeric"
                value={currentPin}
                onChange={(e) => setCurrentPin(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-pin">New PIN</Label>
              <Input
                id="new-pin"
                type="password"
                inputMode="numeric"
                value={newPin}
                onChange={(e) => setNewPin(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-new-pin">Confirm New PIN</Label>
              <Input
                id="confirm-new-pin"
                type="password"
                inputMode="numeric"
                value={confirmPin}
                onChange={(e) => setConfirmPin(e.target.value)}
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            {success && <p className="text-sm text-green-600">PIN changed successfully.</p>}
            <Button type="submit" className="w-full">Change PIN</Button>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}
```

- [ ] **Step 2: Run all tests**

```bash
pnpm test:run
```

Expected: all tests pass.

- [ ] **Step 3: Commit**

```bash
git add app/settings/page.tsx
git commit -m "feat: add settings page with PIN change"
```

---

### Task 10: Production build and Vercel deployment

- [ ] **Step 1: Run production build**

```bash
pnpm build
```

Expected: `public/sw.js` generated. No type errors.

- [ ] **Step 2: Replace placeholder icons**

Go to https://realfavicongenerator.net/, generate icons, replace:
- `public/icon-192x192.png`
- `public/icon-512x512.png`

- [ ] **Step 3: Push to GitHub and deploy on Vercel**

```bash
git push origin main
```

In Vercel dashboard:
1. Import the GitHub repository
2. Framework: **Next.js** (auto-detected)
3. Package manager: **pnpm** (auto-detected from `pnpm-lock.yaml`)
4. Node version: **24.x** (set in project settings to match `.node-version`)
5. No environment variables needed
6. Deploy

- [ ] **Step 4: Verify PWA installability on mobile**

Open deployed URL on mobile. Check:
- "Add to Home Screen" prompt appears
- Installed app opens in standalone mode
- App loads offline after first visit

- [ ] **Step 5: Final commit**

```bash
git add public/icon-192x192.png public/icon-512x512.png
git commit -m "chore: add production PWA icons"
```
