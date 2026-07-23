import { fireEvent, render, screen, waitFor } from '@testing-library/react-native'
import { TamaguiProvider } from 'tamagui'

import { ProductDetailScreen } from '../src/features/menu/ProductDetailScreen'
import type { Product } from '../src/types/menu'
import { tamaguiConfig } from '../tamagui.config'

const burger: Product = {
  id: 'burger',
  name: 'Classic Burger',
  basePrice: 950,
  modifiers: [
    { id: 'cheese', label: 'Cheese', priceDelta: 100 },
    { id: 'bacon', label: 'Bacon', priceDelta: 200 },
  ],
}

function renderDetail(product: Product) {
  const route = { params: { product } } as never
  return render(
    <TamaguiProvider config={tamaguiConfig} defaultTheme="light">
      <ProductDetailScreen route={route} navigation={{} as never} />
    </TamaguiProvider>,
  )
}

describe('Product detail', () => {
  it('updates the line price live as modifiers and quantity change', async () => {
    await renderDetail(burger)

    const expectLinePrice = (expected: string) =>
      waitFor(() => expect(screen.getByTestId('line-price')).toHaveTextContent(expected))

    await expectLinePrice('$9.50')

    fireEvent.press(screen.getByText('Cheese'))
    await expectLinePrice('$10.50')

    fireEvent.press(screen.getByText('Bacon'))
    await expectLinePrice('$12.50')

    fireEvent.press(screen.getByLabelText('Increase quantity'))
    await expectLinePrice('$25.00')

    // Deselecting a modifier lowers the price again.
    fireEvent.press(screen.getByText('Bacon'))
    await expectLinePrice('$21.00')
  })
})
