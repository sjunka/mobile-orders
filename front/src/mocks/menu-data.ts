import type { Menu } from '../types/menu'

// Modifiers are carried on the shape now; the Menu screen only shows name +
// base price. Product detail (ticket 02) uses the modifiers.
export const menu: Menu = [
  {
    id: 'burger',
    name: 'Classic Burger',
    basePrice: 950,
    modifiers: [
      { id: 'cheese', label: 'Cheese', priceDelta: 100 },
      { id: 'bacon', label: 'Bacon', priceDelta: 200 },
    ],
  },
  {
    id: 'fries',
    name: 'Fries',
    basePrice: 400,
    modifiers: [{ id: 'large', label: 'Large', priceDelta: 150 }],
  },
  {
    id: 'soda',
    name: 'Soda',
    basePrice: 300,
    modifiers: [],
  },
]
