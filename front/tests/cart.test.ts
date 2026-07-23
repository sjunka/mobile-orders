import { useCart } from '../src/store/cart'
import type { Product } from '../src/types/menu'
import { cartTotal } from '../src/utils/price'

const cheese = { id: 'cheese', label: 'Cheese', priceDelta: 100 }
const bacon = { id: 'bacon', label: 'Bacon', priceDelta: 200 }

const burger: Product = {
  id: 'burger',
  name: 'Classic Burger',
  basePrice: 950,
  modifiers: [cheese, bacon],
}

const fries: Product = { id: 'fries', name: 'Fries', basePrice: 400, modifiers: [] }

const { addLine, setQuantity, removeLine } = useCart.getState()
const lines = () => useCart.getState().lines

beforeEach(() => useCart.setState({ lines: [] }))

describe('cart total', () => {
  it('is the price of a single line', () => {
    addLine(burger, [cheese], 1)
    expect(cartTotal(lines())).toBe(1050)
  })

  it('sums multiple lines', () => {
    addLine(burger, [cheese], 1)
    addLine(fries, [], 2)
    expect(cartTotal(lines())).toBe(1050 + 800)
  })

  it('follows a quantity change', () => {
    addLine(burger, [cheese], 1)
    setQuantity(lines()[0].id, 3)
    expect(cartTotal(lines())).toBe(3150)
  })

  it('drops a removed line', () => {
    addLine(burger, [cheese], 1)
    addLine(fries, [], 1)
    removeLine(lines()[0].id)
    expect(lines()).toHaveLength(1)
    expect(cartTotal(lines())).toBe(400)
  })

  it('is zero for an empty cart', () => {
    expect(cartTotal([])).toBe(0)
  })
})

describe('cart lines', () => {
  it('keeps the chosen modifiers and price on the line', () => {
    addLine(burger, [cheese, bacon], 2)
    expect(lines()[0]).toMatchObject({
      product: burger,
      modifiers: [cheese, bacon],
      quantity: 2,
    })
    expect(lines()[0].price).toBe(2500)
  })

  it('merges an identical product + modifier combination into one line', () => {
    addLine(burger, [cheese], 1)
    addLine(burger, [cheese], 2)
    expect(lines()).toHaveLength(1)
    expect(lines()[0].quantity).toBe(3)
  })

  it('keeps different modifier combinations as separate lines', () => {
    addLine(burger, [cheese], 1)
    addLine(burger, [bacon], 1)
    expect(lines()).toHaveLength(2)
  })

  it('removes a line when its quantity drops to zero', () => {
    addLine(burger, [], 1)
    setQuantity(lines()[0].id, 0)
    expect(lines()).toHaveLength(0)
  })
})
