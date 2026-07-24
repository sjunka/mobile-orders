# Mobile Orders

Expo app for the mobile ordering flow: menu, cart, checkout.

See [CONTEXT.md](./CONTEXT.md) for the domain language and [docs/adr/](./docs/adr/) for the decisions that shaped it.

## Run

The app talks to the real backend — there is no in-app mock. Start both with:

```bash
npm run me
```

This boots the backend (`../back`) and Expo together. To run them separately, start the backend first (`npm run start:dev --prefix ../back`), then `npm start` here.

The iOS Simulator and web reach the backend on `http://localhost:3000` by default. A physical device or the Android emulator can't reach `localhost` on your machine — set `EXPO_PUBLIC_API_URL` to your machine's LAN address:

```bash
EXPO_PUBLIC_API_URL=http://192.168.1.23:3000 npm start
```

## Test

```bash
npm test
```

MSW mocks the backend at the network layer, in tests only (ADR-0001). Handlers, the Node server setup, and the menu fixture live in `src/mocks/` and run through Jest's setup — nothing runs them on device.
