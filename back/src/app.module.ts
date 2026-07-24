import { Module } from '@nestjs/common';

import { MenuModule } from './menu/menu.module';
import { OrdersModule } from './orders/orders.module';
import { UtterancesModule } from './utterances/utterances.module';

@Module({
  imports: [MenuModule, OrdersModule, UtterancesModule],
})
export class AppModule {}
