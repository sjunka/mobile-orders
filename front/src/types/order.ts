/**
 * One line of an order as the server wants it: references only, no price. The
 * server prices it against its own menu — see `back/docs/adr/0002`.
 */
export type OrderLineRequest = {
  productId: string
  modifierIds: string[]
  quantity: number
}

/** What checkout sends to create an order. Carries no total, by design. */
export type CreateOrderRequest = {
  name: string
  email: string
  cardNumber: string
  lines: OrderLineRequest[]
}

/** A paid order, priced by the server. Declines come back as an error, not a status. */
export type Order = { orderId: string; total: number }

/**
 * An order as the operator list returns it: guest identity included, lines still
 * references only. Unauthenticated — see `back/docs/adr/0003`.
 */
export type OperatorOrder = {
  orderId: string
  guest: { name: string; email: string }
  total: number
  lines: OrderLineRequest[]
  status: 'paid'
}
