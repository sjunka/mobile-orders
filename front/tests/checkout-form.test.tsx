import { fireEvent, screen } from '@testing-library/react-native'

import { useCart } from '../src/store/cart'
import { goToCheckout } from './checkout-render'

beforeEach(() => useCart.setState({ lines: [] }))

it('rejects an invalid form before touching the network', async () => {
  await goToCheckout()

  fireEvent.changeText(screen.getByLabelText('Email'), 'not-an-email')
  fireEvent.press(screen.getByText('Pay $4.00'))

  expect(await screen.findByText('Enter a valid email.')).toBeOnTheScreen()
  expect(screen.getByText('Name is required.')).toBeOnTheScreen()
  expect(screen.getByText('Enter a 16-digit card number.')).toBeOnTheScreen()
})
