import { http, HttpResponse } from 'msw'

import { API_URL } from '../api/client'
import type { CreateOrderRequest, OperatorOrder, OrderLineRequest } from '../types/order'
import { linePrice } from '../utils/price'
import { menu } from './menu-data'

/** Mirrors the server: resolve the references, then price them. Throws on an unknown one. */
function priceLine(line: OrderLineRequest): number {
  const product = menu.find((p) => p.id === line.productId)
  if (!product) throw new Error('Something you ordered is no longer on the menu.')

  const modifiers = line.modifierIds.map((modifierId) => {
    const modifier = product.modifiers.find((m) => m.id === modifierId)
    if (!modifier)
      throw new Error(`We could not find one of the options you chose for ${product.name}.`)
    return modifier
  })

  return linePrice(product.basePrice, modifiers, line.quantity)
}

// Orders the mock has been posted, so the operator screen has something to list
// with no backend running. Dies with the reload, same as the real in-memory store.
const placed: OperatorOrder[] = []

export const handlers = [
  http.get(`${API_URL}/menu`, () => HttpResponse.json(menu)),

  // Real backend transcribes and matches; the mock has nothing to match against,
  // so it resolves nothing. Tests that need matched lines override this.
  http.post(`${API_URL}/utterances`, () => HttpResponse.json({ lines: [], unresolved: [] })),

  http.get(`${API_URL}/orders`, () => HttpResponse.json(placed)),

  // Mirrors POST /orders: the server prices the lines, then charges. A card
  // ending 0002 is declined. Every failure is a single readable message.
  http.post(`${API_URL}/orders`, async ({ request }) => {
    const { name, email, cardNumber, lines } = (await request.json()) as CreateOrderRequest

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

    const orderId = `ORD-${placed.length + 1}`
    placed.push({ orderId, guest: { name, email }, total, lines, status: 'paid' })

    // The guest gets the id and the total — never the stored lines.
    return HttpResponse.json({ orderId, total })
  }),

  // Mirrors POST /orders/:orderId/cancel: idempotent, not-found on an unknown id.
  http.post(`${API_URL}/orders/:orderId/cancel`, ({ params }) => {
    const order = placed.find((candidate) => candidate.orderId === params.orderId)
    if (!order) {
      return HttpResponse.json({ message: 'We could not find that order.' }, { status: 404 })
    }
    order.status = 'cancelled'
    return HttpResponse.json(order)
  }),
]
