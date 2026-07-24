import { Injectable } from '@nestjs/common';
import OpenAI, { toFile } from 'openai';

/** Stage 1: turns uploaded audio into a transcript. Swappable — see #45. */
export abstract class TranscriptionService {
  abstract transcribe(audio: Buffer, filename: string): Promise<string>;
}

@Injectable()
export class OpenAiTranscriptionService extends TranscriptionService {
  // Lazy: constructing this class must not require an API key — only calling
  // transcribe() does. Other test suites build the whole AppModule and never
  // exercise this provider.
  private client?: OpenAI;

  async transcribe(audio: Buffer, filename: string): Promise<string> {
    this.client ??= new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const response = await this.client.audio.transcriptions.create({
      file: await toFile(audio, filename),
      model: 'whisper-1',
    });
    return response.text;
  }
}
