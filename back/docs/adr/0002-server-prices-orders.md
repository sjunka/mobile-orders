# The server prices orders; the client sends references, not prices

`POST /orders` takes each order line as `{ productId, modifierIds, quantity }` and computes the total itself from the menu: `(basePrice + Σ priceDelta) × quantity`. The request body carries no price field anywhere, so a client cannot set one — the trust boundary is enforced by the shape rather than by remembering to ignore fields.

This looks like duplicated work, because the frontend already computes the same total to display "Pay £X" before submitting. It is duplicated deliberately: the frontend total is for the guest's eyes, the backend total is the one that counts. Do not "fix" it by having the server accept the client's total.

## Considered options

The frontend originally posted `{ name, email, cardNumber, total }` to `POST /payments` — no line items, total computed on the device. Matching that would have meant zero frontend changes, but the server would have trusted a client-supplied price and stored orders with no record of what was actually ordered. We renamed the endpoint to `POST /orders` (the resource being created is an Order; Payment is a step inside it) and changed the frontend to send line references.

## Consequences

- An unknown `productId` or `modifierId` is a real error case, answered with 400.
- The response stays `{ orderId, total }`, so the confirmation screen was unaffected by the change.
