import type { Procedure } from './types'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? ''

type ProcedureDTO = Omit<Procedure, 'syncedAt'>

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const token = localStorage.getItem('recall_access_token')
  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init?.headers,
    },
  })
  // TODO Phase 3: on 401, attempt silent token refresh via refreshAccessToken()
  // then retry the original request once before propagating the error.
  if (!res.ok) throw new Error(`API ${res.status}: ${path}`)
  return res.json()
}

export async function login(
  email: string,
  password: string
): Promise<{ accessToken: string; refreshToken: string; expiresAt: string }> {
  return request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
}

export async function refreshAccessToken(
  refreshToken: string
): Promise<{ accessToken: string; expiresAt: string }> {
  return request('/auth/refresh', {
    method: 'POST',
    body: JSON.stringify({ refreshToken }),
  })
}

export async function syncProcedures(
  procedures: ProcedureDTO[]
): Promise<ProcedureDTO[]> {
  const { procedures: result } = await request<{ procedures: ProcedureDTO[] }>(
    '/procedures/sync',
    { method: 'POST', body: JSON.stringify({ procedures }) }
  )
  return result
}
