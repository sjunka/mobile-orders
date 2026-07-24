// An order line arrives as references only — the caller structurally cannot
// state a price. See ADR-0002.

export type OrderLine = {
  productId: string;
  modifierIds: string[];
  quantity: number;
};

/** Who is ordering. Identity arrives with the order, not from a login. */
export type Guest = {
  name: string;
  email: string;
};

/** A validated order request. Untrusted bodies become one of these or a 400. */
export type CreateOrder = {
  guest: Guest;
  cardNumber: string;
  lines: OrderLine[];
};

/**
 * A priced, paid order belonging to one guest. `total` is integer cents,
 * computed by the server. The card number is never kept.
 *
 * `status` is `paid` from creation: the charge runs before the order exists, so
 * an unpaid one is unrepresentable. `cancelled` is one-way — there is no route
 * or state back to `paid`.
 */
export type Order = {
  orderId: string;
  guest: Guest;
  total: number;
  lines: OrderLine[];
  status: 'paid' | 'cancelled';
};
