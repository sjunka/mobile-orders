// An order line arrives as references only — the caller structurally cannot
// state a price. See ADR-0002.

export type OrderLine = {
  productId: string;
  modifierIds: string[];
  quantity: number;
};

/** A validated order request. Untrusted bodies become one of these or a 400. */
export type CreateOrder = {
  name: string;
  email: string;
  cardNumber: string;
  lines: OrderLine[];
};

/** A priced, paid order. `total` is integer cents, computed by the server. */
export type Order = {
  orderId: string;
  total: number;
  lines: OrderLine[];
};
