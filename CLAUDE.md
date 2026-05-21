# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev          # start dev server (webpack, Serwist disabled)
pnpm build        # production build (generates public/sw.js via Serwist)
pnpm lint         # eslint
pnpm test         # vitest watch
pnpm test:run     # vitest single run (CI)
```

Run a single test file:
```bash
pnpm test lib/db.test.ts
```

## Architecture

**Recall** is a single-user, offline-first PWA for a doctor to track medical procedure billing. No backend — all data lives in the browser.

### Data flow

```
IndexedDB (idb)  ←→  lib/db.ts  ←→  lib/procedures.ts  ←→  components / pages
```

- `lib/types.ts` — single source of truth for `Procedure` and `ClaimStatus`
- `lib/db.ts` — raw IndexedDB access via `idb`; exports `getDB()` (singleton) and `resetDB()` (tests only)
- `lib/procedures.ts` — CRUD operations over `getDB()`
- `lib/pin.ts` — PIN auth via `crypto.subtle` SHA-256 + `localStorage`
- `lib/i18n.ts` — static translation maps (en / pt-BR); `DEFAULT_LANGUAGE` is `pt-BR`

### Auth layer

`PinGate` (client component) wraps the entire app in `app/layout.tsx`. On first visit it prompts PIN setup; on subsequent visits it prompts unlock. PIN hash stored in `localStorage` under key `recall_pin_hash`.

### i18n

`LanguageProvider` (client component) wraps the app and reads `localStorage` key `recall_language`. All UI strings come from `useTranslation()` → `t('key')`. Add new strings to the `Translations` interface in `lib/i18n.ts` and both locale objects.

### PWA / Service Worker

`app/sw.ts` is the Serwist service worker source. `next.config.ts` compiles it to `public/sw.js` at build time. Serwist is **disabled in development** (`NODE_ENV === 'development'`), so `public/sw.js` is a committed static file for the production build only.

### Component conventions

- `components/ui/` — shadcn/ui primitives (do not edit manually; use `shadcn add`)
- `components/molecules/` — single-concern display components
- `components/organisms/` — stateful or multi-concern components (forms, providers, guards)
- Path alias `@/` maps to repo root

### Testing

- Framework: Vitest + jsdom + Testing Library
- `vitest.setup.ts` — polyfills `fake-indexeddb` and an in-memory `localStorage`; `beforeEach` resets both
- `lib/test-utils.tsx` — `renderWithProviders()` wraps components with `LanguageProvider` forced to `en` for stable text matchers
- Tests call `resetDB()` indirectly via the `beforeEach` `new IDBFactory()` assignment; import it explicitly when a test needs to reset mid-run

### Key constraints

- `date` field stored as `YYYY-MM-DDTHH:MM` (datetime-local string), not a Date object
- Alert fires when `status === 'pending'` AND `new Date(date + reminderDays * 86400000) <= today`
- No server, no auth tokens, no external APIs — keep it that way
