# Ordering API

Mock-first NestJS API for the mobile ordering app. Data lives in memory — no database.

See [CONTEXT.md](./CONTEXT.md) for the domain language and [docs/adr/](./docs/adr/) for the decisions that shaped it.

## Run

```bash
npm install
npm run start:dev
```

Serves on `http://localhost:3000`, which is what the app's `API_URL` defaults to.

To point the app at it, disable the app's network mocking and set `EXPO_PUBLIC_API_URL` if the API is not on localhost — on a physical device it has to be the machine's LAN address, not `localhost`.

## Test

```bash
npm test
```

One seam: supertest over the built application. There are no per-service unit specs, deliberately — everything worth asserting is observable over HTTP, and storage is meant to stay free to change.

## Endpoints

| Method | Path    | Returns                  |
| ------ | ------- | ------------------------ |
| `GET`  | `/menu` | Every product on sale    |

## The menu is owned here

`src/mocks/menu.data.ts` is the canonical menu — it is what a guest is offered and, once orders land, what an order is priced against.

The app keeps its own copy at `front/src/mocks/menu-data.ts`. That copy is **a test fixture only**: it exists so the app's own tests run offline. The two are allowed to drift in content; the shared type shape is what must not.
