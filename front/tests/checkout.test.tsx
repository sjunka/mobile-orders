import { fireEvent, screen } from '@testing-library/react-native'

import { useCart } from '../src/store/cart'
import { goToCheckout } from './checkout-render'

const GOOD_CARD = '4242424242424242'
const DECLINED_CARD = '4000000000000002'

beforeEach(() => useCart.setState({ lines: [] }))

it('declines a bad card, then confirms the order on retry', async () => {
  await goToCheckout()

  fireEvent.changeText(screen.getByLabelText('Name'), 'Ada Lovelace')
  fireEvent.changeText(screen.getByLabelText('Email'), 'ada@example.com')
  fireEvent.changeText(screen.getByLabelText('Card number'), DECLINED_CARD)
  fireEvent.press(screen.getByText('Pay $4.00'))

  expect(await screen.findByText('Your card was declined.')).toBeOnTheScreen()

  fireEvent.changeText(screen.getByLabelText('Card number'), GOOD_CARD)
  fireEvent.press(screen.getByText('Pay $4.00'))

  expect(await screen.findByText('Order confirmed')).toBeOnTheScreen()
  expect(screen.getByTestId('order-total')).toHaveTextContent('$4.00')
  expect(useCart.getState().lines).toHaveLength(0)
})
