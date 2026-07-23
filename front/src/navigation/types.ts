import type { Product } from '../types/menu'

// Screens grow as later tickets land (Checkout, Confirmation).
export type RootStackParamList = {
  Menu: undefined
  ProductDetail: { product: Product }
  Cart: undefined
}
