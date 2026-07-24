# An unauthenticated operator order list

`GET /orders` returns every order the backend holds, each with the guest's name and email. Nothing guards it. There is no login (ADR-0001), so there is no way to tell an operator from a guest, and the operator screen is useless without "whose order" — a list of ids and totals cannot be worked from.

So the prototype ships the leak instead of hiding it. The app puts the screen behind a header button on the Menu that every guest can see and tap, and reads back every other guest's name and email.

## Consequences

- Anyone who can reach the API can read every guest's identity and what they ordered.
- This is prototype-only. Before the API is reachable from anywhere but a laptop, the route needs an operator role behind it, or it comes out.
- `GET /orders/:orderId` stays as it was: no guest in the response. It is reachable by counting ids, and this ADR is no reason to widen it.
- The status on an order (`paid`) exists for this list. Cancellation, when it lands, widens it.
