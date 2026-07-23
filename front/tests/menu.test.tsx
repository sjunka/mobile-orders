import { NavigationContainer } from '@react-navigation/native'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen } from '@testing-library/react-native'
import { delay, http, HttpResponse } from 'msw'
import { TamaguiProvider } from 'tamagui'

import { API_URL } from '../src/api/client'
import { MenuScreen } from '../src/features/menu/MenuScreen'
import { server } from '../src/mocks/node'
import { tamaguiConfig } from '../tamagui.config'

// RNTL 14's render is async under the new concurrent test renderer — await it.
function renderMenu() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: 0 } } })
  return render(
    <TamaguiProvider config={tamaguiConfig} defaultTheme="light">
      <QueryClientProvider client={client}>
        <NavigationContainer>
          <MenuScreen />
        </NavigationContainer>
      </QueryClientProvider>
    </TamaguiProvider>,
  )
}

describe('Menu screen', () => {
  it('shows a loading indicator, then products with name and base price', async () => {
    server.use(
      http.get(`${API_URL}/menu`, async () => {
        await delay(50)
        return HttpResponse.json([
          { id: 'burger', name: 'Classic Burger', basePrice: 950, modifiers: [] },
          { id: 'fries', name: 'Fries', basePrice: 400, modifiers: [] },
        ])
      }),
    )
    await renderMenu()

    await screen.findByLabelText('Loading menu')

    expect(await screen.findByText('Classic Burger')).toBeOnTheScreen()
    expect(screen.getByText('$9.50')).toBeOnTheScreen()
    expect(screen.getByText('Fries')).toBeOnTheScreen()
    expect(screen.getByText('$4.00')).toBeOnTheScreen()
    expect(screen.queryByLabelText('Loading menu')).not.toBeOnTheScreen()
  })

  it('shows an error state and recovers on retry', async () => {
    server.use(http.get(`${API_URL}/menu`, () => new HttpResponse(null, { status: 500 })))
    await renderMenu()

    await screen.findByText("Couldn't load the menu.")

    server.resetHandlers() // menu handler answers again
    fireEvent.press(screen.getByText('Try again'))

    expect(await screen.findByText('Classic Burger')).toBeOnTheScreen()
  })
})
