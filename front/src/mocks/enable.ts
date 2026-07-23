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
  // MSW rebuilds every reply as `new Response(response.body, ...)`. React
  // Native's Response has no `body` — the mock arrived with status 200 and an
  // empty payload. Hand MSW the text instead; RN's Response takes that fine.
  Object.defineProperty(Response.prototype, 'body', {
    configurable: true,
    get(this: { _bodyText?: string }) {
      return this._bodyText ?? null
    },
  })

  setupServer(...handlers).listen({ onUnhandledRequest: 'error' })
}
// ponytail: msw is a devDependency and now lands in every bundle. No prod build
// exists yet (mock-first). When one lands, move msw to deps or strip this module
// from the prod bundle.
