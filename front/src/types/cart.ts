import type { Modifier, Product } from './menu'

/** One product plus its chosen modifiers and quantity, with its own price in cents. */
export type CartLine = {
  // Same product + same modifiers = same id, so re-adding merges instead of duplicating.
  id: string
  product: Product
  modifiers: Modifier[]
  quantity: number
  price: number
}
