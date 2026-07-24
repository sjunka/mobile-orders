import type { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import type { App } from 'supertest/types';

import { AppModule } from '../src/app.module';
import { OrdersService } from '../src/orders/orders.service';

const GUEST = {
  name: 'Ada Lovelace',
  email: 'ada@example.com',
  cardNumber: '4242424242424242',
};

const DECLINED_CARD = '4000000000000002';

describe('POST /orders', () => {
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

  function post(body: object) {
    return request(app.getHttpServer()).post('/orders').send(body);
  }

  it('prices a single plain line from the menu', async () => {
    const response = await post({
      ...GUEST,
      lines: [{ productId: 'fries', modifierIds: [], quantity: 1 }],
    }).expect(201);

    expect(response.body).toEqual({
      orderId: expect.any(String) as string,
      total: 400,
    });
  });

  it('prices modifiers and quantity into the line, and sums the lines', async () => {
    const response = await post({
      ...GUEST,
      lines: [
        // (950 + 100 + 200) × 2 = 2500
        {
          productId: 'burger',
          modifierIds: ['cheese', 'bacon'],
          quantity: 2,
        },
        // 300 × 3 = 900
        { productId: 'soda', modifierIds: [], quantity: 3 },
      ],
    }).expect(201);

    expect((response.body as { total: number }).total).toBe(3400);
  });

  it('declines a card ending 0002 and creates no order', async () => {
    const response = await post({
      ...GUEST,
      cardNumber: DECLINED_CARD,
      lines: [{ productId: 'fries', modifierIds: [], quantity: 1 }],
    }).expect(402);

    expect((response.body as { message: string }).message).toBe(
      'Your card was declined.',
    );
    expect(response.body).not.toHaveProperty('orderId');
  });

  it('refuses an unknown product', async () => {
    const response = await post({
      ...GUEST,
      lines: [{ productId: 'caviar', modifierIds: [], quantity: 1 }],
    }).expect(400);

    expect(typeof (response.body as { message: unknown }).message).toBe(
      'string',
    );
  });

  it('refuses an unknown modifier', async () => {
    await post({
      ...GUEST,
      lines: [{ productId: 'fries', modifierIds: ['truffle'], quantity: 1 }],
    }).expect(400);
  });

  it('refuses an order with no lines', async () => {
    await post({ ...GUEST, lines: [] }).expect(400);
  });

  it('refuses a quantity below one', async () => {
    await post({
      ...GUEST,
      lines: [{ productId: 'fries', modifierIds: [], quantity: 0 }],
    }).expect(400);
  });

  it('refuses an invalid email before charging the card', async () => {
    // The declined card would be a 402 if we ever got as far as the charge.
    await post({
      ...GUEST,
      email: 'not-an-email',
      cardNumber: DECLINED_CARD,
      lines: [{ productId: 'fries', modifierIds: [], quantity: 1 }],
    }).expect(400);
  });

  it('refuses a missing name', async () => {
    await post({
      ...GUEST,
      name: '   ',
      lines: [{ productId: 'fries', modifierIds: [], quantity: 1 }],
    }).expect(400);
  });

  it('answers every refusal with one readable sentence, never a list', async () => {
    const refusals = [
      { ...GUEST, lines: [] },
      { ...GUEST, email: 'nope', lines: [] },
      { ...GUEST, lines: [{ productId: 'caviar', quantity: 1 }] },
      {},
    ];

    for (const body of refusals) {
      const response = await post(body).expect(400);
      const { message } = response.body as { message: unknown };

      expect(typeof message).toBe('string');
      expect(message as string).toMatch(/\.$/);
    }
  });

  // The one assertion that steps off the HTTP seam: what a guest bought is
  // recorded, and nothing over HTTP can show that.
  it('records the order it created, with its guest, lines and total', async () => {
    const response = await post({
      ...GUEST,
      lines: [{ productId: 'fries', modifierIds: ['large'], quantity: 2 }],
    }).expect(201);

    const { orderId, total } = response.body as {
      orderId: string;
      total: number;
    };
    expect(total).toBe(1100);

    // Asked through the service, because how orders are stored is its business
    // and nobody else's.
    expect(app.get(OrdersService).find(orderId)).toEqual({
      orderId,
      guest: { name: GUEST.name, email: GUEST.email },
      total: 1100,
      lines: [{ productId: 'fries', modifierIds: ['large'], quantity: 2 }],
    });
  });
});
