import { fireEvent, screen } from '@testing-library/react-native'

import { useCart } from '../src/store/cart'
import { mockUtterance, renderApp, speak } from './voice-render'

jest.mock('../src/services/recorder', () => ({
  startRecording: jest.fn().mockResolvedValue(undefined),
  stopRecording: jest.fn().mockResolvedValue('file:///utterance.m4a'),
}))

beforeEach(() => useCart.setState({ lines: [] }))

it('carries a voice-added line through checkout to a confirmed order', async () => {
  mockUtterance([{ productId: 'fries', modifierIds: [], quantity: 1 }])
  await renderApp()

  await speak()

  fireEvent.press(await screen.findByLabelText('Cart'))
  fireEvent.press(await screen.findByText('Checkout'))
  await screen.findByText('Pay $4.00')

  fireEvent.changeText(screen.getByLabelText('Name'), 'Ada Lovelace')
  fireEvent.changeText(screen.getByLabelText('Email'), 'ada@example.com')
  fireEvent.changeText(screen.getByLabelText('Card number'), '4242424242424242')
  fireEvent.press(screen.getByText('Pay $4.00'))

  expect(await screen.findByText('Order confirmed')).toBeOnTheScreen()
  expect(screen.getByTestId('order-total')).toHaveTextContent('$4.00')
})
