// Prices are integer cents to avoid float rounding on money.
export type Modifier = { id: string; label: string; priceDelta: number }

export type Product = {
  id: string
  name: string
  basePrice: number
  modifiers: Modifier[]
}

export type Menu = Product[]
