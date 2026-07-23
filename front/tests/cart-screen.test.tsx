import { NavigationContainer } from '@react-navigation/native'
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native'
import { TamaguiProvider } from 'tamagui'

import { CartScreen } from '../src/features/cart/CartScreen'
import { useCart } from '../src/store/cart'
import type { Product } from '../src/types/menu'
import { tamaguiConfig } from '../tamagui.config'

const cheese = { id: 'cheese', label: 'Cheese', priceDelta: 100 }
const burger: Product = {
  id: 'burger',
  name: 'Classic Burger',
  basePrice: 950,
  modifiers: [cheese],
}
const fries: Product = { id: 'fries', name: 'Fries', basePrice: 400, modifiers: [] }

const expectTotal = (expected: string) =>
  waitFor(() => expect(screen.getByTestId('cart-total')).toHaveTextContent(expected))

beforeEach(() => useCart.setState({ lines: [] }))

function renderCart() {
  return render(
    <TamaguiProvider config={tamaguiConfig} defaultTheme="light">
      <NavigationContainer>
        <CartScreen />
      </NavigationContainer>
    </TamaguiProvider>,
  )
}

describe('Cart screen', () => {
  it('lists lines and keeps the total in step with quantity and removal', async () => {
    const { addLine } = useCart.getState()
    addLine(burger, [cheese], 1)
    addLine(fries, [], 1)

    await renderCart()

    expect(screen.getByText('Classic Burger')).toBeTruthy()
    expect(screen.getByText('Cheese')).toBeTruthy()
    expect(screen.getByText('Fries')).toBeTruthy()
    await expectTotal('$14.50')

    fireEvent.press(screen.getByLabelText('Increase Classic Burger quantity'))
    await expectTotal('$25.00')

    fireEvent.press(screen.getByLabelText('Remove Classic Burger'))
    await expectTotal('$4.00')
  })

  it('shows an empty state with no lines', async () => {
    await renderCart()
    expect(screen.getByText('Your cart is empty.')).toBeTruthy()
  })
})
