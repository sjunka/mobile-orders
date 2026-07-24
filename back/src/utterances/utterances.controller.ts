import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Express } from 'express';

import { MenuService } from '../menu/menu.service';
import { interpretUtterance } from './interpret-utterance';
import type { UtteranceResult } from './utterances.types';

@Controller('utterances')
export class UtterancesController {
  constructor(private readonly menuService: MenuService) {}

  @Post()
  @UseInterceptors(FileInterceptor('audio'))
  async create(
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<UtteranceResult> {
    if (!file) {
      throw new BadRequestException('An audio recording is required.');
    }
    if (!file.mimetype.startsWith('audio/')) {
      throw new BadRequestException('That file does not look like audio.');
    }

    return interpretUtterance(file.buffer, this.menuService.findAll());
  }
}
