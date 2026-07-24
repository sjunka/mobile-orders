// References only, never priced — the app resolves and prices these against its
// own cached menu, matching how the app already treats `POST /orders`. See
// front/docs/adr/0004-voice-ordering-architecture.md.
//
// Reuses OrderLine rather than redefining the same shape: a voice-added line is
// structurally identical to a tapped one (ADR-0004), so the two must never drift.

import type { OrderLine } from '../orders/orders.types';

/** A fragment of the utterance that matched no product, in the guest's own words. */
export type UtteranceResult = {
  lines: OrderLine[];
  unresolved: string[];
};
