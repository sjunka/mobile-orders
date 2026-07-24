import { Module } from '@nestjs/common';

import { MenuModule } from '../menu/menu.module';
import { UtterancesController } from './utterances.controller';

@Module({
  imports: [MenuModule],
  controllers: [UtterancesController],
})
export class UtterancesModule {}
