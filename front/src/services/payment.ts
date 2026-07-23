import { apiPost } from '../api/client'
import type { Order, PaymentRequest } from '../types/order'

export function pay(request: PaymentRequest): Promise<Order> {
  return apiPost<Order>('/payments', request)
}
