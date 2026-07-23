import { Body, Controller, Post } from '@nestjs/common';

import { OrdersService } from './orders.service';
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
}
