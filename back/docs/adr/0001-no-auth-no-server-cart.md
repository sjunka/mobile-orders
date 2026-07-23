# No auth module, no server-side cart

The prototype guide specifies `POST /auth/login`, a users fixture, and cart endpoints (`POST /cart/items`, `GET /cart`, `DELETE /cart`). We built neither. The app orders as a guest — identity arrives in the order body, never from a login — and the cart is device-local state in the frontend's Zustand store, so a server cart would be a second source of truth with no key to store it against (an anonymous server cart needs a session id, which is auth wearing a hat).

## Consequences

- The backend is two modules: `menu` and `orders`.
- `GET /orders` (list all) does not exist. With no caller identity it could only return every order ever placed, and no screen consumes it. Order history arrives with auth, if auth ever arrives.
- Guest identity is unverified. Anyone can place an order under any name and email. Acceptable for a prototype; the first thing to revisit before this is reachable from outside a laptop.
