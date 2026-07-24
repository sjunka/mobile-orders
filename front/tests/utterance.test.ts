import { resolveCartAdditions } from '../src/services/utterance'
import type { Menu } from '../src/types/menu'

const menu: Menu = [
  {
    id: 'burger',
    name: 'Classic Burger',
    basePrice: 950,
    modifiers: [
      { id: 'cheese', label: 'Cheese', priceDelta: 100 },
      { id: 'bacon', label: 'Bacon', priceDelta: 200 },
    ],
  },
  { id: 'fries', name: 'Fries', basePrice: 400, modifiers: [] },
]

describe('resolveCartAdditions', () => {
  it('resolves a product with its named modifiers and spoken quantity', () => {
    const { additions } = resolveCartAdditions(
      { lines: [{ productId: 'burger', modifierIds: ['bacon'], quantity: 1 }], unresolved: [] },
      menu,
    )
    expect(additions).toEqual([
      {
        product: menu[0],
        modifiers: [menu[0].modifiers[1]],
        quantity: 1,
      },
    ])
  })

  it('leaves modifiers off when none were named', () => {
    const { additions } = resolveCartAdditions(
      { lines: [{ productId: 'fries', modifierIds: [], quantity: 2 }], unresolved: [] },
      menu,
    )
    expect(additions).toEqual([{ product: menu[1], modifiers: [], quantity: 2 }])
  })

  it('resolves several lines from one utterance', () => {
    const { additions } = resolveCartAdditions(
      {
        lines: [
          { productId: 'burger', modifierIds: ['cheese', 'bacon'], quantity: 1 },
          { productId: 'fries', modifierIds: [], quantity: 2 },
        ],
        unresolved: [],
      },
      menu,
    )
    expect(additions).toHaveLength(2)
    expect(additions[0].quantity).toBe(1)
    expect(additions[1].quantity).toBe(2)
  })

  it('passes through phrases the backend already reported as unresolved', () => {
    const { unresolved } = resolveCartAdditions(
      { lines: [], unresolved: ['something with chicken'] },
      menu,
    )
    expect(unresolved).toEqual(['something with chicken'])
  })

  it('treats a product id missing from the cached menu as unresolved, not a crash', () => {
    const { additions, unresolved } = resolveCartAdditions(
      { lines: [{ productId: 'nonexistent', modifierIds: [], quantity: 1 }], unresolved: [] },
      menu,
    )
    expect(additions).toEqual([])
    expect(unresolved).toEqual(['something'])
  })

  it('adds the product even when a named modifier id is not on it', () => {
    const { additions, unresolved } = resolveCartAdditions(
      { lines: [{ productId: 'fries', modifierIds: ['bacon'], quantity: 1 }], unresolved: [] },
      menu,
    )
    expect(additions).toEqual([{ product: menu[1], modifiers: [], quantity: 1 }])
    expect(unresolved).toEqual([])
  })
})
