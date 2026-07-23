/** Cents to a display string, e.g. 1250 -> "$12.50". */
export function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`
}
