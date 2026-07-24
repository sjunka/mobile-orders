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

export type ResolvedUtterance = { additions: CartAddition[]; unresolved: string[] }

/**
 * Resolves the response's references against the cached menu, same shape a tapped line takes.
 * A product id missing from the menu is reported as unresolved, not dropped silently, so the
 * guest can see something went unmatched and re-speak or tap it in by hand.
 */
export function resolveCartAdditions(response: UtteranceResponse, menu: Menu): ResolvedUtterance {
  const additions: CartAddition[] = []
  const unresolved = [...response.unresolved]

  for (const line of response.lines) {
    const product = menu.find((p) => p.id === line.productId)
    if (!product) {
      // No spoken phrase survives to this point for an unknown id — the backend already
      // resolved it to a productId. Report plainly rather than leak the raw id to the guest.
      unresolved.push('something')
      continue
    }

    const modifiers = line.modifierIds
      .map((modifierId) => product.modifiers.find((m) => m.id === modifierId))
      .filter((m): m is Modifier => m != null)

    additions.push({ product, modifiers, quantity: line.quantity })
  }

  return { additions, unresolved }
}
