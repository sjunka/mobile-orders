import {
  BadGatewayException,
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Express } from 'express';

import { MenuService } from '../menu/menu.service';
import { InterpreterService } from './interpreter.service';
import { TranscriptLog } from './transcript-log.service';
import { TranscriptionService } from './transcription.service';
import type { UtteranceResult } from './utterances.types';

@Controller('utterances')
export class UtterancesController {
  constructor(
    private readonly menuService: MenuService,
    private readonly transcriptionService: TranscriptionService,
    private readonly interpreterService: InterpreterService,
    private readonly transcriptLog: TranscriptLog,
  ) {}

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

    const transcript = await this.transcribe(file);
    this.transcriptLog.record(transcript);
    return this.interpret(transcript);
  }

  // Each stage fails on its own terms — a caught error here never leaks a
  // stack trace, and the route never returns a partial result.
  private async transcribe(file: Express.Multer.File): Promise<string> {
    try {
      return await this.transcriptionService.transcribe(
        file.buffer,
        file.originalname,
      );
    } catch {
      throw new BadGatewayException(
        'We could not understand that recording. Please try again or type your order.',
      );
    }
  }

  private async interpret(transcript: string): Promise<UtteranceResult> {
    try {
      return await this.interpreterService.interpret(
        transcript,
        this.menuService.findAll(),
      );
    } catch {
      throw new BadGatewayException(
        'We could not match that to the menu. Please try again or type your order.',
      );
    }
  }
}
