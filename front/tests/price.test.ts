import { formatPrice } from '../src/utils/price'

describe('formatPrice', () => {
  it('formats cents as a dollar string', () => {
    expect(formatPrice(1250)).toBe('$12.50')
    expect(formatPrice(400)).toBe('$4.00')
    expect(formatPrice(0)).toBe('$0.00')
  })
})
