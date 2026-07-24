import { fireEvent, screen } from '@testing-library/react-native'

import { useCart } from '../src/store/cart'
import { goToCheckout } from './checkout-render'

beforeEach(() => useCart.setState({ lines: [] }))

it('lists a placed order for the operator, by guest name', async () => {
  await goToCheckout()

  fireEvent.changeText(screen.getByLabelText('Name'), 'Grace Hopper')
  fireEvent.changeText(screen.getByLabelText('Email'), 'grace@example.com')
  fireEvent.changeText(screen.getByLabelText('Card number'), '4242424242424242')
  fireEvent.press(screen.getByText('Pay $4.00'))
  await screen.findByText('Order confirmed')

  fireEvent.press(await screen.findByText('Back to menu'))
  fireEvent.press(await screen.findByLabelText('Orders'))

  expect(await screen.findByText('Grace Hopper')).toBeOnTheScreen()
  expect(screen.getByText('$4.00')).toBeOnTheScreen()
  expect(screen.getByText('paid')).toBeOnTheScreen()

  // Expanding a row lives in orders-screen.test.tsx: after a checkout submit
  // RNTL never flushes a local state update — see checkout-render.tsx.
})
