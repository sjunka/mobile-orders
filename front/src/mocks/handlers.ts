import { http, HttpResponse } from 'msw'

import { API_URL } from '../api/client'
import type { CreateOrderRequest, OrderLineRequest } from '../types/order'
import { menu } from './menu-data'

/** Mirrors the server: (base + Σ deltas) × quantity. Throws on an unknown reference. */
function priceLine(line: OrderLineRequest): number {
  const product = menu.find((p) => p.id === line.productId)
  if (!product) throw new Error('Something you ordered is no longer on the menu.')

  const withModifiers = line.modifierIds.reduce((price, modifierId) => {
    const modifier = product.modifiers.find((m) => m.id === modifierId)
    if (!modifier) throw new Error(`We could not find one of the options you chose for ${product.name}.`)
    return price + modifier.priceDelta
  }, product.basePrice)

  return withModifiers * line.quantity
}

export const handlers = [
  http.get(`${API_URL}/menu`, () => HttpResponse.json(menu)),

  // Mirrors POST /orders: the server prices the lines, then charges. A card
  // ending 0002 is declined. Every failure is a single readable message.
  http.post(`${API_URL}/orders`, async ({ request }) => {
    const { cardNumber, lines } = (await request.json()) as CreateOrderRequest

    if (!lines?.length) {
      return HttpResponse.json({ message: 'Your order is empty.' }, { status: 400 })
    }

    let total: number
    try {
      total = lines.reduce((sum, line) => sum + priceLine(line), 0)
    } catch (error) {
      return HttpResponse.json({ message: (error as Error).message }, { status: 400 })
    }

    if (cardNumber.endsWith('0002')) {
      return HttpResponse.json({ message: 'Your card was declined.' }, { status: 402 })
    }

    return HttpResponse.json({ orderId: `ORD-${Date.now()}`, total })
  }),
]
