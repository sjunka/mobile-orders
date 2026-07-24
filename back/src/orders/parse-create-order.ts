import { BadRequestException } from '@nestjs/common';

import type { CreateOrder, OrderLine } from './orders.types';

// Every refusal is one sentence a guest could read, because the app has exactly
// one place to show a failure. Never a field-error list.
function refuse(message: string): never {
  throw new BadRequestException(message);
}

function asRecord(value: unknown): Record<string, unknown> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    refuse('That order could not be read.');
  }
  return value as Record<string, unknown>;
}

function requireText(value: unknown, missing: string): string {
  if (typeof value !== 'string' || value.trim() === '') refuse(missing);
  return value.trim();
}

function parseLine(value: unknown): OrderLine {
  const line = asRecord(value);
  const productId = requireText(
    line.productId,
    'Every order line needs a product.',
  );

  const modifierIds = line.modifierIds ?? [];
  if (
    !Array.isArray(modifierIds) ||
    modifierIds.some((id) => typeof id !== 'string')
  ) {
    refuse('Those modifiers could not be read.');
  }

  const { quantity } = line;
  if (
    typeof quantity !== 'number' ||
    !Number.isInteger(quantity) ||
    quantity < 1
  ) {
    refuse('Every order line needs a quantity of at least one.');
  }

  return { productId, modifierIds: modifierIds as string[], quantity };
}

/** Turns an untrusted request body into an order request, or refuses it. */
export function parseCreateOrder(body: unknown): CreateOrder {
  const order = asRecord(body);

  const name = requireText(order.name, 'Please give us a name for the order.');
  const email = requireText(order.email, 'Please give us an email address.');
  // Deliberately loose: enough to catch a typo, not enough to argue about.
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    refuse('That email address does not look right.');
  }

  const cardNumber = requireText(
    order.cardNumber,
    'Please enter a card number.',
  );
  if (!/^\d{16}$/.test(cardNumber))
    refuse('That card number does not look right.');

  const { lines } = order;
  if (!Array.isArray(lines) || lines.length === 0) {
    refuse('Your order is empty.');
  }

  return { name, email, cardNumber, lines: lines.map(parseLine) };
}
