# CLAUDE.md

Guide for working in this repo. Bias toward the smallest change that works.

## What this is

A mobile ordering app. A guest browses a menu, customizes products with modifiers, fills a cart, and checks out with mock payment. Built mock-first so the UI runs before the backend exists.

Domain terms are defined once in `CONTEXT.md` — use them, don't drift to synonyms. Architecture decisions and their reasons live in `docs/adr/`.

## First slice

Menu → Cart → Checkout, end-to-end on mocks. Everything else is deferred:

- **In:** menu, product modifiers, cart, guest checkout, mock payment (success + failure).
- **Out (until asked):** auth, combos, loyalty, order history, live status, voice AI.

Don't build deferred features speculatively.

## Stack

- Expo + React Native + TypeScript (strict). Read the versioned Expo docs (see `AGENTS.md`) before writing Expo code.
- **Tamagui v2** for UI.
- **React Navigation** in `navigation/` — not Expo Router (see ADR-0002).
- **TanStack Query** for server data; **Zustand** for cart and local UI state.
- **MSW** mocks at the network layer (see ADR-0001). One `ApiXService` per domain hits HTTP; MSW answers in Jest only, the running app talks to the real backend. No Mock/Api class swap — production repoints the base URL.
- React Hook Form + Zod for forms.

## Folder structure

```
src/
  api/ services/ mocks/ features/ components/ hooks/ store/ navigation/ types/ utils/
tests/
```

## Testing

Lean until a slice exists:

- **Unit (Jest):** price calc, cart logic — the real business logic.
- **Component (RNTL):** the Menu → Cart → Checkout flow, including the payment-decline path.
- Deferred: Detox E2E and the ≥80% coverage gate.

Test the logic worth breaking. No frameworks or fixtures beyond what a test needs.

## How to work

1. **Think first.** Name assumptions. If a simpler approach exists, say so. If unclear, ask.
2. **Simplest thing that works.** No abstractions for single-use code. No error handling for impossible cases. If 200 lines could be 50, write 50.
3. **Surgical changes.** Touch only what the task needs. Don't refactor working code you happened to pass. Remove only what your own change orphaned.
4. **Verify.** State success as a check and loop until it passes. "Fix bug" → write the failing test, make it green.

## Prose

READMEs, comments, docs: short words, active voice, cut filler. A comment explains *why*, only when non-obvious. Would a delivery driver understand it?

## Agent skills

### Issue tracker

Issues tracked as GitHub issues in `sjunka/mobile-orders` (via `gh`). See `docs/agents/issue-tracker.md`.

### Triage labels

Default five-role vocabulary. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context — `CONTEXT.md` + `docs/adr/` at repo root. See `docs/agents/domain.md`.
