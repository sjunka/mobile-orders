import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';

import { OrdersService } from './orders.service';
import type { Order } from './orders.types';
import { parseCreateOrder } from './parse-create-order';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@Body() body: unknown): { orderId: string; total: number } {
    const { orderId, total } = this.ordersService.create(
      parseCreateOrder(body),
    );
    // The guest gets an id and the server's total — never the stored lines.
    return { orderId, total };
  }

  // For verifying what the server recorded. The app never calls this.
  @Get(':orderId')
  find(@Param('orderId') orderId: string): Omit<Order, 'guest'> {
    const order = this.ordersService.find(orderId);
    if (!order) {
      throw new NotFoundException('We could not find that order.');
    }
    // No caller identity (ADR-0001) and ids run in sequence, so the guest stays
    // out of the response — anyone could count their way to this route.
    return { orderId: order.orderId, total: order.total, lines: order.lines };
  }
}
