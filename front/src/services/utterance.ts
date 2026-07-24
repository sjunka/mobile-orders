import { API_URL } from '../api/client'
import type { Menu, Modifier, Product } from '../types/menu'
import type { UtteranceResponse } from '../types/utterance'

/** Posts the recording as multipart form data — the one endpoint that isn't JSON. */
export async function sendUtterance(uri: string): Promise<UtteranceResponse> {
  const formData = new FormData()
  formData.append('audio', { uri, name: 'utterance.m4a', type: 'audio/m4a' } as unknown as Blob)

  const res = await fetch(`${API_URL}/utterances`, { method: 'POST', body: formData })
  if (!res.ok) throw new Error(`Request failed: ${res.status}`)
  return (await res.json()) as UtteranceResponse
}

export type CartAddition = { product: Product; modifiers: Modifier[]; quantity: number }

/** Resolves the response's references against the cached menu, same shape a tapped line takes. */
export function resolveCartAdditions(response: UtteranceResponse, menu: Menu): CartAddition[] {
  return response.lines.flatMap((line) => {
    const product = menu.find((p) => p.id === line.productId)
    if (!product) return []

    const modifiers = line.modifierIds
      .map((modifierId) => product.modifiers.find((m) => m.id === modifierId))
      .filter((m): m is Modifier => m != null)

    return [{ product, modifiers, quantity: line.quantity }]
  })
}
