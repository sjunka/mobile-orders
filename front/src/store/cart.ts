import { create } from 'zustand'

import type { CartLine } from '../types/cart'
import type { Modifier, Product } from '../types/menu'
import { linePrice } from '../utils/price'

type CartState = {
  lines: CartLine[]
  addLine: (product: Product, modifiers: Modifier[], quantity: number) => void
  setQuantity: (lineId: string, quantity: number) => void
  removeLine: (lineId: string) => void
  clear: () => void
}

function makeLine(product: Product, modifiers: Modifier[], quantity: number): CartLine {
  const ids = modifiers.map((m) => m.id).sort()
  return {
    id: `${product.id}:${ids.join(',')}`,
    product,
    modifiers,
    quantity,
    price: linePrice(product.basePrice, modifiers, quantity),
  }
}

export const useCart = create<CartState>((set) => ({
  lines: [],

  addLine: (product, modifiers, quantity) =>
    set((state) => {
      const line = makeLine(product, modifiers, quantity)
      if (!state.lines.some((l) => l.id === line.id)) return { lines: [...state.lines, line] }
      return {
        lines: state.lines.map((l) =>
          l.id === line.id ? makeLine(l.product, l.modifiers, l.quantity + quantity) : l,
        ),
      }
    }),

  // Removing is its own action, so quantity floors at 1.
  setQuantity: (lineId, quantity) =>
    set((state) => ({
      lines: state.lines.map((l) =>
        l.id === lineId ? makeLine(l.product, l.modifiers, Math.max(1, quantity)) : l,
      ),
    })),

  removeLine: (lineId) => set((state) => ({ lines: state.lines.filter((l) => l.id !== lineId) })),

  clear: () => set({ lines: [] }),
}))
