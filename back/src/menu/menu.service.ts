import { Injectable } from '@nestjs/common';

import { menu } from '../mocks/menu.data';
import type { Menu } from './menu.types';

@Injectable()
export class MenuService {
  // ponytail: reads a module-level fixture. Swap the body for a repository call
  // when a database lands — callers see no change.
  findAll(): Menu {
    return menu;
  }
}
