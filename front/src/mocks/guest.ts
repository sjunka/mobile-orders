// Prefilled checkout guest so a dev run doesn't mean typing name/email/card
// every time. Dev builds only, and never in tests — the form tests assert on
// empty-field validation. Swap the card for 4000000000000002 to see a decline.
const MOCK_GUEST = {
  name: 'Ada Lovelace',
  email: 'ada@example.com',
  cardNumber: '4242424242424242',
}

const EMPTY_GUEST = { name: '', email: '', cardNumber: '' }

export function checkoutDefaults(): typeof MOCK_GUEST {
  return __DEV__ && process.env.NODE_ENV !== 'test' ? { ...MOCK_GUEST } : { ...EMPTY_GUEST }
}
