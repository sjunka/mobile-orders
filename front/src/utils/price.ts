import type { Modifier } from '../types/menu'

/** Cents to a display string, e.g. 1250 -> "$12.50". */
export function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`
}

/** Line price in cents: (base + selected modifier deltas) × quantity. */
export function linePrice(basePrice: number, selected: Modifier[], quantity: number): number {
  const withMods = selected.reduce((sum, m) => sum + m.priceDelta, basePrice)
  return withMods * quantity
}
