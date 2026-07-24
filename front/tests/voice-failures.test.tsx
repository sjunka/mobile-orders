import { fireEvent, screen } from '@testing-library/react-native'
import { http, HttpResponse } from 'msw'

import { API_URL } from '../src/api/client'
import { server } from '../src/mocks/node'
import { startRecording, stopRecording } from '../src/services/recorder'
import { useCart } from '../src/store/cart'
import { mockUtterance, renderApp, speak } from './voice-render'

jest.mock('../src/services/recorder', () => ({
  startRecording: jest.fn().mockResolvedValue(undefined),
  stopRecording: jest.fn().mockResolvedValue('file:///utterance.m4a'),
}))

beforeEach(() => {
  useCart.setState({ lines: [] })
  ;(startRecording as jest.Mock).mockResolvedValue(undefined)
  ;(stopRecording as jest.Mock).mockResolvedValue('file:///utterance.m4a')
})

it('shows a permission message and leaves the cart untouched', async () => {
  ;(startRecording as jest.Mock).mockRejectedValueOnce(
    new Error('Microphone permission denied'),
  )
  await renderApp()

  const control = await screen.findByLabelText('Hold to talk')
  fireEvent(control, 'pressIn')

  expect(await screen.findByText('Voice needs microphone access.')).toBeOnTheScreen()
  expect(useCart.getState().lines).toHaveLength(0)

  // The rest of the app still works.
  fireEvent.press(await screen.findByText('Classic Burger'))
  expect(await screen.findByText('Add to cart')).toBeOnTheScreen()
})

it('shows a network message on upload failure and leaves the cart untouched', async () => {
  server.use(http.post(`${API_URL}/utterances`, () => HttpResponse.error()))
  await renderApp()

  await speak()

  expect(
    await screen.findByText("Couldn't reach the server — nothing was ordered."),
  ).toBeOnTheScreen()
  expect(useCart.getState().lines).toHaveLength(0)
})

it('tells the guest to speak again when nothing was understood, cart untouched', async () => {
  // Default mock handler resolves nothing.
  await renderApp()

  await speak()

  expect(await screen.findByText("Didn't catch that — try speaking again.")).toBeOnTheScreen()
  expect(useCart.getState().lines).toHaveLength(0)
})

it('does nothing when the press is too short to record anything', async () => {
  ;(stopRecording as jest.Mock).mockRejectedValueOnce(new Error('Recording produced no file'))
  await renderApp()

  const control = await screen.findByLabelText('Hold to talk')
  fireEvent(control, 'pressIn')
  await screen.findByText('Recording…')
  fireEvent(control, 'pressOut')

  await screen.findByText('Hold to talk')
  expect(screen.queryByText("Didn't catch that — try speaking again.")).not.toBeOnTheScreen()
  expect(useCart.getState().lines).toHaveLength(0)
})

it('clears a failure message on a later successful utterance', async () => {
  server.use(http.post(`${API_URL}/utterances`, () => HttpResponse.error()))
  await renderApp()

  await speak()
  expect(
    await screen.findByText("Couldn't reach the server — nothing was ordered."),
  ).toBeOnTheScreen()

  mockUtterance([{ productId: 'fries', modifierIds: [], quantity: 1 }])
  await speak()

  expect(
    screen.queryByText("Couldn't reach the server — nothing was ordered."),
  ).not.toBeOnTheScreen()
  expect(useCart.getState().lines).toHaveLength(1)
})
