// Repoint at the real backend by setting EXPO_PUBLIC_API_URL. MSW answers this
// host in Jest, so the value only has to be a well-formed URL there.
export const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000'

export async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`)
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
