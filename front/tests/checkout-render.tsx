import { NavigationContainer } from '@react-navigation/native'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen } from '@testing-library/react-native'
import { TamaguiProvider } from 'tamagui'

import { RootNavigator } from '../src/navigation/RootNavigator'
import { tamaguiConfig } from '../tamagui.config'

// Submitting the checkout form leaves RNTL's act queue in a state where the
// next render in the same file mounts a dead tree, so each submit needs its
// own test file. Shared setup lives here.
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

/** Menu → product → cart → checkout, ending on a $4.00 Fries order. */
export async function goToCheckout() {
  await renderApp()

  fireEvent.press(await screen.findByText('Fries'))
  fireEvent.press(await screen.findByText('Add to cart'))
  fireEvent.press(await screen.findByLabelText('Cart'))
  fireEvent.press(await screen.findByText('Checkout'))
  await screen.findByText('Pay $4.00')
}
