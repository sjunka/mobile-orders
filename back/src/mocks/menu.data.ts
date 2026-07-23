import type { Menu } from '../menu/menu.types';

// The canonical menu. The app keeps its own copy, but only as a test fixture —
// this is what a guest is actually offered, and what an order is priced against.
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
];
