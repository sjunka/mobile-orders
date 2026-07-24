# Voice ordering architecture

Voice ordering (#39) adds a hold-to-talk button on the Menu screen. Three decisions here are expensive to reverse and surprising without their reasoning; the rest of the feature — the gesture, the mic's placement, the test seam — is cheap to change and needs no ADR.

## Voice is an input method, not a second ordering surface

Voice only ever produces cart lines. It cannot place an order, cannot pay, cannot navigate, and does not speak back. Menu → Cart → Checkout stays the only route to an order — the guest still reviews the cart and still runs checkout by hand.

Rejected: a parallel voice-ordering surface that could complete a purchase on its own. That would have doubled the money path — two ways to reach an order that could disagree — and duplicated review and payment logic ADR-0001's slice already owns. This is also why ADR-0003 deferred Voice AI as "a separate ordering surface": that framing is what this decision overturns. Treating voice as an input method rather than a surface is what makes it affordable inside the existing slice.

## The backend owns transcription and menu matching

The app records audio and uploads it. The backend transcribes it and resolves the transcript against the menu it already serves. The app does no matching and holds no model credential.

Rejected: on-device transcription and matching. That would ship a model API key in the app bundle and let product-matching logic drift from the backend's own menu — the same drift ADR-0001 avoids by keeping the network as the mock seam. Backend-owned matching keeps one source of truth for what a phrase resolves to, in the same repo that already owns the menu.

## The endpoint returns references, not priced lines

`POST /utterances` responds with `productId` / `modifierId` references and a list of unresolved phrases, never prices. The app resolves each reference against its cached menu and prices it through the existing `linePrice`, the same path a tapped line takes.

Rejected: having the backend return priced lines directly. That would create a second place money gets computed, which could disagree with `linePrice` — the same risk ADR-0001's mock-at-network-layer shape and the existing `POST /orders` contract (references priced server-side) both avoid. References-only means a voice-added line is structurally identical to a tapped one.

## Depends on modifiers staying optional

No-modifier-defaulting — an utterance naming a product without modifiers resolves to that product with an empty modifier list — holds only because no product currently has a required modifier group. A required modifier group would reopen it: the app would need to decide what an utterance that omits a required choice should do, which is a defaulting or clarification question this ADR does not answer.

## Consequences

- ADR-0003's Voice AI deferral is amended, not deleted — the original reasoning stays visible alongside what changed.
- The other five deferrals in ADR-0003 (auth, combos, loyalty, order history, live order status) are untouched.
- `CONTEXT.md` gains **Utterance** and **Unresolved phrase**.
