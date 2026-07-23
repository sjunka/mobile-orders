import { http, HttpResponse } from 'msw'

import { API_URL } from '../api/client'
import type { PaymentRequest } from '../types/order'
import { menu } from './menu-data'

export const handlers = [
  http.get(`${API_URL}/menu`, () => HttpResponse.json(menu)),

  // Mock payment: a card number ending in 0002 is declined, anything else is paid.
  http.post(`${API_URL}/payments`, async ({ request }) => {
    const { cardNumber, total } = (await request.json()) as PaymentRequest
    if (cardNumber.endsWith('0002')) {
      return HttpResponse.json({ message: 'Your card was declined.' }, { status: 402 })
    }
    return HttpResponse.json({ orderId: `ORD-${Date.now()}`, total })
  }),
]
