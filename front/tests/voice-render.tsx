import { NavigationContainer } from '@react-navigation/native'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen } from '@testing-library/react-native'
import { http, HttpResponse } from 'msw'
import { TamaguiProvider } from 'tamagui'

import { API_URL } from '../src/api/client'
import { RootNavigator } from '../src/navigation/RootNavigator'
import { server } from '../src/mocks/node'
import { tamaguiConfig } from '../tamagui.config'

export function renderApp() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: 0 } } })
  return render(
    <TamaguiProvider config={tamaguiConfig} defaultTheme="light">
      <QueryClientProvider client={client}>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </QueryClientProvider>
    </TamaguiProvider>,
  )
}

export function mockUtterance(lines: { productId: string; modifierIds: string[]; quantity: number }[]) {
  server.use(
    http.post(`${API_URL}/utterances`, () => HttpResponse.json({ lines, unresolved: [] })),
  )
}

/** Holds, waits for the recording indicator, releases, waits for send to finish. */
export async function speak() {
  const control = await screen.findByLabelText('Hold to talk')
  fireEvent(control, 'pressIn')
  await screen.findByText('Recording…')
  fireEvent(control, 'pressOut')
  await screen.findByText('Hold to talk')
}
