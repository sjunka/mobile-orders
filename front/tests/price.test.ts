import type { Modifier } from '../src/types/menu'
import { formatPrice, linePrice } from '../src/utils/price'

describe('formatPrice', () => {
  it('formats cents as a dollar string', () => {
    expect(formatPrice(1250)).toBe('$12.50')
    expect(formatPrice(400)).toBe('$4.00')
    expect(formatPrice(0)).toBe('$0.00')
  })
})

const cheese: Modifier = { id: 'cheese', label: 'Cheese', priceDelta: 100 }
const bacon: Modifier = { id: 'bacon', label: 'Bacon', priceDelta: 200 }

describe('linePrice', () => {
  it('is the base price with no modifiers', () => {
    expect(linePrice(950, [], 1)).toBe(950)
  })

  it('adds selected modifier deltas', () => {
    expect(linePrice(950, [cheese, bacon], 1)).toBe(1250)
  })

  it('multiplies by quantity', () => {
    expect(linePrice(950, [cheese], 3)).toBe(3150)
  })
})
