import { NavigationContainer } from '@react-navigation/native'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react-native'
import { http, HttpResponse } from 'msw'
import { TamaguiProvider } from 'tamagui'

import { API_URL } from '../src/api/client'
import { OrdersScreen } from '../src/features/orders/OrdersScreen'
import { server } from '../src/mocks/node'
import { cancelOrder, createOrder } from '../src/services/order'
import { tamaguiConfig } from '../tamagui.config'

function renderOrders() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: 0 } } })
  return render(
    <TamaguiProvider config={tamaguiConfig} defaultTheme="light">
      <QueryClientProvider client={client}>
        <NavigationContainer>
          <OrdersScreen />
        </NavigationContainer>
      </QueryClientProvider>
    </TamaguiProvider>,
  )
}

it('says so plainly when no order exists', async () => {
  await renderOrders()

  expect(await screen.findByText('No orders yet.')).toBeOnTheScreen()
})

it('says so when the request fails', async () => {
  server.use(http.get(`${API_URL}/orders`, () => new HttpResponse(null, { status: 500 })))
  await renderOrders()

  expect(await screen.findByText("Couldn't load the orders.")).toBeOnTheScreen()
})

it('expands an order to its product and modifier names, then collapses it', async () => {
  // Posted through the same service checkout uses, so the mock records it.
  await createOrder({
    name: 'Grace Hopper',
    email: 'grace@example.com',
    cardNumber: '4242424242424242',
    lines: [{ productId: 'fries', modifierIds: ['large'], quantity: 2 }],
  })
  await renderOrders()

  const row = await screen.findByLabelText(/Grace Hopper/)
  expect(screen.queryByText('2 × Fries — Large')).not.toBeOnTheScreen()

  fireEvent.press(row)
  expect(await screen.findByText('2 × Fries — Large')).toBeOnTheScreen()

  fireEvent.press(row)
  await waitFor(() => expect(screen.queryByText('2 × Fries — Large')).not.toBeOnTheScreen())
})

it('cancels an order with no confirmation, and the Cancel action disappears', async () => {
  const { orderId } = await createOrder({
    name: 'Grace Hopper',
    email: 'grace@example.com',
    cardNumber: '4242424242424242',
    lines: [{ productId: 'fries', modifierIds: [], quantity: 1 }],
  })
  await renderOrders()

  const row = await screen.findByLabelText(new RegExp(orderId))
  fireEvent.press(within(row).getByText('Cancel'))

  await waitFor(() => expect(within(row).getByText('cancelled')).toBeOnTheScreen())
  expect(within(row).queryByText('Cancel')).not.toBeOnTheScreen()
})

it('cancelling an already-cancelled order stays a success, no error state', async () => {
  const { orderId } = await createOrder({
    name: 'Grace Hopper',
    email: 'grace@example.com',
    cardNumber: '4242424242424242',
    lines: [{ productId: 'fries', modifierIds: [], quantity: 1 }],
  })
  await cancelOrder(orderId)
  await renderOrders()

  const row = await screen.findByLabelText(new RegExp(orderId))
  expect(within(row).getByText('cancelled')).toBeOnTheScreen()
  expect(screen.queryByText("Couldn't load the orders.")).not.toBeOnTheScreen()
})
