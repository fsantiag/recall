import type { Procedure } from './types'

const cache: Record<string, Procedure> = {}

export const procedureCache = {
  set: (p: Procedure) => { cache[p.id] = p },
  get: (id: string): Procedure | undefined => cache[id],
}
