import { fireEvent, screen } from '@testing-library/react-native'
import { delay, http, HttpResponse } from 'msw'

import { API_URL } from '../src/api/client'
import { server } from '../src/mocks/node'
import { useCart } from '../src/store/cart'
import { mockUtterance, renderApp, speak } from './voice-render'

// Recording is the one thing Jest can't do — fake the module, run everything else for real.
jest.mock('../src/services/recorder', () => ({
  startRecording: jest.fn().mockResolvedValue(undefined),
  stopRecording: jest.fn().mockResolvedValue('file:///utterance.m4a'),
}))

beforeEach(() => useCart.setState({ lines: [] }))

it('turns a spoken utterance into cart lines, merges a repeat, and shows in the cart', async () => {
  mockUtterance([
    { productId: 'burger', modifierIds: ['bacon'], quantity: 1 },
    { productId: 'fries', modifierIds: [], quantity: 2 },
  ])
  await renderApp()

  await speak()

  expect(screen.getByLabelText('Cart')).toHaveTextContent('3')

  // Speaking the same thing again raises quantity instead of adding a second line.
  await speak()

  const lines = useCart.getState().lines
  expect(lines).toHaveLength(2)
  const burgerLine = lines.find((l) => l.product.id === 'burger')
  expect(burgerLine?.quantity).toBe(2)
  expect(burgerLine?.modifiers.map((m) => m.id)).toEqual(['bacon'])
  const friesLine = lines.find((l) => l.product.id === 'fries')
  expect(friesLine?.quantity).toBe(4)

  fireEvent.press(screen.getByLabelText('Cart'))
  expect(await screen.findByText('Classic Burger')).toBeOnTheScreen()
  expect(screen.getByText('Bacon')).toBeOnTheScreen()
  expect(screen.getByText('Fries')).toBeOnTheScreen()
})

it('adds what resolved and reports what did not, then clears on a later success', async () => {
  mockUtterance(
    [{ productId: 'burger', modifierIds: [], quantity: 1 }],
    ['something with chicken'],
  )
  await renderApp()

  await speak()

  expect(screen.getByLabelText('Cart')).toHaveTextContent('1')
  expect(await screen.findByText("Couldn't find: something with chicken")).toBeOnTheScreen()

  mockUtterance([{ productId: 'fries', modifierIds: [], quantity: 1 }])
  await speak()

  expect(screen.getByLabelText('Cart')).toHaveTextContent('2')
  expect(screen.queryByText("Couldn't find: something with chicken")).not.toBeOnTheScreen()
})

it('shows recording while held and sending while the upload is in flight', async () => {
  server.use(
    http.post(`${API_URL}/utterances`, async () => {
      await delay(50)
      return HttpResponse.json({ lines: [], unresolved: [] })
    }),
  )
  await renderApp()

  const control = await screen.findByLabelText('Hold to talk')
  fireEvent(control, 'pressIn')
  expect(await screen.findByText('Recording…')).toBeOnTheScreen()

  fireEvent(control, 'pressOut')
  expect(await screen.findByText('Adding to cart…')).toBeOnTheScreen()
  expect(await screen.findByText('Hold to talk')).toBeOnTheScreen()
})
