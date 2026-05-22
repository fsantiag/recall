# ADR 0001 — Offline-First Sync Strategy

## Status
Accepted

## Context

Recall is a PWA used by a single doctor across potentially multiple devices. All data currently lives in IndexedDB with no backend. Adding a backend introduces the need for a sync strategy that handles offline mutations, multi-device convergence, and record deletion.

## Decision

### Conflict resolution: Last-Write-Wins via `updatedAt`

Every `Procedure` record carries an `updatedAt` ISO timestamp. When two versions of the same record exist (local vs server), the one with the later `updatedAt` wins. No manual conflict resolution UI.

**Why:** The doctor is a single user unlikely to edit the same record on two devices simultaneously. LWW is simple, requires no extra UI, and data loss risk is acceptable for a status-tracking app (not a source of financial truth).

### Sync trigger: push-on-mutation + pull-on-open/reconnect

- Every local mutation immediately attempts a push to the backend.
- On app open and on `online` event, a full pull is performed.
- If offline at mutation time, the record is marked dirty in IndexedDB and pushed when connectivity resumes.

**Why:** Tightest possible sync window when online. Offline queue is just dirty records in the existing IndexedDB store — no separate queue to manage.

### Delete strategy: soft delete via `deletedAt` tombstone

Deletion sets `deletedAt = now` on the record. Hard delete is never used. All reads filter `deletedAt !== null`. Tombstones are synced to the backend and to other devices.

**Why:** Hard deletes cannot be synced — there is nothing to push. A tombstone tells the backend and other devices to remove the record. Without tombstones, a deleted record re-appears on the next pull from a device that hasn't synced the deletion.

### Sync API: single push/pull endpoint

```
POST /procedures/sync
Body:  { procedures: Procedure[] }   ← all dirty local records
Response: { procedures: Procedure[] } ← server's merged state after LWW
```

One round-trip per sync. Client pushes dirty, server applies LWW, returns full truth.

## Consequences

- `Procedure` gains `updatedAt: string` and `deletedAt: string | null` fields.
- `lib/procedures.ts` must set `updatedAt = now` on every mutation and set `deletedAt` instead of hard deleting.
- All reads must filter out `deletedAt !== null` records.
- IndexedDB schema version bumps to accommodate the new fields. `getDirtyProcedures()` uses a full `getAll()` + JS filter rather than an index (acceptable at current scale; a `by-syncedAt` index is a future optimisation if sync runs frequently).
- A new `lib/sync.ts` module owns the push/pull logic and dirty-record tracking.
