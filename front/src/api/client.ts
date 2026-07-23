// Repoint at the real backend by setting EXPO_PUBLIC_API_URL. MSW answers this
// host in dev, so the value only has to be a well-formed URL.
export const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000'

export async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`)
  if (!res.ok) throw new Error(`Request failed: ${res.status}`)
  return (await res.json()) as T
}
