import { Module } from '@nestjs/common';

import { MenuModule } from '../menu/menu.module';
import {
  ClaudeInterpreterService,
  InterpreterService,
} from './interpreter.service';
import { TranscriptLog } from './transcript-log.service';
import {
  OpenAiTranscriptionService,
  TranscriptionService,
} from './transcription.service';
import { UtterancesController } from './utterances.controller';

@Module({
  imports: [MenuModule],
  controllers: [UtterancesController],
  providers: [
    { provide: TranscriptionService, useClass: OpenAiTranscriptionService },
    { provide: InterpreterService, useClass: ClaudeInterpreterService },
    TranscriptLog,
  ],
})
export class UtterancesModule {}
