// Repoint at the real backend by setting EXPO_PUBLIC_API_URL. MSW answers this
// host in dev, so the value only has to be a well-formed URL.
export const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000'

export async function apiGet<T>(path: string): Promise<T> {
  console.log('[api] GET', `${API_URL}${path}`)
  const res = await fetch(`${API_URL}${path}`).catch((e) => {
    console.log('[api] fetch threw', String(e))
    throw e
  })
  console.log('[api] status', res.status, res.url)
  if (!res.ok) throw new Error(`Request failed: ${res.status}`)
  return (await res.json()) as T
}

export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    // A declined payment carries the message the guest should read.
    const message = await res
      .json()
      .then((b: { message?: string }) => b.message)
      .catch(() => undefined)
    throw new Error(message ?? `Request failed: ${res.status}`)
  }
  return (await res.json()) as T
}
