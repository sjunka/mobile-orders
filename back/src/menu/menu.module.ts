import { Module } from '@nestjs/common';

import { MenuController } from './menu.controller';
import { MenuService } from './menu.service';

@Module({
  controllers: [MenuController],
  providers: [MenuService],
  // Orders price their lines against the menu, so the service leaves the module.
  exports: [MenuService],
})
export class MenuModule {}
