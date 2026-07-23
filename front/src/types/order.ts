/** What checkout sends to the payment service. Total is in cents. */
export type PaymentRequest = {
  name: string
  email: string
  cardNumber: string
  total: number
}

/** A paid order. Declines come back as an error, not a status. */
export type Order = { orderId: string; total: number }
