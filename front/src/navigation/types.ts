import type { Product } from '../types/menu'
import type { Order } from '../types/order'

export type RootStackParamList = {
  Menu: undefined
  ProductDetail: { product: Product }
  Cart: undefined
  Orders: undefined
  Checkout: undefined
  Confirmation: Order
}
