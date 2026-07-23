import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';

import { MenuService } from '../menu/menu.service';
import type { CreateOrder, Order, OrderLine } from './orders.types';

@Injectable()
export class OrdersService {
  // ponytail: in-memory, so orders die with the process. Swap for a repository
  // call when a database lands — callers only ever see `create` and `find`.
  private readonly orders = new Map<string, Order>();

  constructor(private readonly menuService: MenuService) {}

  /** Prices the lines, charges the card, records the order. Any step can refuse. */
  create(request: CreateOrder): Order {
    const total = request.lines.reduce(
      (sum, line) => sum + this.priceLine(line),
      0,
    );

    // Charge last, so a refusal never leaves a guest paid for nothing.
    this.charge(request.cardNumber);

    const order: Order = {
      orderId: `ORD-${this.orders.size + 1}-${Date.now()}`,
      total,
      lines: request.lines,
    };
    this.orders.set(order.orderId, order);
    return order;
  }

  find(orderId: string): Order | undefined {
    return this.orders.get(orderId);
  }

  /** (base price + Σ modifier deltas) × quantity, in integer cents. */
  private priceLine(line: OrderLine): number {
    const product = this.menuService
      .findAll()
      .find((candidate) => candidate.id === line.productId);
    if (!product) {
      throw new BadRequestException(
        'Something you ordered is no longer on the menu.',
      );
    }

    const withModifiers = line.modifierIds.reduce((price, modifierId) => {
      const modifier = product.modifiers.find(
        (candidate) => candidate.id === modifierId,
      );
      if (!modifier) {
        throw new BadRequestException(
          `We could not find one of the options you chose for ${product.name}.`,
        );
      }
      return price + modifier.priceDelta;
    }, product.basePrice);

    return withModifiers * line.quantity;
  }

  // The mock charge: a card ending 0002 declines, everything else pays.
  private charge(cardNumber: string): void {
    if (cardNumber.endsWith('0002')) {
      throw new HttpException(
        'Your card was declined.',
        HttpStatus.PAYMENT_REQUIRED,
      );
    }
  }
}
