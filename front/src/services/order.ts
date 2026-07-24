import { apiPost } from '../api/client'
import type { CartLine } from '../types/cart'
import type { CreateOrderRequest, Order, OrderLineRequest } from '../types/order'

export function createOrder(request: CreateOrderRequest): Promise<Order> {
  return apiPost<Order>('/orders', request)
}

/** A cart line, stripped down to the references the server prices. */
export function toOrderLines(lines: CartLine[]): OrderLineRequest[] {
  return lines.map((line) => ({
    productId: line.product.id,
    modifierIds: line.modifiers.map((modifier) => modifier.id),
    quantity: line.quantity,
  }))
}
