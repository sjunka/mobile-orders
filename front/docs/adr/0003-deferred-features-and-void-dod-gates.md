# Deferred features and void Definition-of-Done gates

`React_Native_Ordering_App_Prototype.md` is a pre-decision wishlist, written before the shipped slice existed. Read against the code today, it lists features the app doesn't have and two Definition-of-Done gates nothing in the repo satisfies. Neither is an oversight; both are decisions this ADR now writes down, so an agent doesn't rebuild a deferred feature or bolt on a gate the guide asked for.

## Deferred features

Each of the following is cut on purpose, not unfinished:

- **Passwordless auth** — no accounts exist yet; guest checkout is the whole first slice.
- **Combos** — a pricing and modifier-composition feature with no menu content driving it yet.
- **Loyalty** — depends on accounts, which don't exist.
- **Order history** — depends on accounts, which don't exist.
- **Live order status** — needs a backend order-state machine and a push/poll channel; no such infra exists.
- **Voice AI** — a separate ordering surface, orthogonal to the Menu → Cart → Checkout slice this app builds first.

The backend's own rejection of auth is recorded on the backend side, in its own ADR-0001. It is not restated here.

## Void: Detox critical E2E

The guide's Definition of Done names a Detox critical-path E2E test. This gate is void, on infrastructure grounds — a native build and CI hardware to run it on, neither of which exist for this project — not on principle. Detox remains a fine tool if that infrastructure ever appears.

## Void: ≥80% coverage on business logic

The guide's Definition of Done names a coverage percentage. This gate is void because chasing a number rewards testing presentational components as readily as testing the money path. A percentage doesn't tell a reader what's actually proven.

## What replaced them

The bar is behavior covered, not a percentage: the RNTL Menu → Cart → Checkout flow test, including the decline-then-retry path, plus the backend's Supertest suite. Between the two, every branch of the money path is exercised by an assertion on observable behavior.

## Android is verified

The guide's "app builds on iOS and Android" line is answered. On 2026-07-24 the app was built and launched on an Android 16 (API 36, arm64) emulator through Expo Go, on the shipped startup path — no in-app mock — with the backend running and reached over `EXPO_PUBLIC_API_URL`. The menu loaded from the backend and a checkout completed: order `ORD-8`, $10.50, recorded by the backend as paid.

## Consequences

- Front ADR-0001 stands unedited — this ADR narrows the guide's feature list and voids its DoD gates; it does not touch the mock-at-network-layer decision.
- An agent picking up any of the six deferred features should treat it as unscheduled work, not a bug to fix.
- No CI or test-config change follows from this ADR — the Detox and coverage gates were never wired up, so voiding them removes an aspiration, not a running check.
