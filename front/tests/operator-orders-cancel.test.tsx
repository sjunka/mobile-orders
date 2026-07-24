import { fireEvent, screen } from '@testing-library/react-native'

import { useCart } from '../src/store/cart'
import { goToCheckout } from './checkout-render'

beforeEach(() => useCart.setState({ lines: [] }))

it('cancels a real order from the operator list', async () => {
  await goToCheckout()

  fireEvent.changeText(screen.getByLabelText('Name'), 'Grace Hopper')
  fireEvent.changeText(screen.getByLabelText('Email'), 'grace@example.com')
  fireEvent.changeText(screen.getByLabelText('Card number'), '4242424242424242')
  fireEvent.press(screen.getByText('Pay $4.00'))
  await screen.findByText('Order confirmed')

  fireEvent.press(await screen.findByText('Back to menu'))
  fireEvent.press(await screen.findByLabelText('Orders'))

  fireEvent.press(await screen.findByText('Cancel'))

  expect(await screen.findByText('cancelled')).toBeOnTheScreen()
  expect(screen.queryByText('Cancel')).not.toBeOnTheScreen()
})
