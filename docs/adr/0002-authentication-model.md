# ADR 0002 — Authentication Model

## Status
Accepted

## Context

Recall stores medical procedure data locally. Currently a PIN gates access to local data. Adding a backend requires a server identity credential. The offline-first constraint means the app must remain accessible without network connectivity.

## Decision

### Two independent auth concerns

| Concern | Mechanism | Required |
|---------|-----------|----------|
| Server identity / sync | Email + password → JWT (access + refresh tokens) | Yes, for sync |
| Local device lock | WebAuthn platform authenticator (fingerprint / Face ID) | Optional |

These are decoupled. Biometric enrollment is offered after first login but can be skipped. Tokens control sync access; biometric controls device-level access.

### Token model

- **Access token**: short-lived (e.g. 1h). Used in `Authorization: Bearer` header on all API calls.
- **Refresh token**: long-lived (e.g. 30d). Used silently to obtain a new access token when the access token expires.
- Both stored in `localStorage`.
- When both tokens are expired, re-authentication (email + password) is required to sync. Local data remains accessible.

### Session behaviour

| Biometric enrolled | Token state | App open behaviour |
|-------------------|-------------|-------------------|
| No | Valid | Opens directly |
| No | Both expired | Email + password form |
| Yes | Valid | Biometric prompt → open |
| Yes | Both expired | Biometric prompt → open (local only) + banner to re-auth for sync |

### Offline behaviour

The app is always accessible offline regardless of token state. Mutations are queued locally. Sync fires automatically when the device comes back online and tokens are valid.

### New device bootstrap

First open on a new device requires email + password (online). After successful login, biometric enrollment is offered. Until biometric is enrolled, the app opens directly if tokens are valid.

### PIN removal

The existing `lib/pin.ts` and `PinGate` component are removed. `lib/auth.ts` replaces them with the two-concern model above.

## Consequences

- `lib/pin.ts` is deleted.
- `PinGate` component is deleted.
- `lib/auth.ts` is created with: `login()`, `logout()`, `refreshToken()`, `checkSession()`, `enrollBiometric()`, `checkBiometric()`, `verifyBiometric()`.
- `app/layout.tsx` replaces `PinGate` with a new `AuthGate` component.
- A login screen (email + password form) is needed.
- A biometric enrollment prompt is needed (post-login, skippable).
