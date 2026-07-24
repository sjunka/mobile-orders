import type { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import type { App } from 'supertest/types';

import { AppModule } from '../src/app.module';

describe('/utterances', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
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
});
