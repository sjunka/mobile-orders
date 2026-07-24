import { apiGet, apiPost } from '../api/client'
import type { CartLine } from '../types/cart'
import type {
  CreateOrderRequest,
  OperatorOrder,
  Order,
  OrderLineRequest,
} from '../types/order'

export function createOrder(request: CreateOrderRequest): Promise<Order> {
  return apiPost<Order>('/orders', request)
}

/** Every order the backend holds, guest identity included. The operator screen. */
export function listOrders(): Promise<OperatorOrder[]> {
  return apiGet<OperatorOrder[]>('/orders')
}

/** A cart line, stripped down to the references the server prices. */
export function toOrderLines(lines: CartLine[]): OrderLineRequest[] {
  return lines.map((line) => ({
    productId: line.product.id,
    modifierIds: line.modifiers.map((modifier) => modifier.id),
    quantity: line.quantity,
  }))
}
