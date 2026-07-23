// Start MSW in the running app (dev only). The whole app is mock-first, so the
// Menu screen fetches through real HTTP and MSW answers it on device.
//
// Imported statically: Metro's async-require splits a dynamic import into its own
// bundle, and on device those bundles ask for module ids the main bundle doesn't
// have — "Requiring unknown module" at startup.
import './message-event-polyfill'

import 'react-native-url-polyfill/auto'
import { setupServer } from 'msw/native'

import { handlers } from './handlers'

export function enableMocks(): void {
  if (!__DEV__) return
  console.log('[mocks] starting msw')
  setupServer(...handlers).listen({ onUnhandledRequest: 'error' })
  console.log('[mocks] msw listening')
}
// ponytail: msw is a devDependency and now lands in every bundle. No prod build
// exists yet (mock-first). When one lands, move msw to deps or strip this module
// from the prod bundle.
