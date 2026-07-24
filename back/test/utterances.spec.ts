import type { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import type { App } from 'supertest/types';

import { AppModule } from '../src/app.module';
import type { Menu } from '../src/menu/menu.types';
import { InterpreterService } from '../src/utterances/interpreter.service';
import { TranscriptionService } from '../src/utterances/transcription.service';
import type { UtteranceResult } from '../src/utterances/utterances.types';

const NUMBER_WORDS: Record<string, number> = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  ten: 10,
};

function parseQuantity(phrase: string): number {
  const digits = /\d+/.exec(phrase);
  if (digits) return parseInt(digits[0], 10);

  for (const [word, value] of Object.entries(NUMBER_WORDS)) {
    if (new RegExp(`\\b${word}\\b`).test(phrase)) return value;
  }
  return 1;
}

function splitPhrases(transcript: string): string[] {
  return transcript
    .split(/,| and /i)
    .map((phrase) => phrase.trim())
    .filter((phrase) => phrase.length > 0);
}

// Stands in for the real STT + Claude stages. The "audio" these tests send is
// plain text, not a real recording, so this reads it back as-is and matches
// phrases to the menu by substring — deterministic, and asserts contract
// shape only. Interpretation quality is not asserted here; see #45.
class StubTranscriptionService implements TranscriptionService {
  transcribe(audio: Buffer): Promise<string> {
    return Promise.resolve(audio.toString('utf8'));
  }
}

class StubInterpreterService implements InterpreterService {
  interpret(transcript: string, menu: Menu): Promise<UtteranceResult> {
    const phrases = splitPhrases(transcript);
    const result: UtteranceResult = { lines: [], unresolved: [] };

    for (const phrase of phrases) {
      const lower = phrase.toLowerCase();
      const product = menu.find((candidate) => lower.includes(candidate.id));
      if (!product) {
        result.unresolved.push(phrase);
        continue;
      }

      const modifierIds = product.modifiers
        .filter((modifier) => lower.includes(modifier.label.toLowerCase()))
        .map((modifier) => modifier.id);

      result.lines.push({
        productId: product.id,
        modifierIds,
        quantity: parseQuantity(lower),
      });
    }

    return Promise.resolve(result);
  }
}

async function buildApp(
  transcriptionService: TranscriptionService,
  interpreterService: InterpreterService,
): Promise<INestApplication<App>> {
  const moduleRef = await Test.createTestingModule({
    imports: [AppModule],
  })
    .overrideProvider(TranscriptionService)
    .useValue(transcriptionService)
    .overrideProvider(InterpreterService)
    .useValue(interpreterService)
    .compile();

  const app = moduleRef.createNestApplication();
  await app.init();
  return app;
}

describe('/utterances', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    app = await buildApp(
      new StubTranscriptionService(),
      new StubInterpreterService(),
    );
  });

  afterAll(async () => {
    await app.close();
  });

  function postAudio(transcript: string, contentType = 'audio/m4a') {
    return request(app.getHttpServer())
      .post('/utterances')
      .attach('audio', Buffer.from(transcript), {
        filename: 'utterance.m4a',
        contentType,
      });
  }

  it('matches the contract shape for a fully resolved utterance', async () => {
    const response = await postAudio('a burger with bacon, two fries').expect(
      201,
    );

    expect(response.body).toEqual({
      lines: [
        { productId: 'burger', modifierIds: ['bacon'], quantity: 1 },
        { productId: 'fries', modifierIds: [], quantity: 2 },
      ],
      unresolved: [],
    });
  });

  it('returns real menu ids, never a price, product, or modifier object', async () => {
    const response = await postAudio('a soda').expect(201);
    const body = response.body as Record<string, unknown>;

    expect(body).not.toHaveProperty('price');
    expect(body).not.toHaveProperty('product');
    expect(body).not.toHaveProperty('modifiers');
    expect((body.lines as { productId: string }[])[0].productId).toBe('soda');
  });

  it('reports a phrase it cannot match as unresolved, not an error', async () => {
    const response = await postAudio('a fries, something with chicken').expect(
      201,
    );

    expect(response.body).toEqual({
      lines: [{ productId: 'fries', modifierIds: [], quantity: 1 }],
      unresolved: ['something with chicken'],
    });
  });

  it('rejects a request with no file', async () => {
    const response = await request(app.getHttpServer())
      .post('/utterances')
      .expect(400);

    expect((response.body as { message: string }).message).toBe(
      'An audio recording is required.',
    );
  });

  it('rejects a non-audio file with a readable message', async () => {
    const response = await request(app.getHttpServer())
      .post('/utterances')
      .attach('audio', Buffer.from('not audio'), {
        filename: 'utterance.txt',
        contentType: 'text/plain',
      })
      .expect(400);

    expect((response.body as { message: string }).message).toBe(
      'That file does not look like audio.',
    );
  });

  it('turns a transcription failure into a readable error, never a stack trace', async () => {
    const failingApp = await buildApp(
      {
        transcribe: () => Promise.reject(new Error('speech-to-text is down')),
      },
      new StubInterpreterService(),
    );

    const response = await request(failingApp.getHttpServer())
      .post('/utterances')
      .attach('audio', Buffer.from('a burger'), {
        filename: 'utterance.m4a',
        contentType: 'audio/m4a',
      })
      .expect(502);

    expect(response.body).toEqual({
      statusCode: 502,
      error: 'Bad Gateway',
      message:
        'We could not understand that recording. Please try again or type your order.',
    });

    await failingApp.close();
  });

  it('turns a model failure into a readable error, never a partial response', async () => {
    const failingApp = await buildApp(new StubTranscriptionService(), {
      interpret: () => Promise.reject(new Error('the model call failed')),
    });

    const response = await request(failingApp.getHttpServer())
      .post('/utterances')
      .attach('audio', Buffer.from('a burger'), {
        filename: 'utterance.m4a',
        contentType: 'audio/m4a',
      })
      .expect(502);

    expect(response.body).toEqual({
      statusCode: 502,
      error: 'Bad Gateway',
      message:
        'We could not match that to the menu. Please try again or type your order.',
    });

    await failingApp.close();
  });
});
