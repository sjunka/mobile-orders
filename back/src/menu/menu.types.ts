// Prices are integer cents. No float amount exists anywhere in this API — see
// ADR-0002. These shapes are the contract the app already ships against.

export type Modifier = {
  id: string;
  label: string;
  priceDelta: number;
};

export type Product = {
  id: string;
  name: string;
  basePrice: number;
  modifiers: Modifier[];
};

export type Menu = Product[];
