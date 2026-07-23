import { Controller, Get } from '@nestjs/common';

import { MenuService } from './menu.service';
import type { Menu } from './menu.types';

@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Get()
  findAll(): Menu {
    return this.menuService.findAll();
  }
}
