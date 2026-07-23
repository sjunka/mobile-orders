// Start MSW in the running app (dev only). The whole app is mock-first, so the
// Menu screen fetches through real HTTP and MSW answers it on device.
export async function enableMocks(): Promise<void> {
  if (!__DEV__) return
  await import('react-native-url-polyfill/auto')
  const { setupServer } = await import('msw/native')
  const { handlers } = await import('./handlers')
  setupServer(...handlers).listen({ onUnhandledRequest: 'bypass' })
}
// ponytail: msw is a devDependency; a production bundle would fail to resolve
// these dynamic imports. No prod build exists yet (mock-first). When one lands,
// move msw to deps or exclude this module from the prod bundle.
